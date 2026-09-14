export interface QuizQuestion {
  question: string
  options: string[]
  correctAnswer: number
}

export interface TopicQuiz {
  title: string
  passingScore: number
  questions: QuizQuestion[]
}

function createQuiz(
  title: string,
  questions: QuizQuestion[]
): TopicQuiz {
  return {
    title,
    passingScore: 70,
    questions,
  }
}

export const topicQuizData: Record<
  string,
  TopicQuiz
> = {
  /*
  |--------------------------------------------------------------------------
  | DEVOPS ENGINEER
  |--------------------------------------------------------------------------
  */

  'devops-engineer/linux-fundamentals':
    createQuiz(
      'Linux Fundamentals Quiz',
      [
        {
          question:
            'Which directory usually contains user home directories in Linux?',
          options: [
            '/home',
            '/etc',
            '/var',
            '/bin',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which command displays the current working directory?',
          options: [
            'ls',
            'pwd',
            'cd',
            'mkdir',
          ],
          correctAnswer: 1,
        },
        {
          question:
            'Which command changes file permissions?',
          options: [
            'chmod',
            'grep',
            'touch',
            'pwd',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does PID mean in Linux?',
          options: [
            'Process Identifier',
            'Package Install Directory',
            'Permission Identifier',
            'Program Input Data',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which package manager is commonly used by Ubuntu?',
          options: [
            'apt',
            'npm',
            'pip',
            'docker',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'devops-engineer/networking-fundamentals':
    createQuiz(
      'Networking Fundamentals Quiz',
      [
        {
          question:
            'What is the main purpose of DNS?',
          options: [
            'Translate domain names into IP addresses',
            'Store source code',
            'Build containers',
            'Create Linux users',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which protocol provides reliable connection-oriented communication?',
          options: [
            'TCP',
            'UDP',
            'DNS',
            'ARP',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which protocol is commonly used for secure web traffic?',
          options: [
            'HTTPS',
            'HTTP',
            'FTP',
            'Telnet',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a firewall primarily used for?',
          options: [
            'Controlling network traffic',
            'Creating databases',
            'Compiling programs',
            'Managing Git commits',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which command can test connectivity to another host?',
          options: [
            'ping',
            'mkdir',
            'chmod',
            'touch',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'devops-engineer/git-github':
    createQuiz(
      'Git & GitHub Quiz',
      [
        {
          question:
            'Which command initializes a Git repository?',
          options: [
            'git init',
            'git start',
            'git open',
            'git new',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which command stages changes?',
          options: [
            'git add',
            'git push',
            'git pull',
            'git branch',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which command records staged changes?',
          options: [
            'git commit',
            'git fetch',
            'git clone',
            'git status',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why are Git branches useful?',
          options: [
            'They provide independent lines of development',
            'They install dependencies',
            'They create databases',
            'They host virtual machines',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a pull request mainly used for?',
          options: [
            'Reviewing changes before merging',
            'Deleting a repository',
            'Installing Git',
            'Running containers',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'devops-engineer/docker':
    createQuiz(
      'Docker & Containers Quiz',
      [
        {
          question:
            'What is a Docker image?',
          options: [
            'A template used to create containers',
            'A running container',
            'A physical server',
            'A Git branch',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a Docker container?',
          options: [
            'A running instance of an image',
            'A source repository',
            'A DNS server',
            'A database query',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which file defines instructions for building an image?',
          options: [
            'Dockerfile',
            'package.json',
            'index.html',
            'README.md',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What are Docker volumes primarily used for?',
          options: [
            'Persistent data',
            'Source control',
            'DNS resolution',
            'User authentication',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does Docker Compose help manage?',
          options: [
            'Multi-container applications',
            'Git branches',
            'SQL tables',
            'Linux users',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'devops-engineer/kubernetes':
    createQuiz(
      'Kubernetes Quiz',
      [
        {
          question:
            'What is the smallest deployable Kubernetes unit?',
          options: [
            'Pod',
            'Cluster',
            'Node',
            'Namespace',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which object commonly manages application replicas?',
          options: [
            'Deployment',
            'Secret',
            'ConfigMap',
            'Namespace',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does a Kubernetes Service provide?',
          options: [
            'Stable network access to pods',
            'Source control',
            'Database migrations',
            'Linux package management',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a ConfigMap intended to contain?',
          options: [
            'Non-sensitive configuration',
            'Container images',
            'Git commits',
            'Virtual machines',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which object should contain sensitive configuration?',
          options: [
            'Secret',
            'Service',
            'Pod',
            'ReplicaSet',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'devops-engineer/cicd':
    createQuiz(
      'CI/CD Quiz',
      [
        {
          question:
            'What is Continuous Integration?',
          options: [
            'Frequently merging and automatically validating code',
            'Deploying only manually',
            'Avoiding source control',
            'Replacing testing',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why are automated tests included in CI?',
          options: [
            'To detect problems early',
            'To create DNS records',
            'To replace Git',
            'To create user accounts',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which GitHub feature runs automated workflows?',
          options: [
            'GitHub Actions',
            'GitHub Issues',
            'GitHub Discussions',
            'GitHub Stars',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a deployment pipeline?',
          options: [
            'Automated build, test, and deployment stages',
            'A database table',
            'A Linux directory',
            'A firewall',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does Continuous Delivery aim to achieve?',
          options: [
            'Keep software ready for deployment',
            'Disable testing',
            'Remove version control',
            'Prevent releases',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'devops-engineer/aws':
    createQuiz(
      'AWS Quiz',
      [
        {
          question:
            'Which AWS service provides virtual servers?',
          options: [
            'EC2',
            'S3',
            'RDS',
            'IAM',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which AWS service provides object storage?',
          options: [
            'S3',
            'EC2',
            'VPC',
            'IAM',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does IAM manage?',
          options: [
            'Identity and permissions',
            'Object storage',
            'Virtual disks',
            'DNS caching',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which AWS service provides managed relational databases?',
          options: [
            'RDS',
            'S3',
            'IAM',
            'CloudFront',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is CloudWatch mainly used for?',
          options: [
            'Monitoring and logs',
            'Source control',
            'Container building',
            'Code editing',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'devops-engineer/terraform':
    createQuiz(
      'Terraform Quiz',
      [
        {
          question:
            'What is Terraform primarily used for?',
          options: [
            'Infrastructure as Code',
            'Frontend styling',
            'Database querying',
            'Browser testing',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a Terraform provider?',
          options: [
            'A plugin for interacting with a platform',
            'A Git branch',
            'A container image',
            'A Linux process',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does a Terraform resource describe?',
          options: [
            'An infrastructure object',
            'A CSS style',
            'A test assertion',
            'A Git commit',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does Terraform state track?',
          options: [
            'Managed infrastructure',
            'User passwords',
            'Application source code',
            'Docker image layers only',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why are Terraform modules useful?',
          options: [
            'They provide reusable infrastructure configuration',
            'They replace cloud providers',
            'They replace Git',
            'They compile JavaScript',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'devops-engineer/monitoring':
    createQuiz(
      'Monitoring Quiz',
      [
        {
          question:
            'What is a metric?',
          options: [
            'A numerical measurement over time',
            'A source file',
            'A Git branch',
            'A Docker image',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What do application logs record?',
          options: [
            'Application events and behavior',
            'DNS domains only',
            'Container images',
            'Git passwords',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is Prometheus commonly used for?',
          options: [
            'Metrics collection and querying',
            'Source control',
            'Database design',
            'CSS styling',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is Grafana commonly used for?',
          options: [
            'Dashboards and visualization',
            'Package installation',
            'Git branching',
            'Compiling applications',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is the purpose of monitoring alerts?',
          options: [
            'Notify teams when defined conditions occur',
            'Store source code',
            'Build containers',
            'Create databases',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'devops-engineer/devops-project':
    createQuiz(
      'DevOps Project Assessment',
      [
        {
          question:
            'Which practice makes infrastructure reproducible?',
          options: [
            'Infrastructure as Code',
            'Manual undocumented changes',
            'Disabling source control',
            'Editing production only',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which sequence best represents a delivery pipeline?',
          options: [
            'Build, test, and deploy',
            'Deploy, ignore testing, delete source',
            'Delete, test, build',
            'Monitor, uninstall, delete',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should secrets be separated from application source code?',
          options: [
            'To reduce exposure of sensitive information',
            'To disable deployment',
            'To replace testing',
            'To eliminate networking',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should monitoring provide after deployment?',
          options: [
            'Visibility into system health',
            'Source code compilation',
            'Git branching',
            'Database schema creation',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which practice improves production reliability?',
          options: [
            'Automated testing and controlled deployment',
            'Untracked production changes',
            'Disabling monitoring',
            'Skipping validation',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  /*
  |--------------------------------------------------------------------------
  | FRONTEND ENGINEER
  |--------------------------------------------------------------------------
  */

  'frontend-engineer/html-css':
    createQuiz(
      'HTML & CSS Quiz',
      [
        {
          question:
            'Which HTML element represents the main heading?',
          options: [
            '<h1>',
            '<p>',
            '<span>',
            '<div>',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is semantic HTML?',
          options: [
            'Using elements that describe their meaning',
            'Using only div elements',
            'Removing CSS',
            'Writing JavaScript inside CSS',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which CSS property controls spacing inside an element?',
          options: [
            'padding',
            'margin',
            'display',
            'position',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which CSS layout system is one-dimensional?',
          options: [
            'Flexbox',
            'Grid',
            'Tables',
            'Absolute positioning',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What are media queries primarily used for?',
          options: [
            'Responsive design',
            'Database access',
            'Server authentication',
            'Package installation',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'frontend-engineer/javascript':
    createQuiz(
      'JavaScript Quiz',
      [
        {
          question:
            'Which keyword declares a block-scoped variable that can be reassigned?',
          options: [
            'let',
            'const',
            'class',
            'import',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which array method adds an item to the end of an array?',
          options: [
            'push',
            'pop',
            'shift',
            'slice',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does DOM stand for?',
          options: [
            'Document Object Model',
            'Data Object Manager',
            'Document Output Method',
            'Dynamic Operation Model',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does async/await simplify?',
          options: [
            'Working with asynchronous operations',
            'Writing CSS',
            'Creating HTML tables',
            'Managing SQL databases',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is fetch commonly used for?',
          options: [
            'Making HTTP requests',
            'Styling elements',
            'Creating Git branches',
            'Compiling TypeScript',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'frontend-engineer/git-github':
    createQuiz(
      'Frontend Git & GitHub Quiz',
      [
        {
          question:
            'Which Git command shows repository status?',
          options: [
            'git status',
            'git add',
            'git push',
            'git merge',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does git clone do?',
          options: [
            'Copies a repository locally',
            'Deletes a branch',
            'Creates CSS',
            'Runs JavaScript',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does git add do?',
          options: [
            'Stages changes',
            'Publishes a website',
            'Creates a database',
            'Runs tests automatically',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does git pull normally do?',
          options: [
            'Fetches and integrates remote changes',
            'Deletes the remote repository',
            'Creates HTML',
            'Installs Node.js',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why are pull requests useful?',
          options: [
            'They allow code review before merging',
            'They replace Git commits',
            'They host databases',
            'They create CSS files',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'frontend-engineer/react':
    createQuiz(
      'React Quiz',
      [
        {
          question:
            'What is a React component?',
          options: [
            'A reusable piece of UI',
            'A database table',
            'A Linux process',
            'A Git repository',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What are props used for?',
          options: [
            'Passing data into components',
            'Creating databases',
            'Installing packages',
            'Starting servers',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does useState manage?',
          options: [
            'Component state',
            'Git history',
            'Server DNS',
            'CSS compilation',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is React Router used for?',
          options: [
            'Client-side navigation',
            'Database queries',
            'Linux networking',
            'Docker images',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does useEffect commonly handle?',
          options: [
            'Side effects',
            'HTML headings',
            'CSS selectors',
            'Git merges',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'frontend-engineer/typescript':
    createQuiz(
      'TypeScript Quiz',
      [
        {
          question:
            'What does TypeScript add to JavaScript?',
          options: [
            'Static type checking',
            'Database storage',
            'Browser routing',
            'Operating system commands',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which type represents true or false values?',
          options: [
            'boolean',
            'string',
            'number',
            'unknown[]',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What can an interface describe?',
          options: [
            'The shape of an object',
            'A Git branch',
            'A Docker volume',
            'A database server',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a generic useful for?',
          options: [
            'Creating reusable type-safe code',
            'Styling HTML',
            'Creating DNS records',
            'Starting containers',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which syntax marks a property as optional?',
          options: [
            '?',
            '!',
            '#',
            '&',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'frontend-engineer/frontend-apis':
    createQuiz(
      'Frontend APIs Quiz',
      [
        {
          question:
            'Which HTTP method normally retrieves data?',
          options: [
            'GET',
            'POST',
            'DELETE',
            'PATCH',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which HTTP method is commonly used to create a resource?',
          options: [
            'POST',
            'GET',
            'HEAD',
            'OPTIONS',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does REST commonly use for communication?',
          options: [
            'HTTP methods and resources',
            'CSS selectors',
            'Linux users',
            'Git branches',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is Axios?',
          options: [
            'An HTTP client library',
            'A CSS framework',
            'A database',
            'A programming language',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does HTTP status code 404 indicate?',
          options: [
            'Resource not found',
            'Successful request',
            'Created resource',
            'Unauthorized request only',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'frontend-engineer/frontend-testing':
    createQuiz(
      'Frontend Testing Quiz',
      [
        {
          question:
            'What does a unit test usually test?',
          options: [
            'A small isolated unit of behavior',
            'An entire production network',
            'A DNS server only',
            'A cloud account',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is React Testing Library designed to test?',
          options: [
            'React UI behavior',
            'Linux permissions',
            'Docker networks',
            'SQL indexes',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is mocking used for in tests?',
          options: [
            'Replacing dependencies with controlled substitutes',
            'Deleting source code',
            'Deploying applications',
            'Creating CSS',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does an end-to-end test validate?',
          options: [
            'A complete user workflow',
            'Only one function',
            'Only CSS syntax',
            'Only Git history',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should automated tests be repeatable?',
          options: [
            'So they produce reliable results under the same conditions',
            'So they require random manual changes',
            'So they replace source control',
            'So they prevent deployment',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'frontend-engineer/frontend-project':
    createQuiz(
      'Frontend Project Assessment',
      [
        {
          question:
            'Which approach best supports reusable frontend code?',
          options: [
            'Reusable components',
            'Duplicating every page',
            'Avoiding functions',
            'Removing source control',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should responsive design accomplish?',
          options: [
            'Adapt layouts to different screen sizes',
            'Disable mobile users',
            'Replace JavaScript',
            'Remove HTML semantics',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'How should API errors normally be handled in a UI?',
          options: [
            'Display appropriate feedback and preserve application stability',
            'Crash the application',
            'Ignore every error',
            'Delete local source code',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What improves frontend maintainability?',
          options: [
            'Clear component structure and consistent patterns',
            'Duplicating code everywhere',
            'Avoiding naming conventions',
            'Removing tests',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should a frontend project be tested before deployment?',
          options: [
            'To catch defects before users encounter them',
            'To remove Git history',
            'To disable routing',
            'To replace the browser',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  /*
  |--------------------------------------------------------------------------
  | BACKEND ENGINEER
  |--------------------------------------------------------------------------
  */

  'backend-engineer/programming-fundamentals':
    createQuiz(
      'Programming Fundamentals Quiz',
      [
        {
          question:
            'What is a variable?',
          options: [
            'A named value stored by a program',
            'A database server',
            'A network protocol',
            'A CSS selector',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a conditional used for?',
          options: [
            'Choosing behavior based on a condition',
            'Installing packages',
            'Creating containers',
            'Managing DNS',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a loop used for?',
          options: [
            'Repeating operations',
            'Defining CSS colors',
            'Creating cloud accounts',
            'Changing Git remotes',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why are functions useful?',
          options: [
            'They package reusable behavior',
            'They create physical servers',
            'They replace variables',
            'They disable errors',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is an array primarily used to store?',
          options: [
            'A collection of values',
            'Only one boolean',
            'A DNS zone',
            'A Git repository',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'backend-engineer/nodejs':
    createQuiz(
      'Node.js Quiz',
      [
        {
          question:
            'What is Node.js?',
          options: [
            'A JavaScript runtime',
            'A relational database',
            'A CSS framework',
            'A browser extension',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is npm commonly used for?',
          options: [
            'Managing JavaScript packages',
            'Creating SQL tables',
            'Managing Linux users',
            'Editing DNS',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is Express?',
          options: [
            'A Node.js web framework',
            'A database engine',
            'A cloud region',
            'A CSS language',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is asynchronous programming useful for?',
          options: [
            'Handling operations without unnecessarily blocking execution',
            'Creating CSS selectors',
            'Managing Git tags only',
            'Changing HTML colors',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which built-in Node.js module works with files?',
          options: [
            'fs',
            'css',
            'sql',
            'git',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'backend-engineer/rest-api':
    createQuiz(
      'REST API Quiz',
      [
        {
          question:
            'Which HTTP method normally retrieves a resource?',
          options: [
            'GET',
            'POST',
            'DELETE',
            'PATCH',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which status code commonly represents success?',
          options: [
            '200',
            '404',
            '500',
            '401',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does request validation do?',
          options: [
            'Checks whether incoming data meets requirements',
            'Builds CSS',
            'Creates Docker images',
            'Changes Git history',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a REST resource commonly identified by?',
          options: [
            'A URL',
            'A CSS class',
            'A Linux PID',
            'A Docker layer',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should APIs return appropriate status codes?',
          options: [
            'To communicate request outcomes clearly',
            'To replace JSON',
            'To remove security',
            'To avoid HTTP',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'backend-engineer/databases':
    createQuiz(
      'Databases Quiz',
      [
        {
          question:
            'What does SQL stand for?',
          options: [
            'Structured Query Language',
            'Simple Queue Logic',
            'System Query Layer',
            'Structured Quick List',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does a primary key do?',
          options: [
            'Uniquely identifies a row',
            'Styles a table',
            'Encrypts HTTP',
            'Starts a server',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a JOIN used for?',
          options: [
            'Combining related rows from tables',
            'Creating CSS',
            'Running containers',
            'Managing Git',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is an index commonly used for?',
          options: [
            'Improving lookup performance',
            'Replacing a database',
            'Creating API routes',
            'Deploying servers',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does a database transaction help provide?',
          options: [
            'A controlled unit of database work',
            'Frontend routing',
            'DNS resolution',
            'CSS inheritance',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'backend-engineer/authentication':
    createQuiz(
      'Authentication Quiz',
      [
        {
          question:
            'What is authentication?',
          options: [
            'Verifying identity',
            'Choosing CSS colors',
            'Creating database indexes',
            'Building containers',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is authorization?',
          options: [
            'Determining what an authenticated user may do',
            'Verifying a domain name',
            'Creating an HTML page',
            'Installing Node.js',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should passwords be hashed?',
          options: [
            'To avoid storing passwords in readable form',
            'To make them public',
            'To replace authentication',
            'To create sessions',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What can a JWT commonly carry?',
          options: [
            'Signed claims about a user or session',
            'CSS styles',
            'Docker image layers',
            'Database files',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is least privilege?',
          options: [
            'Granting only permissions needed',
            'Giving every user administrator access',
            'Removing authentication',
            'Sharing passwords',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'backend-engineer/backend-testing':
    createQuiz(
      'Backend Testing Quiz',
      [
        {
          question:
            'What does a unit test target?',
          options: [
            'A small isolated part of the application',
            'An entire production data center',
            'Only CSS',
            'Only DNS',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does an integration test examine?',
          options: [
            'How multiple components work together',
            'Only one constant',
            'Only HTML markup',
            'Only Git configuration',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should API tests verify?',
          options: [
            'Requests, responses, and expected behavior',
            'CSS animation only',
            'Physical hardware',
            'Git branch names only',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why use mocks?',
          options: [
            'To isolate or control dependencies',
            'To deploy production servers',
            'To create DNS',
            'To replace all tests',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should tests run automatically in CI?',
          options: [
            'To detect regressions consistently',
            'To remove source control',
            'To disable deployments',
            'To delete databases',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'backend-engineer/backend-deployment':
    createQuiz(
      'Backend Deployment Quiz',
      [
        {
          question:
            'Why are environment variables commonly used?',
          options: [
            'To configure applications without hardcoding environment-specific values',
            'To replace functions',
            'To create CSS',
            'To disable servers',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should production logging be enabled?',
          options: [
            'To help diagnose application behavior and failures',
            'To replace testing',
            'To expose secrets',
            'To delete errors',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a production build?',
          options: [
            'A build prepared for deployment',
            'A Git branch only',
            'A database table',
            'A CSS selector',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should secrets not be committed to source control?',
          options: [
            'They could be exposed to unauthorized users',
            'Git cannot store text',
            'It prevents CSS from loading',
            'It disables JavaScript',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should happen after deployment?',
          options: [
            'Monitor the service and verify health',
            'Delete all logs',
            'Disable testing permanently',
            'Remove authentication',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'backend-engineer/backend-project':
    createQuiz(
      'Backend Project Assessment',
      [
        {
          question:
            'What should API input be checked with?',
          options: [
            'Validation',
            'CSS',
            'Git tags',
            'DNS records',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Where should sensitive passwords normally be stored?',
          options: [
            'As secure password hashes',
            'As plain text',
            'Inside frontend HTML',
            'Inside public URLs',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should a backend separate routes and business logic?',
          options: [
            'To improve maintainability',
            'To prevent HTTP requests',
            'To remove tests',
            'To disable databases',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should happen when an unexpected server error occurs?',
          options: [
            'Log it and return an appropriate error response',
            'Expose every internal secret',
            'Crash silently with no logging',
            'Delete the database',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why test the backend before deployment?',
          options: [
            'To detect defects and regressions',
            'To remove source control',
            'To eliminate authentication',
            'To replace deployment',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  /*
  |--------------------------------------------------------------------------
  | FULL STACK ENGINEER
  |--------------------------------------------------------------------------
  */

  'full-stack-engineer/web-fundamentals':
    createQuiz(
      'Web Fundamentals Quiz',
      [
        {
          question:
            'What protocol is commonly used to transfer web resources?',
          options: [
            'HTTP',
            'SQL',
            'SSH only',
            'Git',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does HTML define?',
          options: [
            'Page structure and content',
            'Database relationships',
            'Cloud permissions',
            'Linux packages',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does CSS primarily control?',
          options: [
            'Presentation and layout',
            'Database queries',
            'Server processes',
            'Git history',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does JavaScript commonly add to web pages?',
          options: [
            'Behavior and interactivity',
            'Physical networking',
            'Database indexes only',
            'Linux permissions',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What are browser developer tools useful for?',
          options: [
            'Inspecting and debugging web applications',
            'Creating cloud accounts',
            'Replacing servers',
            'Formatting disks',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'full-stack-engineer/javascript':
    createQuiz(
      'Full Stack JavaScript Quiz',
      [
        {
          question:
            'Which keyword creates a constant binding?',
          options: [
            'const',
            'varies',
            'fixed',
            'define',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a Promise?',
          options: [
            'An object representing a future asynchronous result',
            'A CSS selector',
            'A database table',
            'A Git branch',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does JSON.parse do?',
          options: [
            'Converts JSON text into a JavaScript value',
            'Creates CSS',
            'Starts Node.js',
            'Creates Git commits',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does the DOM represent?',
          options: [
            'The document as programmable objects',
            'A cloud provider',
            'A SQL engine',
            'A package manager',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is fetch used for?',
          options: [
            'Making network requests',
            'Creating HTML headings',
            'Writing CSS rules',
            'Managing Git branches',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'full-stack-engineer/react':
    createQuiz(
      'Full Stack React Quiz',
      [
        {
          question:
            'What does component state represent?',
          options: [
            'Data that may change and affect rendering',
            'Database schema',
            'Linux users',
            'Git configuration',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What are props?',
          options: [
            'Inputs passed to a component',
            'Server logs',
            'Database indexes',
            'Docker volumes',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a React hook?',
          options: [
            'A function that provides React features to function components',
            'A database table',
            'A Linux package',
            'A cloud server',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why use client-side routing?',
          options: [
            'To navigate views without full page reloads',
            'To create database indexes',
            'To replace CSS',
            'To manage Linux packages',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should list elements have stable keys?',
          options: [
            'To help React identify items between renders',
            'To encrypt API traffic',
            'To build Docker images',
            'To create SQL joins',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'full-stack-engineer/nodejs':
    createQuiz(
      'Full Stack Node.js Quiz',
      [
        {
          question:
            'What environment runs Node.js applications?',
          options: [
            'A JavaScript runtime outside the browser',
            'A CSS processor only',
            'A SQL table',
            'A Git repository',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does Express middleware do?',
          options: [
            'Processes requests during the request-response cycle',
            'Creates CSS animations',
            'Builds Git branches',
            'Formats disks',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is an API route?',
          options: [
            'An endpoint handling a request',
            'A CSS selector',
            'A Linux user',
            'A database column only',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why use asynchronous database calls?',
          options: [
            'To avoid unnecessarily blocking other work',
            'To remove databases',
            'To disable APIs',
            'To create CSS',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should error-handling middleware do?',
          options: [
            'Handle and format application errors',
            'Delete Git repositories',
            'Create HTML headings',
            'Manage DNS',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'full-stack-engineer/database':
    createQuiz(
      'Full Stack Database Quiz',
      [
        {
          question:
            'What does a database table contain?',
          options: [
            'Rows and columns',
            'CSS rules',
            'Git branches',
            'Docker images',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a foreign key used for?',
          options: [
            'Relating records between tables',
            'Encrypting passwords',
            'Building UI components',
            'Installing packages',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does SELECT do in SQL?',
          options: [
            'Retrieves data',
            'Deletes a database server',
            'Creates CSS',
            'Runs JavaScript',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does an index help improve?',
          options: [
            'Query lookup performance',
            'HTML semantics',
            'CSS animations',
            'Git merge conflicts',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a transaction?',
          options: [
            'A logical unit of database operations',
            'A React component',
            'A Git branch',
            'A Linux process',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'full-stack-engineer/authentication':
    createQuiz(
      'Full Stack Authentication Quiz',
      [
        {
          question:
            'What does login authentication verify?',
          options: [
            'User identity',
            'CSS syntax',
            'Database indexes',
            'Git branches',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should passwords be hashed?',
          options: [
            'To protect stored credentials',
            'To make them easier to read',
            'To replace HTTPS',
            'To disable sessions',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is authorization used for?',
          options: [
            'Controlling access to actions or resources',
            'Creating CSS',
            'Running Docker builds',
            'Creating SQL tables',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a session?',
          options: [
            'Server or client-associated state representing an authenticated interaction',
            'A CSS rule',
            'A Git tag',
            'A database index',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should authenticated routes be protected?',
          options: [
            'To prevent unauthorized access',
            'To remove all API calls',
            'To disable navigation',
            'To delete user accounts',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'full-stack-engineer/deployment':
    createQuiz(
      'Full Stack Deployment Quiz',
      [
        {
          question:
            'What is deployment?',
          options: [
            'Making an application available in a target environment',
            'Writing only CSS',
            'Deleting source code',
            'Creating a variable',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why use environment variables?',
          options: [
            'To configure environment-specific values',
            'To replace Git',
            'To remove servers',
            'To create HTML headings',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should production builds be optimized?',
          options: [
            'To improve performance and delivery efficiency',
            'To increase unnecessary files',
            'To disable caching',
            'To remove security',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should be checked after deployment?',
          options: [
            'Application health and functionality',
            'Only Git branch names',
            'Only CSS comments',
            'Nothing',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should secrets be kept out of public frontend code?',
          options: [
            'Frontend code can be inspected by users',
            'Browsers cannot run JavaScript',
            'CSS blocks all secrets',
            'Git requires secrets',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'full-stack-engineer/full-stack-project':
    createQuiz(
      'Full Stack Project Assessment',
      [
        {
          question:
            'Which architecture separates frontend and backend responsibilities?',
          options: [
            'Client-server architecture',
            'CSS-only architecture',
            'Git-only architecture',
            'DNS-only architecture',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should validate API input?',
          options: [
            'Backend validation',
            'Only CSS',
            'Only the browser title',
            'Only Git',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should the frontend handle loading states?',
          options: [
            'To communicate asynchronous progress to users',
            'To replace APIs',
            'To remove the backend',
            'To disable navigation',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should both frontend and backend be tested?',
          options: [
            'They contain different behaviors that can fail',
            'Testing only changes colors',
            'Testing replaces deployment',
            'Testing removes authentication',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should be monitored after deploying a full-stack application?',
          options: [
            'Client and server errors plus service health',
            'Only source file names',
            'Only CSS indentation',
            'Nothing after deployment',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  /*
  |--------------------------------------------------------------------------
  | DATA ANALYST
  |--------------------------------------------------------------------------
  */

  'data-analyst/excel':
    createQuiz(
      'Excel Quiz',
      [
        {
          question:
            'What does a spreadsheet formula normally begin with?',
          options: [
            '=',
            '#',
            '@',
            '&',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which Excel function calculates an average?',
          options: [
            'AVERAGE',
            'COUNTIF',
            'MAXIMUM',
            'ORDER',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does filtering data do?',
          options: [
            'Shows rows meeting selected criteria',
            'Deletes the workbook',
            'Changes all formulas',
            'Creates a server',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why is data cleaning important?',
          options: [
            'It improves data quality before analysis',
            'It creates cloud infrastructure',
            'It replaces formulas',
            'It disables charts',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What are charts useful for?',
          options: [
            'Visualizing data patterns',
            'Creating Git commits',
            'Running APIs',
            'Managing Linux users',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-analyst/sql':
    createQuiz(
      'Data Analyst SQL Quiz',
      [
        {
          question:
            'Which SQL statement retrieves rows?',
          options: [
            'SELECT',
            'UPDATE',
            'DELETE',
            'DROP',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which clause filters rows?',
          options: [
            'WHERE',
            'ORDER BY',
            'GROUP BY',
            'JOIN',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which function counts rows?',
          options: [
            'COUNT',
            'SUM',
            'JOIN',
            'SELECT',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does GROUP BY do?',
          options: [
            'Groups rows for aggregate calculations',
            'Deletes grouped data',
            'Creates CSS',
            'Creates Git branches',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a window function useful for?',
          options: [
            'Calculations across related rows while retaining row detail',
            'Deleting tables',
            'Building websites',
            'Managing cloud permissions',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-analyst/python-data':
    createQuiz(
      'Python for Data Quiz',
      [
        {
          question:
            'Which Python structure stores key-value pairs?',
          options: [
            'dictionary',
            'list only',
            'tuple only',
            'string',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is NumPy commonly used for?',
          options: [
            'Numerical array operations',
            'Web page styling',
            'Git hosting',
            'Cloud authentication',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is pandas mainly used for?',
          options: [
            'Working with structured data',
            'Creating Docker images',
            'Routing networks',
            'Managing Git branches',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does a pandas DataFrame represent?',
          options: [
            'Tabular labeled data',
            'A Linux process',
            'A CSS file',
            'A Git commit',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why perform exploratory data analysis?',
          options: [
            'To understand patterns, distributions, and issues in data',
            'To install operating systems',
            'To replace databases',
            'To disable charts',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-analyst/statistics':
    createQuiz(
      'Statistics Quiz',
      [
        {
          question:
            'What does the mean represent?',
          options: [
            'Arithmetic average',
            'Middle value only',
            'Most frequent value',
            'Largest value',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is the median?',
          options: [
            'The middle value after ordering data',
            'The average',
            'The maximum',
            'The range',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does standard deviation measure?',
          options: [
            'Spread around the mean',
            'The number of columns',
            'The data type',
            'The database size',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does correlation describe?',
          options: [
            'Association between variables',
            'Proof of causation',
            'A SQL table',
            'A Git relationship',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is hypothesis testing used for?',
          options: [
            'Evaluating evidence about a statistical claim',
            'Creating dashboards',
            'Installing Python',
            'Building Docker images',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-analyst/data-visualization':
    createQuiz(
      'Data Visualization Quiz',
      [
        {
          question:
            'Which chart is commonly suitable for comparing categories?',
          options: [
            'Bar chart',
            'Scatter plot only',
            'Map only',
            'Histogram only',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which chart is commonly used for trends over time?',
          options: [
            'Line chart',
            'Pie chart',
            'Table only',
            'Single number',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a scatter plot useful for?',
          options: [
            'Examining relationships between two numeric variables',
            'Displaying source code',
            'Managing databases',
            'Creating API routes',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should a good visualization prioritize?',
          options: [
            'Clear communication',
            'Maximum decoration',
            'As many colors as possible',
            'Hidden labels',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is data storytelling?',
          options: [
            'Using data and visuals to communicate meaningful insights',
            'Inventing unsupported values',
            'Deleting raw data',
            'Avoiding context',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-analyst/power-bi':
    createQuiz(
      'Power BI Quiz',
      [
        {
          question:
            'What is Power BI mainly used for?',
          options: [
            'Business intelligence and visualization',
            'Operating system management',
            'Container orchestration',
            'Source control',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is Power Query primarily used for?',
          options: [
            'Importing and transforming data',
            'Creating Git branches',
            'Running containers',
            'Managing DNS',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does data modeling define?',
          options: [
            'Relationships and structure between data tables',
            'CSS selectors',
            'Linux users',
            'Git remotes',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is DAX?',
          options: [
            'A formula language used in Power BI',
            'A cloud provider',
            'A version control system',
            'A web browser',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a Power BI dashboard used for?',
          options: [
            'Presenting important metrics and visuals',
            'Installing packages',
            'Managing Linux processes',
            'Writing HTML',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-analyst/data-project':
    createQuiz(
      'Data Analyst Project Assessment',
      [
        {
          question:
            'What should happen before analyzing a new dataset?',
          options: [
            'Inspect and clean the data',
            'Immediately publish conclusions',
            'Delete missing values without inspection',
            'Remove all columns',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why should analysis questions be defined clearly?',
          options: [
            'They guide relevant analysis',
            'They eliminate the need for data',
            'They replace charts',
            'They prevent SQL use',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should a dashboard emphasize?',
          options: [
            'Relevant insights and metrics',
            'Every possible chart',
            'Unrelated decoration',
            'Raw code only',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why validate calculated metrics?',
          options: [
            'To reduce errors in conclusions',
            'To make reports longer',
            'To remove data sources',
            'To disable filters',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should conclusions be based on?',
          options: [
            'Evidence from the analyzed data',
            'Personal guesses only',
            'Random values',
            'Unverified assumptions',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  /*
  |--------------------------------------------------------------------------
  | DATA SCIENTIST
  |--------------------------------------------------------------------------
  */

  'data-scientist/python-fundamentals':
    createQuiz(
      'Python Fundamentals Quiz',
      [
        {
          question:
            'Which keyword defines a function in Python?',
          options: [
            'def',
            'func',
            'function',
            'define',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which type represents a sequence that can be modified?',
          options: [
            'list',
            'tuple',
            'str',
            'int',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which statement handles exceptions?',
          options: [
            'try',
            'loop',
            'switch',
            'select',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a Python module?',
          options: [
            'A file containing reusable Python code',
            'A database table',
            'A Docker network',
            'A CSS rule',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does a for loop do?',
          options: [
            'Iterates over items',
            'Creates databases',
            'Compiles CSS',
            'Deploys cloud servers',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-scientist/statistics':
    createQuiz(
      'Data Science Statistics Quiz',
      [
        {
          question:
            'What does descriptive statistics summarize?',
          options: [
            'Observed data',
            'Git history',
            'CSS layout',
            'Cloud resources',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is probability bounded between?',
          options: [
            '0 and 1',
            '-10 and 10',
            '1 and 100 only',
            'Any two strings',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is sampling?',
          options: [
            'Selecting a subset of a population',
            'Deleting all records',
            'Training only neural networks',
            'Creating Git tags',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Does correlation alone prove causation?',
          options: [
            'No',
            'Always',
            'Only in SQL',
            'Only for integers',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is statistical inference used for?',
          options: [
            'Drawing conclusions about populations from samples',
            'Styling charts',
            'Creating Docker images',
            'Managing Linux users',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-scientist/sql-data':
    createQuiz(
      'SQL for Data Science Quiz',
      [
        {
          question:
            'What does SELECT retrieve?',
          options: [
            'Data',
            'CSS',
            'Docker images',
            'Git branches',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does WHERE do?',
          options: [
            'Filters rows',
            'Groups rows',
            'Orders rows only',
            'Creates tables only',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does JOIN combine?',
          options: [
            'Related data from tables',
            'Python modules',
            'Docker images',
            'Git commits',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does GROUP BY support?',
          options: [
            'Aggregate calculations by group',
            'CSS styling',
            'Container deployment',
            'Linux permissions',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why are window functions useful?',
          options: [
            'They calculate across related rows without collapsing all row detail',
            'They delete databases',
            'They build React components',
            'They create virtual machines',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-scientist/pandas':
    createQuiz(
      'Pandas Quiz',
      [
        {
          question:
            'What does a DataFrame represent?',
          options: [
            'Two-dimensional labeled tabular data',
            'A Git branch',
            'A Docker container',
            'A CSS grid',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is NumPy especially useful for?',
          options: [
            'Numerical arrays',
            'HTML styling',
            'Git hosting',
            'API routing',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why handle missing values?',
          options: [
            'They can affect analysis and models',
            'They create Git conflicts',
            'They break CSS automatically',
            'They prevent all Python execution',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does groupby commonly do?',
          options: [
            'Splits data into groups for aggregation',
            'Creates cloud accounts',
            'Starts containers',
            'Builds HTML',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is exploratory analysis used for?',
          options: [
            'Understanding data patterns and quality',
            'Deploying Kubernetes',
            'Writing CSS',
            'Managing Git users',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-scientist/data-visualization':
    createQuiz(
      'Data Science Visualization Quiz',
      [
        {
          question:
            'Which plot can show the distribution of one numeric variable?',
          options: [
            'Histogram',
            'Git graph',
            'Docker layer',
            'DNS table',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which plot is useful for two numeric variables?',
          options: [
            'Scatter plot',
            'Single KPI only',
            'Text paragraph',
            'HTML heading',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why label chart axes?',
          options: [
            'To explain what values represent',
            'To make values secret',
            'To disable interpretation',
            'To replace the data',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why avoid misleading axis scales?',
          options: [
            'They can distort perceived differences',
            'They create Python errors',
            'They delete databases',
            'They modify Git history',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should determine chart choice?',
          options: [
            'The data and message being communicated',
            'Random selection',
            'The maximum number of colors',
            'The longest chart name',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-scientist/machine-learning':
    createQuiz(
      'Machine Learning Quiz',
      [
        {
          question:
            'What is supervised learning?',
          options: [
            'Learning from labeled examples',
            'Learning with no data',
            'Writing CSS',
            'Managing Git',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which task predicts continuous values?',
          options: [
            'Regression',
            'Classification',
            'Clustering only',
            'Sorting',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which task predicts categories?',
          options: [
            'Classification',
            'Regression',
            'File handling',
            'SQL joining',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why use a test set?',
          options: [
            'To evaluate performance on unseen data',
            'To train on every available example',
            'To replace training data',
            'To create features automatically',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is clustering?',
          options: [
            'Grouping similar unlabeled observations',
            'Predicting only continuous values',
            'Creating SQL tables',
            'Building APIs',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-scientist/feature-engineering':
    createQuiz(
      'Feature Engineering Quiz',
      [
        {
          question:
            'What is feature engineering?',
          options: [
            'Creating or transforming model input variables',
            'Building CSS layouts',
            'Managing Git branches',
            'Deploying containers only',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why encode categorical variables?',
          options: [
            'Many models require numerical representations',
            'To delete categories',
            'To create APIs',
            'To style charts',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does feature scaling adjust?',
          options: [
            'The numerical scale of features',
            'The number of Git commits',
            'HTML font sizes only',
            'Database users',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why address missing values?',
          options: [
            'They may reduce model quality or break some algorithms',
            'They create Docker images',
            'They automatically improve accuracy',
            'They replace features',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is feature selection?',
          options: [
            'Choosing useful input variables',
            'Selecting CSS themes',
            'Creating server accounts',
            'Choosing Git branch colors',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-scientist/model-evaluation':
    createQuiz(
      'Model Evaluation Quiz',
      [
        {
          question:
            'What does accuracy measure in classification?',
          options: [
            'Fraction of predictions that are correct',
            'Average regression error only',
            'Number of features',
            'Training duration only',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does a confusion matrix summarize?',
          options: [
            'Classification prediction outcomes',
            'Database relationships',
            'CSS rules',
            'Git conflicts',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does cross-validation help estimate?',
          options: [
            'How a model generalizes across different data splits',
            'CSS performance',
            'Network latency only',
            'Git storage',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is hyperparameter tuning?',
          options: [
            'Searching for useful model configuration values',
            'Editing training labels manually',
            'Creating SQL tables',
            'Building HTML',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does MAE measure?',
          options: [
            'Average absolute prediction error',
            'Classification accuracy',
            'Number of classes',
            'Number of features',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-scientist/deep-learning':
    createQuiz(
      'Deep Learning Quiz',
      [
        {
          question:
            'What is an artificial neural network composed of?',
          options: [
            'Connected computational units often called neurons',
            'SQL tables only',
            'Git repositories',
            'CSS rules',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does an activation function introduce?',
          options: [
            'Non-linearity',
            'A database connection',
            'A Git branch',
            'An HTTP route',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is forward propagation?',
          options: [
            'Computing outputs through the network',
            'Deleting model weights',
            'Creating CSS',
            'Writing SQL',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does backpropagation help calculate?',
          options: [
            'Gradients used to update model weights',
            'Git commit hashes',
            'Database indexes',
            'HTTP headers',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'CNNs are especially well known for working with what type of data?',
          options: [
            'Images and spatial data',
            'Git history only',
            'DNS records',
            'CSS files only',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'data-scientist/data-science-project':
    createQuiz(
      'Data Science Project Assessment',
      [
        {
          question:
            'What should happen before model training?',
          options: [
            'Understand and prepare the data',
            'Deploy the model immediately',
            'Delete the target variable',
            'Ignore missing values',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why separate training and test data?',
          options: [
            'To evaluate generalization on unseen examples',
            'To double every row',
            'To eliminate evaluation',
            'To avoid training',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why choose an evaluation metric based on the problem?',
          options: [
            'Different tasks prioritize different kinds of errors',
            'All metrics are identical',
            'Metrics only affect CSS',
            'Metrics replace data',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is data leakage?',
          options: [
            'Using information during training that would not legitimately be available at prediction time',
            'Losing a CSV file',
            'Deleting Git history',
            'Removing CSS',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should accompany a final model result?',
          options: [
            'Evaluation and explanation of performance',
            'Only the model filename',
            'No testing information',
            'Random predictions',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  /*
  |--------------------------------------------------------------------------
  | CLOUD ENGINEER
  |--------------------------------------------------------------------------
  */

  'cloud-engineer/cloud-fundamentals':
    createQuiz(
      'Cloud Fundamentals Quiz',
      [
        {
          question:
            'What is cloud computing?',
          options: [
            'On-demand access to computing resources over a network',
            'Only local desktop software',
            'A programming language',
            'A Git feature',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does IaaS provide?',
          options: [
            'Infrastructure resources such as compute and networking',
            'Only finished office applications',
            'Only source control',
            'Only CSS',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is scalability?',
          options: [
            'Adjusting resources to handle changing demand',
            'Deleting all resources',
            'Creating Git commits',
            'Writing SQL',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is high availability?',
          options: [
            'Designing systems to remain accessible despite failures',
            'Using one server with no backup',
            'Disabling monitoring',
            'Avoiding redundancy',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a public cloud?',
          options: [
            'Cloud infrastructure offered by a provider to customers',
            'A private laptop',
            'A Git repository',
            'A CSS framework',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'cloud-engineer/linux':
    createQuiz(
      'Cloud Linux Quiz',
      [
        {
          question:
            'Which command lists files?',
          options: [
            'ls',
            'pwd',
            'mkdir',
            'chmod',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which command changes directories?',
          options: [
            'cd',
            'ls',
            'touch',
            'grep',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does chmod manage?',
          options: [
            'File permissions',
            'DNS records',
            'Git history',
            'Cloud billing',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a shell script?',
          options: [
            'A file containing shell commands',
            'A database',
            'A cloud region',
            'A Git server',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does a package manager do?',
          options: [
            'Installs and manages software packages',
            'Creates CSS',
            'Builds SQL queries only',
            'Creates Git branches',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'cloud-engineer/networking':
    createQuiz(
      'Cloud Networking Quiz',
      [
        {
          question:
            'What does an IP address identify?',
          options: [
            'A network interface or host location in an IP network',
            'A Git commit',
            'A CSS class',
            'A database table',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is subnetting?',
          options: [
            'Dividing an IP network into smaller networks',
            'Creating Git branches',
            'Building Docker images',
            'Writing SQL queries',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does DNS do?',
          options: [
            'Maps names to network addresses',
            'Builds containers',
            'Creates cloud users',
            'Manages Git',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does a load balancer do?',
          options: [
            'Distributes traffic among multiple targets',
            'Stores source code',
            'Creates SQL tables',
            'Changes CSS',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does a firewall control?',
          options: [
            'Allowed and denied network traffic',
            'Git commits',
            'HTML content',
            'Database schemas',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'cloud-engineer/aws':
    createQuiz(
      'Cloud Engineer AWS Quiz',
      [
        {
          question:
            'What does EC2 provide?',
          options: [
            'Virtual compute instances',
            'Object storage only',
            'Source control',
            'CSS hosting only',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is S3 used for?',
          options: [
            'Object storage',
            'Virtual CPUs',
            'User login only',
            'Git branches',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a VPC?',
          options: [
            'A logically isolated AWS network',
            'A Git repository',
            'A SQL function',
            'A CSS framework',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is Auto Scaling used for?',
          options: [
            'Adjusting compute capacity based on demand',
            'Changing CSS scale',
            'Creating Git tags',
            'Deleting monitoring',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is IAM responsible for?',
          options: [
            'Access control',
            'Object rendering',
            'SQL aggregation',
            'Frontend layout',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'cloud-engineer/azure':
    createQuiz(
      'Microsoft Azure Quiz',
      [
        {
          question:
            'What is an Azure Resource Group?',
          options: [
            'A logical container for Azure resources',
            'A Git branch',
            'A CSS group',
            'A database query',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which Azure service can provide virtual machines?',
          options: [
            'Azure Virtual Machines',
            'Azure DevOps Boards only',
            'Power BI',
            'GitHub Issues',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is Azure Storage used for?',
          options: [
            'Cloud data storage',
            'Only Git commits',
            'Only CSS files',
            'Only user passwords',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is Microsoft Entra ID primarily used for?',
          options: [
            'Identity and access management',
            'Object storage',
            'Container building',
            'SQL aggregation',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why monitor Azure resources?',
          options: [
            'To understand health, performance, and failures',
            'To disable alerts',
            'To remove logs',
            'To replace security',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'cloud-engineer/docker':
    createQuiz(
      'Cloud Docker Quiz',
      [
        {
          question:
            'What is a container?',
          options: [
            'An isolated runtime environment for an application',
            'A Git branch',
            'A database table',
            'A DNS record',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is an image?',
          options: [
            'A packaged template used to start containers',
            'A running container only',
            'A firewall',
            'A Git server',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a Dockerfile?',
          options: [
            'Instructions used to build an image',
            'A SQL database',
            'A DNS configuration only',
            'A Git commit',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does a volume provide?',
          options: [
            'Persistent or shared data storage',
            'CSS layout',
            'Source control',
            'Cloud identity',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is Docker Compose useful for?',
          options: [
            'Defining multi-container applications',
            'Managing GitHub users',
            'Creating Azure subscriptions',
            'Writing CSS',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'cloud-engineer/terraform':
    createQuiz(
      'Cloud Terraform Quiz',
      [
        {
          question:
            'What is Infrastructure as Code?',
          options: [
            'Managing infrastructure through machine-readable configuration',
            'Writing CSS',
            'Creating Git issues',
            'Only manual server setup',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does terraform plan show?',
          options: [
            'Proposed infrastructure changes',
            'Application logs',
            'Git history',
            'CSS output',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does terraform apply do?',
          options: [
            'Applies planned infrastructure changes',
            'Creates HTML pages',
            'Starts Git',
            'Runs SQL SELECT',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why use variables in Terraform?',
          options: [
            'To make configuration reusable and configurable',
            'To remove providers',
            'To replace state',
            'To disable infrastructure',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a module?',
          options: [
            'A reusable group of Terraform configuration',
            'A Git commit',
            'A CSS selector',
            'A database row',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'cloud-engineer/cloud-security':
    createQuiz(
      'Cloud Security Quiz',
      [
        {
          question:
            'What does least privilege mean?',
          options: [
            'Grant only necessary permissions',
            'Grant administrator access to everyone',
            'Remove authentication',
            'Share passwords',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does encryption protect?',
          options: [
            'Data confidentiality',
            'CSS formatting',
            'Git branching',
            'Database table names',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why use multi-factor authentication?',
          options: [
            'To add another identity verification factor',
            'To remove passwords automatically',
            'To replace authorization',
            'To disable monitoring',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is network segmentation used for?',
          options: [
            'Limiting and controlling communication between network areas',
            'Creating Git commits',
            'Styling applications',
            'Writing SQL',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why enable security logging?',
          options: [
            'To support detection and investigation',
            'To expose credentials',
            'To remove monitoring',
            'To disable alerts',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'cloud-engineer/cloud-monitoring':
    createQuiz(
      'Cloud Monitoring Quiz',
      [
        {
          question:
            'What is a monitoring metric?',
          options: [
            'A measured numerical value over time',
            'A CSS class',
            'A Git repository',
            'A Dockerfile',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a log?',
          options: [
            'A record of events or messages',
            'A database index',
            'A cloud region',
            'A Git branch only',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should an alert do?',
          options: [
            'Signal when a defined condition occurs',
            'Delete monitoring data',
            'Create CSS',
            'Disable security',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is observability intended to improve?',
          options: [
            'Understanding internal system behavior from available signals',
            'Git branching',
            'HTML layout',
            'Database normalization',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why monitor cloud resources?',
          options: [
            'To detect performance and availability problems',
            'To hide failures',
            'To remove logs',
            'To disable alarms',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'cloud-engineer/cloud-project':
    createQuiz(
      'Cloud Engineer Project Assessment',
      [
        {
          question:
            'Which design improves application availability?',
          options: [
            'Using redundant resources across failure domains',
            'Using one unmonitored server',
            'Disabling backups',
            'Removing health checks',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why use Infrastructure as Code in cloud projects?',
          options: [
            'To make infrastructure repeatable and versionable',
            'To prevent automation',
            'To replace monitoring',
            'To eliminate security',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What principle should cloud permissions follow?',
          options: [
            'Least privilege',
            'Maximum privilege',
            'Anonymous administrator access',
            'Shared credentials',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why configure monitoring before production use?',
          options: [
            'To detect failures and performance issues',
            'To hide outages',
            'To remove logs',
            'To replace testing',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should a cloud deployment plan include?',
          options: [
            'Security, availability, monitoring, and recovery considerations',
            'Only a server name',
            'Only CSS',
            'Only Git history',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  /*
  |--------------------------------------------------------------------------
  | QA / TEST ENGINEER
  |--------------------------------------------------------------------------
  */

  'qa-engineer/testing-fundamentals':
    createQuiz(
      'Testing Fundamentals Quiz',
      [
        {
          question:
            'What is software testing?',
          options: [
            'Evaluating software behavior and quality',
            'Writing only CSS',
            'Creating Git branches',
            'Managing cloud billing',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is unit testing?',
          options: [
            'Testing small isolated units of software',
            'Testing an entire company network',
            'Testing only databases',
            'Testing only production',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is regression testing?',
          options: [
            'Checking that existing behavior still works after changes',
            'Deleting old tests',
            'Testing only new users',
            'Creating API routes',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a defect?',
          options: [
            'A problem where software does not meet expected behavior',
            'A Git tag',
            'A cloud service',
            'A CSS rule',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should a test plan describe?',
          options: [
            'Testing scope, approach, and activities',
            'Only source code',
            'Only CSS',
            'Only deployment',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'qa-engineer/test-cases':
    createQuiz(
      'Test Cases Quiz',
      [
        {
          question:
            'What is a test case?',
          options: [
            'A defined set of steps, conditions, and expected results',
            'A Git repository',
            'A database server',
            'A CSS file',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is expected result?',
          options: [
            'The behavior the system should produce',
            'The tester password',
            'The source code branch',
            'The server IP only',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why define test data?',
          options: [
            'To specify inputs used during testing',
            'To create CSS',
            'To deploy servers',
            'To manage Git',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should a useful defect report contain?',
          options: [
            'Steps to reproduce and relevant details',
            'Only the word bug',
            'No expected result',
            'No environment information',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a test scenario?',
          options: [
            'A high-level situation or feature to test',
            'A CSS property',
            'A Git command',
            'A cloud provider',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'qa-engineer/manual-testing':
    createQuiz(
      'Manual Testing Quiz',
      [
        {
          question:
            'What is functional testing focused on?',
          options: [
            'Whether features behave according to requirements',
            'Server hardware temperature only',
            'CSS syntax only',
            'Git storage only',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is smoke testing?',
          options: [
            'A quick check of critical functionality',
            'Testing only performance',
            'Deleting old tests',
            'Testing network cables',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is regression testing?',
          options: [
            'Retesting existing features after changes',
            'Testing only login',
            'Testing only CSS',
            'Testing only hardware',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is exploratory testing?',
          options: [
            'Simultaneous learning, test design, and execution',
            'Testing only scripted steps',
            'Running Docker builds',
            'Creating databases',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is sanity testing commonly used for?',
          options: [
            'Focused verification that a change or area works sufficiently for further testing',
            'Creating source code',
            'Replacing all regression testing',
            'Deploying servers',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'qa-engineer/api-testing':
    createQuiz(
      'API Testing Quiz',
      [
        {
          question:
            'Which HTTP method normally retrieves data?',
          options: [
            'GET',
            'POST',
            'PATCH',
            'DELETE',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does HTTP 200 generally indicate?',
          options: [
            'Successful request',
            'Not found',
            'Server error',
            'Unauthorized',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is Postman commonly used for?',
          options: [
            'Sending and testing API requests',
            'Creating CSS',
            'Managing Linux packages',
            'Building Docker images only',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should API response validation check?',
          options: [
            'Status, body, headers, and expected behavior as relevant',
            'Only URL color',
            'Only Git branch',
            'Only server name',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why test API authentication?',
          options: [
            'To verify protected resources enforce access rules',
            'To remove credentials',
            'To replace all API tests',
            'To create CSS',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'qa-engineer/selenium':
    createQuiz(
      'Selenium Quiz',
      [
        {
          question:
            'What is Selenium WebDriver used for?',
          options: [
            'Automating browser interactions',
            'Managing SQL databases',
            'Creating Docker images',
            'Managing Git hosting',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a locator?',
          options: [
            'A way to identify an element on a page',
            'A database query',
            'A cloud region',
            'A Git tag',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why are waits used?',
          options: [
            'To handle elements or conditions that become ready asynchronously',
            'To slow every test randomly',
            'To replace assertions',
            'To remove locators',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What does an assertion verify?',
          options: [
            'Whether an observed result matches an expectation',
            'Whether Git is installed',
            'Whether CSS exists',
            'Whether a cloud server is physical',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is the Page Object Model?',
          options: [
            'A design pattern that encapsulates page interactions',
            'A SQL database model',
            'A Git branch model',
            'A cloud billing model',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'qa-engineer/automation-frameworks':
    createQuiz(
      'Automation Frameworks Quiz',
      [
        {
          question:
            'Why use an automation framework?',
          options: [
            'To organize reusable and maintainable automated tests',
            'To remove all test structure',
            'To avoid assertions',
            'To disable reporting',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a fixture?',
          options: [
            'Reusable setup or test context',
            'A Git branch',
            'A CSS selector',
            'A cloud server',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why create reusable test components?',
          options: [
            'To reduce duplication',
            'To duplicate every test',
            'To remove assertions',
            'To prevent automation',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why generate test reports?',
          options: [
            'To communicate test execution and failures',
            'To replace the test suite',
            'To remove logs',
            'To build containers',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should test data management aim for?',
          options: [
            'Predictable, maintainable test inputs',
            'Random undocumented values only',
            'Production passwords in source code',
            'No test isolation',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'qa-engineer/javascript-testing':
    createQuiz(
      'JavaScript Testing Quiz',
      [
        {
          question:
            'What does a test assertion do?',
          options: [
            'Checks an expected condition',
            'Creates a cloud server',
            'Changes Git history',
            'Styles HTML',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a unit test?',
          options: [
            'A test of a small isolated unit',
            'A full production deployment',
            'A network firewall',
            'A SQL server',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is mocking?',
          options: [
            'Replacing a dependency with a controlled substitute',
            'Deleting tests',
            'Deploying code',
            'Creating CSS',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why do asynchronous tests need special handling?',
          options: [
            'The tested operation may finish later',
            'JavaScript cannot be asynchronous',
            'They always run instantly',
            'They cannot contain assertions',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should API tests written in JavaScript validate?',
          options: [
            'Expected request and response behavior',
            'Only CSS',
            'Only Git history',
            'Only file names',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'qa-engineer/ci-cd-testing':
    createQuiz(
      'CI/CD Testing Quiz',
      [
        {
          question:
            'Why run tests in CI?',
          options: [
            'To detect defects automatically when changes occur',
            'To disable builds',
            'To remove Git',
            'To avoid feedback',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'When should automated tests normally run in a pipeline?',
          options: [
            'Before promoting unsafe changes further',
            'Only after deleting production',
            'Never',
            'Only once per year',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What can GitHub Actions provide?',
          options: [
            'Automated workflow execution',
            'Database storage only',
            'CSS compilation only',
            'Manual hardware testing',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should happen when a critical pipeline test fails?',
          options: [
            'The pipeline should stop or prevent unsafe promotion',
            'Ignore it automatically',
            'Delete the test',
            'Deploy anyway without review',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why save test reports from CI?',
          options: [
            'To help analyze results and failures',
            'To remove evidence',
            'To disable debugging',
            'To replace testing',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'qa-engineer/performance-testing':
    createQuiz(
      'Performance Testing Quiz',
      [
        {
          question:
            'What is load testing?',
          options: [
            'Evaluating behavior under expected or defined workload',
            'Testing only CSS',
            'Deleting application data',
            'Creating Git branches',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is stress testing?',
          options: [
            'Evaluating behavior beyond normal operating limits',
            'Testing only login colors',
            'Testing Git storage',
            'Writing SQL',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is response time?',
          options: [
            'Time taken to respond to a request',
            'Number of users',
            'Number of Git commits',
            'Amount of CSS',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is throughput?',
          options: [
            'Amount of work processed over a period',
            'A CSS property',
            'A Git command',
            'A test case title',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What is a performance bottleneck?',
          options: [
            'A limiting component that reduces system performance',
            'A Git tag',
            'A CSS selector',
            'A test report title',
          ],
          correctAnswer: 0,
        },
      ]
    ),

  'qa-engineer/qa-project':
    createQuiz(
      'QA Project Assessment',
      [
        {
          question:
            'What should a QA strategy begin with?',
          options: [
            'Understanding requirements and risks',
            'Writing random tests',
            'Deleting requirements',
            'Testing only after release',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What should test cases include?',
          options: [
            'Steps, data, and expected results',
            'Only a title',
            'Only source code',
            'Only a screenshot',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Which tests are strong candidates for automation?',
          options: [
            'Repeatable tests that provide ongoing value',
            'Every exploratory investigation',
            'One-time visual opinions only',
            'Tests with no expected behavior',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'What makes a defect report actionable?',
          options: [
            'Clear reproduction steps and relevant evidence',
            'No details',
            'Only the word failed',
            'No expected result',
          ],
          correctAnswer: 0,
        },
        {
          question:
            'Why combine manual and automated testing?',
          options: [
            'They provide complementary types of coverage',
            'Automation makes all human testing useless',
            'Manual testing makes automation impossible',
            'They always test exactly the same thing',
          ],
          correctAnswer: 0,
        },
      ]
    ),
}