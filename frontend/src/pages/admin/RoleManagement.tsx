import type { ReactNode } from 'react'

import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  Clock3,
  Layers3,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'
import { roadmapData } from '../../data/roadmapData'
import { topicQuizData } from '../../data/topicQuizData'

function RoleManagement() {
  const navigate = useNavigate()

  const { roleId } =
    useParams<{
      roleId: string
    }>()

  const role =
    roleId
      ? roadmapData[roleId]
      : undefined

  /*
  |--------------------------------------------------------------------------
  | INVALID ROLE
  |--------------------------------------------------------------------------
  */

  if (!role || !roleId) {
    return (
      <AdminLayout>

        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

          <div className="mx-auto max-w-5xl">

            <button
              onClick={() =>
                navigate(
                  '/admin/roles'
                )
              }
              className="flex items-center gap-2 text-sm font-semibold text-purple-600"
            >
              <ArrowLeft
                size={17}
              />

              Back to Career Roles
            </button>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <BriefcaseBusiness
                size={38}
                className="mx-auto text-slate-300"
              />

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                Career role not found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                The requested career
                role does not exist.
              </p>

            </div>

          </div>

        </div>

      </AdminLayout>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | ROLE STATISTICS
  |--------------------------------------------------------------------------
  */

  const totalLessons =
    role.topics.reduce(
      (total, topic) =>
        total +
        topic.lessons,
      0
    )

  const configuredAssessments =
    role.topics.filter(
      (topic) =>
        Boolean(
          topicQuizData[
            `${roleId}/${topic.id}`
          ]
        )
    ).length

  const assessmentCoverage =
    role.topics.length > 0
      ? Math.round(
          (
            configuredAssessments /
            role.topics.length
          ) *
            100
        )
      : 0

  return (
    <AdminLayout>

      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

        <div className="mx-auto max-w-7xl">

          {/* BACK */}

          <button
            onClick={() =>
              navigate(
                '/admin/roles'
              )
            }
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-purple-600"
          >
            <ArrowLeft
              size={17}
            />

            Career Roles
          </button>

          {/* ROLE HEADER */}

          <div className="mt-6 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-sm lg:p-8">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-3xl">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">

                  <BriefcaseBusiness
                    size={23}
                  />

                </div>

                <p className="mt-5 text-sm font-semibold text-purple-300">
                  Career Learning Path
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  {role.title}
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {role.description}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">

                <HeaderMetric
                  value={
                    role.topics
                      .length
                  }
                  label="Topics"
                />

                <HeaderMetric
                  value={
                    totalLessons
                  }
                  label="Lessons"
                />

                <HeaderMetric
                  value={
                    configuredAssessments
                  }
                  label="Assessments"
                />

                <HeaderMetric
                  value={
                    `${assessmentCoverage}%`
                  }
                  label="Coverage"
                />

              </div>

            </div>

          </div>

          {/* ROADMAP HEADING */}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <p className="text-sm font-semibold text-purple-600">
                Learning Management
              </p>

              <h2 className="mt-1 text-2xl font-bold text-slate-950">
                Roadmap Topics
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Manage the topics,
                lessons and assessments
                that make up this
                career learning path.
              </p>

            </div>

            <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500 shadow-sm">
              {
                role.topics
                  .length
              }{' '}
              topics configured
            </div>

          </div>

          {/* TOPICS */}

          <div className="mt-6 space-y-4">

            {role.topics.map(
              (
                topic,
                index
              ) => {
                const quiz =
                  topicQuizData[
                    `${roleId}/${topic.id}`
                  ]

                return (
                  <TopicCard
                    key={
                      topic.id
                    }
                    number={
                      index + 1
                    }
                    title={
                      topic.title
                    }
                    description={
                      topic.description
                    }
                    duration={
                      topic.duration
                    }
                    lessons={
                      topic.lessons
                    }
                    assessmentConfigured={
                      Boolean(
                        quiz
                      )
                    }
                    questionCount={
                      quiz
                        ? quiz
                            .questions
                            .length
                        : 0
                    }
                    passingScore={
                      quiz
                        ? quiz
                            .passingScore
                        : null
                    }
                    onManage={() =>
                      navigate(
                        `/admin/roles/${roleId}/topics/${topic.id}`
                      )
                    }
                  />
                )
              }
            )}

          </div>

          {/* CURRENT STORAGE */}

          <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50 p-5">

            <p className="text-sm font-semibold text-purple-800">
              Current content source
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              The roadmap structure
              shown here currently
              comes from
              roadmapData.ts and
              topicQuizData.ts.
              Editing, reordering,
              publishing and deleting
              topics will become
              persistent Admin actions
              when the backend is
              connected.
            </p>

          </div>

        </div>

      </div>

    </AdminLayout>
  )
}

/* ==================================================
   HEADER METRIC
================================================== */

interface HeaderMetricProps {
  value: number | string
  label: string
}

function HeaderMetric({
  value,
  label,
}: HeaderMetricProps) {
  return (
    <div className="min-w-32 rounded-2xl border border-slate-800 bg-slate-900 p-4">

      <p className="text-xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {label}
      </p>

    </div>
  )
}

/* ==================================================
   TOPIC CARD
================================================== */

interface TopicCardProps {
  number: number
  title: string
  description: string
  duration: string
  lessons: number
  assessmentConfigured: boolean
  questionCount: number
  passingScore: number | null
  onManage: () => void
}

function TopicCard({
  number,
  title,
  description,
  duration,
  lessons,
  assessmentConfigured,
  questionCount,
  passingScore,
  onManage,
}: TopicCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-purple-200">

      <div className="flex flex-col gap-5 lg:flex-row lg:items-center">

        {/* NUMBER */}

        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-sm font-bold text-purple-700">
          {String(
            number
          ).padStart(
            2,
            '0'
          )}
        </div>

        {/* CONTENT */}

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-3">

            <h3 className="text-base font-bold text-slate-900">
              {title}
            </h3>

            {assessmentConfigured ? (
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                Assessment Ready
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                Assessment Missing
              </span>
            )}

          </div>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            {description}
          </p>

          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">

            <TopicMetric
              icon={
                <BookOpenCheck
                  size={15}
                />
              }
              text={`${lessons} ${
                lessons === 1
                  ? 'lesson'
                  : 'lessons'
              }`}
            />

            <TopicMetric
              icon={
                <Clock3
                  size={15}
                />
              }
              text={duration}
            />

            <TopicMetric
              icon={
                <ClipboardCheck
                  size={15}
                />
              }
              text={
                assessmentConfigured
                  ? `${questionCount} questions`
                  : 'No assessment'
              }
            />

            {passingScore !==
              null && (
              <TopicMetric
                icon={
                  <Layers3
                    size={15}
                  />
                }
                text={`${passingScore}% passing score`}
              />
            )}

          </div>

        </div>

        {/* ACTION */}

        <button
          onClick={
            onManage
          }
          className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
        >
          Manage Topic

          <ArrowRight
            size={16}
          />

        </button>

      </div>

    </div>
  )
}

/* ==================================================
   TOPIC METRIC
================================================== */

interface TopicMetricProps {
  icon: ReactNode
  text: string
}

function TopicMetric({
  icon,
  text,
}: TopicMetricProps) {
  return (
    <span className="flex items-center gap-1.5">
      {icon}
      {text}
    </span>
  )
}

export default RoleManagement