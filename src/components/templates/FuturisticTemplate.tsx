'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { 
  Github, Mail, MapPin, ExternalLink, Star, 
  Briefcase, GraduationCap, Quote, FolderOpen, 
  Linkedin, Twitter, Globe, ArrowRight, ArrowUpRight,
  Play, Search, Menu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StackIcon } from '@/components/ui/StackIcon';
import { motion } from 'motion/react';

export function FuturisticTemplate() {
  const { githubUser, customData, repos, selectedRepoIds, skills, experiences, education, testimonials, assets } = useStore();
  const selectedRepos = repos.filter(r => selectedRepoIds.includes(r.id));
  const approvedTestimonials = testimonials.filter(t => t.isApproved);

  const firstName = customData.name.split(' ')[0] || 'Build';

  return (
    <div className="min-h-full bg-[#05060a] text-white font-sans selection:bg-[#FF3E83] selection:text-white pb-32 overflow-hidden">
      {/* Background Orbs and Gradients */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#05060a] to-[#05060a]" />
        <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-sky-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-[#FF3E83]/5 blur-[150px] rounded-full" />
      </div>

      {/* Floating Glass Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center justify-between px-8 py-3 bg-[#13151c]/60 border border-white/10 rounded-full backdrop-blur-xl shadow-2xl min-w-[320px] max-w-4xl w-[90%]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-tr from-[#FF3E83] to-[#7B0000] rounded-lg rotate-12 flex-shrink-0 shadow-lg shadow-pink-500/20">
             <Globe className="w-5 h-5 text-white" />
          </div>
          <div className="hidden sm:flex items-center gap-6 ml-6 text-[10px] uppercase font-black tracking-widest text-zinc-400">
             {['About', 'Portfolio', 'Blog', 'Contact'].map(item => (
                <button key={item} className="hover:text-white transition-colors">{item}</button>
             ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
           {customData.github && (
             <a href={customData.github} target="_blank" className="text-zinc-400 hover:text-white transition-colors"><Twitter className="w-4 h-4" /></a>
           )}
           <div className="w-px h-4 bg-white/10" />
           <button className="text-zinc-400 hover:text-white"><Search className="w-4 h-4" /></button>
           <button className="text-zinc-400 hover:text-white"><Menu className="w-4 h-4" /></button>
        </div>
      </nav>

      {/* Hero Section with Floating spheres */}
      <section className="max-w-[1400px] mx-auto px-8 pt-48 pb-32 grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
         <div className="lg:col-span-12 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="space-y-12 text-center md:text-left max-w-3xl">
              <h1 className="text-[12vw] sm:text-8xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter leading-[0.8] uppercase whitespace-pre-wrap">
                 LET'S<br/>BUILD<br/>TOGETHER
              </h1>
              <div className="space-y-6">
                <p className="text-xl text-zinc-400 font-medium leading-relaxed max-w-lg mx-auto md:mx-0">
                  {customData.bio}
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                   <button className="px-10 py-4 bg-white text-black font-black text-xs uppercase tracking-widest rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                     Get Started
                   </button>
                   <button className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all font-bold text-sm">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center"><Play className="w-4 h-4 fill-white" /></div>
                      Watch Reel
                   </button>
                </div>
              </div>
            </div>

            {/* Futuristic Visualization */}
            <div className="relative flex-1 hidden md:block group">
               <div className="relative w-96 h-96 mx-auto">
                  {/* Floating Bubbles */}
                  {[
                    { style: { top: '0%', left: '40%', scale: 1.2 }, color: 'from-pink-500/40' },
                    { style: { top: '30%', left: '80%', scale: 0.8 }, color: 'from-sky-500/40' },
                    { style: { top: '70%', left: '20%', scale: 0.6 }, color: 'from-indigo-500/40' },
                    { style: { top: '80%', left: '70%', scale: 1.1 }, color: 'from-[#FF3E83]/40' }
                  ].map((orb, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ 
                        opacity: 1, 
                        scale: orb.style.scale,
                        y: [0, -40, 0]
                      }}
                      transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
                      className={cn("absolute w-32 h-32 rounded-full bg-gradient-to-br to-transparent blur-[40px] opacity-60 z-0", orb.color)}
                      style={orb.style as any}
                    />
                  ))}
                  
                  {/* Rotating Glass Rings */}
                  <div className="absolute inset-0 border-4 border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
                  <div className="absolute inset-[-20%] border border-white/1 hover:border-white/10 rounded-full animate-[spin_30s_linear_infinite_reverse] transition-colors" />

                  {/* Centered Avatar / Artifact */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                     <div className="w-full h-full rounded-full overflow-hidden border-8 border-[#13151c] shadow-2xl relative group">
                        <img 
                          src={githubUser?.avatar_url || `https://api.dicebear.com/7.x/shapes/svg?seed=${customData.name}`} 
                          alt="Visual" 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#FF3E83]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Abstract Stats Row */}
      <section className="max-w-7xl mx-auto px-8 py-32 grid grid-cols-1 md:grid-cols-3 gap-8">
         {[
           { val: '42%', label: 'Optimization efficiency peak achieved in recent infrastructure deployments.', color: 'from-indigo-600/10' },
           { val: `${repos.length}+`, label: 'Active repositories currently maintained and deployed across clusters.', color: 'from-pink-600/10' },
           { val: `${skills.length}`, label: 'Core technological components driving our digital architecture vision.', color: 'from-sky-600/10' }
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: i * 0.1 }}
             className={cn("p-12 bg-white/5 border border-white/10 rounded-[3rem] backdrop-blur-md shadow-xl flex flex-col gap-6 group hover:translate-y-[-5px] transition-all overflow-hidden relative", stat.color)}
           >
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:bg-white/10 transition-colors blur-xl" />
              <h4 className="text-8xl font-black tracking-tighter relative z-10 group-hover:text-[#FF3E83] transition-colors">{stat.val}</h4>
              <p className="text-sm font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors relative z-10 leading-relaxed max-w-[200px]">
                {stat.label}
              </p>
           </motion.div>
         ))}
      </section>

      {/* Hero Section 2 - Abstract Card */}
      <section className="max-w-7xl mx-auto px-8 py-32 relative group">
         <div className="w-full h-[600px] bg-[#13151c]/60 border border-white/10 rounded-[4rem] overflow-hidden flex flex-col md:flex-row items-center shadow-2xl relative">
            <div className="p-12 md:p-20 flex-1 space-y-12 relative z-10">
               <div>
                  <h3 className="text-5xl font-black tracking-tighter mb-4">The Convergence Of Art & Intelligence</h3>
                  <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Strategic Evolution</p>
               </div>
               <div className="space-y-6">
                  <div className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group/item">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#FF3E83] group-hover/item:scale-150 transition-transform" />
                     <span className="text-lg font-bold tracking-tight">Syndicate Deployment Infrastructure</span>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group/item">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#FF3E83] group-hover/item:scale-150 transition-transform" />
                     <span className="text-lg font-bold tracking-tight">Team Synergy Architectures</span>
                  </div>
                  <div className="flex items-center gap-4 text-zinc-300 hover:text-white transition-colors group/item">
                     <div className="w-1.5 h-1.5 rounded-full bg-[#FF3E83] group-hover/item:scale-150 transition-transform" />
                     <span className="text-lg font-bold tracking-tight">Energistically Scalable Models</span>
                  </div>
               </div>
               <button className="px-10 py-5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-full transition-all text-xs uppercase tracking-widest shadow-xl ring-1 ring-white/10">
                  Explore Ecosystem
               </button>
            </div>

            <div className="flex-1 w-full h-full relative overflow-hidden bg-gradient-to-br from-indigo-500/20 to-[#FF3E83]/20">
               <img 
                 src={githubUser?.avatar_url || `https://api.dicebear.com/7.x/abstract/svg?seed=${customData.name}`} 
                 alt="Abstract" 
                 className="w-full h-full object-cover scale-[1.1] rotate-[-5deg] group-hover:scale-125 group-hover:rotate-0 transition-all duration-[3000ms] grayscale brightness-50 contrast-150" 
               />
               <div className="absolute inset-0 bg-gradient-to-r from-[#13151c]/100 to-transparent z-10 pointer-events-none" />
               
               <div className="absolute bottom-12 right-12 text-7xl font-black text-white/5 uppercase select-none z-0">
                  BUILD THE<br/>NEXT ERA
               </div>
            </div>
         </div>
      </section>

      {/* Projects Scroller */}
      <section className="max-w-7xl mx-auto px-8 py-32 space-y-16">
         <div className="text-center">
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-4">Recent Clusters</h2>
            <div className="h-px w-20 bg-indigo-500 mx-auto" />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {selectedRepos.map((repo, i) => (
              <motion.a 
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-8 bg-[#13151c]/40 border border-white/5 rounded-3xl hover:bg-[#13151c] transition-all hover:-translate-y-2 shadow-xl flex flex-col justify-between aspect-square group"
              >
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center group-hover:bg-[#FF3E83] group-hover:text-white transition-all">
                    <StackIcon name={repo.language || 'Code'} className="w-6 h-6" />
                 </div>
                 <div className="space-y-3">
                    <h3 className="text-2xl font-black tracking-tighter">{repo.name}</h3>
                    <div className="flex items-center gap-4 text-[10px] uppercase font-black text-zinc-500 tracking-widest">
                       <span>Node Cluster</span>
                       <div className="w-1 h-1 rounded-full bg-indigo-500" />
                       <span>{repo.stargazers_count} Stars</span>
                    </div>
                 </div>
              </motion.a>
            ))}
         </div>
      </section>

      {/* Footer Design */}
      <footer className="max-w-7xl mx-auto px-8 pt-40 pb-20 text-center border-t border-white/5 relative z-10 space-y-12">
         <div className="flex flex-col items-center gap-12">
            <div className="flex items-center gap-6 justify-center flex-wrap">
               {['Dribbble', 'Twitter', 'Github', 'Linkedin'].map(s => (
                 <a key={s} href="#" className="font-bold text-xs uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">{s}</a>
               ))}
            </div>
            <h4 className="text-7xl md:text-8xl font-black tracking-tighter opacity-10 hover:opacity-100 transition-opacity cursor-default selection:bg-none uppercase">
               BUILD THE FUTURE // {firstName}
            </h4>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">© 2026 FLO INTELLIGENCE LABS // ALL RIGHTS RESERVED</p>
         </div>
      </footer>
    </div>
  );
}
