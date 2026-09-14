import {
  ArrowLeft,
  CheckCircle2,
  ClipboardList,
  GripVertical,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react'

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  marks: number
}

const questions: Question[] = [
  {
    id: 1,
    question: 'What is React primarily used for?',
    options: [
      'Building user interfaces',
      'Managing databases',
      'Creating operating systems',
      'Managing servers',
    ],
    correctAnswer: 0,
    marks: 2,
  },
  {
    id: 2,
    question: 'Which hook is used to manage state in a React component?',
    options: [
      'useEffect',
      'useState',
      'useContext',
      'useMemo',
    ],
    correctAnswer: 1,
    marks: 2,
  },
]

function QuizBuilder() {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <button className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:bg-slate-50">
              <ArrowLeft size={19} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                Quiz Builder
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create questions and configure your assessment.
              </p>
            </div>

          </div>

          <div className="flex gap-3">

            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Save size={17} />
              Save Draft
            </button>

            <button className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
              Publish Quiz
            </button>

          </div>

        </div>

        {/* Quiz Information */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-center gap-3">

            <div className="rounded-xl bg-purple-100 p-3 text-purple-600">
              <ClipboardList size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Quiz Information
              </h2>

              <p className="text-sm text-slate-500">
                Configure the basic information for this quiz.
              </p>
            </div>

          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">

            {/* Title */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Quiz Title
              </label>

              <input
                type="text"
                placeholder="Enter quiz title"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

            {/* Description */}
            <div className="md:col-span-2">

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Description
              </label>

              <textarea
                rows={4}
                placeholder="Describe the purpose of this quiz..."
                className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

            </div>

            {/* Course */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Associated Course
              </label>

              <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-purple-500">
                <option>Select course</option>
                <option>Advanced React Development</option>
                <option>Node.js & Express</option>
                <option>Java Full Stack Development</option>
                <option>Python Data Analytics</option>
              </select>

            </div>

            {/* Passing Score */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Passing Score
              </label>

              <div className="relative">

                <input
                  type="number"
                  defaultValue={70}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  %
                </span>

              </div>

            </div>

            {/* Time Limit */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Time Limit
              </label>

              <div className="relative">

                <input
                  type="number"
                  defaultValue={30}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-20 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                  minutes
                </span>

              </div>

            </div>

            {/* Attempts */}
            <div>

              <label className="mb-2 block text-sm font-medium text-slate-700">
                Maximum Attempts
              </label>

              <select className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 outline-none focus:border-purple-500">
                <option>Unlimited</option>
                <option>1 attempt</option>
                <option>2 attempts</option>
                <option>3 attempts</option>
                <option>5 attempts</option>
              </select>

            </div>

          </div>

        </div>

        {/* Questions */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Questions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Add and organize questions for your quiz.
              </p>

            </div>

            <button className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
              <Plus size={17} />
              Add Question
            </button>

          </div>

          <div className="mt-6 space-y-5">

            {questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                number={index + 1}
              />
            ))}

          </div>

        </div>

        {/* Quiz Settings */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-lg font-bold text-slate-900">
            Quiz Settings
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Configure how employees will take this quiz.
          </p>

          <div className="mt-6 space-y-4">

            <ToggleSetting
              title="Shuffle questions"
              description="Display questions in a different order for each attempt."
            />

            <ToggleSetting
              title="Shuffle answer options"
              description="Randomize the order of answer options."
            />

            <ToggleSetting
              title="Show correct answers after submission"
              description="Employees can see which answers were correct after completing the quiz."
            />

            <ToggleSetting
              title="Allow quiz retakes"
              description="Employees can retake the quiz if they do not pass."
            />

          </div>

        </div>

        {/* Summary */}
        <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-6">

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">

            <SummaryItem
              label="Total Questions"
              value="2"
            />

            <SummaryItem
              label="Total Marks"
              value="4"
            />

            <SummaryItem
              label="Passing Score"
              value="70%"
            />

          </div>

        </div>

        {/* Bottom Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">

          <button className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Cancel
          </button>

          <button className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Save size={17} />
            Save Draft
          </button>

          <button className="rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-purple-700">
            Publish Quiz
          </button>

        </div>

      </div>
    </div>
  )
}

/* Question Card */

interface QuestionCardProps {
  question: Question
  number: number
}

function QuestionCard({
  question,
  number,
}: QuestionCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">

      {/* Question Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50 p-4">

        <GripVertical
          size={18}
          className="cursor-grab text-slate-400"
        />

        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100 text-sm font-bold text-purple-600">
          {number}
        </div>

        <div className="flex-1">

          <p className="text-sm font-semibold text-slate-800">
            Question {number}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Multiple Choice
          </p>

        </div>

        <button className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600">
          <Trash2 size={17} />
        </button>

      </div>

      {/* Question Body */}
      <div className="p-5">

        <label className="mb-2 block text-sm font-medium text-slate-700">
          Question
        </label>

        <textarea
          rows={3}
          defaultValue={question.question}
          className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
        />

        {/* Options */}
        <div className="mt-5">

          <div className="flex items-center justify-between">

            <label className="text-sm font-medium text-slate-700">
              Answer Options
            </label>

            <span className="text-xs text-slate-400">
              Select the correct answer
            </span>

          </div>

          <div className="mt-3 space-y-3">

            {question.options.map((option, index) => (
              <AnswerOption
                key={index}
                option={option}
                index={index}
                correct={index === question.correctAnswer}
              />
            ))}

          </div>

        </div>

        {/* Question Footer */}
        <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <label className="text-sm font-medium text-slate-700">
              Question Type
            </label>

            <select className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 outline-none">
              <option>Multiple Choice</option>
              <option>True / False</option>
              <option>Multiple Answer</option>
            </select>

          </div>

          <div className="flex items-center gap-3">

            <label className="text-sm font-medium text-slate-700">
              Marks
            </label>

            <input
              type="number"
              defaultValue={question.marks}
              className="w-20 rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-purple-500"
            />

          </div>

        </div>

      </div>

    </div>
  )
}

/* Answer Option */

interface AnswerOptionProps {
  option: string
  index: number
  correct: boolean
}

function AnswerOption({
  option,
  index,
  correct,
}: AnswerOptionProps) {
  return (
    <div
      className={`flex items-center gap-3 rounded-xl border p-3 ${
        correct
          ? 'border-green-200 bg-green-50'
          : 'border-slate-200 bg-white'
      }`}
    >

      <input
        type="radio"
        name={`question-${index}`}
        defaultChecked={correct}
        className="h-4 w-4 accent-purple-600"
      />

      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-xs font-semibold text-slate-500">
        {String.fromCharCode(65 + index)}
      </div>

      <input
        type="text"
        defaultValue={option}
        className="flex-1 border-0 bg-transparent text-sm text-slate-700 outline-none"
      />

      {correct && (
        <CheckCircle2
          size={18}
          className="text-green-600"
        />
      )}

      <button className="text-slate-400 hover:text-red-500">
        <X size={17} />
      </button>

    </div>
  )
}

/* Toggle Setting */

interface ToggleSettingProps {
  title: string
  description: string
}

function ToggleSetting({
  title,
  description,
}: ToggleSettingProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-100 p-4">

      <div>

        <p className="text-sm font-medium text-slate-800">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>

      </div>

      <button className="relative h-6 w-11 shrink-0 rounded-full bg-purple-600">

        <span className="absolute right-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm" />

      </button>

    </div>
  )
}

/* Summary Item */

interface SummaryItemProps {
  label: string
  value: string
}

function SummaryItem({
  label,
  value,
}: SummaryItemProps) {
  return (
    <div>

      <p className="text-sm text-purple-700">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-purple-900">
        {value}
      </p>

    </div>
  )
}

export default QuizBuilder