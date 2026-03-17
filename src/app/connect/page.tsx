'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useRouter } from 'next/navigation';
import { Github, ArrowRight, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { githubService } from '@/services/github.service';
import { apiClient } from '@/lib/api-client';
import { useToast } from '@/components/ui/Toast';

export default function ConnectGithubPage() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const setGithubUser = useStore((state) => state.setGithubUser);
  const setRepos = useStore((state) => state.setRepos);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);

  useEffect(() => {
    const token = apiClient.getToken();

    if (!isAuthenticated || !token) {
      if (isAuthenticated && !token) {
        console.warn('[Connect] Stale auth state detected. Resetting.');
        setIsAuthenticated(false);
      }
      window.location.href = '/auth';
    }
  }, [isAuthenticated, setIsAuthenticated]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');

    try {
      console.log('[Connect] Calling /github/connect...');
      await githubService.connectAccount(username);

      let profile: any;
      try {
        profile = await githubService.getProfile();
      } catch (profileErr: any) {
        console.error('[Connect] Failed to fetch profile after connect:', profileErr);
        // Connect succeeded but profile fetch failed — still proceed with what we have
        toast.warning('Connected, but could not load full profile. You can refresh later.');
        setGithubUser({ login: username, name: username } as any);
        setRepos([]);
        router.push('/');
        return;
      }

      const githubUser = {
        login: profile.githubLogin || username,
        name: profile.name || username,
        bio: profile.bio || '',
        avatar_url: profile.avatarUrl || '',
      };

      const repositories = profile.repositories || [];
      const repos = repositories.map((repo: any) => ({
        id: repo.githubRepoId || repo.id || 0,
        name: repo.name || 'unknown',
        full_name: `${profile.githubLogin || username}/${repo.name || 'unknown'}`,
        language: repo.language || null,
        description: repo.description || null,
        stargazers_count: repo.stargazers_count || repo.stars || 0,
        updated_at: repo.updated_at || repo.updatedAt || new Date().toISOString(),
        html_url: repo.html_url || '',
        homepage: repo.homepage || null,
      }));

      setGithubUser(githubUser as any);
      setRepos(repos);

      toast.success(`Connected as ${githubUser.login}! Found ${repos.length} repositories.`);
      router.push('/');
    } catch (err: any) {
      console.error('[Connect] Error:', err);
      const message = err.message || 'Failed to connect GitHub account.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Don't render the page if there's no valid auth
  const token = apiClient.getToken();
  if (!isAuthenticated || !token) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      
      <motion.div 
        className="relative z-10 w-full max-w-md p-8 bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-inner">
            <Github className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight mb-2">Connect to F.L.O</h1>
          <p className="text-zinc-400 text-sm">Enter your GitHub username to instantly generate your professional portfolio.</p>
        </div>

        <form onSubmit={handleConnect} className="space-y-4">
          <div>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="github-username"
                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all"
                disabled={loading}
              />
            </div>
            {error && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="text-red-400 text-xs mt-2 ml-1"
              >
                {error}
              </motion.p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !username.trim()}
            className="w-full flex items-center justify-center gap-2 bg-white text-black font-medium rounded-xl px-4 py-3.5 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Continue <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-xs text-zinc-500">
            By connecting, you allow F.L.O to fetch your public GitHub data. No write access is requested.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

