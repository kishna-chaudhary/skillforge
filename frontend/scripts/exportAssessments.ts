import fs from 'node:fs'
import path from 'node:path'

import {
  topicQuizData,
} from '../src/data/topicQuizData'

interface ExportedOption {
  text: string
  isCorrect: boolean
  position: number
}

interface ExportedQuestion {
  question: string
  position: number
  options: ExportedOption[]
}

interface ExportedAssessment {
  roleSlug: string
  topicSlug: string
  title: string
  passingScore: number
  durationMinutes: number
  questions: ExportedQuestion[]
}

const assessments: ExportedAssessment[] =
  Object.entries(topicQuizData).map(
    ([topicKey, quiz]) => {
      const separatorIndex =
        topicKey.indexOf('/')

      if (separatorIndex === -1) {
        throw new Error(
          `Invalid quiz key: ${topicKey}`
        )
      }

      const roleSlug =
        topicKey.slice(
          0,
          separatorIndex
        )

      const topicSlug =
        topicKey.slice(
          separatorIndex + 1
        )

      if (
        !roleSlug ||
        !topicSlug
      ) {
        throw new Error(
          `Invalid quiz key: ${topicKey}`
        )
      }

      return {
        roleSlug,
        topicSlug,

        title:
          quiz.title,

        passingScore:
          quiz.passingScore,

        // Current Quiz.tsx uses a
        // fixed 10-minute timer.
        durationMinutes: 10,

        questions:
          quiz.questions.map(
            (
              question,
              questionIndex
            ) => ({
              question:
                question.question,

              position:
                questionIndex,

              options:
                question.options.map(
                  (
                    option,
                    optionIndex
                  ) => ({
                    text: option,

                    isCorrect:
                      optionIndex ===
                      question.correctAnswer,

                    position:
                      optionIndex,
                  })
                ),
            })
          ),
      }
    }
  )

for (
  const assessment
  of assessments
) {
  if (
    assessment.questions.length === 0
  ) {
    throw new Error(
      `Assessment has no questions: ${assessment.roleSlug}/${assessment.topicSlug}`
    )
  }

  for (
    const question
    of assessment.questions
  ) {
    const correctOptions =
      question.options.filter(
        (option) =>
          option.isCorrect
      )

    if (
      correctOptions.length !== 1
    ) {
      throw new Error(
        `Question must have exactly one correct answer: ${assessment.roleSlug}/${assessment.topicSlug}`
      )
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
    'assessments.generated.json'
  )

fs.writeFileSync(
  outputPath,
  JSON.stringify(
    assessments,
    null,
    2
  ),
  'utf8'
)

const questionCount =
  assessments.reduce(
    (total, assessment) =>
      total +
      assessment.questions.length,
    0
  )

const optionCount =
  assessments.reduce(
    (total, assessment) =>
      total +
      assessment.questions.reduce(
        (
          questionTotal,
          question
        ) =>
          questionTotal +
          question.options.length,
        0
      ),
    0
  )

console.log(
  `Exported ${assessments.length} assessments.`
)

console.log(
  `Exported ${questionCount} questions.`
)

console.log(
  `Exported ${optionCount} options.`
)

console.log(
  `Output: ${outputPath}`
)