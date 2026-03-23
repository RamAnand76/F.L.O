
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { githubService } from '@/services/github.service';
import { profileService, Education, Experience } from '@/services/profile.service';
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
  education: Education[];
  experiences: Experience[];
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
  repoPagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
  } | null;
  setRepoPagination: (pagination: AppState['repoPagination']) => void;
  setIsAuthenticated: (val: boolean) => void;
  setGithubUser: (user: GithubUser | null) => void;
  setRepos: (repos: Repository[]) => void;
  toggleRepoSelection: (id: number) => void;
  setSkills: (skills: string[]) => void;
  setSelectedTemplate: (template: 'minimal' | 'developer' | 'creative') => void;
  updateCustomData: (data: Partial<AppState['customData']>) => void;
  enhanceWithAI: (field: string, prompt: string) => Promise<void>;
  saveProfile: () => Promise<void>;
  disconnect: () => void;
  fetchInitialData: () => Promise<void>;
  fetchMoreRepos: (page: number) => Promise<void>;
  
  // Professional Profile actions
  fetchProfile: () => Promise<void>;
  syncGithubProfile: () => Promise<void>;
  importResume: (file: File) => Promise<void>;
  addEducation: (data: Omit<Education, 'id'>) => Promise<void>;
  updateEducation: (id: string, data: Partial<Education>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  addExperience: (data: Omit<Experience, 'id'>) => Promise<void>;
  updateExperience: (id: string, data: Partial<Experience>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  
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
      repoPagination: null,
      selectedRepoIds: [],
      skills: ['React', 'TypeScript', 'Node.js', 'Tailwind CSS'],
      education: [],
      experiences: [],
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
      setRepoPagination: (pagination) => set({ repoPagination: pagination }),
      setRepos: (repos) => {
        const newSelected = (repos || []).slice(0, 6).map((r: any) => r.id);
        set({ repos: repos || [], selectedRepoIds: newSelected });
        portfolioService.updateRepos(newSelected).catch(err => console.error('Failed to init repos:', err));
      },
      toggleRepoSelection: (id) => {
        const { selectedRepoIds } = get();
        const newSelected = selectedRepoIds.includes(id)
          ? selectedRepoIds.filter(repoId => repoId !== id)
          : [...selectedRepoIds, id];
        set({ selectedRepoIds: newSelected });
        portfolioService.updateRepos(newSelected).catch(err => console.error('Failed to update repos:', err));
      },
      setSkills: (skills) => {
        set({ skills });
        portfolioService.updateSkills(skills).catch(err => console.error('Failed to update skills:', err));
      },
      setSelectedTemplate: (template) => {
        set({ selectedTemplate: template });
        portfolioService.updateTemplate(template).catch(err => console.error('Failed to update template:', err));
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

      fetchInitialData: async () => {
        // Use a dedicated flag rather than githubUser to prevent duplicate fetches
        const { hasFetchedInitialData } = get();
        if (hasFetchedInitialData) return;

        try {
          // GET /portfolio returns the most complete state now including custom fields
          const portfolio = await portfolioService.getSettings();
          const githubProfile = await githubService.getProfile(1, 10);
          if (!portfolio) throw new Error('Portfolio settings not found');
          if (!githubProfile) throw new Error('GitHub profile not found');

          // Backend GET /github/profile returns { user: {...}, repos: [...], pagination: {...} }
          const { user, repos: ghRepos, pagination } = githubProfile;

          set({
            customData: {
              name: portfolio.customName || portfolio.name || user.name || user.login || '',
              bio: portfolio.customBio || portfolio.bio || user.bio || '',
              email: portfolio.customEmail || portfolio.email || user.email || '',
              location: portfolio.customLocation || portfolio.location || user.location || '',
              website: portfolio.customWebsite || portfolio.website || user.blog || '',
              github: portfolio.customGithub || portfolio.github || user.html_url || '',
              twitter: portfolio.customTwitter || portfolio.twitter || user.twitter_username || '',
              linkedin: portfolio.customLinkedin || portfolio.linkedin || '',
            },
            selectedRepoIds: (portfolio.selectedRepoIds && portfolio.selectedRepoIds.length > 0) 
              ? portfolio.selectedRepoIds 
              : (ghRepos || []).slice(0, 6).map((r: any) => r.id),
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
            repoPagination: pagination || null,
            isAuthenticated: true,
            hasFetchedInitialData: true,
          });
        } catch (error) {
          console.error('Failed to fetch initial data:', error);
        }
      },

      fetchMoreRepos: async (page: number) => {
        try {
          const response = await githubService.getRepos(page, 10);
          // Depending on API, response might just be { repos, pagination } or wrapped identically
          const reposRaw = response.repos || response;
          const pagination = response.pagination || null;

          const newRepos = (reposRaw || []).map((r: any) => ({
              id: r.id,
              name: r.name,
              full_name: r.full_name,
              html_url: r.html_url,
              description: r.description,
              language: r.language,
              stargazers_count: r.stargazers_count || 0,
              homepage: r.homepage,
              updated_at: r.updated_at || new Date().toISOString(),
          }));

          // Avoid duplicating repos
          set((state) => {
            const existingIds = new Set(state.repos.map(r => r.id));
            const uniqueNew = newRepos.filter((r: any) => !existingIds.has(r.id));
            return {
              repos: [...state.repos, ...uniqueNew],
              // Only update pagination if backend provided it
              repoPagination: pagination || state.repoPagination 
            };
          });
        } catch (error) {
          console.error('Failed to fetch more repos:', error);
        }
      },

      fetchProfile: async () => {
        try {
          const profile = await profileService.getProfile();
          set({ 
            education: profile.education || [], 
            experiences: profile.experience || [] 
          });
        } catch (error) {
          console.error('Failed to fetch profile:', error);
        }
      },

      syncGithubProfile: async () => {
        try {
          await profileService.syncGithub();
          await get().fetchProfile();
        } catch (error) {
          console.error('Failed to sync github profile:', error);
          throw error;
        }
      },

      importResume: async (file: File) => {
        try {
          await profileService.importResume(file);
          await get().fetchProfile();
        } catch (error) {
          console.error('Failed to import resume:', error);
          throw error;
        }
      },

      addEducation: async (data) => {
        try {
          await profileService.addEducation(data);
          await get().fetchProfile();
        } catch (error) {
          console.error('Failed to add education:', error);
          throw error;
        }
      },

      updateEducation: async (id, data) => {
        try {
          await profileService.updateEducation(id, data);
          await get().fetchProfile();
        } catch (error) {
          console.error('Failed to update education:', error);
          throw error;
        }
      },

      deleteEducation: async (id) => {
        try {
          await profileService.deleteEducation(id);
          set((state) => ({
            education: state.education.filter(e => e.id !== id)
          }));
        } catch (error) {
          console.error('Failed to delete education:', error);
          throw error;
        }
      },

      addExperience: async (data) => {
        try {
          await profileService.addExperience(data);
          await get().fetchProfile();
        } catch (error) {
          console.error('Failed to add experience:', error);
          throw error;
        }
      },

      updateExperience: async (id, data) => {
        try {
          await profileService.updateExperience(id, data);
          await get().fetchProfile();
        } catch (error) {
          console.error('Failed to update experience:', error);
          throw error;
        }
      },

      deleteExperience: async (id) => {
        try {
          await profileService.deleteExperience(id);
          set((state) => ({
            experiences: state.experiences.filter(e => e.id !== id)
          }));
        } catch (error) {
          console.error('Failed to delete experience:', error);
          throw error;
        }
      },

      disconnect: () => {
        // Run async but catch errors so they don't bubble up as unhandled promise rejections
        githubService.disconnect().catch(err => console.warn('Backend disconnect failed or aborted:', err));
        
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
      name: 'flo-storage-v2',
      partialize: (state) => ({ ...state, hasFetchedInitialData: false })
    }
  )
);
