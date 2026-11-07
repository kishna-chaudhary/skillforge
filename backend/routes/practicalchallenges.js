const express = require('express')
const pool = require('../config/db')
const { authenticate } = require('../middleware/auth')

const {
  evaluatePracticalChallenge,
} = require('../services/practicalChallengeEvaluator')

const router = express.Router()


// ============================================================
// HELPER
//
// Calculates whether a user has passed an assessment for every
// active topic belonging to a career role.
//
// PostgreSQL is the authority.
// ============================================================

async function getRoleTopicProgress(
  db,
  userId,
  roleId
) {
  const result =
    await db.query(
      `
        SELECT
          COUNT(*)::int
            AS total_topics,

          COUNT(*) FILTER (
            WHERE EXISTS (
              SELECT 1

              FROM assessments a

              INNER JOIN assessment_attempts aa
                ON aa.assessment_id = a.id

              WHERE a.topic_id = t.id
                AND a.is_active = TRUE
                AND aa.user_id = $1
                AND aa.passed = TRUE
            )
          )::int
            AS completed_topics

        FROM topics t

        WHERE t.career_role_id = $2
          AND t.is_active = TRUE
      `,
      [
        userId,
        roleId,
      ]
    )

  const progress =
    result.rows[0]

  const totalTopics =
    Number(
      progress.total_topics
    )

  const completedTopics =
    Number(
      progress.completed_topics
    )

  const remainingTopics =
    Math.max(
      0,
      totalTopics -
        completedTopics
    )

  const unlocked =
    totalTopics > 0 &&
    completedTopics ===
      totalTopics

  return {
    totalTopics,
    completedTopics,
    remainingTopics,
    unlocked,
  }
}


// ============================================================
// GET PRACTICAL CHALLENGE
//
// GET /api/practical-challenges/:roleSlug
//
// SECURITY:
// - Authentication required.
// - Unlock status calculated from PostgreSQL.
// - Frontend/localStorage does not determine eligibility.
// - hidden_tests are NEVER returned.
// ============================================================

router.get(
  '/:roleSlug',
  authenticate,
  async (req, res) => {
    try {
      const {
        roleSlug,
      } = req.params

      const userId =
        req.user.userId

      // --------------------------------------------------------
      // Find active role + active practical challenge.
      // --------------------------------------------------------

      const challengeResult =
        await pool.query(
          `
            SELECT
              pc.id,
              pc.title,
              pc.description,
              pc.instructions,
              pc.starter_code,
              pc.language,
              pc.visible_tests,
              pc.passing_score,
              pc.duration_minutes,

              cr.id AS role_id,
              cr.slug AS role_slug,
              cr.title AS role_title

            FROM practical_challenges pc

            INNER JOIN career_roles cr
              ON cr.id =
                pc.career_role_id

            WHERE cr.slug = $1
              AND cr.is_active = TRUE
              AND pc.is_active = TRUE

            LIMIT 1
          `,
          [
            roleSlug,
          ]
        )

      if (
        challengeResult.rows.length ===
        0
      ) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Practical challenge not found.',
          })
      }

      const challenge =
        challengeResult.rows[0]

      // --------------------------------------------------------
      // Load topic completion from assessment attempts.
      // --------------------------------------------------------

      const progress =
        await getRoleTopicProgress(
          pool,
          userId,
          challenge.role_id
        )

      // --------------------------------------------------------
      // Check whether employee already has a passing practical
      // challenge attempt.
      // --------------------------------------------------------

      const passedResult =
        await pool.query(
          `
            SELECT EXISTS (
              SELECT 1

              FROM practical_challenge_attempts

              WHERE user_id = $1
                AND practical_challenge_id = $2
                AND passed = TRUE
            ) AS passed
          `,
          [
            userId,
            challenge.id,
          ]
        )

      const passed =
        passedResult.rows[0]
          ?.passed === true

      // --------------------------------------------------------
      // Parse instructions.
      //
      // instructions is TEXT in the database. The seed stores
      // the original frontend string array as JSON text.
      // --------------------------------------------------------

      let instructions = []

      try {
        const parsed =
          JSON.parse(
            challenge.instructions
          )

        if (
          Array.isArray(parsed)
        ) {
          instructions =
            parsed.filter(
              (item) =>
                typeof item ===
                'string'
            )
        }
      } catch {
        instructions = []
      }

      // --------------------------------------------------------
      // visible_tests is JSONB and pg normally returns it as
      // parsed JavaScript data.
      // --------------------------------------------------------

      const visibleTests =
        Array.isArray(
          challenge.visible_tests
        )
          ? challenge.visible_tests
          : []

      // --------------------------------------------------------
      // Response.
      //
      // hidden_tests is deliberately NOT included.
      // --------------------------------------------------------

      return res.json({
        success: true,

        role: {
          id:
            challenge.role_id,

          slug:
            challenge.role_slug,

          title:
            challenge.role_title,
        },

        progress,

        practicalChallenge: {
          id:
            challenge.id,

          title:
            challenge.title,

          description:
            challenge.description,

          instructions,

          starterCode:
            challenge.starter_code,

          language:
            challenge.language,

          visibleTests,

          passingScore:
            Number(
              challenge.passing_score
            ),

          durationMinutes:
            challenge.duration_minutes ==
            null
              ? null
              : Number(
                  challenge.duration_minutes
                ),

          passed,
        },
      })
    } catch (error) {
      console.error(
        'Failed to load practical challenge:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Failed to load practical challenge.',
        })
    }
  }
)


// ============================================================
// SUBMIT PRACTICAL CHALLENGE
//
// POST /api/practical-challenges/:roleSlug/submit
//
// Body:
//
// {
//   "code": "..."
// }
//
// IMPORTANT:
// This endpoint does NOT execute student code.
//
// It only:
//
// 1. Authenticates the employee.
// 2. Re-checks challenge eligibility server-side.
// 3. Validates the submitted code.
// 4. Creates a pending attempt.
//
// Later, an isolated runner will process the pending attempt.
//
// Until then:
//
// score = NULL
// passed = FALSE
// execution_status = "pending"
// ============================================================

router.post(
  '/:roleSlug/submit',
  authenticate,
  async (req, res) => {
    const client =
      await pool.connect()

    try {
      const {
        roleSlug,
      } = req.params

      const userId =
        req.user.userId

      const code =
        typeof req.body?.code ===
        'string'
          ? req.body.code
          : ''

      // --------------------------------------------------------
      // Basic submission validation.
      // --------------------------------------------------------

      if (!code.trim()) {
        return res
          .status(400)
          .json({
            success: false,

            message:
              'Submitted code cannot be empty.',
          })
      }

      // Prevent accidentally storing enormous submissions.
      //
      // 100,000 characters is intentionally generous for the
      // current challenges.

      const MAX_CODE_LENGTH =
        100000

      if (
        code.length >
        MAX_CODE_LENGTH
      ) {
        return res
          .status(413)
          .json({
            success: false,

            message:
              'Submitted code is too large.',
          })
      }

      // --------------------------------------------------------
      // Start transaction.
      // --------------------------------------------------------

      await client.query(
        'BEGIN'
      )

      // --------------------------------------------------------
      // Find active role + challenge.
      //
      // hidden_tests are deliberately not selected here because
      // this endpoint does not execute/evaluate code.
      // --------------------------------------------------------

      const challengeResult =
        await client.query(
          `
            SELECT
              pc.id,
              pc.career_role_id,
              pc.title,
              pc.language,
              pc.passing_score,

              cr.slug AS role_slug,
              cr.title AS role_title

            FROM practical_challenges pc

            INNER JOIN career_roles cr
              ON cr.id =
                pc.career_role_id

            WHERE cr.slug = $1
              AND cr.is_active = TRUE
              AND pc.is_active = TRUE

            LIMIT 1
          `,
          [
            roleSlug,
          ]
        )

      if (
        challengeResult.rows.length ===
        0
      ) {
        await client.query(
          'ROLLBACK'
        )

        return res
          .status(404)
          .json({
            success: false,

            message:
              'Practical challenge not found.',
          })
      }

      const challenge =
        challengeResult.rows[0]

      // --------------------------------------------------------
      // SECURITY:
      //
      // Re-check eligibility on the server.
      //
      // It does not matter whether someone manually calls this
      // API or modifies the frontend. The backend will reject
      // submission until every active topic assessment has been
      // passed.
      // --------------------------------------------------------

      const progress =
        await getRoleTopicProgress(
          client,
          userId,
          challenge.career_role_id
        )

      if (
        !progress.unlocked
      ) {
        await client.query(
          'ROLLBACK'
        )

        return res
          .status(403)
          .json({
            success: false,

            message:
              'Complete and pass all topic assessments before submitting the practical challenge.',

            progress,
          })
      }

      // --------------------------------------------------------
      // Create attempt.
      //
      // NO fake score.
      // NO fake passing status.
      //
      // The isolated runner will later update:
      //
      // execution_status
      // execution_result
      // score
      // passed
      // --------------------------------------------------------

            // --------------------------------------------------------
      // Create the practical challenge attempt.
      // --------------------------------------------------------

      const attemptResult =
        await client.query(
          `
            INSERT INTO practical_challenge_attempts (
              user_id,
              practical_challenge_id,
              submitted_code,
              score,
              passed,
              execution_status,
              execution_result,
              started_at,
              submitted_at
            )

            VALUES (
              $1,
              $2,
              $3,
              NULL,
              FALSE,
              'pending',
              NULL,
              NULL,
              CURRENT_TIMESTAMP
            )

            RETURNING
              id,
              practical_challenge_id,
              score,
              passed,
              execution_status,
              started_at,
              submitted_at
          `,
          [
            userId,
            challenge.id,
            code,
          ]
        )

      let attempt =
        attemptResult.rows[0]

      // --------------------------------------------------------
      // Evaluate the submission.
      //
      // IMPORTANT:
      // evaluatePracticalChallenge performs deterministic static
      // rubric checks only. It does NOT execute submitted code.
      // --------------------------------------------------------

      let evaluation

      try {
        evaluation =
          evaluatePracticalChallenge({
            roleSlug:
              challenge.role_slug,

            submittedCode:
              code,

            passingScore:
              challenge.passing_score,
          })
      } catch (evaluationError) {
        console.error(
          'Practical challenge evaluation failed:',
          evaluationError
        )

        const failedAttemptResult =
          await client.query(
            `
              UPDATE practical_challenge_attempts

              SET
                execution_status = 'failed',
                execution_result = $2::jsonb,
                started_at = CURRENT_TIMESTAMP

              WHERE id = $1

              RETURNING
                id,
                practical_challenge_id,
                score,
                passed,
                execution_status,
                execution_result,
                started_at,
                submitted_at
            `,
            [
              attempt.id,

              JSON.stringify({
                message:
                  'The submission could not be evaluated.',
              }),
            ]
          )

        attempt =
          failedAttemptResult.rows[0]

        await client.query(
          'COMMIT'
        )

        return res
          .status(201)
          .json({
            success: true,

            message:
              'Practical challenge submission was received, but evaluation failed.',

            attempt: {
              id:
                attempt.id,

              practicalChallengeId:
                attempt.practical_challenge_id,

              roleSlug:
                challenge.role_slug,

              score:
                attempt.score,

              passed:
                attempt.passed,

              executionStatus:
                attempt.execution_status,

              startedAt:
                attempt.started_at,

              submittedAt:
                attempt.submitted_at,
            },
          })
      }

      // --------------------------------------------------------
      // Save evaluation result.
      // --------------------------------------------------------

      const evaluatedAttemptResult =
        await client.query(
          `
            UPDATE practical_challenge_attempts

            SET
              score = $2,
              passed = $3,
              execution_status = 'completed',
              execution_result = $4::jsonb,
              started_at = CURRENT_TIMESTAMP

            WHERE id = $1

            RETURNING
              id,
              practical_challenge_id,
              score,
              passed,
              execution_status,
              execution_result,
              started_at,
              submitted_at
          `,
          [
            attempt.id,
            evaluation.score,
            evaluation.passed,
            JSON.stringify(
              evaluation
            ),
          ]
        )

      attempt =
        evaluatedAttemptResult.rows[0]

      await client.query(
        'COMMIT'
      )

      // --------------------------------------------------------
      // Return safe evaluation metadata.
      //
      // No submitted source code or hidden test data is returned.
      // --------------------------------------------------------

      return res
        .status(201)
        .json({
          success: true,

          message:
            attempt.passed
              ? 'Practical challenge passed.'
              : 'Practical challenge evaluated. A passing score was not reached.',

          attempt: {
            id:
              attempt.id,

            practicalChallengeId:
              attempt.practical_challenge_id,

            roleSlug:
              challenge.role_slug,

            score:
              attempt.score,

            passed:
              attempt.passed,

            executionStatus:
              attempt.execution_status,

            startedAt:
              attempt.started_at,

            submittedAt:
              attempt.submitted_at,
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
          'Failed to rollback practical challenge submission:',
          rollbackError
        )
      }

      console.error(
        'Failed to submit practical challenge:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Failed to submit practical challenge.',
        })
    } finally {
      client.release()
    }
  }
)

// ============================================================
// GET LATEST PRACTICAL CHALLENGE ATTEMPT
//
// GET /api/practical-challenges/:roleSlug/attempts/latest
//
// Returns the current user's most recent attempt for the
// practical challenge.
//
// SECURITY:
// - Authentication required.
// - Only attempts belonging to the authenticated user are read.
// - submitted_code is NOT returned.
// - hidden_tests are NEVER returned.
// ============================================================

router.get(
  '/:roleSlug/attempts/latest',
  authenticate,
  async (req, res) => {
    try {
      const {
        roleSlug,
      } = req.params

      const userId =
        req.user.userId

      // --------------------------------------------------------
      // Find active role + active practical challenge.
      // --------------------------------------------------------

      const challengeResult =
        await pool.query(
          `
            SELECT
              pc.id AS practical_challenge_id,
              cr.slug AS role_slug

            FROM practical_challenges pc

            INNER JOIN career_roles cr
              ON cr.id = pc.career_role_id

            WHERE cr.slug = $1
              AND cr.is_active = TRUE
              AND pc.is_active = TRUE

            LIMIT 1
          `,
          [
            roleSlug,
          ]
        )

      if (
        challengeResult.rows.length ===
        0
      ) {
        return res
          .status(404)
          .json({
            success: false,

            message:
              'Practical challenge not found.',
          })
      }

      const challenge =
        challengeResult.rows[0]

      // --------------------------------------------------------
      // Find this user's latest attempt.
      //
      // IMPORTANT:
      // submitted_code is deliberately not selected.
      // --------------------------------------------------------

      const attemptResult =
        await pool.query(
          `
            SELECT
              id,
              practical_challenge_id,
              score,
              passed,
              execution_status,
              started_at,
              submitted_at

            FROM practical_challenge_attempts

            WHERE user_id = $1
              AND practical_challenge_id = $2

            ORDER BY
              submitted_at DESC,
              id DESC

            LIMIT 1
          `,
          [
            userId,
            challenge.practical_challenge_id,
          ]
        )

      // --------------------------------------------------------
      // No submission yet.
      //
      // This is a valid state, so return 200 rather than 404.
      // --------------------------------------------------------

      if (
        attemptResult.rows.length ===
        0
      ) {
        return res.json({
          success: true,

          attempt: null,
        })
      }

      const attempt =
        attemptResult.rows[0]

      // --------------------------------------------------------
      // Return safe attempt metadata.
      // --------------------------------------------------------

      return res.json({
        success: true,

        attempt: {
          id:
            attempt.id,

          practicalChallengeId:
            attempt.practical_challenge_id,

          roleSlug:
            challenge.role_slug,

          score:
            attempt.score == null
              ? null
              : Number(
                  attempt.score
                ),

          passed:
            attempt.passed === true,

          executionStatus:
            attempt.execution_status,

          startedAt:
            attempt.started_at,

          submittedAt:
            attempt.submitted_at,
        },
      })
    } catch (error) {
      console.error(
        'Failed to load latest practical challenge attempt:',
        error
      )

      return res
        .status(500)
        .json({
          success: false,

          message:
            'Failed to load latest practical challenge attempt.',
        })
    }
  }
)




module.exports = router