require('dotenv').config()

const fs = require('fs')
const path = require('path')
const pool = require('../../config/db')

const dataPath = path.join(
  __dirname,
  'data',
  'lessons.generated.json'
)

async function seedLessons() {
  const client = await pool.connect()

  try {
    const rawData = fs.readFileSync(
      dataPath,
      'utf8'
    )

    const lessons = JSON.parse(rawData)

    if (!Array.isArray(lessons)) {
      throw new Error(
        'Lesson seed data must be an array'
      )
    }

    console.log(
      `Found ${lessons.length} lessons to seed.`
    )

    await client.query('BEGIN')

    let insertedOrUpdated = 0

    for (const lesson of lessons) {
      const topicResult =
        await client.query(
          `
            SELECT t.id
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
            lesson.roleSlug,
            lesson.topicSlug,
          ]
        )

      if (topicResult.rows.length === 0) {
        throw new Error(
          `Topic not found: ${lesson.roleSlug}/${lesson.topicSlug}`
        )
      }

      const topicId =
        topicResult.rows[0].id

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
            true
          )
          ON CONFLICT (
            topic_id,
            position
          )
          DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            content = EXCLUDED.content,
            resources = EXCLUDED.resources,
            estimated_minutes =
              EXCLUDED.estimated_minutes,
            is_active = true,
            updated_at =
              CURRENT_TIMESTAMP
        `,
        [
          topicId,
          lesson.title,
          lesson.description ?? null,
          JSON.stringify(
            lesson.content ?? []
          ),
          JSON.stringify(
            lesson.resources ?? []
          ),
          lesson.position,
          lesson.estimatedMinutes ?? null,
        ]
      )

      insertedOrUpdated += 1
    }

    await client.query('COMMIT')

    console.log(
      `Successfully seeded ${insertedOrUpdated} lessons.`
    )
  } catch (error) {
    await client.query('ROLLBACK')

    console.error(
      'Failed to seed lessons:',
      error
    )

    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

seedLessons()