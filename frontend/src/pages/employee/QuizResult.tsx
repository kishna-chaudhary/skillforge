import {
  Award,
  CheckCircle2,
  RotateCcw,
  XCircle,
} from 'lucide-react'

import {
  useEffect,
} from 'react'

import type {
  ReactNode,
} from 'react'

import {
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'
import { roadmapData } from '../../data/roadmapData'

interface QuizResultState {
  score: number
  correctAnswers: number
  totalQuestions: number
  passingScore: number
}

function QuizResult() {
  const navigate =
    useNavigate()

  const location =
    useLocation()

  const {
    roleId,
    topicId,
  } = useParams()

  /*
  |--------------------------------------------------------------------------
  | ROLE AND TOPIC
  |--------------------------------------------------------------------------
  */

  const topicKey =
    roleId && topicId
      ? `${roleId}/${topicId}`
      : ''

  const role =
    roleId
      ? roadmapData[roleId]
      : undefined

  const topic =
    role?.topics.find(
      (item) =>
        item.id === topicId
    )

  /*
  |--------------------------------------------------------------------------
  | QUIZ RESULT
  |--------------------------------------------------------------------------
  */

  const result =
    location.state as
      | QuizResultState
      | null

  const score =
    result?.score ?? 0

  const correctAnswers =
    result?.correctAnswers ?? 0

  const totalQuestions =
    result?.totalQuestions ?? 0

  const passingScore =
    result?.passingScore ?? 70

  const incorrectAnswers =
    Math.max(
      totalQuestions -
        correctAnswers,
      0
    )

  const passed =
    Boolean(result) &&
    score >= passingScore

  /*
  |--------------------------------------------------------------------------
  | MARK TOPIC COMPLETE
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | Completing lessons does NOT complete the topic.
  |
  | Only passing the quiz adds the topic to:
  |
  | skillforge_completed_topics
  |
  */

  useEffect(
    () => {
      if (
        !result ||
        !passed ||
        !topicKey
      ) {
        return
      }

      const storageKey =
        'skillforge_completed_topics'

      const saved =
        localStorage.getItem(
          storageKey
        )

      let completedTopics: string[] =
        []

      if (saved) {
        try {
          const parsed =
            JSON.parse(saved)

          if (
            Array.isArray(parsed)
          ) {
            completedTopics =
              parsed.filter(
                (
                  value
                ): value is string =>
                  typeof value ===
                  'string'
              )
          }
        } catch {
          completedTopics = []
        }
      }

      if (
        completedTopics.includes(
          topicKey
        )
      ) {
        return
      }

      const updatedTopics = [
        ...completedTopics,
        topicKey,
      ]

      localStorage.setItem(
        storageKey,
        JSON.stringify(
          updatedTopics
        )
      )
    },
    [
      result,
      passed,
      topicKey,
    ]
  )

  /*
  |--------------------------------------------------------------------------
  | INVALID RESULT
  |--------------------------------------------------------------------------
  |
  | This can happen if someone directly opens the result URL
  | or refreshes the page because React Router state is temporary.
  |
  */

  if (
    !roleId ||
    !topicId ||
    !role ||
    !topic ||
    !result
  ) {
    return (
      <DashboardLayout>

        <div className="min-h-screen bg-slate-50 p-6">

          <div className="mx-auto max-w-3xl">

            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <Award size={28} />
              </div>

              <h1 className="mt-5 text-2xl font-bold text-slate-900">
                Quiz Result Not Available
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Complete the topic quiz first to view your result.
              </p>

              <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">

                {roleId && topicId && (
                  <button
                    onClick={() =>
                      navigate(
                        `/employee/roles/${roleId}/topics/${topicId}/quiz`
                      )
                    }
                    className="rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
                  >
                    Back to Quiz
                  </button>
                )}

                {roleId && topicId && (
                  <button
                    onClick={() =>
                      navigate(
                        `/employee/roles/${roleId}/topics/${topicId}`
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Back to Topic
                  </button>
                )}

              </div>

            </div>

          </div>

        </div>

      </DashboardLayout>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | ACTIONS
  |--------------------------------------------------------------------------
  */

  const retryQuiz = () => {
    navigate(
      `/employee/roles/${roleId}/topics/${topicId}/quiz`
    )
  }

  const backToTopic = () => {
    navigate(
      `/employee/roles/${roleId}/topics/${topicId}`
    )
  }

  const backToRoadmap = () => {
    navigate(
      `/employee/roles/${roleId}`
    )
  }

  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <DashboardLayout>

      <div className="min-h-screen bg-slate-50 p-6">

        <div className="mx-auto max-w-4xl">

          {/* HEADER */}

          <div className="text-center">

            <div
              className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${
                passed
                  ? 'bg-green-100 text-green-600'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {passed ? (
                <Award size={32} />
              ) : (
                <XCircle size={32} />
              )}
            </div>

            <h1 className="mt-5 text-3xl font-bold text-slate-900">
              {passed
                ? 'Quiz Passed! 🎉'
                : 'Quiz Completed'}
            </h1>

            <p className="mt-2 text-slate-500">
              {topic.title} Assessment
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {role.title}
            </p>

          </div>

          {/* SCORE */}

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

            <p className="text-sm font-medium text-slate-500">
              Your Score
            </p>

            <h2
              className={`mt-2 text-5xl font-bold ${
                passed
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {score}%
            </h2>

            <div className="mx-auto mt-5 h-3 max-w-md overflow-hidden rounded-full bg-slate-100">

              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  passed
                    ? 'bg-green-600'
                    : 'bg-red-500'
                }`}
                style={{
                  width:
                    `${Math.min(
                      Math.max(
                        score,
                        0
                      ),
                      100
                    )}%`,
                }}
              />

            </div>

            <p
              className={`mt-4 text-lg font-semibold ${
                passed
                  ? 'text-green-600'
                  : 'text-red-600'
              }`}
            >
              {passed
                ? 'Passed'
                : 'Not Passed'}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Passing score: {passingScore}%
            </p>

          </div>

          {/* STATISTICS */}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

            <ResultCard
              icon={
                <CheckCircle2
                  size={22}
                />
              }
              value={
                String(
                  correctAnswers
                )
              }
              label="Correct Answers"
              type="success"
            />

            <ResultCard
              icon={
                <XCircle
                  size={22}
                />
              }
              value={
                String(
                  incorrectAnswers
                )
              }
              label="Incorrect Answers"
              type="error"
            />

            <ResultCard
              icon={
                <Award
                  size={22}
                />
              }
              value={
                String(
                  totalQuestions
                )
              }
              label="Total Questions"
              type="purple"
            />

          </div>

          {/* PERFORMANCE SUMMARY */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="text-lg font-bold text-slate-900">
              Performance Summary
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {passed
                ? `You successfully passed the ${topic.title} assessment. This topic is now completed in your ${role.title} roadmap.`
                : `You scored ${score}%. You need at least ${passingScore}% to complete ${topic.title}. Review the lessons and try the assessment again.`}
            </p>

            <div
              className={`mt-6 rounded-xl p-4 ${
                passed
                  ? 'bg-green-50'
                  : 'bg-purple-50'
              }`}
            >

              <p
                className={`text-sm font-semibold ${
                  passed
                    ? 'text-green-700'
                    : 'text-purple-700'
                }`}
              >
                {passed
                  ? 'Topic Completed'
                  : 'Recommended Next Step'}
              </p>

              <p
                className={`mt-1 text-sm leading-6 ${
                  passed
                    ? 'text-green-600'
                    : 'text-purple-600'
                }`}
              >
                {passed
                  ? 'Your progress has been saved. Return to your roadmap and continue with the next topic.'
                  : 'Review the lessons you found difficult, then retry the quiz. The topic will remain incomplete until you pass.'}
              </p>

            </div>

          </div>

          {/* ACTIONS */}

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">

            <button
              onClick={
                retryQuiz
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <RotateCcw size={18} />

              {passed
                ? 'Retake Quiz'
                : 'Retry Quiz'}
            </button>

            <button
              onClick={
                backToTopic
              }
              className="rounded-xl border border-purple-200 bg-purple-50 px-6 py-3 text-sm font-medium text-purple-700 hover:bg-purple-100"
            >
              Back to Topic
            </button>

            {passed && (
              <button
                onClick={
                  backToRoadmap
                }
                className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-medium text-white hover:bg-purple-700"
              >
                Continue Roadmap
              </button>
            )}

          </div>

        </div>

      </div>

    </DashboardLayout>
  )
}

/*
|--------------------------------------------------------------------------
| RESULT CARD
|--------------------------------------------------------------------------
*/

interface ResultCardProps {
  icon: ReactNode
  value: string
  label: string
  type:
    | 'success'
    | 'error'
    | 'purple'
}

function ResultCard({
  icon,
  value,
  label,
  type,
}: ResultCardProps) {
  const styles = {
    success:
      'bg-green-100 text-green-600',

    error:
      'bg-red-100 text-red-600',

    purple:
      'bg-purple-100 text-purple-600',
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-3">

        <div
          className={`rounded-xl p-3 ${styles[type]}`}
        >
          {icon}
        </div>

        <div>

          <p className="text-2xl font-bold text-slate-900">
            {value}
          </p>

          <p className="text-xs text-slate-500">
            {label}
          </p>

        </div>

      </div>

    </div>
  )
}

export default QuizResult