import React from 'react';
import { motion } from 'motion/react';
import { Check, Star, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StackIcon } from '@/components/ui/StackIcon';

interface RepoCardProps {
  key?: React.Key;
  repo: any;
  isSelected: boolean;
  onToggle: () => void;
  index: number;
}

export function RepoCard({ repo, isSelected, onToggle, index }: RepoCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -10 }}
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      onClick={onToggle}
      className={cn(
        "group relative p-5 rounded-3xl border cursor-pointer transition-all duration-300",
        isSelected 
          ? "bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_30px_-10px_rgba(99,102,241,0.3)]" 
          : "bg-zinc-900/30 border-white/5 hover:bg-white/5 hover:border-white/20"
      )}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-zinc-100 truncate pr-8">{repo.name}</h3>
        <div className={cn(
          "w-6 h-6 rounded-full flex items-center justify-center border transition-colors",
          isSelected ? "bg-indigo-500 border-indigo-500 text-white" : "border-zinc-600 text-transparent group-hover:border-zinc-400"
        )}>
          <Check className="w-3.5 h-3.5" />
        </div>
      </div>
      
      <p className="text-sm text-zinc-400 line-clamp-2 mb-4 h-10">
        {repo.description || 'No description provided.'}
      </p>
      
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        {repo.language && (
          <span className="flex items-center gap-2 px-2.5 py-1 bg-white/5 rounded-full border border-white/10 group-hover:bg-white/10 transition-all font-medium text-xs tracking-tight shadow-sm">
            <StackIcon name={repo.language} className="w-4 h-4" />
            <span className="text-zinc-200">{repo.language}</span>
          </span>
        )}
        <span className="flex items-center gap-1">
          <Star className="w-3.5 h-3.5" />
          {repo.stargazers_count}
        </span>
        <a 
          href={repo.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="ml-auto flex items-center gap-1 hover:text-zinc-300 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </motion.div>
  );
}
