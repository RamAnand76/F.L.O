'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { 
  Github, Mail, MapPin, ExternalLink, Star, 
  Briefcase, GraduationCap, Quote, FolderOpen, 
  Linkedin, Twitter, Globe, ArrowRight 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { StackIcon } from '@/components/ui/StackIcon';
import { motion } from 'motion/react';

export function MinimalTemplate() {
  const { githubUser, customData, repos, selectedRepoIds, skills, education, experiences, testimonials, assets } = useStore();
  const selectedRepos = repos.filter(r => selectedRepoIds.includes(r.id));

  return (
    <div className="min-h-full bg-white text-zinc-900 font-sans p-8 md:p-32 selection:bg-black selection:text-white max-w-7xl mx-auto border-x border-zinc-100/50 shadow-2xl relative">
      {/* Decorative vertical line */}
      <div className="absolute left-16 md:left-32 top-0 bottom-0 w-[1px] bg-zinc-100 hidden lg:block" />

      <header className="mb-32 relative z-10 transition-all duration-700">
        <motion.p initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-sm font-bold tracking-[0.3em] uppercase text-zinc-400 mb-12">Foundational Profile</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl md:text-9xl font-bold tracking-tighter mb-10 leading-[0.85]">{customData.name}</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-2xl md:text-3xl text-zinc-500 max-w-3xl leading-relaxed font-light">{customData.bio}</motion.p>
        
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-8 mt-12 text-sm font-bold uppercase tracking-widest text-zinc-400">
          {customData.email && (
            <a href={`mailto:${customData.email}`} className="flex items-center gap-2 hover:text-black transition-all group">
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" /> {customData.email}
            </a>
          )}
          {customData.location && (
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {customData.location}
            </span>
          )}
          {customData.website && (
            <a href={customData.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-black transition-all group">
              <Globe className="w-4 h-4 group-hover:scale-110 transition-transform" /> Connect
            </a>
          )}
        </motion.div>
      </header>

      {skills.length > 0 && (
        <section className="mb-32 relative z-10">
          <div className="flex flex-col lg:flex-row gap-12">
            <div className="lg:w-1/4">
               <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-300">Proficiencies</h2>
            </div>
            <div className="lg:w-3/4 flex flex-wrap gap-4">
              {skills.map(skill => (
                <span key={skill} className="px-6 py-3 bg-zinc-50 border border-zinc-100 rounded-full text-sm font-bold flex items-center gap-3 transition-colors hover:bg-zinc-100">
                  <StackIcon name={skill} className="w-5 h-5 grayscale" />
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mb-32 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 mb-16 items-baseline">
           <div className="lg:w-1/4">
             <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-300">Portfolio Selection</h2>
           </div>
           <p className="text-zinc-500 font-medium tracking-tight">Selected artifacts across the open source multiverse.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {selectedRepos.map(repo => (
            <a 
              key={repo.id} 
              href={repo.html_url} 
              target="_blank" 
              rel="noreferrer"
              className="group block p-12 rounded-[3rem] bg-zinc-50 border border-zinc-100 hover:border-zinc-200 hover:shadow-2xl transition-all duration-500 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 text-zinc-200 group-hover:text-black transition-colors">
                <ExternalLink className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-4 tracking-tight">{repo.name}</h3>
              <p className="text-zinc-500 text-lg mb-10 leading-relaxed font-light">{repo.description || 'System artifact exploring boundaries of technology.'}</p>
              <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-widest text-zinc-400">
                {repo.language && (
                  <span className="flex items-center gap-2">
                    <StackIcon name={repo.language} className="w-4 h-4 grayscale" />
                    {repo.language}
                  </span>
                )}
                <span className={`flex items-center gap-2 ${repo.stargazers_count > 0 ? 'text-amber-500' : ''}`}>
                  <Star className={`w-4 h-4 ${repo.stargazers_count > 0 ? 'fill-amber-500' : ''}`} /> 
                  {repo.stargazers_count}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {(experiences.length > 0 || education.length > 0) && (
        <section className="mb-32 relative z-10">
          <div className="lg:w-1/4 mb-16">
             <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-300">Trajectory</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
            {experiences.length > 0 && (
              <div className="space-y-12">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-10 border-b border-zinc-100 pb-4">Professional Experience</h3>
                {experiences.map(exp => (
                  <div key={exp.id} className="group">
                    <div className="flex justify-between items-baseline mb-3">
                       <h4 className="font-bold text-2xl tracking-tighter group-hover:translate-x-1 transition-transform">{exp.company}</h4>
                       <span className="text-[10px] font-black uppercase tracking-widest text-zinc-300">{exp.startDate} - {exp.endDate || 'Present'}</span>
                    </div>
                    <p className="text-zinc-500 text-base font-bold mb-4">{exp.position}</p>
                    <p className="text-zinc-500 text-base leading-relaxed font-light italic">" {exp.description} "</p>
                  </div>
                ))}
              </div>
            )}
            {education.length > 0 && (
              <div className="space-y-12">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-10 border-b border-zinc-100 pb-4">Academic Background</h3>
                {education.map(edu => (
                  <div key={edu.id} className="group">
                    <h4 className="font-bold text-2xl tracking-tighter mb-2">{edu.school}</h4>
                    <p className="text-zinc-500 font-bold mb-1">{edu.degree}</p>
                    <p className="text-zinc-400 text-sm font-medium italic">{edu.fieldOfStudy}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {testimonials.length > 0 && (
        <section className="mb-32 relative z-10">
          <div className="lg:w-1/4 mb-16">
             <h2 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-300">Citations</h2>
          </div>
          <div className="columns-1 md:columns-2 gap-12 space-y-12">
            {testimonials.map(t => (
              <div key={t.id} className="break-inside-avoid p-12 bg-zinc-950 text-white rounded-[3rem] shadow-2xl transition-transform hover:-rotate-1">
                <Quote className="w-10 h-10 text-white opacity-10 mb-8" />
                <p className="text-zinc-400 text-2xl font-light mb-12 leading-relaxed italic">"{t.content}"</p>
                <div className="flex items-center gap-6">
                  <img src={t.avatarUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${t.name}`} alt={t.name} className="w-12 h-12 rounded-full ring-2 ring-white/10" />
                  <div>
                    <p className="font-bold text-lg">{t.name}</p>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {assets.length > 0 && (
        <section className="relative z-10 pb-32 border-t border-zinc-100 pt-32 mt-32">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <h2 className="text-6xl font-black lowercase tracking-tighter text-zinc-100">Downloads.zip</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              {assets.map(asset => (
                <a key={asset.id} href={asset.url} target="_blank" rel="noreferrer" className="flex items-center gap-4 px-8 py-4 bg-zinc-50 border border-zinc-100 rounded-2xl hover:bg-black hover:text-white transition-all group shadow-sm">
                   <FolderOpen className="w-5 h-5 text-zinc-400 group-hover:text-white" />
                   <span className="font-bold text-base tracking-tight">{asset.name}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <footer className="pt-32 border-t border-zinc-100 pb-16 flex flex-col md:flex-row justify-between items-center text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em] gap-8">
        <p>© {new Date().getFullYear()} {customData.name} — Generated by F.L.O</p>
        <div className="flex gap-8">
           {customData.github && <a href={customData.github} className="hover:text-black transition-colors">GitHub</a>}
           {customData.twitter && <a href={customData.twitter} className="hover:text-black transition-colors">X</a>}
           {customData.linkedin && <a href={customData.linkedin} className="hover:text-black transition-colors">LinkedIn</a>}
        </div>
      </footer>
    </div>
  );
}
