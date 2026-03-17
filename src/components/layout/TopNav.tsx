'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Bell, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function TopNav() {
  const githubUser = useStore((state) => state.githubUser);
  const pathname = usePathname();

  if (!githubUser) return null;

  if (pathname === '/profile' || pathname === '/preview') {
    return null;
  }

  return (
    <div className="fixed top-6 right-4 sm:right-6 lg:right-8 z-[100] flex items-center gap-2 sm:gap-3">
      <button className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#18181b]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white hover:bg-[#27272a] transition-all shadow-lg relative group">
        <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-emerald-400 rounded-full border-2 border-[#18181b] group-hover:scale-110 transition-transform"></span>
      </button>
      <div className="flex items-center gap-2 sm:gap-3 bg-[#18181b]/80 backdrop-blur-md border border-white/10 rounded-full pl-1 pr-3 sm:pr-4 py-1 shadow-lg cursor-pointer hover:bg-[#27272a] transition-all group">
        <div className="relative">
          {githubUser?.avatar_url && (
            <img src={githubUser.avatar_url} className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-white/10 group-hover:border-white/30 transition-colors" alt="Profile" />
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#18181b]" />
        </div>
        <div className="flex flex-col items-start leading-none hidden sm:flex">
          <span className="text-xs font-bold text-white">{githubUser?.login}</span>
          <span className="text-[10px] text-zinc-500">Pro Developer</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
      </div>
    </div>
  );
}
