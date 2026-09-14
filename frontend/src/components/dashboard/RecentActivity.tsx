import {
  CheckCircle2,
  Award,
  BookOpen,
} from 'lucide-react'

const activities = [
  {
    title: 'Completed React Fundamentals',
    description: 'Course completed',
    icon: CheckCircle2,
  },
  {
    title: 'Passed JavaScript Quiz',
    description: 'Score: 92%',
    icon: BookOpen,
  },
  {
    title: 'Earned a certificate',
    description: 'HTML & CSS Fundamentals',
    icon: Award,
  },
]

function RecentActivity() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Recent Activity
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Your latest learning activities
          </p>
        </div>

        <button className="text-sm font-medium text-purple-600 hover:text-purple-700">
          View All
        </button>
      </div>

      <div className="mt-5 space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon

          return (
            <div
              key={activity.title}
              className="flex items-center gap-3"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <Icon size={17} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  {activity.title}
                </p>

                <p className="text-xs text-slate-500">
                  {activity.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RecentActivity