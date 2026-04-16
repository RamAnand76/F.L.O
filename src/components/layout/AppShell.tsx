'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { TopNav } from '@/components/layout/TopNav';
import { Dock } from '@/components/layout/Dock';
import { useStore } from '@/store/useStore';
import { apiClient } from '@/lib/api-client';
import { cn } from '@/lib/utils';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const githubUser = useStore((state) => state.githubUser);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  const fetchInitialData = useStore((state) => state.fetchInitialData);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const hasFetchedInitialData = useStore((state) => state.hasFetchedInitialData);

  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // On mount: validate that we have an actual token, not just a stale Zustand flag
  useEffect(() => {
    if (typeof window === 'undefined' || !mounted) return;
    
    const token = apiClient.getToken();

    if (isAuthenticated && !token) {
      // Stale state: Zustand says logged in, but JWT is gone
      console.warn('[AppShell] Stale auth state detected. Resetting.');
      setIsAuthenticated(false);
      return;
    }

    if (isAuthenticated && githubUser && token && !hasFetchedInitialData) {
      fetchInitialData();
    }
  }, [isAuthenticated, githubUser, hasFetchedInitialData, fetchInitialData, setIsAuthenticated, mounted]);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated && pathname !== '/auth') {
      router.push('/auth');
    } else if (isAuthenticated && !githubUser && pathname !== '/connect') {
      router.push('/connect');
    }
  }, [isAuthenticated, githubUser, pathname, router, mounted]);

  // Hide the shell completely if we're on the auth page or not authenticated yet
  // This helps avoid layout shifts
  const isAuthPage = pathname === '/auth' || pathname === '/connect';
  
  // Public portfolio routes should be isolated from the dashboard shell
  const isPublicPortfolio = pathname !== '/' && pathname?.split('/').length === 2 && !['auth', 'connect', 'folio-control', 'templates', 'preview', 'profile', 'settings', 'inbox', 'seo', 'blog', 'review'].includes(pathname.split('/')[1]);

  if (isPublicPortfolio) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans overflow-x-hidden selection:bg-indigo-500/30">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>

      </div>
    );
  }

  const isEditingBlog = useStore((state) => state.isEditingBlog);
  const isFullWidthPage = isPublicPortfolio || ['preview', 'templates'].some(p => pathname?.includes(p)) || isEditingBlog;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans overflow-x-hidden selection:bg-indigo-500/30">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950" />
      
      <main className={cn(
        "relative w-full mx-auto transition-all duration-500 min-h-screen",
        (!isFullWidthPage && !isEditingBlog) ? "max-w-7xl px-4 sm:px-6 lg:px-8 pt-24 pb-32 z-10" : "max-w-none px-0 pt-24 pb-0 z-10"
      )}
      style={(!isFullWidthPage && !isEditingBlog) ? { fontSize: '80%' } : {}}>

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={isEditingBlog ? { opacity: 0 } : { opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={isEditingBlog ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={isEditingBlog ? { opacity: 0 } : { opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
        {!isAuthPage && <TopNav />}
      </main>


      {!isAuthPage && githubUser && <Dock />}



    </div>
  );
}
