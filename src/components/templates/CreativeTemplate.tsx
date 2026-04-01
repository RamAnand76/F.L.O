'use client';

import React from 'react';
import { 
  Github, Mail, MapPin, ExternalLink, Star, 
  Briefcase, GraduationCap, Quote, FolderOpen, 
  Linkedin, Twitter, Globe, ArrowRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StackIcon } from '@/components/ui/StackIcon';
import { motion } from 'motion/react';

import { usePortfolioData } from '@/context/PortfolioDataContext';

export function CreativeTemplate() {
  const { githubUser, customData, repos, selectedRepos, skills, experiences, education, approvedTestimonials, assets } = usePortfolioData();

  return (
    <div className="min-h-full bg-[#fdfdfc] text-[#1a1a1a] font-sans p-6 sm:p-12 md:p-16 selection:bg-[#FF6B6B] selection:text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
        
        {/* Floating Identity Bento */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:col-span-8 bg-[#FF6B6B] text-white rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 md:p-16 flex flex-col justify-between relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest mb-8">Creative Technologist</span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl xl:text-9xl font-black tracking-tighter leading-[0.85] mb-10 overflow-hidden text-ellipsis">
              {customData.name.split(' ')[0]}<br/>{customData.name.split(' ')[1] || ''}
            </h1>
          </div>
          <p className="text-2xl md:text-3xl font-medium opacity-90 relative z-10 max-w-xl leading-relaxed">
            {customData.bio}
          </p>
        </motion.div>

        {/* Global Hub Bento */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="md:col-span-4 bg-white rounded-[3rem] p-10 flex flex-col items-center justify-between text-center border border-zinc-100 shadow-xl"
        >
          <div className="relative group">
            <div className="absolute inset-0 bg-[#FF6B6B] rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            {githubUser?.avatar_url ? (
              <img src={githubUser.avatar_url} alt="Avatar" className="w-40 h-40 rounded-full relative z-10 border-8 border-white shadow-2xl" />
            ) : (
              <div className="w-40 h-40 rounded-full bg-zinc-100 flex items-center justify-center relative z-10 border-8 border-white shadow-2xl text-4xl font-black">
                {customData.name[0]}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-3 w-full mt-8">
            <div className="flex gap-3">
              {customData.email && (
                <a href={`mailto:${customData.email}`} className="flex-1 flex items-center justify-center gap-2 bg-black text-white hover:bg-zinc-800 py-4 rounded-2xl font-bold transition-all hover:scale-[1.02] active:scale-95 shadow-lg">
                  <Mail className="w-4 h-4" /> Say Hello
                </a>
              )}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {customData.github && (
                <a href={customData.github} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-zinc-50 border border-zinc-100 hover:border-zinc-200 py-4 rounded-2xl font-bold transition-all hover:bg-zinc-100 group">
                  <Github className="w-4 h-4 group-hover:rotate-12 transition-transform" /> GitHub
                </a>
              )}
              {customData.linkedin && (
                <a href={customData.linkedin} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-zinc-50 border border-zinc-100 hover:border-zinc-200 py-4 rounded-2xl font-bold transition-all hover:bg-zinc-100 group">
                  <Linkedin className="w-4 h-4 group-hover:-rotate-12 transition-transform" /> LinkedIn
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Tech Bento */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="md:col-span-12 bg-[#4ECDC4] rounded-[3rem] p-10 md:p-14 text-zinc-900 relative overflow-hidden shadow-xl"
        >
          <div className="absolute -bottom-10 -right-10 text-white/10 rotate-12">
            <Globe className="w-64 h-64" />
          </div>
          <h2 className="text-4xl font-black mb-10 tracking-tight flex items-center gap-4">
             Tech Stack
             <div className="h-[2px] w-20 bg-black/20" />
          </h2>
          <div className="flex flex-wrap gap-4 relative z-10">
            {skills.map(skill => (
              <span key={skill} className="px-8 py-4 bg-white rounded-2xl font-black text-sm shadow-xl flex items-center gap-3 hover:scale-110 transition-transform cursor-default">
                <StackIcon name={skill} className="w-6 h-6" />
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Dynamic Project Grid */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {selectedRepos.map((repo, i) => (
            <motion.a 
              key={repo.id} 
              href={repo.html_url} 
              target="_blank" 
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={cn(
                "group p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all relative overflow-hidden border border-transparent",
                i % 3 === 0 ? 'bg-[#FFE66D] text-black border-zinc-200/20' : 
                i % 3 === 1 ? 'bg-white text-black border-zinc-100' : 
                'bg-[#1A535C] text-white'
              )}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                  i % 3 === 2 ? "bg-white/10" : "bg-black/5"
                )}>
                  {repo.language ? <StackIcon name={repo.language} className="w-7 h-7" /> : <FolderOpen className="w-7 h-7" />}
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-black/5 rounded-full font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  {repo.stargazers_count}
                </div>
              </div>
              <h3 className="text-3xl font-black mb-4 tracking-tighter group-hover:translate-x-2 transition-transform flex items-center gap-2">
                {repo.name}
              </h3>
              <p className={cn(
                "text-base font-medium leading-relaxed mb-8 h-24 line-clamp-4",
                i % 3 === 2 ? "text-white/70" : "text-zinc-600"
              )}>
                {repo.description || 'Exploring the boundaries of technology and design through open-source contribution.'}
              </p>
              <div className="flex items-center justify-between font-black text-xs uppercase tracking-widest pt-6 border-t border-current opacity-10 group-hover:opacity-100 transition-opacity">
                <span>Repository</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.a>
          ))}
        </div>

        {/* Experience Timeline Bento */}
        {(experiences.length > 0 || education.length > 0) && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="md:col-span-12 bg-zinc-950 text-white rounded-[4rem] p-12 md:p-20 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[120px] rounded-full" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-16">
              <div className="lg:col-span-4">
                <h2 className="text-6xl font-black tracking-tighter mb-8 leading-none">Career<br/><span className="text-indigo-500">Log</span></h2>
                <p className="text-zinc-400 font-medium text-lg leading-relaxed">
                  A chronological trace of professional milestones and academic foundations.
                </p>
              </div>
              <div className="lg:col-span-8 flex flex-col gap-12">
                {experiences.map((exp, i) => (
                  <div key={exp.id} className="group relative pl-12">
                    <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-zinc-800" />
                    <div className="absolute left-[-5px] top-2 w-3 h-3 bg-indigo-500 rounded-full group-hover:scale-150 transition-transform" />
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                      <h3 className="text-3xl font-black tracking-tight">{exp.position}</h3>
                      <span className="text-xs font-black uppercase tracking-widest bg-zinc-900 px-4 py-2 rounded-full border border-zinc-800">{exp.startDate} — {exp.endDate || 'Present'}</span>
                    </div>
                    <p className="text-xl font-bold text-zinc-400 mb-4">{exp.company}</p>
                    <p className="text-zinc-500 font-medium leading-relaxed max-w-2xl">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Testimonials Masonry */}
        {approvedTestimonials.length > 0 && (
          <div className="md:col-span-12 py-12">
            <h2 className="text-5xl font-black tracking-tight mb-12 text-center">Global Feedback</h2>
            <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
              {approvedTestimonials.map((t, i) => (
                <motion.div 
                  key={t.id} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="break-inside-avoid p-10 bg-white border border-zinc-100 rounded-[3rem] shadow-xl relative group hover:rotate-1 transition-transform"
                >
                  <Quote className="w-12 h-12 text-zinc-100 absolute top-10 right-10 group-hover:text-[#FF6B6B]/20 transition-colors" />
                  <p className="text-xl font-bold leading-relaxed mb-10 text-zinc-800 italic">"{t.content}"</p>
                  <div className="flex items-center gap-4">
                    <img src={t.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${t.name}`} alt={t.name} className="w-14 h-14 rounded-2xl shadow-lg border-4 border-white" />
                    <div>
                      <h4 className="font-black text-lg">{t.name}</h4>
                      <p className="text-xs opacity-50 font-bold uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Horizontal Assets Scroller */}
        {assets.length > 0 && (
          <div className="md:col-span-12 bg-indigo-50 rounded-[4rem] p-12 md:p-16 border border-indigo-100 shadow-inner">
             <div className="flex flex-col md:flex-row items-center justify-between gap-8">
               <div>
                  <h3 className="text-3xl font-black mb-2">Vaulted Assets</h3>
                  <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs">Public Resources & Artifacts</p>
               </div>
               <div className="flex flex-wrap gap-4 justify-center">
                  {assets.map(asset => (
                    <a key={asset.id} href={asset.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 px-8 py-5 bg-white rounded-3xl border border-indigo-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group">
                      <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <FolderOpen className="w-6 h-6" />
                      </div>
                      <div className="text-left">
                        <span className="font-black text-base block leading-tight">{asset.name}</span>
                        <span className="text-[10px] font-black uppercase text-zinc-400 group-hover:text-indigo-400">{asset.type} artifact</span>
                      </div>
                    </a>
                  ))}
               </div>
             </div>
          </div>
        )}

        {/* Global Footer */}
        <footer className="md:col-span-12 py-20 mt-12 border-t border-zinc-100 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-black tracking-tighter mb-4">{customData.name}</h2>
              <p className="text-zinc-400 text-sm font-bold uppercase tracking-[0.3em]">Built with F.L.O Folio Intelligence</p>
            </div>
            <div className="flex gap-12 text-black font-black uppercase text-xs tracking-widest overflow-hidden">
               {['github', 'twitter', 'linkedin'].map(social => (
                 customData[social as keyof typeof customData] && (
                   <a key={social} href={customData[social as keyof typeof customData]} target="_blank" rel="noreferrer" className="hover:text-[#FF6B6B] transition-colors relative group">
                     {social}
                     <div className="absolute bottom-[-10px] left-0 right-0 h-1 bg-[#FF6B6B] translate-y-full group-hover:translate-y-0 transition-transform" />
                   </a>
                 )
               ))}
            </div>
        </footer>
      </div>
    </div>
  );
}
