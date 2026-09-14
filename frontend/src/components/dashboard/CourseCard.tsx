interface CourseCardProps {
  title: string
  instructor: string
  category: string
  progress: number
  level: string
}

function CourseCard({
  title,
  instructor,
  category,
  progress,
  level,
}: CourseCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-36 items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-100">
        <span className="text-4xl font-bold text-purple-600">
          {title.charAt(0)}
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">
            {category}
          </span>

          <span className="text-xs text-slate-500">
            {level}
          </span>
        </div>

        <h3 className="mt-3 font-semibold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {instructor}
        </p>

        <div className="mt-4">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-slate-500">Progress</span>
            <span className="font-semibold text-purple-600">
              {progress}%
            </span>
          </div>

          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-purple-600"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button className="mt-5 w-full rounded-lg border border-purple-200 py-2 text-sm font-medium text-purple-600 transition hover:bg-purple-600 hover:text-white">
          Continue Learning
        </button>
      </div>
    </div>
  )
}

export default CourseCard