import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, SlidersHorizontal, MonitorPlay, User, LogOut, LayoutTemplate } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/folio', label: 'Folio Control', icon: SlidersHorizontal },
  { path: '/templates', label: 'Templates', icon: LayoutTemplate },
  { path: '/preview', label: 'Preview & Editor', icon: MonitorPlay },
  { path: '/profile', label: 'Profile', icon: User },
];

export function Dock() {
  const location = useLocation();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const disconnect = useStore((state) => state.disconnect);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <motion.div 
        className="flex items-center gap-2 px-4 py-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full shadow-2xl"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const isHovered = hoveredIndex === index;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className="relative group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <motion.div
                className={cn(
                  "relative flex items-center justify-center w-12 h-12 rounded-full transition-colors",
                  isActive ? "bg-white/10 text-white" : "text-zinc-400 hover:text-white hover:bg-white/5"
                )}
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  y: isHovered ? -8 : 0,
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <item.icon className="w-5 h-5" />
                
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.div>

              {/* Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.8 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-zinc-800 text-white text-xs font-medium rounded-md whitespace-nowrap shadow-xl border border-white/10"
                  >
                    {item.label}
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        <div className="w-px h-8 bg-white/10 mx-2" />

        <button
          onClick={disconnect}
          className="relative group flex items-center justify-center w-12 h-12 rounded-full text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          title="Disconnect"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </motion.div>
    </div>
  );
}
