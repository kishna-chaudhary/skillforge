const express = require('express')
const bcrypt = require('bcryptjs')

const {
  authenticate,
  requireRole,
} = require('../middleware/auth')

const pool = require('../config/db')

const router = express.Router()

const adminOnly = [
  authenticate,
  requireRole('admin'),
]

const normalizeEmail = (email) => {
  return String(email || '')
    .trim()
    .toLowerCase()
}

/*
|--------------------------------------------------------------------------
| ADMIN AUTH TEST
|--------------------------------------------------------------------------
*/

router.get(
  '/test',
  ...adminOnly,
  (req, res) => {
    return res.status(200).json({
      success: true,
      message:
        'Admin authorization successful',
    })
  }
)

/*
|--------------------------------------------------------------------------
| GET EMPLOYEES
|--------------------------------------------------------------------------
*/

router.get(
  '/employees',
  ...adminOnly,
  async (req, res) => {
    try {
      const result =
        await pool.query(
          `
            SELECT
              id,
              full_name,
              email,
              role,
              is_active,
              created_at
            FROM users
            WHERE role = 'employee'
            ORDER BY created_at DESC, id DESC
          `
        )

      const employees =
        result.rows.map((user) => ({
          id: user.id,
          fullName: user.full_name,
          email: user.email,
          role: user.role,
          isActive: user.is_active,
          createdAt: user.created_at,
        }))

      return res.status(200).json({
        success: true,
        employees,
        count: employees.length,
      })
    } catch (error) {
      console.error(
        'Admin employee list error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve employees',
      })
    }
  }
)

/*
|--------------------------------------------------------------------------
| CREATE EMPLOYEE
|--------------------------------------------------------------------------
*/

router.post(
  '/employees',
  ...adminOnly,
  async (req, res) => {
    const {
      fullName,
      email,
      password,
    } = req.body

    if (
      !fullName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Full name, email and password are required',
      })
    }

    const cleanName =
      String(fullName).trim()

    const cleanEmail =
      normalizeEmail(email)

    if (cleanName.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          'Full name must contain at least 2 characters',
      })
    }

    if (
      !cleanEmail.includes('@')
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Please provide a valid email address',
      })
    }

    if (
      typeof password !==
        'string' ||
      password.length < 8
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Password must contain at least 8 characters',
      })
    }

    try {
      const existingUser =
        await pool.query(
          `
            SELECT id
            FROM users
            WHERE LOWER(email) = $1
            LIMIT 1
          `,
          [cleanEmail]
        )

      if (
        existingUser.rows.length >
        0
      ) {
        return res.status(409).json({
          success: false,
          message:
            'An account with this email already exists',
        })
      }

      const passwordHash =
        await bcrypt.hash(
          password,
          12
        )

      /*
       * Admin-created accounts are
       * always employees.
       *
       * Never accept role from req.body.
       */
      const result =
        await pool.query(
          `
            INSERT INTO users (
              full_name,
              email,
              password_hash,
              role
            )
            VALUES (
              $1,
              $2,
              $3,
              'employee'
            )
            RETURNING
              id,
              full_name,
              email,
              role,
              is_active,
              created_at
          `,
          [
            cleanName,
            cleanEmail,
            passwordHash,
          ]
        )

      const user =
        result.rows[0]

      return res.status(201).json({
        success: true,
        message:
          'Employee created successfully',
        employee: {
          id: user.id,
          fullName:
            user.full_name,
          email: user.email,
          role: user.role,
          isActive:
            user.is_active,
          createdAt:
            user.created_at,
        },
      })
    } catch (error) {
      console.error(
        'Admin create employee error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to create employee',
      })
    }
  }
)

/*
|--------------------------------------------------------------------------
| UPDATE EMPLOYEE STATUS
|--------------------------------------------------------------------------
*/

router.patch(
  '/employees/:employeeId/status',
  ...adminOnly,
  async (req, res) => {
    const employeeId =
      Number(req.params.employeeId)

    const {
      isActive,
    } = req.body

    if (
      !Number.isInteger(
        employeeId
      ) ||
      employeeId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid employee ID',
      })
    }

    if (
      typeof isActive !==
      'boolean'
    ) {
      return res.status(400).json({
        success: false,
        message:
          'isActive must be true or false',
      })
    }

    try {
      const result =
        await pool.query(
          `
            UPDATE users
            SET is_active = $1
            WHERE id = $2
              AND role = 'employee'
            RETURNING
              id,
              full_name,
              email,
              role,
              is_active,
              created_at
          `,
          [
            isActive,
            employeeId,
          ]
        )

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Employee not found',
        })
      }

      const user =
        result.rows[0]

      return res.status(200).json({
        success: true,
        message: isActive
          ? 'Employee activated successfully'
          : 'Employee deactivated successfully',
        employee: {
          id: user.id,
          fullName:
            user.full_name,
          email: user.email,
          role: user.role,
          isActive:
            user.is_active,
          createdAt:
            user.created_at,
        },
      })
    } catch (error) {
      console.error(
        'Admin employee status error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to update employee status',
      })
    }
  }
)

/*
|--------------------------------------------------------------------------
| CREATE LIVE SESSION
|--------------------------------------------------------------------------
*/

router.post(
  '/live-sessions',
  ...adminOnly,
  async (req, res) => {
    const {
      careerRoleId,
      topicId,
      title,
      description,
      scheduledDate,
      startTime,
      endTime,
      status = 'scheduled',
    } = req.body

    const roleId =
      Number(careerRoleId)

    const cleanTopicId =
      Number(topicId)

    const cleanTitle =
      String(title || '').trim()

    const cleanDescription =
      String(
        description || ''
      ).trim()

    if (
      !Number.isInteger(
        roleId
      ) ||
      roleId <= 0 ||
      !Number.isInteger(
        cleanTopicId
      ) ||
      cleanTopicId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Career role and topic are required',
      })
    }

    if (
      cleanTitle.length < 3
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Session title must contain at least 3 characters',
      })
    }

    if (
      !scheduledDate ||
      !startTime ||
      !endTime
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Date, start time and end time are required',
      })
    }

    if (
      ![
        'draft',
        'scheduled',
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'New sessions must be draft or scheduled',
      })
    }

    try {
      const topicCheck =
        await pool.query(
          `
            SELECT
              t.id
            FROM topics t
            INNER JOIN career_roles cr
              ON cr.id =
                 t.career_role_id
            WHERE t.id = $1
              AND cr.id = $2
              AND t.is_active = TRUE
              AND cr.is_active = TRUE
            LIMIT 1
          `,
          [
            cleanTopicId,
            roleId,
          ]
        )

      if (
        topicCheck.rows.length ===
        0
      ) {
        return res.status(400).json({
          success: false,
          message:
            'The selected topic does not belong to the selected career role',
        })
      }

      const result =
        await pool.query(
          `
            INSERT INTO live_sessions (
              career_role_id,
              topic_id,
              title,
              description,
              scheduled_date,
              start_time,
              end_time,
              status,
              created_by
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              $7,
              $8,
              $9
            )
            RETURNING *
          `,
          [
            roleId,
            cleanTopicId,
            cleanTitle,
            cleanDescription ||
              null,
            scheduledDate,
            startTime,
            endTime,
            status,
            req.user.userId,
          ]
        )

      return res.status(201).json({
        success: true,
        message:
          status === 'draft'
            ? 'Live session draft saved successfully'
            : 'Live session published successfully',
        session:
          result.rows[0],
      })
    } catch (error) {
      console.error(
        'Create live session error:',
        error
      )

      if (
        error.code ===
        '23514'
      ) {
        return res.status(400).json({
          success: false,
          message:
            'End time must be later than start time',
        })
      }

      return res.status(500).json({
        success: false,
        message:
          'Unable to create live session',
      })
    }
  }
)

/*
|--------------------------------------------------------------------------
| START LIVE SESSION
|--------------------------------------------------------------------------
*/

router.patch(
  '/live-sessions/:sessionId/start',
  ...adminOnly,
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
      /*
       * Keep one authoritative live
       * state per session.
       *
       * Only draft/scheduled sessions
       * may be started.
       */
      const result =
        await pool.query(
          `
            UPDATE live_sessions

            SET
              status = 'live',
              started_at =
                CURRENT_TIMESTAMP,
              ended_at = NULL,
              updated_at =
                CURRENT_TIMESTAMP

            WHERE id = $1
              AND status IN (
                'draft',
                'scheduled'
              )

            RETURNING *
          `,
          [sessionId]
        )

      if (
        result.rows.length === 0
      ) {
        const existing =
          await pool.query(
            `
              SELECT status
              FROM live_sessions
              WHERE id = $1
              LIMIT 1
            `,
            [sessionId]
          )

        if (
          existing.rows.length ===
          0
        ) {
          return res.status(404).json({
            success: false,
            message:
              'Live session not found',
          })
        }

        return res.status(409).json({
          success: false,
          message:
            `Session cannot be started while its status is "${existing.rows[0].status}"`,
        })
      }

      return res.status(200).json({
        success: true,
        message:
          'Live session started successfully',
        session:
          result.rows[0],
      })
    } catch (error) {
      console.error(
        'Start live session error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to start live session',
      })
    }
  }
)

/*
|--------------------------------------------------------------------------
| END LIVE SESSION
|--------------------------------------------------------------------------
*/

router.patch(
  '/live-sessions/:sessionId/end',
  ...adminOnly,
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
            UPDATE live_sessions

            SET
              status = 'ended',
              ended_at =
                CURRENT_TIMESTAMP,
              updated_at =
                CURRENT_TIMESTAMP

            WHERE id = $1
              AND status = 'live'

            RETURNING *
          `,
          [sessionId]
        )

      if (
        result.rows.length === 0
      ) {
        const existing =
          await pool.query(
            `
              SELECT status
              FROM live_sessions
              WHERE id = $1
              LIMIT 1
            `,
            [sessionId]
          )

        if (
          existing.rows.length ===
          0
        ) {
          return res.status(404).json({
            success: false,
            message:
              'Live session not found',
          })
        }

        return res.status(409).json({
          success: false,
          message:
            `Only a live session can be ended. Current status: "${existing.rows[0].status}"`,
        })
      }

      return res.status(200).json({
        success: true,
        message:
          'Live session ended successfully',
        session:
          result.rows[0],
      })
    } catch (error) {
      console.error(
        'End live session error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to end live session',
      })
    }
  }
)

/*
|--------------------------------------------------------------------------
| GET DETAILED EMPLOYEE PROGRESS
|--------------------------------------------------------------------------
*/

router.get(
  '/employees/:employeeId/progress',
  ...adminOnly,
  async (req, res) => {
    const employeeId = Number(
      req.params.employeeId
    )

    if (
      !Number.isInteger(employeeId) ||
      employeeId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Invalid employee ID',
      })
    }

    try {
      /*
      |--------------------------------------------------------------------------
      | EMPLOYEE
      |--------------------------------------------------------------------------
      */

      const employeeResult =
        await pool.query(
          `
            SELECT
              id,
              full_name,
              email,
              is_active,
              created_at
            FROM users
            WHERE id = $1
              AND role = 'employee'
            LIMIT 1
          `,
          [employeeId]
        )

      if (
        employeeResult.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message: 'Employee not found',
        })
      }

      const employeeRow =
        employeeResult.rows[0]

      /*
      |--------------------------------------------------------------------------
      | ROLE / TOPIC / LESSON / ASSESSMENT PROGRESS
      |--------------------------------------------------------------------------
      */

      const topicResult =
        await pool.query(
          `
            SELECT
              cr.id AS role_id,
              cr.slug AS role_slug,
              cr.title AS role_title,

              t.id AS topic_id,
              t.slug AS topic_slug,
              t.title AS topic_title,
              t.position AS topic_position,

              COUNT(
                DISTINCT l.id
              )::int AS total_lessons,

              COUNT(
                DISTINCT lp.lesson_id
              )::int AS completed_lessons,

              EXISTS (
                SELECT 1
                FROM assessments a2
                INNER JOIN assessment_attempts aa2
                  ON aa2.assessment_id = a2.id
                WHERE a2.topic_id = t.id
                  AND a2.is_active = TRUE
                  AND aa2.user_id = $1
                  AND aa2.passed = TRUE
              ) AS assessment_passed,

              (
                SELECT MAX(aa3.score)
                FROM assessments a3
                INNER JOIN assessment_attempts aa3
                  ON aa3.assessment_id = a3.id
                WHERE a3.topic_id = t.id
                  AND a3.is_active = TRUE
                  AND aa3.user_id = $1
              ) AS best_assessment_score,

              (
                SELECT COUNT(*)
                FROM assessments a4
                INNER JOIN assessment_attempts aa4
                  ON aa4.assessment_id = a4.id
                WHERE a4.topic_id = t.id
                  AND a4.is_active = TRUE
                  AND aa4.user_id = $1
              )::int AS assessment_attempts

            FROM career_roles cr

            INNER JOIN topics t
              ON t.career_role_id = cr.id
             AND t.is_active = TRUE

            LEFT JOIN lessons l
              ON l.topic_id = t.id
             AND l.is_active = TRUE

            LEFT JOIN lesson_progress lp
              ON lp.lesson_id = l.id
             AND lp.user_id = $1

            WHERE cr.is_active = TRUE

            GROUP BY
              cr.id,
              cr.slug,
              cr.title,
              t.id,
              t.slug,
              t.title,
              t.position

            ORDER BY
              cr.id ASC,
              t.position ASC,
              t.id ASC
          `,
          [employeeId]
        )

      /*
      |--------------------------------------------------------------------------
      | PRACTICAL CHALLENGE PROGRESS
      |--------------------------------------------------------------------------
      */

      const practicalResult =
        await pool.query(
          `
            SELECT
              cr.id AS role_id,

              pc.id AS challenge_id,
              pc.title AS challenge_title,

              latest.score,
              latest.passed,
              latest.execution_status,
              latest.submitted_at

            FROM career_roles cr

            LEFT JOIN practical_challenges pc
              ON pc.career_role_id = cr.id
             AND pc.is_active = TRUE

            LEFT JOIN LATERAL (
              SELECT
                pca.score,
                pca.passed,
                pca.execution_status,
                pca.submitted_at

              FROM practical_challenge_attempts pca

              WHERE
                pca.practical_challenge_id =
                  pc.id
                AND pca.user_id = $1

              ORDER BY
                pca.submitted_at DESC,
                pca.id DESC

              LIMIT 1
            ) latest ON TRUE

            WHERE cr.is_active = TRUE

            ORDER BY cr.id ASC
          `,
          [employeeId]
        )

      /*
      |--------------------------------------------------------------------------
      | BUILD ROLE DATA
      |--------------------------------------------------------------------------
      */

      const roleMap = new Map()

      for (
        const row of topicResult.rows
      ) {
        const roleId =
          Number(row.role_id)

        if (!roleMap.has(roleId)) {
          roleMap.set(roleId, {
            roleId,
            roleSlug:
              row.role_slug,
            roleTitle:
              row.role_title,

            totalTopics: 0,
            completedTopics: 0,

            totalLessons: 0,
            completedLessons: 0,

            topicPercentage: 0,
            lessonPercentage: 0,

            practicalChallenge: {
              available: false,
              attempted: false,
              score: null,
              passed: false,
              executionStatus: null,
              submittedAt: null,
            },

            certificateEarned: false,

            topics: [],
          })
        }

        const role =
          roleMap.get(roleId)

        const totalLessons =
          Number(
            row.total_lessons || 0
          )

        const completedLessons =
          Number(
            row.completed_lessons || 0
          )

        const assessmentPassed =
          row.assessment_passed === true

        const bestAssessmentScore =
          row.best_assessment_score ===
            null
            ? null
            : Number(
                row.best_assessment_score
              )

        const assessmentAttempts =
          Number(
            row.assessment_attempts || 0
          )

        const lessonPercentage =
          totalLessons > 0
            ? Math.round(
                (
                  completedLessons /
                  totalLessons
                ) * 100
              )
            : 0

        role.totalTopics += 1

        /*
         * Topic completion follows the same
         * source of truth as employee progress:
         * passing the topic assessment.
         */
        if (assessmentPassed) {
          role.completedTopics += 1
        }

        role.totalLessons +=
          totalLessons

        role.completedLessons +=
          completedLessons

        role.topics.push({
          topicId:
            Number(row.topic_id),

          topicSlug:
            row.topic_slug,

          topicTitle:
            row.topic_title,

          position:
            Number(
              row.topic_position
            ),

          totalLessons,

          completedLessons,

          lessonPercentage,

          assessment: {
            attempted:
              assessmentAttempts > 0,

            attempts:
              assessmentAttempts,

            bestScore:
              bestAssessmentScore,

            passed:
              assessmentPassed,
          },

          completed:
            assessmentPassed,
        })
      }

      /*
      |--------------------------------------------------------------------------
      | ADD PRACTICAL RESULTS
      |--------------------------------------------------------------------------
      */

      for (
        const row of
        practicalResult.rows
      ) {
        const role =
          roleMap.get(
            Number(row.role_id)
          )

        if (!role) {
          continue
        }

        const available =
          row.challenge_id !== null

        const attempted =
          row.execution_status !== null

        role.practicalChallenge = {
          available,

          challengeId:
            available
              ? Number(
                  row.challenge_id
                )
              : null,

          challengeTitle:
            row.challenge_title ||
            null,

          attempted,

          score:
            row.score === null
              ? null
              : Number(row.score),

          passed:
            row.passed === true,

          executionStatus:
            row.execution_status ||
            null,

          submittedAt:
            row.submitted_at ||
            null,
        }
      }

      /*
      |--------------------------------------------------------------------------
      | FINAL ROLE PERCENTAGES / CERTIFICATES
      |--------------------------------------------------------------------------
      */

      const roles =
        Array.from(
          roleMap.values()
        ).map((role) => {
          role.topicPercentage =
            role.totalTopics > 0
              ? Math.round(
                  (
                    role.completedTopics /
                    role.totalTopics
                  ) * 100
                )
              : 0

          role.lessonPercentage =
            role.totalLessons > 0
              ? Math.round(
                  (
                    role.completedLessons /
                    role.totalLessons
                  ) * 100
                )
              : 0

          const allTopicsCompleted =
            role.totalTopics > 0 &&
            role.completedTopics ===
              role.totalTopics

          role.certificateEarned =
            allTopicsCompleted &&
            role.practicalChallenge
              .passed === true

          return role
        })

      /*
      |--------------------------------------------------------------------------
      | OVERALL SUMMARY
      |--------------------------------------------------------------------------
      */

      const totalTopics =
        roles.reduce(
          (sum, role) =>
            sum +
            role.totalTopics,
          0
        )

      const completedTopics =
        roles.reduce(
          (sum, role) =>
            sum +
            role.completedTopics,
          0
        )

      const totalLessons =
        roles.reduce(
          (sum, role) =>
            sum +
            role.totalLessons,
          0
        )

      const completedLessons =
        roles.reduce(
          (sum, role) =>
            sum +
            role.completedLessons,
          0
        )

      const certificatesEarned =
        roles.filter(
          (role) =>
            role.certificateEarned
        ).length

      const practicalPassed =
        roles.filter(
          (role) =>
            role.practicalChallenge
              .passed
        ).length

      const overallTopicPercentage =
        totalTopics > 0
          ? Math.round(
              (
                completedTopics /
                totalTopics
              ) * 100
            )
          : 0

      const overallLessonPercentage =
        totalLessons > 0
          ? Math.round(
              (
                completedLessons /
                totalLessons
              ) * 100
            )
          : 0

      return res.status(200).json({
        success: true,

        employee: {
          id:
            Number(
              employeeRow.id
            ),

          fullName:
            employeeRow.full_name,

          email:
            employeeRow.email,

          isActive:
            employeeRow.is_active,

          createdAt:
            employeeRow.created_at,
        },

        summary: {
          totalRoles:
            roles.length,

          totalTopics,

          completedTopics,

          totalLessons,

          completedLessons,

          certificatesEarned,

          practicalPassed,

          overallTopicPercentage,

          overallLessonPercentage,
        },

        roles,
      })
    } catch (error) {
      console.error(
        'Admin employee progress error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve employee progress',
      })
    }
  }
)
/*
|--------------------------------------------------------------------------
| ADMIN DASHBOARD / PROGRESS ANALYTICS
|--------------------------------------------------------------------------
*/

router.get(
  '/analytics',
  ...adminOnly,
  async (req, res) => {
    try {
      /*
      |--------------------------------------------------------------------------
      | PLATFORM CONTENT COUNTS
      |--------------------------------------------------------------------------
      */

      const contentResult = await pool.query(`
        SELECT
          (
            SELECT COUNT(*)::int
            FROM career_roles
            WHERE is_active = TRUE
          ) AS total_roles,

          (
            SELECT COUNT(*)::int
            FROM topics t
            INNER JOIN career_roles cr
              ON cr.id = t.career_role_id
            WHERE t.is_active = TRUE
              AND cr.is_active = TRUE
          ) AS total_topics,

          (
            SELECT COUNT(*)::int
            FROM lessons l
            INNER JOIN topics t
              ON t.id = l.topic_id
            INNER JOIN career_roles cr
              ON cr.id = t.career_role_id
            WHERE l.is_active = TRUE
              AND t.is_active = TRUE
              AND cr.is_active = TRUE
          ) AS total_lessons,

          (
            SELECT COUNT(*)::int
            FROM assessments a
            INNER JOIN topics t
              ON t.id = a.topic_id
            INNER JOIN career_roles cr
              ON cr.id = t.career_role_id
            WHERE a.is_active = TRUE
              AND t.is_active = TRUE
              AND cr.is_active = TRUE
          ) AS total_assessments
      `)

      /*
      |--------------------------------------------------------------------------
      | EMPLOYEE COUNTS
      |--------------------------------------------------------------------------
      */

      const employeeResult = await pool.query(`
        SELECT
          COUNT(*)::int AS total_employees,

          COUNT(*) FILTER (
            WHERE is_active = TRUE
          )::int AS active_employees,

          COUNT(*) FILTER (
            WHERE is_active = FALSE
          )::int AS inactive_employees

        FROM users
        WHERE role = 'employee'
      `)

      /*
      |--------------------------------------------------------------------------
      | LESSON ACTIVITY
      |--------------------------------------------------------------------------
      |
      | Each lesson_progress row represents one completed lesson for one
      | employee. Only active learning content and employee accounts are
      | included in these platform analytics.
      |--------------------------------------------------------------------------
      */

      const lessonResult = await pool.query(`
        SELECT
          COUNT(*)::int AS completed_lessons,

          COUNT(
            DISTINCT lp.user_id
          )::int AS employees_with_lesson_progress

        FROM lesson_progress lp

        INNER JOIN users u
          ON u.id = lp.user_id
         AND u.role = 'employee'

        INNER JOIN lessons l
          ON l.id = lp.lesson_id
         AND l.is_active = TRUE

        INNER JOIN topics t
          ON t.id = l.topic_id
         AND t.is_active = TRUE

        INNER JOIN career_roles cr
          ON cr.id = t.career_role_id
         AND cr.is_active = TRUE
      `)

      /*
      |--------------------------------------------------------------------------
      | ASSESSMENT PERFORMANCE
      |--------------------------------------------------------------------------
      */

      const assessmentResult = await pool.query(`
        SELECT
          COUNT(*)::int AS total_attempts,

          COUNT(*) FILTER (
            WHERE aa.passed = TRUE
          )::int AS passed_attempts,

          COUNT(
            DISTINCT aa.user_id
          )::int AS employees_with_assessment_attempts,

          COALESCE(
            ROUND(AVG(aa.score)::numeric, 2),
            0
          ) AS average_score

        FROM assessment_attempts aa

        INNER JOIN users u
          ON u.id = aa.user_id
         AND u.role = 'employee'

        INNER JOIN assessments a
          ON a.id = aa.assessment_id
         AND a.is_active = TRUE

        INNER JOIN topics t
          ON t.id = a.topic_id
         AND t.is_active = TRUE

        INNER JOIN career_roles cr
          ON cr.id = t.career_role_id
         AND cr.is_active = TRUE
      `)

      /*
      |--------------------------------------------------------------------------
      | UNIQUE COMPLETED TOPICS
      |--------------------------------------------------------------------------
      |
      | Topic completion follows the employee learning source of truth:
      | an employee completes a topic once they have at least one passing
      | attempt for an active assessment belonging to that topic.
      |--------------------------------------------------------------------------
      */

      const completedTopicResult =
        await pool.query(`
          SELECT
            COUNT(*)::int AS completed_topics

          FROM (
            SELECT DISTINCT
              aa.user_id,
              t.id AS topic_id

            FROM assessment_attempts aa

            INNER JOIN users u
              ON u.id = aa.user_id
             AND u.role = 'employee'

            INNER JOIN assessments a
              ON a.id = aa.assessment_id
             AND a.is_active = TRUE

            INNER JOIN topics t
              ON t.id = a.topic_id
             AND t.is_active = TRUE

            INNER JOIN career_roles cr
              ON cr.id = t.career_role_id
             AND cr.is_active = TRUE

            WHERE aa.passed = TRUE
          ) completed
        `)

      /*
      |--------------------------------------------------------------------------
      | PRACTICAL CHALLENGE PASSES
      |--------------------------------------------------------------------------
      |
      | Count employee/role pairs that have at least one successfully completed
      | passing practical attempt.
      |--------------------------------------------------------------------------
      */

      const practicalResult =
        await pool.query(`
          SELECT
            COUNT(*)::int AS practical_passes,

            COUNT(
              DISTINCT passed.user_id
            )::int AS employees_with_practical_pass

          FROM (
            SELECT DISTINCT
              pca.user_id,
              pc.career_role_id

            FROM practical_challenge_attempts pca

            INNER JOIN users u
              ON u.id = pca.user_id
             AND u.role = 'employee'

            INNER JOIN practical_challenges pc
              ON pc.id =
                 pca.practical_challenge_id
             AND pc.is_active = TRUE

            INNER JOIN career_roles cr
              ON cr.id = pc.career_role_id
             AND cr.is_active = TRUE

            WHERE pca.passed = TRUE
              AND pca.execution_status =
                  'completed'
          ) passed
        `)

      /*
      |--------------------------------------------------------------------------
      | CERTIFICATES
      |--------------------------------------------------------------------------
      |
      | A certificate is earned when:
      | 1. every active topic in a role has a passing assessment attempt
      | 2. the employee has a passing completed practical challenge attempt
      |--------------------------------------------------------------------------
      */

      const certificateResult =
        await pool.query(`
          WITH active_roles AS (
            SELECT
              cr.id AS role_id

            FROM career_roles cr

            WHERE cr.is_active = TRUE
          ),

          role_topic_counts AS (
            SELECT
              ar.role_id,

              COUNT(t.id)::int AS total_topics

            FROM active_roles ar

            LEFT JOIN topics t
              ON t.career_role_id =
                 ar.role_id
             AND t.is_active = TRUE

            GROUP BY ar.role_id
          ),

          employee_role_topic_passes AS (
            SELECT
              u.id AS user_id,
              ar.role_id,

              COUNT(
                DISTINCT CASE
                  WHEN EXISTS (
                    SELECT 1

                    FROM assessments a

                    INNER JOIN assessment_attempts aa
                      ON aa.assessment_id = a.id

                    WHERE a.topic_id = t.id
                      AND a.is_active = TRUE
                      AND aa.user_id = u.id
                      AND aa.passed = TRUE
                  )
                  THEN t.id
                END
              )::int AS completed_topics

            FROM users u

            CROSS JOIN active_roles ar

            LEFT JOIN topics t
              ON t.career_role_id =
                 ar.role_id
             AND t.is_active = TRUE

            WHERE u.role = 'employee'

            GROUP BY
              u.id,
              ar.role_id
          ),

          employee_role_practical AS (
            SELECT DISTINCT
              pca.user_id,
              pc.career_role_id AS role_id

            FROM practical_challenge_attempts pca

            INNER JOIN practical_challenges pc
              ON pc.id =
                 pca.practical_challenge_id
             AND pc.is_active = TRUE

            INNER JOIN career_roles cr
              ON cr.id = pc.career_role_id
             AND cr.is_active = TRUE

            INNER JOIN users u
              ON u.id = pca.user_id
             AND u.role = 'employee'

            WHERE pca.passed = TRUE
              AND pca.execution_status =
                  'completed'
          )

          SELECT
            COUNT(*)::int AS certificates_earned,

            COUNT(
              DISTINCT ertp.user_id
            )::int AS employees_with_certificates

          FROM employee_role_topic_passes ertp

          INNER JOIN role_topic_counts rtc
            ON rtc.role_id =
               ertp.role_id

          INNER JOIN employee_role_practical erp
            ON erp.user_id =
               ertp.user_id
           AND erp.role_id =
               ertp.role_id

          WHERE rtc.total_topics > 0
            AND ertp.completed_topics =
                rtc.total_topics
        `)

      /*
      |--------------------------------------------------------------------------
      | PER-ROLE ANALYTICS
      |--------------------------------------------------------------------------
      */

      const roleResult = await pool.query(`
        SELECT
          cr.id AS role_id,
          cr.slug AS role_slug,
          cr.title AS role_title,
          cr.description,

          COUNT(
            DISTINCT t.id
          )::int AS total_topics,

          COUNT(
            DISTINCT l.id
          )::int AS total_lessons,

          COUNT(
            DISTINCT a.id
          )::int AS total_assessments,

          COUNT(
            DISTINCT CASE
              WHEN a.id IS NOT NULL
              THEN t.id
            END
          )::int AS topics_with_assessment

        FROM career_roles cr

        LEFT JOIN topics t
          ON t.career_role_id = cr.id
         AND t.is_active = TRUE

        LEFT JOIN lessons l
          ON l.topic_id = t.id
         AND l.is_active = TRUE

        LEFT JOIN assessments a
          ON a.topic_id = t.id
         AND a.is_active = TRUE

        WHERE cr.is_active = TRUE

        GROUP BY
          cr.id,
          cr.slug,
          cr.title,
          cr.description

        ORDER BY
          cr.id ASC
      `)

      /*
      |--------------------------------------------------------------------------
      | PER-ROLE EMPLOYEE ACTIVITY
      |--------------------------------------------------------------------------
      */

      const roleActivityResult =
        await pool.query(`
          WITH role_users AS (
            SELECT DISTINCT
              cr.id AS role_id,
              activity.user_id

            FROM career_roles cr

            INNER JOIN (
              SELECT
                t.career_role_id AS role_id,
                lp.user_id

              FROM lesson_progress lp

              INNER JOIN lessons l
                ON l.id = lp.lesson_id
               AND l.is_active = TRUE

              INNER JOIN topics t
                ON t.id = l.topic_id
               AND t.is_active = TRUE

              INNER JOIN users u
                ON u.id = lp.user_id
               AND u.role = 'employee'

              UNION

              SELECT
                t.career_role_id AS role_id,
                aa.user_id

              FROM assessment_attempts aa

              INNER JOIN assessments a
                ON a.id = aa.assessment_id
               AND a.is_active = TRUE

              INNER JOIN topics t
                ON t.id = a.topic_id
               AND t.is_active = TRUE

              INNER JOIN users u
                ON u.id = aa.user_id
               AND u.role = 'employee'

              UNION

              SELECT
                pc.career_role_id AS role_id,
                pca.user_id

              FROM practical_challenge_attempts pca

              INNER JOIN practical_challenges pc
                ON pc.id =
                   pca.practical_challenge_id
               AND pc.is_active = TRUE

              INNER JOIN users u
                ON u.id = pca.user_id
               AND u.role = 'employee'
            ) activity
              ON activity.role_id = cr.id

            WHERE cr.is_active = TRUE
          ),

          topic_passes AS (
            SELECT DISTINCT
              t.career_role_id AS role_id,
              aa.user_id,
              t.id AS topic_id

            FROM assessment_attempts aa

            INNER JOIN users u
              ON u.id = aa.user_id
             AND u.role = 'employee'

            INNER JOIN assessments a
              ON a.id = aa.assessment_id
             AND a.is_active = TRUE

            INNER JOIN topics t
              ON t.id = a.topic_id
             AND t.is_active = TRUE

            INNER JOIN career_roles cr
              ON cr.id = t.career_role_id
             AND cr.is_active = TRUE

            WHERE aa.passed = TRUE
          ),

          practical_passes AS (
            SELECT DISTINCT
              pc.career_role_id AS role_id,
              pca.user_id

            FROM practical_challenge_attempts pca

            INNER JOIN users u
              ON u.id = pca.user_id
             AND u.role = 'employee'

            INNER JOIN practical_challenges pc
              ON pc.id =
                 pca.practical_challenge_id
             AND pc.is_active = TRUE

            INNER JOIN career_roles cr
              ON cr.id = pc.career_role_id
             AND cr.is_active = TRUE

            WHERE pca.passed = TRUE
              AND pca.execution_status =
                  'completed'
          ),

          role_topic_counts AS (
            SELECT
              cr.id AS role_id,

              COUNT(t.id)::int AS total_topics

            FROM career_roles cr

            LEFT JOIN topics t
              ON t.career_role_id = cr.id
             AND t.is_active = TRUE

            WHERE cr.is_active = TRUE

            GROUP BY cr.id
          ),

          employee_role_topic_counts AS (
            SELECT
              tp.role_id,
              tp.user_id,

              COUNT(
                DISTINCT tp.topic_id
              )::int AS completed_topics

            FROM topic_passes tp

            GROUP BY
              tp.role_id,
              tp.user_id
          ),

          certificate_passes AS (
            SELECT
              ertc.role_id,
              ertc.user_id

            FROM employee_role_topic_counts ertc

            INNER JOIN role_topic_counts rtc
              ON rtc.role_id =
                 ertc.role_id

            INNER JOIN practical_passes pp
              ON pp.role_id =
                 ertc.role_id
             AND pp.user_id =
                 ertc.user_id

            WHERE rtc.total_topics > 0
              AND ertc.completed_topics =
                  rtc.total_topics
          )

          SELECT
            cr.id AS role_id,

            COUNT(
              DISTINCT ru.user_id
            )::int AS employees_with_progress,

            COUNT(
              DISTINCT (
                tp.user_id,
                tp.topic_id
              )
            )::int AS completed_topic_records,

            COUNT(
              DISTINCT pp.user_id
            )::int AS practical_passes,

            COUNT(
              DISTINCT cp.user_id
            )::int AS certificates_earned

          FROM career_roles cr

          LEFT JOIN role_users ru
            ON ru.role_id = cr.id

          LEFT JOIN topic_passes tp
            ON tp.role_id = cr.id

          LEFT JOIN practical_passes pp
            ON pp.role_id = cr.id

          LEFT JOIN certificate_passes cp
            ON cp.role_id = cr.id

          WHERE cr.is_active = TRUE

          GROUP BY cr.id

          ORDER BY cr.id ASC
        `)

      /*
      |--------------------------------------------------------------------------
      | BUILD RESPONSE
      |--------------------------------------------------------------------------
      */

      const content =
        contentResult.rows[0]

      const employees =
        employeeResult.rows[0]

      const lessons =
        lessonResult.rows[0]

      const assessments =
        assessmentResult.rows[0]

      const completedTopics =
        completedTopicResult.rows[0]

      const practical =
        practicalResult.rows[0]

      const certificates =
        certificateResult.rows[0]

      const totalAttempts =
        Number(
          assessments.total_attempts || 0
        )

      const passedAttempts =
        Number(
          assessments.passed_attempts || 0
        )

      const assessmentPassRate =
        totalAttempts > 0
          ? Math.round(
              (passedAttempts /
                totalAttempts) *
                100
            )
          : 0

      const roleActivityMap =
        new Map(
          roleActivityResult.rows.map(
            (row) => [
              Number(row.role_id),
              row,
            ]
          )
        )

      const roles =
        roleResult.rows.map((row) => {
          const roleId =
            Number(row.role_id)

          const totalTopics =
            Number(
              row.total_topics || 0
            )

          const topicsWithAssessment =
            Number(
              row.topics_with_assessment ||
                0
            )

          const activity =
            roleActivityMap.get(roleId)

          const assessmentCoverage =
            totalTopics > 0
              ? Math.round(
                  (topicsWithAssessment /
                    totalTopics) *
                    100
                )
              : 0

          return {
            roleId,
            roleSlug:
              row.role_slug,

            roleTitle:
              row.role_title,

            description:
              row.description || '',

            totalTopics,

            totalLessons:
              Number(
                row.total_lessons || 0
              ),

            totalAssessments:
              Number(
                row.total_assessments || 0
              ),

            topicsWithAssessment,

            assessmentCoverage,

            employeesWithProgress:
              Number(
                activity
                  ?.employees_with_progress ||
                  0
              ),

            completedTopicRecords:
              Number(
                activity
                  ?.completed_topic_records ||
                  0
              ),

            practicalPasses:
              Number(
                activity
                  ?.practical_passes || 0
              ),

            certificatesEarned:
              Number(
                activity
                  ?.certificates_earned || 0
              ),
          }
        })

      return res.status(200).json({
        success: true,

        content: {
          totalRoles:
            Number(
              content.total_roles || 0
            ),

          totalTopics:
            Number(
              content.total_topics || 0
            ),

          totalLessons:
            Number(
              content.total_lessons || 0
            ),

          totalAssessments:
            Number(
              content.total_assessments ||
                0
            ),
        },

        employees: {
          total:
            Number(
              employees.total_employees ||
                0
            ),

          active:
            Number(
              employees.active_employees ||
                0
            ),

          inactive:
            Number(
              employees.inactive_employees ||
                0
            ),

          withLessonProgress:
            Number(
              lessons
                .employees_with_lesson_progress ||
                0
            ),

          withAssessmentAttempts:
            Number(
              assessments
                .employees_with_assessment_attempts ||
                0
            ),

          withPracticalPass:
            Number(
              practical
                .employees_with_practical_pass ||
                0
            ),

          withCertificates:
            Number(
              certificates
                .employees_with_certificates ||
                0
            ),
        },

        learning: {
          completedLessons:
            Number(
              lessons.completed_lessons ||
                0
            ),

          completedTopics:
            Number(
              completedTopics
                .completed_topics || 0
            ),

          assessmentAttempts:
            totalAttempts,

          passedAssessmentAttempts:
            passedAttempts,

          assessmentPassRate,

          averageAssessmentScore:
            Number(
              assessments.average_score ||
                0
            ),

          practicalPasses:
            Number(
              practical.practical_passes ||
                0
            ),

          certificatesEarned:
            Number(
              certificates
                .certificates_earned || 0
            ),
        },

        roles,
      })
    } catch (error) {
      console.error(
        'Admin analytics error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve admin analytics',
      })
    }
  }
)
/*
|--------------------------------------------------------------------------
| ADMIN ASSESSMENT MANAGEMENT
|--------------------------------------------------------------------------
|
| These routes manage the PostgreSQL assessments/questions/options used
| by the employee assessment flow.
|
| IMPORTANT:
| - Every route is admin-only.
| - Correct answers are exposed only through these admin routes.
| - Employee assessment APIs must never expose is_correct.
| - Creating/updating questions uses transactions.
| - Deleting a question is a soft delete so assessment history remains valid.
|
*/
/*
|--------------------------------------------------------------------------
| CREATE ASSESSMENT FOR ROLE/TOPIC
|--------------------------------------------------------------------------
|
| Creates the assessment container for a topic.
|
| One assessment is allowed per topic because assessments.topic_id
| has a UNIQUE constraint.
|
*/

router.post(
  '/assessments/:roleSlug/topics/:topicSlug',
  ...adminOnly,
  async (req, res) => {
    const roleSlug = String(
      req.params.roleSlug || ''
    ).trim()

    const topicSlug = String(
      req.params.topicSlug || ''
    ).trim()

    const title = String(
      req.body.title || ''
    ).trim()

    const description = String(
      req.body.description || ''
    ).trim()

    const passingScore =
      req.body.passingScore === undefined ||
      req.body.passingScore === null ||
      req.body.passingScore === ''
        ? 70
        : Number(req.body.passingScore)

    const durationMinutes =
      req.body.durationMinutes === undefined ||
      req.body.durationMinutes === null ||
      req.body.durationMinutes === ''
        ? 10
        : Number(req.body.durationMinutes)

    /*
    |--------------------------------------------------------------------------
    | VALIDATE ROUTE PARAMETERS
    |--------------------------------------------------------------------------
    */

    if (!roleSlug || !topicSlug) {
      return res.status(400).json({
        success: false,
        message:
          'Career role and topic are required',
      })
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE TITLE
    |--------------------------------------------------------------------------
    */

    if (title.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          'Assessment title must contain at least 2 characters',
      })
    }

    if (title.length > 200) {
      return res.status(400).json({
        success: false,
        message:
          'Assessment title cannot exceed 200 characters',
      })
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE PASSING SCORE
    |--------------------------------------------------------------------------
    */

    if (
      !Number.isInteger(passingScore) ||
      passingScore < 0 ||
      passingScore > 100
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Passing score must be an integer between 0 and 100',
      })
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE DURATION
    |--------------------------------------------------------------------------
    */

    if (
      !Number.isInteger(durationMinutes) ||
      durationMinutes <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Duration must be a positive integer',
      })
    }

    const client = await pool.connect()

    try {
      await client.query('BEGIN')

      /*
      |--------------------------------------------------------------------------
      | FIND ACTIVE ROLE + TOPIC
      |--------------------------------------------------------------------------
      */

      const topicResult =
        await client.query(
          `
            SELECT
              t.id AS topic_id,
              t.slug AS topic_slug,
              t.title AS topic_title,

              cr.id AS role_id,
              cr.slug AS role_slug,
              cr.title AS role_title

            FROM topics t

            INNER JOIN career_roles cr
              ON cr.id = t.career_role_id

            WHERE cr.slug = $1
              AND t.slug = $2
              AND cr.is_active = TRUE
              AND t.is_active = TRUE

            FOR UPDATE OF t
          `,
          [
            roleSlug,
            topicSlug,
          ]
        )

      if (
        topicResult.rows.length === 0
      ) {
        await client.query('ROLLBACK')

        return res.status(404).json({
          success: false,
          message:
            'Active career role or topic not found',
        })
      }

      const topic =
        topicResult.rows[0]

      /*
      |--------------------------------------------------------------------------
      | CHECK FOR EXISTING ASSESSMENT
      |--------------------------------------------------------------------------
      |
      | This includes inactive assessments because topic_id is UNIQUE.
      |
      */

      const existingResult =
        await client.query(
          `
            SELECT
              id,
              is_active

            FROM assessments

            WHERE topic_id = $1

            LIMIT 1
          `,
          [topic.topic_id]
        )

      if (
        existingResult.rows.length > 0
      ) {
        await client.query('ROLLBACK')

        const existing =
          existingResult.rows[0]

        return res.status(409).json({
          success: false,
          message:
            existing.is_active === true
              ? 'An active assessment already exists for this topic'
              : 'An inactive assessment already exists for this topic',
        })
      }

      /*
      |--------------------------------------------------------------------------
      | CREATE ASSESSMENT
      |--------------------------------------------------------------------------
      */

      const assessmentResult =
        await client.query(
          `
            INSERT INTO assessments (
              topic_id,
              title,
              description,
              passing_score,
              duration_minutes,
              is_active
            )

            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              TRUE
            )

            RETURNING
              id,
              topic_id,
              title,
              description,
              passing_score,
              duration_minutes,
              is_active,
              created_at,
              updated_at
          `,
          [
            topic.topic_id,
            title,
            description || null,
            passingScore,
            durationMinutes,
          ]
        )

      const assessment =
        assessmentResult.rows[0]

      await client.query('COMMIT')

      /*
      |--------------------------------------------------------------------------
      | RESPONSE
      |--------------------------------------------------------------------------
      */

      return res.status(201).json({
        success: true,

        message:
          'Assessment created successfully',

        assessment: {
          id:
            Number(assessment.id),

          title:
            assessment.title,

          description:
            assessment.description || '',

          passingScore:
            Number(
              assessment.passing_score
            ),

          durationMinutes:
            Number(
              assessment.duration_minutes
            ),

          isActive:
            assessment.is_active === true,

          role: {
            id:
              Number(topic.role_id),

            slug:
              topic.role_slug,

            title:
              topic.role_title,
          },

          topic: {
            id:
              Number(topic.topic_id),

            slug:
              topic.topic_slug,

            title:
              topic.topic_title,
          },

          questions: [],
        },
      })
    } catch (error) {
      try {
        await client.query('ROLLBACK')
      } catch (rollbackError) {
        console.error(
          'Create assessment rollback error:',
          rollbackError
        )
      }

      console.error(
        'Admin create assessment error:',
        error
      )

      /*
      |--------------------------------------------------------------------------
      | UNIQUE TOPIC CONFLICT
      |--------------------------------------------------------------------------
      */

      if (error.code === '23505') {
        return res.status(409).json({
          success: false,
          message:
            'An assessment already exists for this topic',
        })
      }

      return res.status(500).json({
        success: false,
        message:
          'Unable to create assessment',
      })
    } finally {
      client.release()
    }
  }
)

/*
|--------------------------------------------------------------------------
| GET ASSESSMENT + QUESTIONS FOR ROLE/TOPIC
|--------------------------------------------------------------------------
*/

router.get(
  '/assessments/:roleSlug/topics/:topicSlug',
  ...adminOnly,
  async (req, res) => {
    const roleSlug = String(
      req.params.roleSlug || ''
    ).trim()

    const topicSlug = String(
      req.params.topicSlug || ''
    ).trim()

    if (!roleSlug || !topicSlug) {
      return res.status(400).json({
        success: false,
        message:
          'Career role and topic are required',
      })
    }

    try {
      /*
      |--------------------------------------------------------------------------
      | FIND ACTIVE ASSESSMENT
      |--------------------------------------------------------------------------
      */

      const assessmentResult =
        await pool.query(
          `
            SELECT
              a.id,
              a.topic_id,
              a.title,
              a.description,
              a.passing_score,
              a.duration_minutes,
              a.is_active,

              t.id AS topic_id,
              t.slug AS topic_slug,
              t.title AS topic_title,

              cr.id AS role_id,
              cr.slug AS role_slug,
              cr.title AS role_title

            FROM assessments a

            INNER JOIN topics t
              ON t.id = a.topic_id

            INNER JOIN career_roles cr
              ON cr.id = t.career_role_id

            WHERE cr.slug = $1
              AND t.slug = $2
              AND cr.is_active = TRUE
              AND t.is_active = TRUE
              AND a.is_active = TRUE

            ORDER BY a.id ASC

            LIMIT 1
          `,
          [
            roleSlug,
            topicSlug,
          ]
        )

      if (
        assessmentResult.rows.length ===
        0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'No active assessment was found for this topic',
        })
      }

      const assessment =
        assessmentResult.rows[0]

      /*
|--------------------------------------------------------------------------
| GET ACTIVE QUESTIONS
|--------------------------------------------------------------------------
*/

const questionsResult =
  await pool.query(
    `
      SELECT
        id,
        question,
        position

      FROM assessment_questions

      WHERE assessment_id = $1
        AND is_active = TRUE

      ORDER BY
        position ASC,
        id ASC
    `,
    [assessment.id]
  )

const questionIds =
  questionsResult.rows.map(
    (question) =>
      question.id
  )
      /*
      |--------------------------------------------------------------------------
      | GET OPTIONS
      |--------------------------------------------------------------------------
      |
      | is_correct is intentionally available here because this route is
      | protected by adminOnly.
      |
      |--------------------------------------------------------------------------
      */

      let optionRows = []

      if (questionIds.length > 0) {
        const optionsResult =
          await pool.query(
            `
              SELECT
                id,
                question_id,
                option_text,
                is_correct,
                position

              FROM assessment_options

              WHERE question_id =
                ANY($1::bigint[])

              ORDER BY
                question_id ASC,
                position ASC,
                id ASC
            `,
            [questionIds]
          )

        optionRows =
          optionsResult.rows
      }

      /*
      |--------------------------------------------------------------------------
      | BUILD QUESTIONS
      |--------------------------------------------------------------------------
      */

      const questions =
        questionsResult.rows.map(
          (question) => {
            const options =
              optionRows
                .filter(
                  (option) =>
                    Number(
                      option.question_id
                    ) ===
                    Number(question.id)
                )
                .map((option) => ({
                  id:
                    Number(option.id),

                  optionText:
                    option.option_text,

                  isCorrect:
                    option.is_correct ===
                    true,

                  position:
                    Number(
                      option.position
                    ),
                }))

            const correctAnswer =
              options.findIndex(
                (option) =>
                  option.isCorrect ===
                  true
              )

            return {
              id:
                Number(question.id),

              questionText:
                question.question,

              position:
                Number(
                  question.position
                ),

              options,

              correctAnswer:
                correctAnswer >= 0
                  ? correctAnswer
                  : null,
            }
          }
        )

      /*
      |--------------------------------------------------------------------------
      | RESPONSE
      |--------------------------------------------------------------------------
      */

      return res.status(200).json({
        success: true,

        assessment: {
          id:
            Number(assessment.id),

          title:
            assessment.title,

          description:
            assessment.description ||
            '',

          passingScore:
            Number(
              assessment.passing_score
            ),

          durationMinutes:
            assessment.duration_minutes ===
            null
              ? null
              : Number(
                  assessment.duration_minutes
                ),

          role: {
            id:
              Number(
                assessment.role_id
              ),

            slug:
              assessment.role_slug,

            title:
              assessment.role_title,
          },

          topic: {
            id:
              Number(
                assessment.topic_id
              ),

            slug:
              assessment.topic_slug,

            title:
              assessment.topic_title,
          },

          questions,
        },
      })
    } catch (error) {
      console.error(
        'Admin get assessment error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve assessment',
      })
    }
  }
)


/*
|--------------------------------------------------------------------------
| CREATE ASSESSMENT QUESTION
|--------------------------------------------------------------------------
|
| Expected request body:
|
| {
|   "questionText": "What does HTML stand for?",
|   "options": [
|     "Option A",
|     "Option B",
|     "Option C",
|     "Option D"
|   ],
|   "correctAnswer": 0
| }
|
| correctAnswer is zero-based: 0, 1, 2 or 3.
|
*/

router.post(
  '/assessments/:assessmentId/questions',
  ...adminOnly,
  async (req, res) => {
    const assessmentId =
      Number(
        req.params.assessmentId
      )

    const {
      questionText,
      options,
      correctAnswer,
    } = req.body

    /*
    |--------------------------------------------------------------------------
    | VALIDATE ASSESSMENT ID
    |--------------------------------------------------------------------------
    */

    if (
      !Number.isInteger(
        assessmentId
      ) ||
      assessmentId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid assessment ID',
      })
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE QUESTION
    |--------------------------------------------------------------------------
    */

    const cleanQuestion =
      String(
        questionText || ''
      ).trim()

    if (
      cleanQuestion.length < 3
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Question must contain at least 3 characters',
      })
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE OPTIONS
    |--------------------------------------------------------------------------
    */

    if (
      !Array.isArray(options) ||
      options.length !== 4
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Exactly 4 answer options are required',
      })
    }

    const cleanOptions =
      options.map(
        (option) =>
          String(
            option || ''
          ).trim()
      )

    if (
      cleanOptions.some(
        (option) =>
          option.length === 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'All 4 answer options are required',
      })
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE CORRECT ANSWER
    |--------------------------------------------------------------------------
    */

    const cleanCorrectAnswer =
      Number(correctAnswer)

    if (
      !Number.isInteger(
        cleanCorrectAnswer
      ) ||
      cleanCorrectAnswer < 0 ||
      cleanCorrectAnswer > 3
    ) {
      return res.status(400).json({
        success: false,
        message:
          'A valid correct answer is required',
      })
    }

    /*
    |--------------------------------------------------------------------------
    | START TRANSACTION
    |--------------------------------------------------------------------------
    */

    const client =
      await pool.connect()

    try {
      await client.query(
        'BEGIN'
      )

      /*
      |--------------------------------------------------------------------------
      | VERIFY + LOCK ASSESSMENT
      |--------------------------------------------------------------------------
      */

      const assessmentResult =
        await client.query(
          `
            SELECT
              a.id

            FROM assessments a

            INNER JOIN topics t
              ON t.id = a.topic_id

            INNER JOIN career_roles cr
              ON cr.id =
                 t.career_role_id

            WHERE a.id = $1
              AND a.is_active = TRUE
              AND t.is_active = TRUE
              AND cr.is_active = TRUE

            FOR UPDATE OF a
          `,
          [assessmentId]
        )

      if (
        assessmentResult.rows.length ===
        0
      ) {
        await client.query(
          'ROLLBACK'
        )

        return res.status(404).json({
          success: false,
          message:
            'Active assessment not found',
        })
      }

     const positionResult =
  await client.query(
    `
      SELECT
        (
          COALESCE(
            MAX(position),
            0
          ) + 1
        )::int
          AS next_position

      FROM assessment_questions

      WHERE assessment_id = $1
    `,
    [assessmentId]
  )

const nextPosition =
  Number(
    positionResult.rows[0]
      .next_position
  )

      /*
      |--------------------------------------------------------------------------
      | INSERT QUESTION
      |--------------------------------------------------------------------------
      */

      const questionResult =
        await client.query(
          `
            INSERT INTO
              assessment_questions (
                assessment_id,
                question,
                position,
                is_active
              )

            VALUES (
              $1,
              $2,
              $3,
              TRUE
            )

            RETURNING
              id,
              assessment_id,
              question,
              position,
              is_active
          `,
          [
            assessmentId,
            cleanQuestion,
            nextPosition,
          ]
        )

      const question =
        questionResult.rows[0]

      /*
      |--------------------------------------------------------------------------
      | INSERT FOUR OPTIONS
      |--------------------------------------------------------------------------
      */

      const savedOptions = []

      for (
        let index = 0;
        index < 4;
        index += 1
      ) {
        const optionResult =
          await client.query(
            `
              INSERT INTO
                assessment_options (
                  question_id,
                  option_text,
                  is_correct,
                  position
                )

              VALUES (
                $1,
                $2,
                $3,
                $4
              )

              RETURNING
                id,
                question_id,
                option_text,
                is_correct,
                position
            `,
            [
              question.id,
              cleanOptions[index],
              index ===
                cleanCorrectAnswer,
              index + 1,
            ]
          )

        savedOptions.push(
          optionResult.rows[0]
        )
      }

      /*
      |--------------------------------------------------------------------------
      | COMMIT
      |--------------------------------------------------------------------------
      */

      await client.query(
        'COMMIT'
      )

      return res.status(201).json({
        success: true,

        message:
          'Question added successfully',

        question: {
          id:
            Number(question.id),

          assessmentId:
            Number(
              question.assessment_id
            ),

          questionText:
            question.question,

          position:
            Number(
              question.position
            ),

          correctAnswer:
            cleanCorrectAnswer,

          options:
            savedOptions.map(
              (option) => ({
                id:
                  Number(option.id),

                optionText:
                  option.option_text,

                isCorrect:
                  option.is_correct ===
                  true,

                position:
                  Number(
                    option.position
                  ),
              })
            ),
        },
      })
    } catch (error) {
      try {
        await client.query(
          'ROLLBACK'
        )
      } catch (
        rollbackError
      ) {
        console.error(
          'Create question rollback error:',
          rollbackError
        )
      }

      console.error(
        'Admin create assessment question error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to add assessment question',
      })
    } finally {
      client.release()
    }
  }
)


/*
|--------------------------------------------------------------------------
| UPDATE ASSESSMENT QUESTION
|--------------------------------------------------------------------------
|
| Existing option IDs are preserved because historical assessment answers
| may reference assessment_options.id.
|
*/

router.put(
  '/assessment-questions/:questionId',
  ...adminOnly,
  async (req, res) => {
    const questionId =
      Number(
        req.params.questionId
      )

    const {
      questionText,
      options,
      correctAnswer,
    } = req.body

    /*
    |--------------------------------------------------------------------------
    | VALIDATE QUESTION ID
    |--------------------------------------------------------------------------
    */

    if (
      !Number.isInteger(
        questionId
      ) ||
      questionId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid question ID',
      })
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE QUESTION
    |--------------------------------------------------------------------------
    */

    const cleanQuestion =
      String(
        questionText || ''
      ).trim()

    if (
      cleanQuestion.length < 3
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Question must contain at least 3 characters',
      })
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE OPTIONS
    |--------------------------------------------------------------------------
    */

    if (
      !Array.isArray(options) ||
      options.length !== 4
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Exactly 4 answer options are required',
      })
    }

    const cleanOptions =
      options.map(
        (option) =>
          String(
            option || ''
          ).trim()
      )

    if (
      cleanOptions.some(
        (option) =>
          option.length === 0
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          'All 4 answer options are required',
      })
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE CORRECT ANSWER
    |--------------------------------------------------------------------------
    */

    const cleanCorrectAnswer =
      Number(correctAnswer)

    if (
      !Number.isInteger(
        cleanCorrectAnswer
      ) ||
      cleanCorrectAnswer < 0 ||
      cleanCorrectAnswer > 3
    ) {
      return res.status(400).json({
        success: false,
        message:
          'A valid correct answer is required',
      })
    }

    /*
    |--------------------------------------------------------------------------
    | START TRANSACTION
    |--------------------------------------------------------------------------
    */

    const client =
      await pool.connect()

    try {
      await client.query(
        'BEGIN'
      )

      /*
      |--------------------------------------------------------------------------
      | FIND + LOCK QUESTION
      |--------------------------------------------------------------------------
      */

      const existingQuestionResult =
        await client.query(
          `
            SELECT
              q.id,
              q.assessment_id,
              q.question,
              q.position

            FROM assessment_questions q

            INNER JOIN assessments a
              ON a.id =
                 q.assessment_id

            INNER JOIN topics t
              ON t.id =
                 a.topic_id

            INNER JOIN career_roles cr
              ON cr.id =
                 t.career_role_id

            WHERE q.id = $1
              AND q.is_active = TRUE
              AND a.is_active = TRUE
              AND t.is_active = TRUE
              AND cr.is_active = TRUE

            FOR UPDATE OF q
          `,
          [questionId]
        )

      if (
        existingQuestionResult.rows
          .length === 0
      ) {
        await client.query(
          'ROLLBACK'
        )

        return res.status(404).json({
          success: false,
          message:
            'Active question not found',
        })
      }

      /*
      |--------------------------------------------------------------------------
      | FIND + LOCK OPTIONS
      |--------------------------------------------------------------------------
      */

      const existingOptionsResult =
        await client.query(
          `
            SELECT
              id,
              question_id,
              option_text,
              is_correct,
              position

            FROM assessment_options

            WHERE question_id = $1

            ORDER BY
              position ASC,
              id ASC

            FOR UPDATE
          `,
          [questionId]
        )

      /*
      |--------------------------------------------------------------------------
      | REQUIRE EXACTLY FOUR STORED OPTIONS
      |--------------------------------------------------------------------------
      */

      if (
        existingOptionsResult.rows
          .length !== 4
      ) {
        await client.query(
          'ROLLBACK'
        )

        return res.status(409).json({
          success: false,
          message:
            'This question does not have exactly 4 stored options and cannot be safely edited',
        })
      }

      /*
      |--------------------------------------------------------------------------
      | UPDATE QUESTION
      |--------------------------------------------------------------------------
      */

      const updatedQuestionResult =
        await client.query(
          `
            UPDATE assessment_questions

            SET question = $1

            WHERE id = $2

            RETURNING
              id,
              assessment_id,
              question,
              position,
              is_active
          `,
          [
            cleanQuestion,
            questionId,
          ]
        )

      /*
      |--------------------------------------------------------------------------
      | UPDATE EXISTING OPTIONS
      |--------------------------------------------------------------------------
      */

      const savedOptions = []

      for (
        let index = 0;
        index < 4;
        index += 1
      ) {
        const existingOption =
          existingOptionsResult
            .rows[index]

        const optionResult =
          await client.query(
            `
              UPDATE assessment_options

              SET
                option_text = $1,
                is_correct = $2,
                position = $3

              WHERE id = $4
                AND question_id = $5

              RETURNING
                id,
                question_id,
                option_text,
                is_correct,
                position
            `,
            [
              cleanOptions[index],
              index ===
                cleanCorrectAnswer,
              index + 1,
              existingOption.id,
              questionId,
            ]
          )

        if (
          optionResult.rows.length ===
          0
        ) {
          throw new Error(
            'Unable to update assessment option'
          )
        }

        savedOptions.push(
          optionResult.rows[0]
        )
      }

      /*
      |--------------------------------------------------------------------------
      | COMMIT
      |--------------------------------------------------------------------------
      */

      await client.query(
        'COMMIT'
      )

      const updatedQuestion =
        updatedQuestionResult
          .rows[0]

      return res.status(200).json({
        success: true,

        message:
          'Question updated successfully',

        question: {
          id:
            Number(
              updatedQuestion.id
            ),

          assessmentId:
            Number(
              updatedQuestion
                .assessment_id
            ),

          questionText:
            updatedQuestion.question,

          position:
            Number(
              updatedQuestion.position
            ),

          correctAnswer:
            cleanCorrectAnswer,

          options:
            savedOptions.map(
              (option) => ({
                id:
                  Number(option.id),

                optionText:
                  option.option_text,

                isCorrect:
                  option.is_correct ===
                  true,

                position:
                  Number(
                    option.position
                  ),
              })
            ),
        },
      })
    } catch (error) {
      try {
        await client.query(
          'ROLLBACK'
        )
      } catch (
        rollbackError
      ) {
        console.error(
          'Update question rollback error:',
          rollbackError
        )
      }

      console.error(
        'Admin update assessment question error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to update assessment question',
      })
    } finally {
      client.release()
    }
  }
)


/*
|--------------------------------------------------------------------------
| SOFT DELETE ASSESSMENT QUESTION
|--------------------------------------------------------------------------
|
| Do not physically delete the question or options.
|
| Historical assessment_attempt_answers can reference these rows.
| Employee quizzes already ignore questions where is_active = FALSE.
|
*/

router.delete(
  '/assessment-questions/:questionId',
  ...adminOnly,
  async (req, res) => {
    const questionId =
      Number(
        req.params.questionId
      )

    if (
      !Number.isInteger(
        questionId
      ) ||
      questionId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid question ID',
      })
    }

    try {
      const result =
        await pool.query(
          `
            UPDATE assessment_questions q

            SET is_active = FALSE

            FROM
              assessments a,
              topics t,
              career_roles cr

            WHERE q.id = $1

              AND q.assessment_id =
                  a.id

              AND a.topic_id =
                  t.id

              AND t.career_role_id =
                  cr.id

              AND q.is_active = TRUE

              AND a.is_active = TRUE

              AND t.is_active = TRUE

              AND cr.is_active = TRUE

            RETURNING
              q.id,
              q.assessment_id,
              q.question,
              q.position
          `,
          [questionId]
        )

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Active question not found',
        })
      }

      const question =
        result.rows[0]

      return res.status(200).json({
        success: true,

        message:
          'Question deleted successfully',

        question: {
          id:
            Number(question.id),

          assessmentId:
            Number(
              question.assessment_id
            ),

          questionText:
            question.question,

          position:
            Number(
              question.position
            ),
        },
      })
    } catch (error) {
      console.error(
        'Admin delete assessment question error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to delete assessment question',
      })
    }
  }
)
/*
|--------------------------------------------------------------------------
| ADMIN LESSON MANAGEMENT
|--------------------------------------------------------------------------
|
| PostgreSQL-backed lesson CRUD for SkillForge Admin.
|
| Routes:
|
| GET
| /api/admin/roles/:roleSlug/topics/:topicSlug/lessons
|
| POST
| /api/admin/roles/:roleSlug/topics/:topicSlug/lessons
|
| GET
| /api/admin/lessons/:lessonId
|
| PUT
| /api/admin/lessons/:lessonId
|
| DELETE
| /api/admin/lessons/:lessonId
|
| Delete is a soft delete.
|
*/


/*
|--------------------------------------------------------------------------
| HELPER: NORMALIZE LESSON CONTENT
|--------------------------------------------------------------------------
*/

function normalizeLessonContent(content) {
  if (Array.isArray(content)) {
    return content
      .map((item) => String(item ?? '').trim())
      .filter(Boolean)
  }

  if (
    content === null ||
    content === undefined ||
    content === ''
  ) {
    return []
  }

  return [String(content).trim()].filter(Boolean)
}


/*
|--------------------------------------------------------------------------
| HELPER: NORMALIZE LESSON RESOURCES
|--------------------------------------------------------------------------
*/

function normalizeLessonResources(resources) {
  if (!Array.isArray(resources)) {
    return []
  }

  return resources
}


/*
|--------------------------------------------------------------------------
| HELPER: MAP DATABASE LESSON
|--------------------------------------------------------------------------
*/

function mapAdminLesson(lesson) {
  let content = []

  if (lesson.content) {
    try {
      const parsed =
        JSON.parse(lesson.content)

      if (Array.isArray(parsed)) {
        content = parsed
      } else {
        content = [
          String(parsed),
        ]
      }
    } catch {
      content = [
        String(lesson.content),
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
      Number(lesson.id),

    topicId:
      Number(lesson.topic_id),

    title:
      lesson.title,

    description:
      lesson.description ?? '',

    content,

    resources,

    position:
      Number(lesson.position),

    estimatedMinutes:
      lesson.estimated_minutes ===
      null
        ? null
        : Number(
            lesson.estimated_minutes
          ),

    isActive:
      lesson.is_active === true,

    createdAt:
      lesson.created_at,

    updatedAt:
      lesson.updated_at,
  }
}


/*
|--------------------------------------------------------------------------
| GET LESSONS FOR ROLE + TOPIC
|--------------------------------------------------------------------------
*/

router.get(
  '/roles/:roleSlug/topics/:topicSlug/lessons',
  ...adminOnly,
  async (req, res) => {
    const roleSlug =
      String(
        req.params.roleSlug || ''
      ).trim()

    const topicSlug =
      String(
        req.params.topicSlug || ''
      ).trim()

    if (!roleSlug || !topicSlug) {
      return res.status(400).json({
        success: false,
        message:
          'Career role and topic are required',
      })
    }

    try {
      /*
      |--------------------------------------------------------------------------
      | FIND ACTIVE ROLE + TOPIC
      |--------------------------------------------------------------------------
      */

      const topicResult =
        await pool.query(
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
              cr.title AS role_title

            FROM topics t

            INNER JOIN career_roles cr
              ON cr.id =
                 t.career_role_id

            WHERE cr.slug = $1
              AND t.slug = $2
              AND cr.is_active = TRUE
              AND t.is_active = TRUE

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
          message:
            'Active topic not found',
        })
      }

      const topic =
        topicResult.rows[0]

      /*
      |--------------------------------------------------------------------------
      | GET ACTIVE LESSONS
      |--------------------------------------------------------------------------
      */

      const lessonsResult =
        await pool.query(
          `
            SELECT
              id,
              topic_id,
              title,
              description,
              content,
              resources,
              position,
              estimated_minutes,
              is_active,
              created_at,
              updated_at

            FROM lessons

            WHERE topic_id = $1
              AND is_active = TRUE

            ORDER BY
              position ASC,
              id ASC
          `,
          [topic.id]
        )

      const lessons =
        lessonsResult.rows.map(
          mapAdminLesson
        )

      return res.status(200).json({
        success: true,

        role: {
          id:
            Number(
              topic.role_id
            ),

          slug:
            topic.role_slug,

          title:
            topic.role_title,
        },

        topic: {
          id:
            Number(topic.id),

          slug:
            topic.slug,

          title:
            topic.title,

          description:
            topic.description ?? '',

          duration:
            topic.duration,

          position:
            Number(
              topic.position
            ),
        },

        lessons,

        lessonCount:
          lessons.length,
      })
    } catch (error) {
      console.error(
        'Admin get lessons error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve lessons',
      })
    }
  }
)


/*
|--------------------------------------------------------------------------
| GET ONE LESSON
|--------------------------------------------------------------------------
|
| Used by Edit Lesson so the form can be populated with the real data.
|
*/

router.get(
  '/lessons/:lessonId',
  ...adminOnly,
  async (req, res) => {
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
      return res.status(400).json({
        success: false,
        message:
          'Invalid lesson ID',
      })
    }

    try {
      const result =
        await pool.query(
          `
            SELECT
              l.id,
              l.topic_id,
              l.title,
              l.description,
              l.content,
              l.resources,
              l.position,
              l.estimated_minutes,
              l.is_active,
              l.created_at,
              l.updated_at,

              t.slug AS topic_slug,
              t.title AS topic_title,

              cr.id AS role_id,
              cr.slug AS role_slug,
              cr.title AS role_title

            FROM lessons l

            INNER JOIN topics t
              ON t.id =
                 l.topic_id

            INNER JOIN career_roles cr
              ON cr.id =
                 t.career_role_id

            WHERE l.id = $1
              AND l.is_active = TRUE
              AND t.is_active = TRUE
              AND cr.is_active = TRUE

            LIMIT 1
          `,
          [lessonId]
        )

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Active lesson not found',
        })
      }

      const row =
        result.rows[0]

      return res.status(200).json({
        success: true,

        role: {
          id:
            Number(
              row.role_id
            ),

          slug:
            row.role_slug,

          title:
            row.role_title,
        },

        topic: {
          id:
            Number(
              row.topic_id
            ),

          slug:
            row.topic_slug,

          title:
            row.topic_title,
        },

        lesson:
          mapAdminLesson(row),
      })
    } catch (error) {
      console.error(
        'Admin get lesson error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve lesson',
      })
    }
  }
)


/*
|--------------------------------------------------------------------------
| CREATE LESSON
|--------------------------------------------------------------------------
|
| Expected body:
|
| {
|   "title": "Introduction to HTML",
|   "description": "...",
|   "content": ["..."],
|   "resources": [],
|   "estimatedMinutes": 25
| }
|
*/

router.post(
  '/roles/:roleSlug/topics/:topicSlug/lessons',
  ...adminOnly,
  async (req, res) => {
    const roleSlug =
      String(
        req.params.roleSlug || ''
      ).trim()

    const topicSlug =
      String(
        req.params.topicSlug || ''
      ).trim()

    const title =
      String(
        req.body.title || ''
      ).trim()

    const description =
      String(
        req.body.description || ''
      ).trim()

    const content =
      normalizeLessonContent(
        req.body.content
      )

    const resources =
      normalizeLessonResources(
        req.body.resources
      )

    const rawEstimatedMinutes =
      req.body.estimatedMinutes

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!roleSlug || !topicSlug) {
      return res.status(400).json({
        success: false,
        message:
          'Career role and topic are required',
      })
    }

    if (title.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          'Lesson title is required',
      })
    }

    let estimatedMinutes = null

    if (
      rawEstimatedMinutes !==
        undefined &&
      rawEstimatedMinutes !==
        null &&
      rawEstimatedMinutes !==
        ''
    ) {
      estimatedMinutes =
        Number(
          rawEstimatedMinutes
        )

      if (
        !Number.isInteger(
          estimatedMinutes
        ) ||
        estimatedMinutes <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Estimated duration must be a positive whole number',
        })
      }
    }

    const client =
      await pool.connect()

    try {
      await client.query(
        'BEGIN'
      )

      /*
      |--------------------------------------------------------------------------
      | FIND + LOCK TOPIC
      |--------------------------------------------------------------------------
      */

      const topicResult =
        await client.query(
          `
            SELECT
              t.id,
              t.slug,
              t.title,

              cr.id AS role_id,
              cr.slug AS role_slug,
              cr.title AS role_title

            FROM topics t

            INNER JOIN career_roles cr
              ON cr.id =
                 t.career_role_id

            WHERE cr.slug = $1
              AND t.slug = $2
              AND cr.is_active = TRUE
              AND t.is_active = TRUE

            FOR UPDATE OF t
          `,
          [
            roleSlug,
            topicSlug,
          ]
        )

      if (
        topicResult.rows.length === 0
      ) {
        await client.query(
          'ROLLBACK'
        )

        return res.status(404).json({
          success: false,
          message:
            'Active topic not found',
        })
      }

      const topic =
        topicResult.rows[0]

      /*
      |--------------------------------------------------------------------------
      | CALCULATE NEXT POSITION
      |--------------------------------------------------------------------------
      |
      | We include inactive lessons when calculating MAX(position), preventing
      | a deleted lesson's position from being reused if the database has a
      | uniqueness rule around lesson ordering.
      |
      */

      const positionResult =
        await client.query(
          `
            SELECT
              (
                COALESCE(
                  MAX(position),
                  0
                ) + 1
              )::int AS next_position

            FROM lessons

            WHERE topic_id = $1
          `,
          [topic.id]
        )

      const nextPosition =
        Number(
          positionResult.rows[0]
            .next_position
        )

      /*
      |--------------------------------------------------------------------------
      | INSERT LESSON
      |--------------------------------------------------------------------------
      */

      const result =
        await client.query(
          `
            INSERT INTO lessons (
              topic_id,
              title,
              description,
              content,
              resources,
              position,
              estimated_minutes,
              is_active
            )

            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5::jsonb,
              $6,
              $7,
              TRUE
            )

            RETURNING
              id,
              topic_id,
              title,
              description,
              content,
              resources,
              position,
              estimated_minutes,
              is_active,
              created_at,
              updated_at
          `,
          [
            topic.id,
            title,
            description || null,

            JSON.stringify(
              content
            ),

            JSON.stringify(
              resources
            ),

            nextPosition,
            estimatedMinutes,
          ]
        )

      await client.query(
        'COMMIT'
      )

      return res.status(201).json({
        success: true,

        message:
          'Lesson added successfully',

        lesson:
          mapAdminLesson(
            result.rows[0]
          ),
      })
    } catch (error) {
      try {
        await client.query(
          'ROLLBACK'
        )
      } catch (
        rollbackError
      ) {
        console.error(
          'Create lesson rollback error:',
          rollbackError
        )
      }

      console.error(
        'Admin create lesson error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to add lesson',
      })
    } finally {
      client.release()
    }
  }
)


/*
|--------------------------------------------------------------------------
| UPDATE LESSON
|--------------------------------------------------------------------------
*/

router.put(
  '/lessons/:lessonId',
  ...adminOnly,
  async (req, res) => {
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
      return res.status(400).json({
        success: false,
        message:
          'Invalid lesson ID',
      })
    }

    const title =
      String(
        req.body.title || ''
      ).trim()

    const description =
      String(
        req.body.description || ''
      ).trim()

    const content =
      normalizeLessonContent(
        req.body.content
      )

    const resources =
      normalizeLessonResources(
        req.body.resources
      )

    const rawEstimatedMinutes =
      req.body.estimatedMinutes

    if (title.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          'Lesson title is required',
      })
    }

    let estimatedMinutes = null

    if (
      rawEstimatedMinutes !==
        undefined &&
      rawEstimatedMinutes !==
        null &&
      rawEstimatedMinutes !==
        ''
    ) {
      estimatedMinutes =
        Number(
          rawEstimatedMinutes
        )

      if (
        !Number.isInteger(
          estimatedMinutes
        ) ||
        estimatedMinutes <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Estimated duration must be a positive whole number',
        })
      }
    }

    try {
      /*
      |--------------------------------------------------------------------------
      | UPDATE ACTIVE LESSON
      |--------------------------------------------------------------------------
      */

      const result =
        await pool.query(
          `
            UPDATE lessons l

            SET
              title = $1,
              description = $2,
              content = $3,
              resources = $4::jsonb,
              estimated_minutes = $5,
              updated_at =
                CURRENT_TIMESTAMP

            FROM
              topics t,
              career_roles cr

            WHERE l.id = $6

              AND l.topic_id =
                  t.id

              AND t.career_role_id =
                  cr.id

              AND l.is_active = TRUE
              AND t.is_active = TRUE
              AND cr.is_active = TRUE

            RETURNING
              l.id,
              l.topic_id,
              l.title,
              l.description,
              l.content,
              l.resources,
              l.position,
              l.estimated_minutes,
              l.is_active,
              l.created_at,
              l.updated_at
          `,
          [
            title,
            description || null,

            JSON.stringify(
              content
            ),

            JSON.stringify(
              resources
            ),

            estimatedMinutes,
            lessonId,
          ]
        )

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Active lesson not found',
        })
      }

      return res.status(200).json({
        success: true,

        message:
          'Lesson updated successfully',

        lesson:
          mapAdminLesson(
            result.rows[0]
          ),
      })
    } catch (error) {
      console.error(
        'Admin update lesson error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to update lesson',
      })
    }
  }
)


/*
|--------------------------------------------------------------------------
| DELETE LESSON
|--------------------------------------------------------------------------
|
| Soft delete only.
|
| This protects existing lesson_progress rows and other historical references.
|
*/

router.delete(
  '/lessons/:lessonId',
  ...adminOnly,
  async (req, res) => {
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
      return res.status(400).json({
        success: false,
        message:
          'Invalid lesson ID',
      })
    }

    try {
      const result =
        await pool.query(
          `
            UPDATE lessons l

            SET
              is_active = FALSE,
              updated_at =
                CURRENT_TIMESTAMP

            FROM
              topics t,
              career_roles cr

            WHERE l.id = $1

              AND l.topic_id =
                  t.id

              AND t.career_role_id =
                  cr.id

              AND l.is_active = TRUE
              AND t.is_active = TRUE
              AND cr.is_active = TRUE

            RETURNING
              l.id,
              l.topic_id,
              l.title,
              l.position
          `,
          [lessonId]
        )

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Active lesson not found',
        })
      }

      return res.status(200).json({
        success: true,

        message:
          'Lesson deleted successfully',

        lesson: {
          id:
            Number(
              result.rows[0].id
            ),

          topicId:
            Number(
              result.rows[0]
                .topic_id
            ),

          title:
            result.rows[0]
              .title,

          position:
            Number(
              result.rows[0]
                .position
            ),
        },
      })
    } catch (error) {
      console.error(
        'Admin delete lesson error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to delete lesson',
      })
    }
  }
)

/*
|--------------------------------------------------------------------------
| ADMIN CAREER ROLE MANAGEMENT
|--------------------------------------------------------------------------
|
| PostgreSQL-backed career role CRUD.
|
| Routes:
|
| GET    /api/admin/roles
| POST   /api/admin/roles
| GET    /api/admin/roles/:roleSlug
| PUT    /api/admin/roles/:roleSlug
| DELETE /api/admin/roles/:roleSlug
|
| Delete is a soft delete.
|
*/


/*
|--------------------------------------------------------------------------
| HELPER: NORMALIZE ROLE SLUG
|--------------------------------------------------------------------------
*/

function normalizeRoleSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}


/*
|--------------------------------------------------------------------------
| HELPER: MAP CAREER ROLE
|--------------------------------------------------------------------------
*/

function mapAdminCareerRole(row) {
  return {
    id:
      Number(row.id),

    slug:
      row.slug,

    title:
      row.title,

    description:
      row.description ?? '',

    isActive:
      row.is_active === true,

    topicCount:
      Number(
        row.topic_count || 0
      ),

    lessonCount:
      Number(
        row.lesson_count || 0
      ),

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  }
}


/*
|--------------------------------------------------------------------------
| GET ALL ACTIVE CAREER ROLES
|--------------------------------------------------------------------------
|
| Returns real topic and lesson counts from PostgreSQL.
|
*/

router.get(
  '/roles',
  ...adminOnly,
  async (req, res) => {
    try {
      const result =
        await pool.query(
          `
            SELECT
              cr.id,
              cr.slug,
              cr.title,
              cr.description,
              cr.is_active,
              cr.created_at,
              cr.updated_at,

              COUNT(
                DISTINCT t.id
              )::int AS topic_count,

              COUNT(
                DISTINCT l.id
              )::int AS lesson_count

            FROM career_roles cr

            LEFT JOIN topics t
              ON t.career_role_id =
                 cr.id
             AND t.is_active = TRUE

            LEFT JOIN lessons l
              ON l.topic_id = t.id
             AND l.is_active = TRUE

            WHERE cr.is_active = TRUE

            GROUP BY
              cr.id,
              cr.slug,
              cr.title,
              cr.description,
              cr.is_active,
              cr.created_at,
              cr.updated_at

            ORDER BY
              cr.id ASC
          `
        )

      const roles =
        result.rows.map(
          mapAdminCareerRole
        )

      return res.status(200).json({
        success: true,
        roles,
        roleCount:
          roles.length,
      })
    } catch (error) {
      console.error(
        'Admin career role list error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve career roles',
      })
    }
  }
)


/*
|--------------------------------------------------------------------------
| CREATE CAREER ROLE
|--------------------------------------------------------------------------
|
| Expected body:
|
| {
|   "title": "Cybersecurity Engineer",
|   "slug": "cybersecurity-engineer",
|   "description": "..."
| }
|
| Slug is optional. If omitted, it is generated from the title.
|
*/

router.post(
  '/roles',
  ...adminOnly,
  async (req, res) => {
    const title =
      String(
        req.body.title || ''
      ).trim()

    const description =
      String(
        req.body.description || ''
      ).trim()

    const suppliedSlug =
      String(
        req.body.slug || ''
      ).trim()

    const slug =
      normalizeRoleSlug(
        suppliedSlug || title
      )

    if (title.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          'Career role title must contain at least 2 characters',
      })
    }

    if (!slug) {
      return res.status(400).json({
        success: false,
        message:
          'A valid career role slug is required',
      })
    }

    if (slug.length > 100) {
      return res.status(400).json({
        success: false,
        message:
          'Career role slug cannot exceed 100 characters',
      })
    }

    if (title.length > 150) {
      return res.status(400).json({
        success: false,
        message:
          'Career role title cannot exceed 150 characters',
      })
    }

    try {
      /*
      |--------------------------------------------------------------------------
      | CHECK SLUG
      |--------------------------------------------------------------------------
      |
      | The database has a UNIQUE constraint on career_roles.slug.
      |
      | We check active and inactive roles because a soft-deleted role still
      | owns its slug.
      |
      */

      const existing =
        await pool.query(
          `
            SELECT
              id,
              is_active
            FROM career_roles
            WHERE slug = $1
            LIMIT 1
          `,
          [slug]
        )

      if (
        existing.rows.length > 0
      ) {
        return res.status(409).json({
          success: false,
          message:
            existing.rows[0]
              .is_active === true
              ? 'A career role with this slug already exists'
              : 'This slug belongs to a previously deleted career role',
        })
      }

      const result =
        await pool.query(
          `
            INSERT INTO career_roles (
              slug,
              title,
              description,
              is_active
            )
            VALUES (
              $1,
              $2,
              $3,
              TRUE
            )
            RETURNING
              id,
              slug,
              title,
              description,
              is_active,
              created_at,
              updated_at
          `,
          [
            slug,
            title,
            description || null,
          ]
        )

      const row =
        result.rows[0]

      return res.status(201).json({
        success: true,

        message:
          'Career role created successfully',

        role:
          mapAdminCareerRole({
            ...row,
            topic_count: 0,
            lesson_count: 0,
          }),
      })
    } catch (error) {
      console.error(
        'Admin create career role error:',
        error
      )

      /*
      |--------------------------------------------------------------------------
      | UNIQUE SLUG SAFETY
      |--------------------------------------------------------------------------
      */

      if (
        error.code === '23505'
      ) {
        return res.status(409).json({
          success: false,
          message:
            'A career role with this slug already exists',
        })
      }

      return res.status(500).json({
        success: false,
        message:
          'Unable to create career role',
      })
    }
  }
)


/*
|--------------------------------------------------------------------------
| GET ONE ACTIVE CAREER ROLE
|--------------------------------------------------------------------------
*/

router.get(
  '/roles/:roleSlug',
  ...adminOnly,
  async (req, res) => {
    const roleSlug =
      normalizeRoleSlug(
        req.params.roleSlug
      )

    if (!roleSlug) {
      return res.status(400).json({
        success: false,
        message:
          'Career role is required',
      })
    }

    try {
      const result =
        await pool.query(
          `
            SELECT
              cr.id,
              cr.slug,
              cr.title,
              cr.description,
              cr.is_active,
              cr.created_at,
              cr.updated_at,

              COUNT(
                DISTINCT t.id
              )::int AS topic_count,

              COUNT(
                DISTINCT l.id
              )::int AS lesson_count

            FROM career_roles cr

            LEFT JOIN topics t
              ON t.career_role_id =
                 cr.id
             AND t.is_active = TRUE

            LEFT JOIN lessons l
              ON l.topic_id = t.id
             AND l.is_active = TRUE

            WHERE cr.slug = $1
              AND cr.is_active = TRUE

            GROUP BY
              cr.id,
              cr.slug,
              cr.title,
              cr.description,
              cr.is_active,
              cr.created_at,
              cr.updated_at

            LIMIT 1
          `,
          [roleSlug]
        )

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Active career role not found',
        })
      }

      return res.status(200).json({
        success: true,

        role:
          mapAdminCareerRole(
            result.rows[0]
          ),
      })
    } catch (error) {
      console.error(
        'Admin get career role error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve career role',
      })
    }
  }
)


/*
|--------------------------------------------------------------------------
| UPDATE CAREER ROLE
|--------------------------------------------------------------------------
|
| Slug is intentionally NOT changed here.
|
| Existing URLs, topics, employee progress and other application references
| use the role slug. Keeping it stable prevents broken links.
|
*/

router.put(
  '/roles/:roleSlug',
  ...adminOnly,
  async (req, res) => {
    const roleSlug =
      normalizeRoleSlug(
        req.params.roleSlug
      )

    const title =
      String(
        req.body.title || ''
      ).trim()

    const description =
      String(
        req.body.description || ''
      ).trim()

    if (!roleSlug) {
      return res.status(400).json({
        success: false,
        message:
          'Career role is required',
      })
    }

    if (title.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          'Career role title must contain at least 2 characters',
      })
    }

    if (title.length > 150) {
      return res.status(400).json({
        success: false,
        message:
          'Career role title cannot exceed 150 characters',
      })
    }

    try {
      const result =
        await pool.query(
          `
            UPDATE career_roles

            SET
              title = $1,
              description = $2,
              updated_at =
                CURRENT_TIMESTAMP

            WHERE slug = $3
              AND is_active = TRUE

            RETURNING
              id,
              slug,
              title,
              description,
              is_active,
              created_at,
              updated_at
          `,
          [
            title,
            description || null,
            roleSlug,
          ]
        )

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Active career role not found',
        })
      }

      /*
      |--------------------------------------------------------------------------
      | GET CURRENT COUNTS
      |--------------------------------------------------------------------------
      */

      const counts =
        await pool.query(
          `
            SELECT
              COUNT(
                DISTINCT t.id
              )::int AS topic_count,

              COUNT(
                DISTINCT l.id
              )::int AS lesson_count

            FROM career_roles cr

            LEFT JOIN topics t
              ON t.career_role_id =
                 cr.id
             AND t.is_active = TRUE

            LEFT JOIN lessons l
              ON l.topic_id = t.id
             AND l.is_active = TRUE

            WHERE cr.id = $1
          `,
          [
            result.rows[0].id,
          ]
        )

      return res.status(200).json({
        success: true,

        message:
          'Career role updated successfully',

        role:
          mapAdminCareerRole({
            ...result.rows[0],

            topic_count:
              counts.rows[0]
                .topic_count,

            lesson_count:
              counts.rows[0]
                .lesson_count,
          }),
      })
    } catch (error) {
      console.error(
        'Admin update career role error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to update career role',
      })
    }
  }
)


/*
|--------------------------------------------------------------------------
| SOFT DELETE CAREER ROLE
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| We do NOT issue DELETE FROM career_roles.
|
| career_roles is referenced by topics, live sessions and practical
| challenges. Soft deletion keeps all existing data/history intact.
|
*/

router.delete(
  '/roles/:roleSlug',
  ...adminOnly,
  async (req, res) => {
    const roleSlug =
      normalizeRoleSlug(
        req.params.roleSlug
      )

    if (!roleSlug) {
      return res.status(400).json({
        success: false,
        message:
          'Career role is required',
      })
    }

    try {
      const result =
        await pool.query(
          `
            UPDATE career_roles

            SET
              is_active = FALSE,
              updated_at =
                CURRENT_TIMESTAMP

            WHERE slug = $1
              AND is_active = TRUE

            RETURNING
              id,
              slug,
              title,
              description,
              is_active,
              created_at,
              updated_at
          `,
          [roleSlug]
        )

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Active career role not found',
        })
      }

      return res.status(200).json({
        success: true,

        message:
          'Career role deleted successfully',

        role:
          mapAdminCareerRole({
            ...result.rows[0],
            topic_count: 0,
            lesson_count: 0,
          }),
      })
    } catch (error) {
      console.error(
        'Admin delete career role error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to delete career role',
      })
    }
  }
)
/*
|--------------------------------------------------------------------------
| ADMIN TOPIC MANAGEMENT
|--------------------------------------------------------------------------
|
| PostgreSQL-backed topic CRUD.
|
| Routes:
|
| GET
| /api/admin/roles/:roleSlug/topics
|
| POST
| /api/admin/roles/:roleSlug/topics
|
| GET
| /api/admin/roles/:roleSlug/topics/:topicSlug
|
| PUT
| /api/admin/roles/:roleSlug/topics/:topicSlug
|
| DELETE
| /api/admin/roles/:roleSlug/topics/:topicSlug
|
| Topic deletion is a soft delete.
|
*/


/*
|--------------------------------------------------------------------------
| HELPER: NORMALIZE TOPIC SLUG
|--------------------------------------------------------------------------
*/

function normalizeTopicSlug(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}


/*
|--------------------------------------------------------------------------
| HELPER: MAP ADMIN TOPIC
|--------------------------------------------------------------------------
*/

function mapAdminTopic(row) {
  return {
    id:
      Number(row.id),

    careerRoleId:
      Number(
        row.career_role_id
      ),

    slug:
      row.slug,

    title:
      row.title,

    description:
      row.description ?? '',

    duration:
      row.duration ?? '',

    position:
      Number(row.position),

    isActive:
      row.is_active === true,

    lessonCount:
      Number(
        row.lesson_count || 0
      ),

    assessmentConfigured:
      Number(
        row.assessment_count || 0
      ) > 0,

    assessmentCount:
      Number(
        row.assessment_count || 0
      ),

    questionCount:
      Number(
        row.question_count || 0
      ),

    passingScore:
      row.passing_score ===
      null ||
      row.passing_score ===
      undefined
        ? null
        : Number(
            row.passing_score
          ),

    createdAt:
      row.created_at,

    updatedAt:
      row.updated_at,
  }
}


/*
|--------------------------------------------------------------------------
| GET ALL ACTIVE TOPICS FOR CAREER ROLE
|--------------------------------------------------------------------------
*/

router.get(
  '/roles/:roleSlug/topics',
  ...adminOnly,
  async (req, res) => {
    const roleSlug =
      normalizeRoleSlug(
        req.params.roleSlug
      )

    if (!roleSlug) {
      return res.status(400).json({
        success: false,
        message:
          'Career role is required',
      })
    }

    try {
      /*
      |--------------------------------------------------------------------------
      | FIND ACTIVE ROLE
      |--------------------------------------------------------------------------
      */

      const roleResult =
        await pool.query(
          `
            SELECT
              id,
              slug,
              title,
              description,
              is_active,
              created_at,
              updated_at

            FROM career_roles

            WHERE slug = $1
              AND is_active = TRUE

            LIMIT 1
          `,
          [roleSlug]
        )

      if (
        roleResult.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Active career role not found',
        })
      }

      const role =
        roleResult.rows[0]

      /*
      |--------------------------------------------------------------------------
      | GET TOPICS + REAL COUNTS
      |--------------------------------------------------------------------------
      */

      const topicsResult =
        await pool.query(
          `
            SELECT
              t.id,
              t.career_role_id,
              t.slug,
              t.title,
              t.description,
              t.duration,
              t.position,
              t.is_active,
              t.created_at,
              t.updated_at,

              (
                SELECT COUNT(*)::int
                FROM lessons l
                WHERE l.topic_id = t.id
                  AND l.is_active = TRUE
              ) AS lesson_count,

              (
                SELECT COUNT(*)::int
                FROM assessments a
                WHERE a.topic_id = t.id
                  AND a.is_active = TRUE
              ) AS assessment_count,

              (
                SELECT COUNT(*)::int

                FROM assessment_questions aq

                INNER JOIN assessments a
                  ON a.id =
                     aq.assessment_id

                WHERE a.topic_id = t.id
                  AND a.is_active = TRUE
                  AND aq.is_active = TRUE
              ) AS question_count,

              (
                SELECT a.passing_score

                FROM assessments a

                WHERE a.topic_id = t.id
                  AND a.is_active = TRUE

                ORDER BY a.id ASC

                LIMIT 1
              ) AS passing_score

            FROM topics t

            WHERE t.career_role_id = $1
              AND t.is_active = TRUE

            ORDER BY
              t.position ASC,
              t.id ASC
          `,
          [role.id]
        )

      const topics =
        topicsResult.rows.map(
          mapAdminTopic
        )

      const totalLessons =
        topics.reduce(
          (total, topic) =>
            total +
            topic.lessonCount,
          0
        )

      const configuredAssessments =
        topics.filter(
          (topic) =>
            topic.assessmentConfigured
        ).length

      const assessmentCoverage =
        topics.length > 0
          ? Math.round(
              (
                configuredAssessments /
                topics.length
              ) * 100
            )
          : 0

      return res.status(200).json({
        success: true,

        role: {
          id:
            Number(role.id),

          slug:
            role.slug,

          title:
            role.title,

          description:
            role.description ?? '',

          isActive:
            role.is_active === true,

          createdAt:
            role.created_at,

          updatedAt:
            role.updated_at,
        },

        topics,

        topicCount:
          topics.length,

        totalLessons,

        configuredAssessments,

        assessmentCoverage,
      })
    } catch (error) {
      console.error(
        'Admin get role topics error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve career role topics',
      })
    }
  }
)


/*
|--------------------------------------------------------------------------
| CREATE TOPIC
|--------------------------------------------------------------------------
|
| Expected body:
|
| {
|   "title": "Android Fundamentals",
|   "slug": "android-fundamentals",
|   "description": "...",
|   "duration": "6 hours"
| }
|
| position is assigned automatically.
|
*/

router.post(
  '/roles/:roleSlug/topics',
  ...adminOnly,
  async (req, res) => {
    const roleSlug =
      normalizeRoleSlug(
        req.params.roleSlug
      )

    const title =
      String(
        req.body.title || ''
      ).trim()

    const suppliedSlug =
      String(
        req.body.slug || ''
      ).trim()

    const topicSlug =
      normalizeTopicSlug(
        suppliedSlug || title
      )

    const description =
      String(
        req.body.description || ''
      ).trim()

    const duration =
      String(
        req.body.duration || ''
      ).trim()

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!roleSlug) {
      return res.status(400).json({
        success: false,
        message:
          'Career role is required',
      })
    }

    if (title.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          'Topic title must contain at least 2 characters',
      })
    }

    if (title.length > 200) {
      return res.status(400).json({
        success: false,
        message:
          'Topic title cannot exceed 200 characters',
      })
    }

    if (!topicSlug) {
      return res.status(400).json({
        success: false,
        message:
          'A valid topic slug is required',
      })
    }

    if (
      topicSlug.length > 120
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Topic slug cannot exceed 120 characters',
      })
    }

    if (duration.length > 50) {
      return res.status(400).json({
        success: false,
        message:
          'Topic duration cannot exceed 50 characters',
      })
    }

    const client =
      await pool.connect()

    try {
      await client.query(
        'BEGIN'
      )

      /*
      |--------------------------------------------------------------------------
      | FIND + LOCK ACTIVE ROLE
      |--------------------------------------------------------------------------
      */

      const roleResult =
        await client.query(
          `
            SELECT
              id,
              slug,
              title

            FROM career_roles

            WHERE slug = $1
              AND is_active = TRUE

            FOR UPDATE
          `,
          [roleSlug]
        )

      if (
        roleResult.rows.length === 0
      ) {
        await client.query(
          'ROLLBACK'
        )

        return res.status(404).json({
          success: false,
          message:
            'Active career role not found',
        })
      }

      const role =
        roleResult.rows[0]

      /*
      |--------------------------------------------------------------------------
      | CHECK SLUG FOR THIS ROLE
      |--------------------------------------------------------------------------
      |
      | Includes inactive topics because the database unique constraint still
      | owns the slug after a soft delete.
      |
      */

      const existingTopic =
        await client.query(
          `
            SELECT
              id,
              is_active

            FROM topics

            WHERE career_role_id = $1
              AND slug = $2

            LIMIT 1
          `,
          [
            role.id,
            topicSlug,
          ]
        )

      if (
        existingTopic.rows.length >
        0
      ) {
        await client.query(
          'ROLLBACK'
        )

        return res.status(409).json({
          success: false,

          message:
            existingTopic.rows[0]
              .is_active === true
              ? 'A topic with this slug already exists in this career role'
              : 'This topic slug belongs to a previously deleted topic in this career role',
        })
      }

      /*
      |--------------------------------------------------------------------------
      | NEXT POSITION
      |--------------------------------------------------------------------------
      */

      const positionResult =
        await client.query(
          `
            SELECT
              COALESCE(
                MAX(position),
                0
              ) + 1
                AS next_position

            FROM topics

            WHERE career_role_id = $1
          `,
          [role.id]
        )

      const position =
        Number(
          positionResult.rows[0]
            .next_position
        )

      /*
      |--------------------------------------------------------------------------
      | INSERT TOPIC
      |--------------------------------------------------------------------------
      */

      const topicResult =
        await client.query(
          `
            INSERT INTO topics (
              career_role_id,
              slug,
              title,
              description,
              duration,
              position,
              is_active
            )

            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              TRUE
            )

            RETURNING
              id,
              career_role_id,
              slug,
              title,
              description,
              duration,
              position,
              is_active,
              created_at,
              updated_at
          `,
          [
            role.id,
            topicSlug,
            title,
            description || null,
            duration || null,
            position,
          ]
        )

      await client.query(
        'COMMIT'
      )

      return res.status(201).json({
        success: true,

        message:
          'Topic created successfully',

        role: {
          id:
            Number(role.id),

          slug:
            role.slug,

          title:
            role.title,
        },

        topic:
          mapAdminTopic({
            ...topicResult.rows[0],

            lesson_count: 0,

            assessment_count: 0,

            question_count: 0,

            passing_score: null,
          }),
      })
    } catch (error) {
      await client.query(
        'ROLLBACK'
      )

      console.error(
        'Admin create topic error:',
        error
      )

      if (
        error.code === '23505'
      ) {
        return res.status(409).json({
          success: false,
          message:
            'A topic with this slug already exists in this career role',
        })
      }

      return res.status(500).json({
        success: false,
        message:
          'Unable to create topic',
      })
    } finally {
      client.release()
    }
  }
)


/*
|--------------------------------------------------------------------------
| GET ONE ACTIVE TOPIC
|--------------------------------------------------------------------------
*/

router.get(
  '/roles/:roleSlug/topics/:topicSlug',
  ...adminOnly,
  async (req, res) => {
    const roleSlug =
      normalizeRoleSlug(
        req.params.roleSlug
      )

    const topicSlug =
      normalizeTopicSlug(
        req.params.topicSlug
      )

    if (
      !roleSlug ||
      !topicSlug
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Career role and topic are required',
      })
    }

    try {
      const result =
        await pool.query(
          `
            SELECT
              t.id,
              t.career_role_id,
              t.slug,
              t.title,
              t.description,
              t.duration,
              t.position,
              t.is_active,
              t.created_at,
              t.updated_at,

              cr.slug AS role_slug,
              cr.title AS role_title,

              (
                SELECT COUNT(*)::int
                FROM lessons l
                WHERE l.topic_id = t.id
                  AND l.is_active = TRUE
              ) AS lesson_count,

              (
                SELECT COUNT(*)::int
                FROM assessments a
                WHERE a.topic_id = t.id
                  AND a.is_active = TRUE
              ) AS assessment_count,

              (
                SELECT COUNT(*)::int

                FROM assessment_questions aq

                INNER JOIN assessments a
                  ON a.id =
                     aq.assessment_id

                WHERE a.topic_id = t.id
                  AND a.is_active = TRUE
                  AND aq.is_active = TRUE
              ) AS question_count,

              (
                SELECT a.passing_score

                FROM assessments a

                WHERE a.topic_id = t.id
                  AND a.is_active = TRUE

                ORDER BY a.id ASC

                LIMIT 1
              ) AS passing_score

            FROM topics t

            INNER JOIN career_roles cr
              ON cr.id =
                 t.career_role_id

            WHERE cr.slug = $1
              AND t.slug = $2
              AND cr.is_active = TRUE
              AND t.is_active = TRUE

            LIMIT 1
          `,
          [
            roleSlug,
            topicSlug,
          ]
        )

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Active topic not found',
        })
      }

      const row =
        result.rows[0]

      return res.status(200).json({
        success: true,

        role: {
          id:
            Number(
              row.career_role_id
            ),

          slug:
            row.role_slug,

          title:
            row.role_title,
        },

        topic:
          mapAdminTopic(row),
      })
    } catch (error) {
      console.error(
        'Admin get topic error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to retrieve topic',
      })
    }
  }
)


/*
|--------------------------------------------------------------------------
| UPDATE TOPIC
|--------------------------------------------------------------------------
|
| Topic slug is intentionally kept stable.
|
*/

router.put(
  '/roles/:roleSlug/topics/:topicSlug',
  ...adminOnly,
  async (req, res) => {
    const roleSlug =
      normalizeRoleSlug(
        req.params.roleSlug
      )

    const topicSlug =
      normalizeTopicSlug(
        req.params.topicSlug
      )

    const title =
      String(
        req.body.title || ''
      ).trim()

    const description =
      String(
        req.body.description || ''
      ).trim()

    const duration =
      String(
        req.body.duration || ''
      ).trim()

    if (
      !roleSlug ||
      !topicSlug
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Career role and topic are required',
      })
    }

    if (title.length < 2) {
      return res.status(400).json({
        success: false,
        message:
          'Topic title must contain at least 2 characters',
      })
    }

    if (title.length > 200) {
      return res.status(400).json({
        success: false,
        message:
          'Topic title cannot exceed 200 characters',
      })
    }

    if (duration.length > 50) {
      return res.status(400).json({
        success: false,
        message:
          'Topic duration cannot exceed 50 characters',
      })
    }

    try {
      const result =
        await pool.query(
          `
            UPDATE topics t

            SET
              title = $1,
              description = $2,
              duration = $3,
              updated_at =
                CURRENT_TIMESTAMP

            FROM career_roles cr

            WHERE cr.slug = $4
              AND cr.is_active = TRUE

              AND t.career_role_id =
                  cr.id

              AND t.slug = $5
              AND t.is_active = TRUE

            RETURNING
              t.id,
              t.career_role_id,
              t.slug,
              t.title,
              t.description,
              t.duration,
              t.position,
              t.is_active,
              t.created_at,
              t.updated_at
          `,
          [
            title,
            description || null,
            duration || null,
            roleSlug,
            topicSlug,
          ]
        )

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Active topic not found',
        })
      }

      /*
      |--------------------------------------------------------------------------
      | REFRESH COUNTS
      |--------------------------------------------------------------------------
      */

      const topicId =
        result.rows[0].id

      const counts =
        await pool.query(
          `
            SELECT

              (
                SELECT COUNT(*)::int
                FROM lessons
                WHERE topic_id = $1
                  AND is_active = TRUE
              ) AS lesson_count,

              (
                SELECT COUNT(*)::int
                FROM assessments
                WHERE topic_id = $1
                  AND is_active = TRUE
              ) AS assessment_count,

              (
                SELECT COUNT(*)::int

                FROM assessment_questions aq

                INNER JOIN assessments a
                  ON a.id =
                     aq.assessment_id

                WHERE a.topic_id = $1
                  AND a.is_active = TRUE
                  AND aq.is_active = TRUE
              ) AS question_count,

              (
                SELECT passing_score

                FROM assessments

                WHERE topic_id = $1
                  AND is_active = TRUE

                ORDER BY id ASC

                LIMIT 1
              ) AS passing_score
          `,
          [topicId]
        )

      return res.status(200).json({
        success: true,

        message:
          'Topic updated successfully',

        topic:
          mapAdminTopic({
            ...result.rows[0],
            ...counts.rows[0],
          }),
      })
    } catch (error) {
      console.error(
        'Admin update topic error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to update topic',
      })
    }
  }
)


/*
|--------------------------------------------------------------------------
| SOFT DELETE TOPIC
|--------------------------------------------------------------------------
|
| We do not physically delete topics because lessons, assessments,
| live sessions and historical employee activity can reference them.
|
*/

router.delete(
  '/roles/:roleSlug/topics/:topicSlug',
  ...adminOnly,
  async (req, res) => {
    const roleSlug =
      normalizeRoleSlug(
        req.params.roleSlug
      )

    const topicSlug =
      normalizeTopicSlug(
        req.params.topicSlug
      )

    if (
      !roleSlug ||
      !topicSlug
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Career role and topic are required',
      })
    }

    try {
      const result =
        await pool.query(
          `
            UPDATE topics t

            SET
              is_active = FALSE,
              updated_at =
                CURRENT_TIMESTAMP

            FROM career_roles cr

            WHERE cr.slug = $1
              AND cr.is_active = TRUE

              AND t.career_role_id =
                  cr.id

              AND t.slug = $2
              AND t.is_active = TRUE

            RETURNING
              t.id,
              t.career_role_id,
              t.slug,
              t.title,
              t.description,
              t.duration,
              t.position,
              t.is_active,
              t.created_at,
              t.updated_at
          `,
          [
            roleSlug,
            topicSlug,
          ]
        )

      if (
        result.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Active topic not found',
        })
      }

      return res.status(200).json({
        success: true,

        message:
          'Topic deleted successfully',

        topic:
          mapAdminTopic({
            ...result.rows[0],

            lesson_count: 0,

            assessment_count: 0,

            question_count: 0,

            passing_score: null,
          }),
      })
    } catch (error) {
      console.error(
        'Admin delete topic error:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Unable to delete topic',
      })
    }
  }
)

module.exports = router