import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/store/useStore';
import { Link } from 'react-router-dom';
import { 
  Github, Users, Star, BookOpen, ArrowUpRight, Activity, 
  ChevronLeft, ChevronRight, RefreshCw, Maximize2, Plus,
  GitCommit, GitPullRequest, Eye, ExternalLink, Code2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function Dashboard() {
  const githubUser = useStore((state) => state.githubUser);
  const repos = useStore((state) => state.repos);
  const selectedRepoIds = useStore((state) => state.selectedRepoIds);
  const selectedRepos = repos.filter(r => selectedRepoIds.includes(r.id));

  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);

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
    // Seed random based on user login so it's consistent
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
    
    // Adjust to end on a Saturday so the grid aligns nicely (7 rows = Sun-Sat)
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
    // Padding for the first week
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
    <div className="space-y-6 pb-12 font-sans text-white">
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
        
        {/* Top Left: Repositories */}
        <motion.div 
          className="lg:col-span-3 bg-[#18181b] rounded-[2rem] p-7 flex flex-col border border-white/5 relative overflow-hidden group"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          {/* Subtle background glow */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/5 blur-[80px] rounded-full group-hover:bg-blue-500/10 transition-colors" />
          
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <BookOpen className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Repositories</span>
            </div>
            <Link to="/folio-control" className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-white/5">
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
                    {/* Tooltip arrow */}
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

        {/* Top Center: Hero */}
        <motion.div 
          className="lg:col-span-6 relative rounded-[2rem] p-[2px] overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Glowing border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
          
          <div className="relative h-full w-full bg-[#121214] rounded-[2rem] p-8 flex flex-col items-center text-center overflow-hidden">
            <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-indigo-400 to-orange-400 bg-clip-text text-transparent z-10">
              Portfolio Intelligence
            </h2>
            <p className="text-sm text-zinc-400 z-10">Empowering Developers with Advanced AI</p>
            
            {/* Abstract 3D-like Shape (CSS representation) */}
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120%] h-[250px] flex justify-center items-end opacity-90">
              <div className="w-64 h-64 bg-gradient-to-tr from-orange-500 via-pink-500 to-violet-500 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] blur-2xl absolute bottom-0 mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
              <div className="w-48 h-48 bg-gradient-to-bl from-yellow-400 via-orange-500 to-red-500 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] blur-xl absolute bottom-10 mix-blend-screen" />
              <div className="w-full h-32 bg-gradient-to-t from-[#121214] to-transparent absolute bottom-0 z-10" />
            </div>
            
            {/* Background grid dots */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IiMzMzMiLz48L3N2Zz4=')] opacity-30" />
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
                    {/* Activity dot */}
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

            <div className="bg-white/5 rounded-2xl p-4 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                <h4 className="text-sm font-medium text-zinc-200">Deploy to Vercel</h4>
                <span className="text-zinc-500 text-xs">-</span>
              </div>
              <p className="text-xs text-zinc-500 mb-3 truncate">Production build successful...</p>
              <div className="flex items-center justify-between">
                <div className="flex -space-x-2">
                  <img src={githubUser.avatar_url} className="w-6 h-6 rounded-full border-2 border-[#18181b]" alt="" />
                </div>
                <span className="text-xs text-zinc-500 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> 10:45 AM</span>
              </div>
            </div>
          </div>

          <button className="w-full mt-4 py-3 bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors border border-violet-500/30">
            <Plus className="w-4 h-4" /> Create Activity
          </button>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Bottom Left: 4 Stat Cards */}
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

        {/* Bottom Right: Heatmap */}
        <motion.div 
          className="lg:col-span-6 bg-[#18181b] rounded-[2rem] p-6 border border-white/5 flex flex-col"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.9 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
              <Activity className="w-4 h-4 text-zinc-300" />
              <span className="text-sm font-medium text-zinc-200">Weekly Engagement</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer">View all</span>
              <RefreshCw className="w-3.5 h-3.5 text-zinc-500 cursor-pointer" />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-500 mb-6">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#2d2d30]" /> Low</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-900" /> Medium</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-600" /> High</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-400" /> Best</div>
          </div>

          <div className="flex-1 flex items-end">
            <div className="w-full flex gap-2">
              {/* Y-axis labels */}
              <div className="flex flex-col justify-between text-[10px] text-zinc-500 py-1 pr-2 h-full">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
              </div>
              
              {/* Grid */}
              <div className="flex-1 grid grid-flow-col grid-rows-7 gap-1.5">
                {heatmapDays.map((date, i) => {
                  const val = activityMap.get(date.toDateString()) || 0;
                  const isSelected = selectedDate.toDateString() === date.toDateString();
                  let bgClass = "bg-[#2d2d30]"; // 0
                  if (val === 1) bgClass = "bg-violet-900/50";
                  if (val === 2) bgClass = "bg-violet-800";
                  if (val === 3) bgClass = "bg-violet-600";
                  if (val === 4) bgClass = "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.4)]";
                  
                  return (
                    <div 
                      key={i} 
                      onClick={() => {
                        setSelectedDate(date);
                        if (date.getMonth() !== viewDate.getMonth()) {
                          setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
                        }
                      }}
                      className={cn(
                        "w-full aspect-square rounded-[4px] transition-colors hover:ring-1 hover:ring-white/50 cursor-pointer relative", 
                        bgClass,
                        isSelected && "ring-2 ring-white scale-110 z-10"
                      )}
                      title={date.toDateString()}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* X-axis labels */}
          <div className="flex justify-between text-[10px] text-zinc-500 mt-3 pl-8">
            {Array.from(new Set(heatmapDays.map(d => d.toLocaleString('default', { month: 'short' })))).map(m => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Featured Projects Row */}
      <div className="mt-4">
        <motion.div 
          className="bg-[#18181b] rounded-[2rem] p-6 border border-white/5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
              <Code2 className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-zinc-200">Featured Projects</span>
            </div>
            <Link to="/folio" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
              Manage <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {selectedRepos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedRepos.map((repo, i) => (
                <motion.div 
                  key={repo.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.1 + (i * 0.1) }}
                  className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-white/5 transition-colors group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-medium text-zinc-100 truncate pr-4">{repo.name}</h3>
                    <a 
                      href={repo.html_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-zinc-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-sm text-zinc-400 line-clamp-2 mb-4 h-10">
                    {repo.description || 'No description provided.'}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-zinc-500 mt-auto">
                    {repo.language && (
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        {repo.language}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5" />
                      {repo.stargazers_count}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
              <p className="text-zinc-500 text-sm mb-4">No projects selected for your portfolio yet.</p>
              <Link to="/folio" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" /> Add Projects
              </Link>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon, label, value, trend, trendUp, delay, highlight = false 
}: { 
  icon: React.ReactNode, label: string, value: string | number, trend: string, trendUp: boolean, delay: number, highlight?: boolean 
}) {
  return (
    <motion.div 
      className={cn(
        "rounded-[2rem] p-6 border border-white/5 flex flex-col relative overflow-hidden",
        highlight ? "bg-gradient-to-br from-[#18181b] to-violet-900/40" : "bg-[#18181b]"
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      {highlight && (
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-violet-500/20 blur-2xl rounded-full" />
      )}
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
          {icon}
          <span className="text-sm font-medium text-zinc-200">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer">View all</span>
          <Maximize2 className="w-3.5 h-3.5 text-zinc-500 cursor-pointer" />
        </div>
      </div>
      
      <div className="mt-auto relative z-10">
        <h3 className="text-4xl font-bold tracking-tight mb-2">{value}</h3>
        <p className={cn("text-xs font-medium", trendUp ? "text-violet-400" : "text-orange-500")}>
          {trend} <span className="text-zinc-500 font-normal">from previous weeks</span>
        </p>
      </div>
    </motion.div>
  );
}
