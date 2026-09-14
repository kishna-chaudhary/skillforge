import {
  ArrowLeft,
  BookOpen,
  ChevronUp,
  Edit3,
  GripVertical,
  Image,
  Plus,
  Save,
  Trash2,
  Video,
} from 'lucide-react'

function CourseBuilder() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <button className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50">
              <ArrowLeft size={19} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Course Builder
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create and organize your training course.
              </p>
            </div>

          </div>

          <div className="flex gap-3">

            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Save size={17} />
              Save Draft
            </button>

            <button className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
              Publish Course
            </button>

          </div>

        </div>

        {/* Course Information */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <BookOpen size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Course Information
              </h2>

              <p className="text-sm text-slate-500">
                Basic information about your course.
              </p>
            </div>

          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Course Title */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Course Title
              </label>

              <input
                type="text"
                placeholder="Enter course title"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

            {/* Description */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                rows={5}
                placeholder="Describe what employees will learn in this course..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

            {/* Category */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Category
              </label>

              <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-purple-500">
                <option>Select category</option>
                <option>Web Development</option>
                <option>Backend Development</option>
                <option>Software Development</option>
                <option>Data Analytics</option>
                <option>Design</option>
              </select>

            </div>

            {/* Level */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Difficulty Level
              </label>

              <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-purple-500">
                <option>Select level</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>

            </div>

          </div>

          {/* Thumbnail */}
          <div className="mt-6">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Course Thumbnail
            </label>

            <div className="flex min-h-40 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-purple-300 hover:bg-purple-50">

              <div className="text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white text-purple-600 shadow-sm">
                  <Image size={22} />
                </div>

                <p className="mt-3 text-sm font-medium text-slate-700">
                  Upload course thumbnail
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  PNG, JPG or WEBP up to 5MB
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* Curriculum */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Course Curriculum
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Organize your course into modules and lessons.
              </p>

            </div>

            <button className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
              <Plus size={17} />
              Add Module
            </button>

          </div>

          {/* Module 1 */}
          <Module
            number="01"
            title="Introduction to React"
            lessons={[
              'Introduction to React',
              'Components and Props',
              'State and Events',
            ]}
          />

          {/* Module 2 */}
          <Module
            number="02"
            title="Advanced React Concepts"
            lessons={[
              'React Hooks',
              'Context API',
              'Performance Optimization',
            ]}
          />

        </div>

        {/* Course Settings */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Course Settings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Configure additional course options.
          </p>

          <div className="mt-6 space-y-4">

            <ToggleSetting
              title="Allow employees to retake quizzes"
              description="Employees can attempt failed quizzes again."
            />

            <ToggleSetting
              title="Require lessons to be completed in order"
              description="Employees must complete lessons sequentially."
            />

            <ToggleSetting
              title="Automatically issue certificate"
              description="Issue a certificate when an employee completes the course."
            />

          </div>

        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

          <button className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </button>

          <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Save size={17} />
            Save Draft
          </button>

          <button className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
            Publish Course
          </button>

        </div>

      </div>
    </div>
  )
}

/* Module */

interface ModuleProps {
  number: string
  title: string
  lessons: string[]
}

function Module({
  number,
  title,
  lessons,
}: ModuleProps) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">

      {/* Module Header */}
      <div className="flex items-center gap-3 bg-slate-50 p-4">

        <GripVertical
          size={18}
          className="cursor-grab text-slate-400"
        />

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-xs font-bold text-purple-600">
          {number}
        </div>

        <div className="flex-1">

          <p className="text-sm font-semibold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {lessons.length} lessons
          </p>

        </div>

        <button className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-slate-600">
          <ChevronUp size={18} />
        </button>

        <button className="rounded-lg p-2 text-slate-400 hover:bg-white hover:text-red-600">
          <Trash2 size={17} />
        </button>

      </div>

      {/* Lessons */}
      <div className="divide-y divide-slate-100">

        {lessons.map((lesson, index) => (
          <Lesson
            key={lesson}
            number={index + 1}
            title={lesson}
          />
        ))}

      </div>

      {/* Add Lesson */}
      <button className="flex w-full items-center justify-center gap-2 border-t border-slate-100 px-4 py-3 text-sm font-medium text-purple-600 hover:bg-purple-50">
        <Plus size={16} />
        Add Lesson
      </button>

    </div>
  )
}

/* Lesson */

interface LessonProps {
  number: number
  title: string
}

function Lesson({
  number,
  title,
}: LessonProps) {
  return (
    <div className="flex items-center gap-3 p-4">

      <GripVertical
        size={17}
        className="cursor-grab text-slate-300"
      />

      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-xs font-medium text-slate-500">
        {number}
      </div>

      <div className="flex flex-1 items-center gap-2">

        <Video
          size={16}
          className="text-purple-500"
        />

        <span className="text-sm text-slate-700">
          {title}
        </span>

      </div>

      <button className="rounded-lg p-2 text-slate-400 hover:bg-purple-50 hover:text-purple-600">
        <Edit3 size={16} />
      </button>

      <button className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
        <Trash2 size={16} />
      </button>

    </div>
  )
}

/* Toggle */

interface ToggleSettingProps {
  title: string
  description: string
}

function ToggleSetting({
  title,
  description,
}: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4">

      <div>

        <p className="text-sm font-medium text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>

      </div>

      <button className="relative h-6 w-11 shrink-0 rounded-full bg-purple-600">

        <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />

      </button>

    </div>
  )
}

export default CourseBuilder