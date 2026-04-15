'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Trash2, Pencil, Search, Clock,
  Save, ArrowLeft, Loader2, X,
  Globe, Lock, FileText, Image as ImageIcon, Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { blogService, BlogPost, BlogPostListItem } from '@/services/blog.service';
import { useStore } from '@/store/useStore';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function renderMarkdownPreview(md: string): string {
  return md
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-semibold mt-6 mb-2 text-white">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-semibold mt-8 mb-3 text-white">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4 text-white">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="text-zinc-200 italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-zinc-800 text-emerald-300 px-1.5 py-0.5 rounded text-[13px] font-mono">$1</code>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-indigo-400 underline hover:text-indigo-300" target="_blank">$1</a>')
    .replace(/^- (.+)$/gm, '<li class="text-zinc-300 ml-4 list-disc mb-1">$1</li>')
    .replace(/^> (.+)$/gm, '<blockquote class="border-l-2 border-white/10 pl-4 text-zinc-500 my-4">$1</blockquote>')
    .replace(/\n\n/g, '</p><p class="text-zinc-400 leading-[1.8] mb-4">')
    .replace(/\n/g, '<br />');
}

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(iso).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

// ─── Types ────────────────────────────────────────────────────────────────────
type PostDraft = {
  title: string;
  excerpt: string;
  content: string;
  tags: string[];
  status: 'draft' | 'published';
  coverImageUrl: string | null;
};

type EditorView = 'write' | 'split' | 'preview';

// ─── Markdown Editor ──────────────────────────────────────────────────────────
function MarkdownEditor({
  value,
  onChange,
  onSave,
  isSaving,
  draft,
  setDraft,
  onClose,
  editingPost,
  isUploadingCover,
  onCoverUpload,
}: {
  value: string;
  onChange: (v: string) => void;
  onSave: () => void;
  isSaving: boolean;
  draft: PostDraft;
  setDraft: React.Dispatch<React.SetStateAction<PostDraft>>;
  onClose: () => void;
  editingPost: BlogPost | null;
  isUploadingCover: boolean;
  onCoverUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);
  const [view, setView] = useState<EditorView>('split');
  const [tagInput, setTagInput] = useState('');

  const wordCount = useMemo(
    () => value.trim().split(/\s+/).filter(Boolean).length,
    [value]
  );
  const readTime = Math.max(1, Math.round(wordCount / 200));

  const insert = (before: string, after = '') => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = ta.value.slice(start, end);
    const newVal = ta.value.slice(0, start) + before + selected + after + ta.value.slice(end);
    onChange(newVal);
    setTimeout(() => {
      ta.selectionStart = start + before.length;
      ta.selectionEnd = start + before.length + selected.length;
      ta.focus();
    }, 10);
  };

  const toolbarItems = [
    { label: 'H1', action: () => insert('# ') },
    { label: 'H2', action: () => insert('## ') },
    { label: 'H3', action: () => insert('### ') },
    { label: 'B', action: () => insert('**', '**'), cls: 'font-bold' },
    { label: 'I', action: () => insert('*', '*'), cls: 'italic' },
    { label: '`', action: () => insert('`', '`'), cls: 'font-mono' },
    { label: '[ ]', action: () => insert('[', '](url)') },
    { label: '—', action: () => insert('\n- ') },
    { label: '❝', action: () => insert('\n> ') },
  ];

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !draft.tags.includes(t)) {
      setDraft((prev) => ({ ...prev, tags: [...prev.tags, t] }));
      setTagInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[13px] font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="flex gap-0.5 bg-zinc-900 border border-white/8 rounded-lg p-0.5">
          {(['write', 'split', 'preview'] as EditorView[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={cn(
                'px-3 py-1 rounded-md text-[11px] font-medium capitalize transition-all',
                view === v ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-zinc-600 hidden sm:block">
            {wordCount} words · {readTime} min read
          </span>
          <span
            className={cn(
              'px-2 py-0.5 rounded-full text-[10px] font-semibold border',
              draft.status === 'published'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-zinc-800 border-white/8 text-zinc-500'
            )}
          >
            {draft.status}
          </span>
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[13px] font-medium transition-all disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Meta strip */}
      <div className="px-5 py-3 border-b border-white/5 space-y-2.5 shrink-0">
        <input
          value={draft.title}
          onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Post title..."
          className="w-full text-[22px] font-semibold text-white bg-transparent focus:outline-none placeholder-zinc-700 tracking-tight"
        />

        <div className="flex flex-wrap items-center gap-2">
          <input
            value={draft.excerpt}
            onChange={(e) => setDraft((prev) => ({ ...prev, excerpt: e.target.value }))}
            placeholder="Short excerpt..."
            className="flex-1 min-w-[180px] bg-transparent text-[12px] text-zinc-500 placeholder-zinc-700 focus:outline-none focus:text-zinc-300 transition-colors"
          />

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {draft.tags.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1 px-2.5 py-1 bg-zinc-900 border border-white/6 rounded-lg text-[11px] text-zinc-400"
              >
                {t}
                <button
                  onClick={() =>
                    setDraft((prev) => ({ ...prev, tags: prev.tags.filter((x) => x !== t) }))
                  }
                  className="text-zinc-600 hover:text-red-400 transition-colors"
                >
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="+ tag"
              className="w-16 bg-transparent text-[11px] text-zinc-500 placeholder-zinc-700 focus:outline-none focus:text-zinc-300 border-b border-white/5 pb-0.5 transition-colors"
            />
          </div>

          {/* Publish toggle */}
          <button
            onClick={() =>
              setDraft((prev) => ({
                ...prev,
                status: prev.status === 'published' ? 'draft' : 'published',
              }))
            }
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border transition-all',
              draft.status === 'published'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-zinc-900 border-white/6 text-zinc-500 hover:text-zinc-300'
            )}
          >
            {draft.status === 'published' ? (
              <Globe className="w-3 h-3" />
            ) : (
              <Lock className="w-3 h-3" />
            )}
            {draft.status === 'published' ? 'Published' : 'Draft'}
          </button>

          {/* Cover upload */}
          <label
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-medium border cursor-pointer transition-all bg-zinc-900 border-white/6 text-zinc-500 hover:text-zinc-300',
              isUploadingCover && 'opacity-50 pointer-events-none'
            )}
          >
            {isUploadingCover ? (
              <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
              <ImageIcon className="w-3 h-3" />
            )}
            {draft.coverImageUrl ? 'Change cover' : 'Cover'}
            <input
              ref={coverRef}
              type="file"
              className="hidden"
              accept="image/*"
              onChange={onCoverUpload}
            />
          </label>
        </div>
      </div>

      {/* Formatting toolbar */}
      <div className="flex items-center gap-0.5 px-4 py-1.5 border-b border-white/[0.04] shrink-0">
        {toolbarItems.map((t) => (
          <button
            key={t.label}
            onClick={t.action}
            title={t.label}
            className={cn(
              'w-8 h-7 flex items-center justify-center text-[12px] rounded-md text-zinc-600 hover:text-white hover:bg-white/5 transition-all',
              t.cls
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Editor body */}
      <div
        className={cn(
          'flex-1 flex overflow-hidden',
          view === 'split' && 'divide-x divide-white/[0.04]'
        )}
      >
        {(view === 'write' || view === 'split') && (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Start writing in Markdown...\n\n# Introduction\n\n## The Problem\n\n## The Solution\n\n## Results`}
            className={cn(
              'bg-transparent resize-none focus:outline-none text-zinc-300 text-[14px] leading-[1.9] font-mono p-6 custom-scrollbar',
              view === 'split' ? 'w-1/2' : 'w-full'
            )}
          />
        )}

        {(view === 'preview' || view === 'split') && (
          <div
            className={cn(
              'overflow-y-auto p-6 text-zinc-400 text-[14px] leading-[1.9] custom-scrollbar',
              view === 'split' ? 'w-1/2' : 'w-full'
            )}
            dangerouslySetInnerHTML={{
              __html: `<p class="text-zinc-400 leading-[1.9] mb-4">${renderMarkdownPreview(value || '')}</p>`,
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Delete confirm ───────────────────────────────────────────────────────────
function DeleteDialog({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.96, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96, y: 8 }}
        className="bg-zinc-900 border border-white/8 rounded-2xl p-6 max-w-sm w-full"
      >
        <h3 className="text-[15px] font-semibold text-white mb-1.5">Delete post?</h3>
        <p className="text-[13px] text-zinc-500 leading-relaxed mb-6">
          This action is permanent. All content and metadata will be removed.
        </p>
        <div className="flex gap-2.5 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-[13px] font-medium text-zinc-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-[13px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg transition-colors"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const { addNotification } = useStore();

  const [posts, setPosts] = useState<BlogPostListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published'>('all');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNewPost, setIsNewPost] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

  const [draft, setDraft] = useState<PostDraft>({
    title: '',
    excerpt: '',
    content: '',
    tags: [],
    status: 'draft',
    coverImageUrl: null,
  });

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await blogService.getAll();
      setPosts(data);
    } catch {
      addNotification('Failed to load posts.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, []);

  const filteredPosts = useMemo(() => {
    let result = [...posts];
    if (statusFilter !== 'all') result = result.filter((p) => p.status === statusFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [posts, statusFilter, search]);

  const openNewPost = () => {
    setDraft({ title: '', excerpt: '', content: '', tags: [], status: 'draft', coverImageUrl: null });
    setEditingPost(null);
    setIsNewPost(true);
    setIsEditorOpen(true);
  };

  const openEditPost = async (post: BlogPostListItem) => {
    try {
      const full = await blogService.getById(post.id);
      setEditingPost(full);
      setDraft({
        title: full.title,
        excerpt: full.excerpt,
        content: full.content,
        tags: full.tags,
        status: full.status,
        coverImageUrl: full.coverImageUrl,
      });
      setIsNewPost(false);
      setIsEditorOpen(true);
    } catch {
      addNotification('Failed to load post.', 'error');
    }
  };

  const handleSave = async () => {
    if (!draft.title.trim()) {
      addNotification('Title is required.', 'error');
      return;
    }
    setIsSaving(true);
    try {
      if (isNewPost) {
        const created = await blogService.create({
          title: draft.title,
          content: draft.content,
          excerpt: draft.excerpt,
          tags: draft.tags,
          status: draft.status,
        });
        setEditingPost(created);
        setIsNewPost(false);
        addNotification('Post created.', 'success');
      } else if (editingPost) {
        await blogService.update(editingPost.id, {
          title: draft.title,
          content: draft.content,
          excerpt: draft.excerpt,
          tags: draft.tags,
          status: draft.status,
          coverImageUrl: draft.coverImageUrl,
        });
        addNotification('Post saved.', 'success');
      }
      await fetchPosts();
    } catch {
      addNotification('Failed to save post.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTogglePublish = async (post: BlogPostListItem) => {
    try {
      if (post.status === 'published') {
        await blogService.unpublish(post.id);
        addNotification('Moved to drafts.', 'info');
      } else {
        await blogService.publish(post.id);
        addNotification('Post published.', 'success');
      }
      await fetchPosts();
    } catch {
      addNotification('Failed to update status.', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await blogService.delete(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
      if (editingPost?.id === id) setIsEditorOpen(false);
      addNotification('Post deleted.', 'success');
    } catch {
      addNotification('Failed to delete.', 'error');
    }
    setShowDeleteConfirm(null);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!editingPost) {
      addNotification('Save the post first before uploading a cover.', 'info');
      return;
    }
    setIsUploadingCover(true);
    try {
      const { url } = await blogService.uploadCover(editingPost.id, file);
      setDraft((prev) => ({ ...prev, coverImageUrl: url }));
      addNotification('Cover uploaded.', 'success');
    } catch {
      addNotification('Upload failed.', 'error');
    } finally {
      setIsUploadingCover(false);
      e.target.value = '';
    }
  };

  // Full-screen editor
  if (isEditorOpen) {
    return (
      <div className="fixed inset-0 z-40" style={{ paddingBottom: '80px' }}>
        <MarkdownEditor
          value={draft.content}
          onChange={(content) => setDraft((prev) => ({ ...prev, content }))}
          onSave={handleSave}
          isSaving={isSaving}
          draft={draft}
          setDraft={setDraft}
          onClose={() => setIsEditorOpen(false)}
          editingPost={editingPost}
          isUploadingCover={isUploadingCover}
          onCoverUpload={handleCoverUpload}
        />
      </div>
    );
  }

  const pubCount = posts.filter((p) => p.status === 'published').length;
  const draftCount = posts.filter((p) => p.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">Blog & Case Studies</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {posts.length === 0
              ? 'Write your first post.'
              : `${pubCount} published · ${draftCount} draft${draftCount !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={openNewPost}
          className="self-start sm:self-auto flex items-center gap-2 px-6 py-2.5 bg-white text-zinc-950 rounded-xl text-[13px] font-semibold hover:bg-zinc-100 transition-colors shadow-sm"
        >
          New Post
        </button>
      </div>

      {/* Stats row */}
      {posts.length > 0 && (
        <div className="flex items-center gap-6">
          {[
            { label: 'Total', value: posts.length },
            { label: 'Published', value: pubCount, accent: 'text-emerald-400' },
            { label: 'Drafts', value: draftCount, accent: 'text-amber-400' },
          ].map((s) => (
            <div key={s.label} className="flex items-baseline gap-2">
              <span className={cn('text-2xl font-bold tabular-nums', s.accent || 'text-white')}>
                {s.value}
              </span>
              <span className="text-[11px] text-zinc-600 font-medium">{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search + Filter */}
      <div className="flex gap-2.5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="w-full pl-9 pr-4 py-2.5 bg-zinc-900/60 border border-white/6 rounded-xl text-[13px] text-white placeholder-zinc-600 focus:outline-none focus:border-white/12 transition-colors"
          />
        </div>

        <div className="flex gap-0.5 bg-zinc-900/60 border border-white/6 rounded-xl p-0.5">
          {(['all', 'published', 'draft'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[12px] font-medium capitalize transition-all',
                statusFilter === f ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-5 h-5 animate-spin text-zinc-600" />
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-48 gap-4 border border-dashed border-white/6 rounded-2xl">
          <FileText className="w-6 h-6 text-zinc-700" />
          <p className="text-sm text-zinc-500">
            {search
              ? 'No posts match your search.'
              : statusFilter !== 'all'
              ? `No ${statusFilter} posts.`
              : 'No posts yet.'}
          </p>
          {!search && statusFilter === 'all' && (
            <button
              onClick={openNewPost}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/8 text-zinc-300 rounded-xl text-[13px] font-medium hover:bg-white/8 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Write your first post
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.04 * i }}
              className="group relative bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:bg-zinc-900/50 transition-all flex flex-col"
            >
              {/* Cover / Placeholder */}
              {post.coverImageUrl ? (
                <div className="h-32 overflow-hidden shrink-0">
                  <img
                    src={post.coverImageUrl}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="h-20 bg-gradient-to-br from-white/3 to-transparent flex items-end px-5 pb-3 border-b border-white/4 shrink-0">
                  <span
                    className={cn(
                      'px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border',
                      post.status === 'published'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-zinc-800 border-white/8 text-zinc-500'
                    )}
                  >
                    {post.status}
                  </span>
                </div>
              )}

              <div className="p-4 flex flex-col flex-1">
                {post.coverImageUrl && (
                  <span
                    className={cn(
                      'inline-flex mb-2 px-2 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider border w-fit',
                      post.status === 'published'
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                        : 'bg-zinc-800 border-white/8 text-zinc-500'
                    )}
                  >
                    {post.status}
                  </span>
                )}

                <h3 className="text-[14px] font-semibold text-white leading-snug line-clamp-2 mb-1.5">
                  {post.title}
                </h3>

                <p className="text-[12px] text-zinc-500 leading-relaxed line-clamp-2 flex-1 mb-3">
                  {post.excerpt || 'No excerpt.'}
                </p>

                {post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {post.tags.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 bg-zinc-800/80 border border-white/5 rounded-lg text-[10px] text-zinc-400"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-white/4">
                  <div className="flex items-center gap-1.5 text-zinc-600">
                    <Clock className="w-3 h-3" />
                    <span className="text-[11px]">{post.readingTimeMinutes} min</span>
                    <span className="mx-1 text-white/10">·</span>
                    <span className="text-[11px]">{formatRelative(post.updatedAt)}</span>
                  </div>

                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleTogglePublish(post)}
                      title={post.status === 'published' ? 'Move to Draft' : 'Publish'}
                      className={cn(
                        'p-1.5 rounded-lg transition-all text-zinc-600',
                        post.status === 'published'
                          ? 'hover:text-amber-400 hover:bg-amber-500/8'
                          : 'hover:text-emerald-400 hover:bg-emerald-500/8'
                      )}
                    >
                      {post.status === 'published' ? (
                        <Lock className="w-3.5 h-3.5" />
                      ) : (
                        <Globe className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => openEditPost(post)}
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(post.id)}
                      className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/8 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <DeleteDialog
            onConfirm={() => handleDelete(showDeleteConfirm)}
            onCancel={() => setShowDeleteConfirm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
