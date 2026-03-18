
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { githubService } from '@/services/github.service';
import { profileService } from '@/services/profile.service';
import { portfolioService } from '@/services/portfolio.service';
import { apiClient } from '@/lib/api-client';

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
    description?: string;
    bio: string;
    email: string;
    location: string;
    website: string;
    github: string;
    twitter: string;
    linkedin: string;
    role?: string;
  };
  setIsAuthenticated: (val: boolean) => void;
  setGithubUser: (user: GithubUser | null) => void;
  setRepos: (repos: Repository[]) => void;
  toggleRepoSelection: (id: number) => void;
  setSkills: (skills: string[]) => void;
  setSelectedTemplate: (template: 'minimal' | 'developer' | 'creative') => void;
  updateCustomData: (data: Partial<AppState['customData']>) => void;
  enhanceWithAI: (field: string, prompt: string) => Promise<void>;
  saveProfile: () => Promise<void>;
  savePortfolioSettings: () => Promise<void>;
  disconnect: () => void;
  fetchInitialData: () => Promise<void>;
  hasFetchedInitialData: boolean;
}

import { aiService } from '@/services/ai.service';

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      hasFetchedInitialData: false,
      githubUser: null,
      repos: [],
      selectedRepoIds: [],
      skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
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
        }
      })),
      setRepos: (repos) => set({ repos: repos || [], selectedRepoIds: (repos || []).slice(0, 6).map(r => r.id) }),
      toggleRepoSelection: (id) => {
        const { selectedRepoIds } = get();
        const newSelected = selectedRepoIds.includes(id)
          ? selectedRepoIds.filter(repoId => repoId !== id)
          : [...selectedRepoIds, id];
        set({ selectedRepoIds: newSelected });
        get().savePortfolioSettings();
      },
      setSkills: (skills) => {
        set({ skills });
        get().savePortfolioSettings();
      },
      setSelectedTemplate: (template) => {
        set({ selectedTemplate: template });
        get().savePortfolioSettings();
      },
      updateCustomData: (data) => set((state) => ({ customData: { ...state.customData, ...data } })),
      
      enhanceWithAI: async (field, prompt) => {
        const { customData } = get();
        const currentValue = (customData as any)[field] || '';
        try {
          const response = await aiService.enhanceText(prompt, field, currentValue);
          if (response.enhancedText) {
            get().updateCustomData({ [field]: response.enhancedText });
          }
        } catch (error) {
          console.error('AI enhancement failed:', error);
          throw error;
        }
      },
      
      saveProfile: async () => {
        const { customData } = get();
        try {
          const response = await profileService.updateProfile(customData);
          // Map back prefixed fields from Prisma model response if needed
          if (response.customName !== undefined) {
             set((state) => ({
               customData: {
                 ...state.customData,
                 name: response.customName || '',
                 bio: response.customBio || '',
                 email: response.customEmail || '',
                 location: response.customLocation || '',
                 website: response.customWebsite || '',
                 github: response.customGithub || '',
                 twitter: response.customTwitter || '',
                 linkedin: response.customLinkedin || '',
               }
             }));
          }
        } catch (error) {
          console.error('Failed to save profile:', error);
        }
      },

      savePortfolioSettings: async () => {
        const { selectedRepoIds, skills, selectedTemplate } = get();
        try {
          await portfolioService.updateRepos(selectedRepoIds);
          await portfolioService.updateSkills(skills);
          await portfolioService.updateTemplate(selectedTemplate);
        } catch (error) {
          console.error('Failed to save portfolio settings:', error);
        }
      },

      fetchInitialData: async () => {
        // Use a dedicated flag rather than githubUser to prevent duplicate fetches
        const { hasFetchedInitialData } = get();
        if (hasFetchedInitialData) return;

        try {
          // GET /portfolio returns the most complete state now including custom fields
          const portfolio = await portfolioService.getSettings();
          const githubProfile = await githubService.getProfile();
          if (!portfolio) throw new Error('Portfolio settings not found');
          if (!githubProfile) throw new Error('GitHub profile not found');

          // Backend GET /github/profile returns { user: {...}, repos: [...] }
          const { user, repos: ghRepos } = githubProfile;

          set({
            customData: {
              name: portfolio.customName || portfolio.name || '',
              bio: portfolio.customBio || portfolio.bio || '',
              email: portfolio.customEmail || portfolio.email || '',
              location: portfolio.customLocation || portfolio.location || '',
              website: portfolio.customWebsite || portfolio.website || '',
              github: portfolio.customGithub || portfolio.github || '',
              twitter: portfolio.customTwitter || portfolio.twitter || '',
              linkedin: portfolio.customLinkedin || portfolio.linkedin || '',
            },
            selectedRepoIds: portfolio.selectedRepoIds || [],
            skills: portfolio.skills || [],
            selectedTemplate: portfolio.selectedTemplate || 'minimal',
            githubUser: {
               login: user.login,
               id: user.id,
               name: user.name,
               bio: user.bio,
               avatar_url: user.avatar_url,
               html_url: user.html_url,
               company: user.company,
               blog: user.blog,
               location: user.location,
               email: user.email,
               public_repos: user.public_repos,
               followers: user.followers,
               following: user.following,
            },
            repos: (ghRepos || []).map((r: any) => ({
              id: r.id,
              name: r.name,
              full_name: r.full_name,
              html_url: r.html_url,
              description: r.description,
              language: r.language,
              stargazers_count: r.stargazers_count || 0,
              homepage: r.homepage,
              updated_at: r.updated_at || new Date().toISOString(),
            })),
            isAuthenticated: true,
            hasFetchedInitialData: true,
          });
        } catch (error) {
          console.error('Failed to fetch initial data:', error);
        }
      },

      disconnect: () => {
        githubService.disconnect();
        apiClient.clearToken();
        set({ 
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
          isAuthenticated: false,
          hasFetchedInitialData: false,
        });
      },
    }),
    {
      name: 'flo-storage',
    }
  )
);
