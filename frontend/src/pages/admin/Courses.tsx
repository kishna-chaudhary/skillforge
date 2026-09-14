import {
  BookOpen,
  Edit3,
  Filter,
  MoreVertical,
  Plus,
  Search,
  Users,
  CheckCircle2,
  FileEdit,
  Trash2,
} from 'lucide-react'

const courses = [
  {
    id: 'CRS-001',
    title: 'Advanced React Development',
    category: 'Web Development',
    instructor: 'Sarah Johnson',
    lessons: 24,
    enrollments: 86,
    completion: 82,
    status: 'Published',
  },
  {
    id: 'CRS-002',
    title: 'Node.js & Express',
    category: 'Backend Development',
    instructor: 'Michael Brown',
    lessons: 20,
    enrollments: 72,
    completion: 71,
    status: 'Published',
  },
  {
    id: 'CRS-003',
    title: 'Java Full Stack Development',
    category: 'Software Development',
    instructor: 'David Wilson',
    lessons: 32,
    enrollments: 94,
    completion: 64,
    status: 'Published',
  },
  {
    id: 'CRS-004',
    title: 'Python Data Analytics',
    category: 'Data Analytics',
    instructor: 'Emily Davis',
    lessons: 18,
    enrollments: 61,
    completion: 56,
    status: 'Published',
  },
  {
    id: 'CRS-005',
    title: 'UI/UX Design Fundamentals',
    category: 'Design',
    instructor: 'Jessica Miller',
    lessons: 16,
    enrollments: 48,
    completion: 90,
    status: 'Draft',
  },
]

function Courses() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Course Management
            </h1>

            <p className="mt-2 text-slate-500">
              Create, manage, and monitor your organization's training courses.
            </p>
          </div>

          <button className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
            <Plus size={18} />
            Create Course
          </button>

        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <StatCard
            icon={<BookOpen size={22} />}
            value="32"
            label="Total Courses"
          />

          <StatCard
            icon={<CheckCircle2 size={22} />}
            value="27"
            label="Published Courses"
          />

          <StatCard
            icon={<FileEdit size={22} />}
            value="5"
            label="Draft Courses"
          />

          <StatCard
            icon={<Users size={22} />}
            value="1,426"
            label="Total Enrollments"
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
                placeholder="Search courses..."
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

            {/* Category */}
            <select className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-purple-500">
              <option>All Categories</option>
              <option>Web Development</option>
              <option>Backend Development</option>
              <option>Software Development</option>
              <option>Data Analytics</option>
              <option>Design</option>
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

        {/* Course Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1050px]">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-400">

                  <th className="px-6 py-4 font-medium">
                    Course
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Instructor
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Lessons
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Enrollments
                  </th>

                  <th className="px-6 py-4 font-medium">
                    Completion
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

                {courses.map((course) => (
                  <CourseRow
                    key={course.id}
                    course={course}
                  />
                ))}

              </tbody>

            </table>

          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-sm text-slate-500">
              Showing 1–5 of 32 courses
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

/* Course Row */

interface Course {
  id: string
  title: string
  category: string
  instructor: string
  lessons: number
  enrollments: number
  completion: number
  status: string
}

interface CourseRowProps {
  course: Course
}

function CourseRow({
  course,
}: CourseRowProps) {
  return (
    <tr className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50">

      {/* Course */}
      <td className="px-6 py-5">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <BookOpen size={20} />
          </div>

          <div>

            <p className="text-sm font-semibold text-slate-800">
              {course.title}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {course.id}
            </p>

            <span className="mt-2 inline-block rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
              {course.category}
            </span>

          </div>

        </div>

      </td>

      {/* Instructor */}
      <td className="px-6 py-5">

        <div className="flex items-center gap-2">

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
            {course.instructor.charAt(0)}
          </div>

          <span className="text-sm text-slate-600">
            {course.instructor}
          </span>

        </div>

      </td>

      {/* Lessons */}
      <td className="px-6 py-5 text-sm text-slate-600">
        {course.lessons}
      </td>

      {/* Enrollments */}
      <td className="px-6 py-5">

        <div className="flex items-center gap-2 text-sm text-slate-600">
          <Users size={16} className="text-slate-400" />
          {course.enrollments}
        </div>

      </td>

      {/* Completion */}
      <td className="px-6 py-5">

        <div className="w-32">

          <div className="flex items-center justify-between">

            <span className="text-xs font-medium text-slate-500">
              {course.completion}%
            </span>

          </div>

          <div className="mt-2 h-2 rounded-full bg-slate-100">

            <div
              className="h-2 rounded-full bg-purple-600"
              style={{
                width: `${course.completion}%`,
              }}
            />

          </div>

        </div>

      </td>

      {/* Status */}
      <td className="px-6 py-5">

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            course.status === 'Published'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {course.status}
        </span>

      </td>

      {/* Actions */}
      <td className="px-6 py-5">

        <div className="flex items-center gap-2">

          <button
            title="Edit Course"
            className="rounded-lg p-2 text-slate-500 hover:bg-purple-50 hover:text-purple-600"
          >
            <Edit3 size={17} />
          </button>

          <button
            title="Delete Course"
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

export default Courses