import type { ReactNode } from 'react'

import {
  Award,
  BookOpenCheck,
  CheckCircle2,
  Database,
  FileCheck2,
  Search,
  ShieldCheck,
  Users,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import AdminLayout from '../../layouts/AdminLayout'
import { roadmapData } from '../../data/roadmapData'
import { topicQuizData } from '../../data/topicQuizData'

function AdminCertificates() {
  const [search, setSearch] =
    useState('')

  const certificateRows =
    useMemo(() => {
      return Object.entries(
        roadmapData
      ).map(
        ([roleId, role]) => {
          const topicCount =
            role.topics.length

          const lessonCount =
            role.topics.reduce(
              (total, topic) =>
                total +
                topic.lessons,
              0
            )

          const assessmentCount =
            role.topics.filter(
              (topic) =>
                Boolean(
                  topicQuizData[
                    `${roleId}/${topic.id}`
                  ]
                )
            ).length

          const assessmentReady =
            topicCount > 0 &&
            assessmentCount ===
              topicCount

          return {
            roleId,
            roleTitle:
              role.title,
            description:
              role.description,
            topicCount,
            lessonCount,
            assessmentCount,
            assessmentReady,
          }
        }
      )
    }, [])

  const filteredRows =
    useMemo(() => {
      const term =
        search
          .trim()
          .toLowerCase()

      if (!term) {
        return certificateRows
      }

      return certificateRows.filter(
        (row) =>
          row.roleTitle
            .toLowerCase()
            .includes(term) ||
          row.description
            .toLowerCase()
            .includes(term)
      )
    }, [
      certificateRows,
      search,
    ])

  const totalRoles =
    certificateRows.length

  const readyRoles =
    certificateRows.filter(
      (row) =>
        row.assessmentReady
    ).length

  const totalTopics =
    certificateRows.reduce(
      (total, row) =>
        total +
        row.topicCount,
      0
    )

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

        <div className="mx-auto max-w-7xl">

          {/* Header */}

          <div>
            <p className="text-sm font-semibold text-purple-600">
              Completion Management
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-950">
              Certificates
            </h1>

            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
              Review certificate-ready career paths and prepare
              employee certificate issuance for backend integration.
            </p>
          </div>

          {/* Hero */}

          <div className="mt-7 overflow-hidden rounded-3xl bg-slate-950 p-7 text-white lg:p-8">

            <div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-2xl">

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/15 text-purple-300">
                  <Award size={23} />
                </div>

                <h2 className="mt-5 text-2xl font-bold">
                  Certificate Management
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-300">
                  SkillForge certificates are earned only after an
                  employee completes every required topic in a career
                  role by passing each topic assessment.
                </p>

              </div>

              <div className="grid grid-cols-2 gap-3">

                <HeroMetric
                  value={totalRoles}
                  label="Career Roles"
                />

                <HeroMetric
                  value={readyRoles}
                  label="Certificate Ready"
                />

                <HeroMetric
                  value={totalTopics}
                  label="Required Topics"
                />

                <HeroMetric
                  value="Verified"
                  label="Completion Rule"
                />

              </div>

            </div>

          </div>

          {/* Summary */}

          <div className="mt-7 grid gap-4 md:grid-cols-3">

            <SummaryCard
              icon={
                <Award size={20} />
              }
              value={totalRoles}
              title="Certificate Paths"
              description="One role certificate path for each SkillForge career roadmap."
            />

            <SummaryCard
              icon={
                <CheckCircle2
                  size={20}
                />
              }
              value={readyRoles}
              title="Assessment Ready"
              description="Career paths whose roadmap topics all have configured assessments."
            />

            <SummaryCard
              icon={
                <FileCheck2
                  size={20}
                />
              }
              value="Backend"
              title="Certificate Issuance"
              description="Employee certificate records will be issued and stored centrally."
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
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search certificate paths..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

          </div>

          {/* Certificate paths */}

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="border-b border-slate-200 p-5">

              <h2 className="text-lg font-bold text-slate-900">
                Career Certificate Paths
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Certificate eligibility structure derived from
                the configured career roadmaps.
              </p>

            </div>

            {filteredRows.length >
            0 ? (
              <div className="divide-y divide-slate-100">

                {filteredRows.map(
                  (row) => (
                    <CertificateRow
                      key={
                        row.roleId
                      }
                      roleTitle={
                        row.roleTitle
                      }
                      description={
                        row.description
                      }
                      topicCount={
                        row.topicCount
                      }
                      lessonCount={
                        row.lessonCount
                      }
                      assessmentCount={
                        row.assessmentCount
                      }
                      ready={
                        row.assessmentReady
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
                  No certificate paths found
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Try another career role name.
                </p>

              </div>
            )}

          </div>

          {/* Eligibility workflow */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="font-bold text-slate-900">
              Certificate Eligibility Workflow
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Certificates must follow the verified SkillForge
              completion model.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-5">

              <WorkflowCard
                number="01"
                title="Complete Lessons"
                description="Employee completes every lesson within a roadmap topic."
              />

              <WorkflowCard
                number="02"
                title="Unlock Assessment"
                description="The topic assessment becomes available after all lessons."
              />

              <WorkflowCard
                number="03"
                title="Pass Assessment"
                description="Passing the assessment marks that roadmap topic complete."
              />

              <WorkflowCard
                number="04"
                title="Complete Role"
                description="Every topic in the assigned career roadmap must be passed."
              />

              <WorkflowCard
                number="05"
                title="Issue Certificate"
                description="The backend creates a persistent certificate record for the employee."
              />

            </div>

          </div>

          {/* Future certificate management */}

          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">

            <FutureCard
              icon={
                <Users size={20} />
              }
              title="Employee Certificates"
              description="Review employees who have completed all required topics within a career role."
            />

            <FutureCard
              icon={
                <ShieldCheck
                  size={20}
                />
              }
              title="Verification"
              description="Certificates will be linked to verified backend completion records rather than browser-only progress."
            />

            <FutureCard
              icon={
                <Database
                  size={20}
                />
              }
              title="Certificate Records"
              description="Certificate ID, employee, career role and issue metadata will be stored in PostgreSQL."
            />

          </div>

          {/* Certificate data model */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-start gap-4">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <BookOpenCheck
                  size={20}
                />
              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  Certificate Completion Rule
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Completing lessons alone is not sufficient for
                  certificate eligibility. Every roadmap topic must
                  appear as completed through its passed topic
                  assessment. Only then should the career role be
                  considered complete.
                </p>

              </div>

            </div>

          </div>

          {/* Backend notice */}

          <div className="mt-7 rounded-2xl border border-purple-100 bg-purple-50 p-5">

            <p className="text-sm font-semibold text-purple-800">
              Certificate issuance requires backend persistence
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              The current page defines certificate eligibility and
              roadmap readiness only. During backend integration,
              SkillForge will verify employee topic completion on the
              server, create a certificate record and expose eligible
              certificates to both Admin and Employee interfaces.
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

interface CertificateRowProps {
  roleTitle: string
  description: string
  topicCount: number
  lessonCount: number
  assessmentCount: number
  ready: boolean
}

function CertificateRow({
  roleTitle,
  description,
  topicCount,
  lessonCount,
  assessmentCount,
  ready,
}: CertificateRowProps) {
  return (
    <div className="flex flex-col gap-5 p-5 xl:flex-row xl:items-center">

      <div className="min-w-0 flex-1">

        <h3 className="font-bold text-slate-900">
          {roleTitle}
        </h3>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
          {description}
        </p>

        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">

          <span>
            {topicCount} topics
          </span>

          <span>•</span>

          <span>
            {lessonCount} lessons
          </span>

          <span>•</span>

          <span>
            {assessmentCount} assessments
          </span>

        </div>

      </div>

      <div className="xl:w-48">

        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
            ready
              ? 'bg-green-50 text-green-700'
              : 'bg-amber-50 text-amber-700'
          }`}
        >
          {ready && (
            <CheckCircle2
              size={13}
            />
          )}

          {ready
            ? 'Certificate Ready'
            : 'Configuration Needed'}
        </span>

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

interface FutureCardProps {
  icon: ReactNode
  title: string
  description: string
}

function FutureCard({
  icon,
  title,
  description,
}: FutureCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
        {icon}
      </div>

      <p className="mt-4 text-sm font-bold text-slate-900">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

      <span className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
        Backend Required
      </span>

    </div>
  )
}

export default AdminCertificates