import {

  useEffect,

  useMemo,

  useState,

} from 'react'



import {

  ArrowLeft,

  ArrowRight,

  BookOpen,

  CheckCircle2,

  Clock3,

  ExternalLink,

  LockKeyhole,

  PlayCircle,

} from 'lucide-react'



import {

  useNavigate,

  useParams,

} from 'react-router-dom'



import DashboardLayout from '../../layouts/DashboardLayout'



interface TopicLesson {
  id: string
  title: string
  description: string
}



interface TopicResource {

  title: string

  type: string

  url: string

}



interface TopicData {

  title: string

  role: string

  description: string

  duration: string

  lessons: number

  lessonsList: TopicLesson[]

  resources: TopicResource[]

}



interface ApiLesson {

  id: string

  title: string

  description: string

  content: string[]

  resources: TopicResource[]

  position: number

  estimatedMinutes: number | null

}



interface LessonsApiResponse {

  success: boolean



  role: {

    id: string

    slug: string

    title: string

    description: string | null

  }



  topic: {

    id: string

    slug: string

    title: string

    description: string | null

    duration: string | null

    position: number

  }



  lessons: ApiLesson[]

}



interface LessonProgressResponse {

  success: boolean

  message?: string

  completedLessons?: number[]

}



interface OverallProgressResponse {

  success: boolean

  message?: string

  completedTopics?: string[]

}



/*

|--------------------------------------------------------------------------

| COMPONENT

|--------------------------------------------------------------------------

*/





/*

|--------------------------------------------------------------------------

| COMPONENT

|--------------------------------------------------------------------------

*/



function TopicLearning() {

  const navigate =

    useNavigate()



  const {

    roleId,

    topicId,

  } = useParams()



  /*

  |--------------------------------------------------------------------------

  | TOPIC KEY

  |--------------------------------------------------------------------------

  */



  const topicKey =

    useMemo(

      () => {

        if (

          !roleId ||

          !topicId

        ) {

          return ''

        }



        return `${roleId}/${topicId}`

      },

      [

        roleId,

        topicId,

      ]

    )



    /*

  |--------------------------------------------------------------------------

  | TOPIC API STATE

  |--------------------------------------------------------------------------

  */



  const [

    topic,

    setTopic,

  ] = useState<TopicData | null>(

    null

  )



  const [

    isLoading,

    setIsLoading,

  ] = useState(true)



  const [

    loadError,

    setLoadError,

  ] = useState('')



  const [

    isProgressLoading,

    setIsProgressLoading,

  ] = useState(true)



  /*

  |--------------------------------------------------------------------------

  | LOAD TOPIC + LESSONS FROM API

  |--------------------------------------------------------------------------

  */



  useEffect(() => {

    let cancelled = false



    const loadTopic = async () => {

      if (!roleId || !topicId) {

        if (!cancelled) {

          setTopic(null)



          setLoadError(

            'The requested topic is not available.'

          )



          setIsLoading(false)

        }



        return

      }



      setIsLoading(true)

      setLoadError('')

      setTopic(null)



      try {

        const response = await fetch(

          `http://localhost:5000/api/career-roles/${encodeURIComponent(

            roleId

          )}/topics/${encodeURIComponent(

            topicId

          )}/lessons`

        )



        if (!response.ok) {

          if (response.status === 404) {

            throw new Error(

              'The requested topic is not available.'

            )

          }



          throw new Error(

            'Unable to load the topic.'

          )

        }



        const data =

          (await response.json()) as LessonsApiResponse



        if (

          !data.success ||

          !data.role ||

          !data.topic ||

          !Array.isArray(data.lessons)

        ) {

          throw new Error(

            'The topic data returned by the server is invalid.'

          )

        }



        const lessonsList: TopicLesson[] =
  data.lessons.map(
    (lesson) => ({
      id:
        lesson.id,

      title:
        lesson.title,

      description:
        lesson.description ?? '',
    })
  )



        /*

         * Topic-level resources currently remain

         * derived from the topic title.

         *

         * Individual lesson resources are already

         * stored in PostgreSQL and displayed by

         * LessonLearning.tsx.

         */



        const resources: TopicResource[] = [

          {

            title:

              `${data.topic.title} - Beginner Tutorial`,



            type: 'Video',



            url:

              `https\://www.youtube.com/results?search_query=${encodeURIComponent(

                `${data.topic.title} tutorial for beginners`

              )}`,

          },



          {

            title:

              `${data.topic.title} - Practical Guide`,



            type: 'Video',



            url:

              `https\://www.youtube.com/results?search_query=${encodeURIComponent(

                `${data.topic.title} practical tutorial`

              )}`,

          },

        ]



        if (cancelled) {

          return

        }



        setTopic({

          title:

            data.topic.title,



          role:

            data.role.title,



          description:

            data.topic.description ?? '',



          duration:

            data.topic.duration ??

            'Self-paced',



          lessons:

            data.lessons.length,



          lessonsList,



          resources,

        })

      } catch (error) {

        if (cancelled) {

          return

        }



        console.error(

          'Failed to load topic:',

          error

        )



        setTopic(null)



        setLoadError(

          error instanceof Error

            ? error.message

            : 'Unable to load the topic.'

        )

      } finally {

        if (!cancelled) {

          setIsLoading(false)

        }

      }

    }



    void loadTopic()



    return () => {

      cancelled = true

    }

  }, [roleId, topicId])



  /*

  |--------------------------------------------------------------------------

  | COMPLETION STATE

  |--------------------------------------------------------------------------

  */



  const [

    completedLessons,

    setCompletedLessons,

  ] = useState<number[]>([])



  const [

    isTopicCompleted,

    setIsTopicCompleted,

  ] = useState(false)



  /*

  |--------------------------------------------------------------------------

  | LOAD COMPLETION PROGRESS FROM POSTGRESQL

  |--------------------------------------------------------------------------

  */



  useEffect(() => {

    let cancelled = false



    const loadProgress = async () => {

      if (!roleId || !topicId || !topicKey) {

        if (!cancelled) {

          setCompletedLessons([])

          setIsTopicCompleted(false)

          setIsProgressLoading(false)

        }



        return

      }



      setIsProgressLoading(true)



      try {

        const token =

          localStorage.getItem(

            'skillforge-token'

          )



        if (!token) {

          throw new Error(

            'Authentication required.'

          )

        }



        const headers = {

          Authorization: `Bearer ${token}`,

        }



        const [

          lessonProgressResponse,

          overallProgressResponse,

        ] = await Promise.all([

          fetch(

            `http://localhost:5000/api/progress/lessons/${encodeURIComponent(

              roleId

            )}/${encodeURIComponent(

              topicId

            )}`,

            { headers }

          ),

          fetch(

            'http://localhost:5000/api/progress',

            { headers }

          ),

        ])



        const lessonProgress =

          (await lessonProgressResponse.json()) as

            LessonProgressResponse



        const overallProgress =

          (await overallProgressResponse.json()) as

            OverallProgressResponse



        if (

          !lessonProgressResponse.ok ||

          !lessonProgress.success

        ) {

          throw new Error(

            lessonProgress.message ||

              'Unable to load lesson progress.'

          )

        }



        if (

          !overallProgressResponse.ok ||

          !overallProgress.success

        ) {

          throw new Error(

            overallProgress.message ||

              'Unable to load topic progress.'

          )

        }



        if (cancelled) {

          return

        }



        const completed =

          Array.isArray(

            lessonProgress.completedLessons

          )

            ? lessonProgress.completedLessons.filter(

                (

                  value

                ): value is number =>

                  typeof value === 'number'

              )

            : []



        setCompletedLessons(

          Array.from(

            new Set(completed)

          )

        )



        setIsTopicCompleted(

          Array.isArray(

            overallProgress.completedTopics

          ) &&

            overallProgress.completedTopics.includes(

              topicKey

            )

        )

      } catch (error) {

        console.error(

          'Failed to load learning progress:',

          error

        )



        if (!cancelled) {

          setCompletedLessons([])

          setIsTopicCompleted(false)

        }

      } finally {

        if (!cancelled) {

          setIsProgressLoading(false)

        }

      }

    }



    void loadProgress()



    return () => {

      cancelled = true

    }

  }, [roleId, topicId, topicKey])



  /*

  |--------------------------------------------------------------------------

  | PROGRESS

  |--------------------------------------------------------------------------

  */



  const totalLessons =

    topic?.lessonsList.length ?? 0



  const validCompletedLessons =
  topic?.lessonsList.filter(
    (lesson) =>
      completedLessons.includes(
        Number(lesson.id)
      )
  ) ?? []

const completedCount =
  validCompletedLessons.length



  const progressPercentage =

    totalLessons > 0

      ? Math.round(

          (

            completedCount /

            totalLessons

          ) * 100

        )

      : 0



  /*

  |--------------------------------------------------------------------------

  | QUIZ UNLOCK CONDITION

  |--------------------------------------------------------------------------

  */



  const areAllLessonsComplete =

    totalLessons > 0 &&

    completedCount ===

      totalLessons



        /*

  |--------------------------------------------------------------------------

  | LOADING

  |--------------------------------------------------------------------------

  */



  if (isLoading || isProgressLoading) {

    return (

      <DashboardLayout>

        <div className="min-h-screen bg-slate-50 p-6">

          <div className="mx-auto max-w-4xl">

            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-purple-600" />



              <h1 className="mt-5 text-xl font-bold text-slate-900">

                Loading Topic

              </h1>



              <p className="mt-2 text-sm text-slate-500">

                Loading lessons from SkillForge...

              </p>

            </div>

          </div>

        </div>

      </DashboardLayout>

    )

  }

  /*

  |--------------------------------------------------------------------------

  | TOPIC NOT FOUND

  |--------------------------------------------------------------------------

  */



  if (!topic) {

    return (

      <DashboardLayout>



        <div className="min-h-screen bg-slate-50 p-6">



          <div className="mx-auto max-w-4xl">



            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">



              <h1 className="text-2xl font-bold text-slate-900">

                Topic Not Found

              </h1>



              <p className="mt-2 text-sm text-slate-500">

                {loadError ||

                  'The requested topic is not available.'}

              </p>



              <button

                onClick={() =>

                  navigate(

                    `/employee/roles/${roleId}`

                  )

                }

                className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"

              >

                Back to Roadmap

              </button>



            </div>



          </div>



        </div>



      </DashboardLayout>

    )

  }



  /*

  |--------------------------------------------------------------------------

  | PAGE

  |--------------------------------------------------------------------------

  */



  return (

    <DashboardLayout>



      <div className="min-h-screen bg-slate-50 p-6">



        <div className="mx-auto max-w-5xl">



          {/* BACK */}



          <button

            onClick={() =>

              navigate(

                `/employee/roles/${roleId}`

              )

            }

            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-purple-600"

          >

            <ArrowLeft size={17} />



            Back to Roadmap

          </button>



          {/* HEADER */}



          <div className="rounded-2xl bg-slate-900 p-7 text-white">



            <div className="flex flex-wrap items-center gap-3">



              <p className="text-xs font-semibold uppercase tracking-wider text-purple-400">

                {topic.role}

              </p>



              {isTopicCompleted && (

                <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">

                  <CheckCircle2

                    size={14}

                  />



                  Topic Completed

                </span>

              )}



            </div>



            <h1 className="mt-2 text-3xl font-bold">

              {topic.title}

            </h1>



            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">

              {topic.description}

            </p>



            <div className="mt-6 flex flex-wrap gap-5 text-sm text-slate-300">



              <span className="flex items-center gap-2">

                <Clock3 size={17} />

                {topic.duration}

              </span>



              <span className="flex items-center gap-2">

                <BookOpen size={17} />

                {totalLessons} lessons

              </span>



            </div>



            {/* PROGRESS */}



            <div className="mt-7">



              <div className="flex items-center justify-between text-xs">



                <div className="flex items-center gap-2">



                  <span className="text-slate-400">

                    Lesson Progress

                  </span>



                  <span className="text-slate-500">

                    •

                  </span>



                  <span className="text-slate-400">

                    {completedCount} of{' '}

                    {totalLessons}{' '}

                    lessons

                  </span>



                </div>



                <span className="font-semibold text-white">

                  {progressPercentage}%

                </span>



              </div>



              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">



                <div

                  className="h-full rounded-full bg-purple-500 transition-all duration-500"

                  style={{

                    width:

                      `${progressPercentage}%`,

                  }}

                />



              </div>



            </div>



          </div>



          {/* MAIN CONTENT */}



          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">



            {/* LESSON LIST */}



            <div className="lg:col-span-2">



              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">



                <div className="flex items-center gap-3">



                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

                    <BookOpen size={21} />

                  </div>



                  <div>



                    <h2 className="text-xl font-bold text-slate-900">

                      Learning Content

                    </h2>



                    <p className="text-sm text-slate-500">

                      Open each lesson and complete it to unlock the topic quiz.

                    </p>



                  </div>



                </div>



                <div className="mt-6 space-y-3">



                  {topic.lessonsList.map(

                    (

                      lesson,

                      index

                    ) => {

                      const isCompleted =
                         completedLessons.includes(
                            Number(lesson.id)
                        )



                      return (

                        <div

                          key={`${lesson.title}-${index}`}

                          className={`rounded-xl border p-4 transition ${

                            isCompleted

                              ? 'border-green-200 bg-green-50/50'

                              : 'border-slate-100 hover:border-purple-200 hover:bg-purple-50/30'

                          }`}

                        >



                          <div className="flex gap-4">



                            <div

                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${

                                isCompleted

                                  ? 'bg-green-100 text-green-600'

                                  : 'bg-slate-100 text-slate-600'

                              }`}

                            >



                              {isCompleted ? (

                                <CheckCircle2

                                  size={19}

                                />

                              ) : (

                                index + 1

                              )}



                            </div>



                            <div className="min-w-0 flex-1">



                              <h3 className="font-semibold text-slate-900">

                                {lesson.title}

                              </h3>



                              <p className="mt-1 text-sm leading-5 text-slate-500">

                                {lesson.description}

                              </p>



                              <div className="mt-4">



                                <button

                                  onClick={() =>

                                    navigate(

                                      `/employee/roles/${roleId}/topics/${topicId}/lessons/${index}`

                                    )

                                  }

                                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${

                                    isCompleted

                                      ? 'bg-green-600 text-white hover:bg-green-700'

                                      : 'bg-purple-600 text-white hover:bg-purple-700'

                                  }`}

                                >

                                  {isCompleted

                                    ? 'Review Lesson'

                                    : 'Open Lesson'}



                                  <ArrowRight

                                    size={14}

                                  />

                                </button>



                              </div>



                            </div>



                          </div>



                        </div>

                      )

                    }

                  )}



                </div>



              </div>



            </div>



            {/* RIGHT SIDEBAR */}



            <div>



              {/* RESOURCES */}



              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">



                <div className="flex items-center gap-3">



                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

                    <PlayCircle size={21} />

                  </div>



                  <div>



                    <h2 className="font-bold text-slate-900">

                      Learning Resources

                    </h2>



                    <p className="text-xs text-slate-500">

                      Videos and references

                    </p>



                  </div>



                </div>



                <div className="mt-5 space-y-3">



                  {topic.resources.map(

                    (resource) => (

                      <a

                        key={resource.title}

                        href={resource.url}

                        target="\_blank"

                        rel="noreferrer"

                        className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-purple-300 hover:bg-purple-50"

                      >



                        <div className="flex items-center gap-3">



                          <PlayCircle

                            size={19}

                            className="text-purple-600"

                          />



                          <div>



                            <p className="text-sm font-semibold text-slate-800">

                              {resource.title}

                            </p>



                            <p className="mt-1 text-xs text-slate-400">

                              {resource.type}

                            </p>



                          </div>



                        </div>



                        <ExternalLink

                          size={16}

                          className="text-slate-400"

                        />



                      </a>

                    )

                  )}



                </div>



              </div>



              {/* LESSON / TOPIC STATUS */}



              <div

                className={`mt-5 rounded-2xl border p-5 ${

                  isTopicCompleted ||

                  areAllLessonsComplete

                    ? 'border-green-100 bg-green-50'

                    : 'border-purple-100 bg-purple-50'

                }`}

              >



                <div className="flex gap-3">



                  <CheckCircle2

                    size={21}

                    className={`mt-0.5 shrink-0 ${

                      isTopicCompleted ||

                      areAllLessonsComplete

                        ? 'text-green-600'

                        : 'text-purple-600'

                    }`}

                  />



                  <div>



                    <h3

                      className={`text-sm font-semibold ${

                        isTopicCompleted ||

                        areAllLessonsComplete

                          ? 'text-green-900'

                          : 'text-purple-900'

                      }`}

                    >

                      {isTopicCompleted

                        ? 'Topic Completed'

                        : areAllLessonsComplete

                          ? 'Lessons Completed'

                          : 'Lesson Progress'}

                    </h3>



                    <p

                      className={`mt-1 text-sm leading-5 ${

                        isTopicCompleted ||

                        areAllLessonsComplete

                          ? 'text-green-700'

                          : 'text-purple-700'

                      }`}

                    >

                      {isTopicCompleted

                        ? 'You passed the topic assessment and completed this topic.'

                        : areAllLessonsComplete

                          ? 'All lessons are complete. You must now pass the topic quiz to complete this topic.'

                          : `${totalLessons - completedCount} lesson${

                              totalLessons - completedCount === 1

                                ? ''

                                : 's'

                            } remaining.`}

                    </p>



                  </div>



                </div>



              </div>



              {/* TOPIC QUIZ */}



              <div

                className={`mt-5 rounded-2xl border p-6 shadow-sm ${

                  isTopicCompleted

                    ? 'border-green-200 bg-green-50/40'

                    : areAllLessonsComplete

                      ? 'border-purple-200 bg-white'

                      : 'border-slate-200 bg-white'

                }`}

              >



                <div

                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${

                    isTopicCompleted

                      ? 'bg-green-100 text-green-600'

                      : areAllLessonsComplete

                        ? 'bg-purple-100 text-purple-600'

                        : 'bg-slate-100 text-slate-400'

                  }`}

                >

                  {isTopicCompleted ? (

                    <CheckCircle2

                      size={22}

                    />

                  ) : areAllLessonsComplete ? (

                    <CheckCircle2

                      size={22}

                    />

                  ) : (

                    <LockKeyhole

                      size={22}

                    />

                  )}

                </div>



                <p

                  className={`mt-4 text-xs font-semibold uppercase tracking-wider ${

                    isTopicCompleted

                      ? 'text-green-600'

                      : 'text-purple-600'

                  }`}

                >

                  Topic Assessment

                </p>



                <h2 className="mt-1 text-lg font-bold text-slate-900">

                  {isTopicCompleted

                    ? 'Assessment Passed'

                    : `${topic.title} Quiz`}

                </h2>



                <p className="mt-2 text-sm leading-6 text-slate-500">

                  {isTopicCompleted

                    ? 'You passed this assessment and successfully completed the topic.'

                    : areAllLessonsComplete

                      ? 'Your quiz is unlocked. Pass the assessment to complete this topic.'

                      : `Complete all ${totalLessons} lessons to unlock this assessment.`}

                </p>



                {!areAllLessonsComplete && (

                  <div className="mt-4 rounded-xl bg-slate-50 p-3">



                    <div className="flex items-center justify-between text-xs">



                      <span className="text-slate-500">

                        Lessons completed

                      </span>



                      <span className="font-semibold text-slate-700">

                        {completedCount}/{totalLessons}

                      </span>



                    </div>



                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">



                      <div

                        className="h-full rounded-full bg-purple-500 transition-all duration-500"

                        style={{

                          width:

                            `${progressPercentage}%`,

                        }}

                      />



                    </div>



                  </div>

                )}



                <button

                  disabled={

                    !areAllLessonsComplete ||

                    isTopicCompleted

                  }

                  onClick={() => {

                    if (

                      !areAllLessonsComplete ||

                      isTopicCompleted

                    ) {

                      return

                    }



                    navigate(

                      `/employee/roles/${roleId}/topics/${topicId}/quiz`

                    )

                  }}

                  className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold transition ${

                    isTopicCompleted

                      ? 'cursor-default bg-green-600 text-white'

                      : areAllLessonsComplete

                        ? 'bg-purple-600 text-white hover:bg-purple-700'

                        : 'cursor-not-allowed bg-slate-200 text-slate-500'

                  }`}

                >



                  {isTopicCompleted ? (

                    <>

                      <CheckCircle2

                        size={17}

                      />

                      Assessment Passed

                    </>

                  ) : areAllLessonsComplete ? (

                    <>

                      Take Quiz

                      <ArrowRight

                        size={17}

                      />

                    </>

                  ) : (

                    <>

                      <LockKeyhole

                        size={16}

                      />

                      Quiz Locked

                    </>

                  )}



                </button>



              </div>



            </div>



          </div>



        </div>



      </div>



    </DashboardLayout>

  )

}



export default TopicLearning