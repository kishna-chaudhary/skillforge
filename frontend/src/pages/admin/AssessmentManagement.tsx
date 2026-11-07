import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'

import {
  ArrowLeft,
  CheckCircle2,
  ClipboardCheck,
  Loader2,
  Pencil,
  Plus,
  Settings2,
  ShieldCheck,
  Shuffle,
  Trash2,
  X,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'


const API_URL = 'http://localhost:5000'


interface AssessmentOption {
  id: number
  optionText: string
  isCorrect: boolean
  position: number
}


interface AssessmentQuestion {
  id: number
  questionText: string
  position: number
  options: AssessmentOption[]
  correctAnswer: number | null
}


interface AssessmentData {
  id: number
  title: string
  description: string
  passingScore: number
  durationMinutes: number | null

  role: {
    id: number
    slug: string
    title: string
  }

  topic: {
    id: number
    slug: string
    title: string
  }

  questions: AssessmentQuestion[]
}


interface AssessmentResponse {
  success: boolean
  message?: string
  assessment?: AssessmentData
}


interface QuestionResponse {
  success: boolean
  message?: string
  question?: AssessmentQuestion
}


interface QuestionFormState {
  questionText: string

  options: [
    string,
    string,
    string,
    string,
  ]

  correctAnswer: number
}


const EMPTY_QUESTION_FORM: QuestionFormState = {
  questionText: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
}


function getToken() {
  return localStorage.getItem(
    'skillforge-token'
  )
}


function formatSlugTitle(
  slug: string
) {
  return slug
    .split('-')
    .filter(Boolean)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(' ')
}


function AssessmentManagement() {
  const navigate = useNavigate()

  const {
    roleId,
    topicId,
  } = useParams<{
    roleId: string
    topicId: string
  }>()


  /*
  |--------------------------------------------------------------------------
  | ASSESSMENT STATE
  |--------------------------------------------------------------------------
  */

  const [
    assessment,
    setAssessment,
  ] =
    useState<AssessmentData | null>(
      null
    )

  const [
    loading,
    setLoading,
  ] = useState(true)

  const [
    pageError,
    setPageError,
  ] = useState('')

  const [
    assessmentMissing,
    setAssessmentMissing,
  ] = useState(false)


  /*
  |--------------------------------------------------------------------------
  | CREATE ASSESSMENT STATE
  |--------------------------------------------------------------------------
  */

  const [
    creatingAssessment,
    setCreatingAssessment,
  ] = useState(false)

  const [
    createError,
    setCreateError,
  ] = useState('')


  /*
  |--------------------------------------------------------------------------
  | QUESTION MODAL STATE
  |--------------------------------------------------------------------------
  */

  const [
    questionModalOpen,
    setQuestionModalOpen,
  ] = useState(false)

  const [
    editingQuestion,
    setEditingQuestion,
  ] =
    useState<AssessmentQuestion | null>(
      null
    )

  const [
    questionForm,
    setQuestionForm,
  ] =
    useState<QuestionFormState>(
      EMPTY_QUESTION_FORM
    )

  const [
    formError,
    setFormError,
  ] = useState('')

  const [
    savingQuestion,
    setSavingQuestion,
  ] = useState(false)


  /*
  |--------------------------------------------------------------------------
  | DELETE STATE
  |--------------------------------------------------------------------------
  */

  const [
    deletingQuestionId,
    setDeletingQuestionId,
  ] =
    useState<number | null>(
      null
    )


  /*
  |--------------------------------------------------------------------------
  | SUCCESS MESSAGE
  |--------------------------------------------------------------------------
  */

  const [
    successMessage,
    setSuccessMessage,
  ] = useState('')


  /*
  |--------------------------------------------------------------------------
  | LOAD ASSESSMENT
  |--------------------------------------------------------------------------
  */

  const loadAssessment =
    useCallback(async () => {
      if (!roleId || !topicId) {
        setLoading(false)
        return
      }

      const token = getToken()

      if (!token) {
        setPageError(
          'Your admin session is missing. Please sign in again.'
        )

        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setPageError('')
        setCreateError('')

        const response =
          await fetch(
            `${API_URL}/api/admin/assessments/${encodeURIComponent(
              roleId
            )}/topics/${encodeURIComponent(
              topicId
            )}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        const data =
          (await response.json()) as
            AssessmentResponse

        /*
        |--------------------------------------------------------------------------
        | NEW TOPIC WITHOUT ASSESSMENT
        |--------------------------------------------------------------------------
        */

        if (response.status === 404) {
          setAssessment(null)
          setAssessmentMissing(true)
          setPageError('')
          return
        }

        if (
          !response.ok ||
          !data.success ||
          !data.assessment
        ) {
          throw new Error(
            data.message ||
              'Unable to load assessment'
          )
        }

        setAssessmentMissing(false)
        setAssessment(
          data.assessment
        )
      } catch (error) {
        console.error(
          'Load assessment error:',
          error
        )

        setAssessment(null)
        setAssessmentMissing(false)

        setPageError(
          error instanceof Error
            ? error.message
            : 'Unable to load assessment'
        )
      } finally {
        setLoading(false)
      }
    }, [roleId, topicId])


  useEffect(() => {
    void loadAssessment()
  }, [loadAssessment])


  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const goBack = () => {
    if (!roleId || !topicId) {
      navigate('/admin/roles')
      return
    }

    navigate(
      `/admin/roles/${roleId}/topics/${topicId}`
    )
  }


  const clearSuccessSoon = () => {
    window.setTimeout(() => {
      setSuccessMessage('')
    }, 3500)
  }


  /*
  |--------------------------------------------------------------------------
  | CREATE ASSESSMENT
  |--------------------------------------------------------------------------
  */

  const createAssessment =
    async () => {
      if (!roleId || !topicId) {
        return
      }

      const token = getToken()

      if (!token) {
        setCreateError(
          'Your admin session is missing. Please sign in again.'
        )
        return
      }

      try {
        setCreatingAssessment(true)
        setCreateError('')

        const topicTitle =
          formatSlugTitle(topicId)

        const response =
          await fetch(
            `${API_URL}/api/admin/assessments/${encodeURIComponent(
              roleId
            )}/topics/${encodeURIComponent(
              topicId
            )}`,
            {
              method: 'POST',

              headers: {
                'Content-Type':
                  'application/json',

                Authorization:
                  `Bearer ${token}`,
              },

              body: JSON.stringify({
                title:
                  `${topicTitle} Assessment`,

                description:
                  `Complete this assessment to demonstrate your understanding of ${topicTitle}.`,

                passingScore: 70,

                durationMinutes: 10,
              }),
            }
          )

        const data =
          (await response.json()) as
            AssessmentResponse

        if (
          !response.ok ||
          !data.success ||
          !data.assessment
        ) {
          throw new Error(
            data.message ||
              'Unable to create assessment'
          )
        }

        setAssessment(
          data.assessment
        )

        setAssessmentMissing(false)

        setSuccessMessage(
          'Assessment created successfully.'
        )

        clearSuccessSoon()
      } catch (error) {
        console.error(
          'Create assessment error:',
          error
        )

        setCreateError(
          error instanceof Error
            ? error.message
            : 'Unable to create assessment'
        )
      } finally {
        setCreatingAssessment(false)
      }
    }


  /*
  |--------------------------------------------------------------------------
  | OPEN ADD QUESTION
  |--------------------------------------------------------------------------
  */

  const openAddQuestion = () => {
    setEditingQuestion(null)

    setQuestionForm({
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
    })

    setFormError('')
    setQuestionModalOpen(true)
  }


  /*
  |--------------------------------------------------------------------------
  | OPEN EDIT QUESTION
  |--------------------------------------------------------------------------
  */

  const openEditQuestion = (
    question: AssessmentQuestion
  ) => {
    const optionValues = [
      question.options[0]
        ?.optionText ?? '',

      question.options[1]
        ?.optionText ?? '',

      question.options[2]
        ?.optionText ?? '',

      question.options[3]
        ?.optionText ?? '',
    ] as [
      string,
      string,
      string,
      string,
    ]

    const correctAnswer =
      question.correctAnswer !== null &&
      question.correctAnswer >= 0 &&
      question.correctAnswer <= 3
        ? question.correctAnswer
        : 0

    setEditingQuestion(question)

    setQuestionForm({
      questionText:
        question.questionText,

      options:
        optionValues,

      correctAnswer,
    })

    setFormError('')
    setQuestionModalOpen(true)
  }


  /*
  |--------------------------------------------------------------------------
  | CLOSE QUESTION MODAL
  |--------------------------------------------------------------------------
  */

  const closeQuestionModal = () => {
    if (savingQuestion) {
      return
    }

    setQuestionModalOpen(false)
    setEditingQuestion(null)
    setFormError('')
  }


  /*
  |--------------------------------------------------------------------------
  | UPDATE OPTION
  |--------------------------------------------------------------------------
  */

  const updateOption = (
    index: number,
    value: string
  ) => {
    setQuestionForm(
      (current) => {
        const nextOptions =
          [...current.options] as [
            string,
            string,
            string,
            string,
          ]

        nextOptions[index] =
          value

        return {
          ...current,
          options: nextOptions,
        }
      }
    )
  }


  /*
  |--------------------------------------------------------------------------
  | SAVE QUESTION
  |--------------------------------------------------------------------------
  */

  const saveQuestion = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!assessment) {
      setFormError(
        'Assessment is not available.'
      )
      return
    }

    const questionText =
      questionForm.questionText.trim()

    const options =
      questionForm.options.map(
        (option) =>
          option.trim()
      ) as [
        string,
        string,
        string,
        string,
      ]

    if (
      questionText.length < 3
    ) {
      setFormError(
        'Enter a question with at least 3 characters.'
      )
      return
    }

    if (
      options.some(
        (option) =>
          option.length === 0
      )
    ) {
      setFormError(
        'Enter all four answer options.'
      )
      return
    }

    const token = getToken()

    if (!token) {
      setFormError(
        'Your admin session is missing. Please sign in again.'
      )
      return
    }

    try {
      setSavingQuestion(true)
      setFormError('')

      const editing =
        editingQuestion !== null

      const endpoint =
        editing
          ? `${API_URL}/api/admin/assessment-questions/${editingQuestion.id}`
          : `${API_URL}/api/admin/assessments/${assessment.id}/questions`

      const response =
        await fetch(endpoint, {
          method:
            editing
              ? 'PUT'
              : 'POST',

          headers: {
            'Content-Type':
              'application/json',

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            questionText,
            options,

            correctAnswer:
              questionForm.correctAnswer,
          }),
        })

      const data =
        (await response.json()) as
          QuestionResponse

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            'Unable to save question'
        )
      }

      setQuestionModalOpen(false)
      setEditingQuestion(null)

      setSuccessMessage(
        editing
          ? 'Question updated successfully.'
          : 'Question added successfully.'
      )

      clearSuccessSoon()

      await loadAssessment()
    } catch (error) {
      console.error(
        'Save question error:',
        error
      )

      setFormError(
        error instanceof Error
          ? error.message
          : 'Unable to save question'
      )
    } finally {
      setSavingQuestion(false)
    }
  }


  /*
  |--------------------------------------------------------------------------
  | DELETE QUESTION
  |--------------------------------------------------------------------------
  */

  const deleteQuestion = async (
    question: AssessmentQuestion
  ) => {
    const confirmed =
      window.confirm(
        `Delete this question?\n\n${question.questionText}\n\nThis removes it from future assessment attempts.`
      )

    if (!confirmed) {
      return
    }

    const token = getToken()

    if (!token) {
      setPageError(
        'Your admin session is missing. Please sign in again.'
      )
      return
    }

    try {
      setDeletingQuestionId(
        question.id
      )

      setPageError('')

      const response =
        await fetch(
          `${API_URL}/api/admin/assessment-questions/${question.id}`,
          {
            method: 'DELETE',

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

      const data =
        (await response.json()) as {
          success: boolean
          message?: string
        }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            'Unable to delete question'
        )
      }

      setSuccessMessage(
        'Question deleted successfully.'
      )

      clearSuccessSoon()

      await loadAssessment()
    } catch (error) {
      console.error(
        'Delete question error:',
        error
      )

      setPageError(
        error instanceof Error
          ? error.message
          : 'Unable to delete question'
      )
    } finally {
      setDeletingQuestionId(
        null
      )
    }
  }


  /*
  |--------------------------------------------------------------------------
  | INVALID URL
  |--------------------------------------------------------------------------
  */

  if (!roleId || !topicId) {
    return (
      <AdminLayout>

        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

          <div className="mx-auto max-w-6xl">

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/admin/roles'
                )
              }
              className="flex items-center gap-2 text-sm font-semibold text-purple-600"
            >
              <ArrowLeft
                size={17}
              />

              Back to Career Roles
            </button>


            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <ClipboardCheck
                size={40}
                className="mx-auto text-slate-300"
              />

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                Invalid assessment URL
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Career role and topic are
                required.
              </p>

            </div>

          </div>

        </div>

      </AdminLayout>
    )
  }


  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <AdminLayout>

        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

          <div className="mx-auto flex min-h-[420px] max-w-7xl items-center justify-center">

            <div className="text-center">

              <Loader2
                size={36}
                className="mx-auto animate-spin text-purple-600"
              />

              <p className="mt-4 text-sm font-semibold text-slate-700">
                Loading assessment...
              </p>

            </div>

          </div>

        </div>

      </AdminLayout>
    )
  }


  /*
  |--------------------------------------------------------------------------
  | NO ASSESSMENT YET
  |--------------------------------------------------------------------------
  */

  if (
    assessmentMissing &&
    !assessment
  ) {
    const topicTitle =
      formatSlugTitle(topicId)

    return (
      <AdminLayout>

        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

          <div className="mx-auto max-w-6xl">

            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-purple-600"
            >
              <ArrowLeft
                size={17}
              />

              Back to Topic
            </button>


            <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">

              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">

                <ClipboardCheck
                  size={32}
                />

              </div>


              <p className="mt-6 text-sm font-semibold text-purple-600">
                {topicTitle}
              </p>


              <h1 className="mt-2 text-2xl font-bold text-slate-950">
                No assessment configured
              </h1>


              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">
                This topic exists in
                PostgreSQL, but it does
                not have an assessment
                yet. Create the
                assessment first and
                then add its questions.
              </p>


              <div className="mx-auto mt-7 max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left">

                <p className="text-sm font-bold text-slate-800">
                  Initial configuration
                </p>

                <div className="mt-4 space-y-3">

                  <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                      Assessment
                    </span>

                    <span className="font-semibold text-slate-800">
                      {topicTitle}{' '}
                      Assessment
                    </span>

                  </div>


                  <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                      Passing score
                    </span>

                    <span className="font-semibold text-slate-800">
                      70%
                    </span>

                  </div>


                  <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                      Time limit
                    </span>

                    <span className="font-semibold text-slate-800">
                      10 minutes
                    </span>

                  </div>


                  <div className="flex items-center justify-between text-sm">

                    <span className="text-slate-500">
                      Questions
                    </span>

                    <span className="font-semibold text-slate-800">
                      0
                    </span>

                  </div>

                </div>

              </div>


              {createError && (
                <div className="mx-auto mt-5 max-w-md rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {createError}
                </div>
              )}


              <button
                type="button"
                onClick={() =>
                  void createAssessment()
                }
                disabled={
                  creatingAssessment
                }
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
              >

                {creatingAssessment ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Creating...
                  </>
                ) : (
                  <>
                    <Plus size={17} />

                    Create Assessment
                  </>
                )}

              </button>

            </div>

          </div>

        </div>

      </AdminLayout>
    )
  }


  /*
  |--------------------------------------------------------------------------
  | ASSESSMENT LOAD ERROR
  |--------------------------------------------------------------------------
  */

  if (!assessment) {
    return (
      <AdminLayout>

        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

          <div className="mx-auto max-w-6xl">

            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-purple-600"
            >
              <ArrowLeft
                size={17}
              />

              Back to Topic
            </button>


            <div className="mt-8 rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">

              <ClipboardCheck
                size={40}
                className="mx-auto text-red-300"
              />

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                Unable to load assessment
              </h1>

              <p className="mt-2 text-sm text-red-600">
                {pageError ||
                  'Assessment could not be loaded.'}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadAssessment()
                }
                className="mt-6 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                Retry
              </button>

            </div>

          </div>

        </div>

      </AdminLayout>
    )
  }


  const questionCount =
    assessment.questions.length

  const passingScore =
    assessment.passingScore

  const durationMinutes =
    assessment.durationMinutes ??
    10


  return (
    <AdminLayout>

      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

        <div className="mx-auto max-w-7xl">


          {/* Back */}

          <button
            type="button"
            onClick={goBack}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-purple-600"
          >
            <ArrowLeft
              size={17}
            />

            Back to Topic
          </button>


          {/* Header */}

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-sm font-semibold text-purple-600">
                {assessment.role.title}
                {' • '}
                {assessment.topic.title}
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-950">
                Assessment Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage the topic question
                bank used by employees
                for this assessment.
              </p>

            </div>


            <button
              type="button"
              onClick={
                openAddQuestion
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              <Plus size={17} />

              Add Question
            </button>

          </div>


          {/* Success */}

          {successMessage && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              {successMessage}
            </div>
          )}


          {/* Error */}

          {pageError && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {pageError}
            </div>
          )}


          {/* Stats */}

          <div className="mt-7 grid gap-4 sm:grid-cols-3">

            <StatCard
              value={questionCount}
              label="Questions"
            />

            <StatCard
              value={`${passingScore}%`}
              label="Passing Score"
            />

            <StatCard
              value="Configured"
              label="Assessment Status"
            />

          </div>


          {/* Assessment workflow */}

          <div className="mt-7 grid gap-5 lg:grid-cols-3">

            <FeatureCard
              icon={
                <ClipboardCheck
                  size={21}
                />
              }
              title="Question Bank"
              description="Questions and answer choices are loaded directly from PostgreSQL."
            />

            <FeatureCard
              icon={
                <Shuffle
                  size={21}
                />
              }
              title="Assessment Questions"
              description={`${questionCount} active questions are currently available for this assessment.`}
            />

            <FeatureCard
              icon={
                <ShieldCheck
                  size={21}
                />
              }
              title="Server-side Scoring"
              description="Correct answers remain protected from the employee assessment API and scoring is performed by the backend."
            />

          </div>


          {/* Question Bank */}

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Question Bank
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Questions currently
                  configured for{' '}
                  {
                    assessment.topic
                      .title
                  }.
                </p>

              </div>


              <button
                type="button"
                onClick={
                  openAddQuestion
                }
                className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
              >
                <Plus size={16} />

                Add Question
              </button>

            </div>


            {assessment.questions.length >
            0 ? (
              <div className="divide-y divide-slate-100">

                {assessment.questions.map(
                  (
                    question,
                    index
                  ) => (
                    <QuestionCard
                      key={
                        question.id
                      }
                      number={
                        index + 1
                      }
                      question={
                        question
                      }
                      deleting={
                        deletingQuestionId ===
                        question.id
                      }
                      onEdit={() =>
                        openEditQuestion(
                          question
                        )
                      }
                      onDelete={() =>
                        void deleteQuestion(
                          question
                        )
                      }
                    />
                  )
                )}

              </div>
            ) : (
              <div className="p-10 text-center">

                <ClipboardCheck
                  size={36}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-4 font-semibold text-slate-700">
                  No questions configured
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Add the first question
                  to this assessment.
                </p>

                <button
                  type="button"
                  onClick={
                    openAddQuestion
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  <Plus size={16} />

                  Add Question
                </button>

              </div>
            )}

          </div>


          {/* Settings */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <Settings2
                  size={21}
                />
              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  Assessment Settings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Current assessment
                  configuration from
                  PostgreSQL.
                </p>

              </div>

            </div>


            <div className="mt-6 grid gap-5 md:grid-cols-2">

              <SettingField
                label="Passing Score"
              >

                <div className="relative">

                  <input
                    type="number"
                    value={
                      passingScore
                    }
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-600 outline-none"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    %
                  </span>

                </div>

              </SettingField>


              <SettingField
                label="Time Limit"
              >

                <div className="relative">

                  <input
                    type="number"
                    value={
                      durationMinutes
                    }
                    readOnly
                    className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-20 text-sm text-slate-600 outline-none"
                  />

                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                    minutes
                  </span>

                </div>

              </SettingField>

            </div>


            <p className="mt-4 text-xs leading-5 text-slate-400">
              Question management is
              fully connected to
              PostgreSQL.
            </p>

          </div>


          {/* Completion rule */}

          <div className="mt-7 rounded-2xl border border-green-100 bg-green-50 p-5">

            <div className="flex items-start gap-3">

              <CheckCircle2
                size={20}
                className="mt-0.5 shrink-0 text-green-600"
              />

              <div>

                <p className="text-sm font-semibold text-green-800">
                  SkillForge topic
                  completion rule
                </p>

                <p className="mt-2 text-sm leading-6 text-green-700">
                  Completing the lessons
                  alone does not complete
                  the topic. Employees
                  must complete every
                  lesson and then pass
                  this assessment before
                  the topic is marked as
                  completed.
                </p>

              </div>

            </div>

          </div>


          {/* Connected notice */}

          <div className="mt-6 rounded-2xl border border-purple-100 bg-purple-50 p-5">

            <p className="text-sm font-semibold text-purple-800">
              PostgreSQL question bank
            </p>

            <p className="mt-2 text-sm leading-6 text-purple-700">
              Assessment questions are
              loaded from the backend.
              Adding, editing and deleting
              questions updates the
              PostgreSQL assessment
              question bank.
            </p>

          </div>

        </div>

      </div>


      {/* Question Modal */}

      {questionModalOpen && (
        <QuestionModal
          editing={
            editingQuestion !==
            null
          }
          form={
            questionForm
          }
          error={
            formError
          }
          saving={
            savingQuestion
          }
          onQuestionChange={(
            value
          ) =>
            setQuestionForm(
              (current) => ({
                ...current,

                questionText:
                  value,
              })
            )
          }
          onOptionChange={
            updateOption
          }
          onCorrectAnswerChange={(
            index
          ) =>
            setQuestionForm(
              (current) => ({
                ...current,

                correctAnswer:
                  index,
              })
            )
          }
          onClose={
            closeQuestionModal
          }
          onSubmit={
            saveQuestion
          }
        />
      )}

    </AdminLayout>
  )
}


/*
|--------------------------------------------------------------------------
| STAT CARD
|--------------------------------------------------------------------------
*/

interface StatCardProps {
  value: number | string
  label: string
}


function StatCard({
  value,
  label,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-2xl font-bold text-slate-950">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">
        {label}
      </p>

    </div>
  )
}


/*
|--------------------------------------------------------------------------
| FEATURE CARD
|--------------------------------------------------------------------------
*/

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
}


function FeatureCard({
  icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
        {icon}
      </div>

      <h3 className="mt-4 font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>

    </div>
  )
}


/*
|--------------------------------------------------------------------------
| QUESTION CARD
|--------------------------------------------------------------------------
*/

interface QuestionCardProps {
  number: number
  question: AssessmentQuestion
  deleting: boolean
  onEdit: () => void
  onDelete: () => void
}


function QuestionCard({
  number,
  question,
  deleting,
  onEdit,
  onDelete,
}: QuestionCardProps) {
  return (
    <div className="p-5">

      <div className="flex gap-4">

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xs font-bold text-purple-700">
          {String(
            number
          ).padStart(2, '0')}
        </div>


        <div className="min-w-0 flex-1">

          <p className="text-sm font-semibold leading-6 text-slate-800">
            {
              question.questionText
            }
          </p>


          <div className="mt-4 grid gap-2 md:grid-cols-2">

            {question.options.map(
              (
                option,
                index
              ) => {
                const correct =
                  option.isCorrect ||
                  index ===
                    question.correctAnswer

                return (
                  <div
                    key={
                      option.id
                    }
                    className={`rounded-xl border px-4 py-3 text-sm ${
                      correct
                        ? 'border-green-200 bg-green-50 text-green-800'
                        : 'border-slate-200 bg-slate-50 text-slate-600'
                    }`}
                  >

                    <span className="mr-2 font-semibold">
                      {String.fromCharCode(
                        65 + index
                      )}.
                    </span>

                    {
                      option.optionText
                    }

                    {correct && (
                      <span className="ml-2 text-xs font-bold text-green-600">
                        Correct
                      </span>
                    )}

                  </div>
                )
              }
            )}

          </div>


          <div className="mt-4 flex gap-2">

            <button
              type="button"
              onClick={onEdit}
              disabled={deleting}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-purple-200 hover:text-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Pencil size={13} />
              Edit
            </button>


            <button
              type="button"
              onClick={
                onDelete
              }
              disabled={
                deleting
              }
              className="flex items-center gap-1.5 rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {deleting ? (
                <Loader2
                  size={13}
                  className="animate-spin"
                />
              ) : (
                <Trash2
                  size={13}
                />
              )}

              {deleting
                ? 'Deleting...'
                : 'Delete'}

            </button>

          </div>

        </div>

      </div>

    </div>
  )
}


/*
|--------------------------------------------------------------------------
| QUESTION MODAL
|--------------------------------------------------------------------------
*/

interface QuestionModalProps {
  editing: boolean
  form: QuestionFormState
  error: string
  saving: boolean

  onQuestionChange: (
    value: string
  ) => void

  onOptionChange: (
    index: number,
    value: string
  ) => void

  onCorrectAnswerChange: (
    index: number
  ) => void

  onClose: () => void

  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void
}


function QuestionModal({
  editing,
  form,
  error,
  saving,
  onQuestionChange,
  onOptionChange,
  onCorrectAnswerChange,
  onClose,
  onSubmit,
}: QuestionModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-slate-950">
              {editing
                ? 'Edit Question'
                : 'Add Question'}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter four answer
              options and select the
              correct answer.
            </p>

          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>

        </div>


        <form
          onSubmit={onSubmit}
          className="p-6"
        >

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}


          <div>

            <label
              htmlFor="assessment-question"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Question
            </label>

            <textarea
              id="assessment-question"
              value={
                form.questionText
              }
              onChange={(event) =>
                onQuestionChange(
                  event.target.value
                )
              }
              disabled={saving}
              rows={4}
              placeholder="Enter the assessment question..."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
            />

          </div>


          <div className="mt-6">

            <div className="flex items-center justify-between">

              <p className="text-sm font-semibold text-slate-700">
                Answer Options
              </p>

              <p className="text-xs text-slate-400">
                Select one correct answer
              </p>

            </div>


            <div className="mt-3 space-y-3">

              {form.options.map(
                (
                  option,
                  index
                ) => {
                  const selected =
                    form.correctAnswer ===
                    index

                  return (
                    <div
                      key={index}
                      className={`rounded-2xl border p-4 transition ${
                        selected
                          ? 'border-green-200 bg-green-50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >

                      <div className="flex items-center gap-3">

                        <label className="flex shrink-0 cursor-pointer items-center gap-2">

                          <input
                            type="radio"
                            name="correct-answer"
                            checked={
                              selected
                            }
                            onChange={() =>
                              onCorrectAnswerChange(
                                index
                              )
                            }
                            disabled={
                              saving
                            }
                            className="h-4 w-4 accent-green-600"
                          />

                          <span
                            className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold ${
                              selected
                                ? 'bg-green-100 text-green-700'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {String.fromCharCode(
                              65 + index
                            )}
                          </span>

                        </label>


                        <input
                          type="text"
                          value={
                            option
                          }
                          onChange={(
                            event
                          ) =>
                            onOptionChange(
                              index,
                              event.target.value
                            )
                          }
                          disabled={
                            saving
                          }
                          placeholder={`Option ${String.fromCharCode(
                            65 +
                              index
                          )}`}
                          className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                        />

                      </div>


                      {selected && (
                        <p className="mt-2 pl-[84px] text-xs font-semibold text-green-600">
                          Correct answer
                        </p>
                      )}

                    </div>
                  )
                }
              )}

            </div>

          </div>


          <div className="mt-7 flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>


            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {saving && (
                <Loader2
                  size={16}
                  className="animate-spin"
                />
              )}

              {saving
                ? 'Saving...'
                : editing
                  ? 'Save Changes'
                  : 'Add Question'}

            </button>

          </div>

        </form>

      </div>

    </div>
  )
}


/*
|--------------------------------------------------------------------------
| SETTING FIELD
|--------------------------------------------------------------------------
*/

interface SettingFieldProps {
  label: string
  children: ReactNode
}


function SettingField({
  label,
  children,
}: SettingFieldProps) {
  return (
    <div>

      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>

      {children}

    </div>
  )
}


export default AssessmentManagement