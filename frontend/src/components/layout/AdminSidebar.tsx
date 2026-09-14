import {
  Award,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  Users,
  Video,
} from 'lucide-react'

import {
  NavLink,
  useNavigate,
} from 'react-router-dom'

const overviewItems = [
  {
    label: 'Dashboard',
    path: '/admin/dashboard',
    icon: LayoutDashboard,
  },
]

const learningItems = [
  {
    label: 'Career Roles',
    path: '/admin/roles',
    icon: BriefcaseBusiness,
  },
  {
    label: 'Learning Content',
    path: '/admin/content',
    icon: BookOpenCheck,
  },
  {
    label: 'Assessments',
    path: '/admin/assessments',
    icon: BarChart3,
  },
]

const managementItems = [
  {
    label: 'Live Sessions',
    path: '/admin/live-sessions',
    icon: Video,
  },
  {
    label: 'Employees',
    path: '/admin/employees',
    icon: Users,
  },
  {
    label: 'Progress & Analytics',
    path: '/admin/progress',
    icon: BarChart3,
  },
  {
    label: 'Certificates',
    path: '/admin/certificates',
    icon: Award,
  },
]

function AdminSidebar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem(
      'isAuthenticated'
    )

    navigate('/login', {
      replace: true,
    })
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-slate-950 text-white">

      {/* LOGO */}

      <div className="flex h-20 items-center border-b border-slate-800 px-6">

        <div>
          <h1 className="text-2xl font-bold text-white">
            SkillForge
          </h1>

          <p className="text-xs font-medium text-purple-400">
            Admin Portal
          </p>
        </div>

      </div>

      {/* NAVIGATION */}

      <nav className="flex-1 overflow-y-auto px-4 py-6">

        <SidebarSection
          title="Overview"
          items={overviewItems}
        />

        <SidebarSection
          title="Learning Management"
          items={learningItems}
        />

        <SidebarSection
          title="Management"
          items={managementItems}
        />

      </nav>

      {/* ADMIN / LOGOUT */}

      <div className="border-t border-slate-800 p-4">

        <div className="mb-3 flex items-center gap-3 rounded-xl px-3 py-2">

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-600 text-sm font-semibold text-white">
            A
          </div>

          <div className="min-w-0">

            <p className="truncate text-sm font-semibold text-white">
              Administrator
            </p>

            <p className="truncate text-xs text-slate-400">
              Admin
            </p>

          </div>

        </div>

        <button
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

interface SidebarItem {
  label: string
  path: string
  icon: React.ComponentType<{
    size?: number
  }>
}

interface SidebarSectionProps {
  title: string
  items: SidebarItem[]
}

function SidebarSection({
  title,
  items,
}: SidebarSectionProps) {
  return (
    <div className="mb-7">

      <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
        {title}
      </p>

      <div className="space-y-1">

        {items.map((item) => {
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

    </div>
  )
}

export default AdminSidebar