import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  FileText,
  GripVertical,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Video,
  X,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'



const API_URL =
  'http://localhost:5000'


interface Lesson {
  id: number
  topicId: number
  title: string
  description: string
  content: string[]
  resources: unknown[]
  position: number
  estimatedMinutes: number | null
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}


interface RoleInfo {
  id: number
  slug: string
  title: string
}


interface TopicInfo {
  id: number
  slug: string
  title: string
  description: string
  duration: string | number | null
  position: number
}


interface LessonsResponse {
  success: boolean
  message?: string
  role?: RoleInfo
  topic?: TopicInfo
  lessons?: Lesson[]
  lessonCount?: number
}


interface LessonMutationResponse {
  success: boolean
  message?: string
  lesson?: Lesson
}


interface AddLessonForm {
  title: string
  description: string
  estimatedMinutes: string
  content: string
}


const EMPTY_FORM: AddLessonForm = {
  title: '',
  description: '',
  estimatedMinutes: '',
  content: '',
}


function getToken() {
  return localStorage.getItem(
    'skillforge-token'
  )
}


function LessonManagement() {
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
  | DATABASE STATE
  |--------------------------------------------------------------------------
  */

  const [
    role,
    setRole,
  ] =
    useState<RoleInfo | null>(
      null
    )

  const [
    topic,
    setTopic,
  ] =
    useState<TopicInfo | null>(
      null
    )

  const [
    lessons,
    setLessons,
  ] =
    useState<Lesson[]>([])

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [
    pageError,
    setPageError,
  ] =
    useState('')

  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState('')

  /*
  |--------------------------------------------------------------------------
  | ADD LESSON STATE
  |--------------------------------------------------------------------------
  */

  const [
    addModalOpen,
    setAddModalOpen,
  ] =
    useState(false)

  const [
    addForm,
    setAddForm,
  ] =
    useState<AddLessonForm>(
      EMPTY_FORM
    )

  const [
    addError,
    setAddError,
  ] =
    useState('')

  const [
    addingLesson,
    setAddingLesson,
  ] =
    useState(false)

  /*
  |--------------------------------------------------------------------------
  | DELETE STATE
  |--------------------------------------------------------------------------
  */

  const [
    deletingLessonId,
    setDeletingLessonId,
  ] =
    useState<number | null>(
      null
    )


  /*
  |--------------------------------------------------------------------------
  | LOAD LESSONS
  |--------------------------------------------------------------------------
  */

  const loadLessons =
    useCallback(async () => {
      if (!roleId || !topicId) {
        setLoading(false)
        return
      }

      const token =
        getToken()

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

        const response =
          await fetch(
            `${API_URL}/api/admin/roles/${encodeURIComponent(
              roleId
            )}/topics/${encodeURIComponent(
              topicId
            )}/lessons`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        const data =
          (await response.json()) as
            LessonsResponse

        if (
          !response.ok ||
          !data.success ||
          !data.role ||
          !data.topic ||
          !Array.isArray(
            data.lessons
          )
        ) {
          throw new Error(
            data.message ||
              'Unable to load lessons'
          )
        }

        setRole(data.role)
        setTopic(data.topic)
        setLessons(
          data.lessons
        )
      } catch (error) {
        console.error(
          'Load lessons error:',
          error
        )

        setRole(null)
        setTopic(null)
        setLessons([])

        setPageError(
          error instanceof Error
            ? error.message
            : 'Unable to load lessons'
        )
      } finally {
        setLoading(false)
      }
    }, [roleId, topicId])


  useEffect(() => {
    void loadLessons()
  }, [loadLessons])


  /*
  |--------------------------------------------------------------------------
  | HELPERS
  |--------------------------------------------------------------------------
  */

  const goBack = () => {
    navigate(
      `/admin/roles/${roleId}/topics/${topicId}`
    )
  }


  const clearSuccessSoon =
    () => {
      window.setTimeout(
        () => {
          setSuccessMessage('')
        },
        3500
      )
    }


  /*
  |--------------------------------------------------------------------------
  | EDIT LESSON
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | We now pass the real PostgreSQL lesson ID in the URL.
  |
  */

  const editLesson = (
    lessonId: number
  ) => {
    navigate(
      `/admin/roles/${roleId}/topics/${topicId}/lessons/${lessonId}`
    )
  }


  /*
  |--------------------------------------------------------------------------
  | OPEN ADD LESSON
  |--------------------------------------------------------------------------
  */

  const openAddLesson = () => {
    setAddForm({
      title: '',
      description: '',
      estimatedMinutes: '',
      content: '',
    })

    setAddError('')
    setAddModalOpen(true)
  }


  /*
  |--------------------------------------------------------------------------
  | CLOSE ADD LESSON
  |--------------------------------------------------------------------------
  */

  const closeAddLesson = () => {
    if (addingLesson) {
      return
    }

    setAddModalOpen(false)
    setAddError('')
  }


  /*
  |--------------------------------------------------------------------------
  | CREATE LESSON
  |--------------------------------------------------------------------------
  */

  const createLesson = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    if (!roleId || !topicId) {
      return
    }

    const title =
      addForm.title.trim()

    const description =
      addForm.description.trim()

    const content =
      addForm.content.trim()

    if (title.length < 2) {
      setAddError(
        'Enter a lesson title.'
      )
      return
    }

    let estimatedMinutes:
      number | null = null

    if (
      addForm.estimatedMinutes.trim()
    ) {
      estimatedMinutes =
        Number(
          addForm.estimatedMinutes
        )

      if (
        !Number.isInteger(
          estimatedMinutes
        ) ||
        estimatedMinutes <= 0
      ) {
        setAddError(
          'Estimated duration must be a positive whole number.'
        )
        return
      }
    }

    const token =
      getToken()

    if (!token) {
      setAddError(
        'Your admin session is missing. Please sign in again.'
      )
      return
    }

    try {
      setAddingLesson(true)
      setAddError('')

      const response =
        await fetch(
          `${API_URL}/api/admin/roles/${encodeURIComponent(
            roleId
          )}/topics/${encodeURIComponent(
            topicId
          )}/lessons`,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              title,
              description,

              content:
                content
                  ? [content]
                  : [],

              resources: [],

              estimatedMinutes,
            }),
          }
        )

      const data =
        (await response.json()) as
          LessonMutationResponse

      if (
        !response.ok ||
        !data.success ||
        !data.lesson
      ) {
        throw new Error(
          data.message ||
            'Unable to add lesson'
        )
      }

      setAddModalOpen(false)

      setAddForm({
        title: '',
        description: '',
        estimatedMinutes: '',
        content: '',
      })

      setSuccessMessage(
        'Lesson added successfully.'
      )

      clearSuccessSoon()

      await loadLessons()
    } catch (error) {
      console.error(
        'Create lesson error:',
        error
      )

      setAddError(
        error instanceof Error
          ? error.message
          : 'Unable to add lesson'
      )
    } finally {
      setAddingLesson(false)
    }
  }


  /*
  |--------------------------------------------------------------------------
  | DELETE LESSON
  |--------------------------------------------------------------------------
  */

  const deleteLesson = async (
    lesson: Lesson
  ) => {
    const confirmed =
      window.confirm(
        `Delete this lesson?\n\n${lesson.title}\n\nThe lesson will no longer be available to employees.`
      )

    if (!confirmed) {
      return
    }

    const token =
      getToken()

    if (!token) {
      setPageError(
        'Your admin session is missing. Please sign in again.'
      )
      return
    }

    try {
      setDeletingLessonId(
        lesson.id
      )

      setPageError('')

      const response =
        await fetch(
          `${API_URL}/api/admin/lessons/${lesson.id}`,
          {
            method: 'DELETE',

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        )

      const data =
        (await response.json()) as
          LessonMutationResponse

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            'Unable to delete lesson'
        )
      }

      setSuccessMessage(
        'Lesson deleted successfully.'
      )

      clearSuccessSoon()

      await loadLessons()
    } catch (error) {
      console.error(
        'Delete lesson error:',
        error
      )

      setPageError(
        error instanceof Error
          ? error.message
          : 'Unable to delete lesson'
      )
    } finally {
      setDeletingLessonId(
        null
      )
    }
  }


  /*
  |--------------------------------------------------------------------------
  | INVALID URL
  |--------------------------------------------------------------------------
  */

  if (
    
    !roleId ||
    !topicId
  ) {
    return (
      <AdminLayout>

        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

          <div className="mx-auto max-w-6xl">

            <button
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

              <BookOpen
                size={40}
                className="mx-auto text-slate-300"
              />

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                Topic not found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                The requested role or
                topic does not exist.
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
                Loading lessons...
              </p>

            </div>

          </div>

        </div>

      </AdminLayout>
    )
  }


  /*
  |--------------------------------------------------------------------------
  | API ERROR
  |--------------------------------------------------------------------------
  */

  if (!role || !topic) {
    return (
      <AdminLayout>

        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

          <div className="mx-auto max-w-6xl">

            <button
              onClick={goBack}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-purple-600"
            >
              <ArrowLeft
                size={17}
              />

              Back to Topic
            </button>


            <div className="mt-8 rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">

              <BookOpen
                size={40}
                className="mx-auto text-red-300"
              />

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                Unable to load lessons
              </h1>

              <p className="mt-2 text-sm text-red-600">
                {pageError ||
                  'Lessons could not be loaded.'}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadLessons()
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


  const totalMinutes =
    lessons.reduce(
      (total, lesson) =>
        total +
        (lesson.estimatedMinutes ??
          0),
      0
    )


  return (
    <AdminLayout>

      <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

        <div className="mx-auto max-w-7xl">

          {/* Back */}

          <button
            onClick={goBack}
            className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-purple-600"
          >
            <ArrowLeft
              size={17}
            />

            {topic.title}
          </button>


          {/* Header */}

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-sm font-semibold text-purple-600">
                {role.title}
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-950">
                Lesson Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Manage the lesson
                sequence and learning
                content for{' '}
                {topic.title}.
              </p>

            </div>


            <button
              type="button"
              onClick={
                openAddLesson
              }
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              <Plus size={17} />
              Add Lesson
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
              value={
                lessons.length
              }
              label="Total Lessons"
            />

            <StatCard
              value={
                topic.duration ||
                'Configured'
              }
              label="Topic Duration"
            />

            <StatCard
              value={
                totalMinutes > 0
                  ? `${totalMinutes} min`
                  : lessons.length
              }
              label={
                totalMinutes > 0
                  ? 'Lesson Duration'
                  : 'Active Lessons'
              }
            />

          </div>


          {/* Lesson list */}

          <div className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <h2 className="text-lg font-bold text-slate-900">
                  Lesson Sequence
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Lessons are completed
                  in this order before
                  the topic assessment
                  becomes available.
                </p>

              </div>


              <button
                type="button"
                onClick={
                  openAddLesson
                }
                className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
              >
                <Plus size={16} />
                Add Lesson
              </button>

            </div>


            {lessons.length > 0 ? (
              <div className="divide-y divide-slate-100">

                {lessons.map(
                  (
                    lesson,
                    index
                  ) => (
                    <LessonRow
                      key={
                        lesson.id
                      }
                      number={
                        index + 1
                      }
                      lesson={
                        lesson
                      }
                      deleting={
                        deletingLessonId ===
                        lesson.id
                      }
                      onEdit={() =>
                        editLesson(
                          lesson.id
                        )
                      }
                      onDelete={() =>
                        void deleteLesson(
                          lesson
                        )
                      }
                    />
                  )
                )}

              </div>
            ) : (
              <div className="p-10 text-center">

                <BookOpen
                  size={38}
                  className="mx-auto text-slate-300"
                />

                <p className="mt-4 font-semibold text-slate-700">
                  No lessons yet
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Add the first lesson
                  for this topic.
                </p>

                <button
                  type="button"
                  onClick={
                    openAddLesson
                  }
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-purple-700"
                >
                  <Plus size={16} />
                  Add Lesson
                </button>

              </div>
            )}

          </div>


          {/* Workflow */}

          <div className="mt-7 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <h2 className="font-bold text-slate-900">
              Lesson Content Workflow
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Each lesson can contain
              structured learning content
              and supporting resources.
            </p>


            <div className="mt-6 grid gap-4 md:grid-cols-4">

              <WorkflowCard
                icon={
                  <FileText
                    size={19}
                  />
                }
                number="01"
                title="Lesson Content"
                description="Add explanations, notes and structured learning material."
              />

              <WorkflowCard
                icon={
                  <Video
                    size={19}
                  />
                }
                number="02"
                title="Video"
                description="Attach lesson media or external learning resources."
              />

              <WorkflowCard
                icon={
                  <BookOpen
                    size={19}
                  />
                }
                number="03"
                title="Resources"
                description="Add references and supporting learning links."
              />

              <WorkflowCard
                icon={
                  <ArrowRight
                    size={19}
                  />
                }
                number="04"
                title="Available"
                description="Active PostgreSQL lessons are available to the employee learning flow."
              />

            </div>

          </div>


          {/* PostgreSQL notice */}

          <div className="mt-7 rounded-2xl border border-green-100 bg-green-50 p-5">

            <p className="text-sm font-semibold text-green-800">
              PostgreSQL lesson management
            </p>

            <p className="mt-2 text-sm leading-6 text-green-700">
              This lesson list now comes
              directly from PostgreSQL.
              Adding and deleting lessons
              updates the same lesson
              records used by the
              employee learning flow.
            </p>

          </div>

        </div>

      </div>


      {/* Add Lesson Modal */}

      {addModalOpen && (
        <AddLessonModal
          form={addForm}
          error={addError}
          saving={
            addingLesson
          }
          onChange={(
            field,
            value
          ) =>
            setAddForm(
              (current) => ({
                ...current,
                [field]: value,
              })
            )
          }
          onClose={
            closeAddLesson
          }
          onSubmit={
            createLesson
          }
        />
      )}

    </AdminLayout>
  )
}


/*
|--------------------------------------------------------------------------
| ADD LESSON MODAL
|--------------------------------------------------------------------------
*/

interface AddLessonModalProps {
  form: AddLessonForm
  error: string
  saving: boolean

  onChange: (
    field: keyof AddLessonForm,
    value: string
  ) => void

  onClose: () => void

  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void
}


function AddLessonModal({
  form,
  error,
  saving,
  onChange,
  onClose,
  onSubmit,
}: AddLessonModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

      <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">

          <div>

            <h2 className="text-xl font-bold text-slate-950">
              Add Lesson
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Create a new lesson for
              this topic.
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
              htmlFor="new-lesson-title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Lesson Title
            </label>

            <input
              id="new-lesson-title"
              type="text"
              value={form.title}
              onChange={(event) =>
                onChange(
                  'title',
                  event.target.value
                )
              }
              disabled={saving}
              placeholder="e.g. Semantic HTML"
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
            />

          </div>


          <div className="mt-5">

            <label
              htmlFor="new-lesson-description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Lesson Description
            </label>

            <textarea
              id="new-lesson-description"
              rows={3}
              value={
                form.description
              }
              onChange={(event) =>
                onChange(
                  'description',
                  event.target.value
                )
              }
              disabled={saving}
              placeholder="What will employees learn in this lesson?"
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
            />

          </div>


          <div className="mt-5">

            <label
              htmlFor="new-lesson-duration"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Estimated Duration
            </label>

            <div className="relative">

              <input
                id="new-lesson-duration"
                type="number"
                min={1}
                step={1}
                value={
                  form.estimatedMinutes
                }
                onChange={(event) =>
                  onChange(
                    'estimatedMinutes',
                    event.target.value
                  )
                }
                disabled={saving}
                placeholder="25"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-20 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
              />

              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                minutes
              </span>

            </div>

          </div>


          <div className="mt-5">

            <label
              htmlFor="new-lesson-content"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Initial Lesson Content
            </label>

            <textarea
              id="new-lesson-content"
              rows={7}
              value={form.content}
              onChange={(event) =>
                onChange(
                  'content',
                  event.target.value
                )
              }
              disabled={saving}
              placeholder="Enter the initial lesson explanation or leave this blank and add it later through Edit Lesson."
              className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
            />

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
                ? 'Adding...'
                : 'Add Lesson'}

            </button>

          </div>

        </form>

      </div>

    </div>
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
| LESSON ROW
|--------------------------------------------------------------------------
*/

interface LessonRowProps {
  number: number
  lesson: Lesson
  deleting: boolean
  onEdit: () => void
  onDelete: () => void
}


function LessonRow({
  number,
  lesson,
  deleting,
  onEdit,
  onDelete,
}: LessonRowProps) {
  return (
    <div className="flex items-center gap-4 p-5 transition hover:bg-slate-50">

      <GripVertical
        size={18}
        className="shrink-0 text-slate-300"
      />


      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-xs font-bold text-purple-700">
        {String(
          number
        ).padStart(2, '0')}
      </div>


      <div className="min-w-0 flex-1">

        <p className="truncate text-sm font-semibold text-slate-800">
          {lesson.title}
        </p>

        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-400">

          <span>
            Lesson {number}
          </span>

          {lesson.estimatedMinutes !==
            null && (
            <>
              <span>•</span>

              <span>
                {
                  lesson.estimatedMinutes
                }{' '}
                min
              </span>
            </>
          )}

          <span>•</span>

          <span>
            ID {lesson.id}
          </span>

        </div>

      </div>


      <span className="hidden rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:inline-flex">
        Learning Content
      </span>


      <div className="flex items-center gap-2">

        <button
          type="button"
          onClick={onEdit}
          disabled={deleting}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-purple-200 hover:text-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Pencil size={15} />

          <span className="hidden sm:inline">
            Edit Lesson
          </span>
        </button>


        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="flex items-center gap-2 rounded-xl border border-red-100 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
        >

          {deleting ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <Trash2 size={15} />
          )}

          <span className="hidden lg:inline">
            {deleting
              ? 'Deleting...'
              : 'Delete'}
          </span>

        </button>

      </div>

    </div>
  )
}


/*
|--------------------------------------------------------------------------
| WORKFLOW CARD
|--------------------------------------------------------------------------
*/

interface WorkflowCardProps {
  icon: ReactNode
  number: string
  title: string
  description: string
}


function WorkflowCard({
  icon,
  number,
  title,
  description,
}: WorkflowCardProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <div className="flex items-center justify-between">

        <div className="text-purple-600">
          {icon}
        </div>

        <span className="text-xs font-bold text-purple-600">
          {number}
        </span>

      </div>

      <p className="mt-4 text-sm font-semibold text-slate-800">
        {title}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>

    </div>
  )
}


export default LessonManagement