'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Star, Trash2, Search, Loader2, RefreshCw, MailOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { inboxService, InboxMessage } from '@/services/inbox.service';
import { useStore } from '@/store/useStore';
import { ConfirmModal } from '@/components/ui/ConfirmModal';


type FilterType = 'all' | 'unread' | 'starred';

function MessageAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
  const hue = (name.charCodeAt(0) * 37) % 360;
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 select-none"
      style={{ background: `hsl(${hue},40%,20%)`, color: `hsl(${hue},65%,65%)` }}
    >
      {initials}
    </div>
  );
}

export default function InboxPage() {
  const { addNotification } = useStore();

  const [messages, setMessages] = useState<InboxMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const fetchMessages = async (silent = false) => {
    if (!silent) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const data = await inboxService.getAll();
      setMessages(data);
    } catch {
      if (!silent) addNotification('Failed to load messages.', 'error');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    let result = [...messages];
    if (filter === 'unread') result = result.filter((m) => !m.isRead);
    if (filter === 'starred') result = result.filter((m) => m.isStarred);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      );
    }
    return result.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [messages, filter, search]);

  const selectedMessage = messages.find((m) => m.id === selectedId) ?? null;
  const unreadCount = messages.filter((m) => !m.isRead).length;

  const handleSelect = async (msg: InboxMessage) => {
    setSelectedId(msg.id);
    if (!msg.isRead) {
      try {
        await inboxService.markRead(msg.id);
        setMessages((prev) =>
          prev.map((m) => (m.id === msg.id ? { ...m, isRead: true } : m))
        );
      } catch {
        /* silent */
      }
    }
  };

  const handleToggleStar = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      const updated = await inboxService.toggleStar(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, isStarred: updated.isStarred } : m))
      );
    } catch {
      addNotification('Failed to update.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await inboxService.delete(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (selectedId === id) setSelectedId(null);
      addNotification('Message deleted.', 'success');
    } catch {
      addNotification('Failed to delete.', 'error');
    }
    setShowDeleteConfirm(null);
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    if (diff < 86400000)
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="flex flex-col h-full space-y-5">
      {/* Page Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Inbox</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter Tabs */}
          <div className="flex items-center gap-0.5 bg-zinc-900 border border-white/6 rounded-lg p-0.5">
            {(['all', 'unread', 'starred'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  'px-3.5 py-1.5 rounded-md text-xs font-medium capitalize transition-all duration-150',
                  filter === f
                    ? 'bg-zinc-800 text-white shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300'
                )}
              >
                {f}
                {f === 'unread' && unreadCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.5 text-[10px] font-bold bg-indigo-500/20 text-indigo-400 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <button
            onClick={() => fetchMessages(true)}
            disabled={isRefreshing}
            className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40"
            title="Refresh"
          >
            <RefreshCw className={cn('w-3.5 h-3.5', isRefreshing && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Two-pane layout */}
      <div className="flex gap-4 flex-1" style={{ minHeight: '72vh' }}>
        {/* Left: Message List */}
        <div className="w-[340px] shrink-0 flex flex-col bg-zinc-900/40 border border-white/6 rounded-2xl overflow-hidden">
          {/* Search */}
          <div className="p-3 border-b border-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-2 bg-zinc-950/60 border border-white/5 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/10 transition-colors"
              />
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar divide-y divide-white/[0.04]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-4 h-4 animate-spin text-zinc-600" />
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-zinc-600 py-12">
                <Mail className="w-6 h-6 opacity-30" />
                <p className="text-xs">No messages found</p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => handleSelect(msg)}
                  className={cn(
                    'w-full text-left px-4 py-3.5 transition-colors relative group',
                    selectedId === msg.id
                      ? 'bg-white/[0.05]'
                      : 'hover:bg-white/[0.025]'
                  )}
                >
                  {/* Unread indicator */}
                  {!msg.isRead && (
                    <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-indigo-500" />
                  )}

                  <div className="flex items-start gap-3">
                    <MessageAvatar name={msg.name} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span
                          className={cn(
                            'text-[13px] truncate',
                            !msg.isRead
                              ? 'font-semibold text-zinc-100'
                              : 'font-normal text-zinc-400'
                          )}
                        >
                          {msg.name}
                        </span>
                        <span className="text-[10px] text-zinc-600 shrink-0 ml-2">
                          {formatDate(msg.createdAt)}
                        </span>
                      </div>
                      <p
                        className={cn(
                          'text-[12px] truncate mb-0.5',
                          !msg.isRead ? 'text-zinc-200' : 'text-zinc-400'
                        )}
                      >
                        {msg.subject}
                      </p>
                      <p className="text-[11px] text-zinc-600 truncate leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Right: Message Detail */}
        <div className="flex-1 bg-zinc-900/40 border border-white/6 rounded-2xl overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {selectedMessage ? (
              <motion.div
                key={selectedMessage.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col h-full"
              >
                {/* Detail Header */}
                <div className="px-7 py-5 border-b border-white/5">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <h2 className="text-[17px] font-semibold text-white leading-snug">
                      {selectedMessage.subject}
                    </h2>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => handleToggleStar(e, selectedMessage.id)}
                        className={cn(
                          'p-1.5 rounded-lg transition-colors',
                          selectedMessage.isStarred
                            ? 'text-amber-400'
                            : 'text-zinc-600 hover:text-zinc-300'
                        )}
                        title={selectedMessage.isStarred ? 'Unstar' : 'Star'}
                      >
                        <Star
                          className={cn(
                            'w-4 h-4',
                            selectedMessage.isStarred && 'fill-amber-400'
                          )}
                        />
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(selectedMessage.id)}
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/8 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MessageAvatar name={selectedMessage.name} />
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        {selectedMessage.name}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {selectedMessage.email}
                        <span className="mx-2 text-zinc-700">·</span>
                        {new Date(selectedMessage.createdAt).toLocaleString([], {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Message Body */}
                <div className="flex-1 overflow-y-auto px-7 py-6 custom-scrollbar">
                  <p className="text-[14px] text-zinc-300 leading-[1.8] whitespace-pre-line">
                    {selectedMessage.message}
                  </p>
                </div>

                {/* Footer action */}
                <div className="px-7 py-4 border-t border-white/5 flex items-center gap-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-950 rounded-lg text-[13px] font-semibold hover:bg-zinc-100 transition-colors shadow-sm"
                  >
                    Reply
                  </a>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 border border-white/8 text-zinc-400 rounded-lg text-[13px] font-medium hover:text-white hover:border-white/15 transition-colors"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full gap-4 text-zinc-700"
              >
                <MailOpen className="w-10 h-10 opacity-30" />
                <p className="text-sm font-medium">Select a message to read</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>


      <ConfirmModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
        title="Delete Message"
        description="This action cannot be undone. The message will be permanently removed from your inbox."
        confirmLabel="Delete"
        type="danger"
      />

    </div>
  );
}
