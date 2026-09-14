import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Cloud,
  Code2,
  Database,
  ShieldCheck,
  Smartphone,
  TestTube2,
} from 'lucide-react'

import DashboardLayout from '../../layouts/DashboardLayout'
import { useNavigate } from 'react-router-dom'

interface Role {
  id: string
  title: string
  description: string
  skills: string[]
  icon: React.ElementType
}

const roles: Role[] = [
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    description:
      'Learn Linux, networking, cloud, containers, CI/CD, and infrastructure automation.',
    skills: [
      'Linux',
      'Networking',
      'Docker',
      'Kubernetes',
      'AWS',
      'CI/CD',
    ],
    icon: Cloud,
  },
  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    description:
      'Build modern web interfaces using HTML, CSS, JavaScript, React, and TypeScript.',
    skills: [
      'HTML',
      'CSS',
      'JavaScript',
      'React',
      'TypeScript',
      'Git',
    ],
    icon: Code2,
  },
  {
    id: 'backend-engineer',
    title: 'Backend Engineer',
    description:
      'Learn APIs, server-side development, databases, authentication, and backend architecture.',
    skills: [
      'Node.js',
      'APIs',
      'Databases',
      'Authentication',
      'Redis',
      'System Design',
    ],
    icon: Database,
  },
  {
    id: 'full-stack-engineer',
    title: 'Full Stack Engineer',
    description:
      'Master both frontend and backend development to build complete web applications.',
    skills: [
      'React',
      'Node.js',
      'APIs',
      'Databases',
      'Authentication',
      'Deployment',
    ],
    icon: BriefcaseBusiness,
  },
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description:
      'Learn how to collect, clean, analyze, and visualize data to support business decisions.',
    skills: [
      'Excel',
      'SQL',
      'Python',
      'Statistics',
      'Power BI',
      'Data Visualization',
    ],
    icon: BarChart3,
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description:
      'Build skills in Python, statistics, machine learning, data analysis, and predictive modeling.',
    skills: [
      'Python',
      'Statistics',
      'Pandas',
      'Machine Learning',
      'SQL',
      'Visualization',
    ],
    icon: BarChart3,
  },
  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    description:
      'Learn cloud infrastructure, deployment, networking, security, and scalable architectures.',
    skills: [
      'AWS',
      'Azure',
      'Networking',
      'Linux',
      'Terraform',
      'Security',
    ],
    icon: Cloud,
  },
  {
    id: 'cybersecurity-engineer',
    title: 'Cybersecurity Engineer',
    description:
      'Develop skills in security fundamentals, networks, vulnerabilities, monitoring, and defense.',
    skills: [
      'Networking',
      'Linux',
      'Security',
      'SIEM',
      'Threat Detection',
      'Incident Response',
    ],
    icon: ShieldCheck,
  },
  {
    id: 'mobile-developer',
    title: 'Mobile App Developer',
    description:
      'Learn how to design and develop modern mobile applications for Android and iOS.',
    skills: [
      'React Native',
      'Flutter',
      'JavaScript',
      'APIs',
      'Mobile UI',
      'App Deployment',
    ],
    icon: Smartphone,
  },
  {
    id: 'qa-engineer',
    title: 'QA / Test Engineer',
    description:
      'Learn software testing, automation, API testing, debugging, and quality engineering.',
    skills: [
      'Manual Testing',
      'Automation',
      'Selenium',
      'API Testing',
      'JavaScript',
      'CI/CD',
    ],
    icon: TestTube2,
  },
]

function Roles() {
  const navigate = useNavigate()

  const handleRoleClick = (roleId: string) => {
    navigate(`/employee/roles/${roleId}`)
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-7xl">

          {/* HEADER */}
          <div>
            <p className="text-sm font-semibold text-purple-600">
              CAREER DEVELOPMENT
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              Choose Your Career Path
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Select a job role to explore its learning roadmap,
              develop the required skills, and prepare for your
              target career.
            </p>
          </div>

          {/* ROLE COUNT */}
          <div className="mt-6 flex items-center gap-2 text-sm text-slate-500">
            <BriefcaseBusiness size={17} />

            <span>
              {roles.length} career paths available
            </span>
          </div>

          {/* ROLE CARDS */}
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">

            {roles.map((role) => {
              const Icon = role.icon

              return (
                <div
                  key={role.id}
                  className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* ICON */}
                  <div className="flex items-center justify-between">

                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                      <Icon size={24} />
                    </div>

                    <span className="text-xs font-medium text-slate-400">
                      Career Path
                    </span>

                  </div>

                  {/* TITLE */}
                  <h2 className="mt-5 text-xl font-bold text-slate-900">
                    {role.title}
                  </h2>

                  {/* DESCRIPTION */}
                  <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-500">
                    {role.description}
                  </p>

                  {/* SKILLS */}
                  <div className="mt-5 flex flex-wrap gap-2">

                    {role.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
                      >
                        {skill}
                      </span>
                    ))}

                  </div>

                  {/* BUTTON */}
                  <button
                    onClick={() =>
                      handleRoleClick(role.id)
                    }
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                  >
                    View Roadmap

                    <ArrowRight
                      size={17}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </button>

                </div>
              )
            })}

          </div>

        </div>
      </div>
    </DashboardLayout>
  )
}

export default Roles