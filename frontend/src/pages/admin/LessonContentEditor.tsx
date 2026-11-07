import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from 'react'

import {
  ArrowLeft,
  BookOpen,
  ExternalLink,
  FileText,
  Link,
  Loader2,
  Plus,
  Save,
  Trash2,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import AdminLayout from '../../layouts/AdminLayout'


const API_URL =
  'http://localhost:5000'


interface LessonResource {
  title: string
  type: string
  url: string
}


interface Lesson {
  id: number
  topicId: number
  title: string
  description: string
  content: string[]
  resources: LessonResource[]
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
}


interface LessonResponse {
  success: boolean
  message?: string
  role?: RoleInfo
  topic?: TopicInfo
  lesson?: Lesson
}


interface FormState {
  title: string
  description: string
  estimatedMinutes: string
  content: string
  resources: LessonResource[]
}


function getToken() {
  return localStorage.getItem(
    'skillforge-token'
  )
}


function normalizeResources(
  resources: unknown
): LessonResource[] {
  if (!Array.isArray(resources)) {
    return []
  }

  return resources
    .map((resource) => {
      if (
        !resource ||
        typeof resource !== 'object'
      ) {
        return null
      }

      const item =
        resource as Record<
          string,
          unknown
        >

      return {
        title:
          typeof item.title ===
          'string'
            ? item.title
            : '',

        type:
          typeof item.type ===
          'string'
            ? item.type
            : 'Link',

        url:
          typeof item.url ===
          'string'
            ? item.url
            : '',
      }
    })
    .filter(
      (
        resource
      ): resource is LessonResource =>
        resource !== null
    )
}


function LessonContentEditor() {
  const navigate = useNavigate()

  const {
    roleId,
    topicId,
    lessonIndex,
  } = useParams<{
    roleId: string
    topicId: string
    lessonIndex: string
  }>()

  /*
  |--------------------------------------------------------------------------
  | IMPORTANT
  |--------------------------------------------------------------------------
  |
  | The existing route still calls this parameter "lessonIndex".
  |
  | It is now the REAL PostgreSQL lesson ID.
  |
  | Example:
  | /lessons/77
  |
  */

  const lessonId =
    Number(lessonIndex)


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
    lesson,
    setLesson,
  ] =
    useState<Lesson | null>(
      null
    )

  const [
    form,
    setForm,
  ] =
    useState<FormState>({
      title: '',
      description: '',
      estimatedMinutes: '',
      content: '',
      resources: [],
    })

  const [
    loading,
    setLoading,
  ] =
    useState(true)

  const [
    saving,
    setSaving,
  ] =
    useState(false)

  const [
    error,
    setError,
  ] =
    useState('')

  const [
    successMessage,
    setSuccessMessage,
  ] =
    useState('')


  /*
  |--------------------------------------------------------------------------
  | LOAD EXISTING LESSON
  |--------------------------------------------------------------------------
  */

  const loadLesson =
    useCallback(async () => {
      if (
        !Number.isInteger(
          lessonId
        ) ||
        lessonId <= 0
      ) {
        setError(
          'Invalid lesson ID.'
        )
        setLoading(false)
        return
      }

      const token =
        getToken()

      if (!token) {
        setError(
          'Your admin session is missing. Please sign in again.'
        )
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError('')

        const response =
          await fetch(
            `${API_URL}/api/admin/lessons/${lessonId}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          )

        const data =
          (await response.json()) as
            LessonResponse

        if (
          !response.ok ||
          !data.success ||
          !data.lesson ||
          !data.role ||
          !data.topic
        ) {
          throw new Error(
            data.message ||
              'Unable to load lesson'
          )
        }

        /*
        |--------------------------------------------------------------------------
        | URL SAFETY CHECK
        |--------------------------------------------------------------------------
        |
        | Make sure the lesson actually belongs to the role/topic represented
        | by the current URL.
        |
        */

        if (
          roleId &&
          data.role.slug !== roleId
        ) {
          throw new Error(
            'This lesson does not belong to the selected career role.'
          )
        }

        if (
          topicId &&
          data.topic.slug !== topicId
        ) {
          throw new Error(
            'This lesson does not belong to the selected topic.'
          )
        }

        const loadedLesson = {
          ...data.lesson,
          resources:
            normalizeResources(
              data.lesson.resources
            ),
        }

        setRole(data.role)
        setTopic(data.topic)
        setLesson(loadedLesson)

        setForm({
          title:
            loadedLesson.title ??
            '',

          description:
            loadedLesson.description ??
            '',

          estimatedMinutes:
            loadedLesson
              .estimatedMinutes ===
            null
              ? ''
              : String(
                  loadedLesson
                    .estimatedMinutes
                ),

          content:
            Array.isArray(
              loadedLesson.content
            )
              ? loadedLesson.content.join(
                  '\n\n'
                )
              : '',

          resources:
            loadedLesson.resources,
        })
      } catch (loadError) {
        console.error(
          'Load lesson error:',
          loadError
        )

        setRole(null)
        setTopic(null)
        setLesson(null)

        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Unable to load lesson'
        )
      } finally {
        setLoading(false)
      }
    }, [
      lessonId,
      roleId,
      topicId,
    ])


  useEffect(() => {
    void loadLesson()
  }, [loadLesson])


  /*
  |--------------------------------------------------------------------------
  | NAVIGATION
  |--------------------------------------------------------------------------
  */

  const goBack = () => {
    navigate(
      `/admin/roles/${roleId}/topics/${topicId}/lessons`
    )
  }


  /*
  |--------------------------------------------------------------------------
  | FORM HELPERS
  |--------------------------------------------------------------------------
  */

  const updateField = (
    field:
      | 'title'
      | 'description'
      | 'estimatedMinutes'
      | 'content',
    value: string
  ) => {
    setForm(
      (current) => ({
        ...current,
        [field]: value,
      })
    )
  }


  const addResource = () => {
    setForm(
      (current) => ({
        ...current,

        resources: [
          ...current.resources,
          {
            title: '',
            type: 'Link',
            url: '',
          },
        ],
      })
    )
  }


  const updateResource = (
    index: number,
    field: keyof LessonResource,
    value: string
  ) => {
    setForm(
      (current) => {
        const resources =
          [...current.resources]

        resources[index] = {
          ...resources[index],
          [field]: value,
        }

        return {
          ...current,
          resources,
        }
      }
    )
  }


  const removeResource = (
    index: number
  ) => {
    setForm(
      (current) => ({
        ...current,

        resources:
          current.resources.filter(
            (_, resourceIndex) =>
              resourceIndex !==
              index
          ),
      })
    )
  }


  /*
  |--------------------------------------------------------------------------
  | SAVE LESSON
  |--------------------------------------------------------------------------
  */

  const saveLesson = async (
    event?: FormEvent<HTMLFormElement>
  ) => {
    event?.preventDefault()

    const title =
      form.title.trim()

    const description =
      form.description.trim()

    if (title.length < 2) {
      setError(
        'Enter a lesson title.'
      )
      return
    }

    let estimatedMinutes:
      number | null = null

    if (
      form.estimatedMinutes.trim()
    ) {
      estimatedMinutes =
        Number(
          form.estimatedMinutes
        )

      if (
        !Number.isInteger(
          estimatedMinutes
        ) ||
        estimatedMinutes <= 0
      ) {
        setError(
          'Estimated duration must be a positive whole number.'
        )
        return
      }
    }

    /*
    |--------------------------------------------------------------------------
    | CONTENT
    |--------------------------------------------------------------------------
    |
    | Existing database lessons store content as an array. The editor presents
    | the paragraphs as one textarea and converts them back into an array.
    |
    */

    const content =
      form.content
        .split(/\n\s*\n/)
        .map(
          (paragraph) =>
            paragraph.trim()
        )
        .filter(Boolean)


    const resources =
      form.resources
        .map((resource) => ({
          title:
            resource.title.trim(),

          type:
            resource.type.trim() ||
            'Link',

          url:
            resource.url.trim(),
        }))
        .filter(
          (resource) =>
            resource.title ||
            resource.url
        )


    const token =
      getToken()

    if (!token) {
      setError(
        'Your admin session is missing. Please sign in again.'
      )
      return
    }

    try {
      setSaving(true)
      setError('')
      setSuccessMessage('')

      const response =
        await fetch(
          `${API_URL}/api/admin/lessons/${lessonId}`,
          {
            method: 'PUT',

            headers: {
              'Content-Type':
                'application/json',

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              title,
              description,
              content,
              resources,
              estimatedMinutes,
            }),
          }
        )

      const data =
        (await response.json()) as
          LessonResponse

      if (
        !response.ok ||
        !data.success ||
        !data.lesson
      ) {
        throw new Error(
          data.message ||
            'Unable to update lesson'
        )
      }

      const updatedLesson = {
        ...data.lesson,

        resources:
          normalizeResources(
            data.lesson.resources
          ),
      }

      setLesson(
        updatedLesson
      )

      setForm({
        title:
          updatedLesson.title,

        description:
          updatedLesson.description ??
          '',

        estimatedMinutes:
          updatedLesson
            .estimatedMinutes ===
          null
            ? ''
            : String(
                updatedLesson
                  .estimatedMinutes
              ),

        content:
          Array.isArray(
            updatedLesson.content
          )
            ? updatedLesson.content.join(
                '\n\n'
              )
            : '',

        resources:
          updatedLesson.resources,
      })

      setSuccessMessage(
        'Lesson updated successfully.'
      )

      window.setTimeout(
        () => {
          setSuccessMessage('')
        },
        3500
      )
    } catch (saveError) {
      console.error(
        'Save lesson error:',
        saveError
      )

      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to update lesson'
      )
    } finally {
      setSaving(false)
    }
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

          <div className="flex min-h-[420px] items-center justify-center">

            <div className="text-center">

              <Loader2
                size={38}
                className="mx-auto animate-spin text-purple-600"
              />

              <p className="mt-4 text-sm font-semibold text-slate-700">
                Loading lesson...
              </p>

            </div>

          </div>

        </div>

      </AdminLayout>
    )
  }


  /*
  |--------------------------------------------------------------------------
  | LOAD ERROR
  |--------------------------------------------------------------------------
  */

  if (
    !lesson ||
    !role ||
    !topic
  ) {
    return (
      <AdminLayout>

        <div className="min-h-screen bg-slate-50 p-6 lg:p-8">

          <div className="mx-auto max-w-6xl">

            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-2 text-sm font-semibold text-purple-600"
            >
              <ArrowLeft
                size={17}
              />

              Back to Lessons
            </button>


            <div className="mt-8 rounded-3xl border border-red-100 bg-white p-10 text-center shadow-sm">

              <BookOpen
                size={40}
                className="mx-auto text-red-300"
              />

              <h1 className="mt-5 text-xl font-bold text-slate-900">
                Unable to load lesson
              </h1>

              <p className="mt-2 text-sm text-red-600">
                {error ||
                  'The requested lesson does not exist.'}
              </p>

              <button
                type="button"
                onClick={() =>
                  void loadLesson()
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

            Back to Lesson Management
          </button>


          {/* Header */}

          <div className="mt-6 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

            <div>

              <p className="text-sm font-semibold text-purple-600">
                {role.title}
                {' • '}
                {topic.title}
                {' • '}
                Lesson {lesson.position}
              </p>

              <h1 className="mt-1 text-3xl font-bold text-slate-950">
                Edit Lesson
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Edit the existing lesson
                content stored in
                PostgreSQL.
              </p>

            </div>


            <button
              type="button"
              onClick={() =>
                void saveLesson()
              }
              disabled={saving}
              className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >

              {saving ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <Save size={17} />
              )}

              {saving
                ? 'Saving...'
                : 'Save Changes'}

            </button>

          </div>


          {/* Success */}

          {successMessage && (
            <div className="mt-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
              {successMessage}
            </div>
          )}


          {/* Error */}

          {error && (
            <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}


          {/* Database information */}

          <div className="mt-7 grid gap-4 sm:grid-cols-3">

            <InfoCard
              label="Database Lesson ID"
              value={lesson.id}
            />

            <InfoCard
              label="Lesson Position"
              value={lesson.position}
            />

            <InfoCard
              label="Status"
              value={
                lesson.isActive
                  ? 'Active'
                  : 'Inactive'
              }
            />

          </div>


          <form
            onSubmit={saveLesson}
            className="mt-7 grid gap-7 xl:grid-cols-[minmax(0,1fr)_360px]"
          >

            {/* Main editor */}

            <div className="space-y-7">

              {/* Basic details */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <FileText
                      size={21}
                    />
                  </div>

                  <div>

                    <h2 className="font-bold text-slate-900">
                      Lesson Details
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Basic information
                      displayed to
                      employees.
                    </p>

                  </div>

                </div>


                <div className="mt-6">

                  <label
                    htmlFor="lesson-title"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Lesson Title
                  </label>

                  <input
                    id="lesson-title"
                    type="text"
                    value={form.title}
                    onChange={(event) =>
                      updateField(
                        'title',
                        event.target.value
                      )
                    }
                    disabled={saving}
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                  />

                </div>


                <div className="mt-5">

                  <label
                    htmlFor="lesson-description"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Lesson Description
                  </label>

                  <textarea
                    id="lesson-description"
                    rows={4}
                    value={
                      form.description
                    }
                    onChange={(event) =>
                      updateField(
                        'description',
                        event.target.value
                      )
                    }
                    disabled={saving}
                    className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                  />

                </div>


                <div className="mt-5">

                  <label
                    htmlFor="lesson-duration"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Estimated Duration
                  </label>

                  <div className="relative max-w-xs">

                    <input
                      id="lesson-duration"
                      type="number"
                      min={1}
                      step={1}
                      value={
                        form.estimatedMinutes
                      }
                      onChange={(event) =>
                        updateField(
                          'estimatedMinutes',
                          event.target.value
                        )
                      }
                      disabled={saving}
                      placeholder="45"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-20 text-sm text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      minutes
                    </span>

                  </div>

                </div>

              </section>


              {/* Content */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <BookOpen
                      size={21}
                    />
                  </div>

                  <div>

                    <h2 className="font-bold text-slate-900">
                      Lesson Content
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      Separate paragraphs
                      with a blank line.
                    </p>

                  </div>

                </div>


                <textarea
                  value={form.content}
                  onChange={(event) =>
                    updateField(
                      'content',
                      event.target.value
                    )
                  }
                  disabled={saving}
                  rows={18}
                  placeholder="Enter lesson content here..."
                  className="mt-6 w-full resize-y rounded-xl border border-slate-200 px-4 py-4 text-sm leading-7 text-slate-800 outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-50"
                />

              </section>


              {/* Resources */}

              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                      <Link size={21} />
                    </div>

                    <div>

                      <h2 className="font-bold text-slate-900">
                        Resources
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        Supporting links
                        and references for
                        this lesson.
                      </p>

                    </div>

                  </div>


                  <button
                    type="button"
                    onClick={addResource}
                    disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2.5 text-sm font-semibold text-purple-700 transition hover:bg-purple-100 disabled:opacity-50"
                  >
                    <Plus size={16} />
                    Add Resource
                  </button>

                </div>


                {form.resources.length ===
                0 ? (
                  <div className="mt-6 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">

                    <Link
                      size={28}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      No resources added
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Add an optional
                      supporting link.
                    </p>

                  </div>
                ) : (
                  <div className="mt-6 space-y-4">

                    {form.resources.map(
                      (
                        resource,
                        index
                      ) => (
                        <ResourceEditor
                          key={index}
                          index={index}
                          resource={
                            resource
                          }
                          disabled={
                            saving
                          }
                          onChange={
                            updateResource
                          }
                          onRemove={() =>
                            removeResource(
                              index
                            )
                          }
                        />
                      )
                    )}

                  </div>
                )}

              </section>


              {/* Bottom actions */}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={goBack}
                  disabled={saving}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {saving ? (
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                  ) : (
                    <Save size={17} />
                  )}

                  {saving
                    ? 'Saving...'
                    : 'Save Changes'}

                </button>

              </div>

            </div>


            {/* Sidebar */}

            <aside className="space-y-5">

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-sm font-bold text-slate-900">
                  Current Lesson
                </p>

                <div className="mt-5 space-y-4">

                  <SidebarValue
                    label="Career Role"
                    value={role.title}
                  />

                  <SidebarValue
                    label="Topic"
                    value={topic.title}
                  />

                  <SidebarValue
                    label="Lesson"
                    value={
                      lesson.title
                    }
                  />

                  <SidebarValue
                    label="Position"
                    value={String(
                      lesson.position
                    )}
                  />

                  <SidebarValue
                    label="Database ID"
                    value={String(
                      lesson.id
                    )}
                  />

                </div>

              </div>


              <div className="rounded-2xl border border-green-100 bg-green-50 p-5">

                <p className="text-sm font-bold text-green-800">
                  PostgreSQL Connected
                </p>

                <p className="mt-2 text-sm leading-6 text-green-700">
                  This form is populated
                  from the existing
                  lesson record. Saving
                  updates that same
                  PostgreSQL lesson.
                </p>

              </div>


              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                <p className="text-sm font-bold text-slate-900">
                  Resource Preview
                </p>

                {form.resources.filter(
                  (resource) =>
                    resource.url.trim()
                ).length === 0 ? (
                  <p className="mt-3 text-sm text-slate-500">
                    No resource URLs
                    configured.
                  </p>
                ) : (
                  <div className="mt-4 space-y-2">

                    {form.resources
                      .filter(
                        (resource) =>
                          resource.url.trim()
                      )
                      .map(
                        (
                          resource,
                          index
                        ) => (
                          <a
                            key={index}
                            href={
                              resource.url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-50"
                          >
                            <ExternalLink
                              size={14}
                            />

                            <span className="truncate">
                              {resource.title ||
                                resource.url}
                            </span>
                          </a>
                        )
                      )}

                  </div>
                )}

              </div>

            </aside>

          </form>

        </div>

      </div>

    </AdminLayout>
  )
}


/*
|--------------------------------------------------------------------------
| INFO CARD
|--------------------------------------------------------------------------
*/

interface InfoCardProps {
  label: string
  value: string | number
}


function InfoCard({
  label,
  value,
}: InfoCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 text-lg font-bold text-slate-900">
        {value}
      </p>

    </div>
  )
}


/*
|--------------------------------------------------------------------------
| SIDEBAR VALUE
|--------------------------------------------------------------------------
*/

interface SidebarValueProps {
  label: string
  value: string
}


function SidebarValue({
  label,
  value,
}: SidebarValueProps) {
  return (
    <div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value}
      </p>

    </div>
  )
}


/*
|--------------------------------------------------------------------------
| RESOURCE EDITOR
|--------------------------------------------------------------------------
*/

interface ResourceEditorProps {
  index: number
  resource: LessonResource
  disabled: boolean

  onChange: (
    index: number,
    field: keyof LessonResource,
    value: string
  ) => void

  onRemove: () => void
}


function ResourceEditor({
  index,
  resource,
  disabled,
  onChange,
  onRemove,
}: ResourceEditorProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">

      <div className="flex items-center justify-between">

        <p className="text-sm font-semibold text-slate-700">
          Resource {index + 1}
        </p>

        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="flex items-center gap-1.5 text-xs font-semibold text-red-600 transition hover:text-red-700 disabled:opacity-50"
        >
          <Trash2 size={14} />
          Remove
        </button>

      </div>


      <div className="mt-4 grid gap-4 sm:grid-cols-2">

        <div>

          <label className="mb-2 block text-xs font-semibold text-slate-600">
            Resource Title
          </label>

          <input
            type="text"
            value={resource.title}
            onChange={(event) =>
              onChange(
                index,
                'title',
                event.target.value
              )
            }
            disabled={disabled}
            placeholder="HTML Tutorial"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-100"
          />

        </div>


        <div>

          <label className="mb-2 block text-xs font-semibold text-slate-600">
            Resource Type
          </label>

          <select
            value={resource.type}
            onChange={(event) =>
              onChange(
                index,
                'type',
                event.target.value
              )
            }
            disabled={disabled}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-100"
          >
            <option value="Link">
              Link
            </option>

            <option value="Video">
              Video
            </option>

            <option value="Article">
              Article
            </option>

            <option value="Documentation">
              Documentation
            </option>

            <option value="PDF">
              PDF
            </option>
          </select>

        </div>

      </div>


      <div className="mt-4">

        <label className="mb-2 block text-xs font-semibold text-slate-600">
          URL
        </label>

        <input
          type="url"
          value={resource.url}
          onChange={(event) =>
            onChange(
              index,
              'url',
              event.target.value
            )
          }
          disabled={disabled}
          placeholder="https://..."
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100 disabled:bg-slate-100"
        />

      </div>

    </div>
  )
}


export default LessonContentEditor