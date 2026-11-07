import {
  AlertCircle,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Loader2,
  MessageCircleQuestion,
  Radio,
  RefreshCw,
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

import DashboardLayout from '../../layouts/DashboardLayout'

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

function LiveSessions() {
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
    error,
    setError,
  ] = useState('')

  /*
  |--------------------------------------------------------------------------
  | LOAD SESSIONS
  |--------------------------------------------------------------------------
  */

  const loadSessions =
    useCallback(
      async () => {
        setLoading(true)
        setError('')

        try {
          const token =
            localStorage.getItem(
              'skillforge-token'
            )

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
          setLoading(false)
        }
      },
      []
    )

  useEffect(() => {
    void loadSessions()
  }, [loadSessions])

  /*
  |--------------------------------------------------------------------------
  | SESSION GROUPS
  |--------------------------------------------------------------------------
  */

  const liveSessions =
    useMemo(
      () =>
        sessions.filter(
          (session) =>
            session.status ===
            'live'
        ),
      [sessions]
    )

  const scheduledSessions =
    useMemo(
      () =>
        sessions.filter(
          (session) =>
            session.status ===
            'scheduled'
        ),
      [sessions]
    )

  const endedSessions =
    useMemo(
      () =>
        sessions.filter(
          (session) =>
            session.status ===
            'ended'
        ),
      [sessions]
    )

  const visibleSessions =
    useMemo(
      () =>
        sessions.filter(
          (session) =>
            session.status ===
              'live' ||
            session.status ===
              'scheduled' ||
            session.status ===
              'ended'
        ),
      [sessions]
    )

  /*
  |--------------------------------------------------------------------------
  | JOIN
  |--------------------------------------------------------------------------
  */

  const handleJoinSession = (
    session: LiveSession
  ) => {
    if (
      session.status !==
      'live'
    ) {
      return
    }

    navigate(
      `/employee/live-sessions/room?sessionId=${session.id}`
    )
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="rounded-3xl bg-slate-950 p-7 text-white">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">
                  <MessageCircleQuestion
                    size={24}
                  />
                </div>

                <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Instructor Support
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  Live Doubt Solving Sessions
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                  Join role-specific live
                  sessions for roadmap topics,
                  lesson questions, practical
                  exercises and assessment
                  preparation.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  void loadSessions()
                }
                disabled={
                  loading
                }
                className="flex items-center justify-center gap-2 self-start rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
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

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <HeaderMetric
                value={
                  liveSessions.length
                }
                label="Live Now"
              />

              <HeaderMetric
                value={
                  scheduledSessions.length
                }
                label="Upcoming"
              />

              <HeaderMetric
                value={
                  endedSessions.length
                }
                label="Completed"
              />
            </div>
          </div>

          {/* ERROR */}

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

          {/* INFO */}

          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">
            <div className="flex items-start gap-3">
              <Radio
                size={19}
                className="mt-0.5 shrink-0 text-purple-600"
              />

              <div>
                <p className="text-sm font-semibold text-purple-800">
                  Admin-controlled sessions
                </p>

                <p className="mt-1 text-sm leading-6 text-purple-700">
                  Upcoming sessions become
                  joinable only after an
                  administrator starts them.
                  The scheduled time alone does
                  not open the meeting room.
                </p>
              </div>
            </div>
          </div>

          {/* CONTENT */}

          {loading ? (
            <div className="mt-7 flex min-h-[320px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <div className="text-center">
                <Loader2
                  size={32}
                  className="mx-auto animate-spin text-purple-600"
                />

                <p className="mt-3 text-sm font-medium text-slate-500">
                  Loading live sessions...
                </p>
              </div>
            </div>
          ) : visibleSessions.length ===
            0 ? (
            <div className="mt-7 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <Video
                  size={25}
                />
              </div>

              <h2 className="mt-4 text-lg font-bold text-slate-900">
                No sessions available
              </h2>

              <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                There are currently no
                scheduled or live learning
                sessions. Sessions created by
                Admin will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-7 grid gap-5 lg:grid-cols-2">
              {visibleSessions.map(
                (
                  session
                ) => (
                  <SessionCard
                    key={
                      session.id
                    }
                    session={
                      session
                    }
                    onJoin={() =>
                      handleJoinSession(
                        session
                      )
                    }
                  />
                )
              )}
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  )
}

/*
|--------------------------------------------------------------------------
| SESSION CARD
|--------------------------------------------------------------------------
*/

interface SessionCardProps {
  session: LiveSession
  onJoin: () => void
}

function SessionCard({
  session,
  onJoin,
}: SessionCardProps) {
  const isLive =
    session.status ===
    'live'

  const isScheduled =
    session.status ===
    'scheduled'

  const isEnded =
    session.status ===
    'ended'

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white shadow-sm ${
        isLive
          ? 'border-red-200'
          : 'border-slate-200'
      }`}
    >
      {isLive && (
        <div className="flex items-center gap-2 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />

          Session is live now
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
              {
                session
                  .careerRole
                  .title
              }
            </p>

            <h2 className="mt-2 text-lg font-bold text-slate-900">
              {session.title ||
                session.topic.title}
            </h2>

            <p className="mt-1 text-sm font-medium text-slate-600">
              Topic:{' '}
              {
                session.topic
                  .title
              }
            </p>
          </div>

          <StatusBadge
            status={
              session.status
            }
          />
        </div>

        {session.description && (
          <p className="mt-4 text-sm leading-6 text-slate-500">
            {
              session.description
            }
          </p>
        )}

        <div className="mt-5 grid gap-3 rounded-xl bg-slate-50 p-4 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <CalendarDays
              size={16}
              className="shrink-0 text-purple-600"
            />

            <span>
              {formatDate(
                session.scheduledDate
              )}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Clock3
              size={16}
              className="shrink-0 text-purple-600"
            />

            <span>
              {formatTime(
                session.startTime
              )}
              {' – '}
              {formatTime(
                session.endTime
              )}
            </span>
          </div>
        </div>

        <div className="mt-5">
          {isLive && (
            <button
              type="button"
              onClick={
                onJoin
              }
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              <Video
                size={17}
              />

              Join Live Session
            </button>
          )}

          {isScheduled && (
            <button
              type="button"
              disabled
              className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-500"
            >
              <Clock3
                size={17}
              />

              Waiting for Admin to Start
            </button>
          )}

          {isEnded && (
            <div className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              <CheckCircle2
                size={17}
              />

              Session Ended
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/*
|--------------------------------------------------------------------------
| STATUS
|--------------------------------------------------------------------------
*/

function StatusBadge({
  status,
}: {
  status:
    SessionStatus
}) {
  if (
    status ===
    'live'
  ) {
    return (
      <span className="shrink-0 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700">
        Live Now
      </span>
    )
  }

  if (
    status ===
    'scheduled'
  ) {
    return (
      <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
        Upcoming
      </span>
    )
  }

  if (
    status ===
    'ended'
  ) {
    return (
      <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
        Ended
      </span>
    )
  }

  if (
    status ===
    'draft'
  ) {
    return (
      <span className="shrink-0 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
        Draft
      </span>
    )
  }

  return (
    <span className="shrink-0 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
      Cancelled
    </span>
  )
}

/*
|--------------------------------------------------------------------------
| HEADER METRIC
|--------------------------------------------------------------------------
*/

function HeaderMetric({
  value,
  label,
}: {
  value: number
  label: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="text-2xl font-bold">
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

export default LiveSessions