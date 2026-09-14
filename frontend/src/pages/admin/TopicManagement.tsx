import type { ReactNode } from 'react'

import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  GraduationCap,
  ListChecks,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'
import { roadmapData } from '../../data/roadmapData'
import { lessonTitles } from '../../data/lessonTitles'
import { topicQuizData } from '../../data/topicQuizData'

function TopicManagement() {
  const navigate = useNavigate()

  const { roleId, topicId } = useParams<{
    roleId: string
    topicId: string
  }>()

  const role = roleId
    ? roadmapData[roleId]
    : undefined

  const topic =
    role && topicId
      ? role.topics.find(
          (item) => item.id === topicId
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
              <GraduationCap
                size={40}
                className="mx-auto text-slate-300"
              />

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                Topic not found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                The requested career role or roadmap topic
                does not exist.
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

  const lessons = Array.from(
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

  const quiz =
    topicQuizData[
      `${roleId}/${topicId}`
    ]

  const assessmentReady =
    Boolean(quiz)

  const goBackToRole = () => {
    navigate(
      `/admin/roles/${roleId}`
    )
  }

  const manageLessons = () => {
    navigate(
      `/admin/roles/${roleId}/topics/${topicId}/lessons`
    )
  }

  const manageAssessment = () => {
    navigate(
      `/admin/roles/${roleId}/topics/${topicId}/assessment`
    )
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

        <div className="mx-auto max-w-7xl">

          {/* Back */}

          <button
            onClick={goBackToRole}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-purple-600"
          >
            <ArrowLeft size={17} />
            {role.title}
          </button>

          {/* Hero */}

          <div className="mt-6 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-sm lg:p-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-3xl">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">
                  <BookOpenCheck size={23} />
                </div>

                <p className="mt-5 text-sm font-semibold text-purple-300">
                  {role.title}
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  {topic.title}
                </h1>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {topic.description}
                </p>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <HeroMetric
                  value={topic.lessons}
                  label="Lessons"
                />

                <HeroMetric
                  value={topic.duration}
                  label="Duration"
                />

                <HeroMetric
                  value={
                    assessmentReady
                      ? quiz.questions.length
                      : 0
                  }
                  label="Questions"
                />

                <HeroMetric
                  value={
                    assessmentReady
                      ? `${quiz.passingScore}%`
                      : '—'
                  }
                  label="Pass Score"
                />

              </div>

            </div>

          </div>

          {/* Heading */}

          <div className="mt-8">

            <p className="text-sm font-semibold text-purple-600">
              Topic Management
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              Learning Content
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review the lessons and assessment that employees
              complete for this roadmap topic.
            </p>

          </div>

          {/* Management cards */}

          <div className="mt-6 grid gap-5 lg:grid-cols-2">

            <ManagementCard
              icon={
                <FileText size={22} />
              }
              title="Lessons & Resources"
              description="Manage the lesson sequence, learning content, videos, documents and supporting resources for this topic."
              status={`${topic.lessons} ${
                topic.lessons === 1
                  ? 'lesson'
                  : 'lessons'
              } configured`}
              action="Manage Lessons"
              onClick={manageLessons}
            />

            <ManagementCard
              icon={
                <ClipboardCheck size={22} />
              }
              title="Topic Assessment"
              description="Manage the question bank, passing score and assessment configuration required to complete this topic."
              status={
                assessmentReady
                  ? `${quiz.questions.length} questions • ${quiz.passingScore}% passing score`
                  : 'Assessment not configured'
              }
              action="Manage Assessment"
              onClick={manageAssessment}
              ready={assessmentReady}
            />

          </div>

          {/* Lesson sequence */}

          <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <div className="flex items-center gap-2">
                  <ListChecks
                    size={19}
                    className="text-purple-600"
                  />

                  <h2 className="font-bold text-slate-900">
                    Lesson Sequence
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Employees complete these lessons before the
                  topic assessment becomes available.
                </p>

              </div>

              <button
                onClick={manageLessons}
                className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:text-purple-600"
              >
                Manage Lessons
                <ArrowRight size={16} />
              </button>

            </div>

            <div className="divide-y divide-slate-100">

              {lessons.map(
                (lesson, index) => (
                  <div
                    key={lesson.index}
                    className="flex items-center gap-4 p-5"
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xs font-bold text-slate-600">
                      {String(index + 1).padStart(
                        2,
                        '0'
                      )}
                    </div>

                    <div className="min-w-0 flex-1">

                      <p className="truncate text-sm font-semibold text-slate-800">
                        {lesson.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        Lesson {index + 1} of {topic.lessons}
                      </p>

                    </div>

                    <span className="hidden rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700 sm:inline-flex">
                      Learning Content
                    </span>

                  </div>
                )
              )}

            </div>

          </div>

          {/* Completion workflow */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <CheckCircle2 size={21} />
              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  Topic Completion Workflow
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  SkillForge verifies topic completion through
                  lessons and the final assessment.
                </p>

              </div>

            </div>

            <div className="mt-6 grid gap-3 md:grid-cols-3">

              <WorkflowStep
                number="01"
                title="Complete Lessons"
                description={`Employee completes all ${topic.lessons} lessons.`}
              />

              <WorkflowStep
                number="02"
                title="Unlock Assessment"
                description="The topic assessment becomes available only after all lessons are completed."
              />

              <WorkflowStep
                number="03"
                title="Pass Assessment"
                description={
                  assessmentReady
                    ? `Employee must score at least ${quiz.passingScore}% to complete the topic.`
                    : 'An assessment must be configured before topic completion can be verified.'
                }
              />

            </div>

          </div>

          {/* Frontend notice */}

          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">

            <p className="text-sm font-semibold text-purple-800">
              Current frontend configuration
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              Topic metadata currently comes from roadmapData.ts,
              lesson names from lessonTitles.ts, and assessment
              configuration from topicQuizData.ts. Admin editing
              and publishing will become persistent when these
              records move to the backend database.
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

      <p className="text-lg font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {label}
      </p>

    </div>
  )
}

interface ManagementCardProps {
  icon: ReactNode
  title: string
  description: string
  status: string
  action: string
  onClick: () => void
  ready?: boolean
}

function ManagementCard({
  icon,
  title,
  description,
  status,
  action,
  onClick,
  ready = true,
}: ManagementCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>

      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5">

        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            ready
              ? 'bg-green-50 text-green-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {status}
        </span>

      </div>

      <button
        onClick={onClick}
        className="mt-5 flex w-full items-center justify-between rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
      >
        {action}
        <ArrowRight size={16} />
      </button>

    </div>
  )
}

interface WorkflowStepProps {
  number: string
  title: string
  description: string
}

function WorkflowStep({
  number,
  title,
  description,
}: WorkflowStepProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <span className="text-xs font-bold text-purple-600">
        {number}
      </span>

      <p className="mt-3 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  )
}

export default TopicManagement