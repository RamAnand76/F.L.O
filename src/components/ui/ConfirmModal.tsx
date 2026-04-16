'use client';

import React from 'react';
import { Modal } from './Modal';
import { motion } from 'motion/react';
import { AlertTriangle, Trash2, Info, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type ConfirmType = 'danger' | 'warning' | 'info';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: ConfirmType;
  loading?: boolean;
}

const typeConfig = {
  danger: {
    icon: Trash2,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20',
    button: 'bg-rose-500 hover:bg-rose-600 outline-rose-500/20',
  },
  warning: {
    icon: AlertTriangle,
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20',
    button: 'bg-amber-500 hover:bg-amber-600 outline-amber-500/20',
  },
  info: {
    icon: Info,
    color: 'text-sky-400',
    bg: 'bg-sky-500/10',
    border: 'border-sky-500/20',
    button: 'bg-sky-500 hover:bg-sky-600 outline-sky-500/20',
  },
};

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'info',
  loading = false,
}: ConfirmModalProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center space-y-4">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={cn("w-16 h-16 rounded-full flex items-center justify-center border", config.bg, config.border, config.color)}
        >
          <Icon className="w-8 h-8" />
        </motion.div>

        <div className="space-y-2">
          <p className="text-zinc-400 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        <div className="flex gap-3 w-full pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-medium transition-all"
          >
            {cancelLabel}
          </button>
          <button
            disabled={loading}
            onClick={() => {
              onConfirm();
              if (!loading) onClose();
            }}
            className={cn(
              "flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-all outline outline-offset-2 outline-0 hover:outline-2 disabled:opacity-50 disabled:cursor-not-allowed",
              config.button
            )}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
