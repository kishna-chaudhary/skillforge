import type { ReactNode } from 'react'

import {
  ArrowRight,
  BookOpen,
  Layers3,
  Search,
  Video,
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
import { lessonTitles } from '../../data/lessonTitles'

function LearningContentOverview() {
  const navigate = useNavigate()

  const [search, setSearch] =
    useState('')

  const contentRows =
    useMemo(() => {
      return Object.entries(
        roadmapData
      ).flatMap(
        ([roleId, role]) =>
          role.topics.map(
            (topic) => {
              const lessonKey =
                `${roleId}/${topic.id}`

              const configuredTitles =
                lessonTitles[
                  lessonKey
                ] ?? []

              return {
                roleId,
                roleTitle:
                  role.title,
                topicId:
                  topic.id,
                topicTitle:
                  topic.title,
                description:
                  topic.description,
                duration:
                  topic.duration,
                lessonCount:
                  topic.lessons,
                namedLessonCount:
                  configuredTitles.length,
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
        return contentRows
      }

      return contentRows.filter(
        (row) =>
          row.roleTitle
            .toLowerCase()
            .includes(term) ||
          row.topicTitle
            .toLowerCase()
            .includes(term) ||
          row.description
            .toLowerCase()
            .includes(term)
      )
    }, [
      contentRows,
      search,
    ])

  const totalRoles =
    Object.keys(
      roadmapData
    ).length

  const totalTopics =
    contentRows.length

  const totalLessons =
    contentRows.reduce(
      (total, row) =>
        total +
        row.lessonCount,
      0
    )

  const namedLessons =
    contentRows.reduce(
      (total, row) =>
        total +
        row.namedLessonCount,
      0
    )

  const openTopic = (
    roleId: string,
    topicId: string
  ) => {
    navigate(
      `/admin/roles/${roleId}/topics/${topicId}`
    )
  }

  const openLessons = (
    roleId: string,
    topicId: string
  ) => {
    navigate(
      `/admin/roles/${roleId}/topics/${topicId}/lessons`
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
              Learning Content
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Review the complete SkillForge learning structure
              across career roles, roadmap topics and lessons.
            </p>

          </div>

          {/* Hero */}

          <div className="mt-7 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white lg:p-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">

                  <BookOpen
                    size={23}
                  />

                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  SkillForge Learning Library
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Career learning paths are structured as roles,
                  topics and individual lessons. Admins can open
                  any topic or lesson sequence directly from this
                  workspace.
                </p>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <HeroMetric
                  value={
                    totalRoles
                  }
                  label="Career Roles"
                />

                <HeroMetric
                  value={
                    totalTopics
                  }
                  label="Topics"
                />

                <HeroMetric
                  value={
                    totalLessons
                  }
                  label="Lessons"
                />

                <HeroMetric
                  value={
                    namedLessons
                  }
                  label="Named Lessons"
                />

              </div>

            </div>

          </div>

          {/* Summary */}

          <div className="mt-7 grid gap-4 md:grid-cols-3">

            <SummaryCard
              icon={
                <Layers3
                  size={20}
                />
              }
              value={
                totalRoles
              }
              title="Career Roles"
              description="Structured learning paths available in SkillForge."
            />

            <SummaryCard
              icon={
                <BookOpen
                  size={20}
                />
              }
              value={
                totalTopics
              }
              title="Roadmap Topics"
              description="Topics employees progress through within each career path."
            />

            <SummaryCard
              icon={
                <Video
                  size={20}
                />
              }
              value={
                totalLessons
              }
              title="Learning Lessons"
              description="Individual learning units across every roadmap topic."
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
                    event.target.value
                  )
                }
                placeholder="Search career roles, topics or learning content..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

          </div>

          {/* Content List */}

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <h2 className="text-lg font-bold text-slate-900">
                Learning Content Library
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {filteredRows.length}{' '}
                topics shown
              </p>

            </div>

            {filteredRows.length >
            0 ? (
              <div className="divide-y divide-slate-100">

                {filteredRows.map(
                  (row) => (
                    <ContentRow
                      key={`${row.roleId}/${row.topicId}`}
                      roleTitle={
                        row.roleTitle
                      }
                      topicTitle={
                        row.topicTitle
                      }
                      description={
                        row.description
                      }
                      duration={
                        row.duration
                      }
                      lessonCount={
                        row.lessonCount
                      }
                      namedLessonCount={
                        row.namedLessonCount
                      }
                      onTopic={() =>
                        openTopic(
                          row.roleId,
                          row.topicId
                        )
                      }
                      onLessons={() =>
                        openLessons(
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
                  No learning content found
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Try another role or topic name.
                </p>

              </div>
            )}

          </div>

          {/* Structure */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="font-bold text-slate-900">
              Learning Content Structure
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              SkillForge uses a consistent content hierarchy.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-4">

              <WorkflowCard
                number="01"
                title="Career Role"
                description="Defines the employee career learning path."
              />

              <WorkflowCard
                number="02"
                title="Roadmap Topic"
                description="Breaks the career role into focused learning areas."
              />

              <WorkflowCard
                number="03"
                title="Lessons"
                description="Contains the actual learning sequence and resources."
              />

              <WorkflowCard
                number="04"
                title="Assessment"
                description="Verifies topic knowledge before completion."
              />

            </div>

          </div>

          {/* Notice */}

          <div className="mt-7 rounded-2xl border border-purple-100 bg-purple-50 p-5">

            <p className="text-sm font-semibold text-purple-800">
              Current frontend configuration
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              Learning structure currently comes from roadmapData.ts
              and lessonTitles.ts. When backend integration begins,
              roles, topics, lessons, content and resources will be
              loaded from PostgreSQL through Admin learning APIs.
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
  title: string
  description: string
}

function SummaryCard({
  icon,
  value,
  title,
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
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  )
}

interface ContentRowProps {
  roleTitle: string
  topicTitle: string
  description: string
  duration: string
  lessonCount: number
  namedLessonCount: number
  onTopic: () => void
  onLessons: () => void
}

function ContentRow({
  roleTitle,
  topicTitle,
  description,
  duration,
  lessonCount,
  namedLessonCount,
  onTopic,
  onLessons,
}: ContentRowProps) {
  return (
    <div className="flex flex-col gap-5 p-5 xl:flex-row xl:items-center">

      <div className="min-w-0 flex-1">

        <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
          {roleTitle}
        </p>

        <h3 className="mt-1 text-base font-bold text-slate-900">
          {topicTitle}
        </h3>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">

          <span>
            {lessonCount}{' '}
            {lessonCount === 1
              ? 'lesson'
              : 'lessons'}
          </span>

          <span>•</span>

          <span>
            {duration}
          </span>

          <span>•</span>

          <span>
            {namedLessonCount}{' '}
            named lessons
          </span>

        </div>

      </div>

      <div className="flex flex-col gap-2 sm:flex-row">

        <button
          type="button"
          onClick={onTopic}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:text-purple-600"
        >
          Manage Topic
        </button>

        <button
          type="button"
          onClick={onLessons}
          className="flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-600"
        >
          Manage Lessons

          <ArrowRight
            size={16}
          />
        </button>

      </div>

    </div>
  )
}

interface WorkflowCardProps {
  number: string
  title: string
  description: string
}

function WorkflowCard({
  number,
  title,
  description,
}: WorkflowCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <p className="text-xs font-bold text-purple-600">
        {number}
      </p>

      <p className="mt-3 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  )
}

export default LearningContentOverview