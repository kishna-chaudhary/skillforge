import { useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Code2,
  Eye,
  EyeOff,
  FlaskConical,
  Plus,
  Save,
  Settings2,
  ShieldCheck,
  Trash2,
  Trophy,
} from 'lucide-react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'
import { roadmapData } from '../../data/roadmapData'

interface TestCase {
  id: number
  input: string
  expectedOutput: string
}

const languageByRole: Record<
  string,
  string
> = {
  'devops-engineer': 'Dockerfile',
  'frontend-engineer': 'JavaScript',
  'backend-engineer': 'JavaScript',
  'full-stack-engineer': 'JavaScript',
  'data-analyst': 'Python',
  'data-scientist': 'Python',
  'cloud-engineer': 'Terraform',
  'qa-engineer': 'JavaScript',
}

const titleByRole: Record<
  string,
  string
> = {
  'devops-engineer':
    'DevOps Configuration Challenge',

  'frontend-engineer':
    'Frontend Application Challenge',

  'backend-engineer':
    'Backend API Logic Challenge',

  'full-stack-engineer':
    'Full Stack Application Challenge',

  'data-analyst':
    'Data Analysis Challenge',

  'data-scientist':
    'Python Data Processing Challenge',

  'cloud-engineer':
    'Cloud Infrastructure Challenge',

  'qa-engineer':
    'Test Automation Challenge',
}

function getStarterCode(
  roleId: string
) {
  switch (roleId) {
    case 'frontend-engineer':
      return `function solve(input) {
  // Write your solution here
}`

    case 'backend-engineer':
      return `function solve(input) {
  // Implement the required backend logic
}`

    case 'full-stack-engineer':
      return `function solve(input) {
  // Implement your solution
}`

    case 'data-analyst':
      return `def solve(data):
    # Write your solution here
    pass`

    case 'data-scientist':
      return `def solve(data):
    # Write your solution here
    pass`

    case 'devops-engineer':
      return `# Complete the Dockerfile

FROM node:20-alpine

# Add your configuration below
`

    case 'cloud-engineer':
      return `# Complete the Terraform configuration

terraform {
  required_providers {
    # Configure provider
  }
}

# Define infrastructure below
`

    case 'qa-engineer':
      return `describe('Feature tests', () => {
  // Write your automated tests here
})
`

    default:
      return ''
  }
}

function PracticalChallengeEditor() {
  const navigate = useNavigate()

  const { roleId } =
    useParams()

  const roadmap =
    roleId
      ? roadmapData[roleId]
      : undefined

  const [title, setTitle] =
    useState(
      roleId
        ? titleByRole[roleId] ??
            'Final Practical Challenge'
        : 'Final Practical Challenge'
    )

  const [
    description,
    setDescription,
  ] = useState(
    'Demonstrate the practical skills learned throughout this career roadmap.'
  )

  const [language, setLanguage] =
    useState(
      roleId
        ? languageByRole[
            roleId
          ] ?? 'JavaScript'
        : 'JavaScript'
    )

  const [duration, setDuration] =
    useState(60)

  const [
    passingScore,
    setPassingScore,
  ] = useState(70)

  const [
    instructions,
    setInstructions,
  ] = useState(
    `Complete the required practical task.
Follow the problem requirements carefully.
Write a clear and maintainable solution.
Make sure your solution handles the provided examples.
Your solution will also be evaluated against hidden tests.`
  )

  const [
    starterCode,
    setStarterCode,
  ] = useState(
    roleId
      ? getStarterCode(roleId)
      : ''
  )

  const [
    visibleTests,
    setVisibleTests,
  ] = useState<TestCase[]>([
    {
      id: 1,
      input: 'Example input',
      expectedOutput:
        'Expected output',
    },
  ])

  const [
    hiddenTests,
    setHiddenTests,
  ] = useState<TestCase[]>([
    {
      id: 1,
      input: 'Hidden input',
      expectedOutput:
        'Hidden expected output',
    },
  ])

  const [
    saveMessage,
    setSaveMessage,
  ] = useState(false)

  if (!roleId || !roadmap) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-slate-50 p-6">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
              <AlertCircle
                size={36}
                className="mx-auto text-slate-400"
              />

              <h1 className="mt-4 text-2xl font-bold text-slate-900">
                Career Role Not
                Found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                The requested
                practical challenge
                cannot be configured
                because this career
                role does not exist.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/admin/practical-challenges'
                  )
                }
                className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Back to Challenges
              </button>
            </div>
          </div>
        </div>
      </AdminLayout>
    )
  }

  const addVisibleTest = () => {
    setVisibleTests(
      (current) => [
        ...current,
        {
          id: Date.now(),
          input: '',
          expectedOutput: '',
        },
      ]
    )
  }

  const addHiddenTest = () => {
    setHiddenTests(
      (current) => [
        ...current,
        {
          id: Date.now(),
          input: '',
          expectedOutput: '',
        },
      ]
    )
  }

  const removeVisibleTest = (
    id: number
  ) => {
    setVisibleTests(
      (current) =>
        current.filter(
          (test) =>
            test.id !== id
        )
    )
  }

  const removeHiddenTest = (
    id: number
  ) => {
    setHiddenTests(
      (current) =>
        current.filter(
          (test) =>
            test.id !== id
        )
    )
  }

  const updateVisibleTest = (
    id: number,
    field:
      | 'input'
      | 'expectedOutput',
    value: string
  ) => {
    setVisibleTests(
      (current) =>
        current.map((test) =>
          test.id === id
            ? {
                ...test,
                [field]: value,
              }
            : test
        )
    )
  }

  const updateHiddenTest = (
    id: number,
    field:
      | 'input'
      | 'expectedOutput',
    value: string
  ) => {
    setHiddenTests(
      (current) =>
        current.map((test) =>
          test.id === id
            ? {
                ...test,
                [field]: value,
              }
            : test
        )
    )
  }

  const handleSave = () => {
    setSaveMessage(true)

    window.setTimeout(() => {
      setSaveMessage(false)
    }, 3000)
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="mx-auto max-w-6xl">
          {/* BACK */}
          <button
            type="button"
            onClick={() =>
              navigate(
                '/admin/practical-challenges'
              )
            }
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-purple-600"
          >
            <ArrowLeft size={17} />
            Back to Practical
            Challenges
          </button>

          {/* HEADER */}
          <div className="rounded-2xl bg-slate-900 p-7 text-white">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                  Practical
                  Assessment
                </p>

                <h1 className="mt-2 text-3xl font-bold">
                  Configure Challenge
                </h1>

                <p className="mt-3 text-sm text-slate-400">
                  {roadmap.title}
                </p>
              </div>

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-300">
                <Trophy size={27} />
              </div>
            </div>
          </div>

          {/* ROLE REQUIREMENT */}
          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">
            <div className="flex gap-3">
              <ShieldCheck
                size={20}
                className="mt-0.5 shrink-0 text-purple-600"
              />

              <div>
                <h2 className="text-sm font-semibold text-purple-900">
                  Unlock requirement
                </h2>

                <p className="mt-1 text-sm leading-6 text-purple-700">
                  This challenge is
                  unlocked only after
                  an employee passes
                  all{' '}
                  {
                    roadmap.topics
                      .length
                  }{' '}
                  topic assessments
                  in the{' '}
                  {roadmap.title}{' '}
                  roadmap.
                </p>
              </div>
            </div>
          </div>

          {/* BASIC SETTINGS */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Settings2
                size={20}
                className="text-purple-600"
              />

              <h2 className="text-lg font-bold text-slate-900">
                Challenge Settings
              </h2>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Challenge Title
                </span>

                <input
                  value={title}
                  onChange={(event) =>
                    setTitle(
                      event.target
                        .value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-slate-700">
                  Practical Type /
                  Language
                </span>

                <select
                  value={language}
                  onChange={(event) =>
                    setLanguage(
                      event.target
                        .value
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                >
                  <option>
                    JavaScript
                  </option>
                  <option>
                    TypeScript
                  </option>
                  <option>
                    Python
                  </option>
                  <option>
                    SQL
                  </option>
                  <option>
                    Dockerfile
                  </option>
                  <option>
                    Kubernetes YAML
                  </option>
                  <option>
                    Terraform
                  </option>
                  <option>
                    HTML/CSS
                  </option>
                </select>
              </label>

              <label className="block">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Clock3
                    size={15}
                  />
                  Duration
                  (minutes)
                </span>

                <input
                  type="number"
                  min={1}
                  value={duration}
                  onChange={(event) =>
                    setDuration(
                      Number(
                        event.target
                          .value
                      )
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </label>

              <label className="block">
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Trophy
                    size={15}
                  />
                  Passing Score (%)
                </span>

                <input
                  type="number"
                  min={1}
                  max={100}
                  value={
                    passingScore
                  }
                  onChange={(event) =>
                    setPassingScore(
                      Number(
                        event.target
                          .value
                      )
                    )
                  }
                  className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />
              </label>
            </div>

            <label className="mt-5 block">
              <span className="text-sm font-semibold text-slate-700">
                Description
              </span>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(
                    event.target.value
                  )
                }
                rows={3}
                className="mt-2 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </label>
          </section>

          {/* INSTRUCTIONS */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2
                size={20}
                className="text-purple-600"
              />

              <h2 className="text-lg font-bold text-slate-900">
                Problem
                Requirements
              </h2>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Enter one requirement
              per line.
            </p>

            <textarea
              value={instructions}
              onChange={(event) =>
                setInstructions(
                  event.target.value
                )
              }
              rows={8}
              className="mt-4 w-full resize-y rounded-xl border border-slate-300 px-4 py-3 text-sm leading-7 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />
          </section>

          {/* STARTER CODE */}
          <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div className="flex items-center gap-2">
                <Code2
                  size={20}
                  className="text-purple-600"
                />

                <h2 className="text-lg font-bold text-slate-900">
                  Starter Code
                </h2>
              </div>

              <span className="rounded-lg bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm">
                {language}
              </span>
            </div>

            <textarea
              value={starterCode}
              onChange={(event) =>
                setStarterCode(
                  event.target.value
                )
              }
              spellCheck={false}
              className="min-h-[300px] w-full resize-y bg-slate-950 p-5 font-mono text-sm leading-6 text-slate-100 outline-none"
            />
          </section>

          {/* VISIBLE TESTS */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Eye
                    size={20}
                    className="text-purple-600"
                  />

                  <h2 className="text-lg font-bold text-slate-900">
                    Visible Test
                    Cases
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  Employees can see
                  these examples
                  while solving the
                  challenge.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  addVisibleTest
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-100"
              >
                <Plus size={16} />
                Add Test
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {visibleTests.map(
                (test, index) => (
                  <div
                    key={test.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700">
                        Visible Test{' '}
                        {index + 1}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          removeVisibleTest(
                            test.id
                          )
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove visible test"
                      >
                        <Trash2
                          size={16}
                        />
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Input
                        </span>

                        <textarea
                          value={
                            test.input
                          }
                          onChange={(
                            event
                          ) =>
                            updateVisibleTest(
                              test.id,
                              'input',
                              event
                                .target
                                .value
                            )
                          }
                          rows={4}
                          className="mt-2 w-full resize-y rounded-xl border border-slate-300 p-3 font-mono text-sm outline-none focus:border-purple-500"
                        />
                      </label>

                      <label>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Expected
                          Output
                        </span>

                        <textarea
                          value={
                            test.expectedOutput
                          }
                          onChange={(
                            event
                          ) =>
                            updateVisibleTest(
                              test.id,
                              'expectedOutput',
                              event
                                .target
                                .value
                            )
                          }
                          rows={4}
                          className="mt-2 w-full resize-y rounded-xl border border-slate-300 p-3 font-mono text-sm outline-none focus:border-purple-500"
                        />
                      </label>
                    </div>
                  </div>
                )
              )}

              {visibleTests.length ===
                0 && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No visible tests
                  configured.
                </div>
              )}
            </div>
          </section>

          {/* HIDDEN TESTS */}
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <EyeOff
                    size={20}
                    className="text-purple-600"
                  />

                  <h2 className="text-lg font-bold text-slate-900">
                    Hidden Test
                    Cases
                  </h2>
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  These tests are
                  used for final
                  evaluation and
                  must never be sent
                  to the employee
                  browser.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  addHiddenTest
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 hover:bg-purple-100"
              >
                <Plus size={16} />
                Add Hidden Test
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {hiddenTests.map(
                (test, index) => (
                  <div
                    key={test.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-700">
                          Hidden Test{' '}
                          {index + 1}
                        </p>

                        <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase text-slate-500">
                          Private
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeHiddenTest(
                            test.id
                          )
                        }
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                        aria-label="Remove hidden test"
                      >
                        <Trash2
                          size={16}
                        />
                      </button>
                    </div>

                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <label>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Input
                        </span>

                        <textarea
                          value={
                            test.input
                          }
                          onChange={(
                            event
                          ) =>
                            updateHiddenTest(
                              test.id,
                              'input',
                              event
                                .target
                                .value
                            )
                          }
                          rows={4}
                          className="mt-2 w-full resize-y rounded-xl border border-slate-300 p-3 font-mono text-sm outline-none focus:border-purple-500"
                        />
                      </label>

                      <label>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Expected
                          Output
                        </span>

                        <textarea
                          value={
                            test.expectedOutput
                          }
                          onChange={(
                            event
                          ) =>
                            updateHiddenTest(
                              test.id,
                              'expectedOutput',
                              event
                                .target
                                .value
                            )
                          }
                          rows={4}
                          className="mt-2 w-full resize-y rounded-xl border border-slate-300 p-3 font-mono text-sm outline-none focus:border-purple-500"
                        />
                      </label>
                    </div>
                  </div>
                )
              )}

              {hiddenTests.length ===
                0 && (
                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                  No hidden tests
                  configured.
                </div>
              )}
            </div>
          </section>

          {/* SECURITY */}
          <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <div className="flex gap-3">
              <FlaskConical
                size={20}
                className="mt-0.5 shrink-0 text-amber-600"
              />

              <div>
                <h3 className="text-sm font-semibold text-amber-900">
                  Evaluation
                  architecture
                </h3>

                <p className="mt-1 text-sm leading-6 text-amber-700">
                  Visible tests may
                  be returned to the
                  employee frontend.
                  Hidden tests must
                  remain on the
                  backend and will
                  only be provided to
                  the isolated code
                  execution service
                  during evaluation.
                </p>
              </div>
            </div>
          </section>

          {/* SAVE */}
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div>
              {saveMessage ? (
                <div className="flex items-center gap-2 text-sm font-semibold text-green-700">
                  <CheckCircle2
                    size={18}
                  />
                  Prototype changes
                  captured locally.
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Database
                  persistence will
                  be connected during
                  backend
                  integration.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              <Save size={17} />
              Save Challenge
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default PracticalChallengeEditor