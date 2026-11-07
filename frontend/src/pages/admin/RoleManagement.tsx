import type {
  FormEvent,
  ReactNode,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  ClipboardCheck,
  Clock3,
  Layers3,
  Loader2,
  Plus,
  X,
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
  description: string
  isActive: boolean
  createdAt?: string
  updatedAt?: string
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

interface TopicsResponse {
  success: boolean
  message?: string

  role?: CareerRole
  topics?: Topic[]

  topicCount?: number
  totalLessons?: number
  configuredAssessments?: number
  assessmentCoverage?: number
}

interface CreateTopicResponse {
  success: boolean
  message?: string
  topic?: Topic
}


/*
|--------------------------------------------------------------------------
| ROLE MANAGEMENT
|--------------------------------------------------------------------------
*/

function RoleManagement() {
  const navigate =
    useNavigate()

  const { roleId } =
    useParams<{
      roleId: string
    }>()

  const [role, setRole] =
    useState<CareerRole | null>(
      null
    )

  const [topics, setTopics] =
    useState<Topic[]>([])

  const [
    totalLessons,
    setTotalLessons,
  ] = useState(0)

  const [
    configuredAssessments,
    setConfiguredAssessments,
  ] = useState(0)

  const [
    assessmentCoverage,
    setAssessmentCoverage,
  ] = useState(0)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [
    notFound,
    setNotFound,
  ] = useState(false)

  /*
  |--------------------------------------------------------------------------
  | ADD TOPIC MODAL
  |--------------------------------------------------------------------------
  */

  const [
    showAddModal,
    setShowAddModal,
  ] = useState(false)

  const [title, setTitle] =
    useState('')

  const [slug, setSlug] =
    useState('')

  const [
    description,
    setDescription,
  ] = useState('')

  const [duration, setDuration] =
    useState('')

  const [saving, setSaving] =
    useState(false)

  const [
    formError,
    setFormError,
  ] = useState('')


  /*
  |--------------------------------------------------------------------------
  | TOKEN
  |--------------------------------------------------------------------------
  */

  const getToken = () =>
    localStorage.getItem(
      TOKEN_KEY
    )


  /*
  |--------------------------------------------------------------------------
  | LOAD ROLE + TOPICS
  |--------------------------------------------------------------------------
  */

  const loadRole =
    useCallback(async () => {
      if (!roleId) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      setNotFound(false)

      try {
        const token =
          getToken()

        if (!token) {
          throw new Error(
            'Authentication token not found. Please sign in again.'
          )
        }

        const response =
          await fetch(
            `${API_URL}/api/admin/roles/${encodeURIComponent(
              roleId
            )}/topics`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        const data:
          TopicsResponse =
            await response.json()

        if (
          response.status === 404
        ) {
          setNotFound(true)
          setRole(null)
          setTopics([])
          return
        }

        if (
          !response.ok ||
          !data.success ||
          !data.role
        ) {
          throw new Error(
            data.message ||
              'Unable to load career role.'
          )
        }

        setRole(data.role)

        setTopics(
          Array.isArray(
            data.topics
          )
            ? data.topics
            : []
        )

        setTotalLessons(
          Number(
            data.totalLessons ||
              0
          )
        )

        setConfiguredAssessments(
          Number(
            data.configuredAssessments ||
              0
          )
        )

        setAssessmentCoverage(
          Number(
            data.assessmentCoverage ||
              0
          )
        )
      } catch (err) {
        console.error(
          'Load role error:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load career role.'
        )
      } finally {
        setLoading(false)
      }
    }, [roleId])


  useEffect(() => {
    void loadRole()
  }, [loadRole])


  /*
  |--------------------------------------------------------------------------
  | SLUG
  |--------------------------------------------------------------------------
  */

  const generateSlug = (
    value: string
  ) =>
    value
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        '-'
      )
      .replace(
        /^-+|-+$/g,
        ''
      )


  const handleTitleChange = (
    value: string
  ) => {
    const previousSlug =
      generateSlug(title)

    setTitle(value)

    /*
    | Keep automatically generating
    | the slug until the admin edits
    | the slug manually.
    */

    if (
      !slug ||
      slug === previousSlug
    ) {
      setSlug(
        generateSlug(value)
      )
    }
  }


  /*
  |--------------------------------------------------------------------------
  | MODAL
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    setTitle('')
    setSlug('')
    setDescription('')
    setDuration('')
    setFormError('')
  }


  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }


  const closeAddModal = () => {
    if (saving) {
      return
    }

    setShowAddModal(false)
    resetForm()
  }


  /*
  |--------------------------------------------------------------------------
  | CREATE TOPIC
  |--------------------------------------------------------------------------
  */

  const handleCreateTopic =
    async (
      event: FormEvent
    ) => {
      event.preventDefault()

      setFormError('')

      if (!roleId) {
        setFormError(
          'Career role is missing.'
        )
        return
      }

      const cleanTitle =
        title.trim()

      const cleanSlug =
        generateSlug(slug)

      const cleanDescription =
        description.trim()

      const cleanDuration =
        duration.trim()

      if (
        cleanTitle.length < 2
      ) {
        setFormError(
          'Topic title must contain at least 2 characters.'
        )
        return
      }

      if (!cleanSlug) {
        setFormError(
          'Please enter a valid topic slug.'
        )
        return
      }

      setSaving(true)

      try {
        const token =
          getToken()

        if (!token) {
          throw new Error(
            'Authentication token not found. Please sign in again.'
          )
        }

        const response =
          await fetch(
            `${API_URL}/api/admin/roles/${encodeURIComponent(
              roleId
            )}/topics`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  title:
                    cleanTitle,

                  slug:
                    cleanSlug,

                  description:
                    cleanDescription,

                  duration:
                    cleanDuration,
                }),
            }
          )

        const data:
          CreateTopicResponse =
            await response.json()

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              'Unable to create topic.'
          )
        }

        setShowAddModal(false)
        resetForm()

        await loadRole()
      } catch (err) {
        console.error(
          'Create topic error:',
          err
        )

        setFormError(
          err instanceof Error
            ? err.message
            : 'Unable to create topic.'
        )
      } finally {
        setSaving(false)
      }
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

            <div className="mt-8 flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-14 shadow-sm">
              <Loader2
                size={30}
                className="animate-spin text-purple-600"
              />

              <span className="ml-3 text-sm font-medium text-slate-600">
                Loading career role...
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
    !roleId
  ) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">

            <button
              type="button"
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
                role does not exist or
                is not active.
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

  if (error || !role) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">

            <button
              type="button"
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

            <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-8">

              <h1 className="font-bold text-red-900">
                Unable to load career role
              </h1>

              <p className="mt-2 text-sm text-red-700">
                {error ||
                  'Unable to load career role.'}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadRole()
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

                <p className="mt-2 text-xs font-medium text-slate-500">
                  {role.slug}
                </p>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {role.description ||
                    'No description has been added for this career role yet.'}
                </p>

              </div>


              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">

                <HeaderMetric
                  value={
                    topics.length
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
                  value={`${assessmentCoverage}%`}
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
                that make up this career
                learning path.
              </p>
            </div>


            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

              <div className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-500 shadow-sm">
                {topics.length}{' '}
                {topics.length === 1
                  ? 'topic'
                  : 'topics'}{' '}
                configured
              </div>

              <button
                type="button"
                onClick={
                  openAddModal
                }
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
              >
                <Plus
                  size={17}
                />

                Add Topic
              </button>

            </div>
          </div>


          {/* TOPICS */}

          {topics.length > 0 ? (
            <div className="mt-6 space-y-4">

              {topics.map(
                (
                  topic,
                  index
                ) => (
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
                    slug={
                      topic.slug
                    }
                    description={
                      topic.description
                    }
                    duration={
                      topic.duration
                    }
                    lessons={
                      topic.lessonCount
                    }
                    assessmentConfigured={
                      topic.assessmentConfigured
                    }
                    questionCount={
                      topic.questionCount
                    }
                    passingScore={
                      topic.passingScore
                    }
                    onManage={() =>
                      navigate(
                        `/admin/roles/${roleId}/topics/${topic.slug}`
                      )
                    }
                  />
                )
              )}

            </div>
          ) : (
            <div className="mt-6 rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">

              <Layers3
                size={36}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                No topics yet
              </h3>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                Add the first roadmap
                topic for {role.title}.
                Lessons and assessments
                can then be configured
                inside that topic.
              </p>

              <button
                type="button"
                onClick={
                  openAddModal
                }
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                <Plus
                  size={17}
                />

                Add First Topic
              </button>

            </div>
          )}


          {/* DATABASE STATUS */}

          <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">

            <p className="text-sm font-semibold text-emerald-800">
              PostgreSQL connected
            </p>

            <p className="mt-2 text-sm leading-6 text-emerald-700">
              This career role,
              roadmap topics, lesson
              counts and assessment
              status are loaded from
              the SkillForge backend
              and PostgreSQL database.
            </p>

          </div>

        </div>
      </div>


      {/* ADD TOPIC MODAL */}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 p-6">

              <div>
                <p className="text-sm font-semibold text-purple-600">
                  {role.title}
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Add Roadmap Topic
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create the next
                  learning stage for
                  this career path.
                </p>
              </div>


              <button
                type="button"
                onClick={
                  closeAddModal
                }
                disabled={
                  saving
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={
                handleCreateTopic
              }
              className="p-6"
            >

              {/* TITLE */}

              <div>
                <label
                  htmlFor="topic-title"
                  className="text-sm font-semibold text-slate-700"
                >
                  Topic Name
                </label>

                <input
                  id="topic-title"
                  type="text"
                  value={title}
                  onChange={(
                    event
                  ) =>
                    handleTitleChange(
                      event.target
                        .value
                    )
                  }
                  placeholder="e.g. Android Fundamentals"
                  maxLength={200}
                  disabled={
                    saving
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                />
              </div>


              {/* SLUG */}

              <div className="mt-5">
                <label
                  htmlFor="topic-slug"
                  className="text-sm font-semibold text-slate-700"
                >
                  Topic Slug
                </label>

                <input
                  id="topic-slug"
                  type="text"
                  value={slug}
                  onChange={(
                    event
                  ) =>
                    setSlug(
                      generateSlug(
                        event.target
                          .value
                      )
                    )
                  }
                  placeholder="e.g. android-fundamentals"
                  maxLength={120}
                  disabled={
                    saving
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Generated
                  automatically from
                  the topic name. This
                  becomes part of the
                  topic URL.
                </p>
              </div>


              {/* DESCRIPTION */}

              <div className="mt-5">
                <label
                  htmlFor="topic-description"
                  className="text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="topic-description"
                  value={
                    description
                  }
                  onChange={(
                    event
                  ) =>
                    setDescription(
                      event.target
                        .value
                    )
                  }
                  placeholder="Describe what employees will learn in this topic..."
                  rows={4}
                  disabled={
                    saving
                  }
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                />
              </div>


              {/* DURATION */}

              <div className="mt-5">
                <label
                  htmlFor="topic-duration"
                  className="text-sm font-semibold text-slate-700"
                >
                  Duration
                </label>

                <input
                  id="topic-duration"
                  type="text"
                  value={
                    duration
                  }
                  onChange={(
                    event
                  ) =>
                    setDuration(
                      event.target
                        .value
                    )
                  }
                  placeholder="e.g. 6 hours"
                  maxLength={50}
                  disabled={
                    saving
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                />
              </div>


              {/* ERROR */}

              {formError && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {formError}
                </div>
              )}


              {/* ACTIONS */}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={
                    closeAddModal
                  }
                  disabled={
                    saving
                  }
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus
                        size={17}
                      />

                      Create Topic
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>
        </div>
      )}

    </AdminLayout>
  )
}


/*
|--------------------------------------------------------------------------
| HEADER METRIC
|--------------------------------------------------------------------------
*/

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


/*
|--------------------------------------------------------------------------
| TOPIC CARD
|--------------------------------------------------------------------------
*/

interface TopicCardProps {
  number: number
  title: string
  slug: string
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
  slug,
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

          <p className="mt-1 text-xs font-medium text-slate-400">
            {slug}
          </p>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            {description ||
              'No description has been added for this topic yet.'}
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
              text={
                duration ||
                'Duration not set'
              }
            />

            <TopicMetric
              icon={
                <ClipboardCheck
                  size={15}
                />
              }
              text={
                assessmentConfigured
                  ? `${questionCount} ${
                      questionCount ===
                      1
                        ? 'question'
                        : 'questions'
                    }`
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
          type="button"
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


/*
|--------------------------------------------------------------------------
| TOPIC METRIC
|--------------------------------------------------------------------------
*/

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