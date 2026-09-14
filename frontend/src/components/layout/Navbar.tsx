import {
  Search,
  Bell,
  ChevronDown,
} from 'lucide-react'

function Navbar() {
  return (
    <header className="fixed left-64 right-0 top-0 z-10 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">
      
      {/* Search */}
      <div className="relative w-80">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          placeholder="Search courses, lessons..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-5">

        {/* Notification */}
        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700">
          <Bell size={21} />

          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-purple-600" />
        </button>

        {/* Profile */}
        <button className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 font-semibold text-purple-700">
            RV
          </div>

          <div className="hidden text-left md:block">
            <p className="text-sm font-semibold text-slate-800">
              Rahul Verma
            </p>

            <p className="text-xs text-slate-500">
              Employee
            </p>
          </div>

          <ChevronDown size={16} className="text-slate-400" />
        </button>
      </div>
    </header>
  )
}

export default Navbar