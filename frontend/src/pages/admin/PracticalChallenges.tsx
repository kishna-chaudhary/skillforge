import {
  ArrowRight,
  CheckCircle2,
  Code2,
  FileCode2,
  FlaskConical,
  Settings2,
  ShieldCheck,
  Trophy,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'
import { roadmapData } from '../../data/roadmapData'

const configuredChallenges: Record<
  string,
  {
    language: string
    duration: string
    passingScore: number
  }
> = {
  'devops-engineer': {
    language: 'Dockerfile',
    duration: '45 min',
    passingScore: 70,
  },
  'frontend-engineer': {
    language: 'JavaScript',
    duration: '60 min',
    passingScore: 70,
  },
  'backend-engineer': {
    language: 'JavaScript',
    duration: '60 min',
    passingScore: 70,
  },
  'full-stack-engineer': {
    language: 'JavaScript',
    duration: '75 min',
    passingScore: 70,
  },
  'data-analyst': {
    language: 'Python',
    duration: '60 min',
    passingScore: 70,
  },
  'data-scientist': {
    language: 'Python',
    duration: '60 min',
    passingScore: 70,
  },
  'cloud-engineer': {
    language: 'Terraform',
    duration: '60 min',
    passingScore: 70,
  },
  'qa-engineer': {
    language: 'JavaScript',
    duration: '60 min',
    passingScore: 70,
  },
}

function PracticalChallenges() {
  const navigate = useNavigate()

  const roles = Object.entries(
    roadmapData
  )

  const configuredCount =
    roles.filter(
      ([roleId]) =>
        Boolean(
          configuredChallenges[
            roleId
          ]
        )
    ).length

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">
          {/* HERO */}
          <div className="rounded-2xl bg-slate-900 p-7 text-white">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Assessment
                  Management
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  Final Practical
                  Challenges
                </h1>

                <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
                  Configure the final
                  hands-on assessment
                  employees must pass
                  after completing all
                  topics in a career
                  roadmap.
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300">
                <Trophy size={27} />
              </div>
            </div>
          </div>

          {/* METRICS */}
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                  <FileCode2
                    size={19}
                  />
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {roles.length}
                  </p>

                  <p className="text-xs text-slate-500">
                    Career roles
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <CheckCircle2
                    size={19}
                  />
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    {
                      configuredCount
                    }
                  </p>

                  <p className="text-xs text-slate-500">
                    Challenges
                    configured
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <ShieldCheck
                    size={19}
                  />
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-900">
                    70%
                  </p>

                  <p className="text-xs text-slate-500">
                    Default passing
                    score
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* COMPLETION MODEL */}
          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">
            <div className="flex gap-3">
              <Settings2
                size={20}
                className="mt-0.5 shrink-0 text-purple-600"
              />

              <div>
                <h2 className="text-sm font-semibold text-purple-900">
                  Role completion
                  model
                </h2>

                <p className="mt-1 text-sm leading-6 text-purple-700">
                  Employees must
                  complete all
                  lessons, pass all
                  topic assessments,
                  and then pass the
                  final practical
                  challenge before
                  the career role is
                  considered fully
                  completed.
                </p>
              </div>
            </div>
          </div>

          {/* ROLE CHALLENGES */}
          <div className="mt-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Career Role
                Challenges
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                One final practical
                challenge is assigned
                to each career role.
              </p>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-2">
              {roles.map(
                ([
                  roleId,
                  roadmap,
                ]) => {
                  const config =
                    configuredChallenges[
                      roleId
                    ]

                  return (
                    <div
                      key={roleId}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <Code2
                              size={
                                20
                              }
                            />
                          </div>

                          <div>
                            <h3 className="font-bold text-slate-900">
                              {
                                roadmap.title
                              }
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                roadmap
                                  .topics
                                  .length
                              }{' '}
                              topics must
                              be completed
                              first
                            </p>
                          </div>
                        </div>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                            config
                              ? 'bg-green-100 text-green-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {config
                            ? 'Configured'
                            : 'Not configured'}
                        </span>
                      </div>

                      {config ? (
                        <div className="mt-5 grid grid-cols-3 gap-3">
                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              Type
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {
                                config.language
                              }
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              Duration
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {
                                config.duration
                              }
                            </p>
                          </div>

                          <div className="rounded-xl bg-slate-50 p-3">
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                              Pass
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-700">
                              {
                                config.passingScore
                              }
                              %
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                          No practical
                          challenge has
                          been configured
                          for this role.
                        </div>
                      )}

                      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <FlaskConical
                            size={14}
                          />
                          Visible +
                          hidden tests
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            navigate(
                              `/admin/practical-challenges/${roleId}`
                            )
                          }
                          className="flex items-center gap-2 text-sm font-semibold text-purple-600 transition hover:text-purple-700"
                        >
                          Manage
                          Challenge
                          <ArrowRight
                            size={
                              16
                            }
                          />
                        </button>
                      </div>
                    </div>
                  )
                }
              )}
            </div>
          </div>

          {/* BACKEND NOTICE */}
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-slate-500"
              />

              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Secure execution
                  will be backend
                  controlled
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Challenge
                  definitions,
                  hidden test cases,
                  submissions,
                  execution results,
                  scores, and passing
                  status will later
                  be stored and
                  evaluated through
                  the SkillForge
                  backend. Submitted
                  code will not be
                  executed directly
                  inside the main API
                  process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default PracticalChallenges