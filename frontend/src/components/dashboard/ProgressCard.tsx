interface ProgressCardProps {
  title: string
  instructor: string
  progress: number
}

function ProgressCard({
  title,
  instructor,
  progress,
}: ProgressCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">Continue Learning</p>

          <h3 className="mt-2 text-lg font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {instructor}
          </p>
        </div>

        <span className="text-sm font-semibold text-purple-600">
          {progress}%
        </span>
      </div>

      <div className="mt-5 h-2 w-full rounded-full bg-slate-100">
        <div
          className="h-2 rounded-full bg-purple-600"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button className="mt-5 rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
        Continue Course
      </button>
    </div>
  )
}

export default ProgressCard