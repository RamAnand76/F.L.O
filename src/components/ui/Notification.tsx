'use client';

import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
};

const styles = {
  success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]',
  error: 'bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.1)]',
  info: 'bg-sky-500/10 border-sky-500/20 text-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.1)]',
};

const progressStyles = {
  success: 'bg-emerald-500/30',
  error: 'bg-rose-500/30',
  info: 'bg-sky-500/30',
};

function NotificationItem({ n, onRemove }: { n: any, onRemove: (id: string) => void }) {
  const [progress, setProgress] = useState(100);
  const duration = 5000;
  const interval = 50;

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => Math.max(0, prev - (interval / duration) * 100));
    }, interval);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (progress === 0) {
      onRemove(n.id);
    }
  }, [progress, n.id, onRemove]);

  const Icon = icons[n.type as keyof typeof icons] || icons.info;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, x: 20, scale: 0.95, filter: 'blur(10px)' }}
      transition={{ type: 'spring', damping: 25, stiffness: 400 }}
      className={cn(
        "pointer-events-auto min-w-[320px] max-w-md p-4 rounded-2xl border backdrop-blur-[20px] shadow-2xl flex items-start gap-4 relative overflow-hidden group",
        styles[n.type as keyof typeof styles]
      )}
    >
      {/* Visual Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[2px] w-full bg-white/5">
        <motion.div 
          className={cn("h-full", progressStyles[n.type as keyof typeof progressStyles])}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-0.5 flex-shrink-0">
        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/5 group-hover:scale-110 transition-transform">
           <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div className="flex-1 text-[13px] font-bold tracking-tight leading-snug py-1">
        {n.message}
      </div>

      <button
        onClick={() => onRemove(n.id)}
        className="mt-0.5 p-1.5 rounded-xl hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}

export function NotificationSystem() {
  const { notifications, removeNotification } = useStore();

  return (
    <div className="fixed top-8 right-8 z-[9999] flex flex-col gap-4 pointer-events-none">
      <AnimatePresence mode="popLayout" initial={false}>
        {notifications.map((n) => (
          <NotificationItem key={n.id} n={n} onRemove={removeNotification} />
        ))}
      </AnimatePresence>
    </div>
  );
}
