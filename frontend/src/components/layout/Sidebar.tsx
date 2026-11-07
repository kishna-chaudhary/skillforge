import {
  LayoutDashboard,
  BriefcaseBusiness,
  Video,
  TrendingUp,
  Award,
  LogOut,
} from 'lucide-react'

import {
  NavLink,
  useNavigate,
} from 'react-router-dom'

import {
  useAuth,
} from '../../context/AuthContext'

const menuItems = [
  {
    label: 'Dashboard',
    path: '/employee/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Roles',
    path: '/employee/roles',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Progress',
    path: '/employee/progress',
    icon: TrendingUp,
  },
  {
    label: 'Live Sessions',
    path: '/employee/live-sessions',
    icon: Video,
  },
  {
    label: 'Certificates',
    path: '/employee/certificates',
    icon: Award,
  },
]

function Sidebar() {
  const navigate = useNavigate()

  const {
    user,
    logout,
  } = useAuth()

  const handleLogout = () => {
    logout()

    navigate('/login', {
      replace: true,
    })
  }

  const displayName =
    user?.fullName ||
    'Employee'

  const initial =
    displayName
      .charAt(0)
      .toUpperCase()

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-slate-900 text-white">
      {/* LOGO */}

      <div className="flex h-20 items-center border-b border-slate-800 px-6">
        <div>
          <h1 className="text-2xl font-bold text-white">
            SkillForge
          </h1>

          <p className="text-xs text-slate-400">
            Corporate Learning
          </p>
        </div>
      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
          Learning
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.label}
                to={item.path}
                className={({
                  isActive,
                }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon size={19} />

                <span>
                  {item.label}
                </span>
              </NavLink>
            )
          })}
        </div>
      </nav>

      {/* USER / LOGOUT */}

      <div className="border-t border-slate-800 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold">
            {initial}
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">
              {displayName}
            </p>

            <p className="truncate text-xs text-slate-400">
              Employee
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 transition hover:bg-slate-800 hover:text-white"
        >
          <LogOut size={19} />

          <span>
            Logout
          </span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar