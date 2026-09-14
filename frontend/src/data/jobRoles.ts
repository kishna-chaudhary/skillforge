export interface JobRole {
  id: string
  title: string
  description: string
  level: string
  duration: string
  skills: string[]
}

export const jobRoles: JobRole[] = [
  {
    id: 'devops-engineer',
    title: 'DevOps Engineer',
    description:
      'Learn Linux, networking, Git, Docker, CI/CD, cloud infrastructure, and Kubernetes to build a career in DevOps.',
    level: 'Beginner to Advanced',
    duration: '6 Months',
    skills: [
      'Linux',
      'Networking',
      'Git',
      'Docker',
      'CI/CD',
      'AWS',
      'Kubernetes',
    ],
  },

  {
    id: 'frontend-engineer',
    title: 'Frontend Engineer',
    description:
      'Build modern and responsive web applications using HTML, CSS, JavaScript, React, and modern frontend tools.',
    level: 'Beginner to Advanced',
    duration: '5 Months',
    skills: [
      'HTML',
      'CSS',
      'JavaScript',
      'TypeScript',
      'React',
      'Git',
      'Testing',
    ],
  },

  {
    id: 'full-stack-engineer',
    title: 'Full Stack Engineer',
    description:
      'Learn frontend and backend development to build complete scalable web applications.',
    level: 'Beginner to Advanced',
    duration: '7 Months',
    skills: [
      'HTML',
      'CSS',
      'JavaScript',
      'React',
      'Node.js',
      'Express',
      'MongoDB',
      'REST APIs',
    ],
  },

  {
    id: 'backend-engineer',
    title: 'Backend Engineer',
    description:
      'Learn server-side development, APIs, databases, authentication, and scalable backend architecture.',
    level: 'Intermediate',
    duration: '5 Months',
    skills: [
      'Node.js',
      'Express',
      'REST APIs',
      'Databases',
      'Authentication',
      'Testing',
      'System Design',
    ],
  },

  {
    id: 'data-analyst',
    title: 'Data Analyst',
    description:
      'Learn how to collect, clean, analyze, visualize, and communicate data for business decisions.',
    level: 'Beginner to Intermediate',
    duration: '4 Months',
    skills: [
      'Excel',
      'SQL',
      'Python',
      'Pandas',
      'Statistics',
      'Power BI',
      'Data Visualization',
    ],
  },

  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description:
      'Learn statistics, Python, machine learning, data analysis, and predictive modeling.',
    level: 'Intermediate to Advanced',
    duration: '7 Months',
    skills: [
      'Python',
      'Statistics',
      'Pandas',
      'NumPy',
      'Machine Learning',
      'SQL',
      'Data Visualization',
    ],
  },

  {
    id: 'cloud-engineer',
    title: 'Cloud Engineer',
    description:
      'Learn cloud computing, infrastructure, networking, security, and cloud deployment.',
    level: 'Intermediate',
    duration: '6 Months',
    skills: [
      'Cloud Computing',
      'AWS',
      'Azure',
      'Networking',
      'Linux',
      'Docker',
      'Infrastructure',
    ],
  },

  {
    id: 'qa-engineer',
    title: 'QA Engineer',
    description:
      'Learn software testing, automation, API testing, test planning, and quality engineering.',
    level: 'Beginner to Intermediate',
    duration: '4 Months',
    skills: [
      'Manual Testing',
      'Test Cases',
      'API Testing',
      'Selenium',
      'Automation',
      'JavaScript',
      'CI/CD',
    ],
  },
]