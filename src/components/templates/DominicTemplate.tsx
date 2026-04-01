'use client';

import React from 'react';
import { 
  Github, Mail, MapPin, ExternalLink, Star, 
  Briefcase, GraduationCap, Quote, FolderOpen, 
  Linkedin, Twitter, Globe, ArrowRight, ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StackIcon } from '@/components/ui/StackIcon';
import { motion } from 'motion/react';

import { usePortfolioData } from '@/context/PortfolioDataContext';

export function DominicTemplate() {
  const { githubUser, customData, repos, selectedRepos, skills, experiences, education, approvedTestimonials, assets } = usePortfolioData();

  const firstName = customData.name.split(' ')[0] || 'Design';
  const lastName = customData.name.split(' ')[1] || 'Maven';

  return (
    <div className="min-h-full bg-[#111111] text-white font-sans selection:bg-[#FF6B2C] selection:text-white pb-20">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FF6B2C] rounded-full flex items-center justify-center font-bold text-black italic">
            {firstName[0]}
          </div>
          <span className="font-bold tracking-tight">{firstName}</span>
        </div>
        <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex flex-col items-center justify-center gap-1 group hover:bg-white/10 transition-all">
          <div className="w-5 h-px bg-white group-hover:w-6 transition-all" />
          <div className="w-5 h-px bg-white group-hover:w-4 transition-all" />
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-8 space-y-12">
          <div className="space-y-4">
            <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full w-fit">
              <div className="w-2 h-2 bg-[#FF6B2C] rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Available for hire</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight max-w-md">
              {customData.role || 'Brand & UI/UX Designer'} based in {customData.location || 'the Digital Space'}
            </h2>
          </div>
          <h1 className="text-8xl md:text-[12rem] font-bold tracking-tighter leading-[0.8] text-white">
            {firstName}<br/>
            <span className="text-white/20">{lastName}</span>
          </h1>
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="relative aspect-square rounded-[3rem] overflow-hidden group">
            <img 
              src={githubUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${customData.name}`} 
              alt="Profile" 
              className="w-full h-full object-cover grayscale brightness-75 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <motion.a 
              href={`mailto:${customData.email}`}
              whileHover={{ scale: 1.1, rotate: 45 }}
              className="absolute bottom-8 right-8 w-16 h-16 bg-[#FF6B2C] rounded-full flex items-center justify-center text-black"
            >
              <ArrowUpRight className="w-8 h-8" />
            </motion.a>
          </div>
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div>
              <span className="text-3xl font-bold block">20+</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Years Experience</span>
            </div>
            <div>
              <span className="text-3xl font-bold block">{repos.length}+</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Projects Built</span>
            </div>
            <div>
              <span className="text-3xl font-bold block">500+</span>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Commits Made</span>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Scrolling (Marquee style simulation) */}
      <div className="py-20 border-y border-white/5 overflow-hidden whitespace-nowrap opacity-30 select-none">
        <div className="flex gap-20 items-center animate-marquee">
          {skills.concat(skills).map((skill, i) => (
             <div key={i} className="flex items-center gap-4 text-4xl font-bold tracking-tighter grayscale">
               <StackIcon name={skill} className="w-10 h-10" />
               {skill} Hub
             </div>
          ))}
        </div>
      </div>

      {/* Services / Philosophy */}
      <section className="max-w-7xl mx-auto px-8 py-32 grid grid-cols-1 md:grid-cols-2 gap-20">
        <div className="space-y-8">
           <h2 className="text-5xl font-bold tracking-tight leading-tight">
             Crafting Meaningful Brands & Intuitive Digital Experiences That Stand Out
           </h2>
           <p className="text-xl text-zinc-400 leading-relaxed max-w-xl">
             {customData.bio}
           </p>
           <button className="flex items-center gap-3 px-8 py-4 bg-[#FF6B2C] text-black font-bold rounded-full hover:scale-105 transition-all group">
             See my works <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
           </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
           {assets.slice(0, 4).map((asset, i) => (
              <div key={asset.id} className={cn(
                "aspect-[3/4] bg-zinc-900 rounded-[2.5rem] overflow-hidden p-6 relative group",
                i % 2 === 1 ? "mt-12" : ""
              )}>
                <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B2C]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 text-[10px] font-bold uppercase tracking-widest text-[#FF6B2C]">Artifact {i+1}</span>
                <h4 className="relative z-10 text-xl font-bold mt-2">{asset.name}</h4>
                <div className="absolute bottom-6 left-6 right-6 h-px bg-white/10" />
              </div>
           ))}
           {assets.length === 0 && Array.from({length: 2}).map((_, i) => (
             <div key={i} className={cn(
                "aspect-[3/4] bg-zinc-900/50 border border-white/5 rounded-[2.5rem] overflow-hidden flex items-center justify-center",
                i % 2 === 1 ? "mt-12" : ""
              )}>
                <FolderOpen className="w-12 h-12 text-zinc-800" />
              </div>
           ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-8 py-32 space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/10 pb-12">
          <div className="space-y-4">
            <h2 className="text-6xl font-bold tracking-tighter">Design That Delivers Real Results</h2>
            <p className="text-zinc-500 max-w-md">From increased engagement to stronger brand recognition, my work is backed by measurable impact.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {selectedRepos.map((repo, i) => (
             <motion.a 
               key={repo.id}
               href={repo.html_url}
               target="_blank"
               className="group flex flex-col gap-6"
               whileHover={{ y: -10 }}
             >
                <div className="aspect-[4/5] bg-zinc-900 rounded-[3rem] overflow-hidden relative border border-white/5">
                   <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="absolute top-10 right-10 w-12 h-12 bg-white/5 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 opacity-0 group-hover:opacity-100 transition-all scale-50 group-hover:scale-100">
                     <ArrowUpRight className="w-6 h-6" />
                   </div>
                   <div className="p-12 flex flex-col justify-end h-full">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#FF6B2C] mb-4">{(repo.language || 'Code').toUpperCase()}</span>
                      <h3 className="text-4xl font-bold tracking-tight mb-4">{repo.name}</h3>
                      <p className="text-sm text-zinc-500 line-clamp-3 leading-relaxed">{repo.description || 'A visionary project pushing the boundaries of digital architecture.'}</p>
                   </div>
                </div>
                <div className="px-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-bold text-zinc-500">{(i+1).toString().padStart(2, '0')}</span>
                    <div className="h-px w-10 bg-white/10" />
                    <span className="text-xs font-bold uppercase tracking-widest">{repo.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                     <Star className="w-3 h-3 fill-[#FF6B2C] text-[#FF6B2C]" />
                     <span className="text-[10px] font-bold">{repo.stargazers_count}</span>
                  </div>
                </div>
             </motion.a>
           ))}
        </div>
      </section>

      {/* Pricing / Plan Choice */}
      <section className="max-w-7xl mx-auto px-8 py-32 space-y-16">
        <h2 className="text-5xl font-bold tracking-tighter text-center">Choose your Plan</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { name: 'Basic Plan', price: '$2990', desc: 'Start Your Journey', color: 'bg-zinc-900 border-white/5' },
             { name: 'Pro Plan', price: '$4990', desc: 'Elevate Your Brand', color: 'bg-[#FF6B2C] text-black border-[#FF6B2C]' },
             { name: 'Enterprise Plan', price: '$6990', desc: 'Complete Branding Solution', color: 'bg-zinc-900 border-white/5' }
           ].map((plan, i) => (
             <div key={i} className={cn("p-10 rounded-[2.5rem] border flex flex-col gap-10 shadow-2xl relative overflow-hidden group", plan.color)}>
                {i === 1 && <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl" />}
                <div className="space-y-2">
                   <h4 className="text-sm font-bold uppercase tracking-widest opacity-60">{plan.name}</h4>
                   <h3 className="text-6xl font-black">{plan.price}</h3>
                   <p className="text-sm font-bold opacity-80">{plan.desc}</p>
                </div>
                <div className="space-y-4 flex-1">
                   {[1,2,3,4].map(f => (
                     <div key={f} className="flex items-center gap-3">
                        <div className={cn("w-1.5 h-1.5 rounded-full", i === 1 ? "bg-black" : "bg-[#FF6B2C]")} />
                        <span className="text-xs font-medium opacity-80">Premium Design Service {f}</span>
                     </div>
                   ))}
                </div>
                <button className={cn(
                  "w-full py-4 rounded-2xl font-bold text-sm transition-all",
                  i === 1 ? "bg-black text-white hover:bg-zinc-900" : "bg-white text-black hover:bg-zinc-200"
                )}>
                  Contact me
                </button>
             </div>
           ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-3xl mx-auto px-8 py-40 text-center space-y-12">
        <h2 className="text-7xl md:text-8xl font-bold tracking-tighter leading-none">Let's Create Something Exceptional</h2>
        <p className="text-xl text-zinc-500">Collaborate to create a bold brand or seamless digital experience. Get in touch!</p>
        <button className="px-12 py-5 bg-[#FF6B2C] text-black text-lg font-black rounded-full hover:scale-110 transition-all shadow-[0_20px_50px_rgba(255,107,44,0.3)]">
          Elevate your brand
        </button>
      </section>

      {/* Minimal Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-start gap-12">
         <div className="space-y-4">
           <div className="flex items-center gap-2">
             <div className="w-6 h-6 bg-[#FF6B2C] rounded-full flex items-center justify-center font-bold text-[10px] text-black italic">
               {firstName[0]}
             </div>
             <span className="font-bold tracking-tight text-sm">{firstName}</span>
           </div>
           <p className="text-xs text-zinc-600 max-w-xs leading-relaxed">
             Design-driven solutions for the next generation of builders and visionaries.
           </p>
         </div>
         <div className="grid grid-cols-2 sm:grid-cols-3 gap-16">
            <div className="space-y-3">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Socials</h5>
              <div className="flex flex-col gap-2 lowercase text-sm font-medium text-zinc-400">
                {customData.github && <a href={customData.github} className="hover:text-[#FF6B2C] transition-colors">Github</a>}
                {customData.twitter && <a href={customData.twitter} className="hover:text-[#FF6B2C] transition-colors">Twitter</a>}
                {customData.linkedin && <a href={customData.linkedin} className="hover:text-[#FF6B2C] transition-colors">Linkedin</a>}
              </div>
            </div>
            <div className="space-y-3">
              <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Navigation</h5>
              <div className="flex flex-col gap-2 lowercase text-sm font-medium text-zinc-400">
                 <a href="#" className="hover:text-[#FF6B2C]">Work</a>
                 <a href="#" className="hover:text-[#FF6B2C]">Review</a>
                 <a href="#" className="hover:text-[#FF6B2C]">About</a>
              </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
