'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus, Trash2, Pencil, Search, Clock,
  Save, ArrowLeft, Loader2, X,
  Globe, Lock, FileText, Image as ImageIcon, Upload,
  Link as LinkIcon, Code2, List, MessageSquare,


} from 'lucide-react';
import { cn } from '@/lib/utils';
import { blogService, BlogPost, BlogPostListItem } from '@/services/blog.service';
import { useStore } from '@/store/useStore';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { getAssetUrl } from '@/lib/api-client';



// ─── Helpers ──────────────────────────────────────────────────────────────────
function renderMarkdownPreview(md: string): string {
  if (!md) return '';
  
  return md
    .replace(/^### (.*$)/gm, '<h3 class="text-xl font-bold mt-10 mb-5 text-white tracking-tight">$1</h3>')
    .replace(/^## (.*$)/gm, '<h2 class="text-3xl font-bold mt-12 mb-6 text-white tracking-tight border-b border-white/[0.06] pb-3">$1</h2>')
    .replace(/^# (.*$)/gm, '<h1 class="text-5xl font-extrabold mt-14 mb-8 text-white tracking-tighter leading-tight">$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
    .replace(/\*(.*?)\*/g, '<em class="italic text-zinc-300">$1</em>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-4 decoration-indigo-500/30 transition-colors" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-indigo-500/40 bg-indigo-500/[0.03] pl-8 py-5 my-10 text-zinc-300 italic rounded-r-2xl transition-all leading-relaxed">$1</blockquote>')
    .replace(/`(.*?)`/g, '<code class="bg-zinc-800/80 text-indigo-300 px-2 py-1 rounded-lg font-mono text-[0.85em] border border-white/5">$1</code>')
    .replace(/^- (.*$)/gm, '<li class="flex items-start gap-4 mb-3 ml-2 before:content-[\'→\'] before:text-indigo-500 before:font-black text-zinc-400">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-6 leading-loose text-zinc-400 text-[16px]">')
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
    { label: 'H1', icon: <span className="font-bold">H1</span>, action: () => insert('# ') },
    { label: 'H2', icon: <span className="font-bold">H2</span>, action: () => insert('## ') },
    { label: 'Bold', icon: <span className="font-bold">B</span>, action: () => insert('**', '**') },
    { label: 'Italic', icon: <span className="italic">I</span>, action: () => insert('*', '*') },
    { label: 'Link', icon: <LinkIcon className="w-3.5 h-3.5" />, action: () => insert('[', '](url)') },

    { label: 'Code', icon: <Code2 className="w-3.5 h-3.5" />, action: () => insert('`', '`') },
    { label: 'Quote', icon: <MessageSquare className="w-3.5 h-3.5" />, action: () => insert('\n> ') },
    { label: 'List', icon: <List className="w-3.5 h-3.5" />, action: () => insert('\n- ') },

  ];

  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !draft.tags.includes(t)) {
      setDraft((prev) => ({ ...prev, tags: [...prev.tags, t] }));
      setTagInput('');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-96px)] bg-[#09090b] text-zinc-300 overflow-hidden relative">
      {/* Top bar - STICKY to container */}

      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#09090b]/80 backdrop-blur-xl shrink-0 z-50">
        <div className="flex items-center gap-6">
          <button
            onClick={onClose}
            className="group flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[13px] font-medium"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Exit Editor
          </button>
          
          <div className="h-4 w-px bg-white/[0.06]" />

          <div className="flex gap-1 bg-zinc-900/50 border border-white/[0.06] rounded-xl p-1 shadow-inner">
            {(['write', 'split', 'preview'] as EditorView[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-[11px] font-semibold capitalize transition-all',
                  view === v 
                    ? 'bg-zinc-800 text-white shadow-sm' 
                    : 'text-zinc-500 hover:text-zinc-300'
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-3 text-[11px] font-medium text-zinc-600 tracking-tight">
             <span>{wordCount} Words</span>
             <span className="w-1 h-1 rounded-full bg-zinc-800" />
             <span>{readTime} Min Read</span>
          </div>
          
          <button
            onClick={onSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-8 py-2.5 bg-white text-zinc-950 hover:bg-zinc-100 rounded-xl text-[13px] font-bold transition-all shadow-xl shadow-white/5 active:scale-95 disabled:opacity-40"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                Save Post
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Input Areas */}
        <div className={cn(
          "flex flex-col border-r border-white/10 bg-zinc-950/20",
          view === 'preview' ? "hidden" : view === 'write' ? "w-full" : "w-1/2"
        )}>
           {/* Static Header Parts inside Left */}
           <div className="shrink-0">
             {/* Cover & Meta */}
             <div className="p-8 border-b border-white/[0.04] space-y-6">
                {/* Optional Cover Preview */}
                {draft.coverImageUrl && (
                  <div className="relative w-full h-40 rounded-2xl overflow-hidden group border border-white/5 mb-6">
                    <img src={getAssetUrl(draft.coverImageUrl)} className="w-full h-full object-cover" alt="Cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => coverRef.current?.click()}
                        className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/20 hover:bg-white/20 transition-all"
                      >
                        Replace Cover
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <input
                    value={draft.title}
                    onChange={(e) => setDraft((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="The title of your story..."
                    className="w-full text-4xl font-bold text-white bg-transparent focus:outline-none placeholder-zinc-800 tracking-tight leading-tight"
                  />

                  <textarea
                    value={draft.excerpt}
                    onChange={(e) => setDraft((prev) => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Give readers a quick summary (excerpt)..."
                    rows={2}
                    className="w-full bg-transparent text-[15px] text-zinc-500 placeholder-zinc-800 focus:outline-none focus:text-zinc-400 transition-colors resize-none leading-relaxed"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  {/* Status Toggle */}
                  <button
                    onClick={() => setDraft(prev => ({ ...prev, status: prev.status === 'published' ? 'draft' : 'published' }))}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold border transition-all",
                      draft.status === 'published' 
                        ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                        : "bg-zinc-900 border-white/[0.06] text-zinc-500"
                    )}
                  >
                    {draft.status === 'published' ? <Globe className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                    {draft.status.toUpperCase()}
                  </button>

                  <div className="flex items-center gap-2 ml-auto">
                      {draft.tags.map(t => (
                        <span key={t} className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-white/[0.05] rounded-lg text-[11px] font-medium text-zinc-400">
                          {t}
                          <button onClick={() => setDraft(p => ({ ...p, tags: p.tags.filter(x => x !== t) }))} className="hover:text-red-400 transition-colors">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <input
                        value={tagInput}
                        onChange={e => setTagInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="+ tag"
                        className="w-16 bg-transparent text-[11px] text-zinc-600 focus:text-zinc-300 focus:outline-none"
                      />
                  </div>
                </div>
             </div>

             {/* Toolbar */}
             <div className="px-6 py-2 border-b border-white/[0.04] bg-zinc-900/10 flex items-center gap-1">
                {toolbarItems.map((t) => (
                  <button
                    key={t.label}
                    onClick={t.action}
                    title={t.label}
                    className="w-9 h-8 flex items-center justify-center rounded-lg text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.06] transition-all"
                  >
                    {t.icon}
                  </button>
                ))}
             </div>
           </div>

           <input ref={coverRef} type="file" className="hidden" accept="image/*" onChange={onCoverUpload} />

           {/* Writing Space - SCROLLABLE */}
           <div className="flex-1 overflow-y-auto custom-scrollbar">
             <textarea
               ref={textareaRef}
               value={value}
               onChange={(e) => onChange(e.target.value)}
               placeholder="Tell your story..."
               className="w-full h-full min-h-[500px] bg-transparent p-10 focus:outline-none text-[16px] leading-loose resize-none placeholder-zinc-800"
             />
           </div>
        </div>

        {(view === 'preview' || view === 'split') && (
          <div className={cn('overflow-y-auto p-10 custom-scrollbar bg-white/[0.01]', view === 'split' ? 'w-1/2' : 'w-full max-w-4xl mx-auto px-12 py-20')}>
             <div className="prose-custom max-w-none" dangerouslySetInnerHTML={{ __html: `<div class="text-zinc-400 font-serif leading-loose">${renderMarkdownPreview(value || '')}</div>` }} />
          </div>
        )}
      </div>

    </div>
  );
}





// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BlogPage() {
  const { addNotification, setIsEditingBlog } = useStore();


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
  useEffect(() => {
    setIsEditingBlog(isEditorOpen);
    if (isEditorOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { 
      document.body.style.overflow = ''; 
      setIsEditingBlog(false);
    };
  }, [isEditorOpen, setIsEditingBlog]);


  if (isEditorOpen) {
    return (
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
                    src={getAssetUrl(post.coverImageUrl)}
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


      <ConfirmModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDelete(showDeleteConfirm)}
        title="Delete Post"
        description="This action is permanent. All content and metadata related to this post will be removed forever."
        confirmLabel="Delete"
        type="danger"
      />

    </div>
  );
}
