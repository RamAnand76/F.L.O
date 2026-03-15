import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/store/useStore';
import { useNavigate } from 'react-router-dom';
import { MinimalTemplate } from '@/components/templates/MinimalTemplate';
import { DeveloperTemplate } from '@/components/templates/DeveloperTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';
import { Search, Bell, ChevronDown, Play, Download, MoreHorizontal, X, Check, Star, Flame, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const TEMPLATES = [
  { 
    id: 'creative', 
    name: 'Spider-Verse', 
    category: 'Creative • Animation', 
    tags: ['Animation', 'Adventure', 'Bold'],
    desc: 'Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence. A bold, highly animated portfolio template.', 
    component: CreativeTemplate, 
    color: 'from-[#FF2A2A] via-[#7A00C4] to-[#000000]',
    textColor: 'text-white'
  },
  { 
    id: 'developer', 
    name: 'The Matrix', 
    category: 'Engineering • Sci-Fi', 
    tags: ['Dark', 'Terminal', 'Code'],
    desc: 'Dark, monospace, code-centric vibe. Ideal for backend and systems engineers who want to show off their raw technical skills.', 
    component: DeveloperTemplate, 
    color: 'from-[#0d1117] via-[#161b22] to-[#003300]',
    textColor: 'text-[#c9d1d9]'
  },
  { 
    id: 'minimal', 
    name: 'Interstellar', 
    category: 'Minimal • Sci-Fi', 
    tags: ['Clean', 'Space', 'Typography'],
    desc: 'Clean, typography-focused design. Perfect for a sleek, professional look that lets your work speak for itself across the cosmos.', 
    component: MinimalTemplate, 
    color: 'from-zinc-100 via-zinc-300 to-zinc-500',
    textColor: 'text-zinc-900'
  },
  { 
    id: 'saas', 
    name: 'Manifest', 
    category: 'Business • Mystery', 
    tags: ['Landing', 'Conversion', 'Sleek'],
    desc: 'Optimized for conversions with a professional SaaS aesthetic. Uncover the mystery of high engagement rates.', 
    component: MinimalTemplate, 
    color: 'from-indigo-900 via-blue-900 to-black',
    textColor: 'text-white'
  },
  { 
    id: 'brutalist', 
    name: 'The Flash', 
    category: 'Design • Fantasy', 
    tags: ['Fast', 'High Contrast', 'Grid'],
    desc: 'Raw, unpolished, and highly structural. For the bold designers who want to move fast and break things.', 
    component: CreativeTemplate, 
    color: 'from-yellow-500 via-orange-600 to-red-700',
    textColor: 'text-white'
  }
] as const;

export function Templates() {
  const [focusedId, setFocusedId] = useState<string>(TEMPLATES[0].id);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Templates');
  
  const setSelectedTemplate = useStore(s => s.setSelectedTemplate);
  const selectedTemplate = useStore(s => s.selectedTemplate);
  const githubUser = useStore(s => s.githubUser);
  const navigate = useNavigate();

  const focusedTemplate = TEMPLATES.find(t => t.id === focusedId) || TEMPLATES[0];
  const PreviewComponent = TEMPLATES.find(t => t.id === previewId)?.component;

  const filteredTemplates = TEMPLATES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         t.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (activeTab === 'All Templates') return matchesSearch;
    return matchesSearch && t.category.toLowerCase().includes(activeTab.toLowerCase());
  });

  const handleUseTemplate = (id: string) => {
    // Map the display IDs back to the actual template IDs supported by the store
    const actualId = ['creative', 'developer', 'minimal'].includes(id) ? id : 'minimal';
    setSelectedTemplate(actualId as any);
    setPreviewId(null);
    navigate('/preview');
  };

  return (
    <div className="h-full flex flex-col lg:flex-row gap-8 pb-12">
      
      {/* Left Sidebar */}
      <div className="w-full lg:w-80 shrink-0 flex flex-col gap-8">
        {/* Search */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-5 py-3.5 flex items-center gap-3 shadow-lg">
          <Search className="w-5 h-5 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search templates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-zinc-500" 
          />
        </div>

        {/* New Arrivals / Trending */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold flex items-center gap-2 text-white">
              <Flame className="w-4 h-4 text-orange-500" fill="currentColor" /> 
              New Releases
            </h3>
            <span className="text-xs text-zinc-500 flex items-center gap-1">
              Sort by: Today <ChevronDown className="w-3 h-3" />
            </span>
          </div>
          
          <div className="space-y-5">
            {TEMPLATES.slice(0, 3).map(t => (
              <div 
                key={`side-${t.id}`} 
                className="flex items-center gap-4 group cursor-pointer" 
                onClick={() => setFocusedId(t.id)}
              >
                <div className={cn("w-20 h-14 rounded-xl bg-gradient-to-br flex-shrink-0 relative overflow-hidden", t.color)}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity ml-0.5 fill-current" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate group-hover:text-indigo-400 transition-colors">{t.name}</h4>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{t.category.split('•')[0]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Continue Exploring */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] p-6 shadow-lg flex-1">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold flex items-center gap-2 text-white">
              <Clock className="w-4 h-4 text-indigo-400" /> 
              Recently Viewed
            </h3>
          </div>
          <div className="space-y-5">
            {TEMPLATES.slice(3, 5).map(t => (
              <div 
                key={`recent-${t.id}`} 
                className="flex items-center gap-4 group cursor-pointer" 
                onClick={() => setFocusedId(t.id)}
              >
                <div className={cn("w-14 h-14 rounded-xl bg-gradient-to-br flex-shrink-0 relative overflow-hidden", t.color)}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Play className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity ml-0.5 fill-current" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white truncate group-hover:text-indigo-400 transition-colors">{t.name}</h4>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">Viewed 2h ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Main Area */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1.5 shadow-lg">
            {['All Templates', 'Minimal', 'Creative', 'Developer'].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-2 rounded-full text-sm font-medium transition-all",
                  activeTab === tab ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={focusedTemplate.id}
            initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative rounded-[2.5rem] overflow-hidden min-h-[460px] flex flex-col justify-end p-10 md:p-14 border border-white/10 shadow-2xl group"
          >
            {/* Abstract Background representing the template */}
            <div className={cn("absolute inset-0 bg-gradient-to-br opacity-60 transition-transform duration-1000 group-hover:scale-105", focusedTemplate.color)} />
            
            {/* Decorative abstract shapes */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 mix-blend-overlay" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/40 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

            {/* Gradient Overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />

            {/* Content */}
            <div className="relative z-10 w-full max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-white border border-white/20 flex items-center gap-1.5">
                  <Flame className="w-3 h-3 text-orange-400" fill="currentColor" /> Trending
                </span>
                {focusedTemplate.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-xs font-medium text-zinc-300 border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-white drop-shadow-lg">
                {focusedTemplate.name}
              </h1>
              
              <p className="text-zinc-300 text-lg md:text-xl mb-8 leading-relaxed drop-shadow max-w-2xl">
                {focusedTemplate.desc}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <button 
                  onClick={() => setPreviewId(focusedTemplate.id)} 
                  className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-zinc-200 hover:scale-105 transition-all shadow-xl"
                >
                  <Play className="w-5 h-5 fill-current" /> Live Preview
                </button>
                <button 
                  onClick={() => handleUseTemplate(focusedTemplate.id)} 
                  className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-8 py-4 rounded-full font-bold flex items-center gap-2 hover:bg-white/20 hover:scale-105 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" /> Use Template
                </button>
                <button className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all shadow-xl">
                  <MoreHorizontal className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Grid */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              {searchQuery || activeTab !== 'All Templates' ? `Results for "${searchQuery || activeTab}"` : 'You might like'}
            </h3>
            <button 
              onClick={() => {
                setSearchQuery('');
                setActiveTab('All Templates');
              }}
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              See all
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {filteredTemplates.length > 0 ? (
              filteredTemplates.filter(t => t.id !== focusedId).map(t => (
                <motion.div 
                  key={`grid-${t.id}`} 
                  onClick={() => setFocusedId(t.id)} 
                  className="group cursor-pointer"
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={cn("w-full aspect-[4/3] rounded-[1.5rem] mb-4 relative overflow-hidden bg-gradient-to-br shadow-lg border border-white/5", t.color)}>
                     {/* Decorative overlay */}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80" />
                     
                     {/* Play button overlay */}
                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                           <Play className="w-5 h-5 text-white fill-current ml-1" />
                        </div>
                     </div>
  
                     {/* Badges */}
                     <div className="absolute top-3 left-3">
                       <span className="px-2.5 py-1 rounded-lg bg-black/40 backdrop-blur-md text-[10px] font-medium text-white border border-white/10">
                         {t.category.split('•')[0].trim()}
                       </span>
                     </div>
                  </div>
                  <h4 className="font-semibold text-base text-white mb-1 group-hover:text-indigo-400 transition-colors">{t.name}</h4>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{t.desc}</p>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-zinc-500" />
                </div>
                <h4 className="text-xl font-semibold text-white mb-2">No templates found</h4>
                <p className="text-zinc-500 max-w-xs">
                  We couldn't find any templates matching your search or filters. Try adjusting your criteria.
                </p>
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setActiveTab('All Templates');
                  }}
                  className="mt-6 text-sm font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Preview Modal */}
      <AnimatePresence>
        {previewId && PreviewComponent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/80 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full h-full max-w-7xl bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col relative"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-medium text-white">
                    Previewing: <span className="text-indigo-400 font-bold">{TEMPLATES.find(t => t.id === previewId)?.name}</span>
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleUseTemplate(previewId)}
                    className="bg-white hover:bg-zinc-200 text-black px-6 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2 shadow-lg"
                  >
                    <Check className="w-4 h-4" /> Use This Template
                  </button>
                  <button
                    onClick={() => setPreviewId(null)}
                    className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors border border-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content (The Template) */}
              <div className="flex-1 overflow-y-auto relative bg-zinc-950">
                <PreviewComponent />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
