import {
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

import {
  ArrowRight,
  Award,
  BookOpenCheck,
  BriefcaseBusiness,
  CheckCircle2,
  ClipboardCheck,
  Database,
  Layers3,
  Loader2,
  RefreshCw,
  ServerCog,
  ShieldCheck,
  TrendingUp,
  Users,
  Video,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

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

function AdminDashboard() {
  const navigate = useNavigate()

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
              'Unable to load dashboard analytics.'
          )
        }

        setAnalytics(data)
      } catch (requestError) {
        console.error(
          'Admin dashboard analytics error:',
          requestError
        )

        setAnalytics(null)

        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load dashboard analytics.'
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    void loadAnalytics()
  }, [loadAnalytics])

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

  const roles =
    analytics?.roles ?? []

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

  const activeEmployeePercentage =
    employees.total > 0
      ? Math.round(
          (employees.active /
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
                SkillForge Administration
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-950">
                Learning Management
                Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Monitor SkillForge
                learning content,
                employees, assessment
                activity, practical
                challenges and verified
                career completion.
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

              Refresh
            </button>
          </div>

          {/* ERROR */}

          {error && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
              <p className="font-semibold text-red-800">
                Dashboard data could
                not be loaded
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

          {/* LOADING */}

          {loading && !analytics ? (
            <div className="mt-8 flex min-h-[360px] items-center justify-center rounded-3xl border border-slate-200 bg-white">
              <div className="text-center">
                <Loader2
                  size={34}
                  className="mx-auto animate-spin text-purple-600"
                />

                <p className="mt-4 text-sm font-semibold text-slate-700">
                  Loading real
                  SkillForge analytics...
                </p>
              </div>
            </div>
          ) : (
            <>
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
                      Platform
                    </h2>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                      Live platform
                      statistics are now
                      calculated from the
                      SkillForge backend
                      and PostgreSQL
                      learning records
                      instead of frontend
                      roadmap constants.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
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
                        type="button"
                        onClick={() =>
                          navigate(
                            '/admin/progress'
                          )
                        }
                        className="flex items-center gap-2 rounded-xl border border-slate-700 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-800"
                      >
                        View Analytics
                      </button>
                    </div>
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
                        content.totalTopics
                      }
                      label="Topics"
                    />

                    <HeroMetric
                      value={
                        employees.total
                      }
                      label="Employees"
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

              {/* CONTENT KPI */}

              <SectionHeader
                title="Learning Content"
                description="Current active learning architecture stored in the backend."
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={
                    <BriefcaseBusiness
                      size={21}
                    />
                  }
                  value={
                    content.totalRoles
                  }
                  label="Career Roles"
                  description="Active structured career learning paths"
                />

                <StatCard
                  icon={
                    <Layers3
                      size={21}
                    />
                  }
                  value={
                    content.totalTopics
                  }
                  label="Roadmap Topics"
                  description="Active topics across all career roles"
                />

                <StatCard
                  icon={
                    <BookOpenCheck
                      size={21}
                    />
                  }
                  value={
                    content.totalLessons
                  }
                  label="Learning Lessons"
                  description="Active lesson units available to employees"
                />

                <StatCard
                  icon={
                    <ClipboardCheck
                      size={21}
                    />
                  }
                  value={
                    content.totalAssessments
                  }
                  label="Assessments"
                  description={`${assessmentCoverage}% topic assessment coverage`}
                />
              </div>

              {/* EMPLOYEE / LEARNING */}

              <SectionHeader
                title="Employee Learning Activity"
                description="Platform-wide activity calculated from persisted employee learning records."
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={
                    <Users size={21} />
                  }
                  value={
                    employees.total
                  }
                  label="Employees"
                  description={`${employees.active} active · ${employees.inactive} inactive`}
                />

                <StatCard
                  icon={
                    <BookOpenCheck
                      size={21}
                    />
                  }
                  value={
                    learning.completedLessons
                  }
                  label="Lesson Completions"
                  description={`${employees.withLessonProgress} employees have lesson progress`}
                />

                <StatCard
                  icon={
                    <CheckCircle2
                      size={21}
                    />
                  }
                  value={
                    learning.completedTopics
                  }
                  label="Topic Completions"
                  description="Unique employee-topic assessment completions"
                />

                <StatCard
                  icon={
                    <Award size={21} />
                  }
                  value={
                    learning.certificatesEarned
                  }
                  label="Certificates Earned"
                  description={`${employees.withCertificates} employees have verified role completion`}
                />
              </div>

              {/* PERFORMANCE */}

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-purple-600">
                        Assessment
                        Performance
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-slate-950">
                        Employee
                        Assessments
                      </h2>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <TrendingUp
                        size={21}
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <SmallMetric
                      value={
                        learning.assessmentAttempts
                      }
                      label="Attempts"
                    />

                    <SmallMetric
                      value={
                        learning.passedAssessmentAttempts
                      }
                      label="Passed Attempts"
                    />

                    <SmallMetric
                      value={`${learning.assessmentPassRate}%`}
                      label="Pass Rate"
                    />

                    <SmallMetric
                      value={`${formatNumber(
                        learning.averageAssessmentScore
                      )}%`}
                      label="Average Score"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/admin/progress'
                      )
                    }
                    className="mt-6 flex items-center gap-2 text-sm font-semibold text-purple-600 transition hover:text-purple-700"
                  >
                    Open Progress
                    Analytics

                    <ArrowRight
                      size={16}
                    />
                  </button>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-purple-600">
                        Completion
                      </p>

                      <h2 className="mt-1 text-lg font-bold text-slate-950">
                        Practical &
                        Certificate
                        Progress
                      </h2>
                    </div>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <Award size={21} />
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    <SmallMetric
                      value={
                        learning.practicalPasses
                      }
                      label="Practical Passes"
                    />

                    <SmallMetric
                      value={
                        employees.withPracticalPass
                      }
                      label="Employees Passed"
                    />

                    <SmallMetric
                      value={
                        learning.certificatesEarned
                      }
                      label="Certificates"
                    />

                    <SmallMetric
                      value={
                        employees.withCertificates
                      }
                      label="Certified Employees"
                    />
                  </div>

                  <p className="mt-5 text-xs leading-5 text-slate-500">
                    Certificates require
                    completion of every
                    active topic in the
                    career role plus a
                    passed practical
                    challenge.
                  </p>
                </div>
              </div>

              {/* EMPLOYEE STATUS */}

              <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">
                      Employee Accounts
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Current employee
                      account status.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/admin/employees'
                      )
                    }
                    className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Manage Employees

                    <ArrowRight
                      size={16}
                    />
                  </button>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <StatusMetric
                    value={
                      employees.total
                    }
                    label="Total Employees"
                  />

                  <StatusMetric
                    value={
                      employees.active
                    }
                    label="Active Employees"
                  />

                  <StatusMetric
                    value={
                      employees.inactive
                    }
                    label="Inactive Employees"
                  />
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-500">
                      Active employee
                      accounts
                    </span>

                    <span className="font-bold text-slate-800">
                      {
                        activeEmployeePercentage
                      }
                      %
                    </span>
                  </div>

                  <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-purple-600"
                      style={{
                        width:
                          `${activeEmployeePercentage}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* MANAGEMENT */}

              <SectionHeader
                title="Management Workspace"
                description="Access the major administration areas of SkillForge."
              />

              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <ManagementCard
                  icon={
                    <BriefcaseBusiness
                      size={22}
                    />
                  }
                  title="Career Roles"
                  description="Manage career learning paths and their roadmap structure."
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
                  description="Manage topic assessments and question banks."
                  action="Manage Assessments"
                  onClick={() =>
                    navigate(
                      '/admin/assessments'
                    )
                  }
                />

                <ManagementCard
                  icon={
                    <Video size={22} />
                  }
                  title="Live Sessions"
                  description="Schedule, start and manage topic-specific live sessions."
                  action="Manage Sessions"
                  onClick={() =>
                    navigate(
                      '/admin/live-sessions'
                    )
                  }
                />

                <ManagementCard
                  icon={
                    <Users size={22} />
                  }
                  title="Employees"
                  description="Manage employee accounts and inspect detailed learning progress."
                  action="Manage Employees"
                  onClick={() =>
                    navigate(
                      '/admin/employees'
                    )
                  }
                />

                <ManagementCard
                  icon={
                    <TrendingUp
                      size={22}
                    />
                  }
                  title="Progress & Analytics"
                  description="Review persisted learning activity, performance and completion."
                  action="View Analytics"
                  onClick={() =>
                    navigate(
                      '/admin/progress'
                    )
                  }
                />
              </div>

              {/* ROLE ANALYTICS */}

              <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-200 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-950">
                      Career Roadmap
                      Coverage
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Backend learning
                      structure and
                      employee activity
                      for each career
                      role.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        '/admin/progress'
                      )
                    }
                    className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700"
                  >
                    Full Analytics

                    <ArrowRight
                      size={16}
                    />
                  </button>
                </div>

                {roles.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {roles.map(
                      (role) => (
                        <RoleCoverageRow
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
                    <Layers3
                      size={34}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-4 font-semibold text-slate-700">
                      No active career
                      roles found
                    </p>
                  </div>
                )}
              </div>

              {/* ARCHITECTURE */}

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
                    SkillForge uses one
                    consistent learning
                    hierarchy across
                    every career path.
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
                      title="Practical Challenge"
                    />

                    <WorkflowStep
                      number="06"
                      title="Verified Certificate"
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
                    Dashboard metrics
                    are loaded from the
                    authenticated admin
                    API and calculated
                    from PostgreSQL
                    records.
                  </p>

                  <div className="mt-5 space-y-3">
                    <BackendItem
                      icon={
                        <Database
                          size={17}
                        />
                      }
                      label="PostgreSQL-backed learning analytics"
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
                      label="Server-side assessment attempts and scoring"
                    />

                    <BackendItem
                      icon={
                        <CheckCircle2
                          size={17}
                        />
                      }
                      label="Persisted lesson and topic progress"
                    />

                    <BackendItem
                      icon={
                        <Award
                          size={17}
                        />
                      }
                      label="Practical challenge and certificate completion"
                    />
                  </div>
                </div>
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
    <div className="mt-8">
      <h2 className="text-xl font-bold text-slate-950">
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

interface StatCardProps {
  icon: ReactNode
  value: number | string
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

interface SmallMetricProps {
  value: number | string
  label: string
}

function SmallMetric({
  value,
  label,
}: SmallMetricProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-500">
        {label}
      </p>
    </div>
  )
}

interface StatusMetricProps {
  value: number
  label: string
}

function StatusMetric({
  value,
  label,
}: StatusMetricProps) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-2xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-600">
        {label}
      </p>
    </div>
  )
}

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
      type="button"
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

interface RoleCoverageRowProps {
  role: RoleAnalytics
}

function RoleCoverageRow({
  role,
}: RoleCoverageRowProps) {
  return (
    <div className="p-5">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <p className="font-semibold text-slate-900">
              {role.roleTitle}
            </p>

            {role.assessmentCoverage ===
            100 ? (
              <span className="rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                Assessment Ready
              </span>
            ) : (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                Assessment Coverage{' '}
                {
                  role.assessmentCoverage
                }
                %
              </span>
            )}
          </div>

          <p className="mt-2 line-clamp-2 max-w-3xl text-sm leading-6 text-slate-500">
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

            <span>
              {
                role.employeesWithProgress
              }{' '}
              learners
            </span>

            <span>
              {
                role.completedTopicRecords
              }{' '}
              topic completions
            </span>

            <span>
              {
                role.certificatesEarned
              }{' '}
              certificates
            </span>
          </div>
        </div>

        <div className="w-full xl:w-56">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Assessment coverage
            </span>

            <span className="font-semibold text-slate-800">
              {
                role.assessmentCoverage
              }
              %
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-purple-600"
              style={{
                width:
                  `${role.assessmentCoverage}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

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

export default AdminDashboard