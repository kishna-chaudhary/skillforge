import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CircleCheckBig,
  ClipboardCheck,
  LockKeyhole,
  Target,
  TrendingUp,
} from 'lucide-react'

import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'
import { roadmapData } from '../../data/roadmapData'

interface CompletedLessonRecord {
  roleId: string
  topicId: string
  lessonId: number
}

interface DashboardLessonsResponse {
  success: boolean
  completedLessons?: CompletedLessonRecord[]
}

interface CompletedTopicsResponse {
  success: boolean
  completedTopics?: string[]
}

const API_BASE = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/$/, '').replace(/\/api$/, '')

interface RoleProgress {
  roleId: string
  roleTitle: string
  totalTopics: number
  completedTopics: number
  completedLessons: number
  totalLessons: number
  assessmentReady: number
  percentage: number
}

function Progress() {
  const navigate = useNavigate()
  const [completedLessons, setCompletedLessons] =
    useState<CompletedLessonRecord[]>([])
  const [completedTopics, setCompletedTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    const loadProgress = async () => {
      setLoading(true)
      setErrorMessage('')

      try {
        const token = localStorage.getItem('skillforge-token')
        if (!token) throw new Error('Please log in again.')

        const headers = { Authorization: `Bearer ${token}` }
        const [lessonsResponse, topicsResponse] = await Promise.all([
          fetch(`${API_BASE}/api/progress/dashboard-lessons`, { headers }),
          fetch(`${API_BASE}/api/progress`, { headers }),
        ])

        if (!lessonsResponse.ok || !topicsResponse.ok) {
          throw new Error('Unable to load your latest learning progress.')
        }

        const lessonsData =
          (await lessonsResponse.json()) as DashboardLessonsResponse
        const topicsData =
          (await topicsResponse.json()) as CompletedTopicsResponse

        if (
          !lessonsData.success ||
          !topicsData.success ||
          !Array.isArray(lessonsData.completedLessons) ||
          !Array.isArray(topicsData.completedTopics)
        ) {
          throw new Error('The server returned invalid progress data.')
        }

        if (!cancelled) {
          setCompletedLessons(lessonsData.completedLessons)
          setCompletedTopics(topicsData.completedTopics)
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Unable to load learning progress.'
          )
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadProgress()
    return () => { cancelled = true }
  }, [])

  const completedLessonCounts = useMemo(() => {
    const counts: Record<string, Set<number>> = {}
    completedLessons.forEach(({ roleId, topicId, lessonId }) => {
      const key = `${roleId}/${topicId}`
      if (!counts[key]) counts[key] = new Set<number>()
      counts[key].add(lessonId)
    })
    return counts
  }, [completedLessons])

  const completedTopicSet = useMemo(
    () => new Set(completedTopics),
    [completedTopics]
  )

  // ==================================================
  // CALCULATE ROLE PROGRESS
  // ==================================================

  const roleProgress: RoleProgress[] =
    Object.entries(
      roadmapData
    ).map(
      ([roleId, role]) => {
        let totalLessons = 0
        let completedLessonCount = 0
        let completedTopicCount = 0
        let assessmentReady = 0

        role.topics.forEach(
          (topic) => {
            const topicKey =
              `${roleId}/${topic.id}`

            totalLessons +=
              topic.lessons

            const completedCount = Math.min(
              completedLessonCounts[topicKey]?.size ?? 0,
              topic.lessons
            )

            completedLessonCount += completedCount

            const isCompleted =
              completedTopicSet.has(
                topicKey
              )

            if (isCompleted) {
              completedTopicCount += 1
            }

            const allLessonsComplete =
              topic.lessons > 0 &&
              completedCount >=
              topic.lessons

            if (
              allLessonsComplete &&
              !isCompleted
            ) {
              assessmentReady += 1
            }
          }
        )

        const percentage =
          role.topics.length > 0
            ? Math.round(
                (completedTopicCount /
                  role.topics.length) *
                  100
              )
            : 0

        return {
          roleId,
          roleTitle: role.title,
          totalTopics:
            role.topics.length,
          completedTopics:
            completedTopicCount,
          completedLessons:
            completedLessonCount,
          totalLessons,
          assessmentReady,
          percentage,
        }
      }
    )

  // ==================================================
  // GLOBAL METRICS
  // ==================================================

  const totalTopics =
    roleProgress.reduce(
      (sum, role) =>
        sum + role.totalTopics,
      0
    )

  const totalCompletedTopics =
    roleProgress.reduce(
      (sum, role) =>
        sum +
        role.completedTopics,
      0
    )

  const totalLessons =
    roleProgress.reduce(
      (sum, role) =>
        sum + role.totalLessons,
      0
    )

  const totalCompletedLessons =
    roleProgress.reduce(
      (sum, role) =>
        sum +
        role.completedLessons,
      0
    )

  const totalAssessmentReady =
    roleProgress.reduce(
      (sum, role) =>
        sum +
        role.assessmentReady,
      0
    )

  /*
   * Official roadmap progress is based on
   * quiz-passed topics, not lesson completion.
   */
  const overallProgress =
    totalTopics > 0
      ? Math.round(
          (totalCompletedTopics /
            totalTopics) *
            100
        )
      : 0

  const lessonProgress =
    totalLessons > 0
      ? Math.round(
          (totalCompletedLessons /
            totalLessons) *
            100
        )
      : 0

  const activeRoles =
    roleProgress.filter(
      (role) =>
        role.completedLessons > 0 ||
        role.completedTopics > 0
    ).length

  const sortedRoles = [
    ...roleProgress,
  ].sort((a, b) => {
    if (
      b.percentage !==
      a.percentage
    ) {
      return (
        b.percentage -
        a.percentage
      )
    }

    return (
      b.completedLessons -
      a.completedLessons
    )
  })

  // ==================================================
  // ASSESSMENTS READY
  // ==================================================

  const readyAssessments =
    Object.entries(
      roadmapData
    ).flatMap(
      ([roleId, role]) =>
        role.topics
          .filter((topic) => {
            const topicKey =
              `${roleId}/${topic.id}`

            const completedCount = Math.min(
              completedLessonCounts[topicKey]?.size ?? 0,
              topic.lessons
            )

            return (
              topic.lessons > 0 &&
              completedCount >=
                topic.lessons &&
              !completedTopicSet.has(
                topicKey
              )
            )
          })
          .map((topic) => ({
            roleId,
            roleTitle:
              role.title,
            topicId:
              topic.id,
            topicTitle:
              topic.title,
          }))
    )

  if (loading || errorMessage) {
    return (
      <DashboardLayout>
        <div className={`p-8 text-center ${errorMessage ? 'text-red-600' : 'text-slate-600'}`}>
          {errorMessage || 'Loading your latest learning progress...'}
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-5 sm:p-6">

        <div className="mx-auto max-w-7xl">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
                <TrendingUp
                  size={17}
                />

                Learning Analytics
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Learning Progress
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Track lesson completion,
                assessment readiness and
                progress across your career
                roadmaps.
              </p>
            </div>

            <button
              onClick={() =>
                navigate(
                  '/employee/roles'
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Explore Roadmaps

              <ArrowRight
                size={16}
              />
            </button>

          </div>

          {/* ==================================================
              OVERALL PROGRESS
          ================================================== */}

          <div className="mt-8 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">

            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>

                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-purple-300">
                  <Target
                    size={16}
                  />

                  Overall Roadmap Progress
                </div>

                <div className="mt-4 flex flex-wrap items-end gap-3">

                  <span className="text-5xl font-bold tracking-tight">
                    {overallProgress}%
                  </span>

                  <span className="pb-1 text-sm text-slate-400">
                    based on passed topic
                    assessments
                  </span>

                </div>

                <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-purple-500 transition-all"
                    style={{
                      width:
                        `${overallProgress}%`,
                    }}
                  />

                </div>

                <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-400">

                  <span>
                    {
                      totalCompletedTopics
                    }{' '}
                    of {totalTopics} topics
                    completed
                  </span>

                  <span>
                    {
                      totalCompletedLessons
                    }{' '}
                    of {totalLessons} lessons
                    completed
                  </span>

                </div>

              </div>

              <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border border-purple-400/20 bg-purple-500/10">

                <div className="text-center">

                  <CircleCheckBig
                    size={30}
                    className="mx-auto text-purple-300"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    Verified
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              KPI CARDS
          ================================================== */}

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon={
                <BookOpen
                  size={21}
                />
              }
              value={`${totalCompletedLessons}/${totalLessons}`}
              label="Lessons Completed"
              description={`${lessonProgress}% of available lessons`}
            />

            <StatCard
              icon={
                <CircleCheckBig
                  size={21}
                />
              }
              value={`${totalCompletedTopics}/${totalTopics}`}
              label="Topics Completed"
              description="Assessment-passed topics"
            />

            <StatCard
              icon={
                <ClipboardCheck
                  size={21}
                />
              }
              value={String(
                totalAssessmentReady
              )}
              label="Assessments Ready"
              description="Lessons finished, quiz pending"
            />

            <StatCard
              icon={
                <Target
                  size={21}
                />
              }
              value={String(
                activeRoles
              )}
              label="Active Roadmaps"
              description="Roadmaps with learning activity"
            />

          </div>

          {/* ==================================================
              ROLE PROGRESS
          ================================================== */}

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Career Roadmap Progress
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Progress increases when
                  you pass a topic
                  assessment.
                </p>
              </div>

              <div className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-semibold text-purple-700">
                {roleProgress.length}{' '}
                career paths
              </div>

            </div>

            <div className="divide-y divide-slate-100">

              {sortedRoles.map(
                (role) => (
                  <RoleProgressRow
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

          </div>

          {/* ==================================================
              LOWER GRID
          ================================================== */}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* ASSESSMENT READINESS */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    Assessment Readiness
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Complete every lesson
                    in a topic to unlock
                    its assessment.
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <ClipboardCheck
                    size={21}
                  />
                </div>

              </div>

              {readyAssessments.length >
              0 ? (
                <div className="mt-6 space-y-3">

                  {readyAssessments
                    .slice(0, 5)
                    .map(
                      (
                        assessment
                      ) => (
                        <div
                          key={`${assessment.roleId}/${assessment.topicId}`}
                          className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >

                          <div>

                            <p className="font-semibold text-slate-900">
                              {
                                assessment.topicTitle
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                assessment.roleTitle
                              }
                            </p>

                          </div>

                          <button
                            onClick={() =>
                              navigate(
                                `/employee/roles/${assessment.roleId}/topics/${assessment.topicId}/quiz`
                              )
                            }
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-purple-700"
                          >
                            Take Assessment

                            <ArrowRight
                              size={14}
                            />
                          </button>

                        </div>
                      )
                    )}

                  {readyAssessments.length >
                    5 && (
                    <p className="pt-2 text-center text-xs text-slate-500">
                      +
                      {readyAssessments.length -
                        5}{' '}
                      more assessments
                      ready
                    </p>
                  )}

                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-7 text-center">

                  <LockKeyhole
                    size={25}
                    className="mx-auto text-slate-400"
                  />

                  <p className="mt-3 font-semibold text-slate-700">
                    No assessments ready
                  </p>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Finish all lessons in
                    a topic and its
                    assessment will appear
                    here.
                  </p>

                </div>
              )}

            </div>

            {/* COMPLETION MODEL */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h2 className="text-lg font-bold text-slate-950">
                    How Progress Works
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    SkillForge separates
                    lesson activity from
                    verified topic
                    completion.
                  </p>
                </div>

                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                  <CheckCircle2
                    size={21}
                  />
                </div>

              </div>

              <div className="mt-6 space-y-3">

                <WorkflowStep
                  number="01"
                  title="Complete Lessons"
                  description="Work through every lesson inside a roadmap topic."
                />

                <WorkflowStep
                  number="02"
                  title="Unlock Assessment"
                  description="The topic assessment becomes available after all lessons are complete."
                />

                <WorkflowStep
                  number="03"
                  title="Pass Assessment"
                  description="Passing the assessment verifies that the topic has been completed."
                />

                <WorkflowStep
                  number="04"
                  title="Advance Roadmap"
                  description="Verified topics increase your career roadmap progress."
                />

              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  )
}

// ==================================================
// STAT CARD
// ==================================================

interface StatCardProps {
  icon: ReactNode
  value: string
  label: string
  description: string
}

function StatCard({
  icon,
  value,
  label,
  description,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {label}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
          {icon}
        </div>

      </div>

    </div>
  )
}

// ==================================================
// ROLE PROGRESS
// ==================================================

interface RoleProgressRowProps {
  role: RoleProgress
  onOpen: () => void
}

function RoleProgressRow({
  role,
  onOpen,
}: RoleProgressRowProps) {
  return (
    <div className="p-5 sm:p-6">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="min-w-0 flex-1">

          <div className="flex flex-wrap items-center gap-2">

            <h3 className="font-semibold text-slate-900">
              {role.roleTitle}
            </h3>

            {role.assessmentReady >
              0 && (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                {role.assessmentReady}{' '}
                assessment
                {role.assessmentReady ===
                1
                  ? ''
                  : 's'}{' '}
                ready
              </span>
            )}

          </div>

          <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">

            <span>
              {role.completedTopics}/
              {role.totalTopics} topics
            </span>

            <span>
              {role.completedLessons}/
              {role.totalLessons} lessons
            </span>

          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-purple-600 transition-all"
              style={{
                width:
                  `${role.percentage}%`,
              }}
            />

          </div>

        </div>

        <div className="flex items-center gap-4 sm:pl-5">

          <div className="min-w-14 text-right">

            <p className="text-lg font-bold text-slate-900">
              {role.percentage}%
            </p>

            <p className="text-[10px] uppercase tracking-wide text-slate-400">
              complete
            </p>

          </div>

          <button
            onClick={onOpen}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600"
            aria-label={`Open ${role.roleTitle}`}
          >
            <ArrowRight
              size={17}
            />
          </button>

        </div>

      </div>

    </div>
  )
}

// ==================================================
// WORKFLOW STEP
// ==================================================

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
    <div className="flex gap-4 rounded-2xl bg-slate-50 p-4">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
        {number}
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

    </div>
  )
}

export default Progress