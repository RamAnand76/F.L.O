'use client';

import React from 'react';
import StackIconBase from 'tech-stack-icons';

interface StackIconProps {
  name: string;
  className?: string;
}

/**
 * Mapping of common GitHub language names and tech names 
 * to tech-stack-icons library names for better accuracy.
 */
const techMapping: Record<string, string> = {
  // Languages
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
  'C++': 'cpp',
  'C#': 'csharp',
  'Swift': 'swift',
  'Kotlin': 'kotlin',
  'Shell': 'bash',
  'PowerShell': 'powershell',
  
  // Frameworks & Tools
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
  'Zustand': 'zustand',
  'Redux': 'redux',
  'Vite': 'vitejs',
  'Django': 'django',
  'Flask': 'flask',
  'NumPy': 'numpy',
  'Pandas': 'pandas',
  'PyTorch': 'pytorch',
  'Sentry': 'sentry',
  'Wordpress': 'wordpress',
  'Android': 'android',
  'iOS': 'swift',
  'Azure': 'azure',
  'Cloudflare': 'cloudflare',
  'OpenAI': 'openai',
  'Gemini': 'google',
  'Meta': 'metaai',
  'Anthropic': 'anthropic',
  'AssemblyAI': 'assemblyai',
  'GitHub Copilot': 'copilotgithub',
  'DeepMind': 'deepmind',
  'DeepSeek': 'deepseek',
  'ElevenLabs': 'elevenlabsai',
  'Flux': 'fluxai',
  'Gradio': 'gradio',
  'Groq': 'groq',
  'Heroku': 'heroku',
  'Hugging Face': 'huggingface',
  'Kimi': 'kimi',
  'LangChain': 'langchain',
  'LlamaIndex': 'llamaindex',
  'Mistral': 'mistral',
  'Ollama': 'ollama',
  'Railway': 'railway',
  'Shadcn UI': 'shadcnui',
  'TensorFlow': 'tensorflow',
  'Bootstrap 4': 'bootstrap4',
  'Bootstrap 5': 'bootstrap5',
};

/**
 * Wrapper for tech-stack-icons library.
 * Provides easy mapping from various names to library icon names.
 */
export function StackIcon({ name, className = "w-4 h-4" }: StackIconProps) {
  if (!name) return null;

  // Cleanup name for more robustness (lowercase, remove spaces/dots/hyphens)
  const normalizedSearch = name.trim().toLowerCase().replace(/[\s\.\-]/g, '');

  // Check manual mapping first
  const iconName = techMapping[name] || 
                  techMapping[name.charAt(0).toUpperCase() + name.slice(1)] || 
                  normalizedSearch;

  return (
    <div className={className}>
      <StackIconBase name={iconName as any} />
    </div>
  );
}

// Keep LanguageIcon for backward compatibility or as a focused alias
export const LanguageIcon = StackIcon;
