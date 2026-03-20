import React from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Code2, ArrowUpRight, ExternalLink, Star, Plus } from 'lucide-react';
import { Repository } from '@/store/useStore';
import { StackIcon } from '@/components/ui/StackIcon';
import { cn } from '@/lib/utils';

interface FeaturedProjectsProps {
  selectedRepos: Repository[];
}

export function FeaturedProjects({ selectedRepos }: FeaturedProjectsProps) {
  return (
    <div className="mt-4">
      <motion.div 
        className="bg-[#18181b] rounded-[2rem] p-6 border border-white/5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
            <Code2 className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-medium text-zinc-200">Featured Projects</span>
          </div>
          <Link href="/folio-control" className="flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
            Manage <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {selectedRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedRepos.map((repo, i) => (
              <motion.div 
                key={repo.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1 + (i * 0.1) }}
                className="p-5 rounded-2xl bg-zinc-900/50 border border-white/5 hover:bg-white/5 transition-colors group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-zinc-100 truncate pr-4">{repo.name}</h3>
                  <a 
                    href={repo.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-zinc-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-sm text-zinc-400 line-clamp-2 mb-4 h-10">
                  {repo.description || 'No description provided.'}
                </p>
                <div className="flex items-center gap-4 text-xs text-zinc-500 mt-auto">
                  {repo.language && (
                    <span className="flex items-center gap-2 px-2.5 py-1 bg-white/5 rounded-full border border-white/10 shadow-sm backdrop-blur-sm group-hover:bg-white/10 transition-all">
                      <StackIcon name={repo.language} className="w-4 h-4" />
                      <span className="text-zinc-300 font-medium">{repo.language}</span>
                    </span>
                  )}
                  <span className={cn(
                    "flex items-center gap-1",
                    repo.stargazers_count > 0 && "text-amber-400 font-medium"
                  )}>
                    <Star className={cn("w-3.5 h-3.5", repo.stargazers_count > 0 && "fill-amber-400")} />
                    {repo.stargazers_count}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-2xl">
            <p className="text-zinc-500 text-sm mb-4">No projects selected for your portfolio yet.</p>
            <Link href="/folio-control" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Add Projects
            </Link>
          </div>
        )}
      </motion.div>
    </div>
  );
}
