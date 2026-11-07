import type {
  FormEvent,
  ReactNode,
} from 'react'

import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  Layers3,
  Loader2,
  Plus,
  Search,
  X,
} from 'lucide-react'

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'

const API_URL = 'http://localhost:5000'
const TOKEN_KEY = 'skillforge-token'

interface CareerRole {
  id: number
  slug: string
  title: string
  description: string
  isActive: boolean
  topicCount: number
  lessonCount: number
  createdAt?: string
  updatedAt?: string
}

interface RolesResponse {
  success: boolean
  roles?: CareerRole[]
  roleCount?: number
  message?: string
}

interface CreateRoleResponse {
  success: boolean
  message?: string
  role?: CareerRole
}

function CareerRoles() {
  const navigate = useNavigate()

  const [roles, setRoles] =
    useState<CareerRole[]>([])

  const [searchTerm, setSearchTerm] =
    useState('')

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState('')

  const [showAddModal, setShowAddModal] =
    useState(false)

  const [title, setTitle] =
    useState('')

  const [slug, setSlug] =
    useState('')

  const [description, setDescription] =
    useState('')

  const [saving, setSaving] =
    useState(false)

  const [formError, setFormError] =
    useState('')

  const getToken = () =>
    localStorage.getItem(TOKEN_KEY)

  /*
  |--------------------------------------------------------------------------
  | LOAD CAREER ROLES FROM POSTGRESQL
  |--------------------------------------------------------------------------
  */

  const loadRoles =
    useCallback(async () => {
      setLoading(true)
      setError('')

      try {
        const token = getToken()

        if (!token) {
          throw new Error(
            'Authentication token not found. Please sign in again.'
          )
        }

        const response = await fetch(
          `${API_URL}/api/admin/roles`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

        const data: RolesResponse =
          await response.json()

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              'Unable to load career roles.'
          )
        }

        setRoles(
          Array.isArray(data.roles)
            ? data.roles
            : []
        )
      } catch (err) {
        console.error(
          'Load career roles error:',
          err
        )

        setError(
          err instanceof Error
            ? err.message
            : 'Unable to load career roles.'
        )
      } finally {
        setLoading(false)
      }
    }, [])

  useEffect(() => {
    void loadRoles()
  }, [loadRoles])

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredRoles =
    useMemo(() => {
      const query =
        searchTerm
          .trim()
          .toLowerCase()

      if (!query) {
        return roles
      }

      return roles.filter(
        (role) =>
          role.title
            .toLowerCase()
            .includes(query) ||
          role.slug
            .toLowerCase()
            .includes(query) ||
          role.description
            .toLowerCase()
            .includes(query)
      )
    }, [
      roles,
      searchTerm,
    ])

  /*
  |--------------------------------------------------------------------------
  | SUMMARY COUNTS
  |--------------------------------------------------------------------------
  */

  const totalTopics =
    useMemo(
      () =>
        roles.reduce(
          (total, role) =>
            total +
            role.topicCount,
          0
        ),
      [roles]
    )

  const totalLessons =
    useMemo(
      () =>
        roles.reduce(
          (total, role) =>
            total +
            role.lessonCount,
          0
        ),
      [roles]
    )

  /*
  |--------------------------------------------------------------------------
  | GENERATE SLUG WHILE TYPING TITLE
  |--------------------------------------------------------------------------
  */

  const generateSlug = (
    value: string
  ) =>
    value
      .trim()
      .toLowerCase()
      .replace(
        /[^a-z0-9]+/g,
        '-'
      )
      .replace(
        /^-+|-+$/g,
        ''
      )

  const handleTitleChange = (
    value: string
  ) => {
    const previousGeneratedSlug =
      generateSlug(title)

    setTitle(value)

    /*
    | If the admin has not manually changed
    | the slug, keep generating it.
    */

    if (
      !slug ||
      slug ===
        previousGeneratedSlug
    ) {
      setSlug(
        generateSlug(value)
      )
    }
  }

  /*
  |--------------------------------------------------------------------------
  | OPEN / CLOSE ADD ROLE
  |--------------------------------------------------------------------------
  */

  const resetForm = () => {
    setTitle('')
    setSlug('')
    setDescription('')
    setFormError('')
  }

  const openAddModal = () => {
    resetForm()
    setShowAddModal(true)
  }

  const closeAddModal = () => {
    if (saving) {
      return
    }

    setShowAddModal(false)
    resetForm()
  }

  /*
  |--------------------------------------------------------------------------
  | CREATE ROLE
  |--------------------------------------------------------------------------
  */

  const handleCreateRole =
    async (
      event: FormEvent
    ) => {
      event.preventDefault()

      setFormError('')

      const cleanTitle =
        title.trim()

      const cleanSlug =
        generateSlug(slug)

      const cleanDescription =
        description.trim()

      if (
        cleanTitle.length < 2
      ) {
        setFormError(
          'Career role title must contain at least 2 characters.'
        )
        return
      }

      if (!cleanSlug) {
        setFormError(
          'Please enter a valid role slug.'
        )
        return
      }

      setSaving(true)

      try {
        const token = getToken()

        if (!token) {
          throw new Error(
            'Authentication token not found. Please sign in again.'
          )
        }

        const response = await fetch(
          `${API_URL}/api/admin/roles`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              title:
                cleanTitle,

              slug:
                cleanSlug,

              description:
                cleanDescription,
            }),
          }
        )

        const data:
          CreateRoleResponse =
            await response.json()

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              'Unable to create career role.'
          )
        }

        setShowAddModal(false)
        resetForm()

        await loadRoles()
      } catch (err) {
        console.error(
          'Create career role error:',
          err
        )

        setFormError(
          err instanceof Error
            ? err.message
            : 'Unable to create career role.'
        )
      } finally {
        setSaving(false)
      }
    }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-600">
                Learning Management
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-950">
                Career Roles
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage the career learning
                paths available to employees
                across SkillForge.
              </p>
            </div>

            <button
              type="button"
              onClick={
                openAddModal
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
            >
              <Plus size={18} />

              Add Career Role
            </button>
          </div>

          {/* SUMMARY */}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <StatCard
              icon={
                <BriefcaseBusiness
                  size={21}
                />
              }
              value={
                roles.length
              }
              label="Career Roles"
            />

            <StatCard
              icon={
                <Layers3
                  size={21}
                />
              }
              value={
                totalTopics
              }
              label="Roadmap Topics"
            />

            <StatCard
              icon={
                <BookOpenCheck
                  size={21}
                />
              }
              value={
                totalLessons
              }
              label="Learning Lessons"
            />
          </div>

          {/* SEARCH */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="relative max-w-xl">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={
                  searchTerm
                }
                onChange={(
                  event
                ) =>
                  setSearchTerm(
                    event.target
                      .value
                  )
                }
                placeholder="Search career roles..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* LOADING */}

          {loading && (
            <div className="mt-6 flex items-center justify-center rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
              <Loader2
                size={28}
                className="animate-spin text-purple-600"
              />

              <span className="ml-3 text-sm font-medium text-slate-600">
                Loading career roles...
              </span>
            </div>
          )}

          {/* ERROR */}

          {!loading &&
            error && (
              <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
                <p className="font-semibold text-red-800">
                  Unable to load career
                  roles
                </p>

                <p className="mt-2 text-sm text-red-700">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    void loadRoles()
                  }
                  className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  Try Again
                </button>
              </div>
            )}

          {/* ROLE GRID */}

          {!loading &&
            !error && (
              <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {filteredRoles.map(
                  (role) => (
                    <RoleCard
                      key={
                        role.id
                      }
                      title={
                        role.title
                      }
                      slug={
                        role.slug
                      }
                      description={
                        role.description
                      }
                      topics={
                        role.topicCount
                      }
                      lessons={
                        role.lessonCount
                      }
                      onManage={() =>
                        navigate(
                          `/admin/roles/${role.slug}`
                        )
                      }
                    />
                  )
                )}
              </div>
            )}

          {/* EMPTY STATE */}

          {!loading &&
            !error &&
            filteredRoles.length ===
              0 && (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <BriefcaseBusiness
                  size={32}
                  className="mx-auto text-slate-300"
                />

                <h2 className="mt-4 font-semibold text-slate-800">
                  No career roles found
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {roles.length ===
                  0
                    ? 'Create your first career role to get started.'
                    : 'Try a different search term.'}
                </p>
              </div>
            )}

          {/* DATABASE STATUS */}

          <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
            <p className="text-sm font-semibold text-emerald-800">
              PostgreSQL connected
            </p>

            <p className="mt-2 text-sm leading-6 text-emerald-700">
              Career roles, topic counts
              and lesson counts on this
              page are loaded from the
              SkillForge backend and
              PostgreSQL database.
            </p>
          </div>
        </div>
      </div>

      {/* ADD ROLE MODAL */}

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between border-b border-slate-200 p-6">
              <div>
                <p className="text-sm font-semibold text-purple-600">
                  Learning Management
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-950">
                  Add Career Role
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Create a new learning
                  path in SkillForge.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeAddModal
                }
                disabled={
                  saving
                }
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={
                handleCreateRole
              }
              className="p-6"
            >
              <div>
                <label
                  htmlFor="role-title"
                  className="text-sm font-semibold text-slate-700"
                >
                  Role Name
                </label>

                <input
                  id="role-title"
                  type="text"
                  value={title}
                  onChange={(
                    event
                  ) =>
                    handleTitleChange(
                      event.target
                        .value
                    )
                  }
                  placeholder="e.g. AI Engineer"
                  maxLength={150}
                  disabled={
                    saving
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                />
              </div>

              <div className="mt-5">
                <label
                  htmlFor="role-slug"
                  className="text-sm font-semibold text-slate-700"
                >
                  Role Slug
                </label>

                <input
                  id="role-slug"
                  type="text"
                  value={slug}
                  onChange={(
                    event
                  ) =>
                    setSlug(
                      generateSlug(
                        event.target
                          .value
                      )
                    )
                  }
                  placeholder="e.g. ai-engineer"
                  maxLength={100}
                  disabled={
                    saving
                  }
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                />

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Used in SkillForge URLs.
                  It is generated
                  automatically from the
                  role name, but you can
                  edit it before creating
                  the role.
                </p>
              </div>

              <div className="mt-5">
                <label
                  htmlFor="role-description"
                  className="text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="role-description"
                  value={
                    description
                  }
                  onChange={(
                    event
                  ) =>
                    setDescription(
                      event.target
                        .value
                    )
                  }
                  placeholder="Describe what employees will learn in this career path..."
                  rows={5}
                  disabled={
                    saving
                  }
                  className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                />
              </div>

              {formError && (
                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {formError}
                </div>
              )}

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={
                    closeAddModal
                  }
                  disabled={
                    saving
                  }
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    saving
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus
                        size={17}
                      />

                      Create Role
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}


/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

interface StatCardProps {
  icon: ReactNode
  value: number
  label: string
}

function StatCard({
  icon,
  value,
  label,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          {icon}
        </div>

        <div>
          <p className="text-2xl font-bold text-slate-950">
            {value}
          </p>

          <p className="text-sm text-slate-500">
            {label}
          </p>
        </div>
      </div>
    </div>
  )
}


/*
|--------------------------------------------------------------------------
| ROLE CARD
|--------------------------------------------------------------------------
*/

interface RoleCardProps {
  title: string
  slug: string
  description: string
  topics: number
  lessons: number
  onManage: () => void
}

function RoleCard({
  title,
  slug,
  description,
  topics,
  lessons,
  onManage,
}: RoleCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-purple-200 hover:shadow-md">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
        <BriefcaseBusiness
          size={22}
        />
      </div>

      <h2 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-1 text-xs font-medium text-slate-400">
        {slug}
      </p>

      <p className="mt-3 flex-1 text-sm leading-6 text-slate-500">
        {description ||
          'No description has been added yet.'}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Metric
          value={topics}
          label="Topics"
        />

        <Metric
          value={lessons}
          label="Lessons"
        />
      </div>

      <button
        type="button"
        onClick={onManage}
        className="mt-5 flex w-full items-center justify-between rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
      >
        Manage Role

        <ArrowRight
          size={17}
        />
      </button>
    </div>
  )
}


/*
|--------------------------------------------------------------------------
| METRIC
|--------------------------------------------------------------------------
*/

interface MetricProps {
  value: number
  label: string
}

function Metric({
  value,
  label,
}: MetricProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-lg font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>
    </div>
  )
}

export default CareerRoles