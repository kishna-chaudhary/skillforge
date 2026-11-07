import fs from 'node:fs'
import path from 'node:path'

import {
  roadmapData,
} from '../src/data/roadmapData'

import {
  lessonTitles,
} from '../src/data/lessonTitles'

import {
  detailedLessonData,
} from '../src/data/detailedLessonData'

interface ExportedLesson {
  roleSlug: string
  topicSlug: string
  title: string
  description: string
  content: string[]
  resources: {
    title: string
    type: string
    url: string
  }[]
  position: number
  estimatedMinutes: number
}

const lessons: ExportedLesson[] = []

function parseMinutes(
  duration: string
): number {
  const match =
    duration.match(/\d+/)

  if (!match) {
    return 45
  }

  return Number(match[0])
}

for (
  const [
    roleSlug,
    roadmap,
  ] of Object.entries(roadmapData)
) {
  for (const topic of roadmap.topics) {
    const key =
      `${roleSlug}/${topic.id}`

    const detailedTopic =
      detailedLessonData[key]

    /*
     * Detailed lesson content has priority.
     */
    if (detailedTopic) {
      detailedTopic.lessons.forEach(
        (lesson, index) => {
          lessons.push({
            roleSlug,
            topicSlug: topic.id,
            title: lesson.title,
            description:
              lesson.description,
            content:
              lesson.content,
            resources:
              lesson.resources,
            position: index,
            estimatedMinutes:
              parseMinutes(
                lesson.duration
              ),
          })
        }
      )

      continue
    }

    /*
     * Otherwise reproduce the existing
     * automatic lesson generator.
     */
    const customTitles =
      lessonTitles[key] ?? []

    for (
      let index = 0;
      index < topic.lessons;
      index += 1
    ) {
      const title =
        customTitles[index] ??
        `${topic.title} - Lesson ${index + 1}`

      const estimatedMinutes =
        index ===
        topic.lessons - 1
          ? 60
          : 45

      lessons.push({
        roleSlug,
        topicSlug: topic.id,
        title,

        description:
          `Learn ${title} as part of ${topic.title}.`,

        content: [
          `${title} is an important part of ${topic.title}.`,

          topic.description,

          `In this lesson, you will learn the main concepts related to ${title}.`,

          `Understand how ${title} is used in practical ${roleSlug.replaceAll(
            '-',
            ' '
          )} environments.`,

          `Practice the concepts covered in ${title} before moving to the next lesson.`,
        ],

        resources: [
          {
            title:
              `${title} Tutorial`,

            type: 'Video',

            url:
              `https://www.youtube.com/results?search_query=${encodeURIComponent(
                `${title} tutorial for beginners`
              )}`,
          },
        ],

        position: index,
        estimatedMinutes,
      })
    }
  }
}

const outputDirectory =
  path.resolve(
    process.cwd(),
    '../backend/database/seeds/data'
  )

fs.mkdirSync(
  outputDirectory,
  {
    recursive: true,
  }
)

const outputPath =
  path.join(
    outputDirectory,
    'lessons.generated.json'
  )

fs.writeFileSync(
  outputPath,
  JSON.stringify(
    lessons,
    null,
    2
  ),
  'utf8'
)

console.log(
  `Exported ${lessons.length} lessons.`
)

console.log(
  `Detailed topics: ${Object.keys(
    detailedLessonData
  ).length}`
)

console.log(
  `Output: ${outputPath}`
)