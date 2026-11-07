
const API = 'http://localhost:5000/api/recordings'

type RecordingType = 'camera' | 'screen'

type RecorderEntry = {
  recorder: MediaRecorder
  queue: Promise<void>
  index: number
  error: Error | null
  stopped: Promise<void>
}

function getToken() {
  const token = localStorage.getItem('skillforge-token')

  if (!token) {
    throw new Error('Authentication required')
  }

  return token
}

async function apiRequest(
  path: string,
  options: RequestInit = {}
) {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${getToken()}`,
      ...(options.headers || {}),
    },
  })

  if (!response.ok) {
    const data = await response.json().catch(() => null)

    throw new Error(
      data?.message || `Recording request failed (${response.status})`
    )
  }

  return response.json()
}

function supportedMimeType(): string {
  if (typeof MediaRecorder === 'undefined') {
    throw new Error('This browser does not support video recording')
  }

  const candidates = [
    'video/webm;codecs=vp8',
    'video/webm',
    'video/mp4',
  ]

  const supported = candidates.find((type) =>
    MediaRecorder.isTypeSupported(type)
  )

  if (!supported) {
    throw new Error('No supported video recording format found')
  }

  return supported
}

function serverMimeType(type: string) {
  return type.startsWith('video/mp4')
    ? 'video/mp4'
    : 'video/webm'
}

export class QuizRecordingSession {
  readonly sessionId: string

  private entries: Record<RecordingType, RecorderEntry>

  private constructor(
    sessionId: string,
    entries: Record<RecordingType, RecorderEntry>
  ) {
    this.sessionId = sessionId
    this.entries = entries
  }

  static async start({
    roleSlug,
    topicSlug,
    cameraStream,
    screenStream,
  }: {
    roleSlug: string
    topicSlug: string
    cameraStream: MediaStream
    screenStream: MediaStream
  }) {
    const mimeType = supportedMimeType()

    const result = await apiRequest('/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        roleSlug,
        topicSlug,
        consent: true,
        mimeTypes: {
          camera: serverMimeType(mimeType),
          screen: serverMimeType(mimeType),
        },
      }),
    })

    const sessionId = String(result.sessionId)

    const makeEntry = (
      type: RecordingType,
      stream: MediaStream
    ): RecorderEntry => {
      const recorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond:
          type === 'screen' ? 900000 : 400000,
      })

      let resolveStopped!: () => void

      const stopped = new Promise<void>((resolve) => {
        resolveStopped = resolve
      })

      const entry: RecorderEntry = {
        recorder,
        queue: Promise.resolve(),
        index: 0,
        error: null,
        stopped,
      }

      recorder.ondataavailable = (event) => {
        if (!event.data.size) return

        const blob = event.data
        const index = entry.index++

        entry.queue = entry.queue
          .then(async () => {
            const bytes = await blob.arrayBuffer()

            await apiRequest(
              `/sessions/${sessionId}/${type}/chunks?index=${index}`,
              {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/octet-stream',
                },
                body: bytes,
              }
            )
          })
          .catch((error) => {
            entry.error =
              error instanceof Error
                ? error
                : new Error('Recording upload failed')

            throw entry.error
          })

        // Avoid an unhandled rejection while retaining
        // the error for finalization.
        void entry.queue.catch(() => {})
      }

      recorder.onerror = () => {
        entry.error = new Error(`${type} recording failed`)
      }

      recorder.onstop = resolveStopped

      return entry
    }

    const entries = {
      camera: makeEntry('camera', cameraStream),
      screen: makeEntry('screen', screenStream),
    }

    const session = new QuizRecordingSession(sessionId, entries)

    try {
      entries.camera.recorder.start(3000)
      entries.screen.recorder.start(3000)
    } catch (error) {
      for (const entry of Object.values(entries)) {
        if (entry.recorder.state !== 'inactive') {
          entry.recorder.stop()
        }
      }

      throw error
    }

    return session
  }

  async finish() {
    const types: RecordingType[] = ['camera', 'screen']

    for (const type of types) {
      const entry = this.entries[type]

      if (entry.recorder.state !== 'inactive') {
        entry.recorder.stop()
      }
    }

    await Promise.all(
      types.map((type) => this.entries[type].stopped)
    )

    await Promise.all(
      types.map(async (type) => {
        const entry = this.entries[type]

        await entry.queue

        if (entry.error) {
          throw entry.error
        }

        await apiRequest(
          `/sessions/${this.sessionId}/${type}/complete`,
          {
            method: 'POST',
          }
        )
      })
    )
  }

  async linkAttempt(attemptId: string) {
    return apiRequest(
      `/sessions/${this.sessionId}/link-attempt`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ attemptId }),
      }
    )
  }
}
