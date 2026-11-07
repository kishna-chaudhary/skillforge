const express = require('express')
const pool = require('../config/db')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

// ============================================================
// GET TOPIC ASSESSMENT
//
// Returns safe assessment data to the authenticated employee.
//
// SECURITY:
// - Correct answers are never returned.
// - assessment_options.is_correct stays server-side.
// - Lesson completion is checked by the frontend for display,
//   but the authoritative security check happens when the
//   assessment is submitted.
// ============================================================

router.get(
  '/:roleSlug/topics/:topicSlug',
  authenticate,
  async (req, res) => {
    try {
      const {
        roleSlug,
        topicSlug,
      } = req.params

      // --------------------------------------------------------
      // Find role, topic and active assessment.
      //
      // Also return the number of active lessons so the
      // frontend can determine whether the quiz is unlocked.
      // --------------------------------------------------------

      const assessmentResult =
        await pool.query(
          `
            SELECT
              a.id,
              a.title,
              a.description,
              a.passing_score,
              a.duration_minutes,

              t.id AS topic_id,
              t.slug AS topic_slug,
              t.title AS topic_title,

              (
                SELECT COUNT(*)::int
                FROM lessons l
                WHERE l.topic_id = t.id
                  AND l.is_active = TRUE
              ) AS lesson_count,

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

            LIMIT 1
          `,
          [
            roleSlug,
            topicSlug,
          ]
        )

      if (
        assessmentResult.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message: 'Assessment not found.',
        })
      }

      const assessment =
        assessmentResult.rows[0]

      // --------------------------------------------------------
      // Fetch active questions.
      // --------------------------------------------------------

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
          (question) => question.id
        )

      let options = []

      // --------------------------------------------------------
      // Fetch options.
      //
      // SECURITY:
      // is_correct is deliberately NOT selected here.
      // --------------------------------------------------------

      if (questionIds.length > 0) {
        const optionsResult =
          await pool.query(
            `
              SELECT
                id,
                question_id,
                option_text,
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

        options = optionsResult.rows
      }

      // --------------------------------------------------------
      // Build safe question objects.
      // --------------------------------------------------------

      const questions =
        questionsResult.rows.map(
          (question) => ({
            id: question.id,

            question:
              question.question,

            position:
              question.position,

            options:
              options
                .filter(
                  (option) =>
                    String(
                      option.question_id
                    ) ===
                    String(
                      question.id
                    )
                )
                .map(
                  (option) => ({
                    id: option.id,

                    text:
                      option.option_text,

                    position:
                      option.position,
                  })
                ),
          })
        )

      // --------------------------------------------------------
      // Response
      // --------------------------------------------------------

      return res.json({
        success: true,

        role: {
          id:
            assessment.role_id,

          slug:
            assessment.role_slug,

          title:
            assessment.role_title,
        },

        topic: {
          id:
            assessment.topic_id,

          slug:
            assessment.topic_slug,

          title:
            assessment.topic_title,

          lessonCount:
            Number(
              assessment.lesson_count
            ),
        },

        assessment: {
          id:
            assessment.id,

          title:
            assessment.title,

          description:
            assessment.description,

          passingScore:
            Number(
              assessment.passing_score
            ),

          durationMinutes:
            Number(
              assessment.duration_minutes
            ),

          questions,
        },
      })
    } catch (error) {
      console.error(
        'Failed to load assessment:',
        error
      )

      return res.status(500).json({
        success: false,
        message:
          'Failed to load assessment.',
      })
    }
  }
)

// ============================================================
// SUBMIT ASSESSMENT
//
// The browser sends:
//
// [
//   {
//     questionId,
//     selectedOptionId
//   }
// ]
//
// SECURITY:
// - The browser does not calculate the authoritative score.
// - The browser never receives correct-answer information.
// - Question and option ownership is validated here.
// - Unanswered questions count as incorrect.
// - Lesson completion is verified server-side before scoring.
// ============================================================

router.post(
  '/:roleSlug/topics/:topicSlug/submit',
  authenticate,
  async (req, res) => {
    const client =
      await pool.connect()

    let transactionStarted = false

    try {
      const {
        roleSlug,
        topicSlug,
      } = req.params

      const {
        answers,
        integrityEventCount = 0,
        startedAt = null,
      } = req.body

      // --------------------------------------------------------
      // Validate request.
      // --------------------------------------------------------

      if (!Array.isArray(answers)) {
        return res.status(400).json({
          success: false,
          message:
            'Answers must be an array.',
        })
      }

      // --------------------------------------------------------
      // Find active assessment.
      //
      // We also retrieve topic_id because it is used by the
      // lesson-completion eligibility check below.
      // --------------------------------------------------------

      const assessmentResult =
        await client.query(
          `
            SELECT
              a.id,
              a.passing_score,
              t.id AS topic_id

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

            LIMIT 1
          `,
          [
            roleSlug,
            topicSlug,
          ]
        )

      if (
        assessmentResult.rows.length === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            'Assessment not found.',
        })
      }

      const assessment =
        assessmentResult.rows[0]

      // ========================================================
      // SERVER-SIDE LESSON COMPLETION CHECK
      //
      // The frontend locks the quiz until all lessons have been
      // completed, but frontend checks can be bypassed.
      //
      // Therefore the backend independently verifies that this
      // authenticated user has completed every active lesson
      // belonging to this topic.
      // ========================================================

      const lessonEligibilityResult =
        await client.query(
          `
            SELECT
              (
                SELECT COUNT(*)::int
                FROM lessons l
                WHERE l.topic_id = $1
                  AND l.is_active = TRUE
              ) AS total_lessons,

              (
                SELECT COUNT(
                  DISTINCT lp.lesson_id
                )::int

                FROM lesson_progress lp

                INNER JOIN lessons l
                  ON l.id = lp.lesson_id

                WHERE lp.user_id = $2
                  AND l.topic_id = $1
                  AND l.is_active = TRUE
              ) AS completed_lessons
          `,
          [
            assessment.topic_id,
            req.user.userId,
          ]
        )

      const lessonEligibility =
        lessonEligibilityResult.rows[0]

      const totalLessons =
        Number(
          lessonEligibility.total_lessons
        )

      const completedLessons =
        Number(
          lessonEligibility.completed_lessons
        )

      // --------------------------------------------------------
      // A valid learning topic should contain active lessons.
      //
      // If there are none, fail closed rather than allowing the
      // assessment to be submitted automatically.
      // --------------------------------------------------------

      if (totalLessons <= 0) {
        return res.status(403).json({
          success: false,

          message:
            'This assessment is not available because the topic has no active lessons.',
        })
      }

      // --------------------------------------------------------
      // Reject direct API submissions when all lessons have not
      // been completed by this authenticated user.
      // --------------------------------------------------------

      if (
        completedLessons <
        totalLessons
      ) {
        return res.status(403).json({
          success: false,

          message:
            'Complete all lessons before submitting this assessment.',

          progress: {
            completedLessons,
            totalLessons,

            remainingLessons:
              totalLessons -
              completedLessons,
          },
        })
      }

      // --------------------------------------------------------
      // Fetch questions + options INCLUDING is_correct.
      //
      // This information stays inside the backend.
      // --------------------------------------------------------

      const questionsResult =
        await client.query(
          `
            SELECT
              q.id AS question_id,
              o.id AS option_id,
              o.is_correct

            FROM assessment_questions q

            INNER JOIN assessment_options o
              ON o.question_id = q.id

            WHERE q.assessment_id = $1
              AND q.is_active = TRUE

            ORDER BY
              q.position ASC,
              q.id ASC,
              o.position ASC,
              o.id ASC
          `,
          [assessment.id]
        )

      // --------------------------------------------------------
      // Build:
      //
      // questionId ->
      //   optionId -> isCorrect
      // --------------------------------------------------------

      const questionMap =
        new Map()

      for (
        const row
        of questionsResult.rows
      ) {
        const questionId =
          String(
            row.question_id
          )

        if (
          !questionMap.has(
            questionId
          )
        ) {
          questionMap.set(
            questionId,
            new Map()
          )
        }

        questionMap
          .get(questionId)
          .set(
            String(
              row.option_id
            ),
            row.is_correct
          )
      }

      const totalQuestions =
        questionMap.size

      if (totalQuestions === 0) {
        return res.status(400).json({
          success: false,
          message:
            'Assessment has no active questions.',
        })
      }

      // --------------------------------------------------------
      // Validate submitted answers.
      //
      // Duplicate question IDs are rejected.
      // Options must belong to their submitted question.
      // --------------------------------------------------------

      const submittedAnswers =
        new Map()

      for (
        const answer
        of answers
      ) {
        if (
          answer == null ||
          answer.questionId == null
        ) {
          return res.status(400).json({
            success: false,

            message:
              'Each answer must include a questionId.',
          })
        }

        const questionId =
          String(
            answer.questionId
          )

        if (
          submittedAnswers.has(
            questionId
          )
        ) {
          return res.status(400).json({
            success: false,

            message:
              'Duplicate question answers are not allowed.',
          })
        }

        if (
          !questionMap.has(
            questionId
          )
        ) {
          return res.status(400).json({
            success: false,

            message:
              'An answer contains an invalid question.',
          })
        }

        let selectedOptionId =
          null

        if (
          answer.selectedOptionId !==
            null &&
          answer.selectedOptionId !==
            undefined
        ) {
          selectedOptionId =
            String(
              answer.selectedOptionId
            )

          const validOptions =
            questionMap.get(
              questionId
            )

          if (
            !validOptions.has(
              selectedOptionId
            )
          ) {
            return res.status(400).json({
              success: false,

              message:
                'An answer contains an invalid option.',
            })
          }
        }

        submittedAnswers.set(
          questionId,
          selectedOptionId
        )
      }

      // --------------------------------------------------------
      // Score assessment.
      //
      // Questions missing from the submitted answer array are
      // treated as unanswered and therefore incorrect.
      // --------------------------------------------------------

      let correctAnswers = 0

      const scoredAnswers = []

      for (
        const [
          questionId,
          options,
        ] of questionMap
      ) {
        const selectedOptionId =
          submittedAnswers.has(
            questionId
          )
            ? submittedAnswers.get(
                questionId
              )
            : null

        const isCorrect =
          selectedOptionId !== null &&
          options.get(
            selectedOptionId
          ) === true

        if (isCorrect) {
          correctAnswers += 1
        }

        scoredAnswers.push({
          questionId,
          selectedOptionId,
          isCorrect,
        })
      }

      const score =
        Math.round(
          (
            correctAnswers /
            totalQuestions
          ) * 100
        )

      const passingScore =
        Number(
          assessment.passing_score
        )

      const passed =
        score >= passingScore

      // --------------------------------------------------------
      // Sanitize integrity event count.
      // --------------------------------------------------------

      const parsedIntegrityCount =
        Number(
          integrityEventCount
        )

      const safeIntegrityEventCount =
        Number.isInteger(
          parsedIntegrityCount
        )
          ? Math.max(
              0,
              parsedIntegrityCount
            )
          : 0

      // --------------------------------------------------------
      // Validate startedAt.
      //
      // This is currently supplied by the frontend.
      //
      // A future assessment-attempt start endpoint can make
      // timing fully server-authoritative.
      // --------------------------------------------------------

      let safeStartedAt = null

      if (startedAt) {
        const parsedStartedAt =
          new Date(startedAt)

        if (
          !Number.isNaN(
            parsedStartedAt.getTime()
          )
        ) {
          safeStartedAt =
            parsedStartedAt.toISOString()
        }
      }

      // --------------------------------------------------------
      // Save attempt + answers transactionally.
      // --------------------------------------------------------

      await client.query('BEGIN')

      transactionStarted = true

      const attemptResult =
        await client.query(
          `
            INSERT INTO assessment_attempts (
              user_id,
              assessment_id,
              score,
              correct_answers,
              total_questions,
              passed,
              integrity_event_count,
              started_at,
              submitted_at
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
              CURRENT_TIMESTAMP
            )
            RETURNING
              id,
              submitted_at
          `,
          [
            req.user.userId,
            assessment.id,
            score,
            correctAnswers,
            totalQuestions,
            passed,
            safeIntegrityEventCount,
            safeStartedAt,
          ]
        )

      const attempt =
        attemptResult.rows[0]

      for (
        const answer
        of scoredAnswers
      ) {
        await client.query(
          `
            INSERT INTO assessment_attempt_answers (
              attempt_id,
              question_id,
              selected_option_id,
              is_correct
            )
            VALUES (
              $1,
              $2,
              $3,
              $4
            )
          `,
          [
            attempt.id,
            answer.questionId,
            answer.selectedOptionId,
            answer.isCorrect,
          ]
        )
      }

      await client.query(
        'COMMIT'
      )

      transactionStarted = false

      // --------------------------------------------------------
      // Return result.
      //
      // SECURITY:
      // Do NOT return individual correct answers.
      // --------------------------------------------------------

      return res.json({
        success: true,

        result: {
          attemptId:
            attempt.id,

          score,

          correctAnswers,

          totalQuestions,

          passingScore,

          passed,

          integrityEventCount:
            safeIntegrityEventCount,

          submittedAt:
            attempt.submitted_at,
        },
      })
    } catch (error) {
      if (transactionStarted) {
        try {
          await client.query(
            'ROLLBACK'
          )
        } catch (
          rollbackError
        ) {
          console.error(
            'Failed to roll back assessment transaction:',
            rollbackError
          )
        }
      }

      console.error(
        'Failed to submit assessment:',
        error
      )

      return res.status(500).json({
        success: false,

        message:
          'Failed to submit assessment.',
      })
    } finally {
      client.release()
    }
  }
)

module.exports = router