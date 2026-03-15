import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Dock } from './Dock';
import { TopNav } from './TopNav';
import { useStore } from '@/store/useStore';

export function Layout() {
  const githubUser = useStore((state) => state.githubUser);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated && location.pathname !== '/auth') {
    return <Navigate to="/auth" replace />;
  }

  if (isAuthenticated && !githubUser && location.pathname !== '/connect') {
    return <Navigate to="/connect" replace />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans overflow-x-hidden selection:bg-indigo-500/30">
      {/* Subtle background gradient */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-zinc-950 to-zinc-950" />
      
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32 min-h-screen">
        <TopNav />
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {githubUser && <Dock />}
    </div>
  );
}
