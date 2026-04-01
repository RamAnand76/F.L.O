import { GithubUser, Repository, AppState } from '@/store/useStore';
import { Testimonial } from '@/services/testimonials.service';
import { Asset } from '@/services/assets.service';
import { Education, Experience } from '@/services/profile.service';

export const MOCK_GITHUB_USER: GithubUser = {
  login: 'alexrivera',
  id: 12345,
  avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  html_url: 'https://github.com/alexrivera',
  name: 'Alex Rivera',
  company: 'Nova Labs',
  blog: 'alexrivera.design',
  location: 'San Francisco, CA',
  email: 'alex@novalabs.design',
  bio: 'Visionary Designer & Full-stack Architect pushing the boundaries of digital human-centric design.',
  public_repos: 42,
  followers: 1200,
  following: 300,
};

export const MOCK_CUSTOM_DATA: AppState['customData'] = {
  name: 'Alex Rivera',
  bio: 'A visionary designer and developer based in San Francisco, specialized in crafting immersive digital experiences and scalable cloud architectures.',
  email: 'alex@novalabs.design',
  location: 'San Francisco, CA',
  website: 'https://alexrivera.design',
  github: 'https://github.com/alexrivera',
  twitter: 'https://twitter.com/alex_riv',
  linkedin: 'https://linkedin.com/in/alexrivera',
  role: 'Creative Technologist',
};

export const MOCK_REPOS: Repository[] = [
  {
    id: 1,
    name: 'HyperScale-UI',
    full_name: 'alexrivera/HyperScale-UI',
    html_url: '#',
    description: 'A modular design system for high-performance enterprise dashboard applications.',
    stargazers_count: 342,
    language: 'TypeScript',
    homepage: '#',
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'Quantum-Cluster',
    full_name: 'alexrivera/Quantum-Cluster',
    html_url: '#',
    description: 'Distributed computing orchestration layer for managing large-scale AI training workloads.',
    stargazers_count: 856,
    language: 'Go',
    homepage: '#',
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Neo-Vision',
    full_name: 'alexrivera/Neo-Vision',
    html_url: '#',
    description: 'Web-based computer vision engine for real-time object tracking and depth estimation.',
    stargazers_count: 124,
    language: 'Python',
    homepage: '#',
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Aura-Frame',
    full_name: 'alexrivera/Aura-Frame',
    html_url: '#',
    description: 'Hardware-independent framework for creating cross-platform augmented reality experiences.',
    stargazers_count: 567,
    language: 'C++',
    homepage: '#',
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: 'Pulse-Engine',
    full_name: 'alexrivera/Pulse-Engine',
    html_url: '#',
    description: 'Real-time state synchronization engine for multi-agent systems and collaborative tools.',
    stargazers_count: 231,
    language: 'Rust',
    homepage: '#',
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: 'Lumina-CSS',
    full_name: 'alexrivera/Lumina-CSS',
    html_url: '#',
    description: 'Zero-runtime utility-first CSS-in-JS library for ultra-fast component styling.',
    stargazers_count: 98,
    language: 'JavaScript',
    homepage: '#',
    updated_at: new Date().toISOString(),
  }
];

export const MOCK_SKILLS = [
  'React', 'TypeScript', 'Next.js', 'Framer Motion', 'Tailwind CSS', 'Node.js', 
  'GraphQL', 'PostgreSQL', 'Docker', 'AWS', 'Python', 'Go'
];

export const MOCK_EXPERIENCES: Experience[] = [
  {
    id: 'exp1',
    company: 'Nova Labs',
    position: 'Creative Technologist',
    startDate: '2021',
    endDate: 'Present',
    description: 'Leading the design system team and architecture for decentralized AI collaborative platforms.',
    isCurrent: true,
  },
  {
    id: 'exp2',
    company: 'Synergy Int.',
    position: 'Senior UI/UX Engineer',
    startDate: '2018',
    endDate: '2021',
    description: 'Developed and scaled the main interface for a global supply chain monitoring system used by 50 Fortune 500 companies.',
    isCurrent: false,
  }
];

export const MOCK_EDUCATION: Education[] = [
  {
    id: 'edu1',
    school: 'Stanford University',
    degree: 'Master of Science',
    fieldOfStudy: 'Computer Science & HCI',
    startDate: '2016',
    endDate: '2018',
  }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: 't1',
    name: 'Sarah Chen',
    role: 'Product Lead @ Meta',
    content: 'Alex has an uncanny ability to combine cutting-edge technical architecture with world-class design aesthetics. A rare talent in the industry.',
    isApproved: true,
    isFeatured: true,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  },
  {
    id: 't2',
    name: 'Marcus Thorne',
    role: 'Senior CTO @ Stripe',
    content: 'The systems Alex builds are not just functional; they are beautiful, performant, and truly visionary. Highly recommended.',
    isApproved: true,
    isFeatured: true,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
  }
];

export const MOCK_ASSETS: Asset[] = [
  {
    id: 'a1',
    name: 'Case_Study_Nova.pdf',
    url: '#',
    type: 'pdf',
    size: 2048,
  },
  {
    id: 'a2',
    name: 'Design_System_Specs.zip',
    url: '#',
    type: 'zip',
    size: 10240,
  }
];
