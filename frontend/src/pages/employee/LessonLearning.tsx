import {
  useEffect,
  useState,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  ExternalLink,
  PlayCircle,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'

interface LessonResource {
  title: string
  type: string
  url: string
}

interface LessonData {
  id: string
  title: string
  description: string
  duration: string
  content: string[]
  resources: LessonResource[]
}

interface TopicLessons {
  topicTitle: string
  lessons: LessonData[]
}

interface ApiLesson {
  id: string
  title: string
  description: string
  content: string[]
  resources: LessonResource[]
  position: number
  estimatedMinutes: number | null
}

interface LessonsApiResponse {
  success: boolean
  message?: string

  topic: {
    id: string
    slug: string
    title: string
    description: string | null
    duration: string | null
    position: number
  }

  lessons: ApiLesson[]
}

interface LessonProgressResponse {
  success: boolean
  message?: string
  completedLessons?: number[]
}

interface CompleteLessonResponse {
  success: boolean
  message?: string
  lessonId?: number | string
  completed?: boolean
}

function LessonLearning() {
  const navigate = useNavigate()

  const {
    roleId,
    topicId,
    lessonIndex,
  } = useParams()

  const numericLessonIndex =
    Number(lessonIndex)

  /*
  |--------------------------------------------------------------------------
  | LESSON API STATE
  |--------------------------------------------------------------------------
  */

  const [
    topic,
    setTopic,
  ] = useState<TopicLessons | null>(
    null
  )

  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const [
    loadError,
    setLoadError,
  ] = useState('')

  /*
  |--------------------------------------------------------------------------
  | COMPLETION STATE
  |--------------------------------------------------------------------------
  */

  const [
    completedLessons,
    setCompletedLessons,
  ] = useState<number[]>([])

  const [
    isCompleting,
    setIsCompleting,
  ] = useState(false)

  const [
    completionError,
    setCompletionError,
  ] = useState('')

  /*
  |--------------------------------------------------------------------------
  | LOAD LESSONS FROM POSTGRESQL API
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false

    const loadLessons = async () => {
      if (!roleId || !topicId) {
        if (!cancelled) {
          setTopic(null)

          setLoadError(
            'The requested learning topic is not available.'
          )

          setIsLoading(false)
        }

        return
      }

      setIsLoading(true)
      setLoadError('')
      setTopic(null)

      try {
        const response =
          await fetch(
            `http://localhost:5000/api/career-roles/${encodeURIComponent(
              roleId
            )}/topics/${encodeURIComponent(
              topicId
            )}/lessons`
          )

        if (!response.ok) {
          if (
            response.status === 404
          ) {
            throw new Error(
              'The requested learning topic is not available.'
            )
          }

          throw new Error(
            'Unable to load the lesson content.'
          )
        }

        const data =
          (await response.json()) as
            LessonsApiResponse

        if (
          !data.success ||
          !data.topic ||
          !Array.isArray(
            data.lessons
          )
        ) {
          throw new Error(
            'The lesson data returned by the server is invalid.'
          )
        }

        const mappedLessons:
          LessonData[] =
          data.lessons.map(
            (lesson) => ({
              id: lesson.id,

              title:
                lesson.title,

              description:
                lesson.description ??
                '',

              duration:
                lesson.estimatedMinutes !==
                null
                  ? `${lesson.estimatedMinutes} minutes`
                  : 'Self-paced',

              content:
                Array.isArray(
                  lesson.content
                )
                  ? lesson.content
                  : [],

              resources:
                Array.isArray(
                  lesson.resources
                )
                  ? lesson.resources
                  : [],
            })
          )

        if (cancelled) {
          return
        }

        setTopic({
          topicTitle:
            data.topic.title,

          lessons:
            mappedLessons,
        })
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(
          'Failed to load lessons:',
          error
        )

        setTopic(null)

        setLoadError(
          error instanceof Error
            ? error.message
            : 'Unable to load the lesson content.'
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadLessons()

    return () => {
      cancelled = true
    }
  }, [roleId, topicId])

  /*
  |--------------------------------------------------------------------------
  | LOAD COMPLETED LESSONS FROM POSTGRESQL
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let cancelled = false

    const loadCompletedLessons =
      async () => {
        if (
          !roleId ||
          !topicId
        ) {
          if (!cancelled) {
            setCompletedLessons(
              []
            )
          }

          return
        }

        try {
          const token =
            localStorage.getItem(
              'skillforge-token'
            )

          if (!token) {
            throw new Error(
              'Authentication required.'
            )
          }

          const response =
            await fetch(
              `http://localhost:5000/api/progress/lessons/${encodeURIComponent(
                roleId
              )}/${encodeURIComponent(
                topicId
              )}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            )

          const data =
            (await response.json()) as
              LessonProgressResponse

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                'Unable to load lesson progress.'
            )
          }

          if (cancelled) {
            return
          }

          setCompletedLessons(
            Array.isArray(
              data.completedLessons
            )
              ? data.completedLessons.filter(
                  (
                    value
                  ): value is number =>
                    typeof value ===
                    'number'
                )
              : []
          )
        } catch (error) {
          console.error(
            'Failed to load lesson progress:',
            error
          )

          if (!cancelled) {
            setCompletedLessons(
              []
            )
          }
        }
      }

    void loadCompletedLessons()

    return () => {
      cancelled = true
    }
  }, [roleId, topicId])

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600" />

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                Loading Lesson
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Loading lesson
                content...
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | INVALID TOPIC / API ERROR
  |--------------------------------------------------------------------------
  */

  if (!topic) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h1 className="text-2xl font-bold text-slate-900">
                Topic Not Found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {loadError ||
                  'The requested learning topic is not available.'}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/employee/roles/${roleId}`
                  )
                }
                className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Back to Roadmap
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | INVALID LESSON
  |--------------------------------------------------------------------------
  */

  if (
    Number.isNaN(
      numericLessonIndex
    ) ||
    numericLessonIndex < 0 ||
    numericLessonIndex >=
      topic.lessons.length
  ) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h1 className="text-2xl font-bold text-slate-900">
                Lesson Not Found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                The requested lesson
                does not exist.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/employee/roles/${roleId}/topics/${topicId}`
                  )
                }
                className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Back to Topic
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | CURRENT LESSON
  |--------------------------------------------------------------------------
  */

  const lesson =
    topic.lessons[
      numericLessonIndex
    ]

  const isFirstLesson =
    numericLessonIndex === 0

  const isLastLesson =
    numericLessonIndex ===
    topic.lessons.length - 1

  const lessonDatabaseId =
  Number(lesson.id)

  const isLessonComplete =
    completedLessons.includes(
      lessonDatabaseId
    )

  const completedCount =
  topic.lessons.filter(
    (topicLesson) =>
      completedLessons.includes(
        Number(topicLesson.id)
      )
  ).length

  const topicProgress =
    topic.lessons.length > 0
      ? Math.round(
          (completedCount /
            topic.lessons
              .length) *
            100
        )
      : 0

  /*
  |--------------------------------------------------------------------------
  | MARK LESSON COMPLETE
  |--------------------------------------------------------------------------
  */

  const markLessonComplete =
    async () => {
      if (
        isLessonComplete ||
        isCompleting
      ) {
        return
      }

      setIsCompleting(true)
      setCompletionError('')

      try {
        const token =
          localStorage.getItem(
            'skillforge-token'
          )

        if (!token) {
          throw new Error(
            'Authentication required.'
          )
        }

        const response =
          await fetch(
            `http://localhost:5000/api/progress/lessons/${encodeURIComponent(
              lesson.id
            )}/complete`,
            {
              method: 'POST',

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        const data =
          (await response.json()) as
            CompleteLessonResponse

        if (
          !response.ok ||
          !data.success ||
          !data.completed
        ) {
          throw new Error(
            data.message ||
              'Unable to complete lesson.'
          )
        }

        setCompletedLessons(
  (current) =>
    current.includes(
      lessonDatabaseId
    )
      ? current
      : [
          ...current,
          lessonDatabaseId,
        ]
)
      } catch (error) {
        console.error(
          'Failed to complete lesson:',
          error
        )

        setCompletionError(
          error instanceof Error
            ? error.message
            : 'Unable to mark this lesson as complete.'
        )
      } finally {
        setIsCompleting(false)
      }
    }

  /*
  |--------------------------------------------------------------------------
  | PREVIOUS LESSON
  |--------------------------------------------------------------------------
  */

  const goToPreviousLesson =
    () => {
      if (isFirstLesson) {
        return
      }

      navigate(
        `/employee/roles/${roleId}/topics/${topicId}/lessons/${
          numericLessonIndex -
          1
        }`
      )
    }

  /*
  |--------------------------------------------------------------------------
  | NEXT LESSON
  |--------------------------------------------------------------------------
  */

  const goToNextLesson =
    () => {
      if (isLastLesson) {
        return
      }

      navigate(
        `/employee/roles/${roleId}/topics/${topicId}/lessons/${
          numericLessonIndex +
          1
        }`
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
        <div className="mx-auto max-w-5xl">

          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              navigate(
                `/employee/roles/${roleId}/topics/${topicId}`
              )
            }
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-purple-600"
          >
            <ArrowLeft
              size={17}
            />

            Back to{' '}
            {topic.topicTitle}
          </button>

          {/* HEADER */}

          <div className="rounded-2xl bg-slate-900 p-7 text-white">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
                Lesson{' '}
                {numericLessonIndex +
                  1}{' '}
                of{' '}
                {
                  topic.lessons
                    .length
                }
              </span>

              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock3
                  size={14}
                />

                {
                  lesson.duration
                }
              </span>

              {isLessonComplete && (
                <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">
                  <CheckCircle2
                    size={14}
                  />

                  Completed
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-bold">
              {lesson.title}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              {
                lesson.description
              }
            </p>

            {/* TOPIC PROGRESS */}

            <div className="mt-7">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Topic Progress
                </span>

                <span className="font-semibold text-white">
                  {completedCount}{' '}
                  /{' '}
                  {
                    topic.lessons
                      .length
                  }{' '}
                  lessons
                  {' • '}
                  {topicProgress}%
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all duration-500"
                  style={{
                    width:
                      `${topicProgress}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* COMPLETION ERROR */}

          {completionError && (
            <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {completionError}
            </div>
          )}

          {/* MAIN */}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* CONTENT */}

            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <BookOpen
                      size={21}
                    />
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      Lesson
                      Content
                    </h2>

                    <p className="text-sm text-slate-500">
                      Study the
                      material below.
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-5">
                  {lesson.content.map(
                    (
                      paragraph,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                      >
                        <p className="text-sm leading-7 text-slate-700">
                          {
                            paragraph
                          }
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* NAVIGATION */}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={
                    goToPreviousLesson
                  }
                  disabled={
                    isFirstLesson
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-purple-200 hover:text-purple-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft
                    size={17}
                  />

                  Previous Lesson
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">
                  {!isLessonComplete && (
                    <button
                      type="button"
                      onClick={() =>
                        void markLessonComplete()
                      }
                      disabled={
                        isCompleting
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <CheckCircle2
                        size={17}
                      />

                      {isCompleting
                        ? 'Saving...'
                        : 'Mark Lesson Complete'}
                    </button>
                  )}

                  {isLessonComplete &&
                    !isLastLesson && (
                      <button
                        type="button"
                        onClick={
                          goToNextLesson
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                      >
                        Next Lesson

                        <ArrowRight
                          size={17}
                        />
                      </button>
                    )}

                  {isLessonComplete &&
                    isLastLesson && (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/employee/roles/${roleId}/topics/${topicId}`
                          )
                        }
                        className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                      >
                        Go to Topic
                        Assessment

                        <ArrowRight
                          size={17}
                        />
                      </button>
                    )}
                </div>
              </div>
            </div>

            {/* SIDEBAR */}

            <div>

              {/* RESOURCES */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                    <PlayCircle
                      size={21}
                    />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Resources
                    </h2>

                    <p className="text-xs text-slate-500">
                      Additional
                      learning
                      material
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {lesson.resources.map(
                    (resource) => (
                      <a
                        key={
                          resource.title
                        }
                        href={
                          resource.url
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-purple-300 hover:bg-purple-50"
                      >
                        <div className="flex items-center gap-3">
                          <PlayCircle
                            size={18}
                            className="shrink-0 text-purple-600"
                          />

                          <div>
                            <p className="text-sm font-semibold text-slate-800">
                              {
                                resource.title
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                resource.type
                              }
                            </p>
                          </div>
                        </div>

                        <ExternalLink
                          size={16}
                          className="text-slate-400"
                        />
                      </a>
                    )
                  )}
                </div>
              </div>

              {/* LESSON COMPLETION */}

              <div
                className={`mt-5 rounded-2xl border p-5 ${
                  isLessonComplete
                    ? 'border-green-100 bg-green-50'
                    : 'border-purple-100 bg-purple-50'
                }`}
              >
                <div className="flex gap-3">
                  <CheckCircle2
                    size={21}
                    className={`mt-0.5 shrink-0 ${
                      isLessonComplete
                        ? 'text-green-600'
                        : 'text-purple-600'
                    }`}
                  />

                  <div>
                    <h3
                      className={`text-sm font-semibold ${
                        isLessonComplete
                          ? 'text-green-900'
                          : 'text-purple-900'
                      }`}
                    >
                      {isLessonComplete
                        ? 'Lesson Completed'
                        : 'Complete This Lesson'}
                    </h3>

                    <p
                      className={`mt-1 text-sm leading-5 ${
                        isLessonComplete
                          ? 'text-green-700'
                          : 'text-purple-700'
                      }`}
                    >
                      {isLessonComplete
                        ? 'This lesson has been saved to your learning progress.'
                        : 'After studying the lesson material, mark this lesson as complete.'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    void markLessonComplete()
                  }
                  disabled={
                    isLessonComplete ||
                    isCompleting
                  }
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isLessonComplete
                      ? 'cursor-default bg-green-600 text-white'
                      : isCompleting
                        ? 'cursor-not-allowed bg-purple-400 text-white'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  <CheckCircle2
                    size={17}
                  />

                  {isLessonComplete
                    ? 'Completed'
                    : isCompleting
                      ? 'Saving...'
                      : 'Mark Lesson Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default LessonLearning