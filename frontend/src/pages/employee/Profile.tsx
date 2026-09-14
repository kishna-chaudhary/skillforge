import {
  Award,
  BookOpen,
  BriefcaseBusiness,
  CheckCircle2,
  CircleUserRound,
  ClipboardCheck,
  Mail,
  ShieldCheck,
  Target,
  TrendingUp,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'
import { roadmapData } from '../../data/roadmapData'

const lessonStorageKey =
  'skillforge_completed_lessons'

const topicStorageKey =
  'skillforge_completed_topics'

interface CompletedLessons {
  [key: string]: number[]
}

function Profile() {
  const navigate = useNavigate()

  // ==================================================
  // READ LESSON PROGRESS
  // ==================================================

  let completedLessons: CompletedLessons = {}

  try {
    const storedLessons =
      localStorage.getItem(
        lessonStorageKey
      )

    if (storedLessons) {
      const parsed =
        JSON.parse(storedLessons)

      if (
        parsed &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed)
      ) {
        completedLessons =
          parsed as CompletedLessons
      }
    }
  } catch {
    completedLessons = {}
  }

  // ==================================================
  // READ VERIFIED TOPICS
  // ==================================================

  let completedTopics: string[] = []

  try {
    const storedTopics =
      localStorage.getItem(
        topicStorageKey
      )

    if (storedTopics) {
      const parsed =
        JSON.parse(storedTopics)

      if (Array.isArray(parsed)) {
        completedTopics =
          parsed.filter(
            (
              item
            ): item is string =>
              typeof item === 'string'
          )
      }
    }
  } catch {
    completedTopics = []
  }

  const completedTopicSet =
    new Set(completedTopics)

  // ==================================================
  // LEARNING STATISTICS
  // ==================================================

  let totalLessons = 0
  let completedLessonCount = 0
  let totalTopics = 0
  let completedTopicCount = 0
  let assessmentsReady = 0
  let activeRoadmaps = 0
  let earnedCertificates = 0

  Object.entries(
    roadmapData
  ).forEach(
    ([roleId, role]) => {
      let roleHasActivity = false
      let roleCompletedTopics = 0

      totalTopics +=
        role.topics.length

      role.topics.forEach(
        (topic) => {
          const topicKey =
            `${roleId}/${topic.id}`

          totalLessons +=
            topic.lessons

          const stored =
            completedLessons[
              topicKey
            ] || []

          const uniqueCompleted =
            new Set(
              stored.filter(
                (lessonIndex) =>
                  Number.isInteger(
                    lessonIndex
                  ) &&
                  lessonIndex >= 0 &&
                  lessonIndex <
                    topic.lessons
              )
            )

          completedLessonCount +=
            uniqueCompleted.size

          const isTopicCompleted =
            completedTopicSet.has(
              topicKey
            )

          if (isTopicCompleted) {
            completedTopicCount += 1
            roleCompletedTopics += 1
            roleHasActivity = true
          }

          if (
            uniqueCompleted.size > 0
          ) {
            roleHasActivity = true
          }

          if (
            uniqueCompleted.size >=
              topic.lessons &&
            !isTopicCompleted
          ) {
            assessmentsReady += 1
          }
        }
      )

      if (roleHasActivity) {
        activeRoadmaps += 1
      }

      if (
        role.topics.length > 0 &&
        roleCompletedTopics ===
          role.topics.length
      ) {
        earnedCertificates += 1
      }
    }
  )

  const overallProgress =
    totalTopics > 0
      ? Math.round(
          (completedTopicCount /
            totalTopics) *
            100
        )
      : 0

  const lessonProgress =
    totalLessons > 0
      ? Math.round(
          (completedLessonCount /
            totalLessons) *
            100
        )
      : 0

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-5 sm:p-6">

        <div className="mx-auto max-w-7xl">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div>

            <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">

              <CircleUserRound
                size={17}
              />

              Employee Profile

            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              My Profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              View your SkillForge account
              and verified learning
              progress.
            </p>

          </div>

          {/* ==================================================
              PROFILE HERO
          ================================================== */}

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="h-32 bg-gradient-to-r from-slate-950 via-slate-900 to-purple-950" />

            <div className="px-6 pb-7 sm:px-8">

              <div className="-mt-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

                <div className="flex items-end gap-5">

                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl border-4 border-white bg-purple-600 text-3xl font-bold text-white shadow-lg">
                    R
                  </div>

                  <div className="pb-1">

                    <h2 className="text-2xl font-bold text-slate-950">
                      Rahul
                    </h2>

                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">

                      <BriefcaseBusiness
                        size={15}
                      />

                      Employee Learner

                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-700">

                  <span className="h-2 w-2 rounded-full bg-green-500" />

                  Active Account

                </div>

              </div>

            </div>

          </div>

          {/* ==================================================
              MAIN GRID
          ================================================== */}

          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">

            {/* LEFT */}

            <div className="space-y-6">

              {/* ACCOUNT INFORMATION */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h2 className="text-lg font-bold text-slate-950">
                      Account Information
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Basic information
                      associated with your
                      SkillForge account.
                    </p>

                  </div>

                  <div className="rounded-xl bg-purple-50 p-3 text-purple-600">

                    <CircleUserRound
                      size={20}
                    />

                  </div>

                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <InfoCard
                    icon={
                      <CircleUserRound
                        size={18}
                      />
                    }
                    label="Display Name"
                    value="Rahul"
                  />

                  <InfoCard
                    icon={
                      <BriefcaseBusiness
                        size={18}
                      />
                    }
                    label="Account Role"
                    value="Employee"
                  />

                  <InfoCard
                    icon={
                      <Mail
                        size={18}
                      />
                    }
                    label="Email"
                    value="Available after backend integration"
                    muted
                  />

                  <InfoCard
                    icon={
                      <ShieldCheck
                        size={18}
                      />
                    }
                    label="Account Status"
                    value="Active"
                  />

                </div>

                <div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50 p-4">

                  <p className="text-sm font-semibold text-blue-900">
                    Profile management
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    Personal details,
                    employee information
                    and profile editing will
                    be connected to the
                    authenticated user
                    account when the
                    SkillForge backend is
                    implemented.
                  </p>

                </div>

              </div>

              {/* LEARNING OVERVIEW */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div>

                  <h2 className="text-lg font-bold text-slate-950">
                    Learning Overview
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Real progress calculated
                    from your roadmap
                    activity.
                  </p>

                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">

                  <MetricCard
                    icon={
                      <BookOpen
                        size={20}
                      />
                    }
                    value={`${completedLessonCount}/${totalLessons}`}
                    label="Lessons Completed"
                    description={`${lessonProgress}% of lessons`}
                  />

                  <MetricCard
                    icon={
                      <CheckCircle2
                        size={20}
                      />
                    }
                    value={`${completedTopicCount}/${totalTopics}`}
                    label="Topics Completed"
                    description="Assessment verified"
                  />

                  <MetricCard
                    icon={
                      <ClipboardCheck
                        size={20}
                      />
                    }
                    value={String(
                      assessmentsReady
                    )}
                    label="Assessments Ready"
                    description="Ready to be completed"
                  />

                  <MetricCard
                    icon={
                      <Award
                        size={20}
                      />
                    }
                    value={String(
                      earnedCertificates
                    )}
                    label="Certificates Earned"
                    description="Completed career paths"
                  />

                </div>

              </div>

            </div>

            {/* ==================================================
                RIGHT COLUMN
            ================================================== */}

            <div className="space-y-6">

              {/* OVERALL PROGRESS */}

              <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-purple-300">
                      Verified Progress
                    </p>

                    <p className="mt-3 text-4xl font-bold">
                      {overallProgress}%
                    </p>

                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">

                    <TrendingUp
                      size={23}
                    />

                  </div>

                </div>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Overall progress is based
                  on topic assessments you
                  have successfully passed.
                </p>

                <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{
                      width:
                        `${overallProgress}%`,
                    }}
                  />

                </div>

                <button
                  onClick={() =>
                    navigate(
                      '/employee/progress'
                    )
                  }
                  className="mt-5 w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  View Full Progress
                </button>

              </div>

              {/* CAREER ACTIVITY */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="rounded-xl bg-purple-50 p-3 text-purple-600">

                    <Target
                      size={20}
                    />

                  </div>

                  <div>

                    <h2 className="font-bold text-slate-900">
                      Career Activity
                    </h2>

                    <p className="text-xs text-slate-500">
                      Active learning paths
                    </p>

                  </div>

                </div>

                <div className="mt-5 rounded-2xl bg-slate-50 p-4">

                  <p className="text-3xl font-bold text-slate-950">
                    {activeRoadmaps}
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    Active Roadmaps
                  </p>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Career paths where you
                    have completed at least
                    one lesson or verified
                    topic.
                  </p>

                </div>

                <button
                  onClick={() =>
                    navigate(
                      '/employee/roles'
                    )
                  }
                  className="mt-4 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
                >
                  Explore Career Roadmaps
                </button>

              </div>

              {/* ACCOUNT STATUS */}

              <div className="rounded-3xl border border-green-100 bg-green-50 p-5">

                <div className="flex items-start gap-3">

                  <CheckCircle2
                    size={20}
                    className="mt-0.5 shrink-0 text-green-600"
                  />

                  <div>

                    <p className="text-sm font-semibold text-green-900">
                      Account Active
                    </p>

                    <p className="mt-1 text-xs leading-5 text-green-700">
                      Your employee learning
                      account currently has
                      access to SkillForge
                      learning resources.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  )
}

// ==================================================
// INFO CARD
// ==================================================

interface InfoCardProps {
  icon: React.ReactNode
  label: string
  value: string
  muted?: boolean
}

function InfoCard({
  icon,
  label,
  value,
  muted = false,
}: InfoCardProps) {
  return (
    <div className="flex gap-3 rounded-2xl bg-slate-50 p-4">

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
        {icon}
      </div>

      <div className="min-w-0">

        <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p
          className={`mt-1 text-sm font-medium ${
            muted
              ? 'text-slate-400'
              : 'text-slate-800'
          }`}
        >
          {value}
        </p>

      </div>

    </div>
  )
}

// ==================================================
// METRIC CARD
// ==================================================

interface MetricCardProps {
  icon: React.ReactNode
  value: string
  label: string
  description: string
}

function MetricCard({
  icon,
  value,
  label,
  description,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 p-5">

      <div className="flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          {icon}
        </div>

        <div>

          <p className="text-xl font-bold text-slate-950">
            {value}
          </p>

          <p className="mt-1 text-sm font-semibold text-slate-700">
            {label}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>

        </div>

      </div>

    </div>
  )
}

export default Profile
