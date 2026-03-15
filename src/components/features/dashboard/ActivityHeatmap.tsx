import React from 'react';
import { motion } from 'motion/react';
import { Activity, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityHeatmapProps {
  viewDate: Date;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setViewDate: (date: Date) => void;
  heatmapDays: Date[];
  activityMap: Map<string, number>;
}

export function ActivityHeatmap({
  viewDate,
  selectedDate,
  setSelectedDate,
  setViewDate,
  heatmapDays,
  activityMap,
}: ActivityHeatmapProps) {
  return (
    <motion.div 
      className="lg:col-span-6 bg-[#18181b] rounded-[2rem] p-6 border border-white/5 flex flex-col"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.9 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
          <Activity className="w-4 h-4 text-zinc-300" />
          <span className="text-sm font-medium text-zinc-200">Weekly Engagement</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500 hover:text-zinc-300 cursor-pointer">View all</span>
          <RefreshCw className="w-3.5 h-3.5 text-zinc-500 cursor-pointer" />
        </div>
      </div>

      <div className="flex items-center gap-4 text-xs text-zinc-500 mb-6">
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#2d2d30]" /> Low</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-900" /> Medium</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-600" /> High</div>
        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-violet-400" /> Best</div>
      </div>

      <div className="flex-1 flex items-end">
        <div className="w-full flex gap-2">
          <div className="flex flex-col justify-between text-[10px] text-zinc-500 py-1 pr-2 h-full">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>
          
          <div className="flex-1 grid grid-flow-col grid-rows-7 gap-1.5">
            {heatmapDays.map((date, i) => {
              const val = activityMap.get(date.toDateString()) || 0;
              const isSelected = selectedDate.toDateString() === date.toDateString();
              let bgClass = "bg-[#2d2d30]";
              if (val === 1) bgClass = "bg-violet-900/50";
              if (val === 2) bgClass = "bg-violet-800";
              if (val === 3) bgClass = "bg-violet-600";
              if (val === 4) bgClass = "bg-violet-400 shadow-[0_0_8px_rgba(167,139,250,0.4)]";
              
              return (
                <div 
                  key={i} 
                  onClick={() => {
                    setSelectedDate(date);
                    if (date.getMonth() !== viewDate.getMonth()) {
                      setViewDate(new Date(date.getFullYear(), date.getMonth(), 1));
                    }
                  }}
                  className={cn(
                    "w-full aspect-square rounded-[4px] transition-colors hover:ring-1 hover:ring-white/50 cursor-pointer relative", 
                    bgClass,
                    isSelected && "ring-2 ring-white scale-110 z-10"
                  )}
                  title={date.toDateString()}
                />
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="flex justify-between text-[10px] text-zinc-500 mt-3 pl-8">
        {Array.from(new Set(heatmapDays.map(d => d.toLocaleString('default', { month: 'short' })))).map(m => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </motion.div>
  );
}
