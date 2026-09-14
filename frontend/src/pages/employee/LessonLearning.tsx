import {
  useEffect,
  useState,
} from 'react'

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  ExternalLink,
  PlayCircle,
} from 'lucide-react'

import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'
import { roadmapData } from '../../data/roadmapData'
import { lessonTitles } from '../../data/lessonTitles'

interface LessonResource {
  title: string
  type: string
  url: string
}

interface LessonData {
  title: string
  description: string
  duration: string
  content: string[]
  resources: LessonResource[]
}

interface TopicLessons {
  topicTitle: string
  lessons: LessonData[]
}

/*
|--------------------------------------------------------------------------
| DETAILED LESSON DATA
|--------------------------------------------------------------------------
|
| Keep your existing detailed Linux and Networking lessons here.
|
| Additional topics are automatically generated from roadmapData below.
|
*/

const lessonData: Record<string, TopicLessons> = {
  /*
  |--------------------------------------------------------------------------
  | DEVOPS - LINUX
  |--------------------------------------------------------------------------
  */

  'devops-engineer/linux-fundamentals': {
    topicTitle: 'Linux Fundamentals',

    lessons: [
      {
        title: 'Introduction to Linux',
        description:
          'Understand what Linux is, how it works, and why it is widely used in servers, cloud infrastructure, and DevOps environments.',
        duration: '40 minutes',

        content: [
          'Linux is an open-source operating system widely used for servers, cloud infrastructure, containers, and development environments.',
          'The Linux operating system is built around the Linux kernel, which manages hardware resources and provides core functionality for applications.',
          'There are many Linux distributions, including Ubuntu, Debian, Fedora, CentOS, and Red Hat Enterprise Linux.',
          'DevOps engineers commonly work with Linux because many production servers and cloud workloads run on Linux-based systems.',
        ],

        resources: [
          {
            title: 'Linux Fundamentals for Beginners',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=linux+fundamentals+for+beginners',
          },
        ],
      },

      {
        title: 'Linux File System',
        description:
          'Learn how files and directories are organized in a Linux system.',

        duration: '45 minutes',

        content: [
          'Linux uses a hierarchical file system beginning at the root directory, represented by /.',
          'Common directories include /home for user files, /etc for configuration files, /var for changing application data, and /tmp for temporary files.',
          'Directories can contain files and other directories, creating a tree-like structure.',
          'Understanding the file system is essential when managing Linux servers and applications.',
        ],

        resources: [
          {
            title: 'Linux File System Tutorial',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=linux+file+system+tutorial',
          },
        ],
      },

      {
        title: 'Basic Linux Commands',
        description:
          'Learn the most commonly used Linux terminal commands.',

        duration: '50 minutes',

        content: [
          'The pwd command displays the current working directory.',
          'The ls command lists files and directories.',
          'The cd command changes the current directory.',
          'The mkdir command creates directories.',
          'The cp command copies files and directories.',
          'The mv command moves or renames files.',
          'The rm command removes files or directories.',
          'The cat and less commands can be used to view file contents.',
        ],

        resources: [
          {
            title: 'Linux Command Line Tutorial',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=linux+command+line+tutorial+for+beginners',
          },
        ],
      },

      {
        title: 'Users and Permissions',
        description:
          'Understand Linux users, groups, ownership, and file permissions.',

        duration: '45 minutes',

        content: [
          'Linux supports multiple users and groups on the same system.',
          'Every file has an owner and a group associated with it.',
          'Linux permissions control who can read, write, or execute a file.',
          'The chmod command can be used to modify permissions.',
          'The chown command can be used to change file ownership.',
        ],

        resources: [
          {
            title: 'Linux Permissions Explained',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=linux+file+permissions+tutorial',
          },
        ],
      },

      {
        title: 'Processes',
        description:
          'Learn how Linux manages running processes.',

        duration: '40 minutes',

        content: [
          'A process is a running instance of a program.',
          'Linux assigns each process a process ID, commonly called a PID.',
          'Commands such as ps and top can be used to inspect running processes.',
          'Processes can be managed using commands such as kill.',
        ],

        resources: [
          {
            title: 'Linux Processes Tutorial',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=linux+processes+ps+top+kill',
          },
        ],
      },

      {
        title: 'Package Management',
        description:
          'Learn how software packages are installed and managed on Linux.',

        duration: '40 minutes',

        content: [
          'Linux distributions provide package managers for installing and maintaining software.',
          'Ubuntu and Debian commonly use apt.',
          'Package managers can install, update, and remove software packages.',
          'Keeping packages updated is an important part of maintaining a Linux system.',
        ],

        resources: [
          {
            title: 'Linux Package Management',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=linux+package+management+apt+tutorial',
          },
        ],
      },

      {
        title: 'Shell Basics',
        description:
          'Learn shell commands, variables, pipes, redirection, and basic scripting concepts.',

        duration: '50 minutes',

        content: [
          'A shell provides an interface for interacting with the operating system through commands.',
          'Shell variables can store values that can be reused by commands and scripts.',
          'Pipes allow the output of one command to be passed into another command.',
          'Redirection can send command output to files.',
          'Shell scripting allows repetitive administrative tasks to be automated.',
        ],

        resources: [
          {
            title: 'Bash Shell Tutorial',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=bash+shell+scripting+for+beginners',
          },
        ],
      },

      {
        title: 'Linux Practice',
        description:
          'Practice essential Linux commands and administration concepts.',

        duration: '60 minutes',

        content: [
          'Create directories and files using the Linux command line.',
          'Navigate through the file system using cd and pwd.',
          'Inspect files using ls, cat, and less.',
          'Practice changing file permissions.',
          'Inspect running processes.',
          'Use package management commands to manage software.',
        ],

        resources: [
          {
            title: 'Linux Command Practice',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=linux+command+line+practice',
          },
        ],
      },
    ],
  },

  /*
  |--------------------------------------------------------------------------
  | DEVOPS - NETWORKING
  |--------------------------------------------------------------------------
  */

  'devops-engineer/networking-fundamentals': {
    topicTitle: 'Networking Fundamentals',

    lessons: [
      {
        title: 'Introduction to Networking',
        description:
          'Understand how computers and systems communicate across networks.',
        duration: '40 minutes',

        content: [
          'A computer network allows devices to communicate and exchange information.',
          'Clients request services while servers provide services.',
          'Networks can exist within local environments or connect systems across the internet.',
          'DevOps engineers need networking knowledge to deploy and troubleshoot applications.',
        ],

        resources: [
          {
            title: 'Networking Fundamentals',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=computer+networking+fundamentals+for+beginners',
          },
        ],
      },

      {
        title: 'IP Addresses',
        description:
          'Learn how IP addresses identify devices on networks.',
        duration: '45 minutes',

        content: [
          'An IP address identifies a device or network interface on a network.',
          'IPv4 addresses use a 32-bit addressing system.',
          'IPv6 was introduced to provide a much larger address space.',
          'Private IP addresses are commonly used inside local networks.',
          'Public IP addresses can be used for communication over the internet.',
        ],

        resources: [
          {
            title: 'IP Addressing Tutorial',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=IP+addressing+for+beginners',
          },
        ],
      },

      {
        title: 'TCP and UDP',
        description:
          'Understand the differences between TCP and UDP.',
        duration: '40 minutes',

        content: [
          'TCP provides reliable, connection-oriented communication.',
          'UDP provides lightweight communication without the same connection and delivery guarantees as TCP.',
          'TCP is commonly used where reliable delivery is important.',
          'UDP is often useful for applications where speed and low overhead are important.',
        ],

        resources: [
          {
            title: 'TCP vs UDP Explained',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=TCP+vs+UDP+explained',
          },
        ],
      },

      {
        title: 'DNS',
        description:
          'Learn how domain names are translated into IP addresses.',
        duration: '40 minutes',

        content: [
          'DNS stands for Domain Name System.',
          'DNS allows users to access services using domain names instead of remembering IP addresses.',
          'DNS servers resolve domain names into IP addresses.',
          'DNS is an important component of web applications and cloud infrastructure.',
        ],

        resources: [
          {
            title: 'DNS Explained',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=DNS+explained+for+beginners',
          },
        ],
      },

      {
        title: 'HTTP and HTTPS',
        description:
          'Understand how browsers and servers communicate using HTTP and HTTPS.',
        duration: '45 minutes',

        content: [
          'HTTP is a protocol used for communication between clients and web servers.',
          'HTTPS adds encryption to HTTP communication using TLS.',
          'Web applications commonly use HTTP methods such as GET, POST, PUT, PATCH, and DELETE.',
          'Understanding HTTP is essential for working with APIs and web applications.',
        ],

        resources: [
          {
            title: 'HTTP and HTTPS Explained',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=HTTP+HTTPS+explained+for+beginners',
          },
        ],
      },

      {
        title: 'Ports and Firewalls',
        description:
          'Learn about network ports and the role of firewalls.',
        duration: '40 minutes',

        content: [
          'Network ports allow systems to distinguish between different services.',
          'Different applications commonly listen on different ports.',
          'Firewalls control network traffic according to configured rules.',
          'Understanding ports and firewalls is important when deploying applications and troubleshooting connectivity.',
        ],

        resources: [
          {
            title: 'Ports and Firewalls',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=network+ports+and+firewalls+for+beginners',
          },
        ],
      },

      {
        title: 'Network Troubleshooting',
        description:
          'Learn basic techniques for diagnosing network connectivity problems.',
        duration: '50 minutes',

        content: [
          'Network troubleshooting starts by identifying the point where communication is failing.',
          'Commands such as ping can help test connectivity.',
          'Tools such as traceroute can help understand the path traffic takes through a network.',
          'DNS problems can be investigated separately from general connectivity problems.',
          'Systematic troubleshooting helps identify configuration and infrastructure issues.',
        ],

        resources: [
          {
            title: 'Network Troubleshooting Tutorial',
            type: 'Video',
            url: 'https://www.youtube.com/results?search_query=network+troubleshooting+ping+traceroute',
          },
        ],
      },
    ],
  },
}

/*
|--------------------------------------------------------------------------
| AUTOMATIC LESSON GENERATOR
|--------------------------------------------------------------------------
|
| Every topic in roadmapData gets lessons automatically.
|
| This prevents:
|
| "Topic Not Found"
|
| for topics that don't yet have manually written lesson content.
|
*/

function createGeneratedLessons(
  roleId: string,
  topicId: string,
  topicTitle: string,
  description: string,
  lessonCount: number
): TopicLessons {
  const key = `${roleId}/${topicId}`

  const customTitles =
    lessonTitles[key] ?? []

  const generatedLessons: LessonData[] = []

  for (
    let index = 0;
    index < lessonCount;
    index += 1
  ) {
    const lessonTitle =
      customTitles[index] ??
      `${topicTitle} - Lesson ${index + 1}`

    generatedLessons.push({
      title: lessonTitle,

      description:
        `Learn ${lessonTitle} as part of ${topicTitle}.`,

      duration:
        index === lessonCount - 1
          ? '60 minutes'
          : '45 minutes',

      content: [
        `${lessonTitle} is an important part of ${topicTitle}.`,

        description,

        `In this lesson, you will learn the main concepts related to ${lessonTitle}.`,

        `Understand how ${lessonTitle} is used in practical ${roleId.replaceAll(
          '-',
          ' '
        )} environments.`,

        `Practice the concepts covered in ${lessonTitle} before moving to the next lesson.`,
      ],

      resources: [
        {
          title:
            `${lessonTitle} Tutorial`,

          type:
            'Video',

          url:
            `https://www.youtube.com/results?search_query=${encodeURIComponent(
              `${lessonTitle} tutorial for beginners`
            )}`,
        },
      ],
    })
  }

  return {
    topicTitle,
    lessons:
      generatedLessons,
  }
}

/*
|--------------------------------------------------------------------------
| GET LESSON DATA
|--------------------------------------------------------------------------
*/

function getTopicLessons(
  roleId: string,
  topicId: string
): TopicLessons | undefined {
  const key = `${roleId}/${topicId}`

  /*
  |--------------------------------------------------------------------------
  | 1. Use detailed lesson content if available
  |--------------------------------------------------------------------------
  */

  if (lessonData[key]) {
    return lessonData[key]
  }

  /*
  |--------------------------------------------------------------------------
  | 2. Otherwise find the topic in roadmapData
  |--------------------------------------------------------------------------
  */

  const role = roadmapData[roleId]

  if (!role) {
    return undefined
  }

  const topic = role.topics.find(
    (item) => item.id === topicId
  )

  if (!topic) {
    return undefined
  }

  /*
  |--------------------------------------------------------------------------
  | 3. Automatically create lessons
  |--------------------------------------------------------------------------
  */

  return createGeneratedLessons(
    roleId,
    topicId,
    topic.title,
    topic.description,
    topic.lessons
  )
}

function LessonLearning() {
  const navigate = useNavigate()

  const {
    roleId,
    topicId,
    lessonIndex,
  } = useParams()

  const numericLessonIndex =
    Number(lessonIndex)

  const lessonStorageKey =
    'skillforge_completed_lessons'

  

  const topicKey =
    roleId && topicId
      ? `${roleId}/${topicId}`
      : ''

  /*
  |--------------------------------------------------------------------------
  | FIND TOPIC
  |--------------------------------------------------------------------------
  */

  const topic =
    roleId && topicId
      ? getTopicLessons(
          roleId,
          topicId
        )
      : undefined

  /*
  |--------------------------------------------------------------------------
  | COMPLETION STATE
  |--------------------------------------------------------------------------
  */

  const [
    completedLessons,
    setCompletedLessons,
  ] = useState<number[]>([])

  /*
  |--------------------------------------------------------------------------
  | LOAD COMPLETED LESSONS
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!topicKey) {
      setCompletedLessons([])
      return
    }

    const saved =
      localStorage.getItem(
        lessonStorageKey
      )

    if (!saved) {
      setCompletedLessons([])
      return
    }

    try {
      const parsed =
        JSON.parse(saved)

      if (
        parsed &&
        typeof parsed === 'object' &&
        !Array.isArray(parsed)
      ) {
        const savedLessons =
          parsed[topicKey]

        if (
          Array.isArray(
            savedLessons
          )
        ) {
          setCompletedLessons(
            savedLessons.filter(
              (
                value
              ): value is number =>
                typeof value ===
                'number'
            )
          )

          return
        }
      }

      setCompletedLessons([])
    } catch {
      setCompletedLessons([])
    }
  }, [topicKey])

  /*
  |--------------------------------------------------------------------------
  | INVALID TOPIC
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
                The requested learning topic is not available.
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
  | INVALID LESSON
  |--------------------------------------------------------------------------
  */

  if (
    Number.isNaN(
      numericLessonIndex
    ) ||
    numericLessonIndex < 0 ||
    numericLessonIndex >=
      topic.lessons.length
  ) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-slate-50 p-6">

          <div className="mx-auto max-w-4xl">

            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">

              <h1 className="text-2xl font-bold text-slate-900">
                Lesson Not Found
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                The requested lesson does not exist.
              </p>

              <button
                onClick={() =>
                  navigate(
                    `/employee/roles/${roleId}/topics/${topicId}`
                  )
                }
                className="mt-6 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-700"
              >
                Back to Topic
              </button>

            </div>

          </div>

        </div>
      </DashboardLayout>
    )
  }

  /*
  |--------------------------------------------------------------------------
  | CURRENT LESSON
  |--------------------------------------------------------------------------
  */

  const lesson =
    topic.lessons[
      numericLessonIndex
    ]

  const isFirstLesson =
    numericLessonIndex === 0

  const isLastLesson =
    numericLessonIndex ===
    topic.lessons.length - 1

  const isLessonComplete =
    completedLessons.includes(
      numericLessonIndex
    )

  const completedCount =
    completedLessons.filter(
      (index) =>
        index >= 0 &&
        index <
          topic.lessons.length
    ).length

  const topicProgress =
    Math.round(
      (
        completedCount /
        topic.lessons.length
      ) *
        100
    )

  /*
  |--------------------------------------------------------------------------
  | UPDATE TOPIC COMPLETION
  |--------------------------------------------------------------------------
  */

  

  /*
  |--------------------------------------------------------------------------
  | MARK LESSON COMPLETE
  |--------------------------------------------------------------------------
  */

  const markLessonComplete =
    () => {
      if (
        !topicKey ||
        isLessonComplete
      ) {
        return
      }

      const saved =
        localStorage.getItem(
          lessonStorageKey
        )

      let allProgress: Record<
        string,
        number[]
      > = {}

      if (saved) {
        try {
          const parsed =
            JSON.parse(saved)

          if (
            parsed &&
            typeof parsed ===
              'object' &&
            !Array.isArray(
              parsed
            )
          ) {
            allProgress =
              parsed
          }
        } catch {
          allProgress = {}
        }
      }

      const current =
        Array.isArray(
          allProgress[
            topicKey
          ]
        )
          ? allProgress[
              topicKey
            ]
          : []

      const updatedLessons =
        current.includes(
          numericLessonIndex
        )
          ? current
          : [
              ...current,
              numericLessonIndex,
            ]

      allProgress[
        topicKey
      ] = updatedLessons

      localStorage.setItem(
        lessonStorageKey,
        JSON.stringify(
          allProgress
        )
      )

      setCompletedLessons(
        updatedLessons
      )

      
    }

  /*
  |--------------------------------------------------------------------------
  | PREVIOUS LESSON
  |--------------------------------------------------------------------------
  */

  const goToPreviousLesson =
    () => {
      if (isFirstLesson) {
        return
      }

      navigate(
        `/employee/roles/${roleId}/topics/${topicId}/lessons/${
          numericLessonIndex -
          1
        }`
      )
    }

  /*
  |--------------------------------------------------------------------------
  | NEXT LESSON
  |--------------------------------------------------------------------------
  */

  const goToNextLesson =
    () => {
      if (isLastLesson) {
        return
      }

      navigate(
        `/employee/roles/${roleId}/topics/${topicId}/lessons/${
          numericLessonIndex +
          1
        }`
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
                `/employee/roles/${roleId}/topics/${topicId}`
              )
            }
            className="mb-6 flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-purple-600"
          >

            <ArrowLeft
              size={17}
            />

            Back to{' '}
            {topic.topicTitle}

          </button>

          {/* HEADER */}

          <div className="rounded-2xl bg-slate-900 p-7 text-white">

            <div className="flex flex-wrap items-center gap-3">

              <span className="rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">

                Lesson{' '}
                {numericLessonIndex +
                  1}{' '}
                of{' '}
                {
                  topic.lessons
                    .length
                }

              </span>

              <span className="flex items-center gap-1.5 text-xs text-slate-400">

                <Clock3
                  size={14}
                />

                {
                  lesson.duration
                }

              </span>

              {isLessonComplete && (
                <span className="flex items-center gap-1.5 rounded-full bg-green-500/15 px-3 py-1 text-xs font-semibold text-green-400">

                  <CheckCircle2
                    size={14}
                  />

                  Completed

                </span>
              )}

            </div>

            <h1 className="mt-4 text-3xl font-bold">
              {lesson.title}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
              {lesson.description}
            </p>

            {/* TOPIC PROGRESS */}

            <div className="mt-7">

              <div className="flex items-center justify-between text-xs">

                <span className="text-slate-400">
                  Topic Progress
                </span>

                <span className="font-semibold text-white">
                  {completedCount}{' '}
                  /{' '}
                  {
                    topic.lessons
                      .length
                  }{' '}
                  lessons
                  {' • '}
                  {topicProgress}%
                </span>

              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-700">

                <div
                  className="h-full rounded-full bg-purple-500 transition-all duration-500"
                  style={{
                    width:
                      `${topicProgress}%`,
                  }}
                />

              </div>

            </div>

          </div>

          {/* MAIN */}

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">

            {/* CONTENT */}

            <div className="lg:col-span-2">

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

                    <BookOpen
                      size={21}
                    />

                  </div>

                  <div>

                    <h2 className="text-xl font-bold text-slate-900">
                      Lesson Content
                    </h2>

                    <p className="text-sm text-slate-500">
                      Study the material below.
                    </p>

                  </div>

                </div>

                <div className="mt-6 space-y-5">

                  {lesson.content.map(
                    (
                      paragraph,
                      index
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                      >

                        <p className="text-sm leading-7 text-slate-700">
                          {
                            paragraph
                          }
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* NAVIGATION */}

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <button
                  onClick={goToPreviousLesson}
                  disabled={isFirstLesson}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-purple-200 hover:text-purple-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ArrowLeft size={17} />
                  Previous Lesson
                </button>

                <div className="flex flex-col gap-3 sm:flex-row">

                  {!isLessonComplete && (
                   <button
                     onClick={markLessonComplete}
                     className="flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      <CheckCircle2 size={17} />
                      Mark Lesson Complete
                    </button>
                  )}

                  {isLessonComplete && !isLastLesson && (
                    <button
                      onClick={goToNextLesson}
                      className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                    >
                      Next Lesson
                      <ArrowRight size={17} />
                    </button>
                  )}

                  {isLessonComplete && isLastLesson && (
                    <button
                      onClick={() =>
                        navigate(
                          `/employee/roles/${roleId}/topics/${topicId}`
                        )
                      }
                      className="flex items-center justify-center gap-2 rounded-xl bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
                    >
                      Go to Topic Assessment
                      <ArrowRight size={17} />
                    </button>
                  )}
                </div>

              </div>

            </div>

            {/* SIDEBAR */}

            <div>

              {/* RESOURCES */}

              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">

                    <PlayCircle
                      size={21}
                    />

                  </div>

                  <div>

                    <h2 className="font-bold text-slate-900">
                      Resources
                    </h2>

                    <p className="text-xs text-slate-500">
                      Additional learning material
                    </p>

                  </div>

                </div>

                <div className="mt-5 space-y-3">

                  {lesson.resources.map(
                    (
                      resource
                    ) => (
                      <a
                        key={
                          resource.title
                        }
                        href={
                          resource.url
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-purple-300 hover:bg-purple-50"
                      >

                        <div className="flex items-center gap-3">

                          <PlayCircle
                            size={18}
                            className="shrink-0 text-purple-600"
                          />

                          <div>

                            <p className="text-sm font-semibold text-slate-800">
                              {
                                resource.title
                              }
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {
                                resource.type
                              }
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

              {/* LESSON COMPLETION */}

              <div
                className={`mt-5 rounded-2xl border p-5 ${
                  isLessonComplete
                    ? 'border-green-100 bg-green-50'
                    : 'border-purple-100 bg-purple-50'
                }`}
              >

                <div className="flex gap-3">

                  <CheckCircle2
                    size={21}
                    className={`mt-0.5 shrink-0 ${
                      isLessonComplete
                        ? 'text-green-600'
                        : 'text-purple-600'
                    }`}
                  />

                  <div>

                    <h3
                      className={`text-sm font-semibold ${
                        isLessonComplete
                          ? 'text-green-900'
                          : 'text-purple-900'
                      }`}
                    >

                      {isLessonComplete
                        ? 'Lesson Completed'
                        : 'Complete This Lesson'}

                    </h3>

                    <p
                      className={`mt-1 text-sm leading-5 ${
                        isLessonComplete
                          ? 'text-green-700'
                          : 'text-purple-700'
                      }`}
                    >

                      {isLessonComplete
                        ? 'This lesson has been added to your learning progress.'
                        : 'After studying the lesson material, mark this lesson as complete.'}

                    </p>

                  </div>

                </div>

                <button
                  onClick={
                    markLessonComplete
                  }
                  disabled={
                    isLessonComplete
                  }
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isLessonComplete
                      ? 'cursor-default bg-green-600 text-white'
                      : 'bg-purple-600 text-white hover:bg-purple-700'
                  }`}
                >

                  <CheckCircle2
                    size={17}
                  />

                  {isLessonComplete
                    ? 'Completed'
                    : 'Mark Lesson Complete'}

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </DashboardLayout>
  )
}

export default LessonLearning