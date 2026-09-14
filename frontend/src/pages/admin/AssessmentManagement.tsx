import type { ReactNode } from 'react'

import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
  Shuffle,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'
import { roadmapData } from '../../data/roadmapData'
import { topicQuizData } from '../../data/topicQuizData'

function AssessmentManagement() {
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
          (item) => item.id === topicId
        )
      : undefined

  const quiz =
    roleId && topicId
      ? topicQuizData[
          `${roleId}/${topicId}`
        ]
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

              <ClipboardCheck
                size={40}
                className="mx-auto text-slate-300"
              />

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                Assessment not found
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

  const questionCount =
    quiz?.questions.length ?? 0

  const passingScore =
    quiz?.passingScore ?? 70

  const goBack = () => {
    navigate(
      `/admin/roles/${roleId}/topics/${topicId}`
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
            Back to Topic
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
                Assessment Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage the topic question bank and assessment
                configuration employees must pass to complete
                this topic.
              </p>

            </div>

            <div className="flex flex-wrap gap-3">

              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <Save size={16} />
                Save Draft
              </button>

              <button
                type="button"
                className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Publish Assessment
              </button>

            </div>

          </div>

          {/* Stats */}

          <div className="mt-7 grid gap-4 sm:grid-cols-3">

            <StatCard
              value={questionCount}
              label="Questions"
            />

            <StatCard
              value={`${passingScore}%`}
              label="Passing Score"
            />

            <StatCard
              value={
                quiz
                  ? 'Configured'
                  : 'Missing'
              }
              label="Assessment Status"
            />

          </div>

          {/* Assessment workflow */}

          <div className="mt-7 grid gap-5 lg:grid-cols-3">

            <FeatureCard
              icon={
                <ClipboardCheck size={21} />
              }
              title="Question Bank"
              description="Manage the questions and answer choices used for this topic assessment."
            />

            <FeatureCard
              icon={
                <Shuffle size={21} />
              }
              title="Randomization"
              description="Questions and answer options can be shuffled during each assessment attempt."
            />

            <FeatureCard
              icon={
                <ShieldCheck size={21} />
              }
              title="Assessment Integrity"
              description="The employee assessment already supports camera, screen-share and integrity-event monitoring."
            />

          </div>

          {/* Question bank */}

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Question Bank
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Questions currently configured for {topic.title}.
                </p>

              </div>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                <Plus size={16} />
                Add Question
              </button>

            </div>

            {quiz ? (
              <div className="divide-y divide-slate-100">

                {quiz.questions.map(
                  (question, index) => (
                    <QuestionCard
                      key={`${question.question}-${index}`}
                      number={index + 1}
                      question={question.question}
                      options={question.options}
                      correctAnswer={question.correctAnswer}
                    />
                  )
                )}

              </div>
            ) : (
              <div className="p-10 text-center">

                <ClipboardCheck
                  size={36}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-4 font-semibold text-slate-700">
                  No assessment configured
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Add questions to create an assessment for this topic.
                </p>

              </div>
            )}

          </div>

          {/* Settings */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Settings2 size={21} />
              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  Assessment Settings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Configure how employees complete this assessment.
                </p>

              </div>

            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <SettingField
                label="Passing Score"
              >
                <div className="relative">

                  <input
                    type="number"
                    defaultValue={passingScore}
                    min={1}
                    max={100}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    %
                  </span>

                </div>
              </SettingField>

              <SettingField
                label="Time Limit"
              >
                <div className="relative">

                  <input
                    type="number"
                    defaultValue={10}
                    min={1}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-20 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    minutes
                  </span>

                </div>
              </SettingField>

            </div>

            <div className="mt-6 space-y-4">

              <ToggleRow
                title="Shuffle questions"
                description="Present questions in a different order for each attempt."
              />

              <ToggleRow
                title="Shuffle answer options"
                description="Randomize answer option order for each question."
              />

              <ToggleRow
                title="Require all lessons before assessment"
                description="Assessment remains locked until every lesson in the topic is complete."
              />

              <ToggleRow
                title="Allow assessment retry"
                description="Employees can retry the assessment after a failed attempt."
              />

            </div>

          </div>

          {/* Completion rule */}

          <div className="mt-7 rounded-2xl border border-green-100 bg-green-50 p-5">

            <div className="flex items-start gap-3">

              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-green-600"
              />

              <div>

                <p className="text-sm font-semibold text-green-800">
                  SkillForge topic completion rule
                </p>

                <p className="mt-2 text-sm leading-6 text-green-700">
                  Completing the lessons alone does not complete the topic.
                  Employees must complete every lesson and then pass this
                  assessment before the topic is marked as completed.
                </p>

              </div>

            </div>

          </div>

          {/* Frontend notice */}

          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">

            <p className="text-sm font-semibold text-purple-800">
              Current frontend configuration
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              Assessment questions currently come from topicQuizData.ts.
              Add Question, editing, deleting, saving settings and publishing
              are frontend management controls for now. They will become
              persistent when the assessment APIs and PostgreSQL tables are
              connected.
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

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}

function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  )
}

interface QuestionCardProps {
  number: number
  question: string
  options: string[]
  correctAnswer: number
}

function QuestionCard({
  number,
  question,
  options,
  correctAnswer,
}: QuestionCardProps) {
  return (
    <div className="p-5">

      <div className="flex gap-4">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xs font-bold text-purple-700">
          {String(number).padStart(
            2,
            '0'
          )}
        </div>

        <div className="min-w-0 flex-1">

          <p className="text-sm font-semibold leading-6 text-slate-800">
            {question}
          </p>

          <div className="mt-4 grid gap-2 md:grid-cols-2">

            {options.map(
              (option, index) => {
                const correct =
                  index === correctAnswer

                return (
                  <div
                    key={`${option}-${index}`}
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      correct
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="mr-2 font-semibold">
                      {String.fromCharCode(
                        65 + index
                      )}.
                    </span>

                    {option}
                  </div>
                )
              }
            )}

          </div>

          <div className="mt-4 flex gap-2">

            <button
              type="button"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-purple-200 hover:text-purple-600"
            >
              Edit
            </button>

            <button
              type="button"
              className="rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

interface SettingFieldProps {
  label: string
  children: ReactNode
}

function SettingField({
  label,
  children,
}: SettingFieldProps) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}

    </div>
  )
}

interface ToggleRowProps {
  title: string
  description: string
}

function ToggleRow({
  title,
  description,
}: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4">

      <div>

        <p className="text-sm font-medium text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>

      <button
        type="button"
        className="relative h-6 w-11 shrink-0 rounded-full bg-purple-600"
      >
        <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />
      </button>

    </div>
  )
}

export default AssessmentManagement