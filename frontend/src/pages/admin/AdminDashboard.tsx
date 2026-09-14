import type { ReactNode } from 'react'

import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Layers3,
  ServerCog,
  ShieldCheck,
  Users,
  Video,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'
import { roadmapData } from '../../data/roadmapData'
import { topicQuizData } from '../../data/topicQuizData'

function AdminDashboard() {
  const navigate = useNavigate()

  /*
  |--------------------------------------------------------------------------
  | LEARNING CONTENT STATISTICS
  |--------------------------------------------------------------------------
  */

  const roles =
    Object.entries(roadmapData)

  const totalRoles =
    roles.length

  const totalTopics =
    roles.reduce(
      (total, [, role]) =>
        total + role.topics.length,
      0
    )

  const totalLessons =
    roles.reduce(
      (roleTotal, [, role]) =>
        roleTotal +
        role.topics.reduce(
          (topicTotal, topic) =>
            topicTotal +
            topic.lessons,
          0
        ),
      0
    )

  const totalAssessments =
    Object.keys(
      topicQuizData
    ).length

  const assessmentCoverage =
    totalTopics > 0
      ? Math.round(
          (
            totalAssessments /
            totalTopics
          ) *
            100
        )
      : 0

  /*
  |--------------------------------------------------------------------------
  | ROLE COVERAGE
  |--------------------------------------------------------------------------
  */

  const roleCoverage =
    roles.map(
      ([roleId, role]) => {
        const lessonCount =
          role.topics.reduce(
            (total, topic) =>
              total +
              topic.lessons,
            0
          )

        const assessmentCount =
          role.topics.filter(
            (topic) =>
              Boolean(
                topicQuizData[
                  `${roleId}/${topic.id}`
                ]
              )
          ).length

        const coverage =
          role.topics.length > 0
            ? Math.round(
                (
                  assessmentCount /
                  role.topics.length
                ) *
                  100
              )
            : 0

        return {
          roleId,
          title: role.title,
          topics:
            role.topics.length,
          lessons:
            lessonCount,
          assessments:
            assessmentCount,
          coverage,
        }
      }
    )

  return (
    <AdminLayout>

      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div>

            <p className="text-sm font-semibold text-purple-600">
              SkillForge Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              Learning Management Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage career roadmaps,
              learning content,
              assessments and employee
              learning operations from
              one workspace.
            </p>

          </div>

          {/* HERO */}

          <div className="mt-8 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-sm lg:p-8">

            <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-center">

              <div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">

                  <ShieldCheck
                    size={24}
                  />

                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  SkillForge Learning
                  Architecture
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                  Career roles define
                  structured roadmaps.
                  Each roadmap contains
                  topics, lessons and
                  assessments that
                  employees complete to
                  earn verified career
                  credentials.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">

                  <button
                    onClick={() =>
                      navigate(
                        '/admin/roles'
                      )
                    }
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-500"
                  >
                    Manage Career Roles

                    <ArrowRight
                      size={17}
                    />
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        '/admin/assessments'
                      )
                    }
                    className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                  >
                    Manage Assessments
                  </button>

                </div>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <HeroMetric
                  value={totalRoles}
                  label="Career Roles"
                />

                <HeroMetric
                  value={totalTopics}
                  label="Topics"
                />

                <HeroMetric
                  value={totalLessons}
                  label="Lessons"
                />

                <HeroMetric
                  value={
                    totalAssessments
                  }
                  label="Assessments"
                />

              </div>

            </div>

          </div>

          {/* KPI CARDS */}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <StatCard
              icon={
                <BriefcaseBusiness
                  size={21}
                />
              }
              value={totalRoles}
              label="Career Roles"
              description="Structured employee learning paths"
            />

            <StatCard
              icon={
                <Layers3
                  size={21}
                />
              }
              value={totalTopics}
              label="Roadmap Topics"
              description="Topics across all career roles"
            />

            <StatCard
              icon={
                <BookOpenCheck
                  size={21}
                />
              }
              value={totalLessons}
              label="Learning Lessons"
              description="Lessons available across roadmaps"
            />

            <StatCard
              icon={
                <ClipboardCheck
                  size={21}
                />
              }
              value={
                totalAssessments
              }
              label="Assessments"
              description={`${assessmentCoverage}% topic assessment coverage`}
            />

          </div>

          {/* MANAGEMENT */}

          <div className="mt-8">

            <div>

              <h2 className="text-xl font-bold text-slate-950">
                Management
                Workspace
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Access the major
                administration areas of
                SkillForge.
              </p>

            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              <ManagementCard
                icon={
                  <BriefcaseBusiness
                    size={22}
                  />
                }
                title="Career Roles"
                description="Create and manage career learning paths and their roadmap structure."
                action="Manage Roles"
                onClick={() =>
                  navigate(
                    '/admin/roles'
                  )
                }
              />

              <ManagementCard
                icon={
                  <BookOpenCheck
                    size={22}
                  />
                }
                title="Learning Content"
                description="Manage roadmap topics, lessons and learning resources."
                action="Manage Content"
                onClick={() =>
                  navigate(
                    '/admin/content'
                  )
                }
              />

              <ManagementCard
                icon={
                  <ClipboardCheck
                    size={22}
                  />
                }
                title="Assessments"
                description="Build question banks and configure topic assessments."
                action="Manage Assessments"
                onClick={() =>
                  navigate(
                    '/admin/assessments'
                  )
                }
              />

              <ManagementCard
                icon={
                  <Video
                    size={22}
                  />
                }
                title="Live Sessions"
                description="Schedule topic-specific live doubt-solving sessions."
                action="Manage Sessions"
                onClick={() =>
                  navigate(
                    '/admin/live-sessions'
                  )
                }
              />

              <ManagementCard
                icon={
                  <Users
                    size={22}
                  />
                }
                title="Employees"
                description="Employee accounts and role assignments will be managed here."
                action="Manage Employees"
                onClick={() =>
                  navigate(
                    '/admin/employees'
                  )
                }
              />

              <ManagementCard
                icon={
                  <CheckCircle2
                    size={22}
                  />
                }
                title="Progress & Analytics"
                description="Review employee roadmap completion and assessment performance."
                action="View Analytics"
                onClick={() =>
                  navigate(
                    '/admin/progress'
                  )
                }
              />

            </div>

          </div>

          {/* ROLE COVERAGE */}

          <div className="mt-8 rounded-3xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-950">
                  Career Roadmap
                  Coverage
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current learning
                  structure configured
                  for each employee
                  career path.
                </p>

              </div>

              <button
                onClick={() =>
                  navigate(
                    '/admin/roles'
                  )
                }
                className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
              >
                View Roles

                <ArrowRight
                  size={16}
                />
              </button>

            </div>

            <div className="divide-y divide-slate-100">

              {roleCoverage.map(
                (role) => (
                  <div
                    key={
                      role.roleId
                    }
                    className="grid gap-5 p-5 sm:grid-cols-[1fr_auto] sm:items-center"
                  >

                    <div>

                      <div className="flex flex-wrap items-center gap-3">

                        <p className="font-semibold text-slate-900">
                          {
                            role.title
                          }
                        </p>

                        {role.coverage ===
                        100 ? (
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                            Assessment
                            Ready
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                            Needs
                            Attention
                          </span>
                        )}

                      </div>

                      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-slate-500">

                        <span>
                          {
                            role.topics
                          }{' '}
                          topics
                        </span>

                        <span>
                          {
                            role.lessons
                          }{' '}
                          lessons
                        </span>

                        <span>
                          {
                            role.assessments
                          }{' '}
                          assessments
                        </span>

                      </div>

                    </div>

                    <div className="min-w-40">

                      <div className="flex items-center justify-between text-xs">

                        <span className="text-slate-500">
                          Assessment
                          coverage
                        </span>

                        <span className="font-semibold text-slate-800">
                          {
                            role.coverage
                          }
                          %
                        </span>

                      </div>

                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                          className="h-full rounded-full bg-purple-600"
                          style={{
                            width: `${role.coverage}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

          {/* ARCHITECTURE / BACKEND */}

          <div className="mt-8 grid gap-6 lg:grid-cols-2">

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">

                <Layers3
                  size={21}
                />

              </div>

              <h2 className="mt-5 text-lg font-bold text-slate-950">
                Learning Content
                Workflow
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                SkillForge follows one
                consistent learning
                hierarchy across every
                career path.
              </p>

              <div className="mt-5 space-y-3">

                <WorkflowStep
                  number="01"
                  title="Career Role"
                />

                <WorkflowStep
                  number="02"
                  title="Roadmap Topics"
                />

                <WorkflowStep
                  number="03"
                  title="Lessons & Resources"
                />

                <WorkflowStep
                  number="04"
                  title="Topic Assessment"
                />

                <WorkflowStep
                  number="05"
                  title="Verified Completion"
                />

              </div>

            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-950 p-6 text-white shadow-sm">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/15 text-purple-300">

                <ServerCog
                  size={21}
                />

              </div>

              <h2 className="mt-5 text-lg font-bold">
                Backend Integration
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-300">
                The current Admin
                dashboard reflects
                frontend learning
                configuration. Employee
                accounts, progress,
                assessment attempts,
                proctoring records and
                persistent management
                will be connected to
                the backend.
              </p>

              <div className="mt-5 space-y-3">

                <BackendItem
                  icon={
                    <Database
                      size={17}
                    />
                  }
                  label="PostgreSQL persistence"
                />

                <BackendItem
                  icon={
                    <Users
                      size={17}
                    />
                  }
                  label="Authenticated employee management"
                />

                <BackendItem
                  icon={
                    <ClipboardCheck
                      size={17}
                    />
                  }
                  label="Server-side assessment scoring"
                />

                <BackendItem
                  icon={
                    <ShieldCheck
                      size={17}
                    />
                  }
                  label="Assessment integrity records"
                />

              </div>

            </div>

          </div>

        </div>

      </div>

    </AdminLayout>
  )
}

/* ==================================================
   HERO METRIC
================================================== */

interface HeroMetricProps {
  value: number
  label: string
}

function HeroMetric({
  value,
  label,
}: HeroMetricProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-4">

      <p className="text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {label}
      </p>

    </div>
  )
}

/* ==================================================
   STAT CARD
================================================== */

interface StatCardProps {
  icon: ReactNode
  value: number
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

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>

      <p className="mt-5 text-2xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {label}
      </p>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  )
}

/* ==================================================
   MANAGEMENT CARD
================================================== */

interface ManagementCardProps {
  icon: ReactNode
  title: string
  description: string
  action: string
  onClick: () => void
}

function ManagementCard({
  icon,
  title,
  description,
  action,
  onClick,
}: ManagementCardProps) {
  return (
    <button
      onClick={onClick}
      className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-purple-200 hover:shadow-md"
    >

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>

      <h3 className="mt-5 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-purple-600">

        {action}

        <ArrowRight
          size={16}
          className="transition group-hover:translate-x-1"
        />

      </div>

    </button>
  )
}

/* ==================================================
   WORKFLOW STEP
================================================== */

interface WorkflowStepProps {
  number: string
  title: string
}

function WorkflowStep({
  number,
  title,
}: WorkflowStepProps) {
  return (
    <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-3">

      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-700">
        {number}
      </div>

      <p className="text-sm font-semibold text-slate-700">
        {title}
      </p>

    </div>
  )
}

/* ==================================================
   BACKEND ITEM
================================================== */

interface BackendItemProps {
  icon: ReactNode
  label: string
}

function BackendItem({
  icon,
  label,
}: BackendItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-900 p-3">

      <div className="text-purple-300">
        {icon}
      </div>

      <span className="text-sm text-slate-300">
        {label}
      </span>

    </div>
  )
}

export default AdminDashboard