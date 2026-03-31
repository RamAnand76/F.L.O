'use client';

import React from 'react';
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
  success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 shadow-emerald-500/5',
  error: 'bg-rose-500/10 border-rose-500/20 text-rose-400 shadow-rose-500/5',
  info: 'bg-sky-500/10 border-sky-500/20 text-sky-400 shadow-sky-500/5',
};

export function NotificationSystem() {
  const { notifications, removeNotification } = useStore();

  return (
    <div className="fixed bottom-32 right-8 z-[9999] flex flex-col gap-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((n) => {
          const Icon = icons[n.type];
          return (
            <motion.div
              key={n.id}
              layout
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={cn(
                "pointer-events-auto min-w-[300px] max-w-md p-4 rounded-2xl border backdrop-blur-2xl shadow-2xl flex items-start gap-3",
                styles[n.type]
              )}
            >
              <div className="mt-0.5">
                <Icon className="w-5 h-5 flex-shrink-0" />
              </div>
              <div className="flex-1 text-sm font-medium leading-relaxed">
                {n.message}
              </div>
              <button
                onClick={() => removeNotification(n.id)}
                className="mt-0.5 p-0.5 rounded-lg hover:bg-white/10 transition-colors opacity-60 hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
