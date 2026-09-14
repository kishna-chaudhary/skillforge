import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Save,
  Video,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'
import { roadmapData } from '../../data/roadmapData'

function CreateLiveSession() {
  const navigate = useNavigate()

  const roleIds =
    Object.keys(roadmapData)

  const [roleId, setRoleId] =
    useState(
      roleIds[0] ?? ''
    )

  const selectedRole =
    roleId
      ? roadmapData[roleId]
      : undefined

  const topicOptions =
    useMemo(() => {
      return selectedRole?.topics ?? []
    }, [selectedRole])

  const [topicId, setTopicId] =
    useState(
      topicOptions[0]?.id ?? ''
    )

  const [date, setDate] =
    useState('')

  const [startTime, setStartTime] =
    useState('')

  const [endTime, setEndTime] =
    useState('')

  const handleRoleChange = (
    nextRoleId: string
  ) => {
    setRoleId(nextRoleId)

    const nextRole =
      roadmapData[nextRoleId]

    setTopicId(
      nextRole?.topics[0]?.id ?? ''
    )
  }

  const selectedTopic =
    selectedRole?.topics.find(
      (topic) =>
        topic.id === topicId
    )

  const goBack = () => {
    navigate(
      '/admin/live-sessions'
    )
  }

  return (
    <AdminLayout>

      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

        <div className="mx-auto max-w-5xl">

          {/* Back */}

          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-purple-600"
          >
            <ArrowLeft size={17} />
            Back to Live Sessions
          </button>

          {/* Header */}

          <div className="mt-6">

            <p className="text-sm font-semibold text-purple-600">
              Live Session Management
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              Create Live Session
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Schedule a role-specific learning session and connect
              it to a roadmap topic.
            </p>

          </div>

          {/* Main form */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Video size={21} />
              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  Session Details
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure who should receive this live learning session.
                </p>

              </div>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              {/* Career Role */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Career Role
                </label>

                <select
                  value={roleId}
                  onChange={(event) =>
                    handleRoleChange(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                >
                  {Object.entries(
                    roadmapData
                  ).map(
                    ([
                      currentRoleId,
                      role,
                    ]) => (
                      <option
                        key={
                          currentRoleId
                        }
                        value={
                          currentRoleId
                        }
                      >
                        {role.title}
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* Topic */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Roadmap Topic
                </label>

                <select
                  value={topicId}
                  onChange={(event) =>
                    setTopicId(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                >
                  {topicOptions.map(
                    (topic) => (
                      <option
                        key={topic.id}
                        value={topic.id}
                      >
                        {topic.title}
                      </option>
                    )
                  )}
                </select>

              </div>

              {/* Date */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Session Date
                </label>

                <div className="relative">

                  <CalendarDays
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="date"
                    value={date}
                    onChange={(event) =>
                      setDate(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />

                </div>

              </div>

              {/* Start Time */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Start Time
                </label>

                <div className="relative">

                  <Clock3
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="time"
                    value={startTime}
                    onChange={(event) =>
                      setStartTime(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />

                </div>

              </div>

              {/* End Time */}

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  End Time
                </label>

                <div className="relative">

                  <Clock3
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="time"
                    value={endTime}
                    onChange={(event) =>
                      setEndTime(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />

                </div>

              </div>

            </div>

          </div>

          {/* Session preview */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="font-bold text-slate-900">
              Session Preview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              This is how the selected role and topic are currently configured.
            </p>

            <div className="mt-5 rounded-2xl bg-slate-950 p-6 text-white">

              <p className="text-xs font-semibold uppercase tracking-wide text-purple-300">
                {selectedRole?.title ??
                  'Career Role'}
              </p>

              <h3 className="mt-2 text-xl font-bold">
                {selectedTopic?.title ??
                  'Roadmap Topic'}
              </h3>

              <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-300">

                <span className="flex items-center gap-2">
                  <CalendarDays
                    size={16}
                  />

                  {date ||
                    'Select date'}
                </span>

                <span className="flex items-center gap-2">
                  <Clock3
                    size={16}
                  />

                  {startTime ||
                    '--:--'}
                  {' – '}
                  {endTime ||
                    '--:--'}
                </span>

              </div>

            </div>

          </div>

          {/* Publishing */}

          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">

            <p className="text-sm font-semibold text-purple-800">
              Frontend scheduling prototype
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              Creating or publishing a session does not persist data yet.
              During backend integration, the session will be stored in
              PostgreSQL with its role, topic, date, start time, end time
              and publishing status. The Employee Live Sessions page will
              then load these Admin-created sessions from the API.
            </p>

          </div>

          {/* Actions */}

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={goBack}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <Save size={16} />
              Save Draft
            </button>

            <button
              type="button"
              className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Publish Session
            </button>

          </div>

        </div>

      </div>

    </AdminLayout>
  )
}

export default CreateLiveSession