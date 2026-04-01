'use client';

import React from 'react';
import { 
  Github, Mail, MapPin, ExternalLink, Star, Briefcase, GraduationCap, Quote, FolderOpen, 
  Linkedin, Twitter, Globe, Terminal, ChevronRight, Search, Command, FileCode, Cpu, User 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StackIcon } from '@/components/ui/StackIcon';
import { motion } from 'motion/react';

import { usePortfolioData } from '@/context/PortfolioDataContext';

export function DeveloperTemplate() {
  const { githubUser, customData, repos, selectedRepos, skills, experiences, education, approvedTestimonials, assets } = usePortfolioData();

  return (
    <div className="min-h-full bg-[#0d1117] text-[#c9d1d9] font-mono p-4 md:p-8 lg:p-12 selection:bg-[#58a6ff]/30 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Binary Hero Section */}
        <header className="relative p-10 md:p-16 border border-[#30363d] rounded-3xl bg-[#161b22] overflow-hidden group shadow-2xl">
          <div className="absolute top-0 right-0 p-8 opacity-5 text-white pointer-events-none group-hover:opacity-10 transition-opacity">
            <Terminal className="w-64 h-64" />
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-12 relative z-10">
            {githubUser?.avatar_url && (
              <div className="relative group/avatar">
                 <div className="absolute inset-0 bg-[#58a6ff] rounded-[2.5rem] blur-2xl opacity-10 group-hover/avatar:opacity-30 transition-opacity" />
                 <img src={githubUser.avatar_url} alt="Avatar" className="w-48 h-48 rounded-[2.5rem] border-4 border-[#30363d] relative z-10 shadow-2xl group-hover/avatar:border-[#58a6ff] transition-all" />
              </div>
            )}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
                <div className="px-3 py-1 bg-[#238636]/10 text-[#3fb950] border border-[#238636]/30 rounded-full text-[10px] font-black uppercase tracking-widest">System Active</div>
                <div className="px-3 py-1 bg-[#30363d] text-[#8b949e] border border-[#30363d] rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"><Command className="w-3 h-3" /> Root Access</div>
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-none overflow-hidden text-ellipsis">
                ~/{customData.name.toLowerCase().replace(/\s+/g, '-')}
              </h1>
              <p className="text-[#8b949e] mb-10 text-xl md:text-2xl leading-relaxed max-w-2xl font-medium italic opacity-80 group-hover:opacity-100 transition-opacity">
                // {customData.bio}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm font-bold uppercase tracking-widest">
                {customData.email && (
                  <a href={`mailto:${customData.email}`} className="flex items-center gap-2 hover:text-[#58a6ff] transition-all group/link">
                    <Mail className="w-4 h-4 group-hover/link:-translate-y-1 transition-transform" /> <span className="text-[#58a6ff]">contact@</span>user
                  </a>
                )}
                {customData.location && (
                   <span className="flex items-center gap-2 text-zinc-500"><MapPin className="w-4 h-4" /> {customData.location}</span>
                )}
                <div className="w-[2px] h-4 bg-zinc-800 self-center hidden md:block" />
                <div className="flex gap-6">
                   {customData.github && <a href={customData.github} className="hover:text-white transition-colors text-zinc-500">GitHub</a>}
                   {customData.twitter && <a href={customData.twitter} className="hover:text-white transition-colors text-zinc-500">X</a>}
                   {customData.linkedin && <a href={customData.linkedin} className="hover:text-white transition-colors text-zinc-500">LinkedIn</a>}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content Fork */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Project Log */}
            <section>
              <div className="flex items-center justify-between mb-8 border-b border-[#30363d] pb-4">
                 <h2 className="text-2xl font-black text-white flex items-center gap-3">
                   <div className="w-8 h-8 bg-[#3fb950] rounded-lg flex items-center justify-center text-black">
                     <FileCode className="w-5 h-5" />
                   </div>
                   src/repositories
                 </h2>
                 <span className="text-xs font-bold text-[#8b949e] uppercase tracking-widest">Count: {selectedRepos.length}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedRepos.map((repo, i) => (
                  <motion.div 
                    key={repo.id} 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-8 border border-[#30363d] rounded-2xl bg-[#0d1117] hover:border-[#58a6ff]/50 transition-all group/repo relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover/repo:opacity-30 group-hover/repo:scale-125 transition-all text-white">
                      <ChevronRight className="w-8 h-8" />
                    </div>
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-xl font-bold text-[#58a6ff] hover:underline mb-4 block tracking-tight">
                      {repo.name}
                    </a>
                    <p className="text-sm text-[#8b949e] mb-8 leading-relaxed line-clamp-3 h-15 font-sans">
                      {repo.description || '// Automated artifact description generated by system...'}
                    </p>
                    <div className="flex items-center justify-between border-t border-[#30363d] pt-6 mt-2">
                       <div className="flex items-center gap-3">
                        {repo.language && (
                          <div className="flex items-center gap-2 px-2.5 py-1 bg-[#161b22] rounded-md border border-[#30363d]">
                            <StackIcon name={repo.language} className="w-4 h-4 grayscale group-hover/repo:grayscale-0 transition-all font-sans" />
                            <span className="text-[10px] font-black uppercase text-[#8b949e]">{repo.language}</span>
                          </div>
                        )}
                       </div>
                       <div className="flex items-center gap-2 text-amber-500 font-bold text-xs">
                          <Star className="w-4 h-4 fill-current" />
                          {repo.stargazers_count}
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Experience / History Loop */}
            {(experiences.length > 0 || education.length > 0) && (
              <section className="p-10 border border-[#30363d] rounded-3xl bg-[#161b22]">
                <h2 className="text-2xl font-black text-white mb-10 flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#f78166] rounded-lg flex items-center justify-center text-black">
                     <Briefcase className="w-5 h-5" />
                  </div>
                  usr/logs/trajectory
                </h2>
                <div className="space-y-12 relative before:absolute before:left-3 md:before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-zinc-800">
                  {experiences.map((exp, i) => (
                    <div key={exp.id} className="relative pl-12 group/item">
                       <div className="absolute left-1.5 md:left-2.5 top-2 w-3 h-3 bg-zinc-800 border-2 border-[#161b22] rounded-full group-hover/item:bg-[#f78166] group-hover/item:scale-125 transition-all" />
                       <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4 mb-2">
                          <h3 className="text-2xl font-bold text-white tracking-tight">{exp.position}</h3>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-black px-4 py-1 rounded-full border border-zinc-800 text-[#8b949e]">
                            {exp.startDate} — {exp.endDate || 'CURRENT'}
                          </span>
                       </div>
                       <p className="text-lg font-bold text-[#58a6ff] mb-4">{exp.company}</p>
                       <p className="text-sm text-[#8b949e] leading-relaxed max-w-xl font-sans italic">
                         " {exp.description} "
                       </p>
                    </div>
                  ))}
                  {education.map(edu => (
                    <div key={edu.id} className="relative pl-12 opacity-60 hover:opacity-100 transition-opacity">
                       <div className="absolute left-1.5 md:left-2.5 top-2 w-3 h-3 border-2 border-zinc-800 rounded-full bg-black shadow-[0_0_10px_rgba(255,255,255,0.1)]" />
                       <h3 className="text-xl font-bold text-[#c9d1d9] mb-1">{edu.school}</h3>
                       <p className="text-sm text-[#8b949e] font-bold uppercase tracking-widest">{edu.degree} // {edu.fieldOfStudy}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* Testimonials Stream */}
            {approvedTestimonials.length > 0 && (
              <section>
                 <h2 className="text-2xl font-black text-white mb-8 flex items-center gap-3 border-b border-[#30363d] pb-4">
                  <div className="w-8 h-8 bg-[#d29922] rounded-lg flex items-center justify-center text-black">
                     <Quote className="w-5 h-5" />
                  </div>
                  shared/shoutouts.io
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {approvedTestimonials.map(t => (
                    <div key={t.id} className="p-8 border border-[#30363d] rounded-2xl bg-[#0d1117] relative group/quote">
                       <Quote className="absolute top-6 right-6 w-12 h-12 text-[#30363d] opacity-10 group-hover/quote:opacity-20 transition-opacity" />
                       <p className="text-[#8b949e] italic mb-10 text-lg leading-relaxed relative z-10 font-sans">
                          "{t.content}"
                       </p>
                       <div className="flex items-center gap-4 border-t border-[#30363d] pt-6 mt-4">
                          <img src={t.avatarUrl || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${t.name}`} alt={t.name} className="w-12 h-12 rounded-xl ring-2 ring-[#30363d] group-hover/quote:ring-[#d29922] transition-all" />
                          <div>
                            <p className="font-black text-white uppercase tracking-tight text-base">{t.name}</p>
                            <p className="text-[10px] text-[#8b949e] font-black uppercase tracking-widest">{t.role}</p>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar / Peripheral Content */}
          <div className="lg:col-span-4 space-y-12">
            <aside className="sticky top-12 space-y-12">
              
              {/* Stack Matrix */}
              <div className="p-8 border border-[#30363d] rounded-2xl bg-[#0d1117] shadow-xl">
                 <h2 className="text-xs font-black text-[#8b949e] uppercase tracking-[0.3em] mb-10 flex items-center justify-between">
                   <span>bin/capabilities</span>
                   <Cpu className="w-4 h-4" />
                 </h2>
                 <div className="grid grid-cols-2 gap-3">
                   {skills.map(skill => (
                     <div key={skill} className="flex flex-col gap-2 p-4 border border-[#30363d] rounded-xl bg-[#161b22] hover:bg-[#1c2128] transition-all cursor-default group/skill">
                       <StackIcon name={skill} className="w-8 h-8 grayscale group-hover/skill:grayscale-0 transition-all opacity-50 group-hover/skill:opacity-100" />
                       <span className="text-[10px] font-black uppercase tracking-tighter text-[#c9d1d9]">{skill}</span>
                     </div>
                   ))}
                 </div>
              </div>

              {/* Asset Vault */}
              {assets.length > 0 && (
                <div className="p-8 border border-[#30363d] rounded-2xl bg-black shadow-inner">
                  <h2 className="text-xs font-black text-[#8b949e] uppercase tracking-[0.3em] mb-8">mnt/static_assets</h2>
                  <div className="space-y-4">
                    {assets.map(asset => (
                      <a 
                        key={asset.id} 
                        href={asset.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-4 p-4 border border-[#30363d] rounded-xl bg-[#0d1117] hover:border-[#58a6ff]/50 transition-all group/asset"
                      >
                         <div className="w-12 h-12 bg-[#161b22] rounded-lg flex items-center justify-center text-zinc-500 group-hover/asset:text-[#58a6ff] transition-colors">
                           <FolderOpen className="w-6 h-6" />
                         </div>
                         <div className="min-w-0">
                            <p className="text-xs font-black text-[#c9d1d9] truncate group-hover/asset:text-white transition-colors">{asset.name.toUpperCase()}</p>
                            <div className="flex items-center gap-1.5 mt-1">
                               <div className="w-1.5 h-1.5 bg-[#3fb950] rounded-full" />
                               <span className="text-[10px] text-zinc-600 font-bold tracking-widest uppercase">{asset.type}</span>
                            </div>
                         </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* System Footer */}
              <div className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-800 text-center py-8 border-t border-[#30363d]">
                Generated by F.L.O v1.0.4
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
