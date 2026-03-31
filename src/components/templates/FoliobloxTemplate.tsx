'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { 
  Github, Mail, MapPin, ExternalLink, Star, 
  Briefcase, GraduationCap, Quote, FolderOpen, 
  Linkedin, Twitter, Globe, ArrowRight, ArrowUpRight,
  Circle, Square, Triangle, Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StackIcon } from '@/components/ui/StackIcon';
import { motion } from 'motion/react';

export function FoliobloxTemplate() {
  const { githubUser, customData, repos, selectedRepoIds, skills, experiences, education, testimonials, assets } = useStore();
  const selectedRepos = repos.filter(r => selectedRepoIds.includes(r.id));
  const approvedTestimonials = testimonials.filter(t => t.isApproved);

  const firstName = customData.name.split(' ')[0] || 'Creative';
  const lastName = customData.name.split(' ')[1] || 'Director';

  return (
    <div className="min-h-full bg-[#050505] text-white font-sans selection:bg-[#FF4500] selection:text-white pb-32">
      {/* Top Navigation */}
      <nav className="flex items-center justify-between p-8 md:p-12 max-w-[1600px] mx-auto absolute top-0 left-0 right-0 z-[100]">
        <div className="text-2xl font-black tracking-tighter text-white">
          Folio<span className="text-[#FF4500]">blox</span>
        </div>
        <div className="hidden md:flex items-center gap-12 text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-white/60">
           {['Home', 'About', 'Projects'].map(item => (
             <button key={item} className="hover:text-[#FF4500] transition-colors">{item}</button>
           ))}
           <button className="px-6 py-2.5 bg-white text-black font-black rounded-full hover:bg-zinc-200 transition-all flex items-center gap-2 group">
             Get in touch <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
           </button>
        </div>
      </nav>

      {/* Hero Section with Vibrant Gradient */}
      <section className="relative w-full h-screen min-h-[800px] flex items-center justify-center p-4 md:p-12 overflow-hidden">
         <div className="absolute top-0 left-0 w-full h-[85%] bg-gradient-to-br from-[#FF4500] via-[#D81B1B] to-[#7B0000] rounded-b-[4rem] md:rounded-b-[8rem] shadow-2xl" />
         
         {/* Background Text Overlay */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center opacity-10 pointer-events-none select-none">
            <h1 className="text-[20vw] font-black tracking-tighter leading-none whitespace-nowrap uppercase mb-20">{firstName}</h1>
            <h1 className="text-[15vw] font-black tracking-tighter leading-none whitespace-nowrap uppercase opacity-50">{lastName}</h1>
         </div>

         <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 pt-20">
            <div className="lg:col-span-12 space-y-8 flex flex-col items-center text-center">
              <div className="space-y-4">
                <span className="text-xl md:text-2xl font-medium tracking-tight text-white/90">Hey, I'm a</span>
                <h1 className="text-7xl md:text-[8rem] lg:text-[10rem] font-black tracking-tighter leading-[0.8] mb-12">
                   {customData.role || 'Creative Director'}
                </h1>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-32 w-full pt-12 border-t border-white/20">
                 <div className="space-y-2 text-center md:text-left">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">#01</span>
                    <h4 className="text-lg font-bold text-white uppercase tracking-[0.2em]">Brand Strategy</h4>
                 </div>
                 <div className="space-y-2 text-center md:text-left">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">#02</span>
                    <h4 className="text-lg font-bold text-white uppercase tracking-[0.2em]">{repos.length}+ Projects</h4>
                 </div>
                 <div className="space-y-2 text-center md:text-left">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">#03</span>
                    <h4 className="text-lg font-bold text-white uppercase tracking-[0.2em]">UI/UX Design</h4>
                 </div>
                 <div className="space-y-2 text-center md:text-left">
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">#04</span>
                    <h4 className="text-lg font-bold text-white uppercase tracking-[0.2em]">{skills.length} Stack Tools</h4>
                 </div>
              </div>
            </div>
         </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-black py-20 overflow-hidden">
         <div className="flex justify-between items-center px-8 md:px-32 max-w-[1600px] mx-auto opacity-30 select-none grayscale flex-wrap gap-12">
            <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 whitespace-nowrap">Trusted by Brands I've Helped Shape</h4>
            <div className="flex items-center gap-16 flex-wrap justify-center">
               <div className="flex items-center gap-3 text-2xl font-black tracking-tighter"><Circle className="w-8 h-8 fill-zinc-500" /> Supa Blox</div>
               <div className="flex items-center gap-3 text-2xl font-black tracking-tighter"><Square className="w-8 h-8 fill-zinc-500 rotate-45" /> Hype Blox</div>
               <div className="flex items-center gap-3 text-2xl font-black tracking-tighter"><Zap className="w-8 h-8 fill-zinc-500" /> Frame Blox</div>
               <div className="flex items-center gap-3 text-2xl font-black tracking-tighter"><Triangle className="w-8 h-8 fill-zinc-500" /> Ultra Blox</div>
            </div>
         </div>
      </section>

      {/* Philosophy Section */}
      <section className="max-w-[1600px] mx-auto px-8 md:px-20 py-40 grid grid-cols-1 lg:grid-cols-2 gap-32">
         <div className="space-y-8">
            <h4 className="text-[10px] font-black text-[#FF4500] uppercase tracking-[0.5em]">Behind the Designs</h4>
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight">Shaping Experiences That Make Life Simpler</h2>
         </div>
         <div className="space-y-12 flex flex-col justify-end">
            <p className="text-xl md:text-2xl text-zinc-400 font-medium leading-relaxed max-w-xl">
               {customData.bio}
            </p>
            <div className="flex items-center gap-4">
               <button className="px-10 py-5 bg-[#FF4500] text-white text-sm font-black rounded-full hover:scale-105 transition-all shadow-xl flex items-center gap-3 group">
                  Get in touch <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
               </button>
            </div>
         </div>
      </section>

      {/* Dynamic Grid of Bento Cards */}
      <section className="max-w-[1600px] mx-auto px-8 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-8">
         {selectedRepos.map((repo, i) => (
           <motion.div 
             key={repo.id} 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             viewport={{ once: true }}
             className={cn(
               "aspect-[3/4] rounded-[3rem] p-10 flex flex-col justify-between group overflow-hidden relative border border-white/5",
               i % 3 === 0 ? "bg-[#111111]" : i % 3 === 1 ? "bg-zinc-900 shadow-2xl" : "bg-[#111111]"
             )}
           >
              <div className="absolute top-0 left-0 w-full h-full p-4 pointer-events-none origin-center transition-all duration-700 group-hover:scale-[1.05]">
                 <div className="w-full h-full bg-[#1a1a1a] rounded-[2.5rem] flex items-center justify-center opacity-40 shadow-inner group-hover:opacity-100 transition-opacity">
                    <StackIcon name={repo.language || 'Code'} className="w-24 h-24 grayscale group-hover:grayscale-0 transition-all opacity-20 group-hover:opacity-100" />
                 </div>
              </div>
              <div className="relative z-10 flex justify-between items-start">
                 <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] font-sans">#{(i+1).toString().padStart(2, '0')}</span>
                 <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center group-hover:bg-[#FF4500] group-hover:text-white transition-all scale-75 group-hover:scale-100 opacity-0 group-hover:opacity-100">
                    <ArrowUpRight className="w-6 h-6" />
                 </div>
              </div>
              <div className="relative z-10 space-y-4">
                 <h3 className="text-4xl font-black tracking-tight">{repo.name}</h3>
                 <p className="text-sm font-medium text-zinc-500 group-hover:text-zinc-300 transition-colors leading-relaxed line-clamp-3">
                    {repo.description || 'A visionary project pushing the boundaries of digital architecture.'}
                 </p>
              </div>
           </motion.div>
         ))}
      </section>

      {/* Large Stats Footer Section */}
      <section className="bg-white text-black py-40 mt-40">
         <div className="max-w-[1600px] mx-auto px-8 md:px-20 grid grid-cols-1 md:grid-cols-2 gap-32 items-center">
            <div className="space-y-8">
               <h2 className="text-6xl md:text-8xl font-black tracking-tighter leading-tight">Always Building the Future</h2>
               <p className="text-xl text-zinc-600 font-medium">Ready to start a new project? Let's make something amazing together.</p>
               <button className="px-12 py-6 bg-black text-white text-sm font-black rounded-full hover:translate-y-[-5px] transition-all flex items-center gap-3">
                  Start a conversation
               </button>
            </div>
            <div className="grid grid-cols-2 gap-12">
               <div>
                  <span className="text-7xl font-black block tracking-tighter">{(repos.length + experiences.length + education.length)}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Total Milestones</span>
               </div>
               <div>
                  <span className="text-7xl font-black block tracking-tighter">{skills.length}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Tech Tools</span>
               </div>
               <div>
                  <span className="text-7xl font-black block tracking-tighter">{approvedTestimonials.length}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Client Reviews</span>
               </div>
               <div>
                  <span className="text-7xl font-black block tracking-tighter">24/7</span>
                  <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Available</span>
               </div>
            </div>
         </div>
      </section>

      {/* Footer Minimal */}
      <footer className="max-w-[1600px] mx-auto px-8 py-20 flex flex-col md:flex-row justify-between items-center gap-12 border-t border-white/5 opacity-40">
         <div className="text-sm font-black uppercase tracking-[0.4em]">{firstName} {lastName}</div>
         <div className="flex gap-12 font-black text-[10px] uppercase tracking-[0.2em]">
            <a href="#" className="hover:text-[#FF4500]">Dribbble</a>
            <a href="#" className="hover:text-[#FF4500]">Twitter</a>
            <a href="#" className="hover:text-[#FF4500]">Instagram</a>
            <a href="#" className="hover:text-[#FF4500]">Behance</a>
         </div>
      </footer>
    </div>
  );
}
