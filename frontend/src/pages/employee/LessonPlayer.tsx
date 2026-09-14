import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  Clock,
  PlayCircle,
} from 'lucide-react'

import DashboardLayout from '../../layouts/DashboardLayout'

const lessons = [
  {
    id: 1,
    title: 'Introduction to React',
    duration: '18 min',
    completed: true,
  },
  {
    id: 2,
    title: 'Components and JSX',
    duration: '25 min',
    completed: true,
  },
  {
    id: 3,
    title: 'React Hooks',
    duration: '35 min',
    completed: false,
    current: true,
  },
  {
    id: 4,
    title: 'Context API',
    duration: '28 min',
    completed: false,
  },
  {
    id: 5,
    title: 'Performance Optimization',
    duration: '30 min',
    completed: false,
  },
]

function LessonPlayer() {
  return (
    <DashboardLayout>
      <div>
        {/* Back */}
        <button className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-purple-600">
          <ArrowLeft size={18} />
          Back to Course
        </button>

        {/* Main Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Left Content */}
          <div className="lg:col-span-2">

            {/* Video */}
            <div className="overflow-hidden rounded-2xl bg-black shadow-sm">
              <div className="flex aspect-video items-center justify-center">
                <div className="text-center text-white">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-600">
                    <PlayCircle size={42} />
                  </div>

                  <p className="mt-4 text-sm text-slate-300">
                    Training video will appear here
                  </p>
                </div>
              </div>
            </div>

            {/* Lesson Information */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex flex-wrap items-start justify-between gap-4">

                <div>
                  <p className="text-sm font-medium text-purple-600">
                    Module 2 • Advanced React
                  </p>

                  <h1 className="mt-2 text-2xl font-bold text-slate-900">
                    React Hooks
                  </h1>

                  <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <Clock size={16} />
                    35 minutes
                  </div>
                </div>

                <button className="flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
                  <CheckCircle2 size={18} />
                  Mark as Complete
                </button>

              </div>

              <div className="mt-6 border-t border-slate-200 pt-6">

                <h2 className="text-lg font-semibold text-slate-900">
                  About this lesson
                </h2>

                <p className="mt-3 leading-7 text-slate-600">
                  Learn how React Hooks work and how they allow functional
                  components to use state and other React features. This
                  lesson covers useState, useEffect, and common patterns
                  used in modern React applications.
                </p>

              </div>

            </div>
          </div>

          {/* Right Sidebar */}
          <div>

            <div className="sticky top-24 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Header */}
              <div className="border-b border-slate-200 p-5">
                <h2 className="font-bold text-slate-900">
                  Course Content
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Advanced React Development
                </p>
              </div>

              {/* Progress */}
              <div className="border-b border-slate-200 p-5">

                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Course Progress
                  </span>

                  <span className="font-semibold text-purple-600">
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

              {/* Lessons */}
              <div className="max-h-[500px] overflow-y-auto">

                {lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    className={`flex w-full items-center gap-3 border-b border-slate-100 p-4 text-left transition ${
                      lesson.current
                        ? 'bg-purple-50'
                        : 'hover:bg-slate-50'
                    }`}
                  >

                    {lesson.completed ? (
                      <CheckCircle2
                        size={19}
                        className="shrink-0 text-green-500"
                      />
                    ) : lesson.current ? (
                      <PlayCircle
                        size={19}
                        className="shrink-0 text-purple-600"
                      />
                    ) : (
                      <Circle
                        size={19}
                        className="shrink-0 text-slate-300"
                      />
                    )}

                    <div className="min-w-0 flex-1">

                      <p
                        className={`text-sm font-medium ${
                          lesson.current
                            ? 'text-purple-700'
                            : 'text-slate-700'
                        }`}
                      >
                        {lesson.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {lesson.duration}
                      </p>

                    </div>

                  </button>
                ))}

              </div>

            </div>

          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default LessonPlayer