import type { ReactNode } from 'react'

import {
  BriefcaseBusiness,
  CheckCircle2,
  Search,
  ShieldCheck,
  TrendingUp,
  UserPlus,
  Users,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import AdminLayout from '../../layouts/AdminLayout'
import { roadmapData } from '../../data/roadmapData'

interface EmployeePrototype {
  name: string
  email: string
  assignedRoleId: string
  status: 'Active'
}

/*
  Temporary frontend prototype data.

  This is intentionally kept small and clearly separated from
  real employee records. It will be removed when the backend
  employee API is connected.
*/
const prototypeEmployees: EmployeePrototype[] = [
  {
    name: 'Rahul',
    email: 'Available after backend integration',
    assignedRoleId: 'devops-engineer',
    status: 'Active',
  },
]

function Employees() {
  const [search, setSearch] =
    useState('')

  const [roleFilter, setRoleFilter] =
    useState('all')

  const filteredEmployees =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase()

      return prototypeEmployees.filter(
        (employee) => {
          const role =
            roadmapData[
              employee.assignedRoleId
            ]

          const matchesSearch =
            !term ||
            employee.name
              .toLowerCase()
              .includes(term) ||
            role?.title
              .toLowerCase()
              .includes(term)

          const matchesRole =
            roleFilter === 'all' ||
            employee.assignedRoleId ===
              roleFilter

          return (
            matchesSearch &&
            matchesRole
          )
        }
      )
    }, [
      search,
      roleFilter,
    ])

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

        <div className="mx-auto max-w-7xl">

          {/* Header */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-sm font-semibold text-purple-600">
                Employee Management
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-950">
                Employees
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
                Manage employee accounts, assign career learning
                paths and review employee learning status.
              </p>

            </div>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              <UserPlus size={17} />
              Add Employee
            </button>

          </div>

          {/* Hero */}

          <div className="mt-7 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white lg:p-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">

                  <Users size={23} />

                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  Employee Learning Management
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  Employee accounts will connect users to career
                  roles, learning progress, assessments and
                  certificates through one centralized profile.
                </p>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <HeroMetric
                  value="API"
                  label="Employee Source"
                />

                <HeroMetric
                  value={
                    Object.keys(
                      roadmapData
                    ).length
                  }
                  label="Career Roles"
                />

                <HeroMetric
                  value="RBAC"
                  label="Access Control"
                />

                <HeroMetric
                  value="PostgreSQL"
                  label="Future Storage"
                />

              </div>

            </div>

          </div>

          {/* Management capabilities */}

          <div className="mt-7 grid gap-4 md:grid-cols-3">

            <CapabilityCard
              icon={
                <Users size={20} />
              }
              title="Employee Accounts"
              description="Create and manage employee learning accounts."
            />

            <CapabilityCard
              icon={
                <BriefcaseBusiness
                  size={20}
                />
              }
              title="Career Role Assignment"
              description="Assign employees to SkillForge career learning paths."
            />

            <CapabilityCard
              icon={
                <TrendingUp
                  size={20}
                />
              }
              title="Learning Progress"
              description="Review topic completion, assessments and overall role progress."
            />

          </div>

          {/* Search and role filter */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 lg:flex-row">

              <div className="relative flex-1">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search employees or career roles..."
                  className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

              </div>

              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(
                    event.target.value
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              >
                <option value="all">
                  All Career Roles
                </option>

                {Object.entries(
                  roadmapData
                ).map(
                  ([
                    roleId,
                    role,
                  ]) => (
                    <option
                      key={roleId}
                      value={roleId}
                    >
                      {role.title}
                    </option>
                  )
                )}

              </select>

            </div>

          </div>

          {/* Employee directory */}

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <h2 className="text-lg font-bold text-slate-900">
                Employee Directory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Prototype employee records shown until the
                backend employee directory is connected.
              </p>

            </div>

            {filteredEmployees.length >
            0 ? (
              <div className="divide-y divide-slate-100">

                {filteredEmployees.map(
                  (employee) => (
                    <EmployeeRow
                      key={
                        employee.name
                      }
                      employee={
                        employee
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
                  No employees found
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Try another search
                  term or career role.
                </p>

              </div>
            )}

          </div>

          {/* Employee lifecycle */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="font-bold text-slate-900">
              Employee Learning Workflow
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Once backend employee management is connected,
              Admins will control this complete lifecycle.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-5">

              <WorkflowCard
                number="01"
                title="Create Account"
                description="Create or invite an employee."
              />

              <WorkflowCard
                number="02"
                title="Assign Role"
                description="Assign a career learning path."
              />

              <WorkflowCard
                number="03"
                title="Learn"
                description="Employee completes lessons and resources."
              />

              <WorkflowCard
                number="04"
                title="Assess"
                description="Employee passes topic assessments."
              />

              <WorkflowCard
                number="05"
                title="Certify"
                description="Completed career roles become certificate eligible."
              />

            </div>

          </div>

          {/* Future employee details */}

          <div className="mt-7 grid gap-4 lg:grid-cols-2">

            <InfoCard
              icon={
                <TrendingUp
                  size={20}
                />
              }
              title="Progress & Assessment History"
              description="The employee detail view will show completed lessons, passed topics, assessment attempts, scores and role completion."
            />

            <InfoCard
              icon={
                <ShieldCheck
                  size={20}
                />
              }
              title="Assessment Integrity"
              description="Future Admin review will connect employee assessment attempts with tab-switch and screen-share integrity events, plus optional proctoring records."
            />

          </div>

          {/* Backend notice */}

          <div className="mt-7 rounded-2xl border border-purple-100 bg-purple-50 p-5">

            <p className="text-sm font-semibold text-purple-800">
              Backend integration required
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              Employee identities, email addresses, departments,
              account status, career-role assignments and progress
              should not be hardcoded in the frontend. The final
              version of this page will retrieve authorized employee
              records from the backend and PostgreSQL.
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

interface CapabilityCardProps {
  icon: ReactNode
  title: string
  description: string
}

function CapabilityCard({
  icon,
  title,
  description,
}: CapabilityCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>

      <p className="mt-4 text-sm font-bold text-slate-900">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  )
}

interface EmployeeRowProps {
  employee: EmployeePrototype
}

function EmployeeRow({
  employee,
}: EmployeeRowProps) {
  const role =
    roadmapData[
      employee.assignedRoleId
    ]

  return (
    <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center">

      <div className="flex min-w-0 flex-1 items-center gap-4">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-700">
          {employee.name
            .charAt(0)
            .toUpperCase()}
        </div>

        <div className="min-w-0">

          <p className="font-semibold text-slate-900">
            {employee.name}
          </p>

          <p className="mt-1 truncate text-xs text-slate-500">
            {employee.email}
          </p>

        </div>

      </div>

      <div className="lg:w-64">

        <p className="text-xs text-slate-400">
          Assigned Career Role
        </p>

        <p className="mt-1 text-sm font-semibold text-slate-700">
          {role?.title ??
            'Not Assigned'}
        </p>

      </div>

      <div className="lg:w-28">

        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">

          <CheckCircle2
            size={13}
          />

          {employee.status}

        </span>

      </div>

      <button
        type="button"
        className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:text-purple-600"
      >
        View Employee
      </button>

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

interface InfoCardProps {
  icon: ReactNode
  title: string
  description: string
}

function InfoCard({
  icon,
  title,
  description,
}: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start gap-4">

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
          {icon}
        </div>

        <div>

          <p className="text-sm font-bold text-slate-900">
            {title}
          </p>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {description}
          </p>

        </div>

      </div>

    </div>
  )
}

export default Employees