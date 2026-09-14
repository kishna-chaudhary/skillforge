import type { ReactNode } from 'react'

import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  FileText,
  Link,
  PlayCircle,
  Save,
  Upload,
  Video,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'
import { roadmapData } from '../../data/roadmapData'
import { lessonTitles } from '../../data/lessonTitles'

function LessonContentEditor() {
  const navigate = useNavigate()

  const {
    roleId,
    topicId,
    lessonIndex,
  } = useParams<{
    roleId: string
    topicId: string
    lessonIndex: string
  }>()

  const role =
    roleId
      ? roadmapData[roleId]
      : undefined

  const topic =
    role && topicId
      ? role.topics.find(
          (item) =>
            item.id === topicId
        )
      : undefined

  const parsedLessonIndex =
    lessonIndex !== undefined
      ? Number(lessonIndex)
      : NaN

  const lessonExists =
    Number.isInteger(
      parsedLessonIndex
    ) &&
    parsedLessonIndex >= 0 &&
    topic &&
    parsedLessonIndex <
      topic.lessons

  if (
    !role ||
    !topic ||
    !roleId ||
    !topicId ||
    !lessonExists
  ) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

          <div className="mx-auto max-w-6xl">

            <button
              onClick={() =>
                navigate(
                  '/admin/roles'
                )
              }
              className="flex items-center gap-2 text-sm font-semibold text-purple-600"
            >
              <ArrowLeft
                size={17}
              />

              Back to Career Roles
            </button>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <BookOpen
                size={40}
                className="mx-auto text-slate-300"
              />

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                Lesson not found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                The requested role,
                topic or lesson does
                not exist.
              </p>

            </div>

          </div>

        </div>
      </AdminLayout>
    )
  }

  const lessonKey =
    `${roleId}/${topicId}`

  const configuredTitles =
    lessonTitles[lessonKey] ?? []

  const lessonTitle =
    configuredTitles[
      parsedLessonIndex
    ] ??
    (
      topic.lessons === 1
        ? `${topic.title} Project`
        : `${topic.title} - Lesson ${parsedLessonIndex + 1}`
    )

  const goBack = () => {
    navigate(
      `/admin/roles/${roleId}/topics/${topicId}/lessons`
    )
  }

  return (
    <AdminLayout>

      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

        <div className="mx-auto max-w-7xl">

          {/* Back */}

          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-purple-600"
          >
            <ArrowLeft
              size={17}
            />

            Back to Lessons
          </button>

          {/* Header */}

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-sm font-semibold text-purple-600">
                {role.title}
                {' • '}
                {topic.title}
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-950">
                {lessonTitle}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Lesson{' '}
                {parsedLessonIndex + 1}{' '}
                of{' '}
                {topic.lessons}
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Save
                  size={16}
                />

                Save Draft
              </button>

              <button
                type="button"
                className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Publish Lesson
              </button>

            </div>

          </div>

          {/* Lesson information */}

          <Section
            icon={
              <BookOpen size={21} />
            }
            title="Lesson Information"
            description="Configure the basic lesson details employees will see."
          >
            <div className="grid gap-5 md:grid-cols-2">

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Lesson Title
                </label>

                <input
                  type="text"
                  defaultValue={
                    lessonTitle
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

              </div>

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

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Content Type
                </label>

                <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-purple-500">
                  <option>
                    Mixed Content
                  </option>

                  <option>
                    Video Lesson
                  </option>

                  <option>
                    Text Lesson
                  </option>

                  <option>
                    Project
                  </option>
                </select>

              </div>

              <div>

                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Estimated Duration
                </label>

                <input
                  type="text"
                  placeholder="e.g. 25 minutes"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

              </div>

            </div>
          </Section>

          {/* Written content */}

          <Section
            icon={
              <FileText size={21} />
            }
            title="Lesson Content"
            description="Add the main written explanation, notes and learning material."
          >

            <div className="overflow-hidden rounded-xl border border-slate-200">

              <div className="flex flex-wrap gap-1 border-b border-slate-200 bg-slate-50 p-2">

                <ToolbarButton>
                  B
                </ToolbarButton>

                <ToolbarButton>
                  I
                </ToolbarButton>

                <ToolbarButton>
                  H1
                </ToolbarButton>

                <ToolbarButton>
                  H2
                </ToolbarButton>

                <ToolbarButton>
                  • List
                </ToolbarButton>

              </div>

              <textarea
                rows={14}
                placeholder="Write the lesson explanation, concepts, examples and instructions here..."
                className="w-full resize-none border-0 p-5 text-sm leading-7 text-slate-700 outline-none"
              />

            </div>

          </Section>

          {/* Video */}

          <Section
            icon={
              <Video size={21} />
            }
            title="Video Content"
            description="Attach an uploaded video or an external lesson video."
          >

            <div className="grid gap-5 lg:grid-cols-2">

              <div className="flex min-h-56 items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50">

                <div className="text-center">

                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-purple-600 shadow-sm">

                    <Upload
                      size={23}
                    />

                  </div>

                  <p className="mt-4 text-sm font-semibold text-slate-700">
                    Upload lesson video
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    MP4, WebM or MOV
                  </p>

                  <button
                    type="button"
                    className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-700"
                  >
                    Choose Video
                  </button>

                </div>

              </div>

              <div className="rounded-2xl border border-slate-200 p-5">

                <div className="flex items-center gap-2">

                  <Link
                    size={18}
                    className="text-purple-600"
                  />

                  <h3 className="text-sm font-bold text-slate-900">
                    External Video URL
                  </h3>

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Use a hosted video URL when the lesson video is stored externally.
                </p>

                <input
                  type="text"
                  placeholder="https://..."
                  className="mt-5 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

                <div className="mt-4 rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">

                    <PlayCircle
                      size={17}
                    />

                    Video preview
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    A preview can be shown here after a valid video source is configured.
                  </p>

                </div>

              </div>

            </div>

          </Section>

          {/* Resources */}

          <Section
            icon={
              <ExternalLink
                size={21}
              />
            }
            title="Learning Resources"
            description="Attach supporting links, documents and downloadable references."
          >

            <div className="grid gap-4 md:grid-cols-2">

              <ResourceCard
                icon={
                  <Link
                    size={19}
                  />
                }
                title="External Link"
                description="Documentation, articles, tutorials or reference websites."
              />

              <ResourceCard
                icon={
                  <FileText
                    size={19}
                  />
                }
                title="Document"
                description="PDFs, guides, presentations or supporting documents."
              />

            </div>

            <button
              type="button"
              className="mt-5 flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:text-purple-600"
            >
              <Upload
                size={16}
              />

              Add Resource
            </button>

          </Section>

          {/* Publishing */}

          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">

            <p className="text-sm font-semibold text-purple-800">
              Frontend management prototype
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              These controls currently demonstrate the Admin lesson-management workflow.
              Saving, uploading files, publishing, editing lesson content and updating
              lesson titles will become persistent when the backend learning-content APIs
              and PostgreSQL storage are connected.
            </p>

          </div>

          {/* Bottom controls */}

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
              <Save
                size={16}
              />

              Save Draft
            </button>

            <button
              type="button"
              className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Publish Lesson
            </button>

          </div>

        </div>

      </div>

    </AdminLayout>
  )
}

interface SectionProps {
  icon: ReactNode
  title: string
  description: string
  children: ReactNode
}

function Section({
  icon,
  title,
  description,
  children,
}: SectionProps) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          {icon}
        </div>

        <div>

          <h2 className="font-bold text-slate-900">
            {title}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>

        </div>

      </div>

      <div className="mt-6">
        {children}
      </div>

    </section>
  )
}

interface ToolbarButtonProps {
  children: ReactNode
}

function ToolbarButton({
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-white"
    >
      {children}
    </button>
  )
}

interface ResourceCardProps {
  icon: ReactNode
  title: string
  description: string
}

function ResourceCard({
  icon,
  title,
  description,
}: ResourceCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">

      <div className="flex items-center gap-2 text-purple-600">
        {icon}

        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>
      </div>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  )
}

export default LessonContentEditor