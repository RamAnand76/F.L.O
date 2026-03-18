'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { TopNav } from '@/components/layout/TopNav';
import { Dock } from '@/components/layout/Dock';
import { useStore } from '@/store/useStore';
import { apiClient } from '@/lib/api-client';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const githubUser = useStore((state) => state.githubUser);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  const fetchInitialData = useStore((state) => state.fetchInitialData);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const hasFetchedInitialData = useStore((state) => state.hasFetchedInitialData);

  // On mount: validate that we have an actual token, not just a stale Zustand flag
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
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
  }, [isAuthenticated, githubUser, hasFetchedInitialData, fetchInitialData, setIsAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated && pathname !== '/auth') {
      router.push('/auth');
    } else if (isAuthenticated && !githubUser && pathname !== '/connect') {
      router.push('/connect');
    }
  }, [isAuthenticated, githubUser, pathname, router]);

  // Hide the shell completely if we're on the auth page or not authenticated yet
  // This helps avoid layout shifts
  const isAuthPage = pathname === '/auth' || pathname === '/connect';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans overflow-x-hidden selection:bg-indigo-500/30">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950" />
      
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32 min-h-screen">
        {!isAuthPage && <TopNav />}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {!isAuthPage && githubUser && <Dock />}
    </div>
  );
}
