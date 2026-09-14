import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  PlayCircle,
  User,
} from 'lucide-react'

import DashboardLayout from '../../layouts/DashboardLayout'

function CourseDetails() {
  return (
    <DashboardLayout>
      <div>

        {/* Back Button */}
        <button className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600">
          <ArrowLeft size={18} />
          Back to Courses
        </button>

        {/* Course Header */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

          {/* Banner */}
          <div className="flex min-h-64 items-center bg-gradient-to-r from-purple-700 to-indigo-700 px-8 py-10 text-white">
            <div className="max-w-3xl">

              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                Frontend Development
              </span>

              <h1 className="mt-4 text-3xl font-bold md:text-4xl">
                Advanced React Development
              </h1>

              <p className="mt-3 text-purple-100">
                Master modern React development and build scalable,
                production-ready applications.
              </p>

              <div className="mt-5 flex flex-wrap gap-5 text-sm text-purple-100">

                <span className="flex items-center gap-2">
                  <User size={17} />
                  Sarah Johnson
                </span>

                <span className="flex items-center gap-2">
                  <Clock size={17} />
                  18 Hours
                </span>

                <span className="flex items-center gap-2">
                  <PlayCircle size={17} />
                  24 Lessons
                </span>

              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="border-b border-slate-200 p-6">

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  Your Progress
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  17 of 24 lessons completed
                </p>
              </div>

              <span className="text-lg font-bold text-purple-600">
                72%
              </span>
            </div>

            <div className="mt-3 h-2 rounded-full bg-slate-100">
              <div
                className="h-2 rounded-full bg-purple-600"
                style={{ width: '72%' }}
              />
            </div>

          </div>
        </div>

        {/* Main Content */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Course Content */}
          <div className="lg:col-span-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-xl font-bold text-slate-900">
                Course Content
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Complete all modules to finish the course.
              </p>

              {/* Module 1 */}
              <div className="mt-6 rounded-xl border border-slate-200">

                <div className="flex items-center justify-between bg-slate-50 p-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Module 1 — React Fundamentals
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      6 lessons • Completed
                    </p>
                  </div>

                  <CheckCircle2
                    size={20}
                    className="text-green-500"
                  />
                </div>

                <div className="divide-y divide-slate-100">

                  <Lesson
                    title="Introduction to React"
                    duration="18 min"
                    completed
                  />

                  <Lesson
                    title="Components and JSX"
                    duration="25 min"
                    completed
                  />

                  <Lesson
                    title="Props and State"
                    duration="32 min"
                    completed
                  />

                </div>
              </div>

              {/* Module 2 */}
              <div className="mt-4 rounded-xl border border-slate-200">

                <div className="flex items-center justify-between bg-slate-50 p-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Module 2 — Advanced React
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      8 lessons • In Progress
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-purple-600">
                    75%
                  </span>
                </div>

                <div className="divide-y divide-slate-100">

                  <Lesson
                    title="React Hooks"
                    duration="35 min"
                    completed
                  />

                  <Lesson
                    title="Context API"
                    duration="28 min"
                    completed
                  />

                  <Lesson
                    title="Performance Optimization"
                    duration="30 min"
                  />

                </div>
              </div>

              {/* Module 3 */}
              <div className="mt-4 rounded-xl border border-slate-200">

                <div className="flex items-center justify-between bg-slate-50 p-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Module 3 — Production Applications
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      10 lessons • Locked
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Right Sidebar */}
          <div>

            <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h2 className="text-lg font-bold text-slate-900">
                Continue Learning
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Pick up where you left off.
              </p>

              <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 font-medium text-white hover:bg-purple-700">
                <PlayCircle size={19} />
                Continue Course
              </button>

              <div className="mt-6 space-y-4 border-t border-slate-200 pt-5">

                <Info
                  label="Lessons"
                  value="24"
                />

                <Info
                  label="Completed"
                  value="17"
                />

                <Info
                  label="Remaining"
                  value="7"
                />

                <Info
                  label="Estimated Time"
                  value="5.5 hours"
                />

              </div>

            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  )
}

/* Lesson Component */

interface LessonProps {
  title: string
  duration: string
  completed?: boolean
}

function Lesson({
  title,
  duration,
  completed = false,
}: LessonProps) {
  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50">

      <div className="flex items-center gap-3">

        {completed ? (
          <CheckCircle2
            size={19}
            className="text-green-500"
          />
        ) : (
          <PlayCircle
            size={19}
            className="text-slate-400"
          />
        )}

        <div>
          <p className="text-sm font-medium text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {duration}
          </p>
        </div>

      </div>

      {completed && (
        <span className="text-xs font-medium text-green-600">
          Completed
        </span>
      )}

    </div>
  )
}

/* Information Component */

interface InfoProps {
  label: string
  value: string
}

function Info({
  label,
  value,
}: InfoProps) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-500">
        {label}
      </span>

      <span className="text-sm font-semibold text-slate-800">
        {value}
      </span>
    </div>
  )
}

export default CourseDetails