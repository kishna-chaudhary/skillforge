
import { useCallback, useEffect, useState } from 'react'
import {
  Camera,
  Monitor,
  Play,
  RefreshCw,
  Save,
  X,
  AlertTriangle,
} from 'lucide-react'

type RecordingType = 'camera' | 'screen'
type ReviewStatus = 'pending' | 'reviewed' | 'flagged'

type Recording = {
  id: string | number
  type: RecordingType
  status: string
  bytes: string | number
  mimeType: string
  reviewStatus: ReviewStatus
  reviewNotes: string | null
}

type RecordingSession = {
  id: string | number
  status: string
  started_at: string
  completed_at: string | null
  attempt_id: string | number | null
  employee_name: string | null
  employee_email: string | null
  assessment_title: string | null
  score: string | number | null
  integrity_event_count: number | null
  passed: boolean | null
  recordings: Recording[]
}

type VideoViewer = {
  url: string
  title: string
  mimeType: string
}

const API_BASE =
  (import.meta.env.VITE_API_URL || 'http://localhost:5000')
    .replace(/\/$/, '')
    .replace(/\/api$/, '')

const RECORDING_API = `${API_BASE}/api/recordings`

// IMPORTANT: Match this to the token key used by your
// existing login/authentication code.
function getAuthToken(): string {
  return localStorage.getItem('skillforge-token') || ''
}

async function authenticatedRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken()

  if (!token) {
    throw new Error(
      'Authentication token not found. Please log in again.'
    )
  }

  const response = await fetch(
    `${RECORDING_API}${endpoint}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    }
  )

  if (!response.ok) {
    const body = await response.json().catch(() => null)

    throw new Error(
      body?.message ||
        `Request failed with status ${response.status}`
    )
  }

  return response
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—'

  const date = new Date(value)

  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleString()
}

function formatBytes(value: number | string) {
  const bytes = Number(value)

  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '0 KB'
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function statusStyle(status: string) {
  switch (status) {
    case 'completed':
    case 'reviewed':
      return 'bg-green-100 text-green-800'

    case 'flagged':
    case 'failed':
    case 'interrupted':
      return 'bg-red-100 text-red-800'

    case 'uploading':
    case 'recording':
      return 'bg-blue-100 text-blue-800'

    default:
      return 'bg-gray-100 text-gray-700'
  }
}

export default function QuizRecordings() {
  const [sessions, setSessions] = useState<
    RecordingSession[]
  >([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedRecording, setSelectedRecording] =
    useState<Recording | null>(null)

  const [selectedSession, setSelectedSession] =
    useState<RecordingSession | null>(null)

  const [reviewStatus, setReviewStatus] =
    useState<ReviewStatus>('pending')

  const [reviewNotes, setReviewNotes] = useState('')

  const [saving, setSaving] = useState(false)
  const [videoLoading, setVideoLoading] = useState(false)

  const [viewer, setViewer] =
    useState<VideoViewer | null>(null)

  const [videoError, setVideoError] = useState('')

  const [offset, setOffset] = useState(0)
  const pageSize = 30

  const loadSessions = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const response = await authenticatedRequest(
        `/admin/sessions?limit=${pageSize}&offset=${offset}`
      )

      const data = await response.json()

      setSessions(
        Array.isArray(data.sessions) ? data.sessions : []
      )
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load recordings.'
      )
    } finally {
      setLoading(false)
    }
  }, [offset])

  useEffect(() => {
    void loadSessions()
  }, [loadSessions])

  // Revoke temporary video URLs when replaced or
  // when this page unmounts.
  useEffect(() => {
    return () => {
      if (viewer?.url) {
        URL.revokeObjectURL(viewer.url)
      }
    }
  }, [viewer])

  function selectRecording(
    session: RecordingSession,
    recording: Recording
  ) {
    setSelectedSession(session)
    setSelectedRecording(recording)

    setReviewStatus(recording.reviewStatus || 'pending')
    setReviewNotes(recording.reviewNotes || '')
    setVideoError('')
  }

  async function playRecording(
    session: RecordingSession,
    recording: Recording
  ) {
    setVideoLoading(true)
    setVideoError('')
    setViewer(null)

    try {
      const response = await authenticatedRequest(
        `/admin/recordings/${recording.id}/video`
      )

      const blob = await response.blob()

      if (!blob.size) {
        throw new Error('Recording file is empty.')
      }

      const url = URL.createObjectURL(blob)

      setViewer({
        url,
        mimeType: recording.mimeType,
        title: `${
          session.employee_name ||
          session.employee_email ||
          'Employee'
        } — ${
          recording.type === 'camera'
            ? 'Webcam'
            : 'Screen'
        }`,
      })
    } catch (err) {
      setVideoError(
        err instanceof Error
          ? err.message
          : 'Unable to load video.'
      )
    } finally {
      setVideoLoading(false)
    }
  }

  async function saveReview() {
    if (!selectedRecording) return

    setSaving(true)
    setError('')

    try {
      await authenticatedRequest(
        `/admin/recordings/${selectedRecording.id}/review`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            reviewStatus,
            reviewNotes,
          }),
        }
      )

      setSessions((current) =>
        current.map((session) => ({
          ...session,
          recordings: session.recordings.map((recording) =>
            String(recording.id) ===
            String(selectedRecording.id)
              ? {
                  ...recording,
                  reviewStatus,
                  reviewNotes,
                }
              : recording
          ),
        }))
      )

      setSelectedRecording({
        ...selectedRecording,
        reviewStatus,
        reviewNotes,
      })
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to save review.'
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quiz Recordings
            </h1>

            <p className="mt-1 text-sm text-gray-600">
              Review employee webcam and screen recordings
              from submitted assessments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void loadSessions()}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={loading ? 'animate-spin' : ''}
            />
            Refresh
          </button>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {videoError && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            {videoError}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {loading ? (
            <div className="p-10 text-center text-gray-500">
              Loading recording sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No recording sessions found.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {sessions.map((session) => (
                <div
                  key={String(session.id)}
                  className={`space-y-4 p-5 ${
                    Number(session.integrity_event_count) > 1
                    ? 'border-l-4 border-red-500 bg-red-50'
                    : ''
                }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                         {session.employee_name ||
                         session.employee_email ||
                            `Employee #${session.id}`}
                        </h2>

                        {Number(session.integrity_event_count) > 1 && (
                          <div className="mt-2 flex items-center gap-2 rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-700">
                           <span>⚠️</span>
                            <span>
                            Quiz Integrity Warning — {session.integrity_event_count} events detected
                            </span>
                         </div>
                      )}

                      <p className="text-sm text-gray-500">
                        {session.employee_email}
                      </p>

                      <p className="mt-2 text-sm text-gray-700">
                        <strong>Assessment:</strong>{' '}
                        {session.assessment_title || 'Unknown'}
                      </p>

                      <p className="text-sm text-gray-700">
                        <strong>Attempt:</strong>{' '}
                        {session.attempt_id ?? 'Not linked'}
                      </p>

                      <p className="text-sm text-gray-700">
                        <strong>Started:</strong>{' '}
                        {formatDate(session.started_at)}
                      </p>

                      <p className="text-sm text-gray-700">
                        <strong>Score:</strong>{' '}
                        {session.score ?? '—'}
                        {' · '}
                        {session.passed === null
                          ? 'Result pending'
                          : session.passed
                            ? 'Passed'
                            : 'Failed'}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(
                        session.status
                      )}`}
                    >
                      {session.status}
                    </span>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {session.recordings.map((recording) => (
                      <div
                        key={String(recording.id)}
                        className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="mb-3 flex items-center gap-2">
                          {recording.type === 'camera' ? (
                            <Camera size={20} />
                          ) : (
                            <Monitor size={20} />
                          )}

                          <h3 className="font-medium capitalize">
                            {recording.type} recording
                          </h3>
                        </div>

                        <p className="text-sm text-gray-600">
                          File: {formatBytes(recording.bytes)}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          Recording status:{' '}
                          <span className="font-medium">
                            {recording.status}
                          </span>
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          Review status:{' '}
                          <span className="font-medium">
                            {recording.reviewStatus}
                          </span>
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              void playRecording(
                                session,
                                recording
                              )
                            }
                            disabled={
                              videoLoading ||
                              Number(recording.bytes) <= 0
                            }
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                          >
                            <Play size={15} />
                            Play Video
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              selectRecording(
                                session,
                                recording
                              )
                            }
                            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                          >
                            Review
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            disabled={offset === 0 || loading}
            onClick={() =>
              setOffset((current) =>
                Math.max(0, current - pageSize)
              )
            }
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {Math.floor(offset / pageSize) + 1}
          </span>

          <button
            type="button"
            disabled={loading || sessions.length < pageSize}
            onClick={() =>
              setOffset((current) => current + pageSize)
            }
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>

        {selectedRecording && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
            role="presentation"
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Review recording"
              className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Review {selectedRecording.type} Recording
                </h2>

                <button
                  type="button"
                  aria-label="Close review"
                  onClick={() => {
                    setSelectedRecording(null)
                    setSelectedSession(null)
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <p className="mb-4 text-sm text-gray-600">
                {selectedSession?.employee_name ||
                  selectedSession?.employee_email ||
                  'Employee'}
              </p>

              <label
                htmlFor="review-status"
                className="mb-2 block text-sm font-medium"
              >
                Review status
              </label>

              <select
                id="review-status"
                value={reviewStatus}
                onChange={(event) =>
                  setReviewStatus(
                    event.target.value as ReviewStatus
                  )
                }
                className="mb-4 w-full rounded-lg border border-gray-300 p-3"
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="flagged">Flagged</option>
              </select>

              {reviewStatus === 'flagged' && (
                <p className="mb-3 flex items-center gap-2 text-sm text-red-700">
                  <AlertTriangle size={16} />
                  Flagged recordings require follow-up.
                </p>
              )}

              <label
                htmlFor="review-notes"
                className="mb-2 block text-sm font-medium"
              >
                Administrator notes
              </label>

              <textarea
                id="review-notes"
                value={reviewNotes}
                maxLength={5000}
                onChange={(event) =>
                  setReviewNotes(event.target.value)
                }
                rows={5}
                placeholder="Add observations about this recording..."
                className="w-full rounded-lg border border-gray-300 p-3"
              />

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedRecording(null)
                    setSelectedSession(null)
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={() => void saveReview()}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white disabled:opacity-50"
                >
                  <Save size={16} />
                  {saving ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </div>
          </div>
        )}

        {viewer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Recording video player"
              className="w-full max-w-5xl rounded-xl bg-gray-950 p-4 text-white"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="font-semibold">
                  {viewer.title}
                </h2>

                <button
                  type="button"
                  aria-label="Close video"
                  onClick={() => setViewer(null)}
                  className="rounded-lg p-2 hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>

              <video
                key={viewer.url}
                controls
                autoPlay
                playsInline
                preload="metadata"
                className="max-h-[75vh] w-full rounded-lg bg-black"
              >
                <source
                  src={viewer.url}
                  type={viewer.mimeType}
                />

                Your browser cannot play this video format.
              </video>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
