// ============================================================
// SKILLFORGE PRACTICAL CHALLENGE EVALUATOR
// ============================================================
//
// IMPORTANT SECURITY NOTE:
//
// This evaluator NEVER executes submitted student code.
//
// No:
// - eval()
// - new Function()
// - child_process
// - Python execution
// - Docker execution
// - Terraform execution
//
// It performs deterministic static/rubric checks against the
// eight practical challenges currently configured in SkillForge.
//
// Each challenge has five requirements worth 20 points each.
// ============================================================


// ============================================================
// HELPERS
// ============================================================

function normalizeCode(code) {
  return String(code || '')
    .replace(/\r\n/g, '\n')
    .trim()
}


function stripComments(code) {
  return normalizeCode(code)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '')
    .replace(/#.*$/gm, '')
}


function containsPattern(code, pattern) {
  return pattern.test(code)
}


function createCheck(
  name,
  passed,
  description
) {
  return {
    name,
    passed: Boolean(passed),
    points: passed ? 20 : 0,
    maxPoints: 20,
    description,
  }
}


function finishEvaluation(
  roleSlug,
  checks,
  passingScore
) {
  const score =
    checks.reduce(
      (total, check) =>
        total + check.points,
      0
    )

  return {
    evaluator:
      'skillforge-static-rubric-v1',

    roleSlug,

    score,

    passingScore,

    passed:
      score >= passingScore,

    checks,

    summary: {
      passedChecks:
        checks.filter(
          (check) => check.passed
        ).length,

      totalChecks:
        checks.length,
    },
  }
}


// ============================================================
// FRONTEND ENGINEER
// ============================================================

function evaluateFrontend(
  submittedCode,
  passingScore
) {
  const code =
    stripComments(submittedCode)

  const addTaskFunction =
    /function\s+addTask\s*\(\s*tasks\s*,\s*title\s*\)\s*\{[\s\S]+?\}/m.test(
      code
    )

  const taskFields =
    /\bid\s*:/.test(code) &&
    /\btitle\s*:/.test(code) &&
    /\bcompleted\s*:/.test(code)

  const emptyTitleValidation =
    /(?:!\s*title(?:\.trim\s*\(\s*\))?|title(?:\.trim\s*\(\s*\))?\s*===?\s*['"]{2}|title\.trim\s*\(\s*\)\.length\s*===?\s*0)/m.test(
      code
    )

  const toggleFunction =
    /function\s+toggleTask\s*\(\s*tasks\s*,\s*taskId\s*\)\s*\{[\s\S]+?\}/m.test(
      code
    ) &&
    /completed/.test(code) &&
    /taskId/.test(code)

  const returnsResult =
    /\breturn\b/.test(code) &&
    (
      /\.map\s*\(/.test(code) ||
      /\[\s*\.\.\./.test(code) ||
      /\.concat\s*\(/.test(code) ||
      /\.push\s*\(/.test(code)
    )

  return finishEvaluation(
    'frontend-engineer',
    [
      createCheck(
        'addTask implementation',
        addTaskFunction,
        'Implement addTask with tasks and title parameters.'
      ),

      createCheck(
        'Task structure',
        taskFields,
        'Created tasks should contain id, title, and completed fields.'
      ),

      createCheck(
        'Empty title validation',
        emptyTitleValidation,
        'Empty task titles should be rejected.'
      ),

      createCheck(
        'toggleTask implementation',
        toggleFunction,
        'Implement toggleTask and update completed status.'
      ),

      createCheck(
        'Updated task list',
        returnsResult,
        'Return an updated task list from the implementation.'
      ),
    ],
    passingScore
  )
}


// ============================================================
// BACKEND ENGINEER
// ============================================================

function evaluateBackend(
  submittedCode,
  passingScore
) {
  const code =
    stripComments(submittedCode)

  const createUser =
    /function\s+createUser\s*\(\s*users\s*,\s*userData\s*\)\s*\{[\s\S]+?\}/m.test(
      code
    )

  const validation =
    /userData\s*\.\s*name/.test(code) &&
    /userData\s*\.\s*email/.test(code) &&
    (
      /!\s*userData\s*\.\s*name/.test(code) ||
      /!\s*userData\s*\.\s*email/.test(code) ||
      /\.trim\s*\(\s*\)/.test(code)
    )

  const numericId =
    /\bid\s*:/.test(code) &&
    (
      /users\s*\.\s*length/.test(code) ||
      /Math\s*\.\s*max/.test(code) ||
      /\+\s*1/.test(code)
    )

  const findUser =
    /function\s+findUserById\s*\(\s*users\s*,\s*userId\s*\)\s*\{[\s\S]+?\}/m.test(
      code
    ) &&
    (
      /\.find\s*\(/.test(code) ||
      /\.filter\s*\(/.test(code)
    )

  const missingUser =
    /\bnull\b/.test(code)

  return finishEvaluation(
    'backend-engineer',
    [
      createCheck(
        'createUser implementation',
        createUser,
        'Implement createUser.'
      ),

      createCheck(
        'User validation',
        validation,
        'Reject users with an empty name or email.'
      ),

      createCheck(
        'Numeric user id',
        numericId,
        'Generate a numeric id for valid users.'
      ),

      createCheck(
        'findUserById implementation',
        findUser,
        'Implement lookup by user id.'
      ),

      createCheck(
        'Missing user handling',
        missingUser,
        'Return null when the requested user does not exist.'
      ),
    ],
    passingScore
  )
}


// ============================================================
// DATA ANALYST
// ============================================================

function evaluateDataAnalyst(
  submittedCode,
  passingScore
) {
  const code =
    stripComments(submittedCode)

  const functionDefined =
    /def\s+analyze_sales\s*\(\s*sales\s*\)\s*:/.test(
      code
    )

  const total =
    /sum\s*\(\s*sales\s*\)/.test(
      code
    ) ||
    /\btotal\b/.test(code)

  const average =
    /len\s*\(\s*sales\s*\)/.test(
      code
    ) &&
    (
      /\baverage\b/.test(code) ||
      /\bavg\b/.test(code) ||
      /\bmean\b/.test(code)
    )

  const highest =
    /max\s*\(\s*sales\s*\)/.test(
      code
    )

  const emptyHandling =
    /if\s+not\s+sales\s*:/.test(
      code
    ) ||
    /len\s*\(\s*sales\s*\)\s*==\s*0/.test(
      code
    )

  return finishEvaluation(
    'data-analyst',
    [
      createCheck(
        'analyze_sales implementation',
        functionDefined,
        'Implement analyze_sales.'
      ),

      createCheck(
        'Total sales',
        total,
        'Calculate total sales.'
      ),

      createCheck(
        'Average sales',
        average,
        'Calculate average sales.'
      ),

      createCheck(
        'Highest sale',
        highest,
        'Return the highest sale.'
      ),

      createCheck(
        'Empty list handling',
        emptyHandling,
        'Handle an empty sales list safely.'
      ),
    ],
    passingScore
  )
}


// ============================================================
// DATA SCIENTIST
// ============================================================

function evaluateDataScientist(
  submittedCode,
  passingScore
) {
  const code =
    stripComments(submittedCode)

  const functionDefined =
    /def\s+summarize_data\s*\(\s*values\s*\)\s*:/.test(
      code
    )

  const removesNone =
    /is\s+not\s+None/.test(code) ||
    /!=\s*None/.test(code)

  const mean =
    /sum\s*\(/.test(code) &&
    /len\s*\(/.test(code)

  const minMax =
    /min\s*\(/.test(code) &&
    /max\s*\(/.test(code)

  const dictionary =
    /\{[\s\S]*(?:['"]mean['"]|mean\s*:)[\s\S]*(?:['"]min['"]|min\s*:)[\s\S]*(?:['"]max['"]|max\s*:)[\s\S]*\}/m.test(
      code
    ) ||
    (
      /\bmean\b/.test(code) &&
      /\bmin\b/.test(code) &&
      /\bmax\b/.test(code) &&
      /\breturn\b/.test(code)
    )

  const checks = [
    createCheck(
      'summarize_data implementation',
      functionDefined,
      'Implement summarize_data.'
    ),

    createCheck(
      'Remove None values',
      removesNone,
      'Remove None values before calculations.'
    ),

    createCheck(
      'Mean calculation',
      mean,
      'Calculate the mean of valid values.'
    ),

    createCheck(
      'Minimum and maximum',
      minMax,
      'Calculate minimum and maximum values.'
    ),

    createCheck(
      'Dictionary result',
      dictionary,
      'Return mean, min, and max as a dictionary.'
    ),
  ]

  return finishEvaluation(
    'data-scientist',
    checks,
    passingScore
  )
}


// ============================================================
// DEVOPS ENGINEER
// ============================================================

function evaluateDevOps(
  submittedCode,
  passingScore
) {
  const code =
    normalizeCode(submittedCode)

  const withoutComments =
    code
      .split('\n')
      .filter(
        (line) =>
          !line.trim().startsWith('#')
      )
      .join('\n')

  const baseImage =
    /^\s*FROM\s+node(?::[^\s]+)?/im.test(
      withoutComments
    )

  const workdir =
    /^\s*WORKDIR\s+\S+/im.test(
      withoutComments
    )

  const dependencyCopy =
    /^\s*COPY\s+.*package(?:-lock)?\.json/im.test(
      withoutComments
    ) ||
    /^\s*COPY\s+package\*\.json/im.test(
      withoutComments
    )

  const install =
    /^\s*RUN\s+(?:npm\s+(?:ci|install)|yarn\s+install|pnpm\s+install)/im.test(
      withoutComments
    )

  const sourceAndStart =
    /^\s*COPY\s+\.\s+/im.test(
      withoutComments
    ) &&
    /^\s*(?:CMD|ENTRYPOINT)\s+/im.test(
      withoutComments
    )

  return finishEvaluation(
    'devops-engineer',
    [
      createCheck(
        'Node.js base image',
        baseImage,
        'Use an appropriate Node.js base image.'
      ),

      createCheck(
        'Working directory',
        workdir,
        'Set the application working directory.'
      ),

      createCheck(
        'Dependency files',
        dependencyCopy,
        'Copy dependency files before installation.'
      ),

      createCheck(
        'Install dependencies',
        install,
        'Install application dependencies.'
      ),

      createCheck(
        'Application source and startup',
        sourceAndStart,
        'Copy application source and define a startup command.'
      ),
    ],
    passingScore
  )
}


// ============================================================
// CLOUD ENGINEER
// ============================================================

function evaluateCloud(
  submittedCode,
  passingScore
) {
  const code =
    stripComments(submittedCode)

  const provider =
    /required_providers\s*\{[\s\S]+?\}/m.test(
      code
    ) &&
    (
      /\bsource\s*=/.test(code) ||
      /\bprovider\s+["'][^"']+["']/.test(
        code
      )
    )

  const resource =
    /\bresource\s+["'][^"']+["']\s+["'][^"']+["']\s*\{/m.test(
      code
    )

  const variables =
    /\bvariable\s+["'][^"']+["']\s*\{/m.test(
      code
    ) ||
    /\bvar\.[A-Za-z0-9_]+/.test(
      code
    )

  const tags =
    /\btags\s*=\s*\{/m.test(
      code
    )

  const reusable =
    (
      /\bvariable\s+["'][^"']+["']/.test(
        code
      ) ||
      /\blocals\s*\{/.test(code)
    ) &&
    /\bresource\s+/.test(code)

  return finishEvaluation(
    'cloud-engineer',
    [
      createCheck(
        'Provider configuration',
        provider,
        'Define the required Terraform provider.'
      ),

      createCheck(
        'Infrastructure resource',
        resource,
        'Configure at least one infrastructure resource.'
      ),

      createCheck(
        'Variables',
        variables,
        'Use variables where appropriate.'
      ),

      createCheck(
        'Resource tags',
        tags,
        'Add meaningful resource tags.'
      ),

      createCheck(
        'Reusable configuration',
        reusable,
        'Keep the configuration reusable.'
      ),
    ],
    passingScore
  )
}


// ============================================================
// QA ENGINEER
// ============================================================

function evaluateQa(
  submittedCode,
  passingScore
) {
  const code =
    stripComments(submittedCode)

  const testBlocks =
    code.match(
      /\b(?:it|test)\s*\(/g
    ) || []

  const validInput =
    /valid/i.test(code) &&
    testBlocks.length >= 1

  const invalidInput =
    /invalid|missing|required/i.test(
      code
    ) &&
    testBlocks.length >= 2

  const boundary =
    /boundary|empty|null|undefined|length|minimum|maximum|min|max/i.test(
      code
    )

  const focusedTests =
    testBlocks.length >= 3

  const assertions =
    /\bexpect\s*\(/.test(code) &&
    /\.to[A-Z]\w*\s*\(/.test(
      code
    )

  return finishEvaluation(
    'qa-engineer',
    [
      createCheck(
        'Valid input test',
        validInput,
        'Create a test for valid input.'
      ),

      createCheck(
        'Invalid input test',
        invalidInput,
        'Create a test for invalid input.'
      ),

      createCheck(
        'Boundary case',
        boundary,
        'Include at least one boundary case.'
      ),

      createCheck(
        'Focused test cases',
        focusedTests,
        'Keep individual tests focused on behavior.'
      ),

      createCheck(
        'Assertions',
        assertions,
        'Make assertions against expected results.'
      ),
    ],
    passingScore
  )
}


// ============================================================
// FULL STACK ENGINEER
// ============================================================

function evaluateFullStack(
  submittedCode,
  passingScore
) {
  const code =
    stripComments(submittedCode)

  const createTask =
    /function\s+createTask\s*\(\s*tasks\s*,\s*title\s*\)\s*\{[\s\S]+?\}/m.test(
      code
    )

  const titleValidation =
    /(?:!\s*title(?:\.trim\s*\(\s*\))?|title(?:\.trim\s*\(\s*\))?\s*===?\s*['"]{2}|title\.trim\s*\(\s*\)\.length\s*===?\s*0)/m.test(
      code
    )

  const updateTask =
    /function\s+updateTask\s*\(\s*tasks\s*,\s*taskId\s*,\s*updates\s*\)\s*\{[\s\S]+?\}/m.test(
      code
    ) &&
    /taskId/.test(code)

  const deleteTask =
    /function\s+deleteTask\s*\(\s*tasks\s*,\s*taskId\s*\)\s*\{[\s\S]+?\}/m.test(
      code
    ) &&
    (
      /\.filter\s*\(/.test(code) ||
      /\.splice\s*\(/.test(code)
    )

  const predictableInvalidId =
    /\bnull\b/.test(code) ||
    /\bfalse\b/.test(code) ||
    /\.findIndex\s*\(/.test(code) ||
    /\.some\s*\(/.test(code) ||
    /\.find\s*\(/.test(code)

  return finishEvaluation(
    'full-stack-engineer',
    [
      createCheck(
        'createTask implementation',
        createTask,
        'Implement createTask.'
      ),

      createCheck(
        'Task title validation',
        titleValidation,
        'Validate the task title.'
      ),

      createCheck(
        'updateTask implementation',
        updateTask,
        'Implement updateTask.'
      ),

      createCheck(
        'deleteTask implementation',
        deleteTask,
        'Implement deleteTask.'
      ),

      createCheck(
        'Invalid id handling',
        predictableInvalidId,
        'Return predictable results for invalid task ids.'
      ),
    ],
    passingScore
  )
}


// ============================================================
// PUBLIC EVALUATOR
// ============================================================

function evaluatePracticalChallenge({
  roleSlug,
  submittedCode,
  passingScore = 70,
}) {
  const normalizedPassingScore =
    Number.isFinite(
      Number(passingScore)
    )
      ? Number(passingScore)
      : 70

  switch (roleSlug) {
    case 'frontend-engineer':
      return evaluateFrontend(
        submittedCode,
        normalizedPassingScore
      )

    case 'backend-engineer':
      return evaluateBackend(
        submittedCode,
        normalizedPassingScore
      )

    case 'data-analyst':
      return evaluateDataAnalyst(
        submittedCode,
        normalizedPassingScore
      )

    case 'data-scientist':
      return evaluateDataScientist(
        submittedCode,
        normalizedPassingScore
      )

    case 'devops-engineer':
      return evaluateDevOps(
        submittedCode,
        normalizedPassingScore
      )

    case 'cloud-engineer':
      return evaluateCloud(
        submittedCode,
        normalizedPassingScore
      )

    case 'qa-engineer':
      return evaluateQa(
        submittedCode,
        normalizedPassingScore
      )

    case 'full-stack-engineer':
      return evaluateFullStack(
        submittedCode,
        normalizedPassingScore
      )

    default:
      throw new Error(
        `No evaluator configured for role: ${roleSlug}`
      )
  }
}


module.exports = {
  evaluatePracticalChallenge,
}
