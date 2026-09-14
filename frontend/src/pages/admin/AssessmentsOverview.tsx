import type { ReactNode } from 'react'

import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Search,
  ShieldCheck,
  XCircle,
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
import { topicQuizData } from '../../data/topicQuizData'

function AssessmentsOverview() {
  const navigate = useNavigate()

  const [search, setSearch] =
    useState('')

  const assessmentRows =
    useMemo(() => {
      return Object.entries(
        roadmapData
      ).flatMap(
        ([roleId, role]) =>
          role.topics.map(
            (topic) => {
              const quiz =
                topicQuizData[
                  `${roleId}/${topic.id}`
                ]

              return {
                roleId,
                roleTitle:
                  role.title,
                topicId:
                  topic.id,
                topicTitle:
                  topic.title,
                lessons:
                  topic.lessons,
                duration:
                  topic.duration,
                configured:
                  Boolean(quiz),
                questions:
                  quiz?.questions
                    .length ?? 0,
                passingScore:
                  quiz?.passingScore ??
                  null,
              }
            }
          )
      )
    }, [])

  const filteredRows =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase()

      if (!term) {
        return assessmentRows
      }

      return assessmentRows.filter(
        (row) =>
          row.roleTitle
            .toLowerCase()
            .includes(term) ||
          row.topicTitle
            .toLowerCase()
            .includes(term)
      )
    }, [
      assessmentRows,
      search,
    ])

  const totalAssessments =
    assessmentRows.length

  const configuredCount =
    assessmentRows.filter(
      (row) => row.configured
    ).length

  const missingCount =
    totalAssessments -
    configuredCount

  const coverage =
    totalAssessments > 0
      ? Math.round(
          (
            configuredCount /
            totalAssessments
          ) *
            100
        )
      : 0

  const manageAssessment = (
    roleId: string,
    topicId: string
  ) => {
    navigate(
      `/admin/roles/${roleId}/topics/${topicId}/assessment`
    )
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

        <div className="mx-auto max-w-7xl">

          {/* Header */}

          <div>

            <p className="text-sm font-semibold text-purple-600">
              Learning Management
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              Assessments
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Review assessment coverage across all career roles
              and roadmap topics, then manage each topic's
              question bank and assessment settings.
            </p>

          </div>

          {/* Hero */}

          <div className="mt-7 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white lg:p-8">

            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">

                  <ClipboardCheck
                    size={23}
                  />

                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  Topic Assessment Coverage
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Every roadmap topic should have an assessment
                  so employee topic completion can be verified.
                </p>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <HeroMetric
                  value={
                    totalAssessments
                  }
                  label="Topics"
                />

                <HeroMetric
                  value={
                    configuredCount
                  }
                  label="Configured"
                />

                <HeroMetric
                  value={
                    missingCount
                  }
                  label="Missing"
                />

                <HeroMetric
                  value={`${coverage}%`}
                  label="Coverage"
                />

              </div>

            </div>

          </div>

          {/* Summary Cards */}

          <div className="mt-7 grid gap-4 sm:grid-cols-3">

            <SummaryCard
              icon={
                <ClipboardCheck
                  size={20}
                />
              }
              value={
                configuredCount
              }
              label="Configured Assessments"
              description="Topics with an existing question bank."
            />

            <SummaryCard
              icon={
                <XCircle
                  size={20}
                />
              }
              value={
                missingCount
              }
              label="Missing Assessments"
              description="Topics without assessment configuration."
            />

            <SummaryCard
              icon={
                <ShieldCheck
                  size={20}
                />
              }
              value={`${coverage}%`}
              label="Assessment Coverage"
              description="Percentage of roadmap topics with assessments."
            />

          </div>

          {/* Search */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(
                  event
                ) =>
                  setSearch(
                    event.target
                      .value
                  )
                }
                placeholder="Search by career role or topic..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

          </div>

          {/* Assessment List */}

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <h2 className="text-lg font-bold text-slate-900">
                Topic Assessments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredRows.length}{' '}
                assessment records shown
              </p>

            </div>

            {filteredRows.length >
            0 ? (
              <div className="divide-y divide-slate-100">

                {filteredRows.map(
                  (row) => (
                    <AssessmentRow
                      key={`${row.roleId}/${row.topicId}`}
                      roleTitle={
                        row.roleTitle
                      }
                      topicTitle={
                        row.topicTitle
                      }
                      lessons={
                        row.lessons
                      }
                      duration={
                        row.duration
                      }
                      configured={
                        row.configured
                      }
                      questions={
                        row.questions
                      }
                      passingScore={
                        row.passingScore
                      }
                      onManage={() =>
                        manageAssessment(
                          row.roleId,
                          row.topicId
                        )
                      }
                    />
                  )
                )}

              </div>
            ) : (
              <div className="p-10 text-center">

                <Search
                  size={34}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-4 font-semibold text-slate-700">
                  No assessments found
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Try another career
                  role or topic name.
                </p>

              </div>
            )}

          </div>

          {/* Rule */}

          <div className="mt-7 rounded-2xl border border-green-100 bg-green-50 p-5">

            <div className="flex items-start gap-3">

              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-green-600"
              />

              <div>

                <p className="text-sm font-semibold text-green-800">
                  Completion verification
                </p>

                <p className="mt-2 text-sm leading-6 text-green-700">
                  SkillForge only marks a topic complete after all
                  required lessons are completed and the employee
                  passes the topic assessment.
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
              Assessment coverage is currently derived from
              roadmapData.ts and topicQuizData.ts. Once the
              backend is connected, this page will retrieve
              assessment records, question banks and publishing
              status from PostgreSQL through the API.
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

      <p className="text-xl font-bold text-white">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-400">
        {label}
      </p>

    </div>
  )
}

interface SummaryCardProps {
  icon: ReactNode
  value: number | string
  label: string
  description: string
}

function SummaryCard({
  icon,
  value,
  label,
  description,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>

      <p className="mt-4 text-2xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-800">
        {label}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  )
}

interface AssessmentRowProps {
  roleTitle: string
  topicTitle: string
  lessons: number
  duration: string
  configured: boolean
  questions: number
  passingScore: number | null
  onManage: () => void
}

function AssessmentRow({
  roleTitle,
  topicTitle,
  lessons,
  duration,
  configured,
  questions,
  passingScore,
  onManage,
}: AssessmentRowProps) {
  return (
    <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center">

      <div className="min-w-0 flex-1">

        <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
          {roleTitle}
        </p>

        <h3 className="mt-1 text-base font-bold text-slate-900">
          {topicTitle}
        </h3>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">

          <span>
            {lessons}{' '}
            {lessons === 1
              ? 'lesson'
              : 'lessons'}
          </span>

          <span>•</span>

          <span>
            {duration}
          </span>

          {configured && (
            <>
              <span>•</span>

              <span>
                {questions}{' '}
                questions
              </span>

              <span>•</span>

              <span>
                {passingScore}%
                pass score
              </span>
            </>
          )}

        </div>

      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

        <span
          className={`inline-flex justify-center rounded-full px-3 py-1.5 text-xs font-semibold ${
            configured
              ? 'bg-green-50 text-green-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {configured
            ? 'Configured'
            : 'Missing'}
        </span>

        <button
          type="button"
          onClick={onManage}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600"
        >
          {configured
            ? 'Manage Assessment'
            : 'Create Assessment'}

          <ArrowRight
            size={16}
          />
        </button>

      </div>

    </div>
  )
}

export default AssessmentsOverview