'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { 
  Github, Mail, MapPin, ExternalLink, Star, 
  Briefcase, GraduationCap, Quote, FolderOpen, 
  Linkedin, Twitter, Globe, ArrowRight, ArrowUpRight, 
  Download, FileText, Layout, Zap, Database, Code
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StackIcon } from '@/components/ui/StackIcon';
import { motion } from 'motion/react';

export function VanshikaTemplate() {
  const { githubUser, customData, repos, selectedRepoIds, skills, experiences, education, testimonials, assets } = useStore();
  const selectedRepos = repos.filter(r => selectedRepoIds.includes(r.id));
  const approvedTestimonials = testimonials.filter(t => t.isApproved);

  const stats = [
    { label: 'Years Of Experience', value: '02+' },
    { label: 'Projects Completed', value: `${repos.length}+` },
    { label: 'Clients Served', value: '05+' }
  ];

  return (
    <div className="min-h-full bg-[#080808] text-[#fafafa] font-sans selection:bg-indigo-500 selection:text-white pb-32">
      {/* Dynamic Navigation */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 p-1 bg-black/40 border border-white/10 rounded-full backdrop-blur-2xl shadow-2xl">
        <div className="w-12 h-12 flex items-center justify-center bg-zinc-900 rounded-full font-bold text-sm tracking-tighter">
          {customData.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div className="flex items-center gap-1 px-4">
           {['Home', 'Services', 'About', 'Skills', 'Projects'].map(item => (
             <button key={item} className="px-4 py-2 text-[11px] font-bold text-zinc-500 hover:text-white transition-colors cursor-pointer uppercase tracking-widest leading-none">
               {item}
             </button>
           ))}
        </div>
        <button className="px-6 py-2 bg-white text-black text-[11px] font-black rounded-full hover:bg-zinc-200 transition-all uppercase tracking-widest leading-none shadow-xl">
          Let's Talk
        </button>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8 pt-64 pb-32 flex flex-col items-center lg:flex-row lg:items-center justify-between gap-20">
         <div className="flex-1 space-y-8 text-center lg:text-left">
           <div className="space-y-4">
             <span className="text-xl font-medium tracking-tight text-zinc-300">I am {customData.name.split(' ')[0]}</span>
             <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight max-w-2xl">
               {customData.role || 'Front-End Developer & Designer'}
             </h1>
             <p className="text-zinc-500 text-lg md:text-xl max-w-xl leading-relaxed mx-auto lg:mx-0">
               {customData.bio}
             </p>
           </div>
           <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button className="px-10 py-4 bg-zinc-800 text-white font-bold rounded-2xl border border-white/10 flex items-center gap-3 hover:bg-zinc-700 transition-all group active:scale-95">
                Download CV <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
              <div className="flex items-center gap-3">
                 {customData.linkedin && (
                   <a href={customData.linkedin} target="_blank" className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/20 hover:text-indigo-400 transition-all">
                     <Linkedin className="w-5 h-5" />
                   </a>
                 )}
                 {customData.github && (
                   <a href={customData.github} target="_blank" className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 hover:border-white/20 hover:text-white transition-all">
                     <Github className="w-5 h-5" />
                   </a>
                 )}
              </div>
           </div>
         </div>

         <div className="relative group">
            <div className="absolute inset-0 bg-indigo-500/10 blur-[100px] rounded-full group-hover:opacity-40 transition-opacity" />
            <div className="w-full max-w-[400px] aspect-square rounded-[4rem] overflow-hidden bg-zinc-900 border border-white/5 rotate-3 group-hover:rotate-0 transition-all duration-700 shadow-2xl relative z-10">
               <img 
                 src={githubUser?.avatar_url || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${customData.name}`} 
                 alt="Portrait" 
                 className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 transition-all duration-700" 
               />
            </div>
         </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-8 py-32 space-y-20">
         <div className="text-center space-y-4">
           <h2 className="text-5xl font-black tracking-tighter">Services</h2>
           <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">Designing clean scalable responsive websites</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Layout, title: 'UI/UX Website Design', desc: 'Clean, user-focused layouts with clear structure, smooth navigation, and strong visual hierarchy.' },
              { icon: Code, title: 'Frontend Development', desc: 'Responsive interfaces using HTML, CSS, and JavaScript for clean, consistent, reliable performance.' },
              { icon: Zap, title: 'Performance & Responsiveness', desc: 'Fast, mobile-first websites optimized for speed, accessibility, and dependable performance.' },
              { icon: Database, title: 'CMS Implementation', desc: 'Custom CMS setups with easy updates, fast loading, and scalable, clean, customizable layouts.' }
            ].map((service, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -5 }}
                className="p-10 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] flex flex-col gap-6 hover:bg-zinc-900 transition-all shadow-xl group"
              >
                <div className="w-12 h-12 bg-zinc-800 rounded-2xl flex items-center justify-center text-zinc-400 group-hover:text-indigo-400 transition-colors">
                  <service.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold tracking-tight leading-tight">{service.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{service.desc}</p>
                <div className="mt-4 pt-6 border-t border-white/5 grid grid-cols-1 gap-2">
                   <div className="px-3 py-1.5 bg-zinc-950/50 rounded-lg text-[10px] font-bold text-zinc-500 uppercase tracking-widest text-center">Service details</div>
                </div>
              </motion.div>
            ))}
         </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-8 py-32 space-y-20 bg-zinc-900/20 rounded-[4rem] border border-white/5 p-12">
         <div className="text-center space-y-4 max-w-4xl mx-auto">
           <h2 className="text-5xl font-black tracking-tighter">About Me</h2>
           <p className="text-zinc-500 text-lg font-medium leading-relaxed">
             I'm a {customData.role || 'front-end developer and designer'} passionate about crafting clean, intuitive, and responsive digital experiences. I focus on turning ideas into seamless interfaces by understanding user needs, designing thoughtful UI layouts, and ensuring smooth interactions across devices.
           </p>
         </div>

         <div className="space-y-12">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600">My Approach</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {['Understand users & goals', 'Create clean UI layouts', 'Responsive experiences'].map((step, i) => (
                 <div key={i} className="flex items-center gap-4 p-6 bg-black/40 border border-white/5 rounded-2xl shadow-xl">
                   <span className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-zinc-500">{(i+1).toString().padStart(2, '0')}</span>
                   <span className="text-sm font-bold text-zinc-300">{step}</span>
                 </div>
               ))}
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-20 pt-12 border-t border-white/5">
            {stats.map((stat, i) => (
               <div key={i} className="text-center flex flex-col gap-2">
                 <span className="text-6xl font-black tracking-tighter">{stat.value}</span>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">{stat.label}</span>
               </div>
            ))}
         </div>
      </section>

      {/* Skills Grid */}
      <section className="max-w-7xl mx-auto px-8 py-32 space-y-20">
         <div className="text-center space-y-4">
           <h2 className="text-5xl font-black tracking-tighter">Skills</h2>
           <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs italic">Crafting seamless UI/UX and clean code</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Core Skills', items: ['UI/UX layout', 'Frontend Dev', 'Responsive Design', 'Component-Based'] },
              { title: 'Frontend Tech', items: ['React', 'TypeScript', 'Tailwind', 'Next.js'] },
              { title: 'Design Tools', items: ['Figma', 'Photoshop', 'Illustrator', 'Framer'] },
              { title: 'Tools & Interaction', items: ['GitHub', 'Netlify', 'GSAP', 'UI Interactions'] }
            ].map((category, i) => (
              <div key={i} className="p-10 bg-zinc-900/40 border border-white/5 rounded-[2.5rem] space-y-8 shadow-xl">
                <h4 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">{category.title}</h4>
                <div className="flex flex-col gap-3">
                  {category.items.map(skill => (
                    <div key={skill} className="flex items-center gap-3 group">
                       <div className="w-1.5 h-1.5 rounded-full bg-zinc-700 group-hover:bg-indigo-400 transition-colors" />
                       <span className="text-sm text-zinc-500 font-medium group-hover:text-zinc-300 transition-colors">{skill}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
         </div>
      </section>

      {/* Projects Grid */}
      <section className="max-w-7xl mx-auto px-8 py-32 space-y-20">
         <div className="text-center space-y-4">
           <h2 className="text-5xl font-black tracking-tighter">Latest Projects</h2>
           <p className="text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">A selection of my recent works</p>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {selectedRepos.map((repo, i) => (
              <motion.a 
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-8 bg-zinc-900/40 border border-white/5 rounded-[3rem] space-y-8 hover:bg-zinc-900 transition-all shadow-2xl"
              >
                 <div className="aspect-video bg-zinc-950 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                    <div className="w-full h-full flex items-center justify-center text-zinc-800">
                       <StackIcon name={repo.language || 'Code'} className="w-24 h-24 opacity-20 group-hover:opacity-100 transition-opacity" />
                    </div>
                 </div>
                 <div className="flex justify-between items-end px-4">
                    <div className="space-y-4 max-w-[70%]">
                       <h3 className="text-3xl font-black tracking-tight">{repo.name}</h3>
                       <p className="text-sm text-zinc-500 font-medium line-clamp-2 leading-relaxed">{repo.description || 'Modern digital architecture solution built with clean principles.'}</p>
                    </div>
                    <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-full flex items-center justify-center text-zinc-500 group-hover:bg-white group-hover:text-black transition-all">
                       <ArrowUpRight className="w-8 h-8" />
                    </div>
                 </div>
              </motion.a>
            ))}
         </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-8 py-20 border-t border-white/5 text-center space-y-12">
         <div className="flex flex-col items-center gap-8">
            <h2 className="text-5xl font-black tracking-tighter">{customData.name}</h2>
            <div className="flex gap-12 font-bold text-[10px] uppercase tracking-[0.4em] text-zinc-500">
               {customData.github && <a href={customData.github} className="hover:text-white transition-colors">Github</a>}
               {customData.linkedin && <a href={customData.linkedin} className="hover:text-white transition-colors">Linkedin</a>}
               <a href={`mailto:${customData.email}`} className="hover:text-white transition-colors">Email</a>
            </div>
         </div>
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">© 2026 FLO Intelligence Portfolio Design</p>
      </footer>
    </div>
  );
}
