const express = require('express')
const pool = require('../config/db')

const router = express.Router()

// ============================================================
// GET /api/career-roles
// Return all active career roles.
// ============================================================

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        id,
        slug,
        title,
        description,
        created_at,
        updated_at
      FROM career_roles
      WHERE is_active = true
      ORDER BY id ASC
    `)

    return res.status(200).json({
      success: true,
      roles: result.rows,
    })
  } catch (error) {
    console.error(
      'Failed to fetch career roles:',
      error
    )

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch career roles',
    })
  }
})

// ============================================================
// GET /api/career-roles/:roleSlug/topics/:topicSlug/lessons
// Return all active lessons for one topic.
// ============================================================

router.get(
  '/:roleSlug/topics/:topicSlug/lessons',
  async (req, res) => {
    const {
      roleSlug,
      topicSlug,
    } = req.params

    try {
      // --------------------------------------------------------
      // Find the requested active role and active topic.
      // --------------------------------------------------------

      const topicResult = await pool.query(
        `
          SELECT
            t.id,
            t.slug,
            t.title,
            t.description,
            t.duration,
            t.position,

            cr.id AS role_id,
            cr.slug AS role_slug,
            cr.title AS role_title,
            cr.description AS role_description

          FROM topics t

          INNER JOIN career_roles cr
            ON cr.id = t.career_role_id

          WHERE cr.slug = $1
            AND t.slug = $2
            AND cr.is_active = true
            AND t.is_active = true

          LIMIT 1
        `,
        [
          roleSlug,
          topicSlug,
        ]
      )

      if (
        topicResult.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message: 'Topic not found',
        })
      }

      const topic =
        topicResult.rows[0]

      // --------------------------------------------------------
      // Fetch all active lessons for the topic.
      // --------------------------------------------------------

      const lessonsResult = await pool.query(
        `
          SELECT
            id,
            title,
            description,
            content,
            resources,
            position,
            estimated_minutes,
            created_at,
            updated_at

          FROM lessons

          WHERE topic_id = $1
            AND is_active = true

          ORDER BY
            position ASC,
            id ASC
        `,
        [topic.id]
      )

      // --------------------------------------------------------
      // Convert database lesson data into the structure expected
      // by the frontend.
      //
      // content is currently stored as JSON text.
      // resources is JSONB and pg normally parses it for us.
      // --------------------------------------------------------

      const lessons =
        lessonsResult.rows.map(
          (lesson) => {
            let content = []

            if (lesson.content) {
              try {
                const parsedContent =
                  JSON.parse(
                    lesson.content
                  )

                if (
                  Array.isArray(
                    parsedContent
                  )
                ) {
                  content =
                    parsedContent
                } else {
                  content = [
                    String(
                      parsedContent
                    ),
                  ]
                }
              } catch {
                content = [
                  lesson.content,
                ]
              }
            }

            const resources =
              Array.isArray(
                lesson.resources
              )
                ? lesson.resources
                : []

            return {
              id:
                lesson.id,

              title:
                lesson.title,

              description:
                lesson.description ?? '',

              content,

              resources,

              position:
                lesson.position,

              estimatedMinutes:
                lesson.estimated_minutes,

              createdAt:
                lesson.created_at,

              updatedAt:
                lesson.updated_at,
            }
          }
        )

      return res.status(200).json({
        success: true,

        role: {
          id:
            topic.role_id,

          slug:
            topic.role_slug,

          title:
            topic.role_title,

          description:
            topic.role_description,
        },

        topic: {
          id:
            topic.id,

          slug:
            topic.slug,

          title:
            topic.title,

          description:
            topic.description,

          duration:
            topic.duration,

          position:
            topic.position,
        },

        lessons,
      })
    } catch (error) {
      console.error(
        'Failed to fetch topic lessons:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Failed to fetch topic lessons',
      })
    }
  }
)

// ============================================================
// GET /api/career-roles/:slug/topics
// Return all active topics for one active career role.
//
// Each topic also includes lessonCount, calculated directly
// from the active lessons stored in PostgreSQL.
// ============================================================

router.get(
  '/:slug/topics',
  async (req, res) => {
    const {
      slug,
    } = req.params

    try {
      // --------------------------------------------------------
      // Find the requested career role.
      // --------------------------------------------------------

      const roleResult =
        await pool.query(
          `
            SELECT
              id,
              slug,
              title,
              description

            FROM career_roles

            WHERE slug = $1
              AND is_active = true

            LIMIT 1
          `,
          [slug]
        )

      if (
        roleResult.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Career role not found',
        })
      }

      const role =
        roleResult.rows[0]

      // --------------------------------------------------------
      // Fetch topics and count their active lessons.
      //
      // LEFT JOIN is intentional:
      // a topic with zero lessons must still be returned.
      // --------------------------------------------------------

      const topicsResult =
        await pool.query(
          `
            SELECT
              t.id,
              t.slug,
              t.title,
              t.description,
              t.duration,
              t.position,

              COUNT(l.id)::int
                AS lesson_count

            FROM topics t

            LEFT JOIN lessons l
              ON l.topic_id = t.id
              AND l.is_active = true

            WHERE t.career_role_id = $1
              AND t.is_active = true

            GROUP BY
              t.id,
              t.slug,
              t.title,
              t.description,
              t.duration,
              t.position

            ORDER BY
              t.position ASC,
              t.id ASC
          `,
          [role.id]
        )

      // --------------------------------------------------------
      // Convert snake_case database field to camelCase API field.
      // --------------------------------------------------------

      const topics =
        topicsResult.rows.map(
          (topic) => ({
            id:
              topic.id,

            slug:
              topic.slug,

            title:
              topic.title,

            description:
              topic.description,

            duration:
              topic.duration,

            position:
              topic.position,

            lessonCount:
              topic.lesson_count,
          })
        )

      return res.status(200).json({
        success: true,
        role,
        topics,
      })
    } catch (error) {
      console.error(
        'Failed to fetch career role topics:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Failed to fetch career role topics',
      })
    }
  }
)

// ============================================================
// GET /api/career-roles/:slug
// Return one active career role by slug.
//
// IMPORTANT:
// Keep this route AFTER the more specific routes above.
// ============================================================

router.get(
  '/:slug',
  async (req, res) => {
    const {
      slug,
    } = req.params

    try {
      const result =
        await pool.query(
          `
            SELECT
              id,
              slug,
              title,
              description,
              created_at,
              updated_at

            FROM career_roles

            WHERE slug = $1
              AND is_active = true

            LIMIT 1
          `,
          [slug]
        )

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Career role not found',
        })
      }

      return res.status(200).json({
        success: true,
        role:
          result.rows[0],
      })
    } catch (error) {
      console.error(
        'Failed to fetch career role:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Failed to fetch career role',
      })
    }
  }
)

module.exports = router