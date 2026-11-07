import {
  AlertTriangle,
  Camera,
  CameraOff,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  LockKeyhole,
  Monitor,
  MonitorOff,
  ShieldCheck,
  Video,
} from 'lucide-react'

import { QuizRecordingSession } from '../../utils/quizRecording'

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'

interface IntegrityEvent {
  id: number
  type:
    | 'tab-hidden'
    | 'screen-share-stopped'
  message: string
  time: string
}

interface AssessmentOption {
  id: string
  text: string
  position: number
}

interface AssessmentQuestion {
  id: string
  question: string
  position: number
  options: AssessmentOption[]
}

interface AssessmentData {
  id: string
  title: string
  description: string | null
  passingScore: number
  durationMinutes: number
  questions: AssessmentQuestion[]
}

interface AssessmentApiResponse {
  success: boolean

  role: {
    id: string
    slug: string
    title: string
  }

  topic: {
    id: string
    slug: string
    title: string
    lessonCount: number
  }

  assessment: AssessmentData
}

interface AssessmentSubmitResponse {
  success: boolean

  result: {
    attemptId: string
    score: number
    correctAnswers: number
    totalQuestions: number
    passingScore: number
    passed: boolean
    integrityEventCount: number
    submittedAt: string
  }

  message?: string
}

interface LessonProgressResponse {
  success: boolean
  completedLessons?: number[]
  message?: string
}

function shuffleArray<T>(
  items: T[]
): T[] {
  const shuffled = [...items]

  for (
    let index = shuffled.length - 1;
    index > 0;
    index--
  ) {
    const randomIndex =
      Math.floor(
        Math.random() *
          (index + 1)
      )

    const temporary =
      shuffled[index]

    shuffled[index] =
      shuffled[randomIndex]

    shuffled[randomIndex] =
      temporary
  }

  return shuffled
}

function Quiz() {
  const navigate =
    useNavigate()

  const {
    roleId,
    topicId,
  } = useParams()

  // ==================================================
  // ASSESSMENT DATA
  // ==================================================

  const [
    assessmentData,
    setAssessmentData,
  ] =
    useState<AssessmentApiResponse | null>(
      null
    )

  const [
    isLoadingAssessment,
    setIsLoadingAssessment,
  ] = useState(true)

  const [
    assessmentLoadError,
    setAssessmentLoadError,
  ] = useState('')

  useEffect(() => {
    if (!roleId || !topicId) {
      setIsLoadingAssessment(false)
      return
    }

    let cancelled = false

    const loadAssessment =
      async () => {
        setIsLoadingAssessment(
          true
        )

        setAssessmentLoadError(
          ''
        )

        try {
          const token =
            localStorage.getItem(
              'skillforge-token'
            )

          if (!token) {
            throw new Error(
              'Authentication required.'
            )
          }

          const response =
            await fetch(
              `http://localhost:5000/api/assessments/${encodeURIComponent(
                roleId
              )}/topics/${encodeURIComponent(
                topicId
              )}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            )

          const data =
            await response.json()

          if (!response.ok) {
            throw new Error(
              data.message ||
                'Failed to load assessment.'
            )
          }

          if (!cancelled) {
            setAssessmentData(
              data as AssessmentApiResponse
            )
          }
        } catch (error) {
          if (!cancelled) {
            setAssessmentLoadError(
              error instanceof Error
                ? error.message
                : 'Failed to load assessment.'
            )
          }
        } finally {
          if (!cancelled) {
            setIsLoadingAssessment(
              false
            )
          }
        }
      }

    void loadAssessment()

    return () => {
      cancelled = true
    }
  }, [roleId, topicId])

  const quiz =
    assessmentData?.assessment

  const role =
    assessmentData?.role

  const topic =
    assessmentData?.topic

  // ==================================================
  // LESSON PROGRESS FROM POSTGRESQL
  // ==================================================

  const [
    completedLessons,
    setCompletedLessons,
  ] = useState<number[]>([])

  const [
    isLoadingProgress,
    setIsLoadingProgress,
  ] = useState(true)

  const [
    progressLoadError,
    setProgressLoadError,
  ] = useState('')

  useEffect(() => {
    if (!roleId || !topicId) {
      setCompletedLessons([])
      setIsLoadingProgress(false)
      return
    }

    let cancelled = false

    const loadLessonProgress =
      async () => {
        setIsLoadingProgress(
          true
        )

        setProgressLoadError(
          ''
        )

        try {
          const token =
            localStorage.getItem(
              'skillforge-token'
            )

          if (!token) {
            throw new Error(
              'Authentication required.'
            )
          }

          const response =
            await fetch(
              `http://localhost:5000/api/progress/lessons/${encodeURIComponent(
                roleId
              )}/${encodeURIComponent(
                topicId
              )}`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            )

          const data =
            (await response.json()) as LessonProgressResponse

          if (!response.ok) {
            throw new Error(
              data.message ||
                'Failed to load lesson progress.'
            )
          }

          if (cancelled) {
            return
          }

          const lessons =
            Array.isArray(
              data.completedLessons
            )
              ? data.completedLessons.filter(
                  (
                    value
                  ): value is number =>
                    typeof value ===
                      'number' &&
                    Number.isInteger(
                      value
                    )
                )
              : []

          setCompletedLessons(
            lessons
          )
        } catch (error) {
          if (!cancelled) {
            setCompletedLessons(
              []
            )

            setProgressLoadError(
              error instanceof Error
                ? error.message
                : 'Failed to load lesson progress.'
            )
          }
        } finally {
          if (!cancelled) {
            setIsLoadingProgress(
              false
            )
          }
        }
      }

    void loadLessonProgress()

    return () => {
      cancelled = true
    }
  }, [roleId, topicId])

  const requiredLessons =
    topic?.lessonCount ?? 0

  const validCompletedLessons =
  useMemo(() => {
    const uniqueLessons =
      new Set(
        completedLessons.filter(
          (lessonId) =>
            Number.isInteger(
              lessonId
            ) &&
            lessonId > 0
        )
      )

    return Array.from(
      uniqueLessons
    )
  }, [
    completedLessons,
  ])



  const isQuizUnlocked =
    requiredLessons > 0 &&
    validCompletedLessons.length ===
      requiredLessons

  // ==================================================
  // SHUFFLED QUESTIONS
  // ==================================================

  const attemptQuestions =
    useMemo(() => {
      if (!quiz) {
        return []
      }

      return shuffleArray(
        quiz.questions
      ).map(
        (question) => ({
          ...question,

          options:
            shuffleArray(
              question.options
            ),
        })
      )
    }, [quiz])

  // ==================================================
  // MEDIA REFERENCES
  // ==================================================

  const cameraVideoRef =
    useRef<HTMLVideoElement | null>(
      null
    )

  const cameraStreamRef =
    useRef<MediaStream | null>(
      null
    )

  const screenStreamRef =
    useRef<MediaStream | null>(
      null
    )

  const recordingSessionRef =
  useRef<QuizRecordingSession | null>(null)

const recordingStartingRef = useRef(false)

const [recordingStarting, setRecordingStarting] =
  useState(false)

const [recordingError, setRecordingError] =
  useState('')

  const hasSubmittedRef =
    useRef(false)

  // ==================================================
  // ASSESSMENT STATE
  // ==================================================

  const [
    assessmentStarted,
    setAssessmentStarted,
  ] = useState(false)

  const [
    cameraEnabled,
    setCameraEnabled,
  ] = useState(false)

  const [
    screenEnabled,
    setScreenEnabled,
  ] = useState(false)

  const [
    mediaError,
    setMediaError,
  ] = useState('')

  const [
    currentQuestion,
    setCurrentQuestion,
  ] = useState(0)

  const [
    answers,
    setAnswers,
  ] = useState<
    Record<number, number>
  >({})

  const [
    remainingSeconds,
    setRemainingSeconds,
  ] = useState(0)

  const [
    integrityEvents,
    setIntegrityEvents,
  ] =
    useState<IntegrityEvent[]>(
      []
    )

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  const [
    submitError,
    setSubmitError,
  ] = useState('')

  const [
    startedAt,
    setStartedAt,
  ] =
    useState<string | null>(
      null
    )

  useEffect(() => {
    if (
      quiz &&
      !assessmentStarted
    ) {
      setRemainingSeconds(
        quiz.durationMinutes *
          60
      )
    }
  }, [
    quiz,
    assessmentStarted,
  ])

  // ==================================================
  // MEDIA CLEANUP
  // ==================================================

  const stopMedia = () => {
    cameraStreamRef.current
      ?.getTracks()
      .forEach((track) =>
        track.stop()
      )

    screenStreamRef.current
      ?.getTracks()
      .forEach((track) =>
        track.stop()
      )

    cameraStreamRef.current =
      null

    screenStreamRef.current =
      null
  }

  useEffect(() => {
    return () => {
      stopMedia()
    }
  }, [])

  // ==================================================
  // CAMERA
  // ==================================================

  const enableCamera =
    async () => {
      setMediaError('')

      try {
        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: true,
              audio: false,
            }
          )

        cameraStreamRef.current =
          stream

        if (
          cameraVideoRef.current
        ) {
          cameraVideoRef.current.srcObject =
            stream
        }

        setCameraEnabled(true)
      } catch {
        setCameraEnabled(false)

        setMediaError(
          'Camera permission is required before starting this assessment.'
        )
      }
    }

  // ==================================================
  // INTEGRITY EVENTS
  // ==================================================

  const addIntegrityEvent = (
    type:
      IntegrityEvent['type'],
    message: string
  ) => {
    setIntegrityEvents(
      (previous) => [
        ...previous,
        {
          id:
            Date.now() +
            Math.random(),
          type,
          message,
          time:
            new Date().toLocaleTimeString(),
        },
      ]
    )
  }

  // ==================================================
  // SCREEN SHARE
  // ==================================================

  const enableScreenShare =
    async () => {
      setMediaError('')

      try {
        const stream =
          await navigator.mediaDevices.getDisplayMedia(
            {
              video: true,
              audio: false,
            }
          )

        screenStreamRef.current =
          stream

        setScreenEnabled(true)

        const videoTrack =
          stream.getVideoTracks()[0]

        if (videoTrack) {
          videoTrack.onended =
            () => {
              setScreenEnabled(
                false
              )

              if (
                assessmentStarted &&
                !hasSubmittedRef.current
              ) {
                addIntegrityEvent(
                  'screen-share-stopped',
                  'Screen sharing was stopped during the assessment.'
                )
              }
            }
        }
      } catch {
        setScreenEnabled(false)

        setMediaError(
          'Screen sharing is required before starting this assessment.'
        )
      }
    }

  // ==================================================
  // CAMERA PREVIEW
  // ==================================================

  useEffect(() => {
    if (
      cameraVideoRef.current &&
      cameraStreamRef.current
    ) {
      cameraVideoRef.current.srcObject =
        cameraStreamRef.current
    }
  }, [
    assessmentStarted,
    cameraEnabled,
  ])

  // ==================================================
  // TAB MONITORING
  // ==================================================

  useEffect(() => {
    if (!assessmentStarted) {
      return
    }

    const handleVisibilityChange =
      () => {
        if (
          document.hidden &&
          !hasSubmittedRef.current
        ) {
          addIntegrityEvent(
            'tab-hidden',
            'Assessment tab became inactive.'
          )
        }
      }

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    )

    return () => {
      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      )
    }
  }, [assessmentStarted])

  // ==================================================
  // START ASSESSMENT
  // ==================================================

 const startAssessment = async () => {
  if (recordingStartingRef.current) return

  if (!cameraEnabled || !screenEnabled) {
    setMediaError(
      'Enable both camera and screen sharing before starting.'
    )
    return
  }

  const cameraStream = cameraStreamRef.current
  const screenStream = screenStreamRef.current

  if (
    !cameraStream?.getVideoTracks().some(
      (track) => track.readyState === 'live'
    ) ||
    !screenStream?.getVideoTracks().some(
      (track) => track.readyState === 'live'
    )
  ) {
    setMediaError(
      'Camera and screen sharing must remain active.'
    )
    return
  }

  if (
    !assessmentData?.role?.slug ||
    !assessmentData?.topic?.slug
  ) {
    setMediaError('Assessment information is missing.')
    return
  }

  recordingStartingRef.current = true
  setRecordingStarting(true)
  setMediaError('')
  setRecordingError('')

  try {
    const session = await QuizRecordingSession.start({
      roleSlug: assessmentData.role.slug,
      topicSlug: assessmentData.topic.slug,
      cameraStream,
      screenStream,
    })

    recordingSessionRef.current = session

    setStartedAt(new Date().toISOString())
    setAssessmentStarted(true)
  } catch (error) {
    setMediaError(
      error instanceof Error
        ? error.message
        : 'Unable to start recording.'
    )
  } finally {
    recordingStartingRef.current = false
    setRecordingStarting(false)
  }
}

  // ==================================================
  // SUBMIT ASSESSMENT
  // ==================================================

  const submitQuiz =
    async () => {
      if (
        !quiz ||
        !roleId ||
        !topicId ||
        hasSubmittedRef.current ||
        isSubmitting
      ) {
        return
      }

      setIsSubmitting(true)
      setSubmitError('')

      try {
        const token =
          localStorage.getItem(
            'skillforge-token'
          )

        if (!token) {
          throw new Error(
            'Authentication required.'
          )
        }

        const submittedAnswers =
          attemptQuestions.map(
            (
              question,
              index
            ) => {
              const selectedIndex =
                answers[index]

              return {
                questionId:
                  question.id,

                selectedOptionId:
                  selectedIndex ===
                  undefined
                    ? null
                    : question
                        .options[
                        selectedIndex
                      ].id,
              }
            }
          )

        const response =
          await fetch(
            `http://localhost:5000/api/assessments/${encodeURIComponent(
              roleId
            )}/topics/${encodeURIComponent(
              topicId
            )}/submit`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify(
                {
                  answers:
                    submittedAnswers,

                  integrityEventCount:
                    integrityEvents.length,

                  startedAt,
                }
              ),
            }
          )

        const data =
          (await response.json()) as AssessmentSubmitResponse

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Failed to submit assessment.'
          )
        }

        hasSubmittedRef.current = true

        const session = recordingSessionRef.current

        if (session) {
          try {
            await session.finish()
          } catch (error) {
            console.error('Recording finalization failed:', error)

            setRecordingError(
              'The quiz was submitted, but one or more recordings could not be fully uploaded.'
            )
          }

          try {
           await session.linkAttempt(String(data.result.attemptId))
          } catch (error) {
            console.error('Recording linking failed:', error)

            setRecordingError(
              'The quiz was submitted, but its recording could not be linked to the attempt.'
            )
          }
        }

        stopMedia()

        navigate(
          `/employee/roles/${roleId}/topics/${topicId}/quiz/result`,
          {
            state: {
              score:
                data.result.score,

              correctAnswers:
                data.result
                  .correctAnswers,

              totalQuestions:
                data.result
                  .totalQuestions,

              passingScore:
                data.result
                  .passingScore,

              passed:
                data.result.passed,

              attemptId:
                data.result
                  .attemptId,

              integrityEvents:
                data.result
                  .integrityEventCount,
            },
          }
        )
      } catch (error) {
        setSubmitError(
          error instanceof Error
            ? error.message
            : 'Failed to submit assessment.'
        )
      } finally {
        setIsSubmitting(false)
      }
    }

  // ==================================================
  // TIMER
  // ==================================================

  useEffect(() => {
    if (
      !assessmentStarted ||
      hasSubmittedRef.current
    ) {
      return
    }

    const interval =
      window.setInterval(
        () => {
          setRemainingSeconds(
            (previous) => {
              if (
                previous <= 1
              ) {
                window.clearInterval(
                  interval
                )

                window.setTimeout(
                  () => {
                    void submitQuiz()
                  },
                  0
                )

                return 0
              }

              return previous - 1
            }
          )
        },
        1000
      )

    return () => {
      window.clearInterval(
        interval
      )
    }
  }, [assessmentStarted])

  // ==================================================
  // LOADING ASSESSMENT
  // ==================================================

  if (isLoadingAssessment) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Loading assessment...
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ==================================================
  // INVALID ASSESSMENT
  // ==================================================

  if (
    !roleId ||
    !topicId ||
    !role ||
    !topic ||
    !quiz
  ) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <h1 className="text-2xl font-bold text-slate-900">
                Assessment Not
                Found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                {assessmentLoadError ||
                  'This topic does not have an assessment available yet.'}
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ==================================================
  // CHECKING LESSON PROGRESS
  // ==================================================

  if (isLoadingProgress) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <p className="text-sm font-medium text-slate-500">
                Checking lesson
                progress...
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (progressLoadError) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
              <h1 className="text-xl font-bold text-slate-900">
                Unable to Check
                Lesson Progress
              </h1>

              <p className="mt-2 text-sm text-red-600">
                {progressLoadError}
              </p>

              <button
                onClick={() =>
                  navigate(
                    `/employee/roles/${roleId}/topics/${topicId}`
                  )
                }
                className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Back to Topic
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ==================================================
  // LOCKED ASSESSMENT
  // ==================================================

  if (!isQuizUnlocked) {
    const remaining =
      Math.max(
        0,
        requiredLessons -
          validCompletedLessons.length
      )

    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">
            <button
              onClick={() =>
                navigate(
                  `/employee/roles/${roleId}/topics/${topicId}`
                )
              }
              className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600"
            >
              <ChevronLeft
                size={17}
              />

              Back to Topic
            </button>

            <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <LockKeyhole
                  size={30}
                />
              </div>

              <h1 className="mt-5 text-2xl font-bold text-slate-900">
                Assessment Locked
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                Complete all lessons
                in{' '}
                <span className="font-semibold text-slate-700">
                  {topic.title}
                </span>{' '}
                before attempting
                this assessment.
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-xl bg-purple-50 p-4">
                <p className="text-sm font-semibold text-purple-700">
                  {
                    validCompletedLessons.length
                  }{' '}
                  of{' '}
                  {requiredLessons}{' '}
                  lessons completed
                </p>

                <p className="mt-1 text-xs text-purple-600">
                  {remaining}{' '}
                  lesson
                  {remaining === 1
                    ? ''
                    : 's'}{' '}
                  remaining
                </p>
              </div>

              <button
                onClick={() =>
                  navigate(
                    `/employee/roles/${roleId}/topics/${topicId}`
                  )
                }
                className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Continue Learning
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ==================================================
  // PRE-ASSESSMENT SYSTEM CHECK
  // ==================================================

  if (!assessmentStarted) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-5xl">
            <button
              onClick={() => {
                stopMedia()

                navigate(
                  `/employee/roles/${roleId}/topics/${topicId}`
                )
              }}
              className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600"
            >
              <ChevronLeft
                size={17}
              />

              Back to Topic
            </button>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                  <ShieldCheck
                    size={24}
                  />
                </div>

                <p className="mt-5 text-sm font-semibold text-purple-600">
                  Proctored
                  Assessment
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-950">
                  {quiz.title}
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Complete the
                  system check
                  before starting
                  your assessment
                  for {topic.title}.
                </p>

                <div className="mt-7 space-y-4">
                  <Requirement
                    icon={
                      <Camera
                        size={20}
                      />
                    }
                    title="Camera"
                    description="Your camera must remain enabled during the assessment."
                    complete={
                      cameraEnabled
                    }
                  />

                  <Requirement
                    icon={
                      <Monitor
                        size={20}
                      />
                    }
                    title="Screen Sharing"
                    description="Share your screen before beginning the assessment."
                    complete={
                      screenEnabled
                    }
                  />

                  <Requirement
                    icon={
                      <Clock3
                        size={20}
                      />
                    }
                    title={`${quiz.durationMinutes} Minute Timer`}
                    description="The assessment is automatically submitted when time expires."
                    complete
                  />

                  <Requirement
                    icon={
                      <Copy
                        size={20}
                      />
                    }
                    title="Assessment Integrity"
                    description="Copying and context-menu actions are restricted inside the assessment."
                    complete
                  />
                </div>

                <div className="mt-7 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle
                      size={19}
                      className="mt-0.5 shrink-0 text-amber-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-amber-900">
                        Before you
                        continue
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-700">
                        SkillForge will
                        access your
                        camera, require
                        screen sharing,
                        and log
                        integrity events
                        such as the quiz
                        tab becoming
                        inactive or
                        screen sharing
                        being stopped.
                        SkillForge will record your webcam and shared screen throughout this assessment. The recordings will be uploaded to private storage and made available to authorized administrators for assessment integrity review. Tab changes and interruptions to screen sharing may also be logged. Start the assessment only if you consent to this recording.
                      </p>
                    </div>
                  </div>
                </div>

                {mediaError && (
                  <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    {mediaError}
                  </div>
                )}

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  <button
                    onClick={
                      enableCamera
                    }
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                      cameraEnabled
                        ? 'bg-green-50 text-green-700'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cameraEnabled ? (
                      <CheckCircle2
                        size={18}
                      />
                    ) : (
                      <Camera
                        size={18}
                      />
                    )}

                    {cameraEnabled
                      ? 'Camera Ready'
                      : 'Enable Camera'}
                  </button>

                  <button
                    onClick={
                      enableScreenShare
                    }
                    className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
                      screenEnabled
                        ? 'bg-green-50 text-green-700'
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {screenEnabled ? (
                      <CheckCircle2
                        size={18}
                      />
                    ) : (
                      <Monitor
                        size={18}
                      />
                    )}

                    {screenEnabled
                      ? 'Screen Ready'
                      : 'Share Screen'}
                  </button>
                </div>

                <button
                  onClick={startAssessment}
                  disabled={
                    !cameraEnabled ||
                    !screenEnabled ||
                    recordingStarting
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {recordingStarting
                   ? 'Starting secure recording...'
                   : 'Start Assessment'}
                  <ShieldCheck
                    size={18}
                  />

                  Start Assessment
                </button>
              </div>

              <div>
                <div className="overflow-hidden rounded-3xl bg-slate-950 shadow-sm">
                  <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                    <span className="text-sm font-semibold text-white">
                      Camera Preview
                    </span>

                    {cameraEnabled ? (
                      <Camera
                        size={17}
                        className="text-green-400"
                      />
                    ) : (
                      <CameraOff
                        size={17}
                        className="text-slate-500"
                      />
                    )}
                  </div>

                  <div className="aspect-video bg-slate-900">
                    {cameraEnabled ? (
                      <video
                        ref={
                          cameraVideoRef
                        }
                        autoPlay
                        muted
                        playsInline
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center">
                          <CameraOff
                            size={32}
                            className="mx-auto text-slate-600"
                          />

                          <p className="mt-3 text-xs text-slate-500">
                            Camera not
                            enabled
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
                  <p className="text-sm font-semibold text-slate-900">
                    System Status
                  </p>

                  <StatusRow
                    label="Camera"
                    ready={
                      cameraEnabled
                    }
                  />

                  <StatusRow
                    label="Screen sharing"
                    ready={
                      screenEnabled
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ==================================================
  // ACTIVE QUIZ
  // ==================================================

  const question =
    attemptQuestions[
      currentQuestion
    ]

  const selectedAnswer =
    answers[currentQuestion]

  const answeredCount =
    Object.keys(
      answers
    ).length

  const isLastQuestion =
    currentQuestion ===
    attemptQuestions.length -
      1

  const minutes =
    Math.floor(
      remainingSeconds / 60
    )

  const seconds =
    remainingSeconds % 60

  const selectAnswer = (
    optionIndex: number
  ) => {
    setAnswers(
      (previous) => ({
        ...previous,

        [currentQuestion]:
          optionIndex,
      })
    )
  }

  const goNext = () => {
    if (
      selectedAnswer ===
      undefined
    ) {
      return
    }

    if (!isLastQuestion) {
      setCurrentQuestion(
        (previous) =>
          previous + 1
      )
    }
  }

  // ==================================================
  // PROTECTED QUIZ UI
  // ==================================================

  return (
    <DashboardLayout>
      <div
        className="min-h-screen select-none bg-slate-100 p-5 sm:p-6"
        onCopy={(event) =>
          event.preventDefault()
        }
        onCut={(event) =>
          event.preventDefault()
        }
        onContextMenu={(
          event
        ) =>
          event.preventDefault()
        }
        onDragStart={(
          event
        ) =>
          event.preventDefault()
        }
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-slate-950 p-4 text-white sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-purple-300">
                Proctored
                Assessment
              </p>

              <p className="mt-1 font-semibold">
                {topic.title}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge
                icon={
                  cameraEnabled ? (
                    <Video
                      size={14}
                    />
                  ) : (
                    <CameraOff
                      size={14}
                    />
                  )
                }
                label={
                  cameraEnabled
                    ? 'Camera Active'
                    : 'Camera Off'
                }
                ready={
                  cameraEnabled
                }
              />

              <StatusBadge
                icon={
                  screenEnabled ? (
                    <Monitor
                      size={14}
                    />
                  ) : (
                    <MonitorOff
                      size={14}
                    />
                  )
                }
                label={
                  screenEnabled
                    ? 'Screen Shared'
                    : 'Screen Stopped'
                }
                ready={
                  screenEnabled
                }
              />

              <div className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-sm font-bold">
                <Clock3
                  size={15}
                />

                {String(
                  minutes
                ).padStart(
                  2,
                  '0'
                )}
                :
                {String(
                  seconds
                ).padStart(
                  2,
                  '0'
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-purple-600">
                  Question{' '}
                  {currentQuestion +
                    1}{' '}
                  of{' '}
                  {
                    attemptQuestions.length
                  }
                </span>

                <span className="text-xs text-slate-400">
                  {answeredCount}{' '}
                  answered
                </span>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-purple-600 transition-all"
                  style={{
                    width: `${
                      ((currentQuestion +
                        1) /
                        attemptQuestions.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              <h1 className="mt-7 text-xl font-semibold leading-8 text-slate-950">
                {
                  question.question
                }
              </h1>

              <div className="mt-7 space-y-3">
                {question.options.map(
                  (
                    option,
                    index
                  ) => {
                    const isSelected =
                      selectedAnswer ===
                      index

                    return (
                      <button
                        key={
                          option.id
                        }
                        onClick={() =>
                          selectAnswer(
                            index
                          )
                        }
                        className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                          isSelected
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-slate-200 hover:border-purple-300 hover:bg-purple-50'
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                            isSelected
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {String.fromCharCode(
                            65 +
                              index
                          )}
                        </span>

                        <span className="font-medium text-slate-700">
                          {
                            option.text
                          }
                        </span>

                        {isSelected && (
                          <CheckCircle2
                            size={
                              19
                            }
                            className="ml-auto shrink-0 text-purple-600"
                          />
                        )}
                      </button>
                    )
                  }
                )}
              </div>

              {submitError && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <div className="mt-8 flex justify-end border-t border-slate-200 pt-6">
                {!isLastQuestion ? (
                  <button
                    onClick={
                      goNext
                    }
                    disabled={
                      selectedAnswer ===
                      undefined
                    }
                    className="flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next Question

                    <ChevronRight
                      size={17}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      void submitQuiz()
                    }
                    disabled={
                      selectedAnswer ===
                        undefined ||
                      isSubmitting
                    }
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {isSubmitting
                      ? 'Submitting...'
                      : 'Submit Assessment'}

                    <CheckCircle2
                      size={17}
                    />
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="overflow-hidden rounded-2xl bg-slate-950">
                <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                  <span className="text-xs font-semibold text-white">
                    Camera
                  </span>

                  <span className="h-2 w-2 rounded-full bg-green-400" />
                </div>

                <div className="aspect-video bg-slate-900">
                  <video
                    ref={
                      cameraVideoRef
                    }
                    autoPlay
                    muted
                    playsInline
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={17}
                    className="text-purple-600"
                  />

                  <p className="text-sm font-semibold text-slate-900">
                    Integrity Status
                  </p>
                </div>

                <p className="mt-3 text-3xl font-bold text-slate-950">
                  {
                    integrityEvents.length
                  }
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  integrity event
                  {integrityEvents.length ===
                  1
                    ? ''
                    : 's'}{' '}
                  detected
                </p>

                {integrityEvents.length >
                  0 && (
                  <div className="mt-4 rounded-xl bg-amber-50 p-3">
                    <p className="text-xs font-semibold text-amber-800">
                      Assessment
                      activity has
                      been logged for
                      review.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// ==================================================
// REQUIREMENT
// ==================================================

interface RequirementProps {
  icon: React.ReactNode
  title: string
  description: string
  complete: boolean
}

function Requirement({
  icon,
  title,
  description,
  complete,
}: RequirementProps) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-slate-200 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-900">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>

      {complete && (
        <CheckCircle2
          size={19}
          className="shrink-0 text-green-600"
        />
      )}
    </div>
  )
}

// ==================================================
// STATUS ROW
// ==================================================

interface StatusRowProps {
  label: string
  ready: boolean
}

function StatusRow({
  label,
  ready,
}: StatusRowProps) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <span className="text-sm text-slate-600">
        {label}
      </span>

      <span
        className={`text-xs font-semibold ${
          ready
            ? 'text-green-600'
            : 'text-slate-400'
        }`}
      >
        {ready
          ? 'Ready'
          : 'Required'}
      </span>
    </div>
  )
}

// ==================================================
// STATUS BADGE
// ==================================================

interface StatusBadgeProps {
  icon: React.ReactNode
  label: string
  ready: boolean
}

function StatusBadge({
  icon,
  label,
  ready,
}: StatusBadgeProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold ${
        ready
          ? 'bg-green-500/10 text-green-300'
          : 'bg-red-500/10 text-red-300'
      }`}
    >
      {icon}
      {label}
    </div>
  )
}

export default Quiz