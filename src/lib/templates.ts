import { MinimalTemplate } from '@/components/templates/MinimalTemplate';
import { DeveloperTemplate } from '@/components/templates/DeveloperTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';

export const TEMPLATES = [
  { 
    id: 'creative', 
    name: 'Spider-Verse', 
    category: 'Creative • Animation', 
    tags: ['Animation', 'Adventure', 'Bold'],
    desc: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. A bold, highly animated portfolio template.', 
    component: CreativeTemplate, 
    color: 'from-[#FF2A2A] via-[#7A00C4] to-[#000000]',
    textColor: 'text-white'
  },
  { 
    id: 'developer', 
    name: 'The Matrix', 
    category: 'Engineering • Sci-Fi', 
    tags: ['Dark', 'Terminal', 'Code'],
    desc: 'Dark, monospace, code-centric vibe. Ideal for backend and systems engineers who want to show off their raw technical skills.', 
    component: DeveloperTemplate, 
    color: 'from-[#0d1117] via-[#161b22] to-[#003300]',
    textColor: 'text-[#c9d1d9]'
  },
  { 
    id: 'minimal', 
    name: 'Interstellar', 
    category: 'Minimal • Sci-Fi', 
    tags: ['Clean', 'Space', 'Typography'],
    desc: 'Clean, typography-focused design. Perfect for a sleek, professional look that lets your work speak for itself across the cosmos.', 
    component: MinimalTemplate, 
    color: 'from-zinc-100 via-zinc-300 to-zinc-500',
    textColor: 'text-zinc-900'
  },
  { 
    id: 'saas', 
    name: 'Manifest', 
    category: 'Business • Mystery', 
    tags: ['Landing', 'Conversion', 'Sleek'],
    desc: 'Optimized for conversions with a professional SaaS aesthetic. Uncover the mystery of high engagement rates.', 
    component: MinimalTemplate, 
    color: 'from-indigo-900 via-blue-900 to-black',
    textColor: 'text-white'
  },
  { 
    id: 'brutalist', 
    name: 'The Flash', 
    category: 'Design • Fantasy', 
    tags: ['Fast', 'High Contrast', 'Grid'],
    desc: 'Raw, unpolished, and highly structural. For the bold designers who want to move fast and break things.', 
    component: CreativeTemplate, 
    color: 'from-yellow-500 via-orange-600 to-red-700',
    textColor: 'text-white'
  }
] as const;
