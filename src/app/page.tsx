'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import { 
  Users, Star, BookOpen, ArrowUpRight, 
  ChevronLeft, ChevronRight, RefreshCw, 
  GitPullRequest, Eye, Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Features
import { StatCard } from '@/components/features/dashboard/StatCard';
import { ActivityHeatmap } from '@/components/features/dashboard/ActivityHeatmap';
import { FeaturedProjects } from '@/components/features/dashboard/FeaturedProjects';

export default function DashboardPage() {
  const githubUser = useStore((state) => state.githubUser);
  const repos = useStore((state) => state.repos);
  const selectedRepoIds = useStore((state) => state.selectedRepoIds);
  const selectedRepos = repos.filter(r => selectedRepoIds.includes(r.id));

  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);

  // Early return if no user is connected - in Next.js we might want to redirect
  // but for now keeping it consistent with the original logic.
  if (!githubUser) return null;

  const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

  // Calculate language distribution
  const languageStats = useMemo(() => {
    const stats: Record<string, number> = {};
    repos.forEach(repo => {
      if (repo.language) {
        stats[repo.language] = (stats[repo.language] || 0) + 1;
      }
    });
    
    const sorted = Object.entries(stats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
    
    const total = sorted.reduce((acc, [, count]) => acc + count, 0);
    return sorted.map(([name, count]) => ({
      name,
      percentage: Math.round((count / total) * 100),
      count
    }));
  }, [repos]);

  // Generate deterministic mock activity data for the last year
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();
    const today = new Date();
    let seed = githubUser.login.charCodeAt(0) || 1;
    const random = () => {
      const x = Math.sin(seed++) * 10000;
      return x - Math.floor(x);
    };

    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const rand = random();
      const level = rand > 0.7 ? Math.floor(random() * 4) + 1 : 0;
      map.set(d.toDateString(), level);
    }
    return map;
  }, [githubUser.login]);

  // Calculate the 14 weeks (98 days) ending at the end of viewDate's month
  const heatmapDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const lastDay = new Date(year, month + 1, 0);
    const endDay = new Date(lastDay);
    endDay.setDate(endDay.getDate() + (6 - endDay.getDay()));

    const days = [];
    for (let i = 97; i >= 0; i--) {
      const d = new Date(endDay);
      d.setDate(d.getDate() - i);
      days.push(d);
    }
    return days;
  }, [viewDate]);

  const monthYear = viewDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const daysInMonth = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [viewDate]);

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-6 pb-12 font-sans text-white">
      {/* Header */}
      <header className="mb-8">
        <motion.h2 
          className="text-2xl text-zinc-400 font-medium tracking-tight mb-1"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Hi, {githubUser.name?.split(' ')[0] || githubUser.login}!
        </motion.h2>
        <motion.h1 
          className="text-4xl md:text-5xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          What do you want to build?
        </motion.h1>
      </header>

      {/* Top Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Top Left: Repositories Summary */}
        <motion.div 
          className="lg:col-span-3 bg-[#18181b] rounded-[2rem] p-7 flex flex-col border border-white/5 relative overflow-hidden group"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full group-hover:bg-blue-500/10 transition-colors" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Repositories</span>
            </div>
            <Link href="/folio-control" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5">
              <ArrowUpRight className="w-4 h-4 text-zinc-400" />
            </Link>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="text-6xl font-bold tracking-tighter text-white">
                {githubUser.public_repos.toLocaleString()}
              </h3>
              <span className="text-zinc-500 text-sm font-medium">Total</span>
            </div>
            <p className="text-sm text-zinc-500 font-medium">Public projects on GitHub</p>
          </div>

          <div className="mt-auto pt-10 relative z-10">
            <div className="flex items-center justify-between mb-3 h-4">
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                {hoveredLang ? 'Focusing' : 'Language Stack'}
              </span>
              <AnimatePresence mode="wait">
                <motion.span 
                  key={hoveredLang || 'default'}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-[10px] font-bold text-blue-400"
                >
                  {hoveredLang || languageStats[0]?.name || 'N/A'}
                </motion.span>
              </AnimatePresence>
            </div>
            
            <div className="flex h-3 w-full gap-1 mb-4">
              {languageStats.length > 0 ? (
                languageStats.map((stat, i) => (
                  <div 
                    key={stat.name}
                    onMouseEnter={() => setHoveredLang(`${stat.name} (${stat.percentage}%)`)}
                    onMouseLeave={() => setHoveredLang(null)}
                    className={cn(
                      "h-full rounded-full transition-all duration-300 cursor-help relative group/bar",
                      i === 0 ? "bg-blue-500" : i === 1 ? "bg-indigo-500" : "bg-zinc-700",
                      hoveredLang?.startsWith(stat.name) ? "scale-y-125 brightness-125" : "opacity-80 hover:opacity-100"
                    )}
                    style={{ width: `${stat.percentage}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-[10px] px-2 py-1 rounded border border-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {stat.name}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full w-full bg-zinc-800 rounded-full" />
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              {languageStats.slice(0, 2).map((stat, i) => (
                <div key={stat.name} className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5">
                  <div className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? "bg-blue-500" : "bg-indigo-500")} />
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-zinc-200 truncate">{stat.name}</span>
                    <span className="text-[9px] text-zinc-500 font-medium">{stat.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Top Center: Hero Intelligence */}
        <motion.div 
          className="lg:col-span-6 relative rounded-[2rem] p-[2px] overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
          <div className="relative h-full w-full bg-[#121214] rounded-[2rem] p-8 flex flex-col items-center text-center overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-orange-400 bg-clip-text text-transparent z-10">
              Portfolio Intelligence
            </h2>
            <p className="text-sm text-zinc-400 z-10">Empowering Developers with Advanced AI</p>
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120%] h-[250px] flex justify-center items-end opacity-90">
              <div className="w-64 h-64 bg-gradient-to-tr from-orange-500 via-pink-500 to-violet-500 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-2xl absolute bottom-0 mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="w-48 h-48 bg-gradient-to-bl from-yellow-400 via-orange-500 to-red-500 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-xl absolute bottom-10 mix-blend-screen" />
              <div className="w-full h-32 bg-gradient-to-t from-[#121214] to-transparent absolute bottom-0 z-10" />
            </div>
            <div className="absolute inset-0 bg-[url('/grid-dots.svg')] opacity-30" />
          </div>
        </motion.div>

        {/* Top Right: Calendar/Activity */}
        <motion.div 
          className="lg:col-span-3 bg-[#18181b] rounded-[2rem] p-6 flex flex-col border border-white/5"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <ChevronLeft 
              className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-white transition-colors" 
              onClick={handlePrevMonth}
            />
            <span className="text-sm font-medium">{monthYear}</span>
            <ChevronRight 
              className="w-4 h-4 text-zinc-500 cursor-pointer hover:text-white transition-colors" 
              onClick={handleNextMonth}
            />
          </div>

          <div className="grid grid-cols-7 gap-y-1 text-center mb-6">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
              <span key={`${day}-${i}`} className="text-[10px] font-medium text-zinc-500 uppercase mb-2">{day}</span>
            ))}
            <AnimatePresence mode="popLayout">
              {daysInMonth.map((date, i) => {
                if (!date) return <div key={`empty-${i}`} className="w-7 h-7" />;
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = date.toDateString() === selectedDate.toDateString();
                return (
                  <motion.button
                    key={date.toISOString()}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "w-7 h-7 text-xs flex items-center justify-center rounded-full transition-all mx-auto relative group",
                      isSelected ? "bg-violet-500 text-white shadow-[0_0_10px_rgba(139,92,246,0.5)] z-10" : 
                      isToday ? "text-violet-400 font-bold border border-violet-500/30" : "text-zinc-400 hover:bg-white/5"
                    )}
                  >
                    {date.getDate()}
                    {(activityMap.get(date.toDateString()) || 0) > 0 && !isSelected && (
                      <span className={cn(
                        "absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                        activityMap.get(date.toDateString()) === 1 ? "bg-violet-900" :
                        activityMap.get(date.toDateString()) === 2 ? "bg-violet-700" :
                        activityMap.get(date.toDateString()) === 3 ? "bg-violet-500" : "bg-violet-400"
                      )} />
                    )}
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[200px] pr-1 custom-scrollbar">
            {/* Mock activities */}
            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-medium text-zinc-200">Update README.md</h4>
                <span className="text-zinc-500 text-xs">-</span>
              </div>
              <p className="text-xs text-zinc-500 mb-3 truncate">Added new installation instructions...</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <img src={githubUser.avatar_url} className="w-6 h-6 rounded-full border-2 border-[#18181b]" alt="" />
                  <div className="w-6 h-6 rounded-full border-2 border-[#18181b] bg-zinc-800 flex items-center justify-center text-[10px]">+2</div>
                </div>
                <span className="text-xs text-zinc-500 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> 09:00 AM</span>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 py-3 bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-violet-500/30">
            <Plus className="w-4 h-4" /> Create Activity
          </button>
        </motion.div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          <StatCard 
            icon={<Users className="w-4 h-4 text-zinc-300" />}
            label="Followers"
            value={githubUser.followers.toLocaleString()}
            trend="+12.4%"
            trendUp={true}
            delay={0.5}
          />
          <StatCard 
            icon={<Star className="w-4 h-4 text-zinc-300" />}
            label="Total Stars"
            value={totalStars.toLocaleString()}
            trend="+5.2%"
            trendUp={true}
            delay={0.6}
          />
          <StatCard 
            icon={<Eye className="w-4 h-4 text-zinc-300" />}
            label="Profile Views"
            value="1,204"
            trend="-2.1%"
            trendUp={false}
            delay={0.7}
            highlight={true}
          />
          <StatCard 
            icon={<GitPullRequest className="w-4 h-4 text-zinc-300" />}
            label="Contributions"
            value="482"
            trend="-1.4%"
            trendUp={false}
            delay={0.8}
          />
        </div>

        {/* Heatmap */}
        <ActivityHeatmap 
          viewDate={viewDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setViewDate={setViewDate}
          heatmapDays={heatmapDays}
          activityMap={activityMap}
        />
      </div>

      {/* Featured Projects */}
      <FeaturedProjects selectedRepos={selectedRepos} />
    </div>
  );
}
