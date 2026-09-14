import {
  ArrowRight,
  BriefcaseBusiness,
  Clock3,
  Search,
  Sparkles,
} from 'lucide-react'

import {
  useMemo,
  useState,
} from 'react'

import { useNavigate } from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'

import {
  jobRoles,
} from '../../data/jobRoles'

function JobRoles() {
  const navigate = useNavigate()

  const [search, setSearch] =
    useState('')

  const filteredRoles =
    useMemo(() => {
      const value =
        search
          .trim()
          .toLowerCase()

      if (!value) {
        return jobRoles
      }

      return jobRoles.filter(
        (role) =>
          role.title
            .toLowerCase()
            .includes(value) ||
          role.description
            .toLowerCase()
            .includes(value) ||
          role.skills.some(
            (skill) =>
              skill
                .toLowerCase()
                .includes(value)
          )
      )
    }, [search])

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">

        <div className="mx-auto max-w-7xl">

          {/* HEADER */}

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-purple-600">

                <Sparkles size={17} />

                Career Learning Paths

              </div>

              <h1 className="text-3xl font-bold text-slate-900">
                Choose Your Career Path
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Select a job role to explore its structured
                learning roadmap, topics, and practical
                learning resources.
              </p>

            </div>

            {/* SEARCH */}

            <div className="relative w-full lg:w-80">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search job roles..."
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

          </div>


          {/* ROLE COUNT */}

          <div className="mt-8 text-sm text-slate-500">

            Showing{' '}

            <span className="font-semibold text-slate-800">
              {filteredRoles.length}
            </span>

            {' '}career paths

          </div>


          {/* ROLE CARDS */}

          <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredRoles.map(
              (role) => (
                <div
                  key={role.id}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-lg"
                >

                  {/* ICON */}

                  <div className="flex items-start justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                      <BriefcaseBusiness
                        size={23}
                      />
                    </div>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {role.level}
                    </span>

                  </div>


                  {/* TITLE */}

                  <h2 className="mt-5 text-xl font-bold text-slate-900">
                    {role.title}
                  </h2>

                  <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-500">
                    {role.description}
                  </p>


                  {/* DURATION */}

                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">

                    <Clock3
                      size={17}
                      className="text-purple-600"
                    />

                    <span>
                      Estimated duration:
                    </span>

                    <span className="font-semibold text-slate-700">
                      {role.duration}
                    </span>

                  </div>


                  {/* SKILLS */}

                  <div className="mt-5 flex flex-wrap gap-2">

                    {role.skills
                      .slice(0, 5)
                      .map(
                        (skill) => (
                          <span
                            key={skill}
                            className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                          >
                            {skill}
                          </span>
                        )
                      )}

                    {role.skills.length >
                      5 && (
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">
                        +
                        {role.skills.length -
                          5}
                      </span>
                    )}

                  </div>


                  {/* BUTTON */}

                  <button
                    onClick={() =>
                      navigate(
                        `/employee/roles/${role.id}`
                      )
                    }
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    View Roadmap

                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />

                  </button>

                </div>
              )
            )}

          </div>


          {/* NO RESULTS */}

          {filteredRoles.length ===
            0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">

              <BriefcaseBusiness
                size={40}
                className="mx-auto text-slate-300"
              />

              <h2 className="mt-4 text-lg font-semibold text-slate-800">
                No roles found
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Try searching for another job role
                or technology.
              </p>

            </div>
          )}

        </div>

      </div>
    </DashboardLayout>
  )
}

export default JobRoles