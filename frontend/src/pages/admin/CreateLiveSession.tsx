import {
  AlertCircle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Save,
  Video,
} from 'lucide-react'

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'

const API_URL =
  'http://localhost:5000'

interface CareerRole {
  id: number
  slug: string
  title: string
  description?: string | null
}

interface Topic {
  id: number
  slug: string
  title: string
  description?: string | null
  duration?: string | null
  position?: number
  lessonCount?: number
}

interface RolesResponse {
  success: boolean
  roles?: CareerRole[]
  message?: string
}

interface TopicsResponse {
  success: boolean
  role?: CareerRole
  topics?: Topic[]
  message?: string
}

interface CreateSessionResponse {
  success: boolean
  message?: string
  session?: {
    id: number
  }
}

function CreateLiveSession() {
  const navigate =
    useNavigate()

  const [
    roles,
    setRoles,
  ] = useState<
    CareerRole[]
  >([])

  const [
    topics,
    setTopics,
  ] = useState<
    Topic[]
  >([])

  const [
    roleId,
    setRoleId,
  ] = useState('')

  const [
    topicId,
    setTopicId,
  ] = useState('')

  const [
    date,
    setDate,
  ] = useState('')

  const [
    startTime,
    setStartTime,
  ] = useState('')

  const [
    endTime,
    setEndTime,
  ] = useState('')

  const [
    loadingRoles,
    setLoadingRoles,
  ] = useState(true)

  const [
    loadingTopics,
    setLoadingTopics,
  ] = useState(false)

  const [
    submitting,
    setSubmitting,
  ] = useState<
    'draft' |
    'scheduled' |
    null
  >(null)

  const [
    error,
    setError,
  ] = useState('')

  const [
    success,
    setSuccess,
  ] = useState('')

  /*
  |--------------------------------------------------------------------------
  | AUTH
  |--------------------------------------------------------------------------
  */

  const getToken = () =>
    localStorage.getItem(
      'skillforge-token'
    )

  /*
  |--------------------------------------------------------------------------
  | SELECTED ROLE / TOPIC
  |--------------------------------------------------------------------------
  */

  const selectedRole =
    useMemo(
      () =>
        roles.find(
          (role) =>
            String(role.id) ===
            roleId
        ),
      [
        roles,
        roleId,
      ]
    )

  const selectedTopic =
    useMemo(
      () =>
        topics.find(
          (topic) =>
            String(topic.id) ===
            topicId
        ),
      [
        topics,
        topicId,
      ]
    )

  /*
  |--------------------------------------------------------------------------
  | LOAD TOPICS
  |--------------------------------------------------------------------------
  */

  const loadTopics =
    async (
      role: CareerRole
    ) => {
      try {
        setLoadingTopics(true)
        setTopics([])
        setTopicId('')
        setError('')

        const token =
          getToken()

        if (!token) {
          throw new Error(
            'Your login session was not found. Please sign in again.'
          )
        }

        const response =
          await fetch(
            `${API_URL}/api/career-roles/${encodeURIComponent(
              role.slug
            )}/topics`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        const data =
          await response.json() as TopicsResponse

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              'Unable to load roadmap topics.'
          )
        }

        const loadedTopics =
          data.topics ?? []

        setTopics(
          loadedTopics
        )

        if (
          loadedTopics.length >
          0
        ) {
          setTopicId(
            String(
              loadedTopics[0]
                .id
            )
          )
        }
      } catch (
        loadError
      ) {
        setTopics([])
        setTopicId('')

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load roadmap topics.'
        )
      } finally {
        setLoadingTopics(false)
      }
    }

  /*
  |--------------------------------------------------------------------------
  | LOAD ROLES
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true

    const loadRoles =
      async () => {
        try {
          setLoadingRoles(
            true
          )

          setError('')

          const token =
            getToken()

          if (!token) {
            throw new Error(
              'Your login session was not found. Please sign in again.'
            )
          }

          const response =
            await fetch(
              `${API_URL}/api/career-roles`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            )

          const data =
            await response.json() as RolesResponse

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                'Unable to load career roles.'
            )
          }

          const loadedRoles =
            data.roles ?? []

          if (!mounted) {
            return
          }

          setRoles(
            loadedRoles
          )

          if (
            loadedRoles.length >
            0
          ) {
            const firstRole =
              loadedRoles[0]

            setRoleId(
              String(
                firstRole.id
              )
            )

            await loadTopics(
              firstRole
            )
          }
        } catch (
          loadError
        ) {
          if (!mounted) {
            return
          }

          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load career roles.'
          )
        } finally {
          if (mounted) {
            setLoadingRoles(
              false
            )
          }
        }
      }

    void loadRoles()

    return () => {
      mounted = false
    }
  }, [])

  /*
  |--------------------------------------------------------------------------
  | ROLE CHANGE
  |--------------------------------------------------------------------------
  */

  const handleRoleChange =
    async (
      nextRoleId: string
    ) => {
      setRoleId(
        nextRoleId
      )

      setTopics([])
      setTopicId('')
      setError('')
      setSuccess('')

      const nextRole =
        roles.find(
          (role) =>
            String(
              role.id
            ) ===
            nextRoleId
        )

      if (!nextRole) {
        return
      }

      await loadTopics(
        nextRole
      )
    }

  /*
  |--------------------------------------------------------------------------
  | VALIDATION
  |--------------------------------------------------------------------------
  */

  const validateForm =
    () => {
      if (!roleId) {
        return 'Please select a career role.'
      }

      if (!topicId) {
        return 'Please select a roadmap topic.'
      }

      if (!date) {
        return 'Please select the session date.'
      }

      if (!startTime) {
        return 'Please select the start time.'
      }

      if (!endTime) {
        return 'Please select the end time.'
      }

      if (
        endTime <=
        startTime
      ) {
        return 'End time must be later than start time.'
      }

      return ''
    }

  /*
  |--------------------------------------------------------------------------
  | CREATE SESSION
  |--------------------------------------------------------------------------
  */

  const createSession =
    async (
      status:
        | 'draft'
        | 'scheduled'
    ) => {
      if (submitting) {
        return
      }

      setError('')
      setSuccess('')

      const validationError =
        validateForm()

      if (
        validationError
      ) {
        setError(
          validationError
        )

        return
      }

      if (
        !selectedRole ||
        !selectedTopic
      ) {
        setError(
          'Please select a valid career role and roadmap topic.'
        )

        return
      }

      const token =
        getToken()

      if (!token) {
        setError(
          'Your login session was not found. Please sign in again.'
        )

        return
      }

      try {
        setSubmitting(
          status
        )

        const response =
          await fetch(
            `${API_URL}/api/admin/live-sessions`,
            {
              method:
                'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  careerRoleId:
                    selectedRole.id,

                  topicId:
                    selectedTopic.id,

                  title:
                    `${selectedTopic.title} Doubt Solving Session`,

                  description:
                    selectedTopic.description ||
                    `Live doubt solving session for ${selectedTopic.title}.`,

                  scheduledDate:
                    date,

                  startTime,

                  endTime,

                  status,
                }),
            }
          )

        const data =
          await response.json() as CreateSessionResponse

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              'Unable to create live session.'
          )
        }

        setSuccess(
          data.message ||
            (
              status ===
              'draft'
                ? 'Session draft saved successfully.'
                : 'Session published successfully.'
            )
        )

        window.setTimeout(
          () => {
            navigate(
              '/admin/live-sessions'
            )
          },
          600
        )
      } catch (
        submitError
      ) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : 'Unable to create live session.'
        )
      } finally {
        setSubmitting(null)
      }
    }

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loadingRoles) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
          <div className="mx-auto flex min-h-[500px] max-w-5xl items-center justify-center">
            <div className="text-center">
              <Loader2
                size={34}
                className="mx-auto animate-spin text-purple-600"
              />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading career roles...
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-5xl">

          {/* Back */}

          <button
            type="button"
            onClick={() =>
              navigate(
                '/admin/live-sessions'
              )
            }
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-purple-600"
          >
            <ArrowLeft
              size={17}
            />

            Back to Live Sessions
          </button>

          {/* Header */}

          <div className="mt-6">
            <p className="text-sm font-semibold text-purple-600">
              Live Session Management
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              Create Live Session
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Schedule a role-specific learning
              session. Publishing creates an
              upcoming session. It becomes live
              only when an administrator starts
              it.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertCircle
                size={19}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm font-medium">
                {error}
              </p>
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="mt-6 flex items-start gap-3 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
              <CheckCircle2
                size={19}
                className="mt-0.5 shrink-0"
              />

              <p className="text-sm font-medium">
                {success}
              </p>
            </div>
          )}

          {/* Session Details */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Video
                  size={21}
                />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Session Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure the career role,
                  roadmap topic and session
                  schedule.
                </p>
              </div>
            </div>

            {roles.length ===
            0 ? (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                No active career roles are
                available.
              </div>
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2">

                {/* Role */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Career Role
                  </label>

                  <select
                    value={
                      roleId
                    }
                    onChange={(
                      event
                    ) => {
                      void handleRoleChange(
                        event.target
                          .value
                      )
                    }}
                    disabled={
                      loadingTopics
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  >
                    {roles.map(
                      (role) => (
                        <option
                          key={
                            role.id
                          }
                          value={
                            role.id
                          }
                        >
                          {
                            role.title
                          }
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Topic */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Roadmap Topic
                  </label>

                  <select
                    value={
                      topicId
                    }
                    onChange={(
                      event
                    ) => {
                      setTopicId(
                        event.target
                          .value
                      )

                      setError('')
                      setSuccess('')
                    }}
                    disabled={
                      loadingTopics ||
                      topics.length ===
                        0
                    }
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  >
                    {loadingTopics ? (
                      <option value="">
                        Loading topics...
                      </option>
                    ) : topics.length ===
                      0 ? (
                      <option value="">
                        No topics available
                      </option>
                    ) : (
                      topics.map(
                        (topic) => (
                          <option
                            key={
                              topic.id
                            }
                            value={
                              topic.id
                            }
                          >
                            {
                              topic.title
                            }
                          </option>
                        )
                      )
                    )}
                  </select>
                </div>

                {/* Date */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Session Date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="date"
                      value={date}
                      onChange={(
                        event
                      ) => {
                        setDate(
                          event.target
                            .value
                        )

                        setError('')
                        setSuccess('')
                      }}
                      className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>

                {/* Start */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Start Time
                  </label>

                  <div className="relative">
                    <Clock3
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="time"
                      value={
                        startTime
                      }
                      onChange={(
                        event
                      ) => {
                        setStartTime(
                          event.target
                            .value
                        )

                        setError('')
                        setSuccess('')
                      }}
                      className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>

                {/* End */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    End Time
                  </label>

                  <div className="relative">
                    <Clock3
                      size={17}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      type="time"
                      value={
                        endTime
                      }
                      onChange={(
                        event
                      ) => {
                        setEndTime(
                          event.target
                            .value
                        )

                        setError('')
                        setSuccess('')
                      }}
                      className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Preview */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-900">
              Session Preview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review the session before saving
              or publishing it.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-950 p-6 text-white">
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-300">
                {selectedRole?.title ??
                  'Career Role'}
              </p>

              <h3 className="mt-2 text-xl font-bold">
                {selectedTopic
                  ? `${selectedTopic.title} Doubt Solving Session`
                  : 'Select a roadmap topic'}
              </h3>

              {selectedTopic
                ?.description && (
                <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                  {
                    selectedTopic.description
                  }
                </p>
              )}

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-2">
                  <CalendarDays
                    size={16}
                  />

                  {date ||
                    'Select date'}
                </span>

                <span className="flex items-center gap-2">
                  <Clock3
                    size={16}
                  />

                  {startTime ||
                    '--:--'}

                  {' – '}

                  {endTime ||
                    '--:--'}
                </span>
              </div>
            </div>
          </div>

          {/* Workflow */}

          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">
            <p className="text-sm font-semibold text-purple-800">
              Admin-controlled live session
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              Publishing creates a Scheduled
              session. Employees can see it but
              cannot enter until an administrator
              explicitly starts the session.
            </p>
          </div>

          {/* Actions */}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() =>
                navigate(
                  '/admin/live-sessions'
                )
              }
              disabled={
                Boolean(
                  submitting
                )
              }
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() =>
                void createSession(
                  'draft'
                )
              }
              disabled={
                Boolean(
                  submitting
                ) ||
                loadingTopics ||
                !selectedTopic
              }
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ===
              'draft' ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Save
                  size={16}
                />
              )}

              {submitting ===
              'draft'
                ? 'Saving...'
                : 'Save Draft'}
            </button>

            <button
              type="button"
              onClick={() =>
                void createSession(
                  'scheduled'
                )
              }
              disabled={
                Boolean(
                  submitting
                ) ||
                loadingTopics ||
                !selectedTopic
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ===
              'scheduled' ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Video
                  size={16}
                />
              )}

              {submitting ===
              'scheduled'
                ? 'Publishing...'
                : 'Publish Session'}
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CreateLiveSession