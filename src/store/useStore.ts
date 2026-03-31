
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { githubService } from '@/services/github.service';
import { profileService, Education, Experience } from '@/services/profile.service';
import { portfolioService } from '@/services/portfolio.service';
import { testimonialsService, Testimonial } from '@/services/testimonials.service';
import { assetsService, Asset } from '@/services/assets.service';
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
  twitter_username?: string | null;
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
  testimonials: Testimonial[];
  assets: Asset[];
  selectedTemplate: 'minimal' | 'developer' | 'creative' | 'saas' | 'brutalist' | 'dominic' | 'vanshika' | 'folioblox' | 'futuristic';
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
  notifications: Array<{ id: string; message: string; type: 'success' | 'error' | 'info' }>;
  addNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeNotification: (id: string) => void;
  isPublished: boolean;
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
  setSelectedTemplate: (template: 'minimal' | 'developer' | 'creative' | 'saas' | 'brutalist' | 'dominic' | 'vanshika' | 'folioblox' | 'futuristic') => void;
  updateCustomData: (data: Partial<AppState['customData']>) => void;
  enhanceWithAI: (field: string, prompt: string) => Promise<void>;
  saveProfile: () => Promise<void>;
  disconnect: () => void;
  logout: () => void;
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
  
  // Testimonials actions
  fetchTestimonials: () => Promise<void>;
  fetchPublicTestimonials: (username: string) => Promise<void>;
  addTestimonial: (data: Omit<Testimonial, 'id'>) => Promise<void>;
  updateTestimonial: (id: string, data: Partial<Testimonial>) => Promise<void>;
  approveTestimonial: (id: string) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;

  // Assets actions
  fetchAssets: (type?: string, sortBy?: string) => Promise<void>;
  uploadAsset: (file: File) => Promise<void>;
  deleteAsset: (id: string) => Promise<void>;
  
  publishPortfolio: (published: boolean) => Promise<void>;
  
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
      testimonials: [],
      assets: [],
      isPublished: false,
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
      notifications: [],
      addNotification: (message, type = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          notifications: [...state.notifications, { id, message, type }]
        }));
        setTimeout(() => get().removeNotification(id), 5000);
      },
      removeNotification: (id) => set((state) => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),
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
          if (!portfolio) throw new Error('Portfolio settings not found');

          let ghUserToSave = null;
          let ghReposToSave: any[] = [];
          let ghPagination = null;

          try {
            const githubProfile = await githubService.getProfile(1, 10);
            if (githubProfile) {
              const { user, repos: ghRepos, pagination } = githubProfile;
              ghUserToSave = {
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
                 twitter_username: user.twitter_username,
              };
              ghReposToSave = (ghRepos || []).map((r: any) => ({
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
              ghPagination = pagination || null;
            }
          } catch (ghErr: any) {
            // Usually a 404 if GitHub is not connected yet. We swallow the error to avoid the Next.js Dev Overlay
            console.warn('[Store] GitHub profile not found or not connected yet. Proceeding with basic portfolio data.');
          }

          set({
            customData: {
              name: portfolio.customName || portfolio.name || ghUserToSave?.name || ghUserToSave?.login || '',
              bio: portfolio.customBio || portfolio.bio || ghUserToSave?.bio || '',
              email: portfolio.customEmail || portfolio.email || ghUserToSave?.email || '',
              location: portfolio.customLocation || portfolio.location || ghUserToSave?.location || '',
              website: portfolio.customWebsite || portfolio.website || ghUserToSave?.blog || '',
              github: portfolio.customGithub || portfolio.github || ghUserToSave?.html_url || '',
              twitter: portfolio.customTwitter || portfolio.twitter || ghUserToSave?.twitter_username || '',
              linkedin: portfolio.customLinkedin || portfolio.linkedin || '',
            },
            selectedRepoIds: (portfolio.selectedRepoIds && portfolio.selectedRepoIds.length > 0) 
              ? portfolio.selectedRepoIds 
              : ghReposToSave.slice(0, 6).map((r: any) => r.id),
            skills: portfolio.skills || [],
            selectedTemplate: portfolio.selectedTemplate || 'minimal',
            isPublished: portfolio.isPublished || false,
            githubUser: ghUserToSave,
            repos: ghReposToSave,
            repoPagination: ghPagination,
            isAuthenticated: true,
            hasFetchedInitialData: true,
          });

          // Also fetch full profile (education/experience)
          try {
            await get().fetchProfile();
          } catch (profErr) {
            console.warn('[Store] Failed to fetch professional profile:', profErr);
          }
        } catch (error: any) {
          console.warn('[Store] Failed to fetch initial data:', error.message || error);
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
          console.warn('Failed to fetch profile:', error instanceof Error ? error.message : String(error));
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

      fetchTestimonials: async () => {
        try {
          const testimonials = await testimonialsService.getAll();
          set({ testimonials });
        } catch (error) {
          console.warn('Failed to fetch testimonials:', error instanceof Error ? error.message : String(error));
        }
      },

      fetchPublicTestimonials: async (username: string) => {
        try {
          const testimonials = await testimonialsService.getPublic(username);
          set({ testimonials });
        } catch (error) {
          console.warn('Failed to fetch public testimonials:', error instanceof Error ? error.message : String(error));
        }
      },

      addTestimonial: async (data) => {
        try {
          await testimonialsService.create(data);
          await get().fetchTestimonials();
        } catch (error) {
          console.error('Failed to add testimonial:', error);
          throw error;
        }
      },

      updateTestimonial: async (id, data) => {
        try {
          await testimonialsService.update(id, data);
          await get().fetchTestimonials();
        } catch (error) {
          console.error('Failed to update testimonial:', error);
          throw error;
        }
      },

      approveTestimonial: async (id) => {
        try {
          await testimonialsService.approve(id);
          await get().fetchTestimonials();
        } catch (error) {
          console.error('Failed to approve testimonial:', error);
          throw error;
        }
      },

      deleteTestimonial: async (id) => {
        try {
          await testimonialsService.delete(id);
          set((state) => ({ testimonials: state.testimonials.filter(t => t.id !== id) }));
        } catch (error) {
          console.error('Failed to delete testimonial:', error);
          throw error;
        }
      },

      fetchAssets: async (type?, sortBy?) => {
        try {
          const assets = await assetsService.getAll(type, sortBy);
          set({ assets });
        } catch (error) {
          console.warn('Failed to fetch assets:', error instanceof Error ? error.message : String(error));
        }
      },

      uploadAsset: async (file) => {
        try {
          await assetsService.upload(file);
          await get().fetchAssets();
        } catch (error) {
          console.error('Failed to upload asset:', error);
          throw error;
        }
      },

      deleteAsset: async (id) => {
        try {
          await assetsService.delete(id);
          set((state) => ({ assets: state.assets.filter(a => a.id !== id) }));
        } catch (error) {
          console.error('Failed to delete asset:', error);
          throw error;
        }
      },
      
      publishPortfolio: async (published) => {
        try {
          await portfolioService.publish(published);
          set({ isPublished: published });
        } catch (error) {
          console.error('Failed to publish portfolio:', error);
          throw error;
        }
      },

      logout: () => {
        apiClient.clearToken();
        set({ 
          githubUser: null, 
          repos: [], 
          selectedRepoIds: [], 
          skills: [], 
          education: [], 
          experiences: [],
          testimonials: [],
          assets: [],
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
          repoPagination: null
        });
      },

      disconnect: () => {
        githubService.disconnect().catch(err => console.warn('Backend disconnect failed or aborted:', err));
        get().logout();
      },
    }),
    {
      name: 'flo-storage-v5', // Changed version to clear current stale data
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated,
        githubUser: state.githubUser,
        selectedRepoIds: state.selectedRepoIds,
        skills: state.skills,
        selectedTemplate: state.selectedTemplate,
        isPublished: state.isPublished,
        customData: state.customData,
      })
    }
  )
);
