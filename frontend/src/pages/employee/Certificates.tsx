import {
  useEffect,
  useState,
} from 'react'

import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle2,
  CircleCheckBig,
  Code2,
  Loader2,
  LockKeyhole,
  Medal,
  Target,
  Trophy,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'

// ============================================================
// TYPES
// ============================================================

interface CareerCertificate {
  roleId: string
  roleTitle: string
  totalTopics: number
  completedTopics: number
  remainingTopics: number
  topicPercentage: number
  allTopicsCompleted: boolean
  practicalPassed: boolean
  earned: boolean
}

interface CertificatesResponse {
  success: boolean
  message?: string
  certificates?: CareerCertificate[]
  earnedCount?: number
  completedRoleIds?: string[]
}

// ============================================================
// API
// ============================================================

const API_BASE_URL =
  'http://localhost:5000/api'

// ============================================================
// COMPONENT
// ============================================================

function Certificates() {
  const navigate =
    useNavigate()

  const [
    certificates,
    setCertificates,
  ] = useState<
    CareerCertificate[]
  >([])

  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState('')

  // ==========================================================
  // LOAD CERTIFICATE PROGRESS
  // ==========================================================

  useEffect(() => {
    let cancelled = false

    async function loadCertificates() {
      setIsLoading(true)
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
            `${API_BASE_URL}/progress/certificates`,
            {
              method: 'GET',

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        const data =
          (await response.json()) as
            CertificatesResponse

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              'Failed to load certificate progress.'
          )
        }

        if (
          !Array.isArray(
            data.certificates
          )
        ) {
          throw new Error(
            'The certificate progress response was invalid.'
          )
        }

        if (cancelled) {
          return
        }

        setCertificates(
          data.certificates
        )
      } catch (error) {
        if (cancelled) {
          return
        }

        console.error(
          'Failed to load certificates:',
          error
        )

        setCertificates([])

        setError(
          error instanceof Error
            ? error.message
            : 'Failed to load certificate progress.'
        )
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadCertificates()

    return () => {
      cancelled = true
    }
  }, [])

  // ==========================================================
  // DERIVED DATA
  // ==========================================================

  const earnedCertificates =
    certificates.filter(
      (certificate) =>
        certificate.earned
    )

  const inProgressCertificates =
    certificates
      .filter(
        (certificate) =>
          !certificate.earned
      )
      .sort((a, b) => {
        if (
          a.allTopicsCompleted !==
          b.allTopicsCompleted
        ) {
          return a.allTopicsCompleted
            ? -1
            : 1
        }

        if (
          b.topicPercentage !==
          a.topicPercentage
        ) {
          return (
            b.topicPercentage -
            a.topicPercentage
          )
        }

        return (
          b.completedTopics -
          a.completedTopics
        )
      })

  const startedCertificates =
    certificates.filter(
      (certificate) =>
        certificate.completedTopics >
        0
    ).length

  const practicalReadyCount =
    certificates.filter(
      (certificate) =>
        certificate.allTopicsCompleted &&
        !certificate.practicalPassed
    ).length

  const closestCertificate =
    inProgressCertificates.find(
      (certificate) =>
        certificate.completedTopics >
        0
    )

  // ==========================================================
  // LOADING
  // ==========================================================

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-7xl">
            <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
              <Loader2
                size={36}
                className="mx-auto animate-spin text-purple-600"
              />

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                Loading Certificates
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Checking your verified
                learning and practical
                challenge progress.
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

  if (error) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
              <AlertCircle
                size={36}
                className="mx-auto text-red-600"
              />

              <h1 className="mt-4 text-xl font-bold text-red-900">
                Certificates unavailable
              </h1>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-red-700">
                {error}
              </p>

              <button
                type="button"
                onClick={() => {
                  window.location.reload()
                }}
                className="mt-6 rounded-xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // ==========================================================
  // PAGE
  // ==========================================================

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-5 sm:p-6">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
                <Award size={17} />

                Career Credentials
              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Certificates
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Complete every topic,
                pass every topic
                assessment, and
                successfully complete
                the Final Practical
                Challenge to earn a
                SkillForge career
                certificate.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/employee/roles'
                )
              }
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Explore Roadmaps

              <ArrowRight
                size={16}
              />
            </button>
          </div>

          {/* HERO */}

          <div className="mt-8 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-purple-300">
                  <Trophy size={16} />

                  SkillForge Career
                  Certification
                </div>

                <h2 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
                  Turn verified learning
                  and practical skills
                  into career
                  credentials.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  Certificate eligibility
                  is verified from your
                  SkillForge account
                  progress. Every topic
                  assessment and the
                  role&apos;s Final
                  Practical Challenge
                  must be passed.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <MetricBox
                    value={
                      earnedCertificates.length
                    }
                    label="Certificates earned"
                  />

                  <MetricBox
                    value={
                      startedCertificates
                    }
                    label="Roadmaps started"
                  />

                  <MetricBox
                    value={
                      practicalReadyCount
                    }
                    label="Practical ready"
                  />

                  <MetricBox
                    value={
                      certificates.length
                    }
                    label="Career certificates"
                  />
                </div>
              </div>

              <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full border border-purple-400/20 bg-purple-500/10">
                <Medal
                  size={52}
                  className="text-purple-300"
                />
              </div>
            </div>
          </div>

          {/* CERTIFICATION RULE */}

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <RequirementCard
              number="01"
              title="Complete Topics"
              description="Work through every topic in the selected career roadmap."
            />

            <RequirementCard
              number="02"
              title="Pass Assessments"
              description="Pass each topic assessment to verify topic completion."
            />

            <RequirementCard
              number="03"
              title="Pass Practical"
              description="Complete and pass the role's Final Practical Challenge."
            />

            <RequirementCard
              number="04"
              title="Earn Certificate"
              description="Receive the career certificate after all learning and practical requirements are verified."
            />
          </div>

          {/* VERIFICATION NOTICE */}

          <div className="mt-6 rounded-2xl border border-purple-200 bg-purple-50 p-5">
            <div className="flex gap-3">
              <Code2
                size={20}
                className="mt-0.5 shrink-0 text-purple-600"
              />

              <div>
                <h3 className="text-sm font-semibold text-purple-900">
                  Backend verified
                  certification
                </h3>

                <p className="mt-1 text-sm leading-6 text-purple-700">
                  Reaching 100% topic
                  completion unlocks the
                  Final Practical
                  Challenge. Your
                  certificate is earned
                  only after a passing
                  practical challenge
                  attempt is recorded.
                </p>
              </div>
            </div>
          </div>

          {/* EARNED CERTIFICATES */}

          <div className="mt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <CircleCheckBig
                    size={20}
                    className="text-green-600"
                  />

                  <h2 className="text-xl font-bold text-slate-950">
                    Earned Certificates
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Career roadmaps where
                  the learning
                  requirements and final
                  practical assessment
                  have been verified.
                </p>
              </div>

              <span className="text-sm font-semibold text-slate-500">
                {
                  earnedCertificates.length
                }{' '}
                earned
              </span>
            </div>

            {earnedCertificates.length >
            0 ? (
              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {earnedCertificates.map(
                  (certificate) => (
                    <EarnedCertificateCard
                      key={
                        certificate.roleId
                      }
                      certificate={
                        certificate
                      }
                      onOpen={() =>
                        navigate(
                          `/employee/roles/${certificate.roleId}`
                        )
                      }
                    />
                  )
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                  <LockKeyhole
                    size={25}
                  />
                </div>

                <h3 className="mt-4 font-bold text-slate-900">
                  No certificates
                  earned yet
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  A certificate is
                  issued only after all
                  topic assessments and
                  the Final Practical
                  Challenge have been
                  successfully verified.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      '/employee/roles'
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-purple-700"
                >
                  Continue Learning

                  <ArrowRight
                    size={15}
                  />
                </button>
              </div>
            )}
          </div>

          {/* CERTIFICATE PROGRESS */}

          <div className="mt-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Target
                    size={20}
                    className="text-purple-600"
                  />

                  <h2 className="text-xl font-bold text-slate-950">
                    Certificate Progress
                  </h2>
                </div>

                <p className="mt-1 text-sm text-slate-500">
                  Track verified topic
                  completion and
                  practical challenge
                  requirements for every
                  career certificate.
                </p>
              </div>

              {closestCertificate && (
                <span className="text-sm text-slate-500">
                  Closest:{' '}

                  <span className="font-semibold text-slate-800">
                    {
                      closestCertificate.roleTitle
                    }
                  </span>
                </span>
              )}
            </div>

            {inProgressCertificates.length >
            0 ? (
              <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
                {inProgressCertificates.map(
                  (certificate) => (
                    <CertificateProgressCard
                      key={
                        certificate.roleId
                      }
                      certificate={
                        certificate
                      }
                      onOpen={() => {
                        if (
                          certificate.allTopicsCompleted
                        ) {
                          navigate(
                            `/employee/practical-challenge/${certificate.roleId}`
                          )

                          return
                        }

                        navigate(
                          `/employee/roles/${certificate.roleId}`
                        )
                      }}
                    />
                  )
                )}
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-green-200 bg-green-50 p-8 text-center">
                <CheckCircle2
                  size={32}
                  className="mx-auto text-green-600"
                />

                <h3 className="mt-4 font-bold text-green-900">
                  All available
                  certificates earned
                </h3>

                <p className="mt-2 text-sm text-green-700">
                  You have completed
                  every currently
                  available career
                  certification.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

// ============================================================
// METRIC BOX
// ============================================================

interface MetricBoxProps {
  value: number
  label: string
}

function MetricBox({
  value,
  label,
}: MetricBoxProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
      <p className="text-2xl font-bold">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {label}
      </p>
    </div>
  )
}

// ============================================================
// REQUIREMENT CARD
// ============================================================

interface RequirementCardProps {
  number: string
  title: string
  description: string
}

function RequirementCard({
  number,
  title,
  description,
}: RequirementCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white">
          {number}
        </div>

        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// CERTIFICATE PROGRESS CARD
// ============================================================

interface CertificateProgressCardProps {
  certificate: CareerCertificate
  onOpen: () => void
}

function CertificateProgressCard({
  certificate,
  onOpen,
}: CertificateProgressCardProps) {
  const practicalReady =
    certificate.allTopicsCompleted &&
    !certificate.practicalPassed

  return (
    <div
      className={`rounded-3xl border bg-white p-6 shadow-sm ${
        practicalReady
          ? 'border-purple-200'
          : 'border-slate-200'
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
              practicalReady
                ? 'bg-purple-100 text-purple-700'
                : 'bg-purple-50 text-purple-600'
            }`}
          >
            {practicalReady ? (
              <Code2 size={23} />
            ) : (
              <Award size={23} />
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Career Certificate
            </p>

            <h3 className="mt-1 truncate text-lg font-bold text-slate-900">
              {certificate.roleTitle}
            </h3>
          </div>
        </div>

        <span
          className={`rounded-full px-3 py-1.5 text-xs font-bold ${
            practicalReady
              ? 'bg-purple-100 text-purple-700'
              : 'bg-purple-50 text-purple-700'
          }`}
        >
          {
            certificate.topicPercentage
          }
          %
        </span>
      </div>

      {/* TOPIC PROGRESS */}

      <div className="mt-6">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-500">
            Verified topics
          </span>

          <span className="font-semibold text-slate-700">
            {
              certificate.completedTopics
            }
            /
            {
              certificate.totalTopics
            }
          </span>
        </div>

        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-purple-600 transition-all"
            style={{
              width:
                `${certificate.topicPercentage}%`,
            }}
          />
        </div>
      </div>

      {/* REQUIREMENT STATUS */}

      <div className="mt-5 space-y-3">
        <StatusRow
          completed={
            certificate.allTopicsCompleted
          }
          title="Topic assessments"
          description={
            certificate.allTopicsCompleted
              ? 'All topic assessments passed'
              : `${certificate.remainingTopics} topic${
                  certificate.remainingTopics ===
                  1
                    ? ''
                    : 's'
                } remaining`
          }
        />

        <StatusRow
          completed={
            certificate.practicalPassed
          }
          title="Final practical challenge"
          description={
            certificate.practicalPassed
              ? 'Practical challenge verified'
              : certificate.allTopicsCompleted
                ? 'Ready to attempt'
                : 'Locked until all topics are completed'
          }
        />
      </div>

      {practicalReady && (
        <div className="mt-5 rounded-2xl border border-purple-200 bg-purple-50 p-4">
          <div className="flex gap-3">
            <Trophy
              size={19}
              className="mt-0.5 shrink-0 text-purple-600"
            />

            <div>
              <p className="text-sm font-semibold text-purple-900">
                Final Practical
                Challenge unlocked
              </p>

              <p className="mt-1 text-xs leading-5 text-purple-700">
                Your learning
                requirements are
                complete. Pass the
                practical challenge to
                become eligible for this
                certificate.
              </p>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={onOpen}
        className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
          practicalReady
            ? 'bg-purple-600 text-white hover:bg-purple-700'
            : 'border border-slate-200 text-slate-700 hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700'
        }`}
      >
        {practicalReady
          ? 'Start Practical Challenge'
          : 'Continue Roadmap'}

        <ArrowRight
          size={15}
        />
      </button>
    </div>
  )
}

// ============================================================
// STATUS ROW
// ============================================================

interface StatusRowProps {
  completed: boolean
  title: string
  description: string
}

function StatusRow({
  completed,
  title,
  description,
}: StatusRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-50 px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            completed
              ? 'bg-green-100 text-green-700'
              : 'bg-slate-200 text-slate-500'
          }`}
        >
          {completed ? (
            <CheckCircle2
              size={17}
            />
          ) : (
            <LockKeyhole
              size={15}
            />
          )}
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-0.5 text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>
    </div>
  )
}

// ============================================================
// EARNED CERTIFICATE CARD
// ============================================================

interface EarnedCertificateCardProps {
  certificate: CareerCertificate
  onOpen: () => void
}

function EarnedCertificateCard({
  certificate,
  onOpen,
}: EarnedCertificateCardProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-green-200 bg-white shadow-sm">
      <div className="bg-gradient-to-br from-green-50 via-white to-purple-50 p-6">
        <div className="rounded-2xl border border-green-200 bg-white/80 p-6 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-600 text-white">
            <Award size={27} />
          </div>

          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">
            SkillForge
          </p>

          <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-slate-500">
            Career Certificate
          </p>

          <h3 className="mt-4 text-xl font-bold text-slate-950">
            {
              certificate.roleTitle
            }
          </h3>

          <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-green-700">
            <CheckCircle2
              size={17}
            />

            Career Requirements
            Verified
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            All{' '}
            {
              certificate.totalTopics
            }{' '}
            required topics,
            assessments, and the Final
            Practical Challenge have
            been successfully completed.
          </p>
        </div>
      </div>

      <div className="border-t border-slate-100 p-4">
        <button
          type="button"
          onClick={onOpen}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          View Completed Roadmap

          <ArrowRight
            size={15}
          />
        </button>
      </div>
    </div>
  )
}

export default Certificates