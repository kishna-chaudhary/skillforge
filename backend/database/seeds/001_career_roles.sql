INSERT INTO career_roles (
  slug,
  title,
  description
)
VALUES
  (
    'frontend-engineer',
    'Frontend Engineer',
    'Build modern, responsive, and accessible web applications and user interfaces.'
  ),
  (
    'backend-engineer',
    'Backend Engineer',
    'Build APIs, databases, authentication systems, and scalable server-side applications.'
  ),
  (
    'data-analyst',
    'Data Analyst',
    'Analyze data, create reports and dashboards, and turn business data into actionable insights.'
  ),
  (
    'data-scientist',
    'Data Scientist',
    'Use statistics, machine learning, and data analysis to solve complex business problems.'
  ),
  (
    'devops-engineer',
    'DevOps Engineer',
    'Automate software delivery, infrastructure, deployment pipelines, and system operations.'
  ),
  (
    'cloud-engineer',
    'Cloud Engineer',
    'Design, deploy, and manage scalable applications and infrastructure in cloud environments.'
  ),
  (
    'qa-engineer',
    'QA Engineer',
    'Ensure software quality through testing, automation, debugging, and quality assurance practices.'
  ),
  (
    'full-stack-engineer',
    'Full Stack Engineer',
    'Build complete web applications across frontend, backend, APIs, and databases.'
  )
ON CONFLICT (slug)
DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  is_active = true,
  updated_at = CURRENT_TIMESTAMP;