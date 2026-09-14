import type { ReactNode } from 'react'

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FileText,
  GripVertical,
  Pencil,
  Plus,
  Video,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'
import { roadmapData } from '../../data/roadmapData'
import { lessonTitles } from '../../data/lessonTitles'

function LessonManagement() {
  const navigate = useNavigate()

  const {
    roleId,
    topicId,
  } = useParams<{
    roleId: string
    topicId: string
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

  if (
    !role ||
    !topic ||
    !roleId ||
    !topicId
  ) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

          <div className="mx-auto max-w-6xl">

            <button
              onClick={() =>
                navigate('/admin/roles')
              }
              className="flex items-center gap-2 text-sm font-semibold text-purple-600"
            >
              <ArrowLeft size={17} />
              Back to Career Roles
            </button>

            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <BookOpen
                size={40}
                className="mx-auto text-slate-300"
              />

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                Topic not found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                The requested role or topic does not exist.
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

  const lessons =
    Array.from(
      {
        length: topic.lessons,
      },
      (_, index) => ({
        index,
        title:
          configuredTitles[index] ??
          (
            topic.lessons === 1
              ? `${topic.title} Project`
              : `${topic.title} - Lesson ${index + 1}`
          ),
      })
    )

  const goBack = () => {
    navigate(
      `/admin/roles/${roleId}/topics/${topicId}`
    )
  }

  const editLesson = (
    lessonIndex: number
  ) => {
    navigate(
      `/admin/roles/${roleId}/topics/${topicId}/lessons/${lessonIndex}`
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
            <ArrowLeft size={17} />
            {topic.title}
          </button>

          {/* Header */}

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-sm font-semibold text-purple-600">
                {role.title}
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-950">
                Lesson Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage the lesson sequence and learning content
                for {topic.title}.
              </p>

            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              <Plus size={17} />
              Add Lesson
            </button>

          </div>

          {/* Stats */}

          <div className="mt-7 grid gap-4 sm:grid-cols-3">

            <StatCard
              value={topic.lessons}
              label="Total Lessons"
            />

            <StatCard
              value={topic.duration}
              label="Topic Duration"
            />

            <StatCard
              value={configuredTitles.length}
              label="Named Lessons"
            />

          </div>

          {/* Lesson list */}

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <h2 className="text-lg font-bold text-slate-900">
                Lesson Sequence
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Lessons are completed in this order before the
                topic assessment becomes available.
              </p>

            </div>

            <div className="divide-y divide-slate-100">

              {lessons.map(
                (
                  lesson,
                  index
                ) => (
                  <LessonRow
                    key={lesson.index}
                    number={index + 1}
                    title={lesson.title}
                    onEdit={() =>
                      editLesson(
                        lesson.index
                      )
                    }
                  />
                )
              )}

            </div>

          </div>

          {/* Workflow */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="font-bold text-slate-900">
              Lesson Content Workflow
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Each lesson can contain structured learning content
              and supporting resources.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-4">

              <WorkflowCard
                icon={
                  <FileText size={19} />
                }
                number="01"
                title="Lesson Content"
                description="Add explanations, notes and structured learning material."
              />

              <WorkflowCard
                icon={
                  <Video size={19} />
                }
                number="02"
                title="Video"
                description="Attach a lesson video or external learning video."
              />

              <WorkflowCard
                icon={
                  <BookOpen size={19} />
                }
                number="03"
                title="Resources"
                description="Add documents, PDFs, references and supporting links."
              />

              <WorkflowCard
                icon={
                  <ArrowRight size={19} />
                }
                number="04"
                title="Publish"
                description="Make the completed lesson available to employees."
              />

            </div>

          </div>

          {/* Notice */}

          <div className="mt-7 rounded-2xl border border-purple-100 bg-purple-50 p-5">

            <p className="text-sm font-semibold text-purple-800">
              Current frontend configuration
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              Lesson names currently come from lessonTitles.ts.
              The Add Lesson, reorder, delete and publish actions
              will become persistent when lesson management is
              connected to PostgreSQL through the backend API.
            </p>

          </div>

        </div>

      </div>

    </AdminLayout>
  )
}

interface StatCardProps {
  value: number | string
  label: string
}

function StatCard({
  value,
  label,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-2xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>

    </div>
  )
}

interface LessonRowProps {
  number: number
  title: string
  onEdit: () => void
}

function LessonRow({
  number,
  title,
  onEdit,
}: LessonRowProps) {
  return (
    <div className="flex items-center gap-4 p-5 transition hover:bg-slate-50">

      <GripVertical
        size={18}
        className="shrink-0 text-slate-300"
      />

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xs font-bold text-purple-700">
        {String(number).padStart(
          2,
          '0'
        )}
      </div>

      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          Lesson {number}
        </p>

      </div>

      <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:inline-flex">
        Learning Content
      </span>

      <button
        onClick={onEdit}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:text-purple-600"
      >
        <Pencil size={15} />

        <span className="hidden sm:inline">
          Edit Lesson
        </span>
      </button>

    </div>
  )
}

interface WorkflowCardProps {
  icon: ReactNode
  number: string
  title: string
  description: string
}

function WorkflowCard({
  icon,
  number,
  title,
  description,
}: WorkflowCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <div className="flex items-center justify-between">

        <div className="text-purple-600">
          {icon}
        </div>

        <span className="text-xs font-bold text-purple-600">
          {number}
        </span>

      </div>

      <p className="mt-4 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  )
}

export default LessonManagement