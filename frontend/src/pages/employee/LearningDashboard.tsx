import type {
  ReactNode,
} from 'react'

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CirclePlay,
  ClipboardCheck,
  Layers3,
  MapPinned,
  Sparkles,
  Target,
  Trophy,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'
import { roadmapData } from '../../data/roadmapData'

interface CompletedLesson {
  roleId: string
  topicId: string
  lessonId: number
}

interface DashboardLessonsResponse {
  success: boolean
  completedLessons?: CompletedLesson[]
}

interface CompletedTopicsResponse {
  success: boolean
  completedTopics?: string[]
}

const API_BASE = (import.meta.env.VITE_API_URL || 'http://localhost:5000')
  .replace(/\/$/, '')
  .replace(/\/api$/, '')

interface DashboardTopic {
  roleId: string
  roleTitle: string
  topicId: string
  topicTitle: string
  description: string
  totalLessons: number
  completedLessons: number
  lessonProgress: number
  isAssessmentReady: boolean
  isTopicCompleted: boolean
}

interface RoleProgress {
  roleId: string
  title: string
  description: string
  totalTopics: number
  completedTopics: number
  startedTopics: number
  progress: number
}

function LearningDashboard() {
  const navigate =
    useNavigate()

  const [completedLessons, setCompletedLessons] = useState<CompletedLesson[]>([])
  const [completedTopics, setCompletedTopics] = useState<string[]>([])
  const [isProgressLoading, setIsProgressLoading] = useState(true)
  const [progressError, setProgressError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadProgress() {
      setIsProgressLoading(true)
      setProgressError('')
      try {
        const token = localStorage.getItem('skillforge-token')
        if (!token) throw new Error('Please log in again.')
        const headers = { Authorization: `Bearer ${token}` }
        const [lessonsResponse, topicsResponse] = await Promise.all([
          fetch(`${API_BASE}/api/progress/dashboard-lessons`, { headers, cache: 'no-store' }),
          fetch(`${API_BASE}/api/progress`, { headers, cache: 'no-store' }),
        ])
        if (!lessonsResponse.ok || !topicsResponse.ok) {
          throw new Error('Unable to load your latest learning progress.')
        }
        const lessonsData = (await lessonsResponse.json()) as DashboardLessonsResponse
        const topicsData = (await topicsResponse.json()) as CompletedTopicsResponse
        if (!lessonsData.success || !topicsData.success ||
            !Array.isArray(lessonsData.completedLessons) ||
            !Array.isArray(topicsData.completedTopics)) {
          throw new Error('The server returned invalid progress data.')
        }
        if (cancelled) return
        setCompletedLessons(lessonsData.completedLessons)
        setCompletedTopics(topicsData.completedTopics)
      } catch (error) {
        if (!cancelled) {
          setProgressError(error instanceof Error ? error.message : 'Unable to load learning progress.')
        }
      } finally {
        if (!cancelled) setIsProgressLoading(false)
      }
    }

    void loadProgress()
    return () => { cancelled = true }
  }, [])

  const dashboard =
    useMemo(
      () => {
        const lessonProgress: Record<string, Set<number>> = {}
        completedLessons.forEach((lesson) => {
          const key = `${lesson.roleId}/${lesson.topicId}`
          if (!lessonProgress[key]) lessonProgress[key] = new Set<number>()
          lessonProgress[key].add(lesson.lessonId)
        })
        const completedTopicSet = new Set(completedTopics)

        const topics: DashboardTopic[] =
          []

        let totalLessons = 0
        let completedLessonCount = 0

        Object.entries(
          roadmapData
        ).forEach(
          ([
            roleId,
            role,
          ]) => {
            role.topics.forEach(
              (topic) => {
                totalLessons +=
                  topic.lessons

                const topicKey =
                  `${roleId}/${topic.id}`

                // The API returns database lesson IDs, not lesson indexes.
                const completedCount = Math.min(
                  lessonProgress[topicKey]?.size ?? 0,
                  topic.lessons
                )

                completedLessonCount +=
                  completedCount

                const isTopicCompleted =
                  completedTopicSet.has(
                    topicKey
                  )

                const areLessonsComplete =
                  topic.lessons > 0 &&
                  completedCount ===
                    topic.lessons

                topics.push({
                  roleId,
                  roleTitle:
                    role.title,
                  topicId:
                    topic.id,
                  topicTitle:
                    topic.title,
                  description:
                    topic.description,
                  totalLessons:
                    topic.lessons,
                  completedLessons:
                    completedCount,
                  lessonProgress:
                    topic.lessons > 0
                      ? Math.round(
                          (
                            completedCount /
                            topic.lessons
                          ) *
                            100
                        )
                      : 0,
                  isAssessmentReady:
                    areLessonsComplete &&
                    !isTopicCompleted,
                  isTopicCompleted,
                })
              }
            )
          }
        )

        const totalTopics =
          topics.length

        const completedTopicCount =
          topics.filter(
            (topic) =>
              topic.isTopicCompleted
          ).length

        const assessmentReadyCount =
          topics.filter(
            (topic) =>
              topic.isAssessmentReady
          ).length

        const activeTopics =
          topics.filter(
            (topic) =>
              topic.completedLessons > 0 &&
              !topic.isTopicCompleted
          )

        const roleProgress: RoleProgress[] =
          Object.entries(
            roadmapData
          ).map(
            ([
              roleId,
              role,
            ]) => {
              const roleTopics =
                topics.filter(
                  (topic) =>
                    topic.roleId ===
                    roleId
                )

              const completed =
                roleTopics.filter(
                  (topic) =>
                    topic.isTopicCompleted
                ).length

              const started =
                roleTopics.filter(
                  (topic) =>
                    topic.completedLessons >
                      0 ||
                    topic.isTopicCompleted
                ).length

              return {
                roleId,
                title:
                  role.title,
                description:
                  role.description,
                totalTopics:
                  role.topics.length,
                completedTopics:
                  completed,
                startedTopics:
                  started,
                progress:
                  role.topics.length > 0
                    ? Math.round(
                        (
                          completed /
                          role.topics.length
                        ) *
                          100
                      )
                    : 0,
              }
            }
          )

        const continueTopics =
          topics
            .filter(
              (topic) =>
                !topic.isTopicCompleted
            )
            .sort(
              (
                first,
                second
              ) => {
                if (
                  first.isAssessmentReady &&
                  !second.isAssessmentReady
                ) {
                  return -1
                }

                if (
                  second.isAssessmentReady &&
                  !first.isAssessmentReady
                ) {
                  return 1
                }

                return (
                  second.lessonProgress -
                  first.lessonProgress
                )
              }
            )
            .slice(
              0,
              3
            )

        const strongestRole =
          [...roleProgress].sort(
            (
              first,
              second
            ) =>
              second.progress -
              first.progress
          )[0]

        return {
          topics,
          roleProgress,
          continueTopics,
          strongestRole,
          totalTopics,
          totalLessons,
          completedLessonCount,
          completedTopicCount,
          assessmentReadyCount,
          activeTopicCount:
            activeTopics.length,
          overallProgress:
            totalTopics > 0
              ? Math.round(
                  (
                    completedTopicCount /
                    totalTopics
                  ) *
                    100
                )
              : 0,
        }
      },
      [completedLessons, completedTopics]
    )

  const primaryTopic =
    dashboard.continueTopics[0]

  const handleContinueLearning =
    () => {
      if (!primaryTopic) {
        navigate(
          '/employee/roles'
        )
        return
      }

      if (
        primaryTopic.isAssessmentReady
      ) {
        navigate(
          `/employee/roles/${primaryTopic.roleId}/topics/${primaryTopic.topicId}/quiz`
        )

        return
      }

      navigate(
        `/employee/roles/${primaryTopic.roleId}/topics/${primaryTopic.topicId}`
      )
    }

  if (isProgressLoading) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-slate-600">Loading your latest learning progress...</div>
      </DashboardLayout>
    )
  }

  if (progressError) {
    return (
      <DashboardLayout>
        <div className="p-8 text-center text-red-600">{progressError}</div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-5 py-6 lg:px-8">

          {/* HERO */}

          <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-xl shadow-slate-200/60 md:px-8 md:py-9">

            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-purple-600/25 blur-3xl" />

            <div className="absolute bottom-0 left-1/3 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl" />

            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">

                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-purple-200">
                  <Sparkles size={14} />

                  Your learning workspace
                </div>

                <h1 className="mt-5 text-3xl font-bold tracking-tight md:text-4xl">
                  Build skills that move your
                  career forward.
                </h1>

                <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                  Follow structured career
                  roadmaps, finish lessons,
                  complete assessments, and
                  track verified topic progress.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">

                  <button
                    onClick={
                      handleContinueLearning
                    }
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
                  >
                    {primaryTopic
                      ?.isAssessmentReady
                      ? 'Take Assessment'
                      : 'Continue Learning'}

                    <ArrowRight
                      size={17}
                    />
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        '/employee/roles'
                      )
                    }
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
                  >
                    Explore Roadmaps

                    <MapPinned
                      size={17}
                    />
                  </button>

                </div>

              </div>

              <div className="flex shrink-0 items-center gap-5">

                <div className="relative flex h-36 w-36 items-center justify-center rounded-full border border-white/10 bg-white/5">

                  <div
                    className="absolute inset-2 rounded-full"
                    style={{
                      background: `conic-gradient(#a855f7 ${dashboard.overallProgress * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
                    }}
                  />

                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-slate-950">
                    <div className="text-center">

                      <p className="text-3xl font-bold">
                        {
                          dashboard.overallProgress
                        }
                        %
                      </p>

                      <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-slate-400">
                        Overall
                      </p>

                    </div>
                  </div>

                </div>

              </div>

            </div>

          </section>

          {/* KPI CARDS */}

          <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <MetricCard
              icon={
                <BookOpen
                  size={21}
                />
              }
              value={`${dashboard.completedLessonCount}/${dashboard.totalLessons}`}
              title="Lessons completed"
              description="Across all roadmaps"
            />

            <MetricCard
              icon={
                <Trophy
                  size={21}
                />
              }
              value={`${dashboard.completedTopicCount}/${dashboard.totalTopics}`}
              title="Topics completed"
              description="Assessment verified"
            />

            <MetricCard
              icon={
                <ClipboardCheck
                  size={21}
                />
              }
              value={String(
                dashboard.assessmentReadyCount
              )}
              title="Assessments ready"
              description="Ready to be attempted"
            />

            <MetricCard
              icon={
                <CirclePlay
                  size={21}
                />
              }
              value={String(
                dashboard.activeTopicCount
              )}
              title="Active topics"
              description="Currently in progress"
            />

          </section>

          {/* PRIMARY GRID */}

          <section className="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-[1.65fr_0.85fr]">

            {/* CONTINUE LEARNING */}

            <div>

              <SectionHeader
                eyebrow="Learning"
                title="Continue where you left off"
                description="Your highest-priority learning items based on lesson and assessment progress."
                actionLabel="View all roles"
                onAction={() =>
                  navigate(
                    '/employee/roles'
                  )
                }
              />

              <div className="mt-4 space-y-4">

                {dashboard
                  .continueTopics
                  .length >
                0 ? (
                  dashboard.continueTopics.map(
                    (
                      topic,
                      index
                    ) => (
                      <LearningItem
                        key={`${topic.roleId}/${topic.topicId}`}
                        topic={
                          topic
                        }
                        featured={
                          index ===
                          0
                        }
                        onOpen={() => {
                          if (
                            topic.isAssessmentReady
                          ) {
                            navigate(
                              `/employee/roles/${topic.roleId}/topics/${topic.topicId}/quiz`
                            )

                            return
                          }

                          navigate(
                            `/employee/roles/${topic.roleId}/topics/${topic.topicId}`
                          )
                        }}
                      />
                    )
                  )
                ) : (
                  <EmptyLearningState
                    onOpen={() =>
                      navigate(
                        '/employee/roles'
                      )
                    }
                  />
                )}

              </div>

            </div>

            {/* PROGRESS PANEL */}

            <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
                    Progress summary
                  </p>

                  <h2 className="mt-1 text-lg font-bold text-slate-900">
                    Learning health
                  </h2>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <Target size={21} />
                </div>

              </div>

              <div className="mt-6 space-y-3">

                <ProgressSummaryItem
                  label="Lessons completed"
                  value={
                    dashboard.completedLessonCount
                  }
                  total={
                    dashboard.totalLessons
                  }
                />

                <ProgressSummaryItem
                  label="Topics completed"
                  value={
                    dashboard.completedTopicCount
                  }
                  total={
                    dashboard.totalTopics
                  }
                />

                <ProgressSummaryItem
                  label="Assessments ready"
                  value={
                    dashboard.assessmentReadyCount
                  }
                />

                <ProgressSummaryItem
                  label="Career paths"
                  value={
                    Object.keys(
                      roadmapData
                    ).length
                  }
                />

              </div>

              <div className="mt-6 rounded-2xl bg-slate-950 p-5 text-white">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">
                    <Trophy
                      size={19}
                    />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Strongest roadmap
                    </p>

                    <p className="mt-0.5 font-semibold">
                      {
                        dashboard
                          .strongestRole
                          ?.title
                      }
                    </p>
                  </div>

                </div>

                <div className="mt-5 flex items-center justify-between text-xs">

                  <span className="text-slate-400">
                    Verified progress
                  </span>

                  <span className="font-semibold text-purple-300">
                    {
                      dashboard
                        .strongestRole
                        ?.progress
                    }
                    %
                  </span>

                </div>

                <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">

                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{
                      width:
                        `${dashboard.strongestRole?.progress ?? 0}%`,
                    }}
                  />

                </div>

              </div>

            </aside>

          </section>

          {/* ROADMAPS */}

          <section className="mt-10">

            <SectionHeader
              eyebrow="Career development"
              title="Career roadmaps"
              description="Your progress only increases when topic assessments are passed."
              actionLabel="Explore all"
              onAction={() =>
                navigate(
                  '/employee/roles'
                )
              }
            />

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

              {dashboard.roleProgress.map(
                (role) => (
                  <RoadmapCard
                    key={
                      role.roleId
                    }
                    role={
                      role
                    }
                    onOpen={() =>
                      navigate(
                        `/employee/roles/${role.roleId}`
                      )
                    }
                  />
                )
              )}

            </div>

          </section>

          {/* BOTTOM ACTION AREA */}

          <section className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">

            <div className="rounded-3xl border border-purple-200 bg-purple-50 p-6">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600 text-white">
                <CirclePlay
                  size={21}
                />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-purple-600">
                Instructor support
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Need help with a topic?
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                Join role-specific live doubt
                sessions and get support while
                progressing through your
                roadmap.
              </p>

              <button
                onClick={() =>
                  navigate(
                    '/employee/live-sessions'
                  )
                }
                className="mt-5 flex items-center gap-2 text-sm font-semibold text-purple-700"
              >
                View live sessions

                <ArrowRight
                  size={16}
                />
              </button>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <ClipboardCheck
                  size={21}
                />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Assessment workflow
              </p>

              <h2 className="mt-1 text-xl font-bold text-slate-900">
                Complete. Assess. Advance.
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-slate-600">
                Completing lessons unlocks an
                assessment. Passing the
                assessment verifies the topic
                and updates your roadmap
                progress.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold">

                <WorkflowBadge>
                  Lessons
                </WorkflowBadge>

                <ArrowRight
                  size={14}
                  className="text-slate-400"
                />

                <WorkflowBadge>
                  Assessment
                </WorkflowBadge>

                <ArrowRight
                  size={14}
                  className="text-slate-400"
                />

                <WorkflowBadge>
                  Topic completed
                </WorkflowBadge>

              </div>

            </div>

          </section>

        </div>
      </div>
    </DashboardLayout>
  )
}

interface MetricCardProps {
  icon: ReactNode
  value: string
  title: string
  description: string
}

function MetricCard({
  icon,
  value,
  title,
  description,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-2xl font-bold tracking-tight text-slate-900">
            {value}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
          {icon}
        </div>

      </div>

    </div>
  )
}

interface SectionHeaderProps {
  eyebrow: string
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}

function SectionHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  onAction,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-purple-600">
          {eyebrow}
        </p>

        <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
          {title}
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          {description}
        </p>
      </div>

      <button
        onClick={onAction}
        className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-purple-600 transition hover:text-purple-700"
      >
        {actionLabel}

        <ArrowRight
          size={15}
        />
      </button>

    </div>
  )
}

interface LearningItemProps {
  topic: DashboardTopic
  featured: boolean
  onOpen: () => void
}

function LearningItem({
  topic,
  featured,
  onOpen,
}: LearningItemProps) {
  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        featured
          ? 'border-purple-200'
          : 'border-slate-200'
      }`}
    >

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
            topic.isAssessmentReady
              ? 'bg-amber-100 text-amber-600'
              : 'bg-purple-100 text-purple-600'
          }`}
        >
          {topic.isAssessmentReady ? (
            <ClipboardCheck
              size={24}
            />
          ) : (
            <BookOpen
              size={24}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <p className="text-xs font-semibold text-purple-600">
              {topic.roleTitle}
            </p>

            {topic.isAssessmentReady && (
              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Assessment ready
              </span>
            )}

          </div>

          <h3 className="mt-1 truncate font-bold text-slate-900">
            {topic.topicTitle}
          </h3>

          <p className="mt-1 line-clamp-1 text-sm text-slate-500">
            {topic.description}
          </p>

          <div className="mt-4">

            <div className="flex items-center justify-between text-xs">

              <span className="text-slate-500">
                {topic.completedLessons}/
                {topic.totalLessons}{' '}
                lessons completed
              </span>

              <span className="font-bold text-slate-700">
                {
                  topic.lessonProgress
                }
                %
              </span>

            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  topic.isAssessmentReady
                    ? 'bg-amber-500'
                    : 'bg-purple-600'
                }`}
                style={{
                  width:
                    `${topic.lessonProgress}%`,
                }}
              />

            </div>

          </div>

        </div>

        <button
          onClick={onOpen}
          className={`flex shrink-0 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
            topic.isAssessmentReady
              ? 'bg-amber-500 text-white hover:bg-amber-600'
              : 'bg-slate-950 text-white hover:bg-slate-800'
          }`}
        >
          {topic.isAssessmentReady
            ? 'Take Quiz'
            : topic.completedLessons >
                0
              ? 'Continue'
              : 'Start'}

          <ArrowRight
            size={15}
          />
        </button>

      </div>

    </article>
  )
}

interface ProgressSummaryItemProps {
  label: string
  value: number
  total?: number
}

function ProgressSummaryItem({
  label,
  value,
  total,
}: ProgressSummaryItemProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">

      <span className="text-sm font-medium text-slate-600">
        {label}
      </span>

      <span className="text-sm font-bold text-slate-900">
        {total !== undefined
          ? `${value}/${total}`
          : value}
      </span>

    </div>
  )
}

interface RoadmapCardProps {
  role: RoleProgress
  onOpen: () => void
}

function RoadmapCard({
  role,
  onOpen,
}: RoadmapCardProps) {
  const isComplete =
    role.completedTopics ===
    role.totalTopics

  const isStarted =
    role.startedTopics > 0

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg">

      <div className="flex items-start justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white transition group-hover:bg-purple-600">
          <Layers3
            size={21}
          />
        </div>

        {isComplete ? (
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase text-green-700">
            <CheckCircle2
              size={12}
            />

            Completed
          </span>
        ) : isStarted ? (
          <span className="rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-bold uppercase text-purple-700">
            In progress
          </span>
        ) : (
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase text-slate-500">
            Not started
          </span>
        )}

      </div>

      <h3 className="mt-5 font-bold text-slate-900">
        {role.title}
      </h3>

      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-500">
        {role.description}
      </p>

      <div className="mt-5">

        <div className="flex items-center justify-between text-xs">

          <span className="text-slate-500">
            {role.completedTopics}/
            {role.totalTopics}{' '}
            topics
          </span>

          <span className="font-bold text-purple-600">
            {role.progress}%
          </span>

        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

          <div
            className="h-full rounded-full bg-purple-600 transition-all duration-500"
            style={{
              width:
                `${role.progress}%`,
            }}
          />

        </div>

      </div>

      <button
        onClick={onOpen}
        className="mt-5 flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
      >
        View roadmap

        <ArrowRight
          size={15}
        />
      </button>

    </article>
  )
}

interface EmptyLearningStateProps {
  onOpen: () => void
}

function EmptyLearningState({
  onOpen,
}: EmptyLearningStateProps) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-10 text-center">

      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
        <MapPinned
          size={25}
        />
      </div>

      <h3 className="mt-4 font-bold text-slate-900">
        Start your learning journey
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        Choose a career roadmap and
        complete your first lesson to see
        personalized learning progress here.
      </p>

      <button
        onClick={onOpen}
        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
      >
        Explore roles

        <ArrowRight
          size={16}
        />
      </button>

    </div>
  )
}

interface WorkflowBadgeProps {
  children: ReactNode
}

function WorkflowBadge({
  children,
}: WorkflowBadgeProps) {
  return (
    <span className="rounded-lg bg-slate-100 px-3 py-2 text-slate-600">
      {children}
    </span>
  )
}

export default LearningDashboard