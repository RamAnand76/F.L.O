import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Github, ArrowRight, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';

export function ConnectGithub() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const setGithubUser = useStore((state) => state.setGithubUser);
  const setRepos = useStore((state) => state.setRepos);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError('');

    try {
      // Fetch user profile
      const userRes = await fetch(`https://api.github.com/users/${username}`);
      if (!userRes.ok) {
        throw new Error(userRes.status === 404 ? 'User not found' : 'Failed to fetch user');
      }
      const userData = await userRes.json();

      // Fetch user repos
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`);
      if (!reposRes.ok) {
        throw new Error('Failed to fetch repositories');
      }
      const reposData = await reposRes.json();

      // Filter out forks and uninteresting repos
      const filteredRepos = reposData.filter((r: any) => !r.fork && r.description).slice(0, 20);

      setGithubUser(userData);
      setRepos(filteredRepos);
      
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white relative overflow-hidden">
      {/* Background effects */}
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
