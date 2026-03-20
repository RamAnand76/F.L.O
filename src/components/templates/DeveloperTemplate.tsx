'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { Github, MapPin, Star, Code2 } from 'lucide-react';
import { StackIcon } from '@/components/ui/StackIcon';

export function DeveloperTemplate() {
  const { githubUser, customData, repos, selectedRepoIds, skills } = useStore();
  const selectedRepos = repos.filter(r => selectedRepoIds.includes(r.id));

  return (
    <div className="min-h-full bg-[#0d1117] text-[#c9d1d9] font-mono p-8 md:p-12">
      <div className="max-w-4xl mx-auto">
        <header className="border-b border-[#30363d] pb-10 mb-10 flex flex-col md:flex-row items-start md:items-center gap-8">
          {githubUser?.avatar_url && (
            <img src={githubUser.avatar_url} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-[#30363d]" />
          )}
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">~/{customData.name.toLowerCase().replace(/\s+/g, '-')}</h1>
            <p className="text-[#8b949e] mb-4 text-lg">{customData.bio}</p>
            <div className="flex flex-wrap gap-4 text-sm mt-4">
              {customData.location && (
                <span className="flex items-center gap-2 text-[#58a6ff]"><MapPin className="w-4 h-4" /> {customData.location}</span>
              )}
              {customData.github && (
                <a href={customData.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Github className="w-4 h-4" /> github.com/{customData.github.split('/').pop()}
                </a>
              )}
              {customData.website && (
                <a href={customData.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white transition-colors">
                  <Code2 className="w-4 h-4" /> website
                </a>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-10">
            <section>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Code2 className="w-5 h-5 text-[#3fb950]" /> Repositories</h2>
              <div className="space-y-4">
                {selectedRepos.map(repo => (
                  <div key={repo.id} className="p-5 border border-[#30363d] rounded-xl bg-[#161b22] hover:border-[#8b949e] transition-colors">
                    <a href={repo.html_url} target="_blank" rel="noreferrer" className="text-lg font-semibold text-[#58a6ff] hover:underline mb-2 block">
                      {repo.name}
                    </a>
                    <p className="text-sm text-[#8b949e] mb-4">{repo.description}</p>
                    <div className="flex items-center gap-4 text-xs">
                      {repo.language && (
                        <span className="flex items-center gap-1.5 px-2 py-0.5 bg-[#0d1117] rounded border border-[#30363d]">
                          <StackIcon name={repo.language} className="w-3 h-3" />
                          <span className="text-[#8b949e]">{repo.language}</span>
                        </span>
                      )}
                      <span className={`flex items-center gap-1 ${repo.stargazers_count > 0 ? 'text-amber-400 font-bold' : ''}`}>
                        <Star className={`w-4 h-4 ${repo.stargazers_count > 0 ? 'fill-amber-400' : ''}`} /> 
                        {repo.stargazers_count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <div>
            <section className="sticky top-8">
              <h2 className="text-xl font-bold text-white mb-6">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span key={skill} className="flex items-center gap-2 px-3 py-1 border border-[#30363d] rounded-md text-sm bg-[#21262d] text-[#c9d1d9]">
                    <StackIcon name={skill} className="w-3.5 h-3.5" />
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
