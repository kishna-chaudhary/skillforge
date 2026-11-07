import {
  useEffect,
  useState,
} from 'react'

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Code2,
  Eye,
  FlaskConical,
  Loader2,
  LockKeyhole,
  Play,
  Send,
  Terminal,
  Trophy,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'


// ============================================================
// TYPES
// ============================================================

interface VisibleTest {
  input: string
  output: string
}

interface PracticalChallenge {
  id: string
  title: string
  description: string | null
  instructions: string[]
  starterCode: string | null
  language: string
  visibleTests: VisibleTest[]
  passingScore: number
  durationMinutes: number | null
  passed: boolean
}

interface CareerRole {
  id: string
  slug: string
  title: string
}

interface ChallengeProgress {
  totalTopics: number
  completedTopics: number
  remainingTopics: number
  unlocked: boolean
}

interface PracticalChallengeResponse {
  success: boolean
  role: CareerRole
  progress: ChallengeProgress
  practicalChallenge: PracticalChallenge
}

interface SubmissionAttempt {
  id: string
  practicalChallengeId: string
  roleSlug: string
  score: number | null
  passed: boolean
  executionStatus: string
  startedAt: string | null
  submittedAt: string
}

interface LatestAttemptResponse {
  success: boolean
  attempt: SubmissionAttempt | null
}

interface SubmissionResponse {
  success: boolean
  message: string
  attempt: SubmissionAttempt
}

interface ErrorResponse {
  success?: boolean
  message?: string
}


// ============================================================
// API
// ============================================================

const API_BASE_URL =
  'http://localhost:5000/api'


// ============================================================
// COMPONENT
// ============================================================

function FinalPracticalChallenge() {
  const navigate =
    useNavigate()

  const {
    roleId,
  } = useParams<{
    roleId: string
  }>()

  // ----------------------------------------------------------
  // Challenge data
  // ----------------------------------------------------------

  const [
    challengeResponse,
    setChallengeResponse,
  ] =
    useState<
      PracticalChallengeResponse | null
    >(null)

  const [
    isLoading,
    setIsLoading,
  ] =
    useState(true)

  const [
    loadError,
    setLoadError,
  ] =
    useState('')

  // ----------------------------------------------------------
  // Editor
  // ----------------------------------------------------------

  const [
    code,
    setCode,
  ] =
    useState('')

  const [
    hasRun,
    setHasRun,
  ] =
    useState(false)

  // ----------------------------------------------------------
  // Submission
  // ----------------------------------------------------------

  const [
    isSubmitting,
    setIsSubmitting,
  ] =
    useState(false)

  const [
    submissionAttempt,
    setSubmissionAttempt,
  ] =
    useState<
      SubmissionAttempt | null
    >(null)

  const [
    submissionMessage,
    setSubmissionMessage,
  ] =
    useState('')

  const [
    submissionError,
    setSubmissionError,
  ] =
    useState('')


  // ==========================================================
  // LOAD CHALLENGE + LATEST ATTEMPT
  // ==========================================================

  useEffect(() => {
    let cancelled = false

    async function loadPage() {
      if (!roleId) {
        setLoadError(
          'Career role was not provided.'
        )

        setIsLoading(false)

        return
      }

      setIsLoading(true)
      setLoadError('')
      setChallengeResponse(null)
      setSubmissionAttempt(null)
      setSubmissionMessage('')
      setSubmissionError('')

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

        // ------------------------------------------------------
        // Load challenge + eligibility
        // ------------------------------------------------------

        const challengeRequest =
          await fetch(
            `${API_BASE_URL}/practical-challenges/${encodeURIComponent(
              roleId
            )}`,
            {
              method: 'GET',

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        const challengeData =
          (await challengeRequest.json()) as
            | PracticalChallengeResponse
            | ErrorResponse

        if (!challengeRequest.ok) {
         const errorMessage =
            'message' in challengeData
              ? challengeData.message
              : undefined

          throw new Error(
            errorMessage ||
              'Failed to load practical challenge.'
          )
        }

        if (
          !('practicalChallenge' in challengeData) ||
          !('progress' in challengeData) ||
          !('role' in challengeData)
        ) {
          throw new Error(
            'The practical challenge response was invalid.'
          )
        }

        if (cancelled) {
          return
        }

        const loadedChallenge =
          challengeData as PracticalChallengeResponse

        setChallengeResponse(
          loadedChallenge
        )

        setCode(
          loadedChallenge
            .practicalChallenge
            .starterCode ?? ''
        )

        setHasRun(false)

        // ------------------------------------------------------
        // Load latest attempt
        // ------------------------------------------------------

        const attemptRequest =
          await fetch(
            `${API_BASE_URL}/practical-challenges/${encodeURIComponent(
              roleId
            )}/attempts/latest`,
            {
              method: 'GET',

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        const attemptData =
          (await attemptRequest.json()) as
            | LatestAttemptResponse
            | ErrorResponse

        if (!attemptRequest.ok) {
          throw new Error(
            'message' in attemptData &&
              attemptData.message
             ? attemptData.message
             : 'Failed to load latest practical challenge attempt.'
          )
        }

        if (
          !('attempt' in attemptData)
        ) {
          throw new Error(
            'The latest attempt response was invalid.'
          )
        }

        if (cancelled) {
          return
        }

        setSubmissionAttempt(
          attemptData.attempt
        )

        if (attemptData.attempt) {
          setSubmissionMessage(
            'Your latest practical challenge submission was loaded.'
          )
        }
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(
          'Failed to load practical challenge page:',
          error
        )

        setLoadError(
          error instanceof Error
            ? error.message
            : 'Failed to load practical challenge.'
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadPage()

    return () => {
      cancelled = true
    }
  }, [roleId])


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const handleBackToRoadmap =
    () => {
      if (roleId) {
        navigate(
          `/employee/roles/${roleId}`
        )

        return
      }

      navigate(
        '/employee/roles'
      )
    }


  // ==========================================================
  // RUN CODE
  //
  // Does not execute arbitrary user code.
  // ==========================================================

  const handleRunCode =
    () => {
      setHasRun(true)
      setSubmissionError('')
    }


  // ==========================================================
  // SUBMIT
  // ==========================================================

  const handleSubmit =
    async () => {
      if (isSubmitting) {
        return
      }

      setSubmissionMessage('')
      setSubmissionError('')

      if (!roleId) {
        setSubmissionError(
          'Career role was not provided.'
        )

        return
      }

      if (!code.trim()) {
        setSubmissionError(
          'Please enter your solution before submitting.'
        )

        return
      }

      const token =
        localStorage.getItem(
          'skillforge-token'
        )

      if (!token) {
        setSubmissionError(
          'Your login session was not found. Please sign in again.'
        )

        return
      }

      setIsSubmitting(true)

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/practical-challenges/${encodeURIComponent(
              roleId
            )}/submit`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  code,
                }),
            }
          )

        const data =
          (await response.json()) as
            | SubmissionResponse
            | ErrorResponse

        if (!response.ok) {
          throw new Error(
            data.message ||
              'Failed to submit practical challenge.'
          )
        }

        if (
          !('attempt' in data) ||
          !data.attempt
        ) {
          throw new Error(
            'The submission response was invalid.'
          )
        }

        setSubmissionAttempt(
          data.attempt
        )

        setSubmissionMessage(
          data.message ||
            'Practical challenge submission received.'
        )

        setHasRun(true)
      } catch (error) {
        console.error(
          'Failed to submit practical challenge:',
          error
        )

        setSubmissionError(
          error instanceof Error
            ? error.message
            : 'Failed to submit practical challenge.'
        )
      } finally {
        setIsSubmitting(false)
      }
    }


  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">

            <button
              type="button"
              onClick={
                handleBackToRoadmap
              }
              className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-purple-600"
            >
              <ArrowLeft size={17} />

              Back to Roadmap
            </button>

            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600" />

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                Loading Practical Challenge
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Checking your progress,
                challenge eligibility,
                and latest submission.
              </p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (
    loadError ||
    !challengeResponse
  ) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">

            <button
              type="button"
              onClick={
                handleBackToRoadmap
              }
              className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-purple-600"
            >
              <ArrowLeft size={17} />

              Back to Roadmap
            </button>

            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
              <AlertCircle
                size={36}
                className="mx-auto text-red-500"
              />

              <h1 className="mt-4 text-2xl font-bold text-slate-900">
                Practical Challenge Not Available
              </h1>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                {loadError ||
                  'The practical challenge could not be loaded.'}
              </p>

              <button
                type="button"
                onClick={
                  handleBackToRoadmap
                }
                className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Back to Roadmap
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }


  // ==========================================================
  // DATA
  // ==========================================================

  const {
    role,
    progress,
    practicalChallenge:
      challenge,
  } = challengeResponse


  // ==========================================================
  // LOCKED
  // ==========================================================

  if (!progress.unlocked) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">

            <button
              type="button"
              onClick={
                handleBackToRoadmap
              }
              className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-purple-600"
            >
              <ArrowLeft size={17} />

              Back to Roadmap
            </button>

            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                <LockKeyhole
                  size={28}
                />
              </div>

              <h1 className="mt-5 text-2xl font-bold text-slate-900">
                Practical Challenge Locked
              </h1>

              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
                Complete all topics
                and pass every topic
                assessment in the{' '}
                {role.title}{' '}
                roadmap before
                attempting the final
                practical challenge.
              </p>

              <div className="mx-auto mt-6 max-w-md rounded-xl border border-slate-200 bg-slate-50 p-5">

                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-slate-600">
                    Topics passed
                  </span>

                  <span className="font-bold text-slate-900">
                    {
                      progress.completedTopics
                    }
                    /
                    {
                      progress.totalTopics
                    }
                  </span>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-purple-600 transition-all"
                    style={{
                      width:
                        progress.totalTopics >
                        0
                          ? `${Math.min(
                              100,
                              Math.round(
                                (progress.completedTopics /
                                  progress.totalTopics) *
                                  100
                              )
                            )}%`
                          : '0%',
                    }}
                  />
                </div>

                <p className="mt-3 text-xs text-slate-500">
                  {
                    progress.remainingTopics
                  }{' '}

                  {progress.remainingTopics ===
                  1
                    ? 'topic remains'
                    : 'topics remain'}{' '}

                  before this challenge
                  unlocks.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  handleBackToRoadmap
                }
                className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Return to Roadmap
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }


  // ==========================================================
  // UNLOCKED
  // ==========================================================

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">

          <button
            type="button"
            onClick={
              handleBackToRoadmap
            }
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-purple-600"
          >
            <ArrowLeft size={17} />

            Back to Roadmap
          </button>


          {/* HEADER */}

          <div className="rounded-2xl bg-slate-900 p-7 text-white">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <div className="flex flex-wrap items-center gap-2">

                  <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
                    Final Practical Challenge
                  </span>

                  {challenge.passed ||
                  (submissionAttempt?.executionStatus === 'completed' &&
                    submissionAttempt.passed) ? (
                    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-semibold text-green-300">
                      Passed
                    </span>
                  ) : submissionAttempt?.executionStatus === 'completed' ? (
                    <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-semibold text-red-300">
                      Not Passed
                    </span>
                  ) : submissionAttempt ? (
                    <span className="rounded-full bg-amber-500/20 px-3 py-1 text-xs font-semibold text-amber-300">
                      {submissionAttempt.executionStatus === 'pending'
                        ? 'Pending Evaluation'
                        : submissionAttempt.executionStatus}
                    </span>
                  ) : (
                    <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
                      Unlocked
                    </span>
                  )}
                </div>

                <h1 className="mt-4 text-3xl font-bold">
                  {
                    challenge.title
                  }
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                  {
                    challenge.description
                  }
                </p>
              </div>


              <div className="flex flex-wrap gap-3 text-xs">

                <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3">
                  <Code2
                    size={16}
                    className="text-purple-400"
                  />

                  {
                    challenge.language
                  }
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3">
                  <Clock3
                    size={16}
                    className="text-purple-400"
                  />

                  {challenge.durationMinutes !==
                  null
                    ? `${challenge.durationMinutes} minutes`
                    : 'No time limit'}
                </div>

                <div className="flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-3">
                  <Trophy
                    size={16}
                    className="text-purple-400"
                  />

                  {
                    challenge.passingScore
                  }
                  % passing
                </div>
              </div>
            </div>
          </div>


          {/* PASSED */}

          {challenge.passed && (
            <div className="mt-6 flex gap-3 rounded-2xl border border-green-200 bg-green-50 p-4">
              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-green-600"
              />

              <div>
                <h2 className="text-sm font-semibold text-green-900">
                  Challenge passed
                </h2>

                <p className="mt-1 text-sm leading-6 text-green-700">
                  Your account already
                  has a passing attempt
                  recorded for this
                  practical challenge.
                </p>
              </div>
            </div>
          )}


          {/* LATEST ATTEMPT RESULT */}

          {submissionAttempt && (
            <div
             className={`mt-6 flex gap-3 rounded-2xl border p-4 ${
                submissionAttempt.executionStatus === 'completed'
                 ? submissionAttempt.passed
                    ? 'border-green-200 bg-green-50'
                    : 'border-red-200 bg-red-50'
                  : submissionAttempt.executionStatus === 'failed'
                   ? 'border-red-200 bg-red-50'
                    : 'border-amber-200 bg-amber-50'
             }`}
            >
              {submissionAttempt.executionStatus === 'completed' &&
              submissionAttempt.passed ? (
                <CheckCircle2
                 size={20}
                  className="mt-0.5 shrink-0 text-green-600"
                />
              ) : (
               <AlertCircle
                 size={20}
                  className={`mt-0.5 shrink-0 ${
                    submissionAttempt.executionStatus === 'completed' ||
                    submissionAttempt.executionStatus === 'failed'
                      ? 'text-red-600'
                     : 'text-amber-600'
                  }`}
                />
              )}

              <div>
               <h2
                  className={`text-sm font-semibold ${
                    submissionAttempt.executionStatus === 'completed' &&
                   submissionAttempt.passed
                     ? 'text-green-900'
                      : submissionAttempt.executionStatus === 'completed' ||
                         submissionAttempt.executionStatus === 'failed'
                       ? 'text-red-900'
                        : 'text-amber-900'
                  }`}
                >
                  {submissionAttempt.executionStatus === 'completed'
                   ? submissionAttempt.passed
                      ? 'Practical challenge passed'
                      : 'Practical challenge not passed'
                   : submissionAttempt.executionStatus === 'failed'
                      ? 'Evaluation failed'
                     : 'Evaluation in progress'}
                </h2>

               <p
                  className={`mt-1 text-sm leading-6 ${
                    submissionAttempt.executionStatus === 'completed' &&
                    submissionAttempt.passed
                     ? 'text-green-700'
                      : submissionAttempt.executionStatus === 'completed' ||
                         submissionAttempt.executionStatus === 'failed'
                        ? 'text-red-700'
                        : 'text-amber-700'
                 }`}
                >
                  {submissionAttempt.executionStatus === 'completed'
                    ? submissionAttempt.score !== null
                      ? `Your latest score is ${submissionAttempt.score}%. ${
                          submissionAttempt.passed
                            ? 'You achieved the required passing score.'
                            : `You need ${challenge.passingScore}% to pass. Update your solution and try again.`
                        }`
                      : 'Your submission has been evaluated.'
                    : submissionAttempt.executionStatus === 'failed'
                      ? 'The evaluator could not process this submission. You can update your solution and submit again.'
                      : 'Your submission is waiting to be evaluated.'}
                </p>
              </div>
            </div>
          )}


         

          {/* WORKSPACE */}

          <div className="mt-6 grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">

            {/* LEFT */}

            <div className="space-y-6">

              {/* INSTRUCTIONS */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-2">
                  <Terminal
                    size={19}
                    className="text-purple-600"
                  />

                  <h2 className="text-lg font-bold text-slate-900">
                    Challenge Instructions
                  </h2>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Complete the
                  requirements below.
                  Your final solution
                  will be evaluated
                  against visible and
                  hidden tests by the
                  secure runner.
                </p>

                <div className="mt-5 space-y-3">
                  {challenge.instructions
                    .length > 0 ? (
                    challenge.instructions.map(
                      (
                        instruction,
                        index
                      ) => (
                        <div
                          key={`${instruction}-${index}`}
                          className="flex gap-3"
                        >
                          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                            {
                              index +
                              1
                            }
                          </div>

                          <p className="text-sm leading-6 text-slate-600">
                            {
                              instruction
                            }
                          </p>
                        </div>
                      )
                    )
                  ) : (
                    <p className="text-sm text-slate-500">
                      No additional
                      instructions were
                      provided.
                    </p>
                  )}
                </div>
              </section>


              {/* TEST EXAMPLES */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-2">
                  <Eye
                    size={19}
                    className="text-purple-600"
                  />

                  <h2 className="text-lg font-bold text-slate-900">
                    Visible Test Examples
                  </h2>
                </div>

                {challenge.visibleTests
                  .length > 0 ? (
                  <div className="mt-5 space-y-4">
                    {challenge.visibleTests.map(
                      (
                        example,
                        index
                      ) => (
                        <div
                          key={`${example.input}-${index}`}
                          className="overflow-hidden rounded-xl border border-slate-200"
                        >
                          <div className="border-b border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600">
                            Example{' '}
                            {
                              index +
                              1
                            }
                          </div>

                          <div className="space-y-3 p-4 text-xs">

                            <div>
                              <p className="font-semibold uppercase tracking-wide text-slate-400">
                                Input
                              </p>

                              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-3 text-slate-200">
                                {
                                  example.input
                                }
                              </pre>
                            </div>

                            <div>
                              <p className="font-semibold uppercase tracking-wide text-slate-400">
                                Expected Output
                              </p>

                              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-900 p-3 text-slate-200">
                                {
                                  example.output
                                }
                              </pre>
                            </div>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-slate-500">
                    No visible test
                    examples have been
                    configured.
                  </p>
                )}
              </section>
            </div>


            {/* RIGHT */}

            <div className="space-y-6">

              {/* EDITOR */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-5 py-3">

                  <div className="flex items-center gap-2">
                    <Code2
                      size={18}
                      className="text-purple-600"
                    />

                    <span className="text-sm font-semibold text-slate-800">
                      Code Editor
                    </span>
                  </div>

                  <span className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                    {
                      challenge.language
                    }
                  </span>
                </div>

                <textarea
                  value={code}
                  onChange={(
                    event
                  ) => {
                    setCode(
                      event.target.value
                    )

                    setHasRun(false)
                    setSubmissionError('')
                    setSubmissionMessage('')
                  }}
                  spellCheck={false}
                  disabled={
                    isSubmitting
                  }
                  className="min-h-[500px] w-full resize-y bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-100 outline-none disabled:cursor-not-allowed disabled:opacity-80"
                />

                <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-4 sm:flex-row sm:justify-end">

                  <button
                    type="button"
                    onClick={
                      handleRunCode
                    }
                    disabled={
                      isSubmitting
                    }
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Play size={17} />

                    Run Code
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      void handleSubmit()
                    }}
                    disabled={
                      isSubmitting ||
                      !code.trim()
                    }
                    className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-purple-300"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />

                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send size={17} />

                        Submit Challenge
                      </>
                    )}
                  </button>
                </div>
              </section>


              {/* RESULTS */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-2">
                  <FlaskConical
                    size={19}
                    className="text-purple-600"
                  />

                  <h2 className="text-lg font-bold text-slate-900">
                    Test Results
                  </h2>
                </div>


                {submissionError && (
                  <div className="mt-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
                    <AlertCircle
                      size={19}
                      className="mt-0.5 shrink-0 text-red-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-red-900">
                        Submission failed
                      </p>

                      <p className="mt-1 text-sm leading-6 text-red-700">
                        {
                          submissionError
                        }
                      </p>
                    </div>
                  </div>
                )}


                {submissionAttempt && (
                  <div className="mt-5 rounded-xl border border-purple-200 bg-purple-50 p-5">

                    <div className="flex gap-3">
                      <CheckCircle2
                        size={20}
                        className="mt-0.5 shrink-0 text-purple-600"
                      />

                      <div>
                        <p className="text-sm font-semibold text-purple-900">
                          Submission stored
                        </p>

                        <p className="mt-1 text-sm leading-6 text-purple-700">
                          {submissionMessage ||
                            'Your latest submission is stored in PostgreSQL.'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">

                      <div className="rounded-lg bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Attempt ID
                        </p>

                        <p className="mt-1 break-all font-mono text-sm font-semibold text-slate-800">
                          {
                            submissionAttempt.id
                          }
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Status
                        </p>

                        <p className="mt-1 text-sm font-semibold capitalize text-amber-600">
                          {
                            submissionAttempt.executionStatus
                          }
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Score
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {submissionAttempt.score ===
                          null
                            ? 'Pending evaluation'
                            : `${submissionAttempt.score}%`}
                        </p>
                      </div>

                      <div className="rounded-lg bg-white p-3">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Result
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {submissionAttempt.executionStatus ===
                          'pending'
                            ? 'Pending evaluation'
                            : submissionAttempt.passed
                              ? 'Passed'
                              : 'Not passed'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}


                {!submissionAttempt &&
                  !submissionError &&
                  !hasRun && (
                    <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                      <Play
                        size={28}
                        className="mx-auto text-slate-400"
                      />

                      <p className="mt-3 text-sm font-medium text-slate-700">
                        No tests run yet
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Use Run Code to
                        prepare your
                        solution for
                        testing.
                      </p>
                    </div>
                  )}


                {!submissionAttempt &&
                  !submissionError &&
                  hasRun && (
                    <div className="mt-5 flex gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">

                      <AlertCircle
                        size={19}
                        className="mt-0.5 shrink-0 text-blue-600"
                      />

                      <div>
                        <p className="text-sm font-semibold text-blue-900">
                          Code runner pending
                        </p>

                        <p className="mt-1 text-sm leading-6 text-blue-700">
                          Run Code does not
                          execute arbitrary
                          student code yet.
                          The secure isolated
                          runner will be
                          connected next.
                        </p>
                      </div>
                    </div>
                  )}
              </section>


              {/* ROLE PROGRESS */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <h2 className="text-lg font-bold text-slate-900">
                  Role Progress
                </h2>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Topics
                    </p>

                    <p className="mt-2 text-xl font-bold text-slate-900">
                      {
                        progress.completedTopics
                      }
                      /
                      {
                        progress.totalTopics
                      }
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Challenge
                    </p>

                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {challenge.passed
                        ? 'Passed'
                        : submissionAttempt
                          ? submissionAttempt.executionStatus ===
                            'pending'
                            ? 'Pending evaluation'
                            : submissionAttempt.executionStatus
                          : 'Not passed'}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Required Score
                    </p>

                    <p className="mt-2 text-xl font-bold text-slate-900">
                      {
                        challenge.passingScore
                      }
                      %
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default FinalPracticalChallenge
