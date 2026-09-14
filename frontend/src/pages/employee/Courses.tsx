import { Search, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import CourseCard from '../../components/dashboard/CourseCard'

function Courses() {
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              My Courses
            </h1>

            <p className="mt-2 text-slate-500">
              Explore and continue your assigned training courses.
            </p>
          </div>
        </div>

        {/* Search + Filter */}
        <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div className="relative w-full md:w-96">
            <Search
              size={19}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search courses..."
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <SlidersHorizontal size={18} />
            Filters
          </button>

        </div>

        {/* Course Filters */}
        <div className="mt-6 flex gap-3 overflow-x-auto">
          <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white">
            All Courses
          </button>

          <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            In Progress
          </button>

          <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Completed
          </button>

          <button className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
            Not Started
          </button>
        </div>

        {/* Courses */}
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

          <div
           onClick={() => navigate('/employee/courses/react-development')}
           className="cursor-pointer"
          > 
            <CourseCard
             title="Advanced React Development"
             instructor="Sarah Johnson"
             category="Frontend"
             progress={72}
             level="Advanced"
           />
          </div>

          <CourseCard
            title="Node.js & Express"
            instructor="Michael Brown"
            category="Backend"
            progress={45}
            level="Intermediate"
          />

          <CourseCard
            title="UI/UX Design Fundamentals"
            instructor="Emily Davis"
            category="Design"
            progress={90}
            level="Beginner"
          />

          <CourseCard
            title="Python for Data Analysis"
            instructor="David Wilson"
            category="Python"
            progress={30}
            level="Intermediate"
          />

          <CourseCard
            title="Java Full Stack Development"
            instructor="James Anderson"
            category="Java"
            progress={15}
            level="Intermediate"
          />

          <CourseCard
            title="Database Management"
            instructor="Robert Miller"
            category="Database"
            progress={100}
            level="Beginner"
          />

        </div>
      </div>
    </DashboardLayout>
  )
}

export default Courses