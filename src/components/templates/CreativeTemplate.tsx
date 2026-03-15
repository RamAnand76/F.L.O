'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Github, Mail, MapPin, ExternalLink, Star } from 'lucide-react';

export function CreativeTemplate() {
  const { githubUser, customData, repos, selectedRepoIds, skills } = useStore();
  const selectedRepos = repos.filter(r => selectedRepoIds.includes(r.id));

  return (
    <div className="min-h-full bg-[#f5f5f0] text-[#1a1a1a] font-sans p-6 md:p-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Hero Bento */}
        <div className="md:col-span-8 bg-[#FF6B6B] text-white rounded-[2rem] p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-none mb-8 relative z-10">
            {customData.name}
          </h1>
          <p className="text-xl md:text-2xl font-medium opacity-90 relative z-10 max-w-lg">
            {customData.bio}
          </p>
        </div>

        {/* Profile Bento */}
        <div className="md:col-span-4 bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <img src={githubUser?.avatar_url} alt="Avatar" className="w-32 h-32 rounded-full mb-6 shadow-lg" />
          <div className="flex flex-col gap-3 w-full">
            {customData.email && (
              <a href={`mailto:${customData.email}`} className="flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 py-3 rounded-xl font-medium transition-colors">
                <Mail className="w-4 h-4" /> Email Me
              </a>
            )}
            {customData.github && (
              <a href={customData.github} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-zinc-900 text-white hover:bg-zinc-800 py-3 rounded-xl font-medium transition-colors">
                <Github className="w-4 h-4" /> GitHub
              </a>
            )}
            {customData.website && (
              <a href={customData.website} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 bg-zinc-100 hover:bg-zinc-200 py-3 rounded-xl font-medium transition-colors">
                <ExternalLink className="w-4 h-4" /> Website
              </a>
            )}
          </div>
        </div>

        {/* Skills Bento */}
        <div className="md:col-span-12 bg-[#4ECDC4] rounded-[2rem] p-10 text-zinc-900">
          <h2 className="text-2xl font-bold mb-6">Tech Arsenal</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map(skill => (
              <span key={skill} className="px-5 py-2.5 bg-white/40 backdrop-blur-sm rounded-xl font-bold text-sm shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Projects Bento */}
        <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedRepos.map((repo, i) => (
            <a 
              key={repo.id} 
              href={repo.html_url} 
              target="_blank" 
              rel="noreferrer"
              className={`group p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all ${
                i % 3 === 0 ? 'bg-[#FFE66D]' : i % 3 === 1 ? 'bg-white' : 'bg-[#1A535C] text-white'
              }`}
            >
              <h3 className="text-2xl font-bold mb-4 flex items-center justify-between">
                {repo.name}
                <ExternalLink className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className={`mb-8 line-clamp-3 ${i % 3 === 2 ? 'text-white/80' : 'text-zinc-600'}`}>
                {repo.description}
              </p>
              <div className="flex items-center gap-4 font-bold text-sm">
                {repo.language && <span>{repo.language}</span>}
                <span className="flex items-center gap-1"><Star className="w-4 h-4" /> {repo.stargazers_count}</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </div>
  );
}
