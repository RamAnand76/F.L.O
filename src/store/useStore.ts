import { create } from 'zustand';

export interface GithubUser {
  login: string;
  id: number;
  avatar_url: string;
  html_url: string;
  name: string;
  company: string | null;
  blog: string;
  location: string | null;
  email: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
}

export interface Repository {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  homepage: string | null;
  updated_at: string;
}

interface AppState {
  isAuthenticated: boolean;
  githubUser: GithubUser | null;
  repos: Repository[];
  selectedRepoIds: number[];
  skills: string[];
  selectedTemplate: 'minimal' | 'developer' | 'creative';
  customData: {
    name: string;
    bio: string;
    email: string;
    location: string;
    website: string;
    github: string;
    twitter: string;
    linkedin: string;
  };
  setIsAuthenticated: (val: boolean) => void;
  setGithubUser: (user: GithubUser | null) => void;
  setRepos: (repos: Repository[]) => void;
  toggleRepoSelection: (id: number) => void;
  setSkills: (skills: string[]) => void;
  setSelectedTemplate: (template: 'minimal' | 'developer' | 'creative') => void;
  updateCustomData: (data: Partial<AppState['customData']>) => void;
  disconnect: () => void;
}

export const useStore = create<AppState>((set) => ({
  isAuthenticated: false,
  githubUser: null,
  repos: [],
  selectedRepoIds: [],
  skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'], // Default mock skills
  selectedTemplate: 'minimal',
  customData: {
    name: '',
    bio: '',
    email: '',
    location: '',
    website: '',
    github: '',
    twitter: '',
    linkedin: '',
  },
  setIsAuthenticated: (val) => set({ isAuthenticated: val }),
  setGithubUser: (user) => set((state) => ({ 
    githubUser: user,
    customData: {
      ...state.customData,
      name: user?.name || user?.login || '',
      bio: user?.bio || '',
      email: user?.email || '',
      location: user?.location || '',
      website: user?.blog || '',
      github: user?.html_url || '',
      twitter: '',
      linkedin: '',
    }
  })),
  setRepos: (repos) => set({ repos, selectedRepoIds: repos.slice(0, 6).map(r => r.id) }), // Select first 6 by default
  toggleRepoSelection: (id) => set((state) => ({
    selectedRepoIds: state.selectedRepoIds.includes(id)
      ? state.selectedRepoIds.filter(repoId => repoId !== id)
      : [...state.selectedRepoIds, id]
  })),
  setSkills: (skills) => set({ skills }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  updateCustomData: (data) => set((state) => ({ customData: { ...state.customData, ...data } })),
  disconnect: () => set({ 
    githubUser: null, 
    repos: [], 
    selectedRepoIds: [], 
    customData: { 
      name: '', 
      bio: '', 
      email: '', 
      location: '', 
      website: '', 
      github: '', 
      twitter: '', 
      linkedin: '' 
    }, 
    isAuthenticated: false 
  }),
}));
