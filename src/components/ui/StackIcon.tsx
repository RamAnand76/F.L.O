'use client';

import React, { Component } from 'react';
import StackIconBase from 'tech-stack-icons';
import { Code } from 'lucide-react';

interface StackIconProps {
  name: string;
  className?: string;
}

const techMapping: Record<string, string> = {
  'JavaScript': 'js',
  'TypeScript': 'typescript',
  'Python': 'python',
  'Dart': 'dart',
  'Rust': 'rust',
  'Go': 'go',
  'HTML': 'html5',
  'CSS': 'css3',
  'PHP': 'php',
  'Ruby': 'ruby',
  'Java': 'java',
  'C#': 'csharp',
  'Swift': 'swift',
  'Kotlin': 'kotlin',
  'Shell': 'bash',
  'Bash': 'bash',
  'PowerShell': 'powershell',
  'React': 'react',
  'Vue': 'vuejs',
  'Next.js': 'nextjs',
  'Next': 'nextjs',
  'Node.js': 'nodejs',
  'Node': 'nodejs',
  'Angular': 'angular',
  'Svelte': 'sveltejs',
  'Flutter': 'flutter',
  'Tailwind': 'tailwindcss',
  'Tailwind CSS': 'tailwindcss',
  'Bootstrap': 'bootstrap5',
  'PostgreSQL': 'postgresql',
  'MySQL': 'mysql',
  'MongoDB': 'mongodb',
  'Firebase': 'firebase',
  'Docker': 'docker',
  'Kubernetes': 'kubernetes',
  'Prisma': 'prisma',
  'NestJS': 'nestjs',
  'Express.js': 'expressjs',
  'Express': 'expressjs',
  'Redux': 'redux',
  'Vite': 'vitejs',
  'Django': 'django',
  'Flask': 'flask',
  'PyTorch': 'pytorch',
  'TensorFlow': 'tensorflow',
  'Sentry': 'sentry',
  'Wordpress': 'wordpress',
  'Android': 'android',
  'iOS': 'swift',
  'Azure': 'azure',
  'Cloudflare': 'cloudflare',
  'OpenAI': 'openai',
  'Framer Motion': 'framer',
  'Framer': 'framer',
  'GraphQL': 'graphql',
  'AWS': 'aws',
  'Git': 'git',
  'GitHub': 'github',
  'Linux': 'linux',
  'Figma': 'figma',
  'Heroku': 'heroku',
  'Railway': 'railway',
  'Shadcn UI': 'shadcnui',
};

/** Fallback shown for any unknown or missing icon */
function FallbackIcon({ className }: { className: string }) {
  return (
    <div className={className}>
      <Code className="w-full h-full opacity-50" />
    </div>
  );
}

interface BoundaryState { hasError: boolean }
interface BoundaryProps { children: React.ReactNode; fallback: React.ReactNode }

/** Catches render errors thrown inside tech-stack-icons */
class IconErrorBoundary extends Component<BoundaryProps, BoundaryState> {
  constructor(props: BoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    // Silently swallow — the fallback handles it
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export function StackIcon({ name, className = 'w-4 h-4' }: StackIconProps) {
  if (!name) return null;

  const iconId = techMapping[name] ??
                 techMapping[name.charAt(0).toUpperCase() + name.slice(1)];

  const fallback = <FallbackIcon className={className} />;

  if (!iconId) return fallback;

  return (
    <IconErrorBoundary fallback={fallback}>
      <div className={className}>
        <StackIconBase name={iconId as any} />
      </div>
    </IconErrorBoundary>
  );
}

export const LanguageIcon = StackIcon;
