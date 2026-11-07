require('dotenv').config()

const fs = require('fs')
const path = require('path')

const pool = require('../../config/db')

const dataPath = path.join(
  __dirname,
  'data',
  'assessments.generated.json'
)

async function seedAssessments() {
  const client = await pool.connect()

  try {
    console.log(
      'Reading generated assessment data...'
    )

    const rawData =
      fs.readFileSync(
        dataPath,
        'utf8'
      )

    const assessments =
      JSON.parse(rawData)

    if (!Array.isArray(assessments)) {
      throw new Error(
        'Assessment seed data must be an array.'
      )
    }

    console.log(
      `Found ${assessments.length} assessments.`
    )

    await client.query('BEGIN')

    let assessmentCount = 0
    let questionCount = 0
    let optionCount = 0

    for (
      const assessment
      of assessments
    ) {
      // ------------------------------------------------------
      // Find the topic using role slug + topic slug.
      // ------------------------------------------------------

      const topicResult =
        await client.query(
          `
            SELECT
              t.id
            FROM topics t
            INNER JOIN career_roles cr
              ON cr.id = t.career_role_id
            WHERE cr.slug = $1
              AND t.slug = $2
            LIMIT 1
          `,
          [
            assessment.roleSlug,
            assessment.topicSlug,
          ]
        )

      if (
        topicResult.rows.length === 0
      ) {
        throw new Error(
          `Topic not found: ${assessment.roleSlug}/${assessment.topicSlug}`
        )
      }

      const topicId =
        topicResult.rows[0].id

      // ------------------------------------------------------
      // Insert/update assessment.
      // ------------------------------------------------------

      const assessmentResult =
        await client.query(
          `
            INSERT INTO assessments (
              topic_id,
              title,
              passing_score,
              duration_minutes,
              is_active,
              updated_at
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              TRUE,
              CURRENT_TIMESTAMP
            )
            ON CONFLICT (topic_id)
            DO UPDATE SET
              title = EXCLUDED.title,
              passing_score =
                EXCLUDED.passing_score,
              duration_minutes =
                EXCLUDED.duration_minutes,
              is_active = TRUE,
              updated_at =
                CURRENT_TIMESTAMP
            RETURNING id
          `,
          [
            topicId,
            assessment.title,
            assessment.passingScore,
            assessment.durationMinutes,
          ]
        )

      const assessmentId =
        assessmentResult.rows[0].id

      assessmentCount += 1

      // ------------------------------------------------------
      // Replace questions/options for this assessment.
      //
      // This makes the seed repeatable and prevents stale
      // questions from remaining when source data changes.
      // ------------------------------------------------------

      await client.query(
        `
          DELETE FROM assessment_questions
          WHERE assessment_id = $1
        `,
        [assessmentId]
      )

      for (
        const question
        of assessment.questions
      ) {
        const questionResult =
          await client.query(
            `
              INSERT INTO assessment_questions (
                assessment_id,
                question,
                position,
                is_active,
                updated_at
              )
              VALUES (
                $1,
                $2,
                $3,
                TRUE,
                CURRENT_TIMESTAMP
              )
              RETURNING id
            `,
            [
              assessmentId,
              question.question,
              question.position,
            ]
          )

        const questionId =
          questionResult.rows[0].id

        questionCount += 1

        for (
          const option
          of question.options
        ) {
          await client.query(
            `
              INSERT INTO assessment_options (
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
            `,
            [
              questionId,
              option.text,
              option.isCorrect,
              option.position,
            ]
          )

          optionCount += 1
        }
      }
    }

    await client.query('COMMIT')

    console.log(
      'Assessment seed completed successfully.'
    )

    console.log(
      `Assessments: ${assessmentCount}`
    )

    console.log(
      `Questions: ${questionCount}`
    )

    console.log(
      `Options: ${optionCount}`
    )
  } catch (error) {
    await client.query('ROLLBACK')

    console.error(
      'Assessment seed failed:',
      error
    )

    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

seedAssessments()