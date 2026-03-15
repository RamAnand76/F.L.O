import React from 'react';
import { motion } from 'motion/react';
import { Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend: string;
  trendUp: boolean;
  delay: number;
  highlight?: boolean;
}

export function StatCard({ 
  icon, label, value, trend, trendUp, delay, highlight = false 
}: StatCardProps) {
  return (
    <motion.div 
      className={cn(
        "rounded-[2rem] p-6 border border-white/5 flex flex-col relative overflow-hidden",
        highlight ? "bg-gradient-to-br from-[#18181b] to-violet-900/40" : "bg-[#18181b]"
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}
    >
      {highlight && (
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-violet-500/20 blur-2xl rounded-full" />
      )}
      
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
          {icon}
          <span className="text-sm font-medium text-zinc-200">{label}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer">View all</span>
          <Maximize2 className="w-3.5 h-3.5 text-zinc-500 cursor-pointer" />
        </div>
      </div>
      
      <div className="mt-auto relative z-10">
        <h3 className="text-4xl font-bold tracking-tight mb-2">{value}</h3>
        <p className={cn("text-xs font-medium", trendUp ? "text-violet-400" : "text-orange-500")}>
          {trend} <span className="text-zinc-500 font-normal">from previous weeks</span>
        </p>
      </div>
    </motion.div>
  );
}
