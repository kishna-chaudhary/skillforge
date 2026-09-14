import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock3,
  MessageCircleQuestion,
  Video,
} from 'lucide-react'

import {
  useNavigate,
} from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'
import { roadmapData } from '../../data/roadmapData'

interface DoubtSession {
  roleId: string
  roleTitle: string
  topicId: string
  topicTitle: string
  description: string
  date: string
  time: string
  status: 'Live Now' | 'Upcoming'
}

const sessionSchedule = [
  {
    roleId: 'devops-engineer',
    topicId: 'kubernetes',
    date: 'Today',
    time: '4:00 PM - 5:00 PM',
    status: 'Live Now' as const,
  },
  {
    roleId: 'frontend-engineer',
    topicId: 'react',
    date: 'Today',
    time: '6:00 PM - 7:00 PM',
    status: 'Upcoming' as const,
  },
  {
    roleId: 'backend-engineer',
    topicId: 'rest-api',
    date: 'Tomorrow',
    time: '11:00 AM - 12:00 PM',
    status: 'Upcoming' as const,
  },
  {
    roleId: 'data-scientist',
    topicId: 'machine-learning',
    date: 'Tomorrow',
    time: '3:00 PM - 4:00 PM',
    status: 'Upcoming' as const,
  },
  {
    roleId: 'cloud-engineer',
    topicId: 'aws',
    date: 'Friday',
    time: '2:00 PM - 3:00 PM',
    status: 'Upcoming' as const,
  },
  {
    roleId: 'qa-engineer',
    topicId: 'selenium',
    date: 'Friday',
    time: '5:00 PM - 6:00 PM',
    status: 'Upcoming' as const,
  },
]

function createSessions(): DoubtSession[] {
  return sessionSchedule.flatMap(
    (item) => {
      const role =
        roadmapData[
          item.roleId
        ]

      if (!role) {
        return []
      }

      const topic =
        role.topics.find(
          (entry) =>
            entry.id ===
            item.topicId
        )

      if (!topic) {
        return []
      }

      return [
        {
          roleId:
            item.roleId,
          roleTitle:
            role.title,
          topicId:
            item.topicId,
          topicTitle:
            topic.title,
          description:
            topic.description,
          date:
            item.date,
          time:
            item.time,
          status:
            item.status,
        },
      ]
    }
  )
}

function LiveSessions() {
  const navigate =
    useNavigate()

  const sessions =
    createSessions()

  const handleJoinSession =
    (
      session:
        DoubtSession
    ) => {
      navigate(
        `/employee/live-sessions/room?roleId=${session.roleId}&topicId=${session.topicId}`
      )
    }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="rounded-3xl bg-slate-950 p-7 text-white">

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
              Join role-specific sessions to
              ask questions about roadmap
              topics, lesson concepts,
              practical exercises, and
              assessment preparation.
            </p>

          </div>

          {/* SESSION LIST */}

          <div className="mt-8">

            <div>

              <h2 className="text-xl font-bold text-slate-900">
                Available Sessions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Sessions are organized by career
                role and roadmap topic.
              </p>

            </div>

            <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">

              {sessions.map(
                (session) => (
                  <div
                    key={`${session.roleId}/${session.topicId}`}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-purple-200 hover:shadow-md"
                  >

                    {/* STATUS */}

                    <div className="flex items-center justify-between gap-4">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                          {session.roleTitle}
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            session.status ===
                            'Live Now'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {session.status}
                        </span>

                      </div>

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                          session.status ===
                          'Live Now'
                            ? 'bg-red-100 text-red-600'
                            : 'bg-purple-100 text-purple-600'
                        }`}
                      >
                        <Video
                          size={20}
                        />
                      </div>

                    </div>

                    {/* TOPIC */}

                    <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Roadmap Topic
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                      {session.topicTitle} Doubt
                      Solving Session
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {session.description}
                    </p>

                    {/* DETAILS */}

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

                      <SessionDetail
                        icon={
                          <CalendarDays
                            size={17}
                          />
                        }
                        label="Date"
                        value={session.date}
                      />

                      <SessionDetail
                        icon={
                          <Clock3
                            size={17}
                          />
                        }
                        label="Time"
                        value={session.time}
                      />

                    </div>

                    {/* PURPOSE */}

                    <div className="mt-5 rounded-xl bg-slate-50 p-4">

                      <div className="flex items-start gap-3">

                        <BookOpen
                          size={18}
                          className="mt-0.5 shrink-0 text-purple-600"
                        />

                        <div>

                          <p className="text-sm font-semibold text-slate-800">
                            What you can ask
                          </p>

                          <p className="mt-1 text-xs leading-5 text-slate-500">
                            Ask about lesson
                            concepts, implementation
                            problems, practical use
                            cases, debugging, or
                            assessment preparation.
                          </p>

                        </div>

                      </div>

                    </div>

                    {/* JOIN */}

                    <button
                      onClick={() =>
                        handleJoinSession(
                          session
                        )
                      }
                      className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition ${
                        session.status ===
                        'Live Now'
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-purple-600 hover:bg-purple-700'
                      }`}
                    >
                      {session.status ===
                      'Live Now'
                        ? 'Join Live Doubt Session'
                        : 'Enter Session'}

                      <ArrowRight
                        size={17}
                      />
                    </button>

                  </div>
                )
              )}

            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

interface SessionDetailProps {
  icon: React.ReactNode
  label: string
  value: string
}

function SessionDetail({
  icon,
  label,
  value,
}: SessionDetailProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3">

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
        {icon}
      </div>

      <div>

        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        <p className="mt-0.5 text-sm font-semibold text-slate-700">
          {value}
        </p>

      </div>

    </div>
  )
}

export default LiveSessions