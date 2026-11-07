
'use strict'

const express = require('express')
const fs = require('node:fs/promises')
const path = require('node:path')
const { createReadStream } = require('node:fs')

const pool = require('../config/db')
const {
  authenticate,
  requireRole,
} = require('../middleware/auth')

const router = express.Router()

const adminOnly = [
  authenticate,
  requireRole('admin'),
]

const STORAGE_ROOT = path.resolve(
  process.env.RECORDING_STORAGE_DIR ||
    path.join(process.cwd(), 'private-recordings')
)

const MAX_CHUNK_BYTES = 8 * 1024 * 1024
const MAX_FILE_BYTES = 1024 * 1024 * 1024
const MAX_SESSION_MINUTES = 240

const allowedMime = new Set([
  'video/webm',
  'video/mp4',
])

const validId = (value) =>
  /^\d+$/.test(String(value)) &&
  BigInt(value) > 0n

function fileFor(sessionId, type) {
  return path.join(
    STORAGE_ROOT,
    String(sessionId),
    `${type}.video`
  )
}

function handleError(res, error, label) {
  console.error(label, error)

  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      message: 'Recording service error',
    })
  }
}

// ==================================================
// START RECORDING SESSION
// ==================================================

router.post(
  '/sessions',
  authenticate,
  async (req, res) => {
    const {
      roleSlug,
      topicSlug,
      mimeTypes,
      consent,
    } = req.body || {}

    if (
      consent !== true ||
      !roleSlug ||
      !topicSlug ||
      !mimeTypes ||
      !allowedMime.has(mimeTypes.camera) ||
      !allowedMime.has(mimeTypes.screen)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Consent, assessment and supported recording MIME types are required',
      })
    }

    try {
      const assessment = await pool.query(
        `
          SELECT a.id
          FROM assessments a
          JOIN topics t
            ON t.id = a.topic_id
          JOIN career_roles cr
            ON cr.id = t.career_role_id
          WHERE cr.slug = $1
            AND t.slug = $2
            AND a.is_active = TRUE
            AND t.is_active = TRUE
            AND cr.is_active = TRUE
          LIMIT 1
        `,
        [roleSlug, topicSlug]
      )

      if (!assessment.rowCount) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found',
        })
      }

      const client = await pool.connect()

      try {
        await client.query('BEGIN')

        const session = await client.query(
          `
            INSERT INTO assessment_recording_sessions (
              user_id,
              assessment_id,
              consent_given_at
            )
            VALUES ($1, $2, NOW())
            RETURNING id
          `,
          [
            req.user.userId,
            assessment.rows[0].id,
          ]
        )

        const sessionId = session.rows[0].id

        for (const type of ['camera', 'screen']) {
          await client.query(
            `
              INSERT INTO assessment_recordings (
               session_id,
               user_id,
               recording_type,
               mime_type,
               file_path
              )
              VALUES ($1, $2, $3, $4, $5)
            `,
            [
              sessionId,
              req.user.userId,
              type,
              mimeTypes[type],
              fileFor(sessionId, type),
            ]
          )
        }

        await fs.mkdir(
          path.join(STORAGE_ROOT, String(sessionId)),
          {
            recursive: true,
            mode: 0o700,
          }
        )

        await client.query('COMMIT')

        return res.status(201).json({
          success: true,
          sessionId: String(sessionId),
        })
      } catch (error) {
        await client.query('ROLLBACK')
        throw error
      } finally {
        client.release()
      }
    } catch (error) {
      handleError(res, error, 'Start recording session:')
    }
  }
)

// ==================================================
// UPLOAD VIDEO CHUNKS
// ==================================================

router.put(
  '/sessions/:sessionId/:type/chunks',
  authenticate,
  express.raw({
    type: 'application/octet-stream',
    limit: MAX_CHUNK_BYTES,
  }),
  async (req, res) => {
    const { sessionId, type } = req.params
    const index = Number(req.query.index)

    if (
      !validId(sessionId) ||
      !['camera', 'screen'].includes(type) ||
      !Number.isSafeInteger(index) ||
      index < 0 ||
      !Buffer.isBuffer(req.body) ||
      !req.body.length ||
      req.body.length > MAX_CHUNK_BYTES
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid chunk',
      })
    }

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      const found = await client.query(
        `
          SELECT
            r.id,
            r.next_chunk_index,
            r.file_size_bytes,
            r.status,
            s.started_at,
            s.status AS session_status
          FROM assessment_recordings r
          JOIN assessment_recording_sessions s
            ON s.id = r.session_id
          WHERE r.session_id = $1
            AND r.recording_type = $2
            AND s.user_id = $3
          FOR UPDATE OF r
        `,
        [
          sessionId,
          type,
          req.user.userId,
        ]
      )

      if (!found.rowCount) {
        await client.query('ROLLBACK')

        return res.status(404).json({
          success: false,
          message: 'Recording not found',
        })
      }

      const row = found.rows[0]

      if (
        row.status !== 'uploading' ||
        !['recording', 'uploading'].includes(
          row.session_status
        ) ||
        Date.now() -
          new Date(row.started_at).getTime() >
          MAX_SESSION_MINUTES * 60000
      ) {
        await client.query('ROLLBACK')

        return res.status(409).json({
          success: false,
          message:
            'Recording is no longer accepting chunks',
        })
      }

      const expected = Number(row.next_chunk_index)

      if (index !== expected) {
        await client.query('ROLLBACK')

        return res.status(409).json({
          success: false,
          message: 'Unexpected chunk index',
          expectedIndex: expected,
        })
      }

      const currentSize = Number(row.file_size_bytes)

      if (
        currentSize + req.body.length >
        MAX_FILE_BYTES
      ) {
        await client.query('ROLLBACK')

        return res.status(413).json({
          success: false,
          message: 'Recording exceeds size limit',
        })
      }

      const file = fileFor(sessionId, type)

      await fs.mkdir(path.dirname(file), {
        recursive: true,
        mode: 0o700,
      })

      const existing = await fs
        .stat(file)
        .catch((error) =>
          error.code === 'ENOENT'
            ? { size: 0 }
            : Promise.reject(error)
        )

      if (existing.size !== currentSize) {
        await client.query('ROLLBACK')

        return res.status(409).json({
          success: false,
          message:
            'Recording storage needs administrator recovery',
        })
      }

      await fs.appendFile(file, req.body, {
        mode: 0o600,
      })

      await client.query(
        `
          UPDATE assessment_recordings
          SET
            next_chunk_index = next_chunk_index + 1,
            file_size_bytes = file_size_bytes + $1
          WHERE id = $2
        `,
        [
          req.body.length,
          row.id,
        ]
      )

      await client.query('COMMIT')

      return res.json({
        success: true,
        nextIndex: expected + 1,
      })
    } catch (error) {
      await client.query('ROLLBACK').catch(() => {})

      handleError(res, error, 'Upload recording chunk:')
    } finally {
      client.release()
    }
  }
)

// ==================================================
// COMPLETE ONE RECORDING
// ==================================================

router.post(
  '/sessions/:sessionId/:type/complete',
  authenticate,
  async (req, res) => {
    const { sessionId, type } = req.params

    if (
      !validId(sessionId) ||
      !['camera', 'screen'].includes(type)
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid recording',
      })
    }

    try {
      const result = await pool.query(
        `
          UPDATE assessment_recordings r
          SET
            status = 'completed',
            completed_at = NOW()
          FROM assessment_recording_sessions s
          WHERE r.session_id = s.id
            AND s.id = $1
            AND s.user_id = $2
            AND r.recording_type = $3
            AND r.status = 'uploading'
            AND r.file_size_bytes > 0
          RETURNING r.id
        `,
        [
          sessionId,
          req.user.userId,
          type,
        ]
      )

      if (!result.rowCount) {
        return res.status(409).json({
          success: false,
          message:
            'Recording not found, empty, or already finalized',
        })
      }

      return res.json({
        success: true,
      })
    } catch (error) {
      handleError(res, error, 'Complete recording:')
    }
  }
)

// ==================================================
// LINK RECORDINGS TO SUBMITTED QUIZ ATTEMPT
// ==================================================


router.post(
  '/sessions/:sessionId/link-attempt',
  authenticate,
  async (req, res) => {
    const { sessionId } = req.params
    const { attemptId } = req.body || {}

    if (!validId(sessionId) || !validId(attemptId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid session or attempt ID',
      })
    }

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      // Verify that the attempt belongs to this employee
      // and is for the same assessment as the recording.
      const result = await client.query(
        `
          SELECT
            s.id AS session_id,
            s.attempt_id AS linked_attempt_id,
            aa.passed
          FROM assessment_recording_sessions s
          JOIN assessment_attempts aa
            ON aa.id = $2
           AND aa.user_id = s.user_id
           AND aa.assessment_id = s.assessment_id
          WHERE s.id = $1
            AND s.user_id = $3
          FOR UPDATE OF s
        `,
        [
          sessionId,
          attemptId,
          req.user.userId,
        ]
      )

      if (!result.rowCount) {
        await client.query('ROLLBACK')

        return res.status(404).json({
          success: false,
          message:
            'Recording session or matching quiz attempt not found',
        })
      }

      const session = result.rows[0]

      if (session.linked_attempt_id !== null) {
        await client.query('ROLLBACK')

        return res.status(409).json({
          success: false,
          message: 'Recording session is already linked',
        })
      }

      // FAILED QUIZ: Remove recording database entries.
      if (session.passed !== true) {
        await client.query(
          `
            DELETE FROM assessment_recording_sessions
            WHERE id = $1
          `,
          [sessionId]
        )

        await client.query('COMMIT')

        // Remove the private video files after committing.
        // If deletion fails, log it for server cleanup.
        try {
          await fs.rm(
            path.join(STORAGE_ROOT, String(sessionId)),
            {
              recursive: true,
              force: true,
            }
          )
        } catch (fileError) {
          console.error(
            'Failed to delete failed-attempt video files:',
            fileError
          )
        }

        return res.json({
          success: true,
          passed: false,
          recordingsSaved: false,
          message:
            'Quiz not passed. Recordings have been scheduled for removal.',
        })
      }

      // PASSED QUIZ: Keep both recordings and link attempt.
      const update = await client.query(
        `
          UPDATE assessment_recording_sessions s
          SET
            attempt_id = $2,
            status = CASE
              WHEN (
                SELECT COUNT(*)
                FROM assessment_recordings r
                WHERE r.session_id = s.id
                  AND r.status = 'completed'
              ) = 2
              THEN 'completed'
              ELSE 'interrupted'
            END,
            completed_at = NOW()
          WHERE s.id = $1
          RETURNING s.id, s.status
        `,
        [sessionId, attemptId]
      )

      await client.query('COMMIT')

      return res.json({
        success: true,
        passed: true,
        recordingsSaved: true,
        status: update.rows[0].status,
        message: 'Passed quiz recordings retained',
      })
    } catch (error) {
      await client.query('ROLLBACK').catch(() => {})

      handleError(
        res,
        error,
        'Link attempt and apply recording retention:'
      )
    } finally {
      client.release()
    }
  }
)


// ==================================================
// ADMIN: LIST RECORDING SESSIONS
// ==================================================

router.get(
  '/admin/sessions',
  ...adminOnly,
  async (req, res) => {
    const limit = Math.min(
      100,
      Math.max(1, Number(req.query.limit) || 30)
    )

    const offset = Math.max(
      0,
      Number(req.query.offset) || 0
    )

    if (!Number.isSafeInteger(offset)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid offset',
      })
    }

    try {
      const result = await pool.query(
        `
          SELECT
            s.id,
            s.status,
            s.started_at,
            s.completed_at,
            s.attempt_id,
            u.full_name AS employee_name,
            u.email AS employee_email,
            a.title AS assessment_title,
            aa.score,
            aa.passed,

            COALESCE(aa.integrity_event_count, 0) AS integrity_event_count,

            COALESCE(
              json_agg(
                json_build_object(
                  'id', r.id,
                  'type', r.recording_type,
                  'status', r.status,
                  'bytes', r.file_size_bytes,
                  'mimeType', r.mime_type,
                  'reviewStatus', r.review_status,
                  'reviewNotes', r.review_notes
                )
                ORDER BY r.recording_type
              ) FILTER (
                WHERE r.id IS NOT NULL
              ),
              '[]'::json
            ) AS recordings

          FROM assessment_recording_sessions s

          JOIN users u
            ON u.id = s.user_id

          JOIN assessments a
            ON a.id = s.assessment_id

          LEFT JOIN assessment_attempts aa
            ON aa.id = s.attempt_id

          LEFT JOIN assessment_recordings r
            ON r.session_id = s.id

          WHERE aa.passed IS TRUE

          GROUP BY
            s.id,
            u.id,
            a.id,
            aa.id

          ORDER BY
            s.started_at DESC,
            s.id DESC

          LIMIT $1 OFFSET $2
        `,
        [limit, offset]
      )

      return res.json({
        success: true,
        sessions: result.rows,
      })
    } catch (error) {
      handleError(res, error, 'List recording sessions:')
    }
  }
)

// ==================================================
// ADMIN: STREAM RECORDING VIDEO
// ==================================================

router.get(
  '/admin/recordings/:recordingId/video',
  ...adminOnly,
  async (req, res) => {
    if (!validId(req.params.recordingId)) {
      return res.status(400).end()
    }

    try {
      const result = await pool.query(
        `
          SELECT
            r.id,
            r.session_id,
            r.recording_type,
            r.mime_type,
            r.file_size_bytes,
            r.status
         FROM assessment_recordings r
         JOIN assessment_recording_sessions s
           ON s.id = r.session_id
         JOIN assessment_attempts aa
           ON aa.id = s.attempt_id
         WHERE r.id = $1
           AND aa.passed IS TRUE
           AND r.status = 'completed'
        `,
        [req.params.recordingId]
      )

      if (
        !result.rowCount ||
        !Number(result.rows[0].file_size_bytes)
      ) {
        return res.status(404).end()
      }

      const recording = result.rows[0]

      const file = fileFor(
        recording.session_id,
        recording.recording_type
      )

      const stats = await fs.stat(file).catch(() => null)

      if (
        !stats ||
        stats.size !== Number(recording.file_size_bytes)
      ) {
        return res.status(404).end()
      }

      const size = stats.size

      res.set({
        'Content-Type': recording.mime_type,
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'private, no-store',
        'X-Content-Type-Options': 'nosniff',
        'Content-Disposition': 'inline',
      })

      const range = req.headers.range

      if (range) {
        const match = /^bytes=(\d*)-(\d*)$/.exec(range)

        if (!match) {
          return res
            .status(416)
            .set('Content-Range', `bytes */${size}`)
            .end()
        }

        let start = match[1] ? Number(match[1]) : 0

        let end = match[2]
          ? Number(match[2])
          : size - 1

        if (!match[1] && match[2]) {
          start = Math.max(
            0,
            size - Number(match[2])
          )

          end = size - 1
        }

        if (
          !Number.isSafeInteger(start) ||
          !Number.isSafeInteger(end) ||
          start > end ||
          start >= size
        ) {
          return res
            .status(416)
            .set('Content-Range', `bytes */${size}`)
            .end()
        }

        end = Math.min(end, size - 1)

        res.status(206).set({
          'Content-Range':
            `bytes ${start}-${end}/${size}`,
          'Content-Length': end - start + 1,
        })

        return createReadStream(file, {
          start,
          end,
        })
          .on('error', () => res.destroy())
          .pipe(res)
      }

      res.set('Content-Length', size)

      return createReadStream(file)
        .on('error', () => res.destroy())
        .pipe(res)
    } catch (error) {
      handleError(res, error, 'Stream recording:')
    }
  }
)

// ==================================================
// ADMIN: REVIEW OR FLAG RECORDING
// ==================================================

router.patch(
  '/admin/recordings/:recordingId/review',
  ...adminOnly,
  async (req, res) => {
    const {
      reviewStatus,
      reviewNotes = '',
    } = req.body || {}

    if (
      !validId(req.params.recordingId) ||
      !['pending', 'reviewed', 'flagged'].includes(
        reviewStatus
      ) ||
      typeof reviewNotes !== 'string' ||
      reviewNotes.length > 5000
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review',
      })
    }

    try {
      const result = await pool.query(
        `
          UPDATE assessment_recordings
          SET
            review_status = $1,
            review_notes = $2,
            reviewed_by = CASE
              WHEN $1 = 'pending'
              THEN NULL
              ELSE $3
            END,
            reviewed_at = CASE
              WHEN $1 = 'pending'
              THEN NULL
              ELSE NOW()
            END
          WHERE id = $4
          RETURNING
            id,
            review_status,
            review_notes,
            reviewed_at
        `,
        [
          reviewStatus,
          reviewNotes,
          req.user.userId,
          req.params.recordingId,
        ]
      )

      if (!result.rowCount) {
        return res.status(404).json({
          success: false,
          message: 'Recording not found',
        })
      }

      return res.json({
        success: true,
        recording: result.rows[0],
      })
    } catch (error) {
      handleError(res, error, 'Review recording:')
    }
  }
)

module.exports = router
