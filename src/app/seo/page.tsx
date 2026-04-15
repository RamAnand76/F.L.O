'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search, Globe, Twitter, Tag, Upload,
  Save, CheckCircle, AlertCircle, Loader2,
  Sparkles, X, Image as ImageIcon, Zap,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { seoService, SeoSettings, SeoScore } from '@/services/seo.service';
import { useStore } from '@/store/useStore';

const TITLE_MAX = 60;
const DESC_MAX = 160;

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? '#22c55e' : score >= 45 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={6} fill="none" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={color} strokeWidth={6} fill="none" strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold tabular-nums" style={{ color }}>{Math.round(score)}</span>
      </div>
    </div>
  );
}

// ─── Character Counter ────────────────────────────────────────────────────────
function CharBar({ value, max }: { value: string; max: number }) {
  const pct = Math.min(value.length / max, 1);
  const over = value.length > max;
  return (
    <div className="mt-2 space-y-1">
      <div className="w-full h-0.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', over ? 'bg-red-500' : 'bg-indigo-500')}
          animate={{ width: `${pct * 100}%` }}
          transition={{ duration: 0.15 }}
        />
      </div>
      <div className="flex justify-end">
        <span className={cn('text-[10px] font-mono', over ? 'text-red-400' : 'text-zinc-600')}>
          {value.length}/{max}
        </span>
      </div>
    </div>
  );
}

// ─── Field Label ──────────────────────────────────────────────────────────────
function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <label className="text-[12px] font-semibold text-zinc-300 uppercase tracking-wider">{children}</label>
      {hint && <span className="text-[11px] text-zinc-600">{hint}</span>}
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
const inputCls = "w-full bg-zinc-950/70 border border-white/6 rounded-xl px-4 py-3 text-[13px] text-white placeholder-zinc-700 focus:outline-none focus:border-white/15 focus:bg-zinc-950/90 transition-all";
const textareaCls = cn(inputCls, "resize-none leading-relaxed");

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      className={cn(
        'relative w-10 h-[22px] rounded-full border transition-all shrink-0',
        on ? 'bg-indigo-600 border-indigo-500' : 'bg-zinc-800 border-white/8'
      )}
    >
      <motion.div
        className="absolute top-[3px] w-4 h-4 bg-white rounded-full shadow-sm"
        animate={{ left: on ? '18px' : '3px' }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </button>
  );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('p-5 bg-zinc-900/30 border border-white/5 rounded-2xl', className)}>
      {children}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SeoPage() {
  const { addNotification, customData, githubUser } = useStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<SeoSettings>({
    metaTitle: '',
    metaDescription: '',
    ogTitle: '',
    ogDescription: '',
    ogImageUrl: null,
    keywords: [],
    canonicalUrl: null,
    twitterCard: 'summary_large_image',
    twitterSite: null,
    robotsIndex: true,
    robotsFollow: true,
  });

  const [score, setScore] = useState<SeoScore | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isUploadingOg, setIsUploadingOg] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [keywordInput, setKeywordInput] = useState('');
  const [previewMode, setPreviewMode] = useState<'google' | 'twitter' | 'og'>('google');
  const [activeTab, setActiveTab] = useState<'basic' | 'social' | 'advanced'>('basic');

  useEffect(() => {
    (async () => {
      try {
        const s = await seoService.getSettings();
        setSettings(s);
      } catch {
        setSettings((prev) => ({
          ...prev,
          metaTitle: `${customData.name} — ${customData.role || 'Software Developer'}`,
          metaDescription: customData.bio?.slice(0, DESC_MAX) || '',
          ogTitle: `${customData.name} — ${customData.role || 'Software Developer'}`,
          ogDescription: customData.bio?.slice(0, DESC_MAX) || '',
          twitterSite: customData.twitter ? `@${customData.twitter.replace('@', '')}` : null,
        }));
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const update = (patch: Partial<SeoSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const saved = await seoService.updateSettings(settings);
      setSettings(saved);
      setIsDirty(false);
      addNotification('SEO settings saved.', 'success');
    } catch {
      addNotification('Failed to save.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await seoService.analyzeSeo();
      setScore(result);
    } catch {
      addNotification('Analysis failed. Save first and retry.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingOg(true);
    try {
      const { url } = await seoService.uploadOgImage(file);
      update({ ogImageUrl: url });
      addNotification('Image uploaded.', 'success');
    } catch {
      addNotification('Upload failed.', 'error');
    } finally {
      setIsUploadingOg(false);
      e.target.value = '';
    }
  };

  const addKeyword = () => {
    const kw = keywordInput.trim().toLowerCase();
    if (kw && !settings.keywords.includes(kw)) {
      update({ keywords: [...settings.keywords, kw] });
      setKeywordInput('');
    }
  };

  const portfolioUrl =
    githubUser
      ? `${typeof window !== 'undefined' ? window.location.origin : 'https://flofolio.app'}/${githubUser.login}`
      : 'https://flofolio.app/yourname';

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-5 h-5 animate-spin text-zinc-500" />
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'SEO Basics' },
    { id: 'social', label: 'Social Cards' },
    { id: 'advanced', label: 'Technical' },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-white">SEO & Open Graph</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Control how your portfolio appears on Google, LinkedIn and Twitter.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/8 text-zinc-300 rounded-xl text-[13px] font-medium hover:bg-zinc-800 transition-all disabled:opacity-40"
          >
            {isAnalyzing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            )}
            {isAnalyzing ? 'Analyzing...' : 'AI Analyze'}
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving || !isDirty}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-medium transition-all',
              isDirty
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/15'
                : 'bg-zinc-900 border border-white/8 text-zinc-600 cursor-not-allowed'
            )}
          >
            {isSaving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Score panel */}
      <AnimatePresence>
        {score && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            className="relative bg-zinc-900/50 border border-white/6 rounded-2xl p-5"
          >
            <button
              onClick={() => setScore(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-zinc-600 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex flex-col sm:flex-row gap-6">
              {/* Scores overview */}
              <div className="flex items-center gap-5 shrink-0">
                <div className="text-center">
                  <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2">Overall</p>
                  <ScoreRing score={score.overall} size={72} />
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-3">
                  {[
                    { label: 'Title', v: score.titleScore },
                    { label: 'Description', v: score.descriptionScore },
                    { label: 'Keywords', v: score.keywordsScore },
                    { label: 'ATS', v: score.atsScore },
                  ].map((s) => (
                    <div key={s.label} className="flex items-center gap-2">
                      <ScoreRing score={s.v} size={32} />
                      <span className="text-[11px] text-zinc-400">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feedback */}
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {score.strengths.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-2">Strengths</p>
                    <ul className="space-y-1.5">
                      {score.strengths.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] text-zinc-300">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {score.suggestions.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-2">To Improve</p>
                    <ul className="space-y-1.5">
                      {score.suggestions.map((s, i) => (
                        <li key={i} className="flex items-start gap-2 text-[12px] text-zinc-300">
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
        {/* Left: Editor */}
        <div className="space-y-4">
          {/* Tab switcher */}
          <div className="flex gap-0.5 bg-zinc-900/60 border border-white/5 rounded-xl p-1 w-fit">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={cn(
                  'px-4 py-1.5 rounded-lg text-[12px] font-medium transition-all',
                  activeTab === t.id
                    ? 'bg-zinc-800 text-white'
                    : 'text-zinc-500 hover:text-zinc-300'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* ── Basic ── */}
            {activeTab === 'basic' && (
              <motion.div
                key="basic"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-3"
              >
                <SectionCard>
                  <Label hint="Ideal: 50–60 characters">Meta Title</Label>
                  <input
                    value={settings.metaTitle}
                    onChange={(e) => update({ metaTitle: e.target.value })}
                    placeholder={`${customData.name} — Software Developer`}
                    className={inputCls}
                  />
                  <CharBar value={settings.metaTitle} max={TITLE_MAX} />
                </SectionCard>

                <SectionCard>
                  <Label hint="Ideal: 120–160 characters">Meta Description</Label>
                  <textarea
                    value={settings.metaDescription}
                    onChange={(e) => update({ metaDescription: e.target.value })}
                    rows={3}
                    placeholder="A clear description of who you are and what you do..."
                    className={textareaCls}
                  />
                  <CharBar value={settings.metaDescription} max={DESC_MAX} />
                </SectionCard>

                <SectionCard>
                  <Label hint="For ATS & search ranking">Keywords</Label>
                  <div className="flex gap-2 mb-3">
                    <input
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                      placeholder="e.g. React, Next.js, TypeScript..."
                      className={cn(inputCls, 'flex-1')}
                    />
                    <button
                      onClick={addKeyword}
                      className="px-4 py-2.5 bg-zinc-800 border border-white/8 text-zinc-300 rounded-xl text-[12px] font-medium hover:bg-zinc-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  {settings.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {settings.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="flex items-center gap-1.5 px-2.5 py-1 bg-zinc-900 border border-white/6 rounded-lg text-[11px] font-medium text-zinc-300"
                        >
                          {kw}
                          <button
                            onClick={() =>
                              update({ keywords: settings.keywords.filter((k) => k !== kw) })
                            }
                            className="text-zinc-600 hover:text-red-400 transition-colors"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </SectionCard>
              </motion.div>
            )}

            {/* ── Social ── */}
            {activeTab === 'social' && (
              <motion.div
                key="social"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-3"
              >
                {/* OG Image */}
                <SectionCard>
                  <Label hint="Recommended 1200×630px">Social Share Image</Label>
                  <div className="flex gap-4 items-start">
                    <div className="w-28 h-16 shrink-0 bg-zinc-950/80 border border-white/6 rounded-xl overflow-hidden flex items-center justify-center">
                      {settings.ogImageUrl ? (
                        <img src={settings.ogImageUrl} alt="OG" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-6 h-6 text-zinc-700" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <label
                        className={cn(
                          'flex items-center gap-2 px-4 py-2 bg-zinc-800 border border-white/8 rounded-xl text-[12px] font-medium text-zinc-300 cursor-pointer hover:bg-zinc-700 transition-colors',
                          isUploadingOg && 'opacity-50 pointer-events-none'
                        )}
                      >
                        {isUploadingOg ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5" />
                        )}
                        {isUploadingOg ? 'Uploading...' : 'Upload image'}
                        <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handleOgUpload} />
                      </label>
                      {settings.ogImageUrl && (
                        <button
                          onClick={() => update({ ogImageUrl: null })}
                          className="text-[11px] text-red-400/70 hover:text-red-400 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </SectionCard>

                <SectionCard>
                  <Label>OG Title</Label>
                  <input
                    value={settings.ogTitle}
                    onChange={(e) => update({ ogTitle: e.target.value })}
                    placeholder="Your Portfolio Title"
                    className={inputCls}
                  />
                  <CharBar value={settings.ogTitle} max={TITLE_MAX} />
                </SectionCard>

                <SectionCard>
                  <Label>OG Description</Label>
                  <textarea
                    value={settings.ogDescription}
                    onChange={(e) => update({ ogDescription: e.target.value })}
                    rows={3}
                    placeholder="Shown when someone shares your page..."
                    className={textareaCls}
                  />
                  <CharBar value={settings.ogDescription} max={DESC_MAX} />
                </SectionCard>

                <SectionCard>
                  <Label>Twitter / X</Label>
                  <div className="flex gap-2 mb-3">
                    {(['summary', 'summary_large_image'] as const).map((v) => (
                      <button
                        key={v}
                        onClick={() => update({ twitterCard: v })}
                        className={cn(
                          'flex-1 py-2 rounded-xl text-[11px] font-semibold border transition-all',
                          settings.twitterCard === v
                            ? 'bg-sky-500/15 border-sky-500/30 text-sky-300'
                            : 'bg-zinc-900 border-white/6 text-zinc-500 hover:text-zinc-300'
                        )}
                      >
                        {v === 'summary' ? 'Small Card' : 'Large Image Card'}
                      </button>
                    ))}
                  </div>
                  <input
                    value={settings.twitterSite || ''}
                    onChange={(e) => update({ twitterSite: e.target.value || null })}
                    placeholder="@yourhandle"
                    className={inputCls}
                  />
                </SectionCard>
              </motion.div>
            )}

            {/* ── Advanced ── */}
            {activeTab === 'advanced' && (
              <motion.div
                key="advanced"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="space-y-3"
              >
                <SectionCard>
                  <Label hint="Leave as default unless you have a custom domain">Canonical URL</Label>
                  <input
                    value={settings.canonicalUrl || portfolioUrl}
                    onChange={(e) => update({ canonicalUrl: e.target.value })}
                    className={cn(inputCls, 'font-mono text-[12px]')}
                  />
                </SectionCard>

                <SectionCard>
                  <Label>Search Engine Directives</Label>
                  <div className="space-y-3">
                    {[
                      {
                        key: 'robotsIndex' as const,
                        label: 'Allow indexing',
                        desc: 'Let search engines add your portfolio to their index.',
                      },
                      {
                        key: 'robotsFollow' as const,
                        label: 'Follow links',
                        desc: 'Allow crawlers to follow links on your portfolio.',
                      },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                        <div>
                          <p className="text-[13px] font-medium text-zinc-200">{item.label}</p>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{item.desc}</p>
                        </div>
                        <Toggle
                          on={settings[item.key]}
                          onToggle={() => update({ [item.key]: !settings[item.key] })}
                        />
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Live Preview */}
        <div className="space-y-4">
          <div>
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">Live Preview</p>
            <div className="flex gap-0.5 bg-zinc-900/60 border border-white/5 rounded-xl p-1">
              {(['google', 'twitter', 'og'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={cn(
                    'flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all capitalize',
                    previewMode === mode
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-500 hover:text-zinc-300'
                  )}
                >
                  {mode === 'og' ? 'LinkedIn' : mode}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* Google preview */}
            {previewMode === 'google' && (
              <motion.div
                key="google"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-5 bg-white rounded-2xl shadow-lg"
              >
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="w-4 h-4 rounded-full bg-zinc-200" />
                  <span className="text-[12px] text-zinc-500 font-normal truncate">{portfolioUrl}</span>
                </div>
                <h3 className="text-[#1a0dab] text-[17px] font-normal leading-snug hover:underline cursor-pointer truncate mb-1">
                  {settings.metaTitle || `${customData.name || 'Your Name'} — Portfolio`}
                </h3>
                <p className="text-[13px] text-[#4d5156] leading-relaxed line-clamp-2">
                  {settings.metaDescription || 'Add a meta description to appear here...'}
                </p>
              </motion.div>
            )}

            {/* Twitter preview */}
            {previewMode === 'twitter' && (
              <motion.div
                key="twitter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl overflow-hidden border border-zinc-200 bg-white"
              >
                <div className="bg-zinc-100 h-36 flex items-center justify-center">
                  {settings.ogImageUrl ? (
                    <img src={settings.ogImageUrl} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      <ImageIcon className="w-7 h-7" />
                      <span className="text-[11px]">Upload an image</span>
                    </div>
                  )}
                </div>
                <div className="p-3 border-t border-zinc-100">
                  <p className="text-[10px] text-zinc-400 mb-0.5 truncate">{portfolioUrl}</p>
                  <h4 className="text-[13px] font-bold text-zinc-900 truncate">
                    {settings.ogTitle || settings.metaTitle || 'Your Portfolio'}
                  </h4>
                  <p className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5">
                    {settings.ogDescription || settings.metaDescription}
                  </p>
                </div>
              </motion.div>
            )}

            {/* LinkedIn / OG preview */}
            {previewMode === 'og' && (
              <motion.div
                key="og"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl overflow-hidden border border-zinc-200 bg-white"
              >
                <div className="bg-zinc-100 h-44 flex items-center justify-center">
                  {settings.ogImageUrl ? (
                    <img src={settings.ogImageUrl} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-zinc-400">
                      <ImageIcon className="w-8 h-8" />
                      <span className="text-[11px]">1200 × 630px recommended</span>
                    </div>
                  )}
                </div>
                <div className="p-4 border-t border-zinc-100">
                  <p className="text-[10px] text-zinc-400 uppercase tracking-widest mb-0.5">
                    {portfolioUrl.replace('https://', '')}
                  </p>
                  <h4 className="text-[14px] font-semibold text-zinc-900 leading-snug truncate">
                    {settings.ogTitle || settings.metaTitle || 'Your Portfolio'}
                  </h4>
                  <p className="text-[12px] text-zinc-500 line-clamp-2 mt-1">
                    {settings.ogDescription || settings.metaDescription}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tips */}
          <div className="p-4 bg-zinc-900/30 border border-white/5 rounded-2xl">
            <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-3">Pro Tips</p>
            <ul className="space-y-2">
              {[
                'Include your name and role in the title, e.g. "Jane Doe — React Developer"',
                'Add your specific title to keywords for ATS compatibility',
                'Use a professional headshot or branded banner as your OG image',
              ].map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] text-zinc-500 leading-relaxed">
                  <span className="text-indigo-400 mt-0.5 shrink-0">›</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
