import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock3,
  Download,
  FileText,
  PlayCircle,
} from 'lucide-react'
import { useState } from 'react'

interface Lesson {
  id: number
  title: string
  duration: string
  completed: boolean
  current?: boolean
}

interface Module {
  id: number
  title: string
  lessons: Lesson[]
}

const modules: Module[] = [
  {
    id: 1,
    title: 'React Fundamentals',
    lessons: [
      {
        id: 1,
        title: 'Introduction to React',
        duration: '12 min',
        completed: true,
      },
      {
        id: 2,
        title: 'Components and Props',
        duration: '18 min',
        completed: true,
      },
      {
        id: 3,
        title: 'Understanding State',
        duration: '22 min',
        completed: false,
        current: true,
      },
      {
        id: 4,
        title: 'Handling Events',
        duration: '15 min',
        completed: false,
      },
    ],
  },
  {
    id: 2,
    title: 'React Hooks',
    lessons: [
      {
        id: 5,
        title: 'Introduction to Hooks',
        duration: '16 min',
        completed: false,
      },
      {
        id: 6,
        title: 'useState Hook',
        duration: '20 min',
        completed: false,
      },
      {
        id: 7,
        title: 'useEffect Hook',
        duration: '24 min',
        completed: false,
      },
    ],
  },
  {
    id: 3,
    title: 'Advanced React',
    lessons: [
      {
        id: 8,
        title: 'Context API',
        duration: '20 min',
        completed: false,
      },
      {
        id: 9,
        title: 'Performance Optimization',
        duration: '25 min',
        completed: false,
      },
      {
        id: 10,
        title: 'Advanced Patterns',
        duration: '30 min',
        completed: false,
      },
    ],
  },
]

function CourseLearning() {
  const [openModules, setOpenModules] = useState<number[]>([1])
  const [completed, setCompleted] = useState(false)

  const toggleModule = (moduleId: number) => {
    setOpenModules((current) =>
      current.includes(moduleId)
        ? current.filter((id) => id !== moduleId)
        : [...current, moduleId],
    )
  }

  const markComplete = () => {
    setCompleted(true)
  }

  return (
    <div className="min-h-screen bg-slate-50">

      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

          <div className="flex items-center gap-3">

            <button className="rounded-xl border border-slate-200 p-2.5 text-slate-600 hover:bg-slate-50">
              <ArrowLeft size={19} />
            </button>

            <div>

              <p className="text-xs font-medium text-purple-600">
                My Course
              </p>

              <h1 className="text-lg font-bold text-slate-900">
                Advanced React Development
              </h1>

            </div>

          </div>

          <div className="hidden items-center gap-3 sm:flex">

            <div className="text-right">

              <p className="text-xs text-slate-400">
                Course Progress
              </p>

              <p className="text-sm font-bold text-slate-800">
                72%
              </p>

            </div>

            <div className="h-2 w-28 rounded-full bg-slate-100">

              <div
                className="h-2 rounded-full bg-purple-600"
                style={{ width: '72%' }}
              />

            </div>

          </div>

        </div>

      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl p-6">

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

          {/* Left - Lesson Content */}
          <div className="lg:col-span-2">

            {/* Breadcrumb */}
            <div className="mb-5 flex items-center gap-2 text-sm text-slate-400">

              <span>Advanced React Development</span>

              <span>/</span>

              <span>React Fundamentals</span>

              <span>/</span>

              <span className="text-slate-700">
                Understanding State
              </span>

            </div>

            {/* Video */}
            <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-sm">

              <div className="flex aspect-video items-center justify-center">

                <div className="text-center">

                  <button className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700">
                    <PlayCircle size={38} />
                  </button>

                  <p className="mt-4 text-sm font-medium text-white">
                    Understanding State in React
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    22 minutes
                  </p>

                </div>

              </div>

            </div>

            {/* Lesson Header */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>

                  <p className="text-sm font-medium text-purple-600">
                    Lesson 3
                  </p>

                  <h2 className="mt-1 text-2xl font-bold text-slate-900">
                    Understanding State
                  </h2>

                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-500">

                    <span className="flex items-center gap-1.5">
                      <Clock3 size={15} />
                      22 minutes
                    </span>

                    <span className="flex items-center gap-1.5">
                      <BookOpen size={15} />
                      React Fundamentals
                    </span>

                  </div>

                </div>

                <button
                  onClick={markComplete}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ${
                    completed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >
                  <CheckCircle2 size={17} />

                  {completed
                    ? 'Completed'
                    : 'Mark as Complete'}
                </button>

              </div>

              {/* Description */}
              <div className="mt-6 border-t border-slate-100 pt-6">

                <h3 className="font-bold text-slate-800">
                  About this lesson
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  In this lesson, you will learn how state works in
                  React applications. We will explore the useState hook,
                  updating state values, and common patterns for managing
                  component state.
                </p>

              </div>

            </div>

            {/* Lesson Notes */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <h3 className="text-lg font-bold text-slate-900">
                Lesson Notes
              </h3>

              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600">

                <p>
                  React state allows components to store and manage
                  information that can change over time.
                </p>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="font-semibold text-slate-800">
                    Key concept
                  </p>

                  <p className="mt-2">
                    When state changes, React automatically re-renders
                    the component so that the user interface reflects
                    the latest data.
                  </p>

                </div>

                <p>
                  The useState hook is one of the most commonly used
                  React hooks for managing local component state.
                </p>

              </div>

            </div>

            {/* Resources */}
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-bold text-slate-900">
                    Lesson Resources
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    Additional material for this lesson.
                  </p>

                </div>

                <FileText
                  size={21}
                  className="text-purple-600"
                />

              </div>

              <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-100 p-4">

                <div className="flex items-center gap-3">

                  <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
                    <FileText size={18} />
                  </div>

                  <div>

                    <p className="text-sm font-medium text-slate-800">
                      React State Cheat Sheet.pdf
                    </p>

                    <p className="text-xs text-slate-400">
                      PDF • 1.2 MB
                    </p>

                  </div>

                </div>

                <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-50">
                  <Download size={18} />
                </button>

              </div>

            </div>

            {/* Navigation */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">

              <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                <ArrowLeft size={17} />
                Previous Lesson
              </button>

              <button className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-medium text-white hover:bg-purple-700">
                Next Lesson
                <ArrowRight size={17} />
              </button>

            </div>

          </div>

          {/* Right - Course Curriculum */}
          <div className="lg:col-span-1">

            <div className="sticky top-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Curriculum Header */}
              <div className="border-b border-slate-200 p-5">

                <h2 className="font-bold text-slate-900">
                  Course Content
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  3 modules • 10 lessons
                </p>

                <div className="mt-4">

                  <div className="flex items-center justify-between text-xs">

                    <span className="text-slate-500">
                      Progress
                    </span>

                    <span className="font-semibold text-purple-600">
                      72%
                    </span>

                  </div>

                  <div className="mt-2 h-2 rounded-full bg-slate-100">

                    <div
                      className="h-2 rounded-full bg-purple-600"
                      style={{ width: '72%' }}
                    />

                  </div>

                </div>

              </div>

              {/* Modules */}
              <div className="max-h-[650px] overflow-y-auto">

                {modules.map((module) => {
                  const isOpen = openModules.includes(module.id)

                  return (
                    <div
                      key={module.id}
                      className="border-b border-slate-100 last:border-b-0"
                    >

                      {/* Module Header */}
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="flex w-full items-center gap-3 p-4 text-left hover:bg-slate-50"
                      >

                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-600">
                          {module.id}
                        </div>

                        <div className="min-w-0 flex-1">

                          <p className="text-sm font-semibold text-slate-800">
                            {module.title}
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {module.lessons.length} lessons
                          </p>

                        </div>

                        {isOpen ? (
                          <ChevronUp
                            size={17}
                            className="text-slate-400"
                          />
                        ) : (
                          <ChevronDown
                            size={17}
                            className="text-slate-400"
                          />
                        )}

                      </button>

                      {/* Lessons */}
                      {isOpen && (
                        <div className="pb-2">

                          {module.lessons.map((lesson) => (
                            <LessonItem
                              key={lesson.id}
                              lesson={lesson}
                            />
                          ))}

                        </div>
                      )}

                    </div>
                  )
                })}

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

/* Lesson Item */

interface LessonItemProps {
  lesson: Lesson
}

function LessonItem({
  lesson,
}: LessonItemProps) {
  return (
    <button
      className={`flex w-full items-center gap-3 px-5 py-3 text-left ${
        lesson.current
          ? 'bg-purple-50'
          : 'hover:bg-slate-50'
      }`}
    >

      <div className="shrink-0">

        {lesson.completed ? (
          <CheckCircle2
            size={17}
            className="text-green-500"
          />
        ) : (
          <PlayCircle
            size={17}
            className={
              lesson.current
                ? 'text-purple-600'
                : 'text-slate-300'
            }
          />
        )}

      </div>

      <div className="min-w-0 flex-1">

        <p
          className={`truncate text-xs font-medium ${
            lesson.current
              ? 'text-purple-700'
              : 'text-slate-700'
          }`}
        >
          {lesson.title}
        </p>

        <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
          <Clock3 size={11} />
          {lesson.duration}
        </p>

      </div>

    </button>
  )
}

export default CourseLearning