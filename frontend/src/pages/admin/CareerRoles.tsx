import type { ReactNode } from 'react'

import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  Layers3,
  Search,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'
import { roadmapData } from '../../data/roadmapData'

function CareerRoles() {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] =
    useState('')

  const roles =
    useMemo(() => {
      return Object.entries(
        roadmapData
      ).map(
        ([roleId, role]) => {
          const lessonCount =
            role.topics.reduce(
              (
                total,
                topic
              ) =>
                total +
                topic.lessons,
              0
            )

          return {
            roleId,
            title: role.title,
            description:
              role.description,
            topics:
              role.topics.length,
            lessons:
              lessonCount,
          }
        }
      )
    }, [])

  const filteredRoles =
    roles.filter((role) => {
      const query =
        searchTerm
          .trim()
          .toLowerCase()

      if (!query) {
        return true
      }

      return (
        role.title
          .toLowerCase()
          .includes(query) ||
        role.description
          .toLowerCase()
          .includes(query)
      )
    })

  const totalTopics =
    roles.reduce(
      (
        total,
        role
      ) =>
        total +
        role.topics,
      0
    )

  const totalLessons =
    roles.reduce(
      (
        total,
        role
      ) =>
        total +
        role.lessons,
      0
    )

  return (
    <AdminLayout>

      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div>

            <p className="text-sm font-semibold text-purple-600">
              Learning Management
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-950">
              Career Roles
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage the career
              learning paths available
              to employees across
              SkillForge.
            </p>

          </div>

          {/* SUMMARY */}

          <div className="mt-8 grid gap-4 sm:grid-cols-3">

            <StatCard
              icon={
                <BriefcaseBusiness
                  size={21}
                />
              }
              value={
                roles.length
              }
              label="Career Roles"
            />

            <StatCard
              icon={
                <Layers3
                  size={21}
                />
              }
              value={
                totalTopics
              }
              label="Roadmap Topics"
            />

            <StatCard
              icon={
                <BookOpenCheck
                  size={21}
                />
              }
              value={
                totalLessons
              }
              label="Learning Lessons"
            />

          </div>

          {/* SEARCH */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="relative max-w-xl">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={
                  searchTerm
                }
                onChange={(
                  event
                ) =>
                  setSearchTerm(
                    event.target
                      .value
                  )
                }
                placeholder="Search career roles..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

          </div>

          {/* ROLE GRID */}

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredRoles.map(
              (role) => (
                <RoleCard
                  key={
                    role.roleId
                  }
                  title={
                    role.title
                  }
                  description={
                    role.description
                  }
                  topics={
                    role.topics
                  }
                  lessons={
                    role.lessons
                  }
                  onManage={() =>
                    navigate(
                      `/admin/roles/${role.roleId}`
                    )
                  }
                />
              )
            )}

          </div>

          {/* EMPTY SEARCH STATE */}

          {filteredRoles.length ===
            0 && (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">

              <BriefcaseBusiness
                size={32}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-4 font-semibold text-slate-800">
                No career roles
                found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Try a different
                search term.
              </p>

            </div>
          )}

          {/* FRONTEND STATUS */}

          <div className="mt-8 rounded-2xl border border-purple-100 bg-purple-50 p-5">

            <p className="text-sm font-semibold text-purple-800">
              Frontend configuration
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              These career roles are
              currently loaded from
              roadmapData.ts. Creating,
              editing, deleting and
              publishing roles will be
              connected to the backend
              and PostgreSQL during the
              persistence phase.
            </p>

          </div>

        </div>

      </div>

    </AdminLayout>
  )
}

/* ==================================================
   STAT CARD
================================================== */

interface StatCardProps {
  icon: ReactNode
  value: number
  label: string
}

function StatCard({
  icon,
  value,
  label,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-center gap-4">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          {icon}
        </div>

        <div>

          <p className="text-2xl font-bold text-slate-950">
            {value}
          </p>

          <p className="text-sm text-slate-500">
            {label}
          </p>

        </div>

      </div>

    </div>
  )
}

/* ==================================================
   ROLE CARD
================================================== */

interface RoleCardProps {
  title: string
  description: string
  topics: number
  lessons: number
  onManage: () => void
}

function RoleCard({
  title,
  description,
  topics,
  lessons,
  onManage,
}: RoleCardProps) {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-purple-200 hover:shadow-md">

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">

        <BriefcaseBusiness
          size={22}
        />

      </div>

      <h2 className="mt-5 text-lg font-bold text-slate-900">
        {title}
      </h2>

      <p className="mt-2 flex-1 text-sm leading-6 text-slate-500">
        {description}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3">

        <Metric
          value={topics}
          label="Topics"
        />

        <Metric
          value={lessons}
          label="Lessons"
        />

      </div>

      <button
        onClick={
          onManage
        }
        className="mt-5 flex w-full items-center justify-between rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-600"
      >

        Manage Role

        <ArrowRight
          size={17}
        />

      </button>

    </div>
  )
}

/* ==================================================
   METRIC
================================================== */

interface MetricProps {
  value: number
  label: string
}

function Metric({
  value,
  label,
}: MetricProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">

      <p className="text-lg font-bold text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {label}
      </p>

    </div>
  )
}

export default CareerRoles