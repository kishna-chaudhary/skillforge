import type { ReactNode } from 'react'

import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  ListChecks,
  Loader2,
} from 'lucide-react'

import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'

const API_URL = 'http://localhost:5000'
const TOKEN_KEY = 'skillforge-token'


/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

interface CareerRole {
  id: number
  slug: string
  title: string
}

interface Topic {
  id: number
  careerRoleId: number
  slug: string
  title: string
  description: string
  duration: string
  position: number
  isActive: boolean

  lessonCount: number

  assessmentConfigured: boolean
  assessmentCount: number
  questionCount: number
  passingScore: number | null

  createdAt?: string
  updatedAt?: string
}

interface Lesson {
  id: number
  topicId: number
  title: string
  description: string
  content: unknown[]
  resources: unknown[]
  position: number
  estimatedMinutes: number | null
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

interface TopicResponse {
  success: boolean
  message?: string
  role?: CareerRole
  topic?: Topic
}

interface LessonsResponse {
  success: boolean
  message?: string

  role?: {
    id: number
    slug: string
    title: string
  }

  topic?: {
    id: number
    slug: string
    title: string
  }

  lessons?: Lesson[]
  lessonCount?: number
}


/*
|--------------------------------------------------------------------------
| TOPIC MANAGEMENT
|--------------------------------------------------------------------------
*/

function TopicManagement() {
  const navigate = useNavigate()

  const { roleId, topicId } =
    useParams<{
      roleId: string
      topicId: string
    }>()

  const [role, setRole] =
    useState<CareerRole | null>(
      null
    )

  const [topic, setTopic] =
    useState<Topic | null>(
      null
    )

  const [lessons, setLessons] =
    useState<Lesson[]>([])

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [notFound, setNotFound] =
    useState(false)


  /*
  |--------------------------------------------------------------------------
  | LOAD TOPIC + LESSONS
  |--------------------------------------------------------------------------
  */

  const loadTopic =
    useCallback(async () => {
      if (!roleId || !topicId) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      setNotFound(false)

      try {
        const token =
          localStorage.getItem(
            TOKEN_KEY
          )

        if (!token) {
          throw new Error(
            'Authentication token not found. Please sign in again.'
          )
        }

        /*
        |--------------------------------------------------------------------------
        | LOAD TOPIC
        |--------------------------------------------------------------------------
        */

        const topicResponse =
          await fetch(
            `${API_URL}/api/admin/roles/${encodeURIComponent(
              roleId
            )}/topics/${encodeURIComponent(
              topicId
            )}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        const topicData:
          TopicResponse =
            await topicResponse.json()

        if (
          topicResponse.status === 404
        ) {
          setNotFound(true)
          setRole(null)
          setTopic(null)
          setLessons([])
          return
        }

        if (
          !topicResponse.ok ||
          !topicData.success ||
          !topicData.role ||
          !topicData.topic
        ) {
          throw new Error(
            topicData.message ||
              'Unable to load topic.'
          )
        }

        setRole(topicData.role)
        setTopic(topicData.topic)

        /*
        |--------------------------------------------------------------------------
        | LOAD REAL POSTGRESQL LESSONS
        |--------------------------------------------------------------------------
        */

        const lessonsResponse =
          await fetch(
            `${API_URL}/api/admin/roles/${encodeURIComponent(
              roleId
            )}/topics/${encodeURIComponent(
              topicId
            )}/lessons`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        const lessonsData:
          LessonsResponse =
            await lessonsResponse.json()

        if (
          !lessonsResponse.ok ||
          !lessonsData.success
        ) {
          throw new Error(
            lessonsData.message ||
              'Unable to load topic lessons.'
          )
        }

        setLessons(
          Array.isArray(
            lessonsData.lessons
          )
            ? lessonsData.lessons
            : []
        )
      } catch (err) {
        console.error(
          'Load topic error:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load topic.'
        )
      } finally {
        setLoading(false)
      }
    }, [roleId, topicId])


  useEffect(() => {
    void loadTopic()
  }, [loadTopic])


  /*
  |--------------------------------------------------------------------------
  | NAVIGATION
  |--------------------------------------------------------------------------
  */

  const goBackToRole = () => {
    navigate(
      `/admin/roles/${roleId}`
    )
  }


  const manageLessons = () => {
    navigate(
      `/admin/roles/${roleId}/topics/${topicId}/lessons`
    )
  }


  const manageAssessment = () => {
    navigate(
      `/admin/roles/${roleId}/topics/${topicId}/assessment`
    )
  }


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">

            <button
              type="button"
              onClick={() =>
                navigate(
                  roleId
                    ? `/admin/roles/${roleId}`
                    : '/admin/roles'
                )
              }
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-purple-600"
            >
              <ArrowLeft
                size={17}
              />

              Back
            </button>

            <div className="mt-8 flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-14 shadow-sm">

              <Loader2
                size={30}
                className="animate-spin text-purple-600"
              />

              <span className="ml-3 text-sm font-medium text-slate-600">
                Loading topic...
              </span>

            </div>

          </div>
        </div>
      </AdminLayout>
    )
  }


  /*
  |--------------------------------------------------------------------------
  | NOT FOUND
  |--------------------------------------------------------------------------
  */

  if (
    notFound ||
    !roleId ||
    !topicId
  ) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">

            <button
              type="button"
              onClick={() =>
                navigate(
                  roleId
                    ? `/admin/roles/${roleId}`
                    : '/admin/roles'
                )
              }
              className="flex items-center gap-2 text-sm font-semibold text-purple-600"
            >
              <ArrowLeft
                size={17}
              />

              Back
            </button>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <GraduationCap
                size={40}
                className="mx-auto text-slate-300"
              />

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                Topic not found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                The requested career
                role or roadmap topic
                does not exist or is
                not active.
              </p>

            </div>

          </div>
        </div>
      </AdminLayout>
    )
  }


  /*
  |--------------------------------------------------------------------------
  | ERROR
  |--------------------------------------------------------------------------
  */

  if (
    error ||
    !role ||
    !topic
  ) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
          <div className="mx-auto max-w-6xl">

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/admin/roles/${roleId}`
                )
              }
              className="flex items-center gap-2 text-sm font-semibold text-purple-600"
            >
              <ArrowLeft
                size={17}
              />

              Back to Role
            </button>

            <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8">

              <h1 className="font-bold text-red-900">
                Unable to load topic
              </h1>

              <p className="mt-2 text-sm text-red-700">
                {error ||
                  'Unable to load topic.'}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadTopic()
                }
                className="mt-5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>

            </div>

          </div>
        </div>
      </AdminLayout>
    )
  }


  /*
  |--------------------------------------------------------------------------
  | ASSESSMENT STATE
  |--------------------------------------------------------------------------
  */

  const assessmentReady =
    topic.assessmentConfigured

  const passScore =
    topic.passingScore


  /*
  |--------------------------------------------------------------------------
  | PAGE
  |--------------------------------------------------------------------------
  */

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

        <div className="mx-auto max-w-7xl">

          {/* BACK */}

          <button
            type="button"
            onClick={
              goBackToRole
            }
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-purple-600"
          >
            <ArrowLeft
              size={17}
            />

            {role.title}
          </button>


          {/* HERO */}

          <div className="mt-6 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-sm lg:p-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-3xl">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">

                  <BookOpenCheck
                    size={23}
                  />

                </div>

                <p className="mt-5 text-sm font-semibold text-purple-300">
                  {role.title}
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  {topic.title}
                </h1>

                <p className="mt-2 text-xs font-medium text-slate-500">
                  {topic.slug}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {topic.description ||
                    'No description has been added for this topic yet.'}
                </p>

              </div>


              <div className="grid grid-cols-2 gap-3">

                <HeroMetric
                  value={
                    lessons.length
                  }
                  label="Lessons"
                />

                <HeroMetric
                  value={
                    topic.duration ||
                    '—'
                  }
                  label="Duration"
                />

                <HeroMetric
                  value={
                    assessmentReady
                      ? topic.questionCount
                      : 0
                  }
                  label="Questions"
                />

                <HeroMetric
                  value={
                    assessmentReady &&
                    passScore !== null
                      ? `${passScore}%`
                      : '—'
                  }
                  label="Pass Score"
                />

              </div>

            </div>
          </div>


          {/* HEADING */}

          <div className="mt-8">

            <p className="text-sm font-semibold text-purple-600">
              Topic Management
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              Learning Content
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review the lessons and
              assessment that employees
              complete for this roadmap
              topic.
            </p>

          </div>


          {/* MANAGEMENT CARDS */}

          <div className="mt-6 grid gap-5 lg:grid-cols-2">

            <ManagementCard
              icon={
                <FileText
                  size={22}
                />
              }
              title="Lessons & Resources"
              description="Manage the lesson sequence, learning content, videos, documents and supporting resources for this topic."
              status={`${lessons.length} ${
                lessons.length === 1
                  ? 'lesson'
                  : 'lessons'
              } configured`}
              action="Manage Lessons"
              onClick={
                manageLessons
              }
            />


            <ManagementCard
              icon={
                <ClipboardCheck
                  size={22}
                />
              }
              title="Topic Assessment"
              description="Manage the question bank, passing score and assessment configuration required to complete this topic."
              status={
                assessmentReady
                  ? `${topic.questionCount} ${
                      topic.questionCount ===
                      1
                        ? 'question'
                        : 'questions'
                    }${
                      passScore !== null
                        ? ` • ${passScore}% passing score`
                        : ''
                    }`
                  : 'Assessment not configured'
              }
              action="Manage Assessment"
              onClick={
                manageAssessment
              }
              ready={
                assessmentReady
              }
            />

          </div>


          {/* LESSON SEQUENCE */}

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2">

                  <ListChecks
                    size={19}
                    className="text-purple-600"
                  />

                  <h2 className="font-bold text-slate-900">
                    Lesson Sequence
                  </h2>

                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Employees complete
                  these lessons before
                  the topic assessment
                  becomes available.
                </p>

              </div>


              <button
                type="button"
                onClick={
                  manageLessons
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:text-purple-600"
              >
                Manage Lessons

                <ArrowRight
                  size={16}
                />
              </button>

            </div>


            {lessons.length > 0 ? (
              <div className="divide-y divide-slate-100">

                {lessons.map(
                  (
                    lesson,
                    index
                  ) => (
                    <div
                      key={
                        lesson.id
                      }
                      className="flex items-center gap-4 p-5"
                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600">

                        {String(
                          index + 1
                        ).padStart(
                          2,
                          '0'
                        )}

                      </div>


                      <div className="min-w-0 flex-1">

                        <p className="truncate text-sm font-semibold text-slate-800">
                          {lesson.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Lesson{' '}
                          {index + 1}{' '}
                          of{' '}
                          {lessons.length}

                          {lesson.estimatedMinutes
                            ? ` • ${lesson.estimatedMinutes} min`
                            : ''}
                        </p>

                      </div>


                      <span className="hidden rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 sm:inline-flex">
                        Learning Content
                      </span>

                    </div>
                  )
                )}

              </div>
            ) : (
              <div className="p-8 text-center">

                <FileText
                  size={34}
                  className="mx-auto text-slate-300"
                />

                <h3 className="mt-4 text-sm font-bold text-slate-900">
                  No lessons yet
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  This topic does not
                  have any active
                  lessons yet. Use
                  Lesson Management to
                  create the first
                  lesson.
                </p>

                <button
                  type="button"
                  onClick={
                    manageLessons
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  Manage Lessons

                  <ArrowRight
                    size={16}
                  />
                </button>

              </div>
            )}

          </div>


          {/* COMPLETION WORKFLOW */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">

                <CheckCircle2
                  size={21}
                />

              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  Topic Completion Workflow
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  SkillForge verifies
                  topic completion
                  through lessons and
                  the final assessment.
                </p>

              </div>

            </div>


            <div className="mt-6 grid gap-3 md:grid-cols-3">

              <WorkflowStep
                number="01"
                title="Complete Lessons"
                description={`Employee completes all ${lessons.length} ${
                  lessons.length === 1
                    ? 'lesson'
                    : 'lessons'
                }.`}
              />

              <WorkflowStep
                number="02"
                title="Unlock Assessment"
                description="The topic assessment becomes available only after all lessons are completed."
              />

              <WorkflowStep
                number="03"
                title="Pass Assessment"
                description={
                  assessmentReady &&
                  passScore !== null
                    ? `Employee must score at least ${passScore}% to complete the topic.`
                    : 'An assessment must be configured before topic completion can be verified.'
                }
              />

            </div>

          </div>


          {/* DATABASE STATUS */}

          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">

            <p className="text-sm font-semibold text-emerald-800">
              PostgreSQL connected
            </p>

            <p className="mt-2 text-sm leading-6 text-emerald-700">
              Topic metadata, lesson
              sequence and assessment
              status on this page are
              loaded from the
              SkillForge backend and
              PostgreSQL database.
            </p>

          </div>

        </div>
      </div>
    </AdminLayout>
  )
}


/*
|--------------------------------------------------------------------------
| HERO METRIC
|--------------------------------------------------------------------------
*/

interface HeroMetricProps {
  value: number | string
  label: string
}


function HeroMetric({
  value,
  label,
}: HeroMetricProps) {
  return (
    <div className="min-w-32 rounded-2xl border border-slate-800 bg-slate-900 p-4">

      <p className="text-lg font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {label}
      </p>

    </div>
  )
}


/*
|--------------------------------------------------------------------------
| MANAGEMENT CARD
|--------------------------------------------------------------------------
*/

interface ManagementCardProps {
  icon: ReactNode
  title: string
  description: string
  status: string
  action: string
  onClick: () => void
  ready?: boolean
}


function ManagementCard({
  icon,
  title,
  description,
  status,
  action,
  onClick,
  ready = true,
}: ManagementCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5">

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            ready
              ? 'bg-green-50 text-green-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {status}
        </span>

      </div>

      <button
        type="button"
        onClick={onClick}
        className="mt-5 flex w-full items-center justify-between rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
      >
        {action}

        <ArrowRight
          size={16}
        />
      </button>

    </div>
  )
}


/*
|--------------------------------------------------------------------------
| WORKFLOW STEP
|--------------------------------------------------------------------------
*/

interface WorkflowStepProps {
  number: string
  title: string
  description: string
}


function WorkflowStep({
  number,
  title,
  description,
}: WorkflowStepProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <span className="text-xs font-bold text-purple-600">
        {number}
      </span>

      <p className="mt-3 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  )
}


export default TopicManagement