export interface LessonResource {
  title: string
  type: string
  url: string
}

export interface LessonData {
  title: string
  description: string
  duration: string
  content: string[]
  resources: LessonResource[]
}

export interface TopicLessons {
  topicTitle: string
  lessons: LessonData[]
}

export const detailedLessonData: Record<
  string,
  TopicLessons
> = {
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