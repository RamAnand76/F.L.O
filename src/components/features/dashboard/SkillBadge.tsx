import React from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { StackIcon } from '@/components/ui/StackIcon';

interface SkillBadgeProps {
  key?: React.Key;
  skill: string;
  onDelete: () => void;
}

export function SkillBadge({ skill, onDelete }: SkillBadgeProps) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255, 255, 255, 0.1)' }}
      className="group flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-sm text-zinc-300 hover:bg-white/10 transition-colors cursor-default"
    >
      {skill}
      <button
        onClick={onDelete}
        className="text-zinc-500 hover:text-red-400 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.span>
  );
}
