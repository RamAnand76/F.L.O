'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/store/useStore';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, Play, Download, MoreHorizontal, X, Check, Flame, Clock, CheckCircle2, ExternalLink, Upload, Loader2, LayoutTemplate } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TEMPLATES } from '@/lib/templates';
import { PortfolioDataProvider } from '@/context/PortfolioDataContext';

export default function TemplatesPage() {
  const [focusedId, setFocusedId] = useState<string>(TEMPLATES[0].id);
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All Templates');
  
  const { setSelectedTemplate, isPublished, publishPortfolio, githubUser, addNotification } = useStore();
  const router = useRouter();

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
    setSelectedTemplate(id as any);
    setPreviewId(null);
    addNotification(`Template "${TEMPLATES.find(t => t.id === id)?.name}" selected!`, 'success');
    router.push('/preview');
  };

  return (
    <div className="container mx-auto px-4 py-8 h-full flex flex-col lg:flex-row gap-8 pb-12">
      
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

        {/* New Arrivals */}
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
                <div className={cn("w-20 h-14 rounded-xl bg-gradient-to-br flex-shrink-0 relative overflow-hidden", t.gradient)}>
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
            className="relative rounded-[2rem] overflow-hidden min-h-[450px] flex flex-col justify-end p-8 md:p-10 border border-white/10 shadow-2xl group"
          >
            {/* Live Thumbnail Background */}
            <div className="absolute inset-0 bg-zinc-900 overflow-hidden text-left">
               <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-all duration-700 blur-[1px] group-hover:blur-0 transform scale-[1.05]">
                  <div className="w-[1440px] h-[900px] origin-top-left transform scale-[0.8] md:scale-[1]">
                     <PortfolioDataProvider isPlaceholder>
                        <focusedTemplate.component />
                     </PortfolioDataProvider>
                  </div>
               </div>
               <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent z-10" />
               <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-zinc-950/80 via-transparent to-transparent z-10 hidden md:block" />
            </div>

            <div className="relative z-10 w-full max-w-3xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-white border border-white/20 flex items-center gap-1.5">
                  <Flame className="w-3 h-3 text-orange-400" fill="currentColor" /> Trending
                </span>
                {focusedTemplate.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md text-xs font-medium text-zinc-300 border border-white/5">
                    {tag}
                  </span>
                ))}
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-3 tracking-tight text-white drop-shadow-lg">
                {focusedTemplate.name}
              </h1>
              
              <p className="text-zinc-300 text-lg md:text-xl mb-6 leading-relaxed drop-shadow max-w-2xl">
                {focusedTemplate.desc}
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => setPreviewId(focusedTemplate.id)} 
                  className="bg-white text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-zinc-200 hover:scale-105 transition-all shadow-xl"
                >
                  <Play className="w-4 h-4 fill-current" /> Live Preview
                </button>
                <button 
                  onClick={() => handleUseTemplate(focusedTemplate.id)} 
                  className="bg-white/10 backdrop-blur-xl border border-white/20 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-white/20 hover:scale-105 transition-all shadow-xl"
                >
                  <Download className="w-4 h-4" /> Use Template
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom Grid */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white">
              {searchQuery || activeTab !== 'All Templates' ? `Results for "${searchQuery || activeTab}"` : 'You might like'}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {filteredTemplates.filter(t => t.id !== focusedId).map(t => (
              <motion.div 
                key={`grid-${t.id}`} 
                onClick={() => setFocusedId(t.id)} 
                className="group cursor-pointer"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <div className={cn("w-full aspect-[16/10] rounded-[1.25rem] mb-3 relative overflow-hidden bg-zinc-950 border border-white/5 shadow-2xl group-hover:border-white/20 transition-all", t.gradient ? `bg-gradient-to-br ${t.gradient}` : '')}>
                   <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700 origin-top-left w-[400%] h-[400%] text-left" style={{ transform: 'scale(0.25)' }}>
                      <PortfolioDataProvider isPlaceholder>
                         <t.component />
                      </PortfolioDataProvider>
                   </div>
                   <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                   <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl transform scale-90 group-hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                         <Play className="w-5 h-5 text-white fill-current ml-1" />
                      </div>
                   </div>
                </div>
                <h4 className="font-semibold text-base text-white mb-0.5 group-hover:text-indigo-400 transition-colors">{t.name}</h4>
                <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
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
              className="w-full h-full max-w-7xl bg-zinc-950 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col relative"
            >
              <div className="flex items-center justify-between px-8 py-5 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md">
                <div className="flex items-center gap-4">
                  <h2 className="text-xl font-medium text-white">
                    Previewing: <span className="text-indigo-400 font-bold">{TEMPLATES.find(t => t.id === previewId)?.name}</span>
                  </h2>
                </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={async () => {
                        const newStatus = !isPublished;
                        await publishPortfolio(newStatus);
                      }}
                      className={cn(
                        "px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 shadow-lg",
                        isPublished 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20" 
                          : "bg-white text-black hover:bg-zinc-200"
                      )}
                    >
                      {isPublished ? <CheckCircle2 className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                      {isPublished ? 'Published' : 'Publish to Live'}
                    </button>
                    
                    {isPublished && (
                      <a
                        href={`/${githubUser?.login || 'profile'}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2 shadow-lg"
                      >
                        <ExternalLink className="w-4 h-4" /> View Live
                      </a>
                    )}

                    <button
                      onClick={() => handleUseTemplate(previewId)}
                      className="bg-white/10 hover:bg-white/20 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-colors flex items-center gap-2 border border-white/10"
                    >
                      <Check className="w-4 h-4" /> Set as Default
                    </button>
                    
                    <button
                      onClick={() => setPreviewId(null)}
                      className="w-11 h-11 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white transition-colors border border-white/10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
              </div>

              <div className="flex-1 overflow-y-auto relative bg-zinc-950 text-left">
                <PortfolioDataProvider isPlaceholder>
                  <PreviewComponent />
                </PortfolioDataProvider>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
