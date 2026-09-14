import {
  CheckCircle2,
  ClipboardList,
  Edit3,
  FileEdit,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Trash2,
  Users,
} from 'lucide-react'

const quizzes = [
  {
    id: 'QUIZ-001',
    title: 'React Fundamentals Assessment',
    course: 'Advanced React Development',
    questions: 20,
    attempts: 86,
    averageScore: 82,
    status: 'Published',
  },
  {
    id: 'QUIZ-002',
    title: 'Node.js Basics Quiz',
    course: 'Node.js & Express',
    questions: 15,
    attempts: 72,
    averageScore: 76,
    status: 'Published',
  },
  {
    id: 'QUIZ-003',
    title: 'Java Full Stack Assessment',
    course: 'Java Full Stack Development',
    questions: 25,
    attempts: 94,
    averageScore: 69,
    status: 'Published',
  },
  {
    id: 'QUIZ-004',
    title: 'Python Data Analytics Quiz',
    course: 'Python Data Analytics',
    questions: 20,
    attempts: 61,
    averageScore: 74,
    status: 'Published',
  },
  {
    id: 'QUIZ-005',
    title: 'UI/UX Fundamentals Assessment',
    course: 'UI/UX Design Fundamentals',
    questions: 15,
    attempts: 0,
    averageScore: 0,
    status: 'Draft',
  },
]

function Quizzes() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Quiz Management
            </h1>

            <p className="mt-2 text-slate-500">
              Create, manage, and monitor employee assessments.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
            <Plus size={18} />
            Create Quiz
          </button>

        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<ClipboardList size={22} />}
            value="28"
            label="Total Quizzes"
          />

          <StatCard
            icon={<CheckCircle2 size={22} />}
            value="24"
            label="Published Quizzes"
          />

          <StatCard
            icon={<FileEdit size={22} />}
            value="4"
            label="Draft Quizzes"
          />

          <StatCard
            icon={<Users size={22} />}
            value="1,284"
            label="Total Attempts"
          />

        </div>

        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

          <div className="flex flex-col gap-4 lg:flex-row">

            {/* Search */}
            <div className="relative flex-1">

              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search quizzes..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

            {/* Course */}
            <select className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-purple-500">
              <option>All Courses</option>
              <option>Advanced React Development</option>
              <option>Node.js & Express</option>
              <option>Java Full Stack Development</option>
              <option>Python Data Analytics</option>
              <option>UI/UX Design Fundamentals</option>
            </select>

            {/* Status */}
            <select className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-purple-500">
              <option>All Status</option>
              <option>Published</option>
              <option>Draft</option>
            </select>

            <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
              <Filter size={17} />
              Filters
            </button>

          </div>

        </div>

        {/* Quiz Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">

                  <th className="px-6 py-4 font-medium">
                    Quiz
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Course
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Questions
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Attempts
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Avg. Score
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Status
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Actions
                  </th>

                </tr>
              </thead>

              <tbody>

                {quizzes.map((quiz) => (
                  <QuizRow
                    key={quiz.id}
                    quiz={quiz}
                  />
                ))}

              </tbody>

            </table>

          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500">
              Showing 1–5 of 28 quizzes
            </p>

            <div className="flex gap-2">

              <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:bg-slate-50">
                Previous
              </button>

              <button className="rounded-lg bg-purple-600 px-3 py-2 text-sm text-white">
                1
              </button>

              <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                2
              </button>

              <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
                3
              </button>

              <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:bg-slate-50">
                Next
              </button>

            </div>

          </div>

        </div>

      </div>
    </div>
  )
}

/* Statistics Card */

interface StatCardProps {
  icon: React.ReactNode
  value: string
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

        <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
          {icon}
        </div>

        <div>
          <p className="text-2xl font-bold text-slate-900">
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

/* Quiz Row */

interface Quiz {
  id: string
  title: string
  course: string
  questions: number
  attempts: number
  averageScore: number
  status: string
}

interface QuizRowProps {
  quiz: Quiz
}

function QuizRow({
  quiz,
}: QuizRowProps) {
  return (
    <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">

      {/* Quiz */}
      <td className="px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <ClipboardList size={20} />
          </div>

          <div>

            <p className="text-sm font-semibold text-slate-800">
              {quiz.title}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {quiz.id}
            </p>

          </div>

        </div>

      </td>

      {/* Course */}
      <td className="px-6 py-5 text-sm text-slate-600">
        {quiz.course}
      </td>

      {/* Questions */}
      <td className="px-6 py-5 text-sm text-slate-600">
        {quiz.questions}
      </td>

      {/* Attempts */}
      <td className="px-6 py-5">

        <div className="flex items-center gap-2 text-sm text-slate-600">

          <Users
            size={16}
            className="text-slate-400"
          />

          {quiz.attempts}

        </div>

      </td>

      {/* Average Score */}
      <td className="px-6 py-5">

        {quiz.attempts > 0 ? (
          <div className="flex items-center gap-3">

            <span className="text-sm font-medium text-slate-700">
              {quiz.averageScore}%
            </span>

            <div className="h-2 w-20 rounded-full bg-slate-100">

              <div
                className="h-2 rounded-full bg-purple-600"
                style={{
                  width: `${quiz.averageScore}%`,
                }}
              />

            </div>

          </div>
        ) : (
          <span className="text-sm text-slate-400">
            No attempts
          </span>
        )}

      </td>

      {/* Status */}
      <td className="px-6 py-5">

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            quiz.status === 'Published'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {quiz.status}
        </span>

      </td>

      {/* Actions */}
      <td className="px-6 py-5">

        <div className="flex items-center gap-2">

          <button
            title="Edit Quiz"
            className="rounded-lg p-2 text-slate-500 hover:bg-purple-50 hover:text-purple-600"
          >
            <Edit3 size={17} />
          </button>

          <button
            title="Delete Quiz"
            className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 size={17} />
          </button>

          <button
            title="More Options"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <MoreVertical size={17} />
          </button>

        </div>

      </td>

    </tr>
  )
}

export default Quizzes