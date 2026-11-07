import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  AlertCircle,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Circle,
  Code2,
  Eye,
  GraduationCap,
  Loader2,
  Search,
  ShieldCheck,
  Target,
  UserPlus,
  Users,
  X,
} from 'lucide-react'

import AdminLayout from '../../layouts/AdminLayout'

// ============================================================
// TYPES
// ============================================================

interface Employee {
  id: number
  fullName: string
  email: string
  role: string
  isActive: boolean
  createdAt: string
}

interface EmployeesResponse {
  success: boolean
  message?: string
  employees?: Employee[]
  count?: number
}

interface EmployeeResponse {
  success: boolean
  message?: string
  employee?: Employee
}

interface EmployeeForm {
  fullName: string
  email: string
  password: string
}

interface TopicAssessment {
  attempted: boolean
  attempts: number
  bestScore: number | null
  passed: boolean
}

interface EmployeeTopicProgress {
  topicId: number
  topicSlug: string
  topicTitle: string
  position: number
  totalLessons: number
  completedLessons: number
  lessonPercentage: number
  assessment: TopicAssessment
  completed: boolean
}

interface PracticalChallengeProgress {
  available: boolean
  challengeId?: number | null
  challengeTitle?: string | null
  attempted: boolean
  score: number | null
  passed: boolean
  executionStatus: string | null
  submittedAt: string | null
}

interface EmployeeRoleProgress {
  roleId: number
  roleSlug: string
  roleTitle: string
  totalTopics: number
  completedTopics: number
  totalLessons: number
  completedLessons: number
  topicPercentage: number
  lessonPercentage: number
  practicalChallenge: PracticalChallengeProgress
  certificateEarned: boolean
  topics: EmployeeTopicProgress[]
}

interface EmployeeProgressSummary {
  totalRoles: number
  totalTopics: number
  completedTopics: number
  totalLessons: number
  completedLessons: number
  certificatesEarned: number
  practicalPassed: number
  overallTopicPercentage: number
  overallLessonPercentage: number
}

interface EmployeeProgressResponse {
  success: boolean
  message?: string

  employee?: {
    id: number
    fullName: string
    email: string
    isActive: boolean
    createdAt: string
  }

  summary?: EmployeeProgressSummary
  roles?: EmployeeRoleProgress[]
}

// ============================================================
// CONSTANTS
// ============================================================

const API_BASE_URL =
  'http://localhost:5000/api'

const emptyForm: EmployeeForm = {
  fullName: '',
  email: '',
  password: '',
}

// ============================================================
// MAIN COMPONENT
// ============================================================

function Employees() {
  const [employees, setEmployees] =
    useState<Employee[]>([])

  const [search, setSearch] =
    useState('')

  const [statusFilter, setStatusFilter] =
    useState('all')

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [
    successMessage,
    setSuccessMessage,
  ] = useState('')

  // Add employee
  const [isAddOpen, setIsAddOpen] =
    useState(false)

  const [form, setForm] =
    useState<EmployeeForm>(emptyForm)

  const [formError, setFormError] =
    useState('')

  const [isCreating, setIsCreating] =
    useState(false)

  const [
    updatingEmployeeId,
    setUpdatingEmployeeId,
  ] = useState<number | null>(null)

  // Progress
  const [
    progressOpen,
    setProgressOpen,
  ] = useState(false)

  const [
    progressLoading,
    setProgressLoading,
  ] = useState(false)

  const [
    progressError,
    setProgressError,
  ] = useState('')

  const [
    progressData,
    setProgressData,
  ] =
    useState<EmployeeProgressResponse | null>(
      null
    )

  const [
    expandedRoles,
    setExpandedRoles,
  ] = useState<number[]>([])

  // ==========================================================
  // TOKEN
  // ==========================================================

  const getToken = () =>
    localStorage.getItem(
      'skillforge-token'
    )

  // ==========================================================
  // LOAD EMPLOYEES
  // ==========================================================

  const loadEmployees =
    useCallback(async () => {
      setIsLoading(true)
      setError('')

      try {
        const token = getToken()

        if (!token) {
          throw new Error(
            'Admin login session was not found.'
          )
        }

        const response = await fetch(
          `${API_BASE_URL}/admin/employees`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

        const data =
          (await response.json()) as
            EmployeesResponse

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              'Unable to load employees.'
          )
        }

        setEmployees(
          Array.isArray(data.employees)
            ? data.employees
            : []
        )
      } catch (err) {
        console.error(
          'Load employees error:',
          err
        )

        setEmployees([])

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load employees.'
        )
      } finally {
        setIsLoading(false)
      }
    }, [])

  useEffect(() => {
    void loadEmployees()
  }, [loadEmployees])

  // ==========================================================
  // FILTER
  // ==========================================================

  const filteredEmployees =
    useMemo(() => {
      const term = search
        .trim()
        .toLowerCase()

      return employees.filter(
        (employee) => {
          const matchesSearch =
            !term ||
            employee.fullName
              .toLowerCase()
              .includes(term) ||
            employee.email
              .toLowerCase()
              .includes(term)

          const matchesStatus =
            statusFilter === 'all' ||
            (statusFilter ===
              'active' &&
              employee.isActive) ||
            (statusFilter ===
              'inactive' &&
              !employee.isActive)

          return (
            matchesSearch &&
            matchesStatus
          )
        }
      )
    }, [
      employees,
      search,
      statusFilter,
    ])

  const activeCount =
    employees.filter(
      (employee) => employee.isActive
    ).length

  const inactiveCount =
    employees.length - activeCount

  // ==========================================================
  // ADD EMPLOYEE
  // ==========================================================

  const openAddEmployee = () => {
    setForm(emptyForm)
    setFormError('')
    setSuccessMessage('')
    setIsAddOpen(true)
  }

  const closeAddEmployee = () => {
    if (isCreating) return

    setIsAddOpen(false)
    setForm(emptyForm)
    setFormError('')
  }

  const createEmployee = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setFormError('')
    setSuccessMessage('')

    const fullName =
      form.fullName.trim()

    const email = form.email
      .trim()
      .toLowerCase()

    if (fullName.length < 2) {
      setFormError(
        'Full name must contain at least 2 characters.'
      )
      return
    }

    if (!email.includes('@')) {
      setFormError(
        'Please enter a valid email address.'
      )
      return
    }

    if (form.password.length < 8) {
      setFormError(
        'Password must contain at least 8 characters.'
      )
      return
    }

    setIsCreating(true)

    try {
      const token = getToken()

      if (!token) {
        throw new Error(
          'Admin login session was not found.'
        )
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/employees`,
        {
          method: 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            fullName,
            email,
            password: form.password,
          }),
        }
      )

      const data =
        (await response.json()) as
          EmployeeResponse

      if (
        !response.ok ||
        !data.success ||
        !data.employee
      ) {
        throw new Error(
          data.message ||
            'Unable to create employee.'
        )
      }

      setEmployees((current) => [
        data.employee!,
        ...current.filter(
          (employee) =>
            employee.id !==
            data.employee!.id
        ),
      ])

      setIsAddOpen(false)
      setForm(emptyForm)

      setSuccessMessage(
        `${data.employee.fullName} was added successfully.`
      )
    } catch (err) {
      console.error(
        'Create employee error:',
        err
      )

      setFormError(
        err instanceof Error
          ? err.message
          : 'Unable to create employee.'
      )
    } finally {
      setIsCreating(false)
    }
  }

  // ==========================================================
  // STATUS
  // ==========================================================

  const changeEmployeeStatus =
    async (employee: Employee) => {
      const nextStatus =
        !employee.isActive

      const confirmed =
        window.confirm(
          nextStatus
            ? `Activate ${employee.fullName}'s account?`
            : `Deactivate ${employee.fullName}'s account? They will not be able to log in while inactive.`
        )

      if (!confirmed) return

      setUpdatingEmployeeId(
        employee.id
      )

      setError('')
      setSuccessMessage('')

      try {
        const token = getToken()

        if (!token) {
          throw new Error(
            'Admin login session was not found.'
          )
        }

        const response = await fetch(
          `${API_BASE_URL}/admin/employees/${employee.id}/status`,
          {
            method: 'PATCH',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              isActive: nextStatus,
            }),
          }
        )

        const data =
          (await response.json()) as
            EmployeeResponse

        if (
          !response.ok ||
          !data.success ||
          !data.employee
        ) {
          throw new Error(
            data.message ||
              'Unable to update employee.'
          )
        }

        setEmployees((current) =>
          current.map((item) =>
            item.id ===
            data.employee!.id
              ? data.employee!
              : item
          )
        )

        setSuccessMessage(
          data.message ||
            'Employee updated successfully.'
        )
      } catch (err) {
        console.error(
          'Update employee error:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to update employee.'
        )
      } finally {
        setUpdatingEmployeeId(null)
      }
    }

  // ==========================================================
  // LOAD EMPLOYEE PROGRESS
  // ==========================================================

  const viewProgress = async (
    employee: Employee
  ) => {
    setProgressOpen(true)
    setProgressLoading(true)
    setProgressError('')
    setProgressData(null)
    setExpandedRoles([])

    try {
      const token = getToken()

      if (!token) {
        throw new Error(
          'Admin login session was not found.'
        )
      }

      const response = await fetch(
        `${API_BASE_URL}/admin/employees/${employee.id}/progress`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      )

      const data =
        (await response.json()) as
          EmployeeProgressResponse

      if (
        !response.ok ||
        !data.success ||
        !data.employee ||
        !data.summary ||
        !Array.isArray(data.roles)
      ) {
        throw new Error(
          data.message ||
            'Unable to load employee progress.'
        )
      }

      setProgressData(data)

      setExpandedRoles(
        data.roles.length > 0
          ? [data.roles[0].roleId]
          : []
      )
    } catch (err) {
      console.error(
        'Employee progress error:',
        err
      )

      setProgressError(
        err instanceof Error
          ? err.message
          : 'Unable to load employee progress.'
      )
    } finally {
      setProgressLoading(false)
    }
  }

  const closeProgress = () => {
    setProgressOpen(false)
    setProgressData(null)
    setProgressError('')
    setExpandedRoles([])
  }

  const toggleRole = (
    roleId: number
  ) => {
    setExpandedRoles((current) =>
      current.includes(roleId)
        ? current.filter(
            (id) => id !== roleId
          )
        : [...current, roleId]
    )
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">
          {/* HEADER */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-600">
                Employee Management
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-950">
                Employees
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Manage employee accounts
                and monitor individual
                learning, assessment,
                practical challenge and
                certificate progress.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddEmployee}
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              <UserPlus size={17} />
              Add Employee
            </button>
          </div>

          {/* SUCCESS */}

          {successMessage && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-800">
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm font-medium">
                {successMessage}
              </p>
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800">
              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0"
              />

              <div className="flex-1">
                <p className="text-sm font-medium">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    void loadEmployees()
                  }
                  className="mt-2 text-xs font-bold underline"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* METRICS */}

          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <MetricCard
              icon={<Users size={20} />}
              value={employees.length}
              label="Total Employees"
            />

            <MetricCard
              icon={
                <CheckCircle2
                  size={20}
                />
              }
              value={activeCount}
              label="Active Employees"
            />

            <MetricCard
              icon={
                <ShieldCheck
                  size={20}
                />
              }
              value={inactiveCount}
              label="Inactive Employees"
            />
          </div>

          {/* DIRECTORY */}

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Employee Directory
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Select View Progress
                    to inspect an employee's
                    complete learning record.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative">
                    <Search
                      size={17}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="text"
                      value={search}
                      onChange={(event) =>
                        setSearch(
                          event.target
                            .value
                        )
                      }
                      placeholder="Search name or email..."
                      className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 sm:w-64"
                    />
                  </div>

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target
                          .value
                      )
                    }
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  >
                    <option value="all">
                      All Statuses
                    </option>

                    <option value="active">
                      Active
                    </option>

                    <option value="inactive">
                      Inactive
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="p-12 text-center">
                <Loader2
                  size={30}
                  className="mx-auto animate-spin text-purple-600"
                />

                <p className="mt-3 text-sm text-slate-500">
                  Loading employees...
                </p>
              </div>
            ) : filteredEmployees.length >
              0 ? (
              <div className="divide-y divide-slate-100">
                {filteredEmployees.map(
                  (employee) => (
                    <EmployeeRow
                      key={employee.id}
                      employee={
                        employee
                      }
                      isUpdating={
                        updatingEmployeeId ===
                        employee.id
                      }
                      onViewProgress={() =>
                        void viewProgress(
                          employee
                        )
                      }
                      onChangeStatus={() =>
                        void changeEmployeeStatus(
                          employee
                        )
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="p-12 text-center">
                <Search
                  size={34}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-4 font-semibold text-slate-700">
                  No employees found
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {employees.length ===
                  0
                    ? 'Create your first employee account using Add Employee.'
                    : 'Try another name, email or status filter.'}
                </p>
              </div>
            )}
          </div>

          <div className="mt-7 rounded-2xl border border-purple-100 bg-purple-50 p-5">
            <div className="flex gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-purple-600"
              />

              <div>
                <h3 className="text-sm font-semibold text-purple-900">
                  Database-backed
                  employee progress
                </h3>

                <p className="mt-1 text-sm leading-6 text-purple-700">
                  Lesson completion,
                  assessments, practical
                  challenges and
                  certificates are tracked
                  independently for every
                  employee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================
          ADD EMPLOYEE MODAL
      ====================================================== */}

      {isAddOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeAddEmployee()
            }
          }}
        >
          <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-100 p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  Admin
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Add Employee
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new
                  SkillForge employee
                  login.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeAddEmployee
                }
                disabled={isCreating}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={createEmployee}
              className="p-6"
            >
              {formError && (
                <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
                  <AlertCircle
                    size={18}
                    className="mt-0.5 shrink-0"
                  />

                  <p className="text-sm">
                    {formError}
                  </p>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={form.fullName}
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        fullName:
                          event.target
                            .value,
                      })
                    )
                  }
                  autoComplete="name"
                  placeholder="e.g. Aisha Khan"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-semibold text-slate-700">
                  Email Address
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        email:
                          event.target
                            .value,
                      })
                    )
                  }
                  autoComplete="email"
                  placeholder="employee@company.com"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div className="mt-5">
                <label className="text-sm font-semibold text-slate-700">
                  Temporary Password
                </label>

                <input
                  type="password"
                  value={form.password}
                  onChange={(event) =>
                    setForm(
                      (current) => ({
                        ...current,
                        password:
                          event.target
                            .value,
                      })
                    )
                  }
                  autoComplete="new-password"
                  placeholder="Minimum 8 characters"
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeAddEmployee
                  }
                  disabled={isCreating}
                  className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:opacity-60"
                >
                  {isCreating ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Creating...
                    </>
                  ) : (
                    <>
                      <UserPlus
                        size={17}
                      />
                      Create Employee
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================
          EMPLOYEE PROGRESS MODAL
      ====================================================== */}

      {progressOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 p-3 sm:p-6">
          <div className="mx-auto flex h-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-slate-50 shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex shrink-0 items-center justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  Employee Analytics
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Detailed Progress
                </h2>
              </div>

              <button
                type="button"
                onClick={closeProgress}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                <X size={19} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 sm:p-7">
              {progressLoading ? (
                <div className="flex min-h-96 flex-col items-center justify-center">
                  <Loader2
                    size={34}
                    className="animate-spin text-purple-600"
                  />

                  <p className="mt-4 text-sm text-slate-500">
                    Loading employee
                    progress...
                  </p>
                </div>
              ) : progressError ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
                  <div className="flex gap-3">
                    <AlertCircle
                      size={20}
                      className="shrink-0"
                    />

                    <p className="text-sm font-medium">
                      {progressError}
                    </p>
                  </div>
                </div>
              ) : progressData?.employee &&
                progressData.summary &&
                progressData.roles ? (
                <>
                  {/* EMPLOYEE */}

                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-700">
                        {progressData.employee.fullName
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-xl font-bold text-slate-950">
                          {
                            progressData
                              .employee
                              .fullName
                          }
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          {
                            progressData
                              .employee.email
                          }
                        </p>
                      </div>

                      <span
                        className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-bold ${
                          progressData
                            .employee
                            .isActive
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}
                      >
                        {progressData
                          .employee
                          .isActive
                          ? 'Active'
                          : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* SUMMARY */}

                  <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <ProgressStat
                      icon={
                        <Target
                          size={19}
                        />
                      }
                      label="Topics Passed"
                      value={`${progressData.summary.completedTopics}/${progressData.summary.totalTopics}`}
                      detail={`${progressData.summary.overallTopicPercentage}% complete`}
                    />

                    <ProgressStat
                      icon={
                        <BookOpen
                          size={19}
                        />
                      }
                      label="Lessons Completed"
                      value={`${progressData.summary.completedLessons}/${progressData.summary.totalLessons}`}
                      detail={`${progressData.summary.overallLessonPercentage}% complete`}
                    />

                    <ProgressStat
                      icon={
                        <Code2
                          size={19}
                        />
                      }
                      label="Practicals Passed"
                      value={`${progressData.summary.practicalPassed}/${progressData.summary.totalRoles}`}
                      detail="Role challenges"
                    />

                    <ProgressStat
                      icon={
                        <Award
                          size={19}
                        />
                      }
                      label="Certificates"
                      value={`${progressData.summary.certificatesEarned}/${progressData.summary.totalRoles}`}
                      detail="Career certificates"
                    />
                  </div>

                  {/* OVERALL BARS */}

                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    <PercentageCard
                      title="Overall Topic Progress"
                      percentage={
                        progressData
                          .summary
                          .overallTopicPercentage
                      }
                      description={`${progressData.summary.completedTopics} of ${progressData.summary.totalTopics} topics passed`}
                    />

                    <PercentageCard
                      title="Overall Lesson Progress"
                      percentage={
                        progressData
                          .summary
                          .overallLessonPercentage
                      }
                      description={`${progressData.summary.completedLessons} of ${progressData.summary.totalLessons} lessons completed`}
                    />
                  </div>

                  {/* ROLE PROGRESS */}

                  <div className="mt-7">
                    <div className="mb-4">
                      <h3 className="text-lg font-bold text-slate-950">
                        Career Role
                        Progress
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Expand a career
                        role to inspect
                        topic assessments,
                        lessons and
                        practical challenge
                        status.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {progressData.roles.map(
                        (role) => {
                          const expanded =
                            expandedRoles.includes(
                              role.roleId
                            )

                          return (
                            <RoleProgressCard
                              key={
                                role.roleId
                              }
                              role={role}
                              expanded={
                                expanded
                              }
                              onToggle={() =>
                                toggleRole(
                                  role.roleId
                                )
                              }
                            />
                          )
                        }
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}

// ============================================================
// EMPLOYEE ROW
// ============================================================

interface EmployeeRowProps {
  employee: Employee
  isUpdating: boolean
  onViewProgress: () => void
  onChangeStatus: () => void
}

function EmployeeRow({
  employee,
  isUpdating,
  onViewProgress,
  onChangeStatus,
}: EmployeeRowProps) {
  const createdDate =
    employee.createdAt
      ? new Date(
          employee.createdAt
        ).toLocaleDateString()
      : '—'

  return (
    <div className="flex flex-col gap-5 p-5 xl:flex-row xl:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
          {employee.fullName
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="min-w-0">
          <p className="font-semibold text-slate-900">
            {employee.fullName}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {employee.email}
          </p>
        </div>
      </div>

      <div className="xl:w-32">
        <p className="text-xs text-slate-400">
          Created
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-700">
          {createdDate}
        </p>
      </div>

      <div className="xl:w-28">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
            employee.isActive
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}
        >
          <CheckCircle2 size={13} />

          {employee.isActive
            ? 'Active'
            : 'Inactive'}
        </span>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={onViewProgress}
          className="flex items-center justify-center gap-2 rounded-xl bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
        >
          <Eye size={16} />
          View Progress
        </button>

        <button
          type="button"
          disabled={isUpdating}
          onClick={onChangeStatus}
          className={`rounded-xl border px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
            employee.isActive
              ? 'border-red-200 text-red-600 hover:bg-red-50'
              : 'border-green-200 text-green-700 hover:bg-green-50'
          }`}
        >
          {isUpdating
            ? 'Updating...'
            : employee.isActive
              ? 'Deactivate'
              : 'Activate'}
        </button>
      </div>
    </div>
  )
}

// ============================================================
// METRIC CARD
// ============================================================

interface MetricCardProps {
  icon: React.ReactNode
  value: number
  label: string
}

function MetricCard({
  icon,
  value,
  label,
}: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          {icon}
        </div>

        <span className="text-2xl font-bold text-slate-950">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm font-semibold text-slate-600">
        {label}
      </p>
    </div>
  )
}

// ============================================================
// PROGRESS STAT
// ============================================================

interface ProgressStatProps {
  icon: React.ReactNode
  label: string
  value: string
  detail: string
}

function ProgressStat({
  icon,
  label,
  value,
  detail,
}: ProgressStatProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {detail}
      </p>
    </div>
  )
}

// ============================================================
// PERCENTAGE CARD
// ============================================================

interface PercentageCardProps {
  title: string
  percentage: number
  description: string
}

function PercentageCard({
  title,
  percentage,
  description,
}: PercentageCardProps) {
  const safePercentage =
    Math.max(
      0,
      Math.min(100, percentage)
    )

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h4 className="font-semibold text-slate-900">
          {title}
        </h4>

        <span className="text-lg font-bold text-purple-700">
          {safePercentage}%
        </span>
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-purple-600 transition-all"
          style={{
            width:
              `${safePercentage}%`,
          }}
        />
      </div>

      <p className="mt-3 text-xs text-slate-500">
        {description}
      </p>
    </div>
  )
}

// ============================================================
// ROLE PROGRESS
// ============================================================

interface RoleProgressCardProps {
  role: EmployeeRoleProgress
  expanded: boolean
  onToggle: () => void
}

function RoleProgressCard({
  role,
  expanded,
  onToggle,
}: RoleProgressCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="w-full p-5 text-left transition hover:bg-slate-50"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <GraduationCap
                size={20}
              />
            </div>

            <div className="min-w-0">
              <h4 className="font-bold text-slate-900">
                {role.roleTitle}
              </h4>

              <p className="mt-1 text-xs text-slate-500">
                {
                  role.completedTopics
                }
                /{role.totalTopics}{' '}
                topics passed ·{' '}
                {
                  role.completedLessons
                }
                /{role.totalLessons}{' '}
                lessons
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {role.certificateEarned ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-700">
                <Award size={14} />
                Certificate Earned
              </span>
            ) : (
              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                Certificate Pending
              </span>
            )}

            <span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
              {role.topicPercentage}%
            </span>

            {expanded ? (
              <ChevronUp
                size={18}
                className="text-slate-400"
              />
            ) : (
              <ChevronDown
                size={18}
                className="text-slate-400"
              />
            )}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-slate-100 bg-slate-50 p-5">
          <div className="grid gap-4 lg:grid-cols-2">
            <PercentageCard
              title="Topic Completion"
              percentage={
                role.topicPercentage
              }
              description={`${role.completedTopics} of ${role.totalTopics} topic assessments passed`}
            />

            <PercentageCard
              title="Lesson Completion"
              percentage={
                role.lessonPercentage
              }
              description={`${role.completedLessons} of ${role.totalLessons} lessons completed`}
            />
          </div>

          {/* TOPICS */}

          <div className="mt-5">
            <h5 className="text-sm font-bold text-slate-900">
              Topic Progress
            </h5>

            <div className="mt-3 space-y-3">
              {role.topics.map(
                (topic) => (
                  <TopicProgressRow
                    key={
                      topic.topicId
                    }
                    topic={topic}
                  />
                )
              )}
            </div>
          </div>

          {/* PRACTICAL */}

          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Code2 size={17} />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Final Practical
                    Challenge
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {role
                      .practicalChallenge
                      .available
                      ? role
                          .practicalChallenge
                          .challengeTitle ||
                        'Career role practical challenge'
                      : 'No active practical challenge'}
                  </p>
                </div>
              </div>

              <PracticalStatus
                practical={
                  role.practicalChallenge
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// TOPIC ROW
// ============================================================

function TopicProgressRow({
  topic,
}: {
  topic: EmployeeTopicProgress
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          {topic.completed ? (
            <CheckCircle2
              size={19}
              className="mt-0.5 shrink-0 text-green-600"
            />
          ) : (
            <Circle
              size={19}
              className="mt-0.5 shrink-0 text-slate-300"
            />
          )}

          <div>
            <p className="text-sm font-semibold text-slate-900">
              {topic.topicTitle}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              {topic.completedLessons}/
              {topic.totalLessons}{' '}
              lessons completed ·{' '}
              {topic.lessonPercentage}%
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {!topic.assessment
            .attempted ? (
            <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
              Assessment Not
              Attempted
            </span>
          ) : (
            <>
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                  topic.assessment
                    .passed
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {topic.assessment
                  .passed
                  ? 'Assessment Passed'
                  : 'Assessment Failed'}
              </span>

              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                Best:{' '}
                {topic.assessment
                  .bestScore ?? 0}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                {
                  topic.assessment
                    .attempts
                }{' '}
                attempt
                {topic.assessment
                  .attempts === 1
                  ? ''
                  : 's'}
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// ============================================================
// PRACTICAL STATUS
// ============================================================

function PracticalStatus({
  practical,
}: {
  practical: PracticalChallengeProgress
}) {
  if (!practical.available) {
    return (
      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
        Not Available
      </span>
    )
  }

  if (!practical.attempted) {
    return (
      <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
        Not Attempted
      </span>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span
        className={`rounded-full px-3 py-1.5 text-xs font-bold ${
          practical.passed
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-700'
        }`}
      >
        {practical.passed
          ? 'Passed'
          : 'Not Passed'}
      </span>

      {practical.score !== null && (
        <span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
          Score: {practical.score}
        </span>
      )}

      {practical.executionStatus && (
        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold capitalize text-slate-600">
          {practical.executionStatus}
        </span>
      )}
    </div>
  )
}

export default Employees