import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  PlayCircle,
} from 'lucide-react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'
import { roadmapData } from '../../data/roadmapData'

const topicStorageKey =
  'skillforge_completed_topics'

function RoleRoadmap() {
  const navigate = useNavigate()
  const { roleId } = useParams()

  const [completedTopics] =
    useState<string[]>(() => {
      const saved =
        localStorage.getItem(
          topicStorageKey
        )

      if (!saved) {
        return []
      }

      try {
        const parsed =
          JSON.parse(saved)

        if (!Array.isArray(parsed)) {
          return []
        }

        return parsed.filter(
          (
            value
          ): value is string =>
            typeof value ===
            'string'
        )
      } catch {
        return []
      }
    })

  const roadmap =
    roleId
      ? roadmapData[roleId]
      : undefined

  if (!roadmap) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <h1 className="text-2xl font-bold text-slate-900">
                Role Not Found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                The requested career roadmap does not exist.
              </p>

              <button
                onClick={() =>
                  navigate(
                    '/employee/roles'
                  )
                }
                className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Back to Roles
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const completedCount =
    roadmap.topics.filter(
      (topic) => {
        if (!roleId) {
          return false
        }

        const topicKey =
          `${roleId}/${topic.id}`

        return completedTopics.includes(
          topicKey
        )
      }
    ).length

  const progressPercentage =
    roadmap.topics.length > 0
      ? Math.round(
          (completedCount /
            roadmap.topics.length) *
            100
        )
      : 0

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-5xl">
          {/* BACK */}
          <button
            onClick={() =>
              navigate(
                '/employee/roles'
              )
            }
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-purple-600"
          >
            <ArrowLeft size={17} />
            Back to Roles
          </button>

          {/* HEADER */}
          <div className="rounded-2xl bg-slate-900 p-7 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Career Roadmap
            </p>

            <h1 className="mt-2 text-3xl font-bold">
              {roadmap.title}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              {roadmap.description}
            </p>

            {/* PROGRESS */}
            <div className="mt-7">
              <div className="flex items-center justify-between gap-4 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-slate-400">
                    Your Progress
                  </span>

                  <span className="text-slate-500">
                    •
                  </span>

                  <span className="text-slate-400">
                    {completedCount} of{' '}
                    {
                      roadmap.topics
                        .length
                    }{' '}
                    topics
                  </span>
                </div>

                <span className="shrink-0 font-semibold text-white">
                  {
                    progressPercentage
                  }
                  %
                </span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">
                <div
                  className="h-full rounded-full bg-purple-500 transition-all"
                  style={{
                    width:
                      `${progressPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* ROADMAP */}
          <div className="mt-8">
            <div className="mb-5">
              <h2 className="text-xl font-bold text-slate-900">
                Learning Roadmap
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Complete all lessons
                and pass each topic
                assessment to progress
                through your career
                path.
              </p>
            </div>

            <div className="space-y-4">
              {roadmap.topics.map(
                (
                  topic,
                  index
                ) => {
                  const topicKey =
                    `${roleId}/${topic.id}`

                  const isCompleted =
                    completedTopics.includes(
                      topicKey
                    )

                  return (
                    <div
                      key={topic.id}
                      className="group flex gap-4"
                    >
                      {/* NUMBER / STATUS */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 ${
                            isCompleted
                              ? 'border-green-500 bg-green-50 text-green-600'
                              : 'border-purple-200 bg-purple-50 text-purple-600'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2
                              size={
                                21
                              }
                            />
                          ) : (
                            <span className="text-sm font-bold">
                              {String(
                                index +
                                  1
                              ).padStart(
                                2,
                                '0'
                              )}
                            </span>
                          )}
                        </div>

                        {index !==
                          roadmap
                            .topics
                            .length -
                            1 && (
                          <div className="mt-2 h-full w-px bg-slate-200" />
                        )}
                      </div>

                      {/* TOPIC CARD */}
                      <button
                        onClick={() =>
                          navigate(
                            `/employee/roles/${roleId}/topics/${topic.id}`
                          )
                        }
                        className="mb-4 flex flex-1 items-center justify-between rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900">
                              {
                                topic.title
                              }
                            </h3>

                            {index ===
                              0 && (
                              <span className="rounded-full bg-purple-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-purple-700">
                                Start
                                Here
                              </span>
                            )}

                            {isCompleted && (
                              <span className="rounded-full bg-green-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green-700">
                                Completed
                              </span>
                            )}
                          </div>

                          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            {
                              topic.description
                            }
                          </p>

                          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1.5">
                              <Clock3
                                size={
                                  14
                                }
                              />

                              {
                                topic.duration
                              }
                            </span>

                            <span className="flex items-center gap-1.5">
                              <BookOpen
                                size={
                                  14
                                }
                              />

                              {
                                topic.lessons
                              }{' '}
                              {topic.lessons ===
                              1
                                ? 'lesson'
                                : 'lessons'}
                            </span>
                          </div>
                        </div>

                        <div className="ml-4 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-purple-100 group-hover:text-purple-600 sm:flex">
                          <ArrowRight
                            size={
                              18
                            }
                          />
                        </div>
                      </button>
                    </div>
                  )
                }
              )}
            </div>
          </div>

          {/* BOTTOM MESSAGE */}
          <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50 p-5">
            <div className="flex gap-3">
              <PlayCircle
                size={21}
                className="mt-0.5 shrink-0 text-purple-600"
              />

              <div>
                <h3 className="text-sm font-semibold text-purple-900">
                  Learn at your own
                  pace
                </h3>

                <p className="mt-1 text-sm leading-6 text-purple-700">
                  Complete the
                  lessons in each
                  topic and pass its
                  assessment to mark
                  the topic as
                  completed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default RoleRoadmap