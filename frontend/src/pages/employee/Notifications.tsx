import {
  Bell,
  CheckCircle2,
  ClipboardCheck,
  Video,
  Award,
  BriefcaseBusiness,
} from 'lucide-react'
import type { ReactNode } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'

function Notifications() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-5 sm:p-6">

        <div className="mx-auto max-w-5xl">

          {/* ==================================================
              HEADER
          ================================================== */}

          <div>

            <div className="flex items-center gap-2 text-sm font-semibold text-purple-600">
              <Bell size={17} />
              Learning Updates
            </div>

            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">
              Notifications
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Important updates about your career roadmaps,
              assessments, live sessions and certificates will
              appear here.
            </p>

          </div>

          {/* ==================================================
              SUMMARY
          ================================================== */}

          <div className="mt-8 overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-sm sm:p-8">

            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
                  <Bell size={23} />
                </div>

                <div>

                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-purple-300">
                    Notification Center
                  </p>

                  <h2 className="mt-2 text-xl font-bold">
                    You're all caught up
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                    There are currently no new notifications
                    associated with your SkillForge account.
                  </p>

                </div>

              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900 px-5 py-4 text-center">

                <p className="text-3xl font-bold">
                  0
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Unread
                </p>

              </div>

            </div>

          </div>

          {/* ==================================================
              EMPTY STATE
          ================================================== */}

          <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">

            <div className="mx-auto max-w-lg text-center">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
                <CheckCircle2 size={29} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-slate-950">
                No notifications yet
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                When something important happens in your learning
                journey, you'll see the update here.
              </p>

            </div>

          </div>

          {/* ==================================================
              NOTIFICATION TYPES
          ================================================== */}

          <div className="mt-8">

            <div>

              <h2 className="text-lg font-bold text-slate-950">
                What you'll be notified about
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                SkillForge notifications will focus on important
                learning and career events.
              </p>

            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">

              <NotificationTypeCard
                icon={
                  <BriefcaseBusiness
                    size={20}
                  />
                }
                title="Roadmap Updates"
                description="New career roadmaps, assignments and important learning-path changes."
              />

              <NotificationTypeCard
                icon={
                  <ClipboardCheck
                    size={20}
                  />
                }
                title="Assessments"
                description="Assessment availability, results and other important assessment updates."
              />

              <NotificationTypeCard
                icon={
                  <Video
                    size={20}
                  />
                }
                title="Live Sessions"
                description="Upcoming doubt-solving sessions, schedule changes and session reminders."
              />

              <NotificationTypeCard
                icon={
                  <Award
                    size={20}
                  />
                }
                title="Certificates"
                description="Updates when a completed career roadmap qualifies for a certificate."
              />

            </div>

          </div>

          {/* ==================================================
              BACKEND NOTE
          ================================================== */}

          <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">

            <div className="flex items-start gap-3">

              <Bell
                size={19}
                className="mt-0.5 shrink-0 text-blue-600"
              />

              <div>

                <p className="text-sm font-semibold text-blue-900">
                  Notification history
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  Notification delivery, read status and history
                  will be connected to your authenticated account
                  when the SkillForge backend notification system
                  is implemented.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  )
}

// ==================================================
// NOTIFICATION TYPE CARD
// ==================================================

interface NotificationTypeCardProps {
  icon: ReactNode
  title: string
  description: string
}

function NotificationTypeCard({
  icon,
  title,
  description,
}: NotificationTypeCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          {icon}
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

export default Notifications