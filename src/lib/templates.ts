import { 
  MinimalTemplate 
} from '@/components/templates/MinimalTemplate';
import { DeveloperTemplate } from '@/components/templates/DeveloperTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';
import { DominicTemplate } from '@/components/templates/DominicTemplate';
import { VanshikaTemplate } from '@/components/templates/VanshikaTemplate';
import { FoliobloxTemplate } from '@/components/templates/FoliobloxTemplate';
import { FuturisticTemplate } from '@/components/templates/FuturisticTemplate';
import { LayoutTemplate, Code, Palette, Rocket, Zap, Crown, Shield } from 'lucide-react';

export const TEMPLATES = [
  { 
    id: 'creative', 
    name: 'Spider-Verse', 
    icon: Palette,
    category: 'Creative • Animation', 
    tags: ['Animation', 'Adventure', 'Bold'],
    desc: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. A bold, highly animated portfolio template.', 
    component: CreativeTemplate, 
    gradient: 'from-[#FF2A2A] via-[#7A00C4] to-[#000000]',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
    textColor: 'text-white'
  },
  { 
    id: 'developer', 
    name: 'The Matrix', 
    icon: Code,
    category: 'Engineering • Sci-Fi', 
    tags: ['Dark', 'Terminal', 'Code'],
    desc: 'Dark, monospace, code-centric vibe. Ideal for backend and systems engineers who want to show off their raw technical skills.', 
    component: DeveloperTemplate, 
    gradient: 'from-[#0d1117] via-[#161b22] to-[#003300]',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    textColor: 'text-[#c9d1d9]'
  },
  { 
    id: 'minimal', 
    name: 'Interstellar', 
    icon: LayoutTemplate,
    category: 'Minimal • Sci-Fi', 
    tags: ['Clean', 'Space', 'Typography'],
    desc: 'Clean, typography-focused design. Perfect for a sleek, professional look that lets your work speak for itself across the cosmos.', 
    component: MinimalTemplate, 
    gradient: 'from-zinc-100 via-zinc-300 to-zinc-500',
    color: 'text-zinc-300',
    bg: 'bg-zinc-100/10',
    textColor: 'text-zinc-900'
  },
  { 
    id: 'saas', 
    name: 'Manifest', 
    icon: Zap,
    category: 'Business • Mystery', 
    tags: ['Landing', 'Conversion', 'Sleek'],
    desc: 'Optimized for conversions with a professional SaaS aesthetic. Uncover the mystery of high engagement rates.', 
    component: MinimalTemplate, 
    gradient: 'from-indigo-900 via-blue-900 to-black',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
    textColor: 'text-white'
  },
  { 
    id: 'brutalist', 
    name: 'The Flash', 
    icon: Zap,
    category: 'Design • Fantasy', 
    tags: ['Fast', 'High Contrast', 'Grid'],
    desc: 'Raw, unpolished, and highly structural. For the bold designers who want to move fast and break things.', 
    component: CreativeTemplate, 
    gradient: 'from-yellow-500 via-orange-600 to-red-700',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
    textColor: 'text-white'
  },
  { 
    id: 'dominic', 
    name: 'Top Gun', 
    icon: Crown,
    category: 'Premium • High-End', 
    tags: ['Orange', 'Bento', 'Typography'],
    desc: 'High-end, bold typography with a dark high-end look. Perfect for elite brand designers and visionary architects.', 
    component: DominicTemplate, 
    gradient: 'from-[#FF6B2C] via-black to-black',
    color: 'text-orange-500',
    bg: 'bg-orange-600/10',
    textColor: 'text-white'
  },
  { 
    id: 'vanshika', 
    name: 'Tenet', 
    icon: Shield,
    category: 'Minimal • Modern', 
    tags: ['Dark', 'Rounded', 'Services'],
    desc: 'Minimalist dark-themed design with rounded corners and a premium modern aesthetic. Optimized for service-oriented portfolios.', 
    component: VanshikaTemplate, 
    gradient: 'from-zinc-900 via-black to-zinc-800',
    color: 'text-white',
    bg: 'bg-white/5',
    textColor: 'text-white'
  },
  { 
    id: 'folioblox', 
    name: 'Folioblox', 
    icon: LayoutTemplate,
    category: 'Vibrant • Contrast', 
    tags: ['Gradient', 'Blocky', 'Bold'],
    desc: 'Vibrant orange/red gradient with high-contrast bold design. Built for high impact and creative storytelling.', 
    component: FoliobloxTemplate, 
    gradient: 'from-[#FF4500] via-[#D81B1B] to-[#7B0000]',
    color: 'text-red-500',
    bg: 'bg-red-600/10',
    textColor: 'text-white'
  },
  { 
    id: 'futuristic', 
    name: 'Interstellar VR', 
    icon: Rocket,
    category: 'Abstract • Sci-Fi', 
    tags: ['Glass', 'Floating Orbs', 'Futuristic'],
    desc: 'Abstract visionary design with floating glass elements, glowing orbs, and a high-tech vibe. Build the next era.', 
    component: FuturisticTemplate, 
    gradient: 'from-indigo-900 via-[#FF3E83] to-black',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    textColor: 'text-white'
  }
] as const;
