'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { ArrowLeft, ArrowRight, HelpCircle, Loader2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { authService } from '@/services/auth.service';
import { apiClient } from '@/lib/api-client';
import { SpeedometerLoader } from '@/components/ui/SpeedometerLoader';
import { useToast } from '@/components/ui/Toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const router = useRouter();
  const { toast } = useToast();

  const fetchInitialData = useStore((state) => state.fetchInitialData);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    try {
      let response;
      if (isLogin) {
        response = await authService.login({ email, password });
      } else {
        response = await authService.register({ name, email, password });
      }

      // Verify the token was actually saved before proceeding
      const savedToken = apiClient.getToken();
      if (!savedToken) {
        throw new Error('Login succeeded but no access token was returned. Please try again.');
      }

      console.log('[Auth] Token saved successfully, starting loader animation...');
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');

      // Pre-fetch initial data to see if user has already connected github
      await fetchInitialData();

      // Token is confirmed saved. NOW show the success animation.
      setShowLoader(true);
    } catch (error: any) {
      console.error('Auth error:', error);
      const message = error.message || 'Authentication failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoadingComplete = () => {
    setIsAuthenticated(true);
    const hasGithub = useStore.getState().githubUser !== null;
    if (hasGithub) {
      router.push('/');
    } else {
      router.push('/connect');
    }
  };

  if (showLoader) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <SpeedometerLoader onComplete={handleLoadingComplete} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-[1200px] h-[800px] max-h-[90vh] flex flex-col md:flex-row gap-8 md:gap-16 items-center">
        
        {/* Left Side: Image Panel */}
        <motion.div 
          className="hidden md:flex flex-1 h-full relative rounded-[2rem] overflow-hidden shadow-2xl"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop" 
            alt="Abstract landscape" 
            className="absolute inset-0 w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
          
          <div className="absolute top-8 left-8 flex items-center gap-2">
            <span className="text-2xl font-semibold tracking-tight">Gen</span>
            <div className="px-2 py-0.5 border border-white/30 rounded-md backdrop-blur-md bg-white/10 flex items-center justify-center">
              <span className="text-sm font-medium">AI</span>
            </div>
          </div>

          <div className="absolute bottom-8 left-8 text-xs text-white/50">
            Image generated using AI Model
          </div>
        </motion.div>

        {/* Right Side: Form Panel */}
        <motion.div 
          className="flex-1 w-full max-w-[480px] flex flex-col justify-center"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? 'login' : 'register'}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.1] mb-12">
                {isLogin ? 'Welcome Back to Unleash Your Dreams' : 'Create Your Account to Unleash Your Dreams'}
              </h1>

              <div className="flex items-center justify-between mb-8">
                <button 
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  <ArrowLeft className="w-5 h-5 text-zinc-400" />
                </button>
                <div className="text-sm text-zinc-400 flex items-center gap-2">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="px-4 py-1.5 rounded-full bg-[#1e1e1e] border border-white/10 text-white hover:bg-[#2a2a2a] transition-colors font-medium"
                  >
                    {isLogin ? 'Sign up' : 'Log in'}
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="relative group">
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      required
                      className="w-full bg-[#18181b] border border-emerald-500/30 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500/60 transition-all shadow-[0_0_15px_-3px_rgba(16,185,129,0.1)]"
                    />
                  </div>
                )}
                
                <div className="relative group">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email address"
                    required
                    className="w-full bg-[#18181b] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition-all"
                  />
                </div>

                <div className="relative group">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full bg-[#18181b] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-white/20 transition-all"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-3 text-zinc-500">
                    <button type="button" className="hover:text-zinc-300 transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                    </button>
                    <button type="button" className="hover:text-zinc-300 transition-colors">
                      <HelpCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-gradient-to-r from-zinc-300 to-zinc-400 hover:from-white hover:to-zinc-200 text-black rounded-2xl px-5 py-4 font-medium flex items-center justify-center relative transition-all group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>{isLogin ? 'Log In' : 'Start Creating'}</span>
                      <div className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors absolute right-4">
                        <ArrowRight className="w-4 h-4 text-black" />
                      </div>
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-xs mt-1">
                        <XCircle className="w-4 h-4 shrink-0 text-red-400" />
                        <span>{error}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>

              <div className="mt-8 text-[11px] text-zinc-500 leading-relaxed max-w-[400px]">
                By signing in, you agree to Generative AI's <a href="#" className="underline hover:text-zinc-300">Terms of Service</a>, <br/>
                <a href="#" className="underline hover:text-zinc-300">Privacy Policy</a> and <a href="#" className="underline hover:text-zinc-300">Data Usage Properties</a>.
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
