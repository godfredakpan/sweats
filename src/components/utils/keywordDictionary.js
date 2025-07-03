// techKeywords.js
export const keywordCategories = {
  languages: new Set([
    'javascript', 'typescript', 'python', 'php', 'java', 'go', 'ruby', 'sql',
    'csharp', 'c++', 'r', 'swift', 'kotlin', 'bash', 'shell', 'dart'
  ]),

  frontend: new Set([
    'html', 'css', 'sass', 'scss', 'less', 'tailwind', 'bootstrap',
    'react', 'nextjs', 'vue', 'nuxtjs', 'angular', 'svelte', 'remix',
    'jquery', 'redux', 'vite', 'webpack', 'babel', 'chakraui', 'materialui'
  ]),

  backend: new Set([
    'node', 'nodejs', 'express', 'nestjs', 'laravel', 'php', 'django',
    'flask', 'fastapi', 'rails', 'spring', 'springboot', 'ruby', 'mvc',
    'api', 'graphql', 'rest', 'restful', 'websocket', 'rpc', 'oauth', 'jwt'
  ]),

  devops: new Set([
    'git', 'github', 'ci', 'cd', 'docker', 'kubernetes', 'terraform',
    'ansible', 'jenkins', 'githubactions', 'gitlabci', 'travisci', 'circleci',
    'bash', 'linux', 'nginx', 'vagrant', 'helm', 'logstash'
  ]),

  cloud: new Set([
    'aws', 'azure', 'gcp', 'firebase', 'lambda', 'ec2', 's3', 'rds', 'vpc',
    'cloudfront', 'cloudfunctions', 'bigquery', 'heroku', 'digitalocean'
  ]),

  databases: new Set([
    'mysql', 'postgresql', 'postgres', 'mongodb', 'redis', 'sqlite', 'mariadb',
    'dynamodb', 'neo4j', 'supabase', 'firestore', 'prisma', 'typeorm', 'sequelize'
  ]),

  testing: new Set([
    'jest', 'mocha', 'chai', 'cypress', 'playwright', 'selenium', 'junit',
    'reacttestinglibrary', 'unittest', 'pytest', 'vitest', 'rspec'
  ]),

  ai_ml: new Set([
    'tensorflow', 'pytorch', 'keras', 'scikit', 'scikitlearn', 'huggingface',
    'openai', 'gpt', 'transformers', 'pandas', 'numpy', 'matplotlib', 'seaborn'
  ]),

  softskills: new Set([
    'communication', 'teamwork', 'collaboration', 'problem-solving',
    'adaptability', 'leadership', 'mentoring', 'criticalthinking', 'organization'
  ]),

  methodologies: new Set([
    'agile', 'scrum', 'kanban', 'lean', 'tdd', 'bdd', 'sprint', 'waterfall',
    'pairprogramming', 'ci', 'cd'
  ]),

  security: new Set([
    'jwt', 'ssl', 'tls', 'encryption', 'oauth2', 'authentication', 'authorization',
    'csrf', 'xss', 'saml', 'bcrypt', 'hashing', 'firewall', 'rbac'
  ]),

  mobile: new Set([
    'reactnative', 'flutter', 'xamarin', 'swiftui', 'androidstudio', 'ios',
    'kotlin', 'capacitor', 'cordova'
  ]),

  architecture: new Set([
    'microservices', 'monolith', 'eventdriven', 'serverless',
    'cleanarchitecture', 'hexagonal', 'ddd', 'designpatterns', 'soa'
  ]),

  other: new Set([
    'seo', 'pwa', 'performance', 'accessibility', 'responsive', 'webperformance',
    'websocket', 'cms', 'wordpress', 'shopify', 'figma', 'adobe', 'storybook'
  ])
};

// Create a flat set of all keywords for fast lookup
export const techKeywords = new Set(
  Object.values(keywordCategories).flatMap(set => Array.from(set))
);
