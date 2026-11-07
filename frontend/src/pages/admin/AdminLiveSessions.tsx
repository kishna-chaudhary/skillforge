import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  Plus,
  Radio,
  RefreshCw,
  Square,
  Video,
} from 'lucide-react'

import {
  useCallback,
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

type SessionStatus =
  | 'draft'
  | 'scheduled'
  | 'live'
  | 'ended'
  | 'cancelled'

interface LiveSession {
  id: number

  title: string
  description: string

  status: SessionStatus

  scheduledDate: string
  startTime: string
  endTime: string

  startedAt:
    | string
    | null

  endedAt:
    | string
    | null

  createdAt: string

  careerRole: {
    id: number
    slug: string
    title: string
  }

  topic: {
    id: number
    slug: string
    title: string
  }

  createdBy:
    | {
        id: number
        fullName: string
      }
    | null
}

interface SessionsResponse {
  success: boolean
  sessions?: LiveSession[]
  message?: string
}

interface ActionResponse {
  success: boolean
  message?: string
  session?: unknown
}

function AdminLiveSessions() {
  const navigate =
    useNavigate()

  const [
    sessions,
    setSessions,
  ] = useState<
    LiveSession[]
  >([])

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    actionId,
    setActionId,
  ] = useState<
    number | null
  >(null)

  const [
    actionType,
    setActionType,
  ] = useState<
    'start' |
    'end' |
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
  | TOKEN
  |--------------------------------------------------------------------------
  */

  const getToken = () =>
    localStorage.getItem(
      'skillforge-token'
    )

  /*
  |--------------------------------------------------------------------------
  | LOAD SESSIONS
  |--------------------------------------------------------------------------
  */

  const loadSessions =
    useCallback(
      async (
        showLoader = true
      ) => {
        if (showLoader) {
          setLoading(true)
        }

        setError('')

        try {
          const token =
            getToken()

          if (!token) {
            throw new Error(
              'Your login session was not found. Please sign in again.'
            )
          }

          const response =
            await fetch(
              `${API_URL}/api/live-sessions`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            )

          const data =
            await response.json() as SessionsResponse

          if (
            !response.ok ||
            !data.success
          ) {
            throw new Error(
              data.message ||
                'Unable to load live sessions.'
            )
          }

          setSessions(
            data.sessions ?? []
          )
        } catch (
          loadError
        ) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load live sessions.'
          )
        } finally {
          if (showLoader) {
            setLoading(false)
          }
        }
      },
      []
    )

  useEffect(() => {
    void loadSessions()
  }, [loadSessions])

  /*
  |--------------------------------------------------------------------------
  | COUNTS
  |--------------------------------------------------------------------------
  */

  const counts =
    useMemo(
      () => {
        return {
          total:
            sessions.length,

          live:
            sessions.filter(
              (session) =>
                session.status ===
                'live'
            ).length,

          scheduled:
            sessions.filter(
              (session) =>
                session.status ===
                'scheduled'
            ).length,

          draft:
            sessions.filter(
              (session) =>
                session.status ===
                'draft'
            ).length,

          ended:
            sessions.filter(
              (session) =>
                session.status ===
                'ended'
            ).length,
        }
      },
      [sessions]
    )

  /*
  |--------------------------------------------------------------------------
  | START / END
  |--------------------------------------------------------------------------
  */

  const updateSessionStatus =
    async (
      session:
        LiveSession,
      action:
        | 'start'
        | 'end'
    ) => {
      if (actionId !== null) {
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

      setError('')
      setSuccess('')
      setActionId(
        session.id
      )
      setActionType(
        action
      )

      try {
        const response =
          await fetch(
            `${API_URL}/api/admin/live-sessions/${session.id}/${action}`,
            {
              method:
                'PATCH',

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        const data =
          await response.json() as ActionResponse

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              `Unable to ${action} session.`
          )
        }

        setSuccess(
          data.message ||
            (
              action ===
              'start'
                ? 'Live session started successfully.'
                : 'Live session ended successfully.'
            )
        )

        await loadSessions(
          false
        )
      } catch (
        actionError
      ) {
        setError(
          actionError instanceof Error
            ? actionError.message
            : `Unable to ${action} session.`
        )
      } finally {
        setActionId(null)
        setActionType(null)
      }
    }

  /*
  |--------------------------------------------------------------------------
  | JOIN
  |--------------------------------------------------------------------------
  */

  const joinSession = (
    session:
      LiveSession
  ) => {
    if (
      session.status !==
      'live'
    ) {
      setError(
        'Start the session before joining the live room.'
      )

      return
    }

    navigate(
       `/admin/live-sessions/room?sessionId=${session.id}&host=1`
      )
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-600">
                Learning Management
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-950">
                Live Sessions
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Schedule, start and manage
                role-specific live learning
                sessions. Employees can enter
                only after an administrator
                starts a session.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  void loadSessions()
                }
                disabled={
                  loading ||
                  actionId !==
                    null
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw
                  size={17}
                  className={
                    loading
                      ? 'animate-spin'
                      : ''
                  }
                />

                Refresh
              </button>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/admin/live-sessions/create'
                  )
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                <Plus
                  size={17}
                />

                Create Live Session
              </button>
            </div>
          </div>

          {/* HERO */}

          <div className="mt-7 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white lg:p-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">
                  <Video
                    size={23}
                  />
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  Admin-controlled
                  Live Learning
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Scheduled time does not
                  automatically open the room.
                  The administrator explicitly
                  starts the meeting before
                  employees can join.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <HeroMetric
                  value={
                    counts.total
                  }
                  label="All Sessions"
                />

                <HeroMetric
                  value={
                    counts.live
                  }
                  label="Live Now"
                />

                <HeroMetric
                  value={
                    counts.scheduled
                  }
                  label="Scheduled"
                />

                <HeroMetric
                  value={
                    counts.ended
                  }
                  label="Ended"
                />
              </div>
            </div>
          </div>

          {/* ALERTS */}

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

          {/* SUMMARY */}

          <div className="mt-7 grid gap-4 md:grid-cols-4">
            <SummaryCard
              icon={
                <Radio
                  size={20}
                />
              }
              value={
                counts.live
              }
              title="Live Now"
              description="Sessions currently opened by Admin."
            />

            <SummaryCard
              icon={
                <CalendarDays
                  size={20}
                />
              }
              value={
                counts.scheduled
              }
              title="Scheduled"
              description="Published sessions waiting to be started."
            />

            <SummaryCard
              icon={
                <Clock3
                  size={20}
                />
              }
              value={
                counts.draft
              }
              title="Drafts"
              description="Sessions saved but not yet published."
            />

            <SummaryCard
              icon={
                <CheckCircle2
                  size={20}
                />
              }
              value={
                counts.ended
              }
              title="Completed"
              description="Sessions already ended by Admin."
            />
          </div>

          {/* SESSION LIST */}

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-3 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Session Management
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  All live-session records
                  stored in PostgreSQL.
                </p>
              </div>

              <span className="text-sm font-semibold text-slate-500">
                {sessions.length}{' '}
                {sessions.length ===
                1
                  ? 'session'
                  : 'sessions'}
              </span>
            </div>

            {loading ? (
              <div className="flex min-h-[260px] items-center justify-center">
                <div className="text-center">
                  <Loader2
                    size={30}
                    className="mx-auto animate-spin text-purple-600"
                  />

                  <p className="mt-3 text-sm font-medium text-slate-500">
                    Loading sessions...
                  </p>
                </div>
              </div>
            ) : sessions.length ===
              0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <Video
                    size={25}
                  />
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  No live sessions
                  created yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Create your first session
                  and it will appear here for
                  Admin management.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/admin/live-sessions/create'
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  <Plus
                    size={16}
                  />

                  Create Session
                </button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {sessions.map(
                  (
                    session
                  ) => (
                    <SessionRow
                      key={
                        session.id
                      }
                      session={
                        session
                      }
                      busy={
                        actionId ===
                        session.id
                      }
                      actionType={
                        actionId ===
                        session.id
                          ? actionType
                          : null
                      }
                      onStart={() =>
                        void updateSessionStatus(
                          session,
                          'start'
                        )
                      }
                      onJoin={() =>
                        joinSession(
                          session
                        )
                      }
                      onEnd={() =>
                        void updateSessionStatus(
                          session,
                          'end'
                        )
                      }
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* WORKFLOW */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="font-bold text-slate-900">
              Live Session Workflow
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              The session lifecycle is
              controlled by Admin rather
              than by the scheduled clock.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-4">
              <WorkflowCard
                number="01"
                title="Schedule"
                description="Create a session for a career role and roadmap topic."
              />

              <WorkflowCard
                number="02"
                title="Start"
                description="Admin explicitly opens the scheduled session."
              />

              <WorkflowCard
                number="03"
                title="Join"
                description="Admin and employees enter the WebRTC room while it is live."
              />

              <WorkflowCard
                number="04"
                title="End"
                description="Admin closes the session and prevents further joins."
              />
            </div>
          </div>

          {/* DATABASE NOTICE */}

          <div className="mt-7 rounded-2xl border border-green-100 bg-green-50 p-5">
            <p className="text-sm font-semibold text-green-800">
              Backend-connected
              session management
            </p>

            <p className="mt-2 text-sm leading-6 text-green-700">
              Sessions on this page are
              loaded from the SkillForge
              API and PostgreSQL. Starting
              or ending a session updates
              its authoritative server
              status.
            </p>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}

/*
|--------------------------------------------------------------------------
| SESSION ROW
|--------------------------------------------------------------------------
*/

interface SessionRowProps {
  session: LiveSession
  busy: boolean

  actionType:
    | 'start'
    | 'end'
    | null

  onStart: () => void
  onJoin: () => void
  onEnd: () => void
}

function SessionRow({
  session,
  busy,
  actionType,
  onStart,
  onJoin,
  onEnd,
}: SessionRowProps) {
  const dateLabel =
    formatDate(
      session.scheduledDate
    )

  const timeLabel =
    `${formatTime(
      session.startTime
    )} – ${formatTime(
      session.endTime
    )}`

  return (
    <div className="flex flex-col gap-5 p-5 xl:flex-row xl:items-center">

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
            {
              session
                .careerRole
                .title
            }
          </p>

          <StatusBadge
            status={
              session.status
            }
          />
        </div>

        <h3 className="mt-2 text-base font-bold text-slate-900">
          {session.title ||
            session.topic.title}
        </h3>

        <p className="mt-1 text-sm font-medium text-slate-600">
          Topic:{' '}
          {
            session.topic
              .title
          }
        </p>

        {session.description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            {
              session.description
            }
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays
              size={14}
            />

            {dateLabel}
          </span>

          <span>•</span>

          <span className="flex items-center gap-1.5">
            <Clock3
              size={14}
            />

            {timeLabel}
          </span>

          {session.createdBy && (
            <>
              <span>•</span>

              <span>
                Created by{' '}
                {
                  session
                    .createdBy
                    .fullName
                }
              </span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 xl:justify-end">

        {(session.status ===
          'scheduled' ||
          session.status ===
            'draft') && (
          <button
            type="button"
            onClick={
              onStart
            }
            disabled={
              busy
            }
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy &&
            actionType ===
              'start' ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Radio
                size={16}
              />
            )}

            {busy &&
            actionType ===
              'start'
              ? 'Starting...'
              : 'Start Session'}
          </button>
        )}

        {session.status ===
          'live' && (
          <>
            <button
              type="button"
              onClick={
                onJoin
              }
              disabled={
                busy
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Video
                size={16}
              />

              Join Session
            </button>

            <button
              type="button"
              onClick={
                onEnd
              }
              disabled={
                busy
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy &&
              actionType ===
                'end' ? (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              ) : (
                <Square
                  size={15}
                />
              )}

              {busy &&
              actionType ===
                'end'
                ? 'Ending...'
                : 'End Session'}
            </button>
          </>
        )}

        {session.status ===
          'ended' && (
          <span className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-500">
            <CheckCircle2
              size={16}
            />

            Session Ended
          </span>
        )}

        {session.status ===
          'cancelled' && (
          <span className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600">
            <Square
              size={15}
            />

            Cancelled
          </span>
        )}
      </div>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function StatusBadge({
  status,
}: {
  status:
    SessionStatus
}) {
  const styles: Record<
    SessionStatus,
    string
  > = {
    live:
      'bg-red-50 text-red-700',

    scheduled:
      'bg-blue-50 text-blue-700',

    draft:
      'bg-amber-50 text-amber-700',

    ended:
      'bg-slate-100 text-slate-600',

    cancelled:
      'bg-red-50 text-red-600',
  }

  const labels: Record<
    SessionStatus,
    string
  > = {
    live:
      'Live Now',

    scheduled:
      'Scheduled',

    draft:
      'Draft',

    ended:
      'Ended',

    cancelled:
      'Cancelled',
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {
        labels[
          status
        ]
      }
    </span>
  )
}

/*
|--------------------------------------------------------------------------
| HERO METRIC
|--------------------------------------------------------------------------
*/

interface HeroMetricProps {
  value:
    | string
    | number

  label: string
}

function HeroMetric({
  value,
  label,
}: HeroMetricProps) {
  return (
    <div className="min-w-[130px] rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
      <p className="text-2xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs font-medium text-slate-400">
        {label}
      </p>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| SUMMARY CARD
|--------------------------------------------------------------------------
*/

interface SummaryCardProps {
  icon: React.ReactNode

  value:
    | string
    | number

  title: string
  description: string
}

function SummaryCard({
  icon,
  value,
  title,
  description,
}: SummaryCardProps) {
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

/*
|--------------------------------------------------------------------------
| WORKFLOW CARD
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| FORMATTERS
|--------------------------------------------------------------------------
*/

function formatDate(
  value: string
) {
  if (!value) {
    return 'Date unavailable'
  }

  const dateOnly =
    value.includes('T')
      ? value.split('T')[0]
      : value

  const [
    year,
    month,
    day,
  ] = dateOnly
    .split('-')
    .map(Number)

  if (
    !year ||
    !month ||
    !day
  ) {
    return value
  }

  const date =
    new Date(
      year,
      month - 1,
      day
    )

  return new Intl.DateTimeFormat(
    undefined,
    {
      weekday:
        'short',
      day:
        'numeric',
      month:
        'short',
      year:
        'numeric',
    }
  ).format(date)
}

function formatTime(
  value: string
) {
  if (!value) {
    return '--:--'
  }

  const [
    hourText,
    minuteText,
  ] = value.split(':')

  const hour =
    Number(hourText)

  const minute =
    Number(minuteText)

  if (
    Number.isNaN(
      hour
    ) ||
    Number.isNaN(
      minute
    )
  ) {
    return value
  }

  const date =
    new Date()

  date.setHours(
    hour,
    minute,
    0,
    0
  )

  return new Intl.DateTimeFormat(
    undefined,
    {
      hour:
        'numeric',
      minute:
        '2-digit',
    }
  ).format(date)
}

export default AdminLiveSessions