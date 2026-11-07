require('dotenv').config()

const pool = require('../../config/db')

const challenges = [
  {
    roleSlug: 'frontend-engineer',

    title:
      'Frontend Application Challenge',

    description:
      'Build the core logic for a small task management application using JavaScript.',

    language:
      'JavaScript',

    durationMinutes: 60,

    passingScore: 70,

    instructions: [
      'Implement the addTask function.',
      'Each task must contain an id, title, and completed status.',
      'Do not add a task when the title is empty.',
      'Implement toggleTask to change the completed status.',
      'Return the updated task list from each function.',
    ],

    starterCode: `function addTask(tasks, title) {
  // Write your solution here
}

function toggleTask(tasks, taskId) {
  // Write your solution here
}`,

    visibleTests: [
      {
        input:
          "addTask([], 'Learn React')",

        output:
          "[{ id: 1, title: 'Learn React', completed: false }]",
      },
      {
        input:
          'toggleTask([{ id: 1, title: "Learn React", completed: false }], 1)',

        output:
          '[{ id: 1, title: "Learn React", completed: true }]',
      },
    ],
  },

  {
    roleSlug: 'backend-engineer',

    title:
      'Backend API Logic Challenge',

    description:
      'Implement validation and data-processing logic for a REST API.',

    language:
      'JavaScript',

    durationMinutes: 60,

    passingScore: 70,

    instructions: [
      'Implement createUser.',
      'Reject users with an empty name or email.',
      'Generate a unique numeric id for a valid user.',
      'Implement findUserById.',
      'Return null when the requested user does not exist.',
    ],

    starterCode: `function createUser(users, userData) {
  // Write your solution here
}

function findUserById(users, userId) {
  // Write your solution here
}`,

    visibleTests: [
      {
        input:
          "createUser([], { name: 'Rahul', email: 'rahul@example.com' })",

        output:
          'A new user object with id, name and email',
      },
      {
        input:
          'findUserById([{ id: 1, name: "Rahul" }], 1)',

        output:
          '{ id: 1, name: "Rahul" }',
      },
    ],
  },

  {
    roleSlug: 'data-analyst',

    title:
      'Data Analysis Challenge',

    description:
      'Use Python to analyze a collection of sales values.',

    language:
      'Python',

    durationMinutes: 60,

    passingScore: 70,

    instructions: [
      'Implement analyze_sales.',
      'Calculate total sales.',
      'Calculate average sales.',
      'Return the highest sale.',
      'Handle an empty list safely.',
    ],

    starterCode: `def analyze_sales(sales):
    # Write your solution here
    pass`,

    visibleTests: [
      {
        input:
          'analyze_sales([100, 200, 300])',

        output:
          "{'total': 600, 'average': 200, 'highest': 300}",
      },
    ],
  },

  {
    roleSlug: 'data-scientist',

    title:
      'Python Data Processing Challenge',

    description:
      'Implement reusable Python logic for cleaning and summarizing numerical data.',

    language:
      'Python',

    durationMinutes: 60,

    passingScore: 70,

    instructions: [
      'Remove None values from the dataset.',
      'Calculate the mean of valid values.',
      'Find the minimum and maximum values.',
      'Return the results as a dictionary.',
      'Handle an empty dataset safely.',
    ],

    starterCode: `def summarize_data(values):
    # Write your solution here
    pass`,

    visibleTests: [
      {
        input:
          'summarize_data([10, None, 20, 30])',

        output:
          "{'mean': 20, 'min': 10, 'max': 30}",
      },
    ],
  },

  {
    roleSlug: 'devops-engineer',

    title:
      'DevOps Configuration Challenge',

    description:
      'Complete a container configuration for a web application.',

    language:
      'Dockerfile',

    durationMinutes: 45,

    passingScore: 70,

    instructions: [
      'Use an appropriate Node.js base image.',
      'Set the application working directory.',
      'Copy dependency files before installing packages.',
      'Install dependencies.',
      'Copy the application source and define the startup command.',
    ],

    starterCode: `# Complete the Dockerfile

FROM node:20-alpine

# Add the remaining instructions
`,

    visibleTests: [
      {
        input:
          'Application port',

        output:
          'The containerized application should be ready to start correctly.',
      },
    ],
  },

  {
    roleSlug: 'cloud-engineer',

    title:
      'Cloud Infrastructure Challenge',

    description:
      'Complete an infrastructure configuration for a basic cloud environment.',

    language:
      'Terraform',

    durationMinutes: 60,

    passingScore: 70,

    instructions: [
      'Define the required provider.',
      'Configure the infrastructure resource.',
      'Use variables where appropriate.',
      'Add meaningful resource tags.',
      'Keep the configuration reusable.',
    ],

    starterCode: `# Complete the Terraform configuration

terraform {
  required_providers {
    # Configure provider
  }
}

# Define infrastructure below
`,

    visibleTests: [
      {
        input:
          'terraform validate',

        output:
          'Configuration should be structurally valid.',
      },
    ],
  },

  {
    roleSlug: 'qa-engineer',

    title:
      'Test Automation Challenge',

    description:
      'Write automated tests for a small application feature.',

    language:
      'JavaScript',

    durationMinutes: 60,

    passingScore: 70,

    instructions: [
      'Create tests for valid input.',
      'Create tests for invalid input.',
      'Include at least one boundary case.',
      'Keep each test focused on one behavior.',
      'Make assertions against expected results.',
    ],

    starterCode: `describe('User validation', () => {
  // Write your test cases here
})
`,

    visibleTests: [
      {
        input:
          'Valid user data',

        output:
          'Validation test should pass.',
      },
      {
        input:
          'Missing required fields',

        output:
          'Validation should fail.',
      },
    ],
  },

  {
    roleSlug: 'full-stack-engineer',

    title:
      'Full Stack Application Challenge',

    description:
      'Implement application logic connecting frontend-style data with backend-style operations.',

    language:
      'JavaScript',

    durationMinutes: 75,

    passingScore: 70,

    instructions: [
      'Implement createTask.',
      'Validate the task title.',
      'Implement updateTask.',
      'Implement deleteTask.',
      'Return predictable results for invalid ids.',
    ],

    starterCode: `function createTask(tasks, title) {
  // Write your solution here
}

function updateTask(tasks, taskId, updates) {
  // Write your solution here
}

function deleteTask(tasks, taskId) {
  // Write your solution here
}`,

    visibleTests: [
      {
        input:
          "createTask([], 'Build SkillForge')",

        output:
          'A new task object',
      },
    ],
  },
]

// ============================================================
// Convert the frontend instruction array into the TEXT format
// used by practical_challenges.instructions.
//
// We store JSON text here so the API can later parse it back
// into a string array without losing the existing structure.
// ============================================================

async function seedPracticalChallenges() {
  const client =
    await pool.connect()

  try {
    console.log(
      'Seeding practical challenges...'
    )

    await client.query('BEGIN')

    for (
      const challenge
      of challenges
    ) {
      // --------------------------------------------------------
      // Find the career role.
      // --------------------------------------------------------

      const roleResult =
        await client.query(
          `
            SELECT id
            FROM career_roles
            WHERE slug = $1
            LIMIT 1
          `,
          [
            challenge.roleSlug,
          ]
        )

      if (
        roleResult.rows.length === 0
      ) {
        throw new Error(
          `Career role not found: ${challenge.roleSlug}`
        )
      }

      const careerRoleId =
        roleResult.rows[0].id

      // --------------------------------------------------------
      // Insert/update challenge.
      //
      // UNIQUE(career_role_id) makes this seed safe to run
      // repeatedly.
      //
      // hidden_tests intentionally starts empty.
      // --------------------------------------------------------

      await client.query(
        `
          INSERT INTO practical_challenges (
            career_role_id,
            title,
            description,
            instructions,
            starter_code,
            language,
            visible_tests,
            hidden_tests,
            passing_score,
            duration_minutes,
            is_active,
            updated_at
          )
          VALUES (
            $1,
            $2,
            $3,
            $4,
            $5,
            $6,
            $7::jsonb,
            $8::jsonb,
            $9,
            $10,
            TRUE,
            CURRENT_TIMESTAMP
          )

          ON CONFLICT (career_role_id)

          DO UPDATE SET
            title =
              EXCLUDED.title,

            description =
              EXCLUDED.description,

            instructions =
              EXCLUDED.instructions,

            starter_code =
              EXCLUDED.starter_code,

            language =
              EXCLUDED.language,

            visible_tests =
              EXCLUDED.visible_tests,

            hidden_tests =
              EXCLUDED.hidden_tests,

            passing_score =
              EXCLUDED.passing_score,

            duration_minutes =
              EXCLUDED.duration_minutes,

            is_active =
              TRUE,

            updated_at =
              CURRENT_TIMESTAMP
        `,
        [
          careerRoleId,

          challenge.title,

          challenge.description,

          JSON.stringify(
            challenge.instructions
          ),

          challenge.starterCode,

          challenge.language,

          JSON.stringify(
            challenge.visibleTests
          ),

          JSON.stringify([]),

          challenge.passingScore,

          challenge.durationMinutes,
        ]
      )

      console.log(
        `Seeded: ${challenge.roleSlug}`
      )
    }

    await client.query('COMMIT')

    console.log(
      `Successfully seeded ${challenges.length} practical challenges.`
    )
  } catch (error) {
    try {
      await client.query(
        'ROLLBACK'
      )
    } catch (
      rollbackError
    ) {
      console.error(
        'Rollback failed:',
        rollbackError
      )
    }

    console.error(
      'Failed to seed practical challenges:',
      error
    )

    process.exitCode = 1
  } finally {
    client.release()

    await pool.end()
  }
}

seedPracticalChallenges()