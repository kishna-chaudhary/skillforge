require('dotenv').config()

const pool = require('../../config/db')

const topicsByRole = {
  'frontend-engineer': [
    [
      'html-css',
      'HTML & CSS Fundamentals',
      'Learn semantic HTML, CSS fundamentals, layouts, Flexbox, Grid, and responsive design.',
      '6 hours',
    ],
    [
      'javascript',
      'JavaScript Fundamentals',
      'Learn variables, functions, arrays, objects, DOM manipulation, asynchronous JavaScript, and modern ES features.',
      '10 hours',
    ],
    [
      'git-github',
      'Git & GitHub',
      'Learn version control and collaborative frontend development workflows.',
      '4 hours',
    ],
    [
      'react',
      'React Fundamentals',
      'Learn components, props, state, hooks, events, forms, and component architecture.',
      '8 hours',
    ],
    [
      'typescript',
      'TypeScript',
      'Learn types, interfaces, generics, utility types, and TypeScript application development.',
      '6 hours',
    ],
    [
      'frontend-apis',
      'APIs & Frontend Integration',
      'Learn REST APIs, HTTP requests, authentication, loading states, and error handling.',
      '5 hours',
    ],
    [
      'frontend-testing',
      'Frontend Testing',
      'Learn unit, component, and end-to-end testing for frontend applications.',
      '5 hours',
    ],
    [
      'frontend-project',
      'Frontend Capstone Project',
      'Build a production-style React application using the skills learned throughout the roadmap.',
      '12 hours',
    ],
  ],

  'backend-engineer': [
    [
      'programming-fundamentals',
      'Programming Fundamentals',
      'Learn programming concepts, data structures, functions, error handling, and application structure.',
      '8 hours',
    ],
    [
      'nodejs',
      'Node.js Fundamentals',
      'Learn Node.js runtime, modules, packages, asynchronous programming, and backend development.',
      '7 hours',
    ],
    [
      'rest-api',
      'REST API Development',
      'Learn HTTP methods, API design, routing, controllers, validation, and error handling.',
      '6 hours',
    ],
    [
      'databases',
      'Databases & SQL',
      'Learn relational databases, SQL queries, relationships, indexing, and database design.',
      '8 hours',
    ],
    [
      'authentication',
      'Authentication & Authorization',
      'Learn sessions, JWT, password security, roles, permissions, and secure API design.',
      '5 hours',
    ],
    [
      'backend-testing',
      'Backend Testing',
      'Learn unit testing, integration testing, API testing, and test-driven development basics.',
      '5 hours',
    ],
    [
      'backend-deployment',
      'Backend Deployment',
      'Learn environment configuration, deployment, logging, and production backend practices.',
      '6 hours',
    ],
    [
      'backend-project',
      'Backend Capstone Project',
      'Build a complete production-style backend application with APIs, database, authentication, and deployment.',
      '12 hours',
    ],
  ],

  'data-analyst': [
    [
      'excel',
      'Excel Fundamentals',
      'Learn spreadsheets, formulas, functions, sorting, filtering, and data organization.',
      '5 hours',
    ],
    [
      'sql',
      'SQL Fundamentals',
      'Learn SQL queries, filtering, joins, grouping, aggregation, and data analysis.',
      '8 hours',
    ],
    [
      'python-data',
      'Python for Data Analysis',
      'Learn Python fundamentals and libraries used for data analysis.',
      '8 hours',
    ],
    [
      'statistics',
      'Statistics Fundamentals',
      'Learn descriptive statistics, probability, distributions, correlation, and basic inference.',
      '7 hours',
    ],
    [
      'data-visualization',
      'Data Visualization',
      'Learn how to transform data into meaningful charts, dashboards, and reports.',
      '6 hours',
    ],
    [
      'power-bi',
      'Power BI',
      'Learn dashboard creation, data modeling, reports, and business intelligence fundamentals.',
      '8 hours',
    ],
    [
      'data-project',
      'Data Analytics Project',
      'Analyze a real-world dataset and create a complete business analytics dashboard.',
      '10 hours',
    ],
  ],

  'data-scientist': [
    [
      'python-fundamentals',
      'Python Fundamentals',
      'Learn Python syntax, variables, functions, collections, modules, and object-oriented programming.',
      '8 hours',
    ],
    [
      'statistics',
      'Statistics for Data Science',
      'Learn probability, distributions, descriptive statistics, correlation, regression, and statistical inference.',
      '8 hours',
    ],
    [
      'sql-data',
      'SQL & Data Management',
      'Learn SQL queries, joins, aggregations, subqueries, and working with structured datasets.',
      '6 hours',
    ],
    [
      'pandas',
      'Python for Data Analysis',
      'Learn NumPy, Pandas, data cleaning, transformation, aggregation, and exploratory data analysis.',
      '8 hours',
    ],
    [
      'data-visualization',
      'Data Visualization',
      'Learn how to communicate insights using charts, graphs, dashboards, and visualization libraries.',
      '6 hours',
    ],
    [
      'machine-learning',
      'Machine Learning Fundamentals',
      'Learn supervised and unsupervised learning, regression, classification, clustering, and model evaluation.',
      '10 hours',
    ],
    [
      'feature-engineering',
      'Feature Engineering',
      'Learn feature selection, feature transformation, encoding, scaling, and preparing datasets for machine learning.',
      '5 hours',
    ],
    [
      'model-evaluation',
      'Model Evaluation & Optimization',
      'Learn cross-validation, evaluation metrics, hyperparameter tuning, and improving machine learning models.',
      '6 hours',
    ],
    [
      'deep-learning',
      'Introduction to Deep Learning',
      'Understand neural networks, deep learning concepts, training workflows, and common applications.',
      '8 hours',
    ],
    [
      'data-science-project',
      'Data Science Capstone Project',
      'Complete an end-to-end data science project including data preparation, analysis, machine learning, and presentation.',
      '12 hours',
    ],
  ],

  'devops-engineer': [
    [
      'linux-fundamentals',
      'Linux Fundamentals',
      'Learn Linux commands, file systems, permissions, processes, users, and shell basics.',
      '6 hours',
    ],
    [
      'networking-fundamentals',
      'Networking Fundamentals',
      'Understand TCP/IP, DNS, HTTP, HTTPS, ports, protocols, and basic network troubleshooting.',
      '5 hours',
    ],
    [
      'git-github',
      'Git & GitHub',
      'Learn version control, branches, merging, pull requests, and collaborative development.',
      '4 hours',
    ],
    [
      'docker',
      'Docker & Containers',
      'Learn containers, Docker images, Dockerfiles, volumes, networks, and Docker Compose.',
      '7 hours',
    ],
    [
      'kubernetes',
      'Kubernetes',
      'Understand Kubernetes architecture, pods, deployments, services, config maps, and scaling.',
      '8 hours',
    ],
    [
      'cicd',
      'CI/CD Pipelines',
      'Learn continuous integration and deployment using automated build, test, and deployment pipelines.',
      '6 hours',
    ],
    [
      'aws',
      'AWS Cloud Fundamentals',
      'Learn core AWS services including EC2, S3, IAM, VPC, CloudWatch, and deployment fundamentals.',
      '10 hours',
    ],
    [
      'terraform',
      'Infrastructure as Code',
      'Learn Terraform and infrastructure automation to create repeatable cloud infrastructure.',
      '6 hours',
    ],
    [
      'monitoring',
      'Monitoring & Observability',
      'Learn logs, metrics, monitoring, alerts, dashboards, and application observability.',
      '5 hours',
    ],
    [
      'devops-project',
      'DevOps Capstone Project',
      'Build and deploy a complete application using Docker, CI/CD, cloud infrastructure, and monitoring.',
      '12 hours',
    ],
  ],

  'cloud-engineer': [
    [
      'cloud-fundamentals',
      'Cloud Computing Fundamentals',
      'Learn cloud concepts, service models, deployment models, scalability, availability, and cloud architecture.',
      '5 hours',
    ],
    [
      'linux',
      'Linux Fundamentals',
      'Learn Linux commands, file systems, permissions, processes, users, packages, and shell scripting basics.',
      '6 hours',
    ],
    [
      'networking',
      'Cloud Networking',
      'Learn IP addressing, DNS, HTTP, TCP/IP, subnets, routing, firewalls, and virtual networks.',
      '7 hours',
    ],
    [
      'aws',
      'AWS Fundamentals',
      'Learn core AWS services including EC2, S3, IAM, VPC, CloudWatch, and basic cloud deployment.',
      '10 hours',
    ],
    [
      'azure',
      'Microsoft Azure Fundamentals',
      'Understand Azure services, virtual machines, storage, networking, identity, and cloud resources.',
      '8 hours',
    ],
    [
      'docker',
      'Docker & Containers',
      'Learn containers, images, Dockerfiles, volumes, networks, and container deployment.',
      '7 hours',
    ],
    [
      'terraform',
      'Terraform & Infrastructure as Code',
      'Learn infrastructure as code and use Terraform to create repeatable cloud infrastructure.',
      '7 hours',
    ],
    [
      'cloud-security',
      'Cloud Security',
      'Learn IAM, access control, encryption, security groups, monitoring, and cloud security best practices.',
      '6 hours',
    ],
    [
      'cloud-monitoring',
      'Cloud Monitoring & Observability',
      'Learn logging, metrics, alerts, dashboards, health checks, and cloud monitoring strategies.',
      '5 hours',
    ],
    [
      'cloud-project',
      'Cloud Engineering Capstone Project',
      'Design and deploy a production-style application using cloud infrastructure, containers, networking, and monitoring.',
      '12 hours',
    ],
  ],

  'qa-engineer': [
    [
      'testing-fundamentals',
      'Software Testing Fundamentals',
      'Learn software testing concepts, testing levels, testing types, defect lifecycle, and QA processes.',
      '5 hours',
    ],
    [
      'test-cases',
      'Test Cases & Test Planning',
      'Learn how to create test scenarios, test cases, test plans, test data, and defect reports.',
      '5 hours',
    ],
    [
      'manual-testing',
      'Manual Testing',
      'Practice functional, regression, integration, system, smoke, and exploratory testing.',
      '6 hours',
    ],
    [
      'api-testing',
      'API Testing',
      'Learn REST APIs, HTTP methods, request validation, response validation, and API testing workflows.',
      '6 hours',
    ],
    [
      'selenium',
      'Selenium Automation',
      'Learn browser automation, locators, web element interaction, test execution, and Selenium workflows.',
      '8 hours',
    ],
    [
      'automation-frameworks',
      'Test Automation Frameworks',
      'Learn test structure, reusable components, assertions, fixtures, reporting, and automation frameworks.',
      '7 hours',
    ],
    [
      'javascript-testing',
      'JavaScript Testing',
      'Learn automated testing using JavaScript and modern testing tools and practices.',
      '6 hours',
    ],
    [
      'ci-cd-testing',
      'CI/CD & Automated Testing',
      'Learn how automated tests are integrated into continuous integration and deployment pipelines.',
      '5 hours',
    ],
    [
      'performance-testing',
      'Performance Testing',
      'Learn performance testing concepts, load testing, stress testing, response times, and bottleneck analysis.',
      '5 hours',
    ],
    [
      'qa-project',
      'QA Automation Capstone Project',
      'Create a complete testing project covering test planning, manual testing, API testing, automation, and reporting.',
      '10 hours',
    ],
  ],

  'full-stack-engineer': [
    [
      'web-fundamentals',
      'Web Development Fundamentals',
      'Learn HTML, CSS, HTTP, browsers, web architecture, and developer tools.',
      '6 hours',
    ],
    [
      'javascript',
      'JavaScript',
      'Learn modern JavaScript and the concepts required for frontend and backend development.',
      '10 hours',
    ],
    [
      'react',
      'React',
      'Learn modern React development, hooks, components, forms, and application architecture.',
      '8 hours',
    ],
    [
      'nodejs',
      'Node.js & Express',
      'Build backend services and REST APIs using Node.js and Express.',
      '8 hours',
    ],
    [
      'database',
      'Database Development',
      'Learn SQL, database design, relationships, queries, and application integration.',
      '7 hours',
    ],
    [
      'authentication',
      'Authentication & Security',
      'Learn secure login, authentication, authorization, and application security fundamentals.',
      '5 hours',
    ],
    [
      'deployment',
      'Application Deployment',
      'Learn how to deploy frontend and backend applications and configure production environments.',
      '6 hours',
    ],
    [
      'full-stack-project',
      'Full Stack Capstone Project',
      'Build and deploy a complete full-stack application from frontend to backend and database.',
      '15 hours',
    ],
  ],
}

async function seedTopics() {
  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    let totalTopics = 0

    for (
      const [roleSlug, topics]
      of Object.entries(topicsByRole)
    ) {
      const roleResult =
        await client.query(
          `
            SELECT id
            FROM career_roles
            WHERE slug = $1
            LIMIT 1
          `,
          [roleSlug]
        )

      if (roleResult.rows.length === 0) {
        throw new Error(
          `Career role not found: ${roleSlug}`
        )
      }

      const careerRoleId =
        roleResult.rows[0].id

      for (
        let index = 0;
        index < topics.length;
        index += 1
      ) {
        const [
          slug,
          title,
          description,
          duration,
        ] = topics[index]

        await client.query(
          `
            INSERT INTO topics (
              career_role_id,
              slug,
              title,
              description,
              duration,
              position,
              is_active
            )
            VALUES (
              $1,
              $2,
              $3,
              $4,
              $5,
              $6,
              true
            )
            ON CONFLICT (
              career_role_id,
              slug
            )
            DO UPDATE SET
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              duration = EXCLUDED.duration,
              position = EXCLUDED.position,
              is_active = true,
              updated_at = CURRENT_TIMESTAMP
          `,
          [
            careerRoleId,
            slug,
            title,
            description,
            duration,
            index + 1,
          ]
        )

        totalTopics += 1
      }
    }

    await client.query('COMMIT')

    console.log(
      `Successfully seeded ${totalTopics} topics.`
    )
  } catch (error) {
    await client.query('ROLLBACK')

    console.error(
      'Topic seed failed:',
      error
    )

    process.exitCode = 1
  } finally {
    client.release()
    await pool.end()
  }
}

void seedTopics()