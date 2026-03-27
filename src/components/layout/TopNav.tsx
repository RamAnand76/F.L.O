'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Bell, ChevronDown } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

export function TopNav() {
  const githubUser = useStore((state) => state.githubUser);
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  const logout = useStore((state) => state.logout);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      <div className="relative" ref={dropdownRef}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 sm:gap-3 bg-[#18181b]/80 backdrop-blur-md border border-white/10 rounded-full pl-1 pr-3 sm:pr-4 py-1 shadow-lg cursor-pointer hover:bg-[#27272a] transition-all group"
        >
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
          <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>

        {isOpen && (
          <div className="absolute right-0 mt-3 w-56 rounded-xl bg-[#18181b]/95 backdrop-blur-xl border border-white/10 shadow-2xl py-2 flex flex-col z-[101] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5 mb-1">
              <p className="text-sm font-medium text-white">{githubUser?.name || githubUser?.login}</p>
              <p className="text-xs text-zinc-400 truncate mt-0.5">{githubUser?.email || 'No email provided'}</p>
            </div>
            
            <button 
              onClick={() => { setIsOpen(false); router.push('/connect'); }}
              className="w-full text-left px-4 py-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between group"
            >
              Change GitHub Account
            </button>
            <button 
              onClick={() => { setIsOpen(false); router.push('/profile'); }}
              className="w-full text-left px-4 py-2.5 text-xs text-zinc-300 hover:text-white hover:bg-white/5 transition-colors flex items-center justify-between group"
            >
              Portfolio Settings
            </button>
            
            <div className="h-px bg-white/5 my-1" />
            
            <button 
              onClick={() => { 
                setIsOpen(false); 
                logout(); 
                router.push('/auth'); 
              }}
              className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors flex items-center justify-between group"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
