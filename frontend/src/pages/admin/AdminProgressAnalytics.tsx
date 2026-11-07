import type { ReactNode } from 'react'

import {
  Award,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Code2,
  Layers3,
  Loader2,
  RefreshCw,
  Search,
  Target,
  TrendingUp,
  UserCheck,
  Users,
} from 'lucide-react'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import AdminLayout from '../../layouts/AdminLayout'

const API_BASE_URL =
  'http://localhost:5000/api'

interface AnalyticsContent {
  totalRoles: number
  totalTopics: number
  totalLessons: number
  totalAssessments: number
}

interface AnalyticsEmployees {
  total: number
  active: number
  inactive: number
  withLessonProgress: number
  withAssessmentAttempts: number
  withPracticalPass: number
  withCertificates: number
}

interface AnalyticsLearning {
  completedLessons: number
  completedTopics: number
  assessmentAttempts: number
  passedAssessmentAttempts: number
  assessmentPassRate: number
  averageAssessmentScore: number
  practicalPasses: number
  certificatesEarned: number
}

interface RoleAnalytics {
  roleId: number
  roleSlug: string
  roleTitle: string
  description: string

  totalTopics: number
  totalLessons: number
  totalAssessments: number
  topicsWithAssessment: number

  assessmentCoverage: number

  employeesWithProgress: number
  completedTopicRecords: number
  practicalPasses: number
  certificatesEarned: number
}

interface AdminAnalyticsResponse {
  success: boolean

  content: AnalyticsContent

  employees: AnalyticsEmployees

  learning: AnalyticsLearning

  roles: RoleAnalytics[]

  message?: string
}

function AdminProgressAnalytics() {
  const [search, setSearch] =
    useState('')

  const [analytics, setAnalytics] =
    useState<AdminAnalyticsResponse | null>(
      null
    )

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const loadAnalytics =
    useCallback(async () => {
      setLoading(true)
      setError('')

      try {
        const token =
          localStorage.getItem(
            'skillforge-token'
          )

        if (!token) {
          throw new Error(
            'Admin authentication token is missing.'
          )
        }

        const response = await fetch(
          `${API_BASE_URL}/admin/analytics`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

        const data =
          (await response.json()) as
            AdminAnalyticsResponse

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              'Unable to load progress analytics.'
          )
        }

        setAnalytics(data)
      } catch (requestError) {
        console.error(
          'Admin progress analytics error:',
          requestError
        )

        setAnalytics(null)

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load progress analytics.'
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    void loadAnalytics()
  }, [loadAnalytics])

  const roles =
    analytics?.roles ?? []

  const filteredRoles =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase()

      if (!term) {
        return roles
      }

      return roles.filter(
        (role) =>
          role.roleTitle
            .toLowerCase()
            .includes(term) ||
          role.description
            .toLowerCase()
            .includes(term) ||
          role.roleSlug
            .toLowerCase()
            .includes(term)
      )
    }, [roles, search])

  const content =
    analytics?.content ?? {
      totalRoles: 0,
      totalTopics: 0,
      totalLessons: 0,
      totalAssessments: 0,
    }

  const employees =
    analytics?.employees ?? {
      total: 0,
      active: 0,
      inactive: 0,
      withLessonProgress: 0,
      withAssessmentAttempts: 0,
      withPracticalPass: 0,
      withCertificates: 0,
    }

  const learning =
    analytics?.learning ?? {
      completedLessons: 0,
      completedTopics: 0,
      assessmentAttempts: 0,
      passedAssessmentAttempts: 0,
      assessmentPassRate: 0,
      averageAssessmentScore: 0,
      practicalPasses: 0,
      certificatesEarned: 0,
    }

  const assessmentCoverage =
    content.totalTopics > 0
      ? Math.round(
          (roles.reduce(
            (sum, role) =>
              sum +
              role.topicsWithAssessment,
            0
          ) /
            content.totalTopics) *
            100
        )
      : 0

  const activeEmployeeRate =
    employees.total > 0
      ? Math.round(
          (employees.active /
            employees.total) *
            100
        )
      : 0

  const assessmentParticipationRate =
    employees.total > 0
      ? Math.round(
          (employees.withAssessmentAttempts /
            employees.total) *
            100
        )
      : 0

  const lessonParticipationRate =
    employees.total > 0
      ? Math.round(
          (employees.withLessonProgress /
            employees.total) *
            100
        )
      : 0

  const practicalParticipationRate =
    employees.total > 0
      ? Math.round(
          (employees.withPracticalPass /
            employees.total) *
            100
        )
      : 0

  const certificateEmployeeRate =
    employees.total > 0
      ? Math.round(
          (employees.withCertificates /
            employees.total) *
            100
        )
      : 0

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-600">
                Reporting & Analytics
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-950">
                Progress & Analytics
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Review persisted
                employee learning,
                assessment,
                practical challenge
                and career completion
                data across
                SkillForge.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void loadAnalytics()
              }
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={16}
                className={
                  loading
                    ? 'animate-spin'
                    : ''
                }
              />

              Refresh Analytics
            </button>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="font-semibold text-red-800">
                Analytics could not
                be loaded
              </p>

              <p className="mt-1 text-sm text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadAnalytics()
                }
                className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
              >
                Try Again
              </button>
            </div>
          )}

          {loading && !analytics ? (
            <div className="mt-8 flex min-h-[420px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
              <div className="text-center">
                <Loader2
                  size={36}
                  className="mx-auto animate-spin text-purple-600"
                />

                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Loading persisted
                  learning analytics...
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* HERO */}

              <div className="mt-7 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white lg:p-8">
                <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">
                  <div className="max-w-2xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">
                      <BarChart3
                        size={23}
                      />
                    </div>

                    <h2 className="mt-5 text-2xl font-bold">
                      Learning Analytics
                      Workspace
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Metrics on this
                      page are calculated
                      from backend
                      learning records,
                      including lesson
                      progress,
                      assessment
                      attempts, practical
                      challenge results
                      and verified role
                      completion.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <HeroMetric
                      value={
                        content.totalRoles
                      }
                      label="Career Roles"
                    />

                    <HeroMetric
                      value={
                        employees.total
                      }
                      label="Employees"
                    />

                    <HeroMetric
                      value={
                        learning.completedTopics
                      }
                      label="Topic Completions"
                    />

                    <HeroMetric
                      value={
                        learning.certificatesEarned
                      }
                      label="Certificates"
                    />
                  </div>
                </div>
              </div>

              {/* PLATFORM CONTENT */}

              <SectionHeader
                title="Platform Learning Architecture"
                description="Active learning content currently available through SkillForge."
              />

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  icon={
                    <BriefcaseBusiness
                      size={20}
                    />
                  }
                  value={
                    content.totalRoles
                  }
                  title="Career Roles"
                  description="Active employee learning paths."
                />

                <MetricCard
                  icon={
                    <Layers3
                      size={20}
                    />
                  }
                  value={
                    content.totalTopics
                  }
                  title="Roadmap Topics"
                  description="Active learning areas across all roles."
                />

                <MetricCard
                  icon={
                    <BookOpenCheck
                      size={20}
                    />
                  }
                  value={
                    content.totalLessons
                  }
                  title="Lessons"
                  description="Active lesson units stored in PostgreSQL."
                />

                <MetricCard
                  icon={
                    <ClipboardCheck
                      size={20}
                    />
                  }
                  value={
                    content.totalAssessments
                  }
                  title="Assessments"
                  description={`${assessmentCoverage}% of active topics have assessment coverage.`}
                />
              </div>

              {/* EMPLOYEE PARTICIPATION */}

              <SectionHeader
                title="Employee Participation"
                description="How employees are engaging with the persisted learning workflow."
              />

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <ParticipationCard
                  icon={
                    <UserCheck
                      size={20}
                    />
                  }
                  value={
                    employees.active
                  }
                  total={
                    employees.total
                  }
                  percentage={
                    activeEmployeeRate
                  }
                  title="Active Accounts"
                  description={`${employees.inactive} inactive employee accounts`}
                />

                <ParticipationCard
                  icon={
                    <BookOpenCheck
                      size={20}
                    />
                  }
                  value={
                    employees.withLessonProgress
                  }
                  total={
                    employees.total
                  }
                  percentage={
                    lessonParticipationRate
                  }
                  title="Lesson Learners"
                  description="Employees with at least one completed lesson"
                />

                <ParticipationCard
                  icon={
                    <ClipboardCheck
                      size={20}
                    />
                  }
                  value={
                    employees.withAssessmentAttempts
                  }
                  total={
                    employees.total
                  }
                  percentage={
                    assessmentParticipationRate
                  }
                  title="Assessment Learners"
                  description="Employees with at least one assessment attempt"
                />

                <ParticipationCard
                  icon={
                    <Award size={20} />
                  }
                  value={
                    employees.withCertificates
                  }
                  total={
                    employees.total
                  }
                  percentage={
                    certificateEmployeeRate
                  }
                  title="Certified Employees"
                  description="Employees with at least one completed career certificate"
                />
              </div>

              {/* LEARNING COMPLETION */}

              <SectionHeader
                title="Learning Completion"
                description="Persisted completion records across lessons, assessments and practical challenges."
              />

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  icon={
                    <BookOpenCheck
                      size={20}
                    />
                  }
                  value={
                    learning.completedLessons
                  }
                  title="Lesson Completions"
                  description="Completed employee-lesson records."
                />

                <MetricCard
                  icon={
                    <CheckCircle2
                      size={20}
                    />
                  }
                  value={
                    learning.completedTopics
                  }
                  title="Topic Completions"
                  description="Unique employee-topic passing assessment records."
                />

                <MetricCard
                  icon={
                    <Code2 size={20} />
                  }
                  value={
                    learning.practicalPasses
                  }
                  title="Practical Passes"
                  description={`${employees.withPracticalPass} employees have passed a practical challenge.`}
                />

                <MetricCard
                  icon={
                    <Award size={20} />
                  }
                  value={
                    learning.certificatesEarned
                  }
                  title="Certificates Earned"
                  description="Verified employee-career role completions."
                />
              </div>

              {/* ASSESSMENT PERFORMANCE */}

              <SectionHeader
                title="Assessment Performance"
                description="Performance across persisted employee assessment attempts."
              />

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                  icon={
                    <ClipboardCheck
                      size={20}
                    />
                  }
                  value={
                    learning.assessmentAttempts
                  }
                  title="Assessment Attempts"
                  description="Total submitted assessment attempts."
                />

                <MetricCard
                  icon={
                    <CheckCircle2
                      size={20}
                    />
                  }
                  value={
                    learning.passedAssessmentAttempts
                  }
                  title="Passed Attempts"
                  description="Assessment attempts recorded as passed."
                />

                <MetricCard
                  icon={
                    <TrendingUp
                      size={20}
                    />
                  }
                  value={`${learning.assessmentPassRate}%`}
                  title="Attempt Pass Rate"
                  description="Passed attempts divided by all assessment attempts."
                />

                <MetricCard
                  icon={
                    <Target size={20} />
                  }
                  value={`${formatNumber(
                    learning.averageAssessmentScore
                  )}%`}
                  title="Average Score"
                  description="Average score across persisted assessment attempts."
                />
              </div>

              {/* PRACTICAL PARTICIPATION */}

              <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <Code2 size={20} />
                    </div>

                    <h2 className="mt-4 text-lg font-bold text-slate-900">
                      Practical Challenge
                      Achievement
                    </h2>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      Practical passes
                      count employee-role
                      combinations with
                      at least one
                      successfully
                      completed passing
                      practical attempt.
                    </p>
                  </div>

                  <div className="grid min-w-full grid-cols-2 gap-3 lg:min-w-[360px]">
                    <SummaryBox
                      value={
                        learning.practicalPasses
                      }
                      label="Role Passes"
                    />

                    <SummaryBox
                      value={
                        employees.withPracticalPass
                      }
                      label="Employees Passed"
                    />

                    <SummaryBox
                      value={`${practicalParticipationRate}%`}
                      label="Employee Rate"
                    />

                    <SummaryBox
                      value={
                        learning.certificatesEarned
                      }
                      label="Certificates"
                    />
                  </div>
                </div>
              </div>

              {/* SEARCH */}

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

              {/* ROLE ANALYTICS */}

              <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 p-5">
                  <h2 className="text-lg font-bold text-slate-900">
                    Career Role
                    Analytics
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Learning
                    architecture,
                    employee activity,
                    topic completion,
                    practical passes and
                    certificates by
                    career role.
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
                          role={role}
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
                      No career roles
                      found
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      Try another search
                      term.
                    </p>
                  </div>
                )}
              </div>

              {/* COMPLETION MODEL */}

              <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="font-bold text-slate-900">
                  SkillForge Completion
                  Model
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Analytics follow the
                  same completion rules
                  used by employee
                  learning and
                  certificates.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  <WorkflowCard
                    number="01"
                    title="Lessons Completed"
                    description="Employees complete the required learning lessons."
                  />

                  <WorkflowCard
                    number="02"
                    title="Assessment Unlocked"
                    description="Topic assessment becomes available after the lesson requirement."
                  />

                  <WorkflowCard
                    number="03"
                    title="Assessment Passed"
                    description="A passing assessment marks that employee-topic pair complete."
                  />

                  <WorkflowCard
                    number="04"
                    title="Practical Passed"
                    description="The employee completes the role's practical challenge."
                  />

                  <WorkflowCard
                    number="05"
                    title="Certificate Earned"
                    description="All active role topics plus the practical challenge are passed."
                  />
                </div>
              </div>

              {/* DATA SOURCE NOTICE */}

              <div className="mt-7 rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <p className="text-sm font-semibold text-purple-800">
                  Backend analytics
                  enabled
                </p>

                <p className="mt-2 text-sm leading-6 text-purple-700">
                  This page no longer
                  derives analytics from
                  frontend roadmap or
                  quiz configuration.
                  Metrics are retrieved
                  through the
                  authenticated admin
                  analytics API and
                  calculated from
                  SkillForge PostgreSQL
                  records.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

interface SectionHeaderProps {
  title: string
  description: string
}

function SectionHeader({
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mt-7">
      <h2 className="text-lg font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>
    </div>
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

interface ParticipationCardProps {
  icon: ReactNode
  value: number
  total: number
  percentage: number
  title: string
  description: string
}

function ParticipationCard({
  icon,
  value,
  total,
  percentage,
  title,
  description,
}: ParticipationCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          {icon}
        </div>

        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
          {percentage}%
        </span>
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-950">
        {value}
        <span className="ml-1 text-sm font-medium text-slate-400">
          / {total}
        </span>
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-purple-600"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>
    </div>
  )
}

interface SummaryBoxProps {
  value: number | string
  label: string
}

function SummaryBox({
  value,
  label,
}: SummaryBoxProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-500">
        {label}
      </p>
    </div>
  )
}

interface RoleAnalyticsRowProps {
  role: RoleAnalytics
}

function RoleAnalyticsRow({
  role,
}: RoleAnalyticsRowProps) {
  return (
    <div className="p-5">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-bold text-slate-900">
                {role.roleTitle}
              </h3>

              {role.assessmentCoverage ===
              100 ? (
                <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                  Assessment Ready
                </span>
              ) : (
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                  {
                    role.assessmentCoverage
                  }
                  % Assessment Coverage
                </span>
              )}
            </div>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              {role.description ||
                'SkillForge career learning path'}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-500">
              <span>
                {role.totalTopics}{' '}
                topics
              </span>

              <span>
                {role.totalLessons}{' '}
                lessons
              </span>

              <span>
                {
                  role.totalAssessments
                }{' '}
                assessments
              </span>
            </div>
          </div>

          <div className="w-full xl:w-64">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500">
                Assessment Coverage
              </p>

              <p className="text-xs font-bold text-slate-700">
                {
                  role.assessmentCoverage
                }
                %
              </p>
            </div>

            <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-purple-600"
                style={{
                  width:
                    `${role.assessmentCoverage}%`,
                }}
              />
            </div>

            <p className="mt-2 text-xs text-slate-400">
              {
                role.topicsWithAssessment
              }{' '}
              of {role.totalTopics}{' '}
              topics covered
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <RoleMetric
            icon={
              <Users size={17} />
            }
            value={
              role.employeesWithProgress
            }
            label="Learners"
          />

          <RoleMetric
            icon={
              <CheckCircle2
                size={17}
              />
            }
            value={
              role.completedTopicRecords
            }
            label="Topic Completions"
          />

          <RoleMetric
            icon={
              <Code2 size={17} />
            }
            value={
              role.practicalPasses
            }
            label="Practical Passes"
          />

          <RoleMetric
            icon={
              <Award size={17} />
            }
            value={
              role.certificatesEarned
            }
            label="Certificates"
          />
        </div>
      </div>
    </div>
  )
}

interface RoleMetricProps {
  icon: ReactNode
  value: number
  label: string
}

function RoleMetric({
  icon,
  value,
  label,
}: RoleMetricProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-purple-600 shadow-sm">
        {icon}
      </div>

      <div>
        <p className="font-bold text-slate-900">
          {value}
        </p>

        <p className="text-xs text-slate-500">
          {label}
        </p>
      </div>
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

function formatNumber(
  value: number
) {
  if (!Number.isFinite(value)) {
    return '0'
  }

  return Number.isInteger(value)
    ? String(value)
    : value.toFixed(2)
}

export default AdminProgressAnalytics