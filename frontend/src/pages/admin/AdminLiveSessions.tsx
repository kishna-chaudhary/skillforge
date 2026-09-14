import type { ReactNode } from 'react'

import {
  CalendarDays,
  Clock3,
  Plus,
  Radio,
  Users,
  Video,
} from 'lucide-react'

import { useNavigate } from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'

interface LiveSession {
  id: string
  roleTitle: string
  topicTitle: string
  day: string
  time: string
  status: 'live' | 'upcoming'
}

const sessions: LiveSession[] = [
  {
    id: 'devops-kubernetes',
    roleTitle: 'DevOps Engineer',
    topicTitle: 'Kubernetes',
    day: 'Today',
    time: '4:00 PM – 5:00 PM',
    status: 'live',
  },
  {
    id: 'frontend-react',
    roleTitle: 'Frontend Engineer',
    topicTitle: 'React',
    day: 'Today',
    time: '6:00 PM – 7:00 PM',
    status: 'upcoming',
  },
  {
    id: 'backend-rest-api',
    roleTitle: 'Backend Engineer',
    topicTitle: 'REST API',
    day: 'Tomorrow',
    time: '11:00 AM – 12:00 PM',
    status: 'upcoming',
  },
  {
    id: 'data-science-machine-learning',
    roleTitle: 'Data Scientist',
    topicTitle: 'Machine Learning',
    day: 'Tomorrow',
    time: '3:00 PM – 4:00 PM',
    status: 'upcoming',
  },
  {
    id: 'cloud-aws',
    roleTitle: 'Cloud Engineer',
    topicTitle: 'AWS',
    day: 'Friday',
    time: '2:00 PM – 3:00 PM',
    status: 'upcoming',
  },
  {
    id: 'qa-selenium',
    roleTitle: 'QA/Test Engineer',
    topicTitle: 'Selenium',
    day: 'Friday',
    time: '5:00 PM – 6:00 PM',
    status: 'upcoming',
  },
]

function AdminLiveSessions() {
  const navigate = useNavigate()

  const liveCount = sessions.filter(
    (session) => session.status === 'live'
  ).length

  const upcomingCount = sessions.filter(
    (session) => session.status === 'upcoming'
  ).length

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-600">
                Learning Management
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-950">
                Live Sessions
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Schedule and manage role-specific learning sessions
                where employees can join live video rooms for topic
                discussions and doubt solving.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate('/admin/live-sessions/create')
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              <Plus size={17} />
              Create Live Session
            </button>
          </div>

          {/* Hero */}

          <div className="mt-7 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white lg:p-8">
            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">
                  <Video size={23} />
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  Live Learning Workspace
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Live sessions connect employees with topic-specific
                  support through the SkillForge WebRTC meeting room.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <HeroMetric
                  value={sessions.length}
                  label="Scheduled"
                />

                <HeroMetric
                  value={liveCount}
                  label="Live Now"
                />

                <HeroMetric
                  value={upcomingCount}
                  label="Upcoming"
                />

                <HeroMetric
                  value="WebRTC"
                  label="Meeting Engine"
                />
              </div>

            </div>
          </div>

          {/* Summary */}

          <div className="mt-7 grid gap-4 md:grid-cols-3">

            <SummaryCard
              icon={<Radio size={20} />}
              value={liveCount}
              title="Live Now"
              description="Sessions currently marked as active."
            />

            <SummaryCard
              icon={<CalendarDays size={20} />}
              value={upcomingCount}
              title="Upcoming Sessions"
              description="Scheduled employee learning sessions."
            />

            <SummaryCard
              icon={<Users size={20} />}
              value="Real-time"
              title="Participant Rooms"
              description="Video, audio, participant count and chat through WebRTC and Socket.IO."
            />

          </div>

          {/* Sessions */}

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-bold text-slate-900">
                Scheduled Sessions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current frontend session schedule.
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {sessions.map((session) => (
                <SessionRow
                  key={session.id}
                  session={session}
                />
              ))}
            </div>

          </div>

          {/* Architecture */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="font-bold text-slate-900">
              Live Session Workflow
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              The final Admin-controlled live-session workflow will
              follow this structure.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-4">

              <WorkflowCard
                number="01"
                title="Choose Role"
                description="Select the career role that should receive the session."
              />

              <WorkflowCard
                number="02"
                title="Choose Topic"
                description="Connect the session to a roadmap topic."
              />

              <WorkflowCard
                number="03"
                title="Schedule"
                description="Configure the session date and start/end time."
              />

              <WorkflowCard
                number="04"
                title="Publish"
                description="Make the session visible to the appropriate employees."
              />

            </div>
          </div>

          {/* Frontend notice */}

          <div className="mt-7 rounded-2xl border border-purple-100 bg-purple-50 p-5">
            <p className="text-sm font-semibold text-purple-800">
              Current frontend configuration
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              These sessions currently mirror the temporary schedule
              used by the employee Live Sessions page. During backend
              integration, Admin-created sessions will be stored in
              PostgreSQL and both Admin and Employee pages will load
              the same live-session records through the API.
            </p>
          </div>

        </div>
      </div>
    </AdminLayout>
  )
}

interface HeroMetricProps {
  value: number | string
  label: string
}

function HeroMetric({
  value,
  label,
}: HeroMetricProps) {
  return (
    <div className="min-w-32 rounded-2xl border border-slate-800 bg-slate-900 p-4">
      <p className="text-xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {label}
      </p>
    </div>
  )
}

interface SummaryCardProps {
  icon: ReactNode
  value: number | string
  title: string
  description: string
}

function SummaryCard({
  icon,
  value,
  title,
  description,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}

interface SessionRowProps {
  session: LiveSession
}

function SessionRow({
  session,
}: SessionRowProps) {
  const isLive =
    session.status === 'live'

  return (
    <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center">

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
          {session.roleTitle}
        </p>

        <h3 className="mt-1 text-base font-bold text-slate-900">
          {session.topicTitle}
        </h3>

        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            {session.day}
          </span>

          <span>•</span>

          <span className="flex items-center gap-1.5">
            <Clock3 size={14} />
            {session.time}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        <span
          className={`inline-flex justify-center rounded-full px-3 py-1.5 text-xs font-semibold ${
            isLive
              ? 'bg-red-50 text-red-700'
              : 'bg-blue-50 text-blue-700'
          }`}
        >
          {isLive
            ? 'Live Now'
            : 'Upcoming'}
        </span>

        <button
          type="button"
          className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:text-purple-600"
        >
          Manage
        </button>

      </div>

    </div>
  )
}

interface WorkflowCardProps {
  number: string
  title: string
  description: string
}

function WorkflowCard({
  number,
  title,
  description,
}: WorkflowCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-bold text-purple-600">
        {number}
      </p>

      <p className="mt-3 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>
  )
}

export default AdminLiveSessions