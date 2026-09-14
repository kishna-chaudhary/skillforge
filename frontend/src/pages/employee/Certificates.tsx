import {
  ArrowRight,
  Award,
  CheckCircle2,
  CircleCheckBig,
  LockKeyhole,
  Medal,
  Target,
  Trophy,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'
import { roadmapData } from '../../data/roadmapData'

const topicStorageKey =
  'skillforge_completed_topics'

interface CareerCertificate {
  roleId: string
  roleTitle: string
  totalTopics: number
  completedTopics: number
  remainingTopics: number
  percentage: number
  earned: boolean
}

function Certificates() {
  const navigate = useNavigate()

  // ==================================================
  // READ VERIFIED TOPIC COMPLETION
  // ==================================================

  let completedTopics: string[] = []

  try {
    const storedTopics =
      localStorage.getItem(
        topicStorageKey
      )

    if (storedTopics) {
      const parsed =
        JSON.parse(storedTopics)

      if (Array.isArray(parsed)) {
        completedTopics =
          parsed.filter(
            (
              item
            ): item is string =>
              typeof item ===
              'string'
          )
      }
    }
  } catch {
    completedTopics = []
  }

  const completedTopicSet =
    new Set(completedTopics)

  // ==================================================
  // BUILD CERTIFICATE PROGRESS
  // ==================================================

  const certificates: CareerCertificate[] =
    Object.entries(
      roadmapData
    ).map(
      ([roleId, role]) => {
        const totalTopics =
          role.topics.length

        const completedTopicCount =
          role.topics.filter(
            (topic) =>
              completedTopicSet.has(
                `${roleId}/${topic.id}`
              )
          ).length

        const percentage =
          totalTopics > 0
            ? Math.round(
                (completedTopicCount /
                  totalTopics) *
                  100
              )
            : 0

        return {
          roleId,
          roleTitle: role.title,
          totalTopics,
          completedTopics:
            completedTopicCount,
          remainingTopics:
            Math.max(
              totalTopics -
                completedTopicCount,
              0
            ),
          percentage,
          earned:
            totalTopics > 0 &&
            completedTopicCount ===
              totalTopics,
        }
      }
    )

  // ==================================================
  // CERTIFICATE GROUPS
  // ==================================================

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
          b.percentage !==
          a.percentage
        ) {
          return (
            b.percentage -
            a.percentage
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

  const closestCertificate =
    inProgressCertificates.find(
      (certificate) =>
        certificate.completedTopics >
        0
    )

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-5 sm:p-6">

        <div className="mx-auto max-w-7xl">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">

                <Award
                  size={17}
                />

                Career Credentials

              </div>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
                Certificates
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Complete every topic and
                pass every required
                assessment in a career
                roadmap to earn its
                SkillForge certificate.
              </p>

            </div>

            <button
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

          {/* ==================================================
              HERO
          ================================================== */}

          <div className="mt-8 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">

            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">

              <div>

                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-purple-300">

                  <Trophy
                    size={16}
                  />

                  SkillForge Career Certification

                </div>

                <h2 className="mt-4 max-w-2xl text-2xl font-bold tracking-tight sm:text-3xl">
                  Turn verified roadmap
                  progress into career
                  credentials.
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                  Certificates are earned
                  only after all topics in
                  a career roadmap have
                  been completed through
                  their required
                  assessments.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">

                  <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">

                    <p className="text-2xl font-bold">
                      {
                        earnedCertificates.length
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Certificates earned
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">

                    <p className="text-2xl font-bold">
                      {
                        startedCertificates
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Roadmaps started
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">

                    <p className="text-2xl font-bold">
                      {
                        certificates.length
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Career certificates
                    </p>

                  </div>

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

          {/* ==================================================
              CERTIFICATION RULE
          ================================================== */}

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">

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
              title="Earn Certificate"
              description="Reach 100% verified roadmap completion to unlock the career certificate."
            />

          </div>

          {/* ==================================================
              EARNED CERTIFICATES
          ================================================== */}

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
                  Career roadmaps you have
                  fully completed and
                  verified.
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
                  No certificates earned
                  yet
                </h3>

                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  Your first certificate
                  will unlock when you
                  reach 100% verified
                  completion in a career
                  roadmap.
                </p>

                <button
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

          {/* ==================================================
              CERTIFICATE PROGRESS
          ================================================== */}

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
                  Track your verified
                  completion toward each
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
                    onOpen={() =>
                      navigate(
                        `/employee/roles/${certificate.roleId}`
                      )
                    }
                  />
                )
              )}

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  )
}

// ==================================================
// REQUIREMENT CARD
// ==================================================

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

// ==================================================
// CERTIFICATE PROGRESS CARD
// ==================================================

interface CertificateProgressCardProps {
  certificate: CareerCertificate
  onOpen: () => void
}

function CertificateProgressCard({
  certificate,
  onOpen,
}: CertificateProgressCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-start justify-between gap-4">

        <div className="flex min-w-0 items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">

            <Award
              size={23}
            />

          </div>

          <div className="min-w-0">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
              Career Certificate
            </p>

            <h3 className="mt-1 truncate text-lg font-bold text-slate-900">
              {
                certificate.roleTitle
              }
            </h3>

          </div>

        </div>

        <span className="rounded-full bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
          {
            certificate.percentage
          }
          %
        </span>

      </div>

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
                `${certificate.percentage}%`,
            }}
          />

        </div>

      </div>

      <div className="mt-5 flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">

        <div>

          <p className="text-xs text-slate-400">
            Remaining
          </p>

          <p className="mt-0.5 text-sm font-semibold text-slate-800">
            {
              certificate.remainingTopics
            }{' '}
            topic
            {certificate.remainingTopics ===
            1
              ? ''
              : 's'}
          </p>

        </div>

        <LockKeyhole
          size={18}
          className="text-slate-400"
        />

      </div>

      <button
        onClick={onOpen}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:bg-purple-50 hover:text-purple-700"
      >
        Continue Roadmap

        <ArrowRight
          size={15}
        />
      </button>

    </div>
  )
}

// ==================================================
// EARNED CERTIFICATE CARD
// ==================================================

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

            <Award
              size={27}
            />

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

            100% Roadmap Verified

          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            All{' '}
            {
              certificate.totalTopics
            }{' '}
            required topics and
            assessments have been
            successfully completed.
          </p>

        </div>

      </div>

      <div className="border-t border-slate-100 p-4">

        <button
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