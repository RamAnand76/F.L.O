import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: DropdownOption[];
  icon?: React.ReactNode;
  className?: string;
}

export function Dropdown({ value, onChange, options, icon, className }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-3 bg-zinc-900/50 border border-white/10 hover:border-white/20 hover:bg-zinc-800/50 rounded-xl px-4 py-2.5 text-sm text-white transition-all w-full justify-between shadow-sm",
          isOpen && "border-white/20 bg-zinc-800/50 ring-2 ring-white/5"
        )}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          {icon && <span className="text-zinc-400 flex-shrink-0">{icon}</span>}
          <span className="font-medium truncate">{selectedOption?.label || 'Select...'}</span>
        </div>
        <ChevronDown className={cn("w-4 h-4 text-zinc-500 transition-transform duration-300 flex-shrink-0", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 4, scale: 0.96, filter: 'blur(4px)' }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-50 top-[calc(100%+8px)] left-0 min-w-[240px] bg-[#18181b]/95 border border-white/10 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
          >
            <div className="p-1.5 max-h-[300px] overflow-y-auto custom-scrollbar">
              {options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 text-sm rounded-lg transition-all duration-200",
                    value === option.value 
                      ? "bg-white/10 text-white font-medium shadow-sm" 
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
                  )}
                >
                  <span className="truncate pr-4">{option.label}</span>
                  {value === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <Check className="w-4 h-4 text-white flex-shrink-0" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
