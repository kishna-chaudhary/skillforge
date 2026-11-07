const express = require('express')

const {
  authenticate,
} = require('../middleware/auth')

const pool = require('../config/db')

const router = express.Router()

const mapSession = (row) => ({
  id: Number(row.id),

  title: row.title,
  description:
    row.description || '',

  status: row.status,

  scheduledDate:
    row.scheduled_date,

  startTime:
    row.start_time,

  endTime:
    row.end_time,

  startedAt:
    row.started_at,

  endedAt:
    row.ended_at,

  createdAt:
    row.created_at,

  careerRole: {
    id: Number(
      row.career_role_id
    ),
    slug:
      row.career_role_slug,
    title:
      row.career_role_title,
  },

  topic: {
    id: Number(row.topic_id),
    slug: row.topic_slug,
    title: row.topic_title,
  },

  createdBy: row.created_by
    ? {
        id: Number(
          row.created_by
        ),
        fullName:
          row.created_by_name,
      }
    : null,
})

const sessionSelect = `
  SELECT
    ls.id,
    ls.title,
    ls.description,
    ls.status,
    ls.scheduled_date,
    ls.start_time,
    ls.end_time,
    ls.started_at,
    ls.ended_at,
    ls.created_at,

    cr.id AS career_role_id,
    cr.slug AS career_role_slug,
    cr.title AS career_role_title,

    t.id AS topic_id,
    t.slug AS topic_slug,
    t.title AS topic_title,

    u.id AS created_by,
    u.full_name AS created_by_name

  FROM live_sessions ls

  INNER JOIN career_roles cr
    ON cr.id =
       ls.career_role_id

  INNER JOIN topics t
    ON t.id =
       ls.topic_id

  LEFT JOIN users u
    ON u.id =
       ls.created_by
`

/*
|--------------------------------------------------------------------------
| LIST LIVE SESSIONS
|--------------------------------------------------------------------------
|
| Employees and admins can both retrieve sessions.
|
| Draft/cancelled sessions are intentionally hidden from employees.
|--------------------------------------------------------------------------
*/

router.get(
  '/',
  authenticate,
  async (req, res) => {
    try {
      const isAdmin =
        req.user.role ===
        'admin'

      const result =
        await pool.query(
          `
            ${sessionSelect}

            ${
              isAdmin
                ? ''
                : `
                  WHERE
                    ls.status IN (
                      'scheduled',
                      'live',
                      'ended'
                    )
                `
            }

            ORDER BY
              CASE
                WHEN ls.status = 'live'
                  THEN 0
                WHEN ls.status = 'scheduled'
                  THEN 1
                WHEN ls.status = 'draft'
                  THEN 2
                ELSE 3
              END,
              ls.scheduled_date ASC,
              ls.start_time ASC,
              ls.id DESC
          `
        )

      return res.status(200).json({
        success: true,

        sessions:
          result.rows.map(
            mapSession
          ),
      })
    } catch (error) {
      console.error(
        'List live sessions error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve live sessions',
      })
    }
  }
)

/*
|--------------------------------------------------------------------------
| GET ONE LIVE SESSION
|--------------------------------------------------------------------------
*/

router.get(
  '/:sessionId',
  authenticate,
  async (req, res) => {
    const sessionId =
      Number(
        req.params.sessionId
      )

    if (
      !Number.isInteger(
        sessionId
      ) ||
      sessionId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid live session ID',
      })
    }

    try {
      const result =
        await pool.query(
          `
            ${sessionSelect}

            WHERE ls.id = $1

            LIMIT 1
          `,
          [sessionId]
        )

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Live session not found',
        })
      }

      const session =
        mapSession(
          result.rows[0]
        )

      if (
        req.user.role !==
          'admin' &&
        ![
          'scheduled',
          'live',
          'ended',
        ].includes(
          session.status
        )
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Live session not found',
        })
      }

      return res.status(200).json({
        success: true,
        session,
      })
    } catch (error) {
      console.error(
        'Get live session error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve live session',
      })
    }
  }
)

module.exports = router