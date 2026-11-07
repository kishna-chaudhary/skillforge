const express = require('express')

const pool = require('../config/db')

const {
  authenticate,
} = require('../middleware/auth')

const router = express.Router()

// ============================================================
// GET CURRENT USER PROGRESS
// ============================================================

router.get(
  '/',
  authenticate,
  async (req, res) => {
    try {
      const userId =
        req.user.userId

      const completedTopicsResult =
        await pool.query(
          `
            SELECT DISTINCT
              cr.slug AS role_slug,
              t.slug AS topic_slug

            FROM assessment_attempts aa

            INNER JOIN assessments a
              ON a.id = aa.assessment_id

            INNER JOIN topics t
              ON t.id = a.topic_id

            INNER JOIN career_roles cr
              ON cr.id = t.career_role_id

            WHERE aa.user_id = $1
              AND aa.passed = TRUE
              AND a.is_active = TRUE
              AND t.is_active = TRUE
              AND cr.is_active = TRUE

            ORDER BY
              cr.slug,
              t.slug
          `,
          [userId]
        )

      const completedTopics =
        completedTopicsResult.rows.map(
          (row) =>
            `${row.role_slug}/${row.topic_slug}`
        )

      return res.json({
        success: true,
        completedTopics,
      })
    } catch (error) {
      console.error(
        'Failed to load progress:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,
          message:
            'Failed to load progress.',
        })
    }
  }
)

// ============================================================
// GET CURRENT USER DASHBOARD LESSON PROGRESS
// ============================================================

router.get(
  '/dashboard-lessons',
  authenticate,
  async (req, res) => {
    try {
      const userId = req.user.userId

      const result = await pool.query(
        `
          SELECT
            cr.slug AS role_slug,
            t.slug AS topic_slug,
            l.id AS lesson_id

          FROM lesson_progress lp

          INNER JOIN lessons l
            ON l.id = lp.lesson_id

          INNER JOIN topics t
            ON t.id = l.topic_id

          INNER JOIN career_roles cr
            ON cr.id = t.career_role_id

          WHERE lp.user_id = $1
            AND l.is_active = TRUE
            AND t.is_active = TRUE
            AND cr.is_active = TRUE

          ORDER BY
            cr.slug,
            t.slug,
            l.position
        `,
        [userId]
      )

      const completedLessons = result.rows.map(
        (row) => ({
          roleId: row.role_slug,
          topicId: row.topic_slug,
          lessonId: Number(row.lesson_id),
        })
      )

      return res.json({
        success: true,
        completedLessons,
      })
    } catch (error) {
      console.error(
        'Failed to load dashboard lesson progress:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Failed to load dashboard lesson progress.',
      })
    }
  }
)

// ============================================================
// GET CURRENT USER CERTIFICATE / ROLE COMPLETION PROGRESS
// ============================================================
//
// A career certificate is earned only when:
//
// 1. Every active topic has a passing assessment attempt.
// 2. The role's active practical challenge has a completed,
//    passing practical challenge attempt.
//
// PostgreSQL is the source of truth.
// ============================================================

router.get(
  '/certificates',
  authenticate,
  async (req, res) => {
    try {
      const userId =
        req.user.userId

      const result =
        await pool.query(
          `
            SELECT
              cr.id AS role_database_id,
              cr.slug AS role_id,
              cr.title AS role_title,

              COUNT(
                DISTINCT t.id
              )::int AS total_topics,

              COUNT(
                DISTINCT CASE
                  WHEN EXISTS (
                    SELECT 1

                    FROM assessment_attempts aa

                    INNER JOIN assessments a
                      ON a.id =
                         aa.assessment_id

                    WHERE aa.user_id = $1
                      AND aa.passed = TRUE
                      AND a.topic_id =
                          t.id
                      AND a.is_active =
                          TRUE
                  )
                  THEN t.id
                END
              )::int AS completed_topics,

              EXISTS (
                SELECT 1

                FROM practical_challenges pc

                INNER JOIN practical_challenge_attempts pca
                  ON pca.practical_challenge_id =
                     pc.id

                WHERE pc.career_role_id =
                      cr.id
                  AND pc.is_active =
                      TRUE
                  AND pca.user_id =
                      $1
                  AND pca.passed =
                      TRUE
                  AND pca.execution_status =
                      'completed'
              ) AS practical_passed

            FROM career_roles cr

            LEFT JOIN topics t
              ON t.career_role_id =
                 cr.id
             AND t.is_active =
                 TRUE

            WHERE cr.is_active =
                  TRUE

            GROUP BY
              cr.id,
              cr.slug,
              cr.title

            ORDER BY
              cr.id ASC
          `,
          [userId]
        )

      const certificates =
        result.rows.map(
          (row) => {
            const totalTopics =
              Number(
                row.total_topics
              )

            const completedTopics =
              Number(
                row.completed_topics
              )

            const remainingTopics =
              Math.max(
                totalTopics -
                  completedTopics,
                0
              )

            const topicPercentage =
              totalTopics > 0
                ? Math.round(
                    (
                      completedTopics /
                      totalTopics
                    ) * 100
                  )
                : 0

            const allTopicsCompleted =
              totalTopics > 0 &&
              completedTopics ===
                totalTopics

            const practicalPassed =
              row.practical_passed ===
              true

            const earned =
              allTopicsCompleted &&
              practicalPassed

            return {
              roleId:
                row.role_id,

              roleTitle:
                row.role_title,

              totalTopics,

              completedTopics,

              remainingTopics,

              topicPercentage,

              allTopicsCompleted,

              practicalPassed,

              earned,
            }
          }
        )

      const earnedCount =
        certificates.filter(
          (certificate) =>
            certificate.earned
        ).length

      const completedRoleIds =
        certificates
          .filter(
            (certificate) =>
              certificate.earned
          )
          .map(
            (certificate) =>
              certificate.roleId
          )

      return res.json({
        success: true,
        certificates,
        earnedCount,
        completedRoleIds,
      })
    } catch (error) {
      console.error(
        'Failed to load certificate progress:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,
          message:
            'Failed to load certificate progress.',
        })
    }
  }
)

// ============================================================
// GET COMPLETED LESSONS FOR ONE TOPIC
// ============================================================

router.get(
  '/lessons/:roleSlug/:topicSlug',
  authenticate,
  async (req, res) => {
    try {
      const userId =
        req.user.userId

      const {
        roleSlug,
        topicSlug,
      } = req.params

      const result =
        await pool.query(
          `
            SELECT
              l.id,
              l.position,
              lp.completed_at

            FROM lesson_progress lp

            INNER JOIN lessons l
              ON l.id =
                 lp.lesson_id

            INNER JOIN topics t
              ON t.id =
                 l.topic_id

            INNER JOIN career_roles cr
              ON cr.id =
                 t.career_role_id

            WHERE lp.user_id = $1
              AND cr.slug = $2
              AND t.slug = $3
              AND cr.is_active =
                  TRUE
              AND t.is_active =
                  TRUE
              AND l.is_active =
                  TRUE

            ORDER BY
              l.position ASC
          `,
          [
            userId,
            roleSlug,
            topicSlug,
          ]
        )

      const completedLessons =
  result.rows.map(
    (row) =>
      Number(
        row.id
      )
  )

      return res.json({
        success: true,
        completedLessons,
      })
    } catch (error) {
      console.error(
        'Failed to load lesson progress:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,
          message:
            'Failed to load lesson progress.',
        })
    }
  }
)

// ============================================================
// MARK ONE LESSON COMPLETE
// ============================================================

router.post(
  '/lessons/:lessonId/complete',
  authenticate,
  async (req, res) => {
    try {
      const userId =
        req.user.userId

      const lessonId =
        Number(
          req.params.lessonId
        )

      if (
        !Number.isInteger(
          lessonId
        ) ||
        lessonId <= 0
      ) {
        return res
          .status(400)
          .json({
            success: false,
            message:
              'Invalid lesson ID.',
          })
      }

      const lessonResult =
        await pool.query(
          `
            SELECT
              id

            FROM lessons

            WHERE id = $1
              AND is_active =
                  TRUE
          `,
          [lessonId]
        )

      if (
        lessonResult.rowCount ===
        0
      ) {
        return res
          .status(404)
          .json({
            success: false,
            message:
              'Lesson not found.',
          })
      }

      await pool.query(
        `
          INSERT INTO lesson_progress (
            user_id,
            lesson_id
          )

          VALUES (
            $1,
            $2
          )

          ON CONFLICT (
            user_id,
            lesson_id
          )

          DO NOTHING
        `,
        [
          userId,
          lessonId,
        ]
      )

      return res.json({
        success: true,
        lessonId,
        completed: true,
      })
    } catch (error) {
      console.error(
        'Failed to complete lesson:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,
          message:
            'Failed to complete lesson.',
        })
    }
  }
)

module.exports = router