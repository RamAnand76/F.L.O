'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { TEMPLATES } from '@/lib/templates';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Globe, Lock } from 'lucide-react';

export default function PublicProfilePage() {
  const { username } = useParams();
  const router = useRouter();
  const { fetchInitialData, githubUser, selectedTemplate, isPublished, isAuthenticated } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // In a real production app, we would fetch the user's data by username from a public API.
      // For this local demo, we use the store which simulates the fetched public data.
      await fetchInitialData();
      setLoading(false);
    };
    loadData();
  }, [fetchInitialData]);

  const TemplateComponent = useMemo(() => {
    return TEMPLATES.find(t => t.id === selectedTemplate)?.component;
  }, [selectedTemplate]);

  // If not published AND we are not the owner, show 404/Private
  // (In a real app, the backend would handle this, but we simulate it here)
  if (!loading && !isPublished && githubUser?.login !== username) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-8">
          <Lock className="w-10 h-10 text-zinc-500" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Portfolio Private</h1>
        <p className="text-zinc-400 max-w-md mb-8">
          This portfolio exists but has not been published to the live web yet.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all"
        >
          Back to F.L.O
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
          <p className="text-zinc-500 font-medium">Accessing Portfolio...</p>
        </div>
      </div>
    );
  }

  if (!TemplateComponent) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-white">Template not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Small floating "Owner" indicator if we are the owner viewing our live site */}
      {githubUser?.login === username && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-3 px-4 py-2 bg-zinc-900/80 border border-white/10 rounded-full backdrop-blur-md shadow-2xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Live View</span>
          </div>
          <div className="w-[1px] h-3 bg-white/10" />
          <button 
            onClick={() => router.push('/folio-control')}
            className="text-[10px] font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-widest"
          >
            Dashboard
          </button>
        </div>
      )}
      <TemplateComponent />
    </div>
  );
}
