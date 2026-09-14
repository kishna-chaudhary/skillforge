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
import { roadmapData } from '../../data/roadmapData'
import { topicQuizData } from '../../data/topicQuizData'

const lessonStorageKey =
  'skillforge_completed_lessons'

const QUIZ_DURATION_SECONDS = 10 * 60

interface IntegrityEvent {
  id: number
  type:
    | 'tab-hidden'
    | 'screen-share-stopped'
  message: string
  time: string
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
  const navigate = useNavigate()

  const {
    roleId,
    topicId,
  } = useParams()

  const topicKey =
    roleId && topicId
      ? `${roleId}/${topicId}`
      : ''

  const quiz =
    topicKey
      ? topicQuizData[topicKey]
      : undefined

  const attemptQuestions =
  useMemo(() => {
    if (!quiz) {
      return []
    }

    return shuffleArray(
      quiz.questions
    ).map(
      (question) => {
        const options =
          question.options.map(
            (
              option,
              originalIndex
            ) => ({
              option,
              isCorrect:
                originalIndex ===
                question.correctAnswer,
            })
          )

        const shuffledOptions =
          shuffleArray(options)

        return {
          ...question,

          options:
            shuffledOptions.map(
              (item) =>
                item.option
            ),

          correctAnswer:
            shuffledOptions.findIndex(
              (item) =>
                item.isCorrect
            ),
        }
      }
    )
  }, [quiz])

  const role =
    roleId
      ? roadmapData[roleId]
      : undefined

  const topic =
    role?.topics.find(
      (item) =>
        item.id === topicId
    )

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

  const hasSubmittedRef =
    useRef(false)

  // ==================================================
  // LOAD COMPLETED LESSONS
  // ==================================================

  const completedLessons =
    useMemo(() => {
      if (!topicKey) {
        return []
      }

      const saved =
        localStorage.getItem(
          lessonStorageKey
        )

      if (!saved) {
        return []
      }

      try {
        const parsed =
          JSON.parse(saved)

        if (
          parsed &&
          typeof parsed ===
            'object' &&
          !Array.isArray(parsed)
        ) {
          const savedLessons =
            parsed[topicKey]

          if (
            Array.isArray(
              savedLessons
            )
          ) {
            return savedLessons.filter(
              (
                value
              ): value is number =>
                typeof value ===
                  'number'
            )
          }
        }
      } catch {
        return []
      }

      return []
    }, [topicKey])

  const requiredLessons =
    topic?.lessons ?? 0

  const validCompletedLessons =
    useMemo(() => {
      const uniqueLessons =
        new Set(
          completedLessons.filter(
            (index) =>
              Number.isInteger(
                index
              ) &&
              index >= 0 &&
              index <
                requiredLessons
          )
        )

      return Array.from(
        uniqueLessons
      )
    }, [
      completedLessons,
      requiredLessons,
    ])

  const isQuizUnlocked =
    requiredLessons > 0 &&
    validCompletedLessons.length ===
      requiredLessons

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
  ] = useState(
    QUIZ_DURATION_SECONDS
  )

  const [
    integrityEvents,
    setIntegrityEvents,
  ] = useState<
    IntegrityEvent[]
  >([])

  // ==================================================
  // CLEAN UP MEDIA
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

  const startAssessment = () => {
    if (
      !cameraEnabled ||
      !screenEnabled
    ) {
      setMediaError(
        'Enable both camera and screen sharing before starting the assessment.'
      )

      return
    }

    setMediaError('')
    setAssessmentStarted(true)
  }

  // ==================================================
  // SUBMIT
  // ==================================================

  const submitQuiz = () => {
    if (
      !quiz ||
      !roleId ||
      !topicId ||
      hasSubmittedRef.current
    ) {
      return
    }

    hasSubmittedRef.current =
      true

    let correctAnswers = 0

    attemptQuestions.forEach(
      (
        quizQuestion,
        index
      ) => {
        if (
          answers[index] ===
          quizQuestion.correctAnswer
        ) {
          correctAnswers += 1
        }
      }
    )

    const score =
      Math.round(
        (
          correctAnswers /
          attemptQuestions.length
        ) *
          100
      )

    stopMedia()

    navigate(
      `/employee/roles/${roleId}/topics/${topicId}/quiz/result`,
      {
        state: {
          score,
          correctAnswers,
          totalQuestions:
            quiz.questions.length,
          passingScore:
            quiz.passingScore,

          integrityEvents:
            integrityEvents.length,
        },
      }
    )
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
                  () =>
                    submitQuiz(),
                  0
                )

                return 0
              }

              return (
                previous - 1
              )
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
  // INVALID QUIZ
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
                Assessment Not Found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                This topic does not
                have an assessment
                available yet.
              </p>

            </div>

          </div>

        </div>

      </DashboardLayout>
    )
  }

  // ==================================================
  // LOCKED
  // ==================================================

  if (!isQuizUnlocked) {
    const remaining =
      requiredLessons -
      validCompletedLessons.length

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
  // PRE-ASSESSMENT CHECK
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
                  Proctored Assessment
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-950">
                  {quiz.title}
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Complete the system
                  check before starting
                  your assessment for{' '}
                  {topic.title}.
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
                    title="10 Minute Timer"
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
                        Before you continue
                      </p>

                      <p className="mt-1 text-xs leading-5 text-amber-700">
                        SkillForge will
                        access your camera,
                        require screen
                        sharing and record
                        assessment
                        integrity events
                        such as the quiz
                        tab becoming
                        inactive or screen
                        sharing being
                        stopped. This
                        prototype does not
                        upload or store
                        camera or screen
                        recordings.
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
                  onClick={
                    startAssessment
                  }
                  disabled={
                    !cameraEnabled ||
                    !screenEnabled
                  }
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ShieldCheck
                    size={18}
                  />

                  Start Assessment
                </button>

              </div>

              {/* CAMERA PREVIEW */}

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
  // QUIZ
  // ==================================================

  const question =
    attemptQuestions[
      currentQuestion
    ]

  const selectedAnswer =
    answers[
      currentQuestion
    ]

  const answeredCount =
    Object.keys(
      answers
    ).length

  const isLastQuestion =
    currentQuestion ===
    attemptQuestions.length - 1

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
  // PROTECTED ASSESSMENT UI
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
        onDragStart={(event) =>
          event.preventDefault()
        }
      >

        <div className="mx-auto max-w-6xl">

          {/* TOP STATUS */}

          <div className="mb-5 flex flex-col gap-3 rounded-2xl bg-slate-950 p-4 text-white sm:flex-row sm:items-center sm:justify-between">

            <div>

              <p className="text-xs font-semibold uppercase tracking-wide text-purple-300">
                Proctored Assessment
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

            {/* QUESTION */}

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

              <div className="flex items-center justify-between">

                <span className="text-sm font-semibold text-purple-600">
                  Question{' '}
                  {currentQuestion + 1}{' '}
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
                        key={`${option}-${index}`}
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
                          {option}
                        </span>

                        {isSelected && (
                          <CheckCircle2
                            size={19}
                            className="ml-auto shrink-0 text-purple-600"
                          />
                        )}

                      </button>
                    )
                  }
                )}

              </div>

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
                    onClick={
                      submitQuiz
                    }
                    disabled={
                      selectedAnswer ===
                      undefined
                    }
                    className="flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Submit Assessment

                    <CheckCircle2
                      size={17}
                    />
                  </button>
                )}

              </div>

            </div>

            {/* PROCTOR PANEL */}

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
                      Assessment activity
                      has been logged for
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