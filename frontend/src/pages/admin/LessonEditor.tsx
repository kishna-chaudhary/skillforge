import {
  ArrowLeft,
  BookOpen,
  FileText,
  Link,
  PlayCircle,
  Save,
  Upload,
  Video,
} from 'lucide-react'

function LessonEditor() {
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
                Lesson Editor
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create and edit training lesson content.
              </p>
            </div>

          </div>

          <div className="flex gap-3">

            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Save size={17} />
              Save Draft
            </button>

            <button className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
              Publish Lesson
            </button>

          </div>

        </div>

        {/* Lesson Information */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <BookOpen size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Lesson Information
              </h2>

              <p className="text-sm text-slate-500">
                Add the basic details of your lesson.
              </p>
            </div>

          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Lesson Title */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Lesson Title
              </label>

              <input
                type="text"
                placeholder="Enter lesson title"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

            {/* Description */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Lesson Description
              </label>

              <textarea
                rows={4}
                placeholder="Describe what employees will learn in this lesson..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

            {/* Lesson Type */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Lesson Type
              </label>

              <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-purple-500">
                <option>Video Lesson</option>
                <option>Text Lesson</option>
                <option>Document</option>
                <option>External Resource</option>
              </select>

            </div>

            {/* Duration */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Duration
              </label>

              <input
                type="text"
                placeholder="e.g. 25 minutes"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

          </div>

        </div>

        {/* Video Content */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <Video size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Video Content
              </h2>

              <p className="text-sm text-slate-500">
                Upload or add the video for this lesson.
              </p>
            </div>

          </div>

          {/* Upload Area */}
          <div className="mt-6 flex min-h-52 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 transition hover:border-purple-300 hover:bg-purple-50">

            <div className="text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-purple-600 shadow-sm">
                <Upload size={24} />
              </div>

              <p className="mt-4 text-sm font-semibold text-slate-700">
                Upload lesson video
              </p>

              <p className="mt-1 text-xs text-slate-400">
                MP4, WebM or MOV up to 500MB
              </p>

              <button className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-xs font-medium text-white hover:bg-purple-700">
                Choose Video
              </button>

            </div>

          </div>

          {/* Or Video URL */}
          <div className="mt-5">

            <label className="mb-2 block text-sm font-medium text-slate-700">
              Or use a video URL
            </label>

            <div className="relative">

              <Link
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

          </div>

        </div>

        {/* Lesson Content */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <FileText size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Lesson Content
              </h2>

              <p className="text-sm text-slate-500">
                Add notes, explanations, and learning material.
              </p>
            </div>

          </div>

          {/* Simple Editor Toolbar */}
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">

            <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2">

              <button className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-white">
                B
              </button>

              <button className="rounded-lg px-3 py-2 text-sm italic text-slate-600 hover:bg-white">
                I
              </button>

              <button className="rounded-lg px-3 py-2 text-sm underline text-slate-600 hover:bg-white">
                U
              </button>

              <span className="mx-1 border-l border-slate-200" />

              <button className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-white">
                H1
              </button>

              <button className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-white">
                H2
              </button>

              <button className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-white">
                • List
              </button>

            </div>

            <textarea
              rows={10}
              placeholder="Start writing your lesson content..."
              className="w-full resize-none border-0 p-5 text-sm leading-7 text-slate-700 outline-none"
            />

          </div>

        </div>

        {/* Resources */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Lesson Resources
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add additional files or resources for employees.
              </p>

            </div>

            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Upload size={17} />
              Add Resource
            </button>

          </div>

          <div className="mt-5 rounded-xl border border-dashed border-slate-200 p-6 text-center">

            <FileText
              size={24}
              className="mx-auto text-slate-400"
            />

            <p className="mt-2 text-sm font-medium text-slate-600">
              No resources added
            </p>

            <p className="mt-1 text-xs text-slate-400">
              PDFs, documents, presentations, and other learning material
            </p>

          </div>

        </div>

        {/* Lesson Settings */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Lesson Settings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Configure how employees interact with this lesson.
          </p>

          <div className="mt-6 space-y-4">

            <ToggleSetting
              title="Require lesson completion"
              description="Employees must complete this lesson before moving forward."
            />

            <ToggleSetting
              title="Allow video playback speed control"
              description="Employees can change the playback speed of the lesson video."
            />

            <ToggleSetting
              title="Enable lesson comments"
              description="Allow employees to discuss the lesson content."
            />

          </div>

        </div>

        {/* Preview */}
        <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-6">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <PlayCircle
                size={22}
                className="text-purple-600"
              />

              <div>

                <h2 className="font-bold text-purple-900">
                  Preview Lesson
                </h2>

                <p className="mt-1 text-sm text-purple-700">
                  See how this lesson will appear to employees.
                </p>

              </div>

            </div>

            <button className="rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-medium text-purple-700 hover:bg-purple-50">
              Preview
            </button>

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
            Publish Lesson
          </button>

        </div>

      </div>
    </div>
  )
}

/* Toggle Setting */

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

export default LessonEditor