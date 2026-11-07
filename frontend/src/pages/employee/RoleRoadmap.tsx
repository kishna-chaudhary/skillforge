import {
  useEffect,
  useState,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock3,
  LockKeyhole,
  PlayCircle,
  Trophy,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'

// ============================================================
// TYPES
// ============================================================

interface CareerRole {
  id: number
  slug: string
  title: string
  description: string | null
}

interface CareerTopic {
  id: number
  slug: string
  title: string
  description: string | null
  duration: string | null
  position: number
  lessonCount: number
}

interface CareerTopicsResponse {
  success: boolean
  message?: string
  role?: CareerRole
  topics?: CareerTopic[]
}

interface ProgressResponse {
  success: boolean
  message?: string
  completedTopics?: string[]
}

interface CareerCertificate {
  roleId: string
  roleTitle: string
  totalTopics: number
  completedTopics: number
  remainingTopics: number
  topicPercentage: number
  allTopicsCompleted: boolean
  practicalPassed: boolean
  earned: boolean
}

interface CertificatesResponse {
  success: boolean
  message?: string
  certificates?: CareerCertificate[]
}

// ============================================================
// COMPONENT
// ============================================================

function RoleRoadmap() {
  const navigate =
    useNavigate()

  const {
    roleId,
  } = useParams()

  const [
    role,
    setRole,
  ] =
    useState<CareerRole | null>(
      null
    )

  const [
    topics,
    setTopics,
  ] =
    useState<CareerTopic[]>([])

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true)

  const [
    error,
    setError,
  ] =
    useState<string | null>(
      null
    )

  const [
    notFound,
    setNotFound,
  ] =
    useState(false)

  const [
    completedTopics,
    setCompletedTopics,
  ] =
    useState<string[]>([])

  const [
    certificateProgress,
    setCertificateProgress,
  ] =
    useState<CareerCertificate | null>(
      null
    )

  // ==========================================================
  // LOAD ROADMAP + PROGRESS + CERTIFICATE STATUS
  // ==========================================================

  useEffect(() => {
    let cancelled = false

    const loadRoadmap =
      async () => {
        if (!roleId) {
          setNotFound(true)
          setIsLoading(false)
          return
        }

        setIsLoading(true)
        setError(null)
        setNotFound(false)

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

          const [
            roadmapResponse,
            progressResponse,
            certificatesResponse,
          ] =
            await Promise.all([
              fetch(
                `http://localhost:5000/api/career-roles/${encodeURIComponent(
                  roleId
                )}/topics`
              ),

              fetch(
                'http://localhost:5000/api/progress',
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                }
              ),

              fetch(
                'http://localhost:5000/api/progress/certificates',
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,
                  },
                }
              ),
            ])

          const roadmapData =
            (await roadmapResponse.json()) as
              CareerTopicsResponse

          const progressData =
            (await progressResponse.json()) as
              ProgressResponse

          const certificatesData =
            (await certificatesResponse.json()) as
              CertificatesResponse

          if (cancelled) {
            return
          }

          if (
            roadmapResponse.status ===
            404
          ) {
            setNotFound(true)
            setRole(null)
            setTopics([])
            setCompletedTopics([])
            setCertificateProgress(
              null
            )
            return
          }

          if (
            !roadmapResponse.ok ||
            !roadmapData.success ||
            !roadmapData.role ||
            !roadmapData.topics
          ) {
            throw new Error(
              roadmapData.message ||
                'Failed to load career roadmap'
            )
          }

          if (
            !progressResponse.ok ||
            !progressData.success
          ) {
            throw new Error(
              progressData.message ||
                'Failed to load progress'
            )
          }

          if (
            !certificatesResponse.ok ||
            !certificatesData.success
          ) {
            throw new Error(
              certificatesData.message ||
                'Failed to load role completion status'
            )
          }

          setRole(
            roadmapData.role
          )

          setTopics(
            roadmapData.topics
          )

          setCompletedTopics(
            Array.isArray(
              progressData.completedTopics
            )
              ? progressData.completedTopics.filter(
                  (
                    value
                  ): value is string =>
                    typeof value ===
                    'string'
                )
              : []
          )

          const currentCertificate =
            Array.isArray(
              certificatesData.certificates
            )
              ? certificatesData.certificates.find(
                  (certificate) =>
                    certificate.roleId ===
                    roleId
                ) || null
              : null

          setCertificateProgress(
            currentCertificate
          )
        } catch (error) {
          if (cancelled) {
            return
          }

          console.error(
            'Failed to load career roadmap:',
            error
          )

          setError(
            error instanceof Error
              ? error.message
              : 'Unable to load this career roadmap. Please try again.'
          )
        } finally {
          if (!cancelled) {
            setIsLoading(false)
          }
        }
      }

    void loadRoadmap()

    return () => {
      cancelled = true
    }
  }, [roleId])

  // ==========================================================
  // DERIVED PROGRESS
  // ==========================================================

  const completedCount =
    topics.filter(
      (topic) => {
        if (!roleId) {
          return false
        }

        const topicKey =
          `${roleId}/${topic.slug}`

        return completedTopics.includes(
          topicKey
        )
      }
    ).length

  const progressPercentage =
    topics.length > 0
      ? Math.round(
          (
            completedCount /
            topics.length
          ) * 100
        )
      : 0

  const isPracticalChallengeUnlocked =
    certificateProgress
      ? certificateProgress.allTopicsCompleted
      : topics.length > 0 &&
        completedCount ===
          topics.length

  const practicalPassed =
    certificateProgress?.practicalPassed ===
    true

  const roleCompleted =
    certificateProgress?.earned ===
    true

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading career
                roadmap...
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ==========================================================
  // NOT FOUND
  // ==========================================================

  if (notFound) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <h1 className="text-2xl font-bold text-slate-900">
                Role Not Found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                The requested career
                roadmap does not exist.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/employee/roles'
                  )
                }
                className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Back to Roles
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ==========================================================
  // ERROR
  // ==========================================================

  if (error || !role) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
              <h1 className="text-xl font-bold text-red-800">
                Roadmap unavailable
              </h1>

              <p className="mt-2 text-sm text-red-600">
                {error ||
                  'Unable to load this career roadmap.'}
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/employee/roles'
                  )
                }
                className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Back to Roles
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">

          {/* BACK */}

          <button
            type="button"
            onClick={() =>
              navigate(
                '/employee/roles'
              )
            }
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-purple-600"
          >
            <ArrowLeft
              size={17}
            />

            Back to Roles
          </button>

          {/* HEADER */}

          <div
            className={`rounded-2xl p-7 text-white ${
              roleCompleted
                ? 'bg-green-950'
                : 'bg-slate-900'
            }`}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    roleCompleted
                      ? 'text-green-300'
                      : 'text-purple-400'
                  }`}
                >
                  {roleCompleted
                    ? 'Career Path Completed'
                    : 'Career Roadmap'}
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  {role.title}
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300">
                  {role.description ||
                    'Follow this structured SkillForge career roadmap.'}
                </p>
              </div>

              {roleCompleted && (
                <div className="flex shrink-0 items-center gap-2 rounded-xl border border-green-700 bg-green-900 px-4 py-2 text-sm font-semibold text-green-100">
                  <Award
                    size={18}
                  />

                  Certificate Earned
                </div>
              )}
            </div>

            {/* PROGRESS */}

            <div className="mt-7">
              <div className="flex items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400">
                    Topic Progress
                  </span>

                  <span className="text-slate-500">
                    •
                  </span>

                  <span className="text-slate-400">
                    {completedCount} of{' '}
                    {topics.length}{' '}
                    topics
                  </span>

                  {practicalPassed && (
                    <>
                      <span className="text-slate-500">
                        •
                      </span>

                      <span className="font-semibold text-green-300">
                        Practical
                        Passed
                      </span>
                    </>
                  )}
                </div>

                <span className="shrink-0 font-semibold text-white">
                  {
                    progressPercentage
                  }
                  %
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
                <div
                  className={`h-full rounded-full transition-all ${
                    roleCompleted
                      ? 'bg-green-500'
                      : 'bg-purple-500'
                  }`}
                  style={{
                    width:
                      `${progressPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* COMPLETED ROLE NOTICE */}

          {roleCompleted && (
            <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5">
              <div className="flex gap-3">
                <Trophy
                  size={22}
                  className="mt-0.5 shrink-0 text-green-600"
                />

                <div className="flex-1">
                  <h2 className="text-sm font-bold text-green-900">
                    Career roadmap
                    completed
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-green-700">
                    You have passed all
                    required topic
                    assessments and the
                    Final Practical
                    Challenge for{' '}
                    {role.title}. Your
                    career certificate
                    has been earned.
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/employee/certificates'
                      )
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    View Certificate

                    <ArrowRight
                      size={16}
                    />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ROADMAP */}

          <div className="mt-8">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Learning Roadmap
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Complete all lessons
                and pass each topic
                assessment to progress
                through your career
                path.
              </p>
            </div>

            {/* TOPICS */}

            <div className="space-y-4">
              {topics.map(
                (
                  topic,
                  index
                ) => {
                  const topicKey =
                    `${roleId}/${topic.slug}`

                  const isCompleted =
                    completedTopics.includes(
                      topicKey
                    )

                  return (
                    <div
                      key={topic.id}
                      className="group flex gap-4"
                    >
                      {/* NUMBER / STATUS */}

                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 ${
                            isCompleted
                              ? 'border-green-500 bg-green-50 text-green-600'
                              : 'border-purple-200 bg-purple-50 text-purple-600'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2
                              size={21}
                            />
                          ) : (
                            <span className="text-sm font-bold">
                              {String(
                                index +
                                  1
                              ).padStart(
                                2,
                                '0'
                              )}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 h-full w-px bg-slate-200" />
                      </div>

                      {/* TOPIC CARD */}

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/employee/roles/${roleId}/topics/${topic.slug}`
                          )
                        }
                        className="mb-4 flex flex-1 items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900">
                              {
                                topic.title
                              }
                            </h3>

                            {index ===
                              0 &&
                              !isCompleted && (
                                <span className="rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-purple-700">
                                  Start Here
                                </span>
                              )}

                            {isCompleted && (
                              <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
                                Completed
                              </span>
                            )}
                          </div>

                          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            {topic.description ||
                              'Continue learning this topic.'}
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Clock3
                                size={
                                  14
                                }
                              />

                              {topic.duration ||
                                'Self-paced'}
                            </span>

                            <span className="flex items-center gap-1.5">
                              <BookOpen
                                size={
                                  14
                                }
                              />

                              {
                                topic.lessonCount
                              }{' '}
                              {topic.lessonCount ===
                              1
                                ? 'lesson'
                                : 'lessons'}
                            </span>
                          </div>
                        </div>

                        <div className="ml-4 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-purple-100 group-hover:text-purple-600 sm:flex">
                          <ArrowRight
                            size={18}
                          />
                        </div>
                      </button>
                    </div>
                  )
                }
              )}
            </div>

            {/* FINAL PRACTICAL CHALLENGE */}

            <div className="mt-4 flex gap-4">

              {/* FINAL STATUS */}

              <div className="flex flex-col items-center">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 ${
                    practicalPassed
                      ? 'border-green-500 bg-green-50 text-green-600'
                      : isPracticalChallengeUnlocked
                        ? 'border-purple-500 bg-purple-50 text-purple-600'
                        : 'border-slate-300 bg-slate-100 text-slate-400'
                  }`}
                >
                  {practicalPassed ? (
                    <CheckCircle2
                      size={21}
                    />
                  ) : isPracticalChallengeUnlocked ? (
                    <Trophy
                      size={21}
                    />
                  ) : (
                    <LockKeyhole
                      size={19}
                    />
                  )}
                </div>
              </div>

              {/* FINAL CHALLENGE CARD */}

              <div
                className={`flex-1 overflow-hidden rounded-2xl border shadow-sm ${
                  practicalPassed
                    ? 'border-green-200 bg-white'
                    : isPracticalChallengeUnlocked
                      ? 'border-purple-200 bg-white'
                      : 'border-slate-200 bg-slate-100'
                }`}
              >
                <div className="p-6">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-xs font-bold uppercase tracking-wider ${
                            practicalPassed
                              ? 'text-green-600'
                              : 'text-purple-600'
                          }`}
                        >
                          Final
                          Assessment
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            practicalPassed
                              ? 'bg-green-100 text-green-700'
                              : isPracticalChallengeUnlocked
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {practicalPassed
                            ? 'Passed'
                            : isPracticalChallengeUnlocked
                              ? 'Unlocked'
                              : 'Locked'}
                        </span>
                      </div>

                      <h3 className="mt-2 text-xl font-bold text-slate-900">
                        Final Practical
                        Challenge
                      </h3>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        {practicalPassed
                          ? `You successfully passed the ${role.title} Final Practical Challenge.`
                          : isPracticalChallengeUnlocked
                            ? `Put your ${role.title} skills into practice by completing the final hands-on challenge.`
                            : 'Complete all topics and pass every topic assessment to unlock this practical challenge.'}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Trophy
                            size={14}
                          />

                          Practical
                          assessment
                        </span>

                        <span
                          className={`flex items-center gap-1.5 ${
                            practicalPassed
                              ? 'font-semibold text-green-600'
                              : ''
                          }`}
                        >
                          <CheckCircle2
                            size={14}
                          />

                          {practicalPassed
                            ? 'Certification requirement completed'
                            : 'Required for certification'}
                        </span>
                      </div>
                    </div>

                    {practicalPassed ? (
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            '/employee/certificates'
                          )
                        }
                        className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                      >
                        <Award
                          size={17}
                        />

                        View Certificate
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={
                          !isPracticalChallengeUnlocked
                        }
                        onClick={() => {
                          if (
                            isPracticalChallengeUnlocked
                          ) {
                            navigate(
                              `/employee/practical-challenge/${roleId}`
                            )
                          }
                        }}
                        className={`flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${
                          isPracticalChallengeUnlocked
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : 'cursor-not-allowed bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isPracticalChallengeUnlocked ? (
                          <>
                            Start
                            Challenge

                            <ArrowRight
                              size={
                                17
                              }
                            />
                          </>
                        ) : (
                          <>
                            <LockKeyhole
                              size={
                                16
                              }
                            />

                            Locked
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className={`border-t px-6 py-3 text-xs ${
                    practicalPassed
                      ? 'border-green-100 bg-green-50 text-green-700'
                      : isPracticalChallengeUnlocked
                        ? 'border-purple-100 bg-purple-50 text-purple-700'
                        : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  {practicalPassed
                    ? 'Final practical challenge passed. Your career certification requirements are complete.'
                    : isPracticalChallengeUnlocked
                      ? 'All topic assessments completed. You are eligible to attempt the final practical challenge.'
                      : `${completedCount} of ${topics.length} topics completed`}
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM MESSAGE */}

          <div
            className={`mt-8 rounded-2xl border p-5 ${
              roleCompleted
                ? 'border-green-200 bg-green-50'
                : 'border-purple-100 bg-purple-50'
            }`}
          >
            <div className="flex gap-3">
              {roleCompleted ? (
                <Trophy
                  size={21}
                  className="mt-0.5 shrink-0 text-green-600"
                />
              ) : (
                <PlayCircle
                  size={21}
                  className="mt-0.5 shrink-0 text-purple-600"
                />
              )}

              <div>
                <h3
                  className={`text-sm font-semibold ${
                    roleCompleted
                      ? 'text-green-900'
                      : 'text-purple-900'
                  }`}
                >
                  {roleCompleted
                    ? 'Career path completed'
                    : 'Learn at your own pace'}
                </h3>

                <p
                  className={`mt-1 text-sm leading-6 ${
                    roleCompleted
                      ? 'text-green-700'
                      : 'text-purple-700'
                  }`}
                >
                  {roleCompleted
                    ? `You have completed the ${role.title} roadmap and passed its Final Practical Challenge. Your certificate is now available.`
                    : 'Complete the lessons in each topic and pass its assessment to mark the topic as completed. Once all topics are complete, the final practical challenge will be unlocked.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default RoleRoadmap