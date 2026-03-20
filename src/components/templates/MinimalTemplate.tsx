'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Github, Mail, MapPin, ExternalLink, Star } from 'lucide-react';
import { StackIcon } from '@/components/ui/StackIcon';

export function MinimalTemplate() {
  const { githubUser, customData, repos, selectedRepoIds, skills } = useStore();
  const selectedRepos = repos.filter(r => selectedRepoIds.includes(r.id));

  return (
    <div className="min-h-full bg-white text-zinc-900 font-sans p-8 md:p-16 selection:bg-black selection:text-white">
      <header className="mb-20">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">{customData.name}</h1>
        <p className="text-xl md:text-2xl text-zinc-500 max-w-2xl leading-relaxed">{customData.bio}</p>
        
        <div className="flex flex-wrap gap-6 mt-8 text-sm font-medium">
          {customData.email && (
            <a href={`mailto:${customData.email}`} className="flex items-center gap-2 hover:text-zinc-500 transition-colors">
              <Mail className="w-4 h-4" /> {customData.email}
            </a>
          )}
          {customData.location && (
            <span className="flex items-center gap-2 text-zinc-500">
              <MapPin className="w-4 h-4" /> {customData.location}
            </span>
          )}
          {customData.website && (
            <a href={customData.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-zinc-500 transition-colors">
              <ExternalLink className="w-4 h-4" /> Website
            </a>
          )}
          {customData.github && (
            <a href={customData.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-zinc-500 transition-colors">
              <Github className="w-4 h-4" /> GitHub
            </a>
          )}
        </div>
      </header>

      {skills.length > 0 && (
        <section className="mb-20">
          <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-8">Expertise</h2>
          <div className="flex flex-wrap gap-3">
            {skills.map(skill => (
              <span key={skill} className="px-4 py-2 bg-zinc-100 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-8">Selected Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {selectedRepos.map(repo => (
            <a 
              key={repo.id} 
              href={repo.html_url} 
              target="_blank" 
              rel="noreferrer"
              className="group block p-8 rounded-3xl bg-zinc-50 hover:bg-zinc-100 transition-colors"
            >
              <h3 className="text-xl font-bold mb-3 flex items-center justify-between">
                {repo.name}
                <ExternalLink className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-zinc-600 mb-6 line-clamp-2">{repo.description}</p>
              <div className="flex items-center gap-4 text-sm font-medium text-zinc-500">
                {repo.language && (
                  <span className="flex items-center gap-1.5 px-2 py-1 bg-zinc-100/50 rounded-lg">
                    <StackIcon name={repo.language} className="w-3.5 h-3.5" />
                    {repo.language}
                  </span>
                )}
                <span className={`flex items-center gap-1.5 ${repo.stargazers_count > 0 ? 'text-amber-500 font-bold' : ''}`}>
                  <Star className={`w-4 h-4 ${repo.stargazers_count > 0 ? 'fill-amber-500' : ''}`} /> 
                  {repo.stargazers_count}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
