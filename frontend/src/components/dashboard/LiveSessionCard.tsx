import { CalendarDays, Clock, Video } from 'lucide-react'

interface LiveSessionCardProps {
  title: string
  instructor: string
  date: string
  time: string
}

function LiveSessionCard({
  title,
  instructor,
  date,
  time,
}: LiveSessionCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 p-4 transition hover:border-purple-200 hover:shadow-sm">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
          <Video size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {instructor}
          </p>

          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CalendarDays size={14} />
              {date}
            </span>

            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {time}
            </span>
          </div>
        </div>

        <button className="shrink-0 rounded-lg bg-purple-600 px-3 py-2 text-xs font-medium text-white hover:bg-purple-700">
          Join
        </button>
      </div>
    </div>
  )
}

export default LiveSessionCard