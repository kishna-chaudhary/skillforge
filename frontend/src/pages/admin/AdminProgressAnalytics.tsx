import type { ReactNode } from 'react'

import {
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Layers3,
  Search,
  TrendingUp,
  Users,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import AdminLayout from '../../layouts/AdminLayout'
import { roadmapData } from '../../data/roadmapData'
import { topicQuizData } from '../../data/topicQuizData'

function AdminProgressAnalytics() {
  const [search, setSearch] =
    useState('')

  const roleRows =
    useMemo(() => {
      return Object.entries(
        roadmapData
      ).map(
        ([roleId, role]) => {
          const totalTopics =
            role.topics.length

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
            totalTopics > 0
              ? Math.round(
                  (
                    configuredAssessments /
                    totalTopics
                  ) * 100
                )
              : 0

          return {
            roleId,
            roleTitle:
              role.title,
            description:
              role.description,
            totalTopics,
            totalLessons,
            configuredAssessments,
            assessmentCoverage,
          }
        }
      )
    }, [])

  const filteredRoles =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase()

      if (!term) {
        return roleRows
      }

      return roleRows.filter(
        (role) =>
          role.roleTitle
            .toLowerCase()
            .includes(term) ||
          role.description
            .toLowerCase()
            .includes(term)
      )
    }, [
      roleRows,
      search,
    ])

  const totalRoles =
    roleRows.length

  const totalTopics =
    roleRows.reduce(
      (total, role) =>
        total +
        role.totalTopics,
      0
    )

  const totalLessons =
    roleRows.reduce(
      (total, role) =>
        total +
        role.totalLessons,
      0
    )

  const totalAssessments =
    roleRows.reduce(
      (total, role) =>
        total +
        role.configuredAssessments,
      0
    )

  const totalPossibleAssessments =
    totalTopics

  const overallAssessmentCoverage =
    totalPossibleAssessments > 0
      ? Math.round(
          (
            totalAssessments /
            totalPossibleAssessments
          ) * 100
        )
      : 0

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

        <div className="mx-auto max-w-7xl">

          {/* Header */}

          <div>

            <p className="text-sm font-semibold text-purple-600">
              Reporting & Analytics
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              Progress & Analytics
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Review SkillForge learning architecture today and
              prepare for employee progress, assessment and
              completion analytics after backend integration.
            </p>

          </div>

          {/* Hero */}

          <div className="mt-7 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white lg:p-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">

                  <BarChart3
                    size={23}
                  />

                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  Learning Analytics Workspace
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Current metrics are derived from the configured
                  SkillForge learning architecture. Employee-level
                  analytics will be added when progress and assessment
                  attempts move from browser storage to the backend.
                </p>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <HeroMetric
                  value={
                    totalRoles
                  }
                  label="Career Roles"
                />

                <HeroMetric
                  value={
                    totalTopics
                  }
                  label="Topics"
                />

                <HeroMetric
                  value={
                    totalLessons
                  }
                  label="Lessons"
                />

                <HeroMetric
                  value={`${overallAssessmentCoverage}%`}
                  label="Assessment Coverage"
                />

              </div>

            </div>

          </div>

          {/* Current measurable data */}

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">

            <MetricCard
              icon={
                <BriefcaseBusiness
                  size={20}
                />
              }
              value={
                totalRoles
              }
              title="Career Roles"
              description="Configured employee learning paths."
            />

            <MetricCard
              icon={
                <Layers3
                  size={20}
                />
              }
              value={
                totalTopics
              }
              title="Roadmap Topics"
              description="Learning areas across all career roles."
            />

            <MetricCard
              icon={
                <BookOpenCheck
                  size={20}
                />
              }
              value={
                totalLessons
              }
              title="Lessons"
              description="Configured lesson units across all topics."
            />

            <MetricCard
              icon={
                <ClipboardCheck
                  size={20}
                />
              }
              value={
                totalAssessments
              }
              title="Assessments"
              description="Topics with configured assessment data."
            />

          </div>

          {/* Search */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search career role analytics..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

          </div>

          {/* Role analytics */}

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <h2 className="text-lg font-bold text-slate-900">
                Career Role Coverage
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Structural learning metrics derived from roadmap
                and assessment configuration.
              </p>

            </div>

            {filteredRoles.length >
            0 ? (
              <div className="divide-y divide-slate-100">

                {filteredRoles.map(
                  (role) => (
                    <RoleAnalyticsRow
                      key={
                        role.roleId
                      }
                      roleTitle={
                        role.roleTitle
                      }
                      description={
                        role.description
                      }
                      topics={
                        role.totalTopics
                      }
                      lessons={
                        role.totalLessons
                      }
                      assessments={
                        role.configuredAssessments
                      }
                      coverage={
                        role.assessmentCoverage
                      }
                    />
                  )
                )}

              </div>
            ) : (
              <div className="p-10 text-center">

                <Search
                  size={34}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-4 font-semibold text-slate-700">
                  No career roles found
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Try another search term.
                </p>

              </div>
            )}

          </div>

          {/* Future employee analytics */}

          <div className="mt-7">

            <div className="mb-4">

              <h2 className="text-lg font-bold text-slate-900">
                Backend Analytics Roadmap
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                These metrics will become available once employee
                progress is stored centrally.
              </p>

            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              <FutureAnalyticsCard
                icon={
                  <Users size={20} />
                }
                title="Employee Participation"
                description="Assigned employees, active learners and employees without learning paths."
              />

              <FutureAnalyticsCard
                icon={
                  <TrendingUp
                    size={20}
                  />
                }
                title="Role Progress"
                description="Employee progress through completed topic assessments within each career role."
              />

              <FutureAnalyticsCard
                icon={
                  <CheckCircle2
                    size={20}
                  />
                }
                title="Topic Completion"
                description="Topic completion based only on passed assessments, not lesson completion alone."
              />

              <FutureAnalyticsCard
                icon={
                  <ClipboardCheck
                    size={20}
                  />
                }
                title="Assessment Performance"
                description="Attempts, scores, pass rates, retries and topic-level assessment performance."
              />

              <FutureAnalyticsCard
                icon={
                  <BookOpenCheck
                    size={20}
                  />
                }
                title="Lesson Progress"
                description="Completed lessons, active topics and lesson-level learning progress."
              />

              <FutureAnalyticsCard
                icon={
                  <Database
                    size={20}
                  />
                }
                title="Historical Reporting"
                description="Persistent progress history and reporting from PostgreSQL instead of localStorage."
              />

            </div>

          </div>

          {/* Measurement model */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="font-bold text-slate-900">
              SkillForge Completion Model
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Analytics must follow the same completion rules as
              employee learning.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-4">

              <WorkflowCard
                number="01"
                title="Lessons Completed"
                description="Track completion of every lesson in the topic."
              />

              <WorkflowCard
                number="02"
                title="Assessment Unlocked"
                description="Unlock the topic assessment only after all required lessons."
              />

              <WorkflowCard
                number="03"
                title="Assessment Passed"
                description="Passing the topic assessment marks the topic complete."
              />

              <WorkflowCard
                number="04"
                title="Role Progress"
                description="Role progress counts quiz-passed topics toward completion."
              />

            </div>

          </div>

          {/* Backend notice */}

          <div className="mt-7 rounded-2xl border border-purple-100 bg-purple-50 p-5">

            <p className="text-sm font-semibold text-purple-800">
              Employee analytics are intentionally not fabricated
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              Metrics such as active learners, completion percentage,
              assessment averages, pass rates, learning time and
              certificate completion require persistent employee
              records. Those values will be calculated from backend
              progress and assessment tables once PostgreSQL
              integration begins.
            </p>

          </div>

        </div>

      </div>
    </AdminLayout>
  )
}

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

      <p className="text-xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {label}
      </p>

    </div>
  )
}

interface MetricCardProps {
  icon: ReactNode
  value: number | string
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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  )
}

interface RoleAnalyticsRowProps {
  roleTitle: string
  description: string
  topics: number
  lessons: number
  assessments: number
  coverage: number
}

function RoleAnalyticsRow({
  roleTitle,
  description,
  topics,
  lessons,
  assessments,
  coverage,
}: RoleAnalyticsRowProps) {
  return (
    <div className="p-5">

      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">

        <div className="min-w-0 flex-1">

          <h3 className="font-bold text-slate-900">
            {roleTitle}
          </h3>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            {description}
          </p>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">

            <span>
              {topics} topics
            </span>

            <span>•</span>

            <span>
              {lessons} lessons
            </span>

            <span>•</span>

            <span>
              {assessments} assessments
            </span>

          </div>

        </div>

        <div className="w-full xl:w-64">

          <div className="flex items-center justify-between">

            <p className="text-xs font-medium text-slate-500">
              Assessment Coverage
            </p>

            <p className="text-xs font-bold text-slate-700">
              {coverage}%
            </p>

          </div>

          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">

            <div
              className="h-full rounded-full bg-purple-600"
              style={{
                width: `${coverage}%`,
              }}
            />

          </div>

        </div>

      </div>

    </div>
  )
}

interface FutureAnalyticsCardProps {
  icon: ReactNode
  title: string
  description: string
}

function FutureAnalyticsCard({
  icon,
  title,
  description,
}: FutureAnalyticsCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        {icon}
      </div>

      <p className="mt-4 text-sm font-bold text-slate-900">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

      <span className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
        Backend Required
      </span>

    </div>
  )
}

interface WorkflowCardProps {
  number: string
  title: string
  description: string
}

function WorkflowCard({
  number,
  title,
  description,
}: WorkflowCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-xs font-bold text-purple-600">
        {number}
      </p>

      <p className="mt-3 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  )
}

export default AdminProgressAnalytics