export interface RoadmapTopic {
  id: string
  title: string
  description: string
  duration: string
  lessons: number
}

export interface RoleRoadmapData {
  title: string
  description: string
  topics: RoadmapTopic[]
}

export const roadmapData: Record<string, RoleRoadmapData> = {
  'devops-engineer': {
    title: 'DevOps Engineer',
    description:
      'Build the skills required to become a DevOps Engineer, from Linux and networking fundamentals to cloud, containers, CI/CD, and infrastructure automation.',
    topics: [
      {
        id: 'linux-fundamentals',
        title: 'Linux Fundamentals',
        description:
          'Learn Linux commands, file systems, permissions, processes, users, and shell basics.',
        duration: '6 hours',
        lessons: 8,
      },
      {
        id: 'networking-fundamentals',
        title: 'Networking Fundamentals',
        description:
          'Understand TCP/IP, DNS, HTTP, HTTPS, ports, protocols, and basic network troubleshooting.',
        duration: '5 hours',
        lessons: 7,
      },
      {
        id: 'git-github',
        title: 'Git & GitHub',
        description:
          'Learn version control, branches, merging, pull requests, and collaborative development.',
        duration: '4 hours',
        lessons: 6,
      },
      {
        id: 'docker',
        title: 'Docker & Containers',
        description:
          'Learn containers, Docker images, Dockerfiles, volumes, networks, and Docker Compose.',
        duration: '7 hours',
        lessons: 9,
      },
      {
        id: 'kubernetes',
        title: 'Kubernetes',
        description:
          'Understand Kubernetes architecture, pods, deployments, services, config maps, and scaling.',
        duration: '8 hours',
        lessons: 10,
      },
      {
        id: 'cicd',
        title: 'CI/CD Pipelines',
        description:
          'Learn continuous integration and deployment using automated build, test, and deployment pipelines.',
        duration: '6 hours',
        lessons: 8,
      },
      {
        id: 'aws',
        title: 'AWS Cloud Fundamentals',
        description:
          'Learn core AWS services including EC2, S3, IAM, VPC, CloudWatch, and deployment fundamentals.',
        duration: '10 hours',
        lessons: 12,
      },
      {
        id: 'terraform',
        title: 'Infrastructure as Code',
        description:
          'Learn Terraform and infrastructure automation to create repeatable cloud infrastructure.',
        duration: '6 hours',
        lessons: 8,
      },
      {
        id: 'monitoring',
        title: 'Monitoring & Observability',
        description:
          'Learn logs, metrics, monitoring, alerts, dashboards, and application observability.',
        duration: '5 hours',
        lessons: 7,
      },
      {
        id: 'devops-project',
        title: 'DevOps Capstone Project',
        description:
          'Build and deploy a complete application using Docker, CI/CD, cloud infrastructure, and monitoring.',
        duration: '12 hours',
        lessons: 1,
      },
    ],
  },

  'frontend-engineer': {
    title: 'Frontend Engineer',
    description:
      'Learn modern frontend development from web fundamentals to React, TypeScript, APIs, testing, and production deployment.',
    topics: [
      {
        id: 'html-css',
        title: 'HTML & CSS Fundamentals',
        description:
          'Learn semantic HTML, CSS fundamentals, layouts, Flexbox, Grid, and responsive design.',
        duration: '6 hours',
        lessons: 8,
      },
      {
        id: 'javascript',
        title: 'JavaScript Fundamentals',
        description:
          'Learn variables, functions, arrays, objects, DOM manipulation, asynchronous JavaScript, and modern ES features.',
        duration: '10 hours',
        lessons: 12,
      },
      {
        id: 'git-github',
        title: 'Git & GitHub',
        description:
          'Learn version control and collaborative frontend development workflows.',
        duration: '4 hours',
        lessons: 6,
      },
      {
        id: 'react',
        title: 'React Fundamentals',
        description:
          'Learn components, props, state, hooks, events, forms, and component architecture.',
        duration: '8 hours',
        lessons: 10,
      },
      {
        id: 'typescript',
        title: 'TypeScript',
        description:
          'Learn types, interfaces, generics, utility types, and TypeScript application development.',
        duration: '6 hours',
        lessons: 8,
      },
      {
        id: 'frontend-apis',
        title: 'APIs & Frontend Integration',
        description:
          'Learn REST APIs, HTTP requests, authentication, loading states, and error handling.',
        duration: '5 hours',
        lessons: 7,
      },
      {
        id: 'frontend-testing',
        title: 'Frontend Testing',
        description:
          'Learn unit, component, and end-to-end testing for frontend applications.',
        duration: '5 hours',
        lessons: 6,
      },
      {
        id: 'frontend-project',
        title: 'Frontend Capstone Project',
        description:
          'Build a production-style React application using the skills learned throughout the roadmap.',
        duration: '12 hours',
        lessons: 1,
      },
    ],
  },

  'backend-engineer': {
    title: 'Backend Engineer',
    description:
      'Learn server-side development, APIs, databases, authentication, testing, deployment, and backend architecture.',
    topics: [
      {
        id: 'programming-fundamentals',
        title: 'Programming Fundamentals',
        description:
          'Learn programming concepts, data structures, functions, error handling, and application structure.',
        duration: '8 hours',
        lessons: 10,
      },
      {
        id: 'nodejs',
        title: 'Node.js Fundamentals',
        description:
          'Learn Node.js runtime, modules, packages, asynchronous programming, and backend development.',
        duration: '7 hours',
        lessons: 9,
      },
      {
        id: 'rest-api',
        title: 'REST API Development',
        description:
          'Learn HTTP methods, API design, routing, controllers, validation, and error handling.',
        duration: '6 hours',
        lessons: 8,
      },
      {
        id: 'databases',
        title: 'Databases & SQL',
        description:
          'Learn relational databases, SQL queries, relationships, indexing, and database design.',
        duration: '8 hours',
        lessons: 10,
      },
      {
        id: 'authentication',
        title: 'Authentication & Authorization',
        description:
          'Learn sessions, JWT, password security, roles, permissions, and secure API design.',
        duration: '5 hours',
        lessons: 7,
      },
      {
        id: 'backend-testing',
        title: 'Backend Testing',
        description:
          'Learn unit testing, integration testing, API testing, and test-driven development basics.',
        duration: '5 hours',
        lessons: 6,
      },
      {
        id: 'backend-deployment',
        title: 'Backend Deployment',
        description:
          'Learn environment configuration, deployment, logging, and production backend practices.',
        duration: '6 hours',
        lessons: 7,
      },
      {
        id: 'backend-project',
        title: 'Backend Capstone Project',
        description:
          'Build a complete production-style backend application with APIs, database, authentication, and deployment.',
        duration: '12 hours',
        lessons: 1,
      },
    ],
  },

  'full-stack-engineer': {
    title: 'Full Stack Engineer',
    description:
      'Master frontend and backend development and learn how to build, connect, test, and deploy complete web applications.',
    topics: [
      {
        id: 'web-fundamentals',
        title: 'Web Development Fundamentals',
        description:
          'Learn HTML, CSS, HTTP, browsers, web architecture, and developer tools.',
        duration: '6 hours',
        lessons: 8,
      },
      {
        id: 'javascript',
        title: 'JavaScript',
        description:
          'Learn modern JavaScript and the concepts required for frontend and backend development.',
        duration: '10 hours',
        lessons: 12,
      },
      {
        id: 'react',
        title: 'React',
        description:
          'Learn modern React development, hooks, components, forms, and application architecture.',
        duration: '8 hours',
        lessons: 10,
      },
      {
        id: 'nodejs',
        title: 'Node.js & Express',
        description:
          'Build backend services and REST APIs using Node.js and Express.',
        duration: '8 hours',
        lessons: 10,
      },
      {
        id: 'database',
        title: 'Database Development',
        description:
          'Learn SQL, database design, relationships, queries, and application integration.',
        duration: '7 hours',
        lessons: 9,
      },
      {
        id: 'authentication',
        title: 'Authentication & Security',
        description:
          'Learn secure login, authentication, authorization, and application security fundamentals.',
        duration: '5 hours',
        lessons: 7,
      },
      {
        id: 'deployment',
        title: 'Application Deployment',
        description:
          'Learn how to deploy frontend and backend applications and configure production environments.',
        duration: '6 hours',
        lessons: 7,
      },
      {
        id: 'full-stack-project',
        title: 'Full Stack Capstone Project',
        description:
          'Build and deploy a complete full-stack application from frontend to backend and database.',
        duration: '15 hours',
        lessons: 1,
      },
    ],
  },

  'data-analyst': {
    title: 'Data Analyst',
    description:
      'Learn how to collect, clean, analyze, visualize, and communicate data for business decision making.',
    topics: [
      {
        id: 'excel',
        title: 'Excel Fundamentals',
        description:
          'Learn spreadsheets, formulas, functions, sorting, filtering, and data organization.',
        duration: '5 hours',
        lessons: 7,
      },
      {
        id: 'sql',
        title: 'SQL Fundamentals',
        description:
          'Learn SQL queries, filtering, joins, grouping, aggregation, and data analysis.',
        duration: '8 hours',
        lessons: 10,
      },
      {
        id: 'python-data',
        title: 'Python for Data Analysis',
        description:
          'Learn Python fundamentals and libraries used for data analysis.',
        duration: '8 hours',
        lessons: 10,
      },
      {
        id: 'statistics',
        title: 'Statistics Fundamentals',
        description:
          'Learn descriptive statistics, probability, distributions, correlation, and basic inference.',
        duration: '7 hours',
        lessons: 9,
      },
      {
        id: 'data-visualization',
        title: 'Data Visualization',
        description:
          'Learn how to transform data into meaningful charts, dashboards, and reports.',
        duration: '6 hours',
        lessons: 8,
      },
      {
        id: 'power-bi',
        title: 'Power BI',
        description:
          'Learn dashboard creation, data modeling, reports, and business intelligence fundamentals.',
        duration: '8 hours',
        lessons: 9,
      },
      {
        id: 'data-project',
        title: 'Data Analytics Project',
        description:
          'Analyze a real-world dataset and create a complete business analytics dashboard.',
        duration: '10 hours',
        lessons: 1,
      },
    ],
  },

  'data-scientist': {
    title: 'Data Scientist',
    description:
      'Build strong skills in Python, statistics, data analysis, machine learning, and predictive modeling to become a Data Scientist.',
    topics: [
      {
        id: 'python-fundamentals',
        title: 'Python Fundamentals',
        description:
          'Learn Python syntax, variables, functions, collections, modules, and object-oriented programming.',
        duration: '8 hours',
        lessons: 10,
      },
      {
        id: 'statistics',
        title: 'Statistics for Data Science',
        description:
          'Learn probability, distributions, descriptive statistics, correlation, regression, and statistical inference.',
        duration: '8 hours',
        lessons: 10,
      },
      {
        id: 'sql-data',
        title: 'SQL & Data Management',
        description:
          'Learn SQL queries, joins, aggregations, subqueries, and working with structured datasets.',
        duration: '6 hours',
        lessons: 8,
      },
      {
        id: 'pandas',
        title: 'Python for Data Analysis',
        description:
          'Learn NumPy, Pandas, data cleaning, transformation, aggregation, and exploratory data analysis.',
        duration: '8 hours',
        lessons: 10,
      },
      {
        id: 'data-visualization',
        title: 'Data Visualization',
        description:
          'Learn how to communicate insights using charts, graphs, dashboards, and visualization libraries.',
        duration: '6 hours',
        lessons: 8,
      },
      {
        id: 'machine-learning',
        title: 'Machine Learning Fundamentals',
        description:
          'Learn supervised and unsupervised learning, regression, classification, clustering, and model evaluation.',
        duration: '10 hours',
        lessons: 12,
      },
      {
        id: 'feature-engineering',
        title: 'Feature Engineering',
        description:
          'Learn feature selection, feature transformation, encoding, scaling, and preparing datasets for machine learning.',
        duration: '5 hours',
        lessons: 6,
      },
      {
        id: 'model-evaluation',
        title: 'Model Evaluation & Optimization',
        description:
          'Learn cross-validation, evaluation metrics, hyperparameter tuning, and improving machine learning models.',
        duration: '6 hours',
        lessons: 7,
      },
      {
        id: 'deep-learning',
        title: 'Introduction to Deep Learning',
        description:
          'Understand neural networks, deep learning concepts, training workflows, and common applications.',
        duration: '8 hours',
        lessons: 9,
      },
      {
        id: 'data-science-project',
        title: 'Data Science Capstone Project',
        description:
          'Complete an end-to-end data science project including data preparation, analysis, machine learning, and presentation.',
        duration: '12 hours',
        lessons: 1,
      },
    ],
  },

  'cloud-engineer': {
    title: 'Cloud Engineer',
    description:
      'Learn cloud computing, networking, Linux, infrastructure, security, automation, and scalable cloud deployment.',
    topics: [
      {
        id: 'cloud-fundamentals',
        title: 'Cloud Computing Fundamentals',
        description:
          'Learn cloud concepts, service models, deployment models, scalability, availability, and cloud architecture.',
        duration: '5 hours',
        lessons: 7,
      },
      {
        id: 'linux',
        title: 'Linux Fundamentals',
        description:
          'Learn Linux commands, file systems, permissions, processes, users, packages, and shell scripting basics.',
        duration: '6 hours',
        lessons: 8,
      },
      {
        id: 'networking',
        title: 'Cloud Networking',
        description:
          'Learn IP addressing, DNS, HTTP, TCP/IP, subnets, routing, firewalls, and virtual networks.',
        duration: '7 hours',
        lessons: 9,
      },
      {
        id: 'aws',
        title: 'AWS Fundamentals',
        description:
          'Learn core AWS services including EC2, S3, IAM, VPC, CloudWatch, and basic cloud deployment.',
        duration: '10 hours',
        lessons: 12,
      },
      {
        id: 'azure',
        title: 'Microsoft Azure Fundamentals',
        description:
          'Understand Azure services, virtual machines, storage, networking, identity, and cloud resources.',
        duration: '8 hours',
        lessons: 10,
      },
      {
        id: 'docker',
        title: 'Docker & Containers',
        description:
          'Learn containers, images, Dockerfiles, volumes, networks, and container deployment.',
        duration: '7 hours',
        lessons: 9,
      },
      {
        id: 'terraform',
        title: 'Terraform & Infrastructure as Code',
        description:
          'Learn infrastructure as code and use Terraform to create repeatable cloud infrastructure.',
        duration: '7 hours',
        lessons: 8,
      },
      {
        id: 'cloud-security',
        title: 'Cloud Security',
        description:
          'Learn IAM, access control, encryption, security groups, monitoring, and cloud security best practices.',
        duration: '6 hours',
        lessons: 7,
      },
      {
        id: 'cloud-monitoring',
        title: 'Cloud Monitoring & Observability',
        description:
          'Learn logging, metrics, alerts, dashboards, health checks, and cloud monitoring strategies.',
        duration: '5 hours',
        lessons: 6,
      },
      {
        id: 'cloud-project',
        title: 'Cloud Engineering Capstone Project',
        description:
          'Design and deploy a production-style application using cloud infrastructure, containers, networking, and monitoring.',
        duration: '12 hours',
        lessons: 1,
      },
    ],
  },

  'qa-engineer': {
    title: 'QA / Test Engineer',
    description:
      'Learn software testing, test planning, automation, API testing, debugging, and quality engineering practices.',
    topics: [
      {
        id: 'testing-fundamentals',
        title: 'Software Testing Fundamentals',
        description:
          'Learn software testing concepts, testing levels, testing types, defect lifecycle, and QA processes.',
        duration: '5 hours',
        lessons: 7,
      },
      {
        id: 'test-cases',
        title: 'Test Cases & Test Planning',
        description:
          'Learn how to create test scenarios, test cases, test plans, test data, and defect reports.',
        duration: '5 hours',
        lessons: 7,
      },
      {
        id: 'manual-testing',
        title: 'Manual Testing',
        description:
          'Practice functional, regression, integration, system, smoke, and exploratory testing.',
        duration: '6 hours',
        lessons: 8,
      },
      {
        id: 'api-testing',
        title: 'API Testing',
        description:
          'Learn REST APIs, HTTP methods, request validation, response validation, and API testing workflows.',
        duration: '6 hours',
        lessons: 8,
      },
      {
        id: 'selenium',
        title: 'Selenium Automation',
        description:
          'Learn browser automation, locators, web element interaction, test execution, and Selenium workflows.',
        duration: '8 hours',
        lessons: 10,
      },
      {
        id: 'automation-frameworks',
        title: 'Test Automation Frameworks',
        description:
          'Learn test structure, reusable components, assertions, fixtures, reporting, and automation frameworks.',
        duration: '7 hours',
        lessons: 9,
      },
      {
        id: 'javascript-testing',
        title: 'JavaScript Testing',
        description:
          'Learn automated testing using JavaScript and modern testing tools and practices.',
        duration: '6 hours',
        lessons: 8,
      },
      {
        id: 'ci-cd-testing',
        title: 'CI/CD & Automated Testing',
        description:
          'Learn how automated tests are integrated into continuous integration and deployment pipelines.',
        duration: '5 hours',
        lessons: 6,
      },
      {
        id: 'performance-testing',
        title: 'Performance Testing',
        description:
          'Learn performance testing concepts, load testing, stress testing, response times, and bottleneck analysis.',
        duration: '5 hours',
        lessons: 6,
      },
      {
        id: 'qa-project',
        title: 'QA Automation Capstone Project',
        description:
          'Create a complete testing project covering test planning, manual testing, API testing, automation, and reporting.',
        duration: '10 hours',
        lessons: 1,
      },
    ],
  },
}