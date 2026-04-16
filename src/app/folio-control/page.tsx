'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/store/useStore';
import {
  Plus, Filter, ArrowUpDown, LayoutGrid, Award,
  GraduationCap, MessageSquare, FolderOpen, Trash2,
  Image as ImageIcon, FileText, Upload, Briefcase, Pencil,
  Github, FileUp, Loader2, CheckCircle2, X,
  Music, Play, FileCode, FileArchive, Code2, User, Link,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Education, Experience } from '@/services/profile.service';

import { RepoCard } from '@/components/features/dashboard/RepoCard';
import { SkillBadge } from '@/components/features/dashboard/SkillBadge';
import { Modal } from '@/components/ui/Modal';
import { Dropdown } from '@/components/ui/Dropdown';
import { EducationForm } from '@/components/features/folio/EducationForm';
import { ExperienceForm } from '@/components/features/folio/ExperienceForm';
import { TestimonialForm } from '@/components/features/folio/TestimonialForm';
import { ProfileEditForm } from '@/components/features/folio/ProfileEditForm';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Testimonial } from '@/services/testimonials.service';


export type FolioTab = 'repos' | 'skills' | 'professional' | 'testimonials' | 'assets';

const ICON_FOR_TYPE: Record<string, React.ReactNode> = {
  image: <ImageIcon className="w-8 h-8 text-zinc-600" />,
  video: <Play className="w-8 h-8 text-zinc-600" />,
  audio: <Music className="w-8 h-8 text-zinc-600" />,
  code: <Code2 className="w-8 h-8 text-zinc-600" />,
  archive: <FileArchive className="w-8 h-8 text-zinc-600" />,
  doc: <FileText className="w-8 h-8 text-zinc-600" />,
};



// ─── Success Modal ────────────────────────────────────────────────────────────
function SuccessModal({
  source,
  counts,
  onClose,
}: {
  source: 'github' | 'resume';
  counts: { edu: number; exp: number };
  onClose: () => void;
}) {
  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 12 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xs bg-zinc-900 border border-white/8 rounded-3xl overflow-hidden shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 14, delay: 0.1 }}
            className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-5 shadow-lg shadow-indigo-500/20"
          >
            <CheckCircle2 className="w-8 h-8 text-white" />
          </motion.div>

          <h3 className="text-[18px] font-semibold text-white mb-1">
            {source === 'github' ? 'GitHub synced' : 'Resume imported'}
          </h3>
          <p className="text-[13px] text-zinc-500 mb-6">Your profile has been updated.</p>

          <div className="w-full bg-zinc-950/60 border border-white/5 rounded-2xl p-4 space-y-2 mb-6">
            {[
              { label: 'Education entries added', value: counts.edu },
              { label: 'Experience entries added', value: counts.exp },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between text-[13px]">
                <span className="text-zinc-500">{row.label}</span>
                <span className="font-semibold text-white tabular-nums">{row.value}</span>
              </div>
            ))}
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-white text-zinc-950 rounded-xl text-[14px] font-semibold hover:bg-zinc-100 transition-colors"
          >
            Done
          </button>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

// ─── Tabs config ──────────────────────────────────────────────────────────────
const TABS: { id: FolioTab; label: string; icon: React.ElementType }[] = [
  { id: 'repos', label: 'Projects', icon: LayoutGrid },
  { id: 'skills', label: 'Skills', icon: Award },
  { id: 'professional', label: 'Professional', icon: Briefcase },
  { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
  { id: 'assets', label: 'Assets', icon: FolderOpen },
];

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function FolioControlPage() {
  const {
    repos, selectedRepoIds, toggleRepoSelection, skills, setSkills,
    education, experiences, fetchProfile, syncGithubProfile, importResume,
    addEducation, updateEducation, deleteEducation,
    addExperience, updateExperience, deleteExperience,
    fetchMoreRepos, repoPagination,
    testimonials, fetchTestimonials, addTestimonial, updateTestimonial,
    approveTestimonial, deleteTestimonial,
    assets, fetchAssets, uploadAsset, deleteAsset,
    githubUser, customData, updateCustomData, saveProfile, isPublished,
    addNotification,
  } = useStore();

  const [activeTab, setActiveTab] = useState<FolioTab>('repos');
  const [newSkill, setNewSkill] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'name' | 'updated-desc'>('stars');
  const [filterLang, setFilterLang] = useState<string>('All');
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);
  const [expToDelete, setExpToDelete] = useState<string | null>(null);
  const [eduToDelete, setEduToDelete] = useState<string | null>(null);
  const [testimonialToDelete, setTestimonialToDelete] = useState<string | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<string | null>(null);


  const [isSyncing, setIsSyncing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [showEduModal, setShowEduModal] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);
  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successSource, setSuccessSource] = useState<'github' | 'resume'>('github');
  const [importedCounts, setImportedCounts] = useState({ edu: 0, exp: 0 });

  useEffect(() => {
    setMounted(true);
    Promise.allSettled([fetchProfile(), fetchTestimonials(), fetchAssets()]);
  }, [fetchProfile, fetchTestimonials, fetchAssets]);

  const handleSyncGithub = async () => {
    setIsSyncing(true);
    const prevEdu = education.length;
    const prevExp = experiences.length;
    try {
      await syncGithubProfile();
      setSuccessSource('github');
      setImportedCounts({
        edu: Math.max(0, useStore.getState().education.length - prevEdu),
        exp: Math.max(0, useStore.getState().experiences.length - prevExp),
      });
      setShowSuccessModal(true);
      addNotification('GitHub synced.', 'success');
    } catch {
      addNotification('Sync failed.', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsImporting(true);
    const prevEdu = education.length;
    const prevExp = experiences.length;
    try {
      await importResume(file);
      setSuccessSource('resume');
      setImportedCounts({
        edu: Math.max(0, useStore.getState().education.length - prevEdu),
        exp: Math.max(0, useStore.getState().experiences.length - prevExp),
      });
      setShowSuccessModal(true);
      addNotification('Resume imported.', 'success');
    } catch {
      addNotification('Import failed.', 'error');
    } finally {
      setIsImporting(false);
      e.target.value = '';
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const s = newSkill.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setNewSkill('');
    }
  };

  const languages = useMemo(() => {
    const langs = new Set(repos.map((r) => r.language).filter(Boolean));
    return ['All', ...Array.from(langs)] as string[];
  }, [repos]);

  const sortedRepos = useMemo(() => {
    let result = [...repos];
    if (filterLang !== 'All') result = result.filter((r) => r.language === filterLang);
    result.sort((a, b) => {
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
    return result;
  }, [repos, sortBy, filterLang]);

  return (
    <div className="space-y-8 pb-20">
      {/* ── Page header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-6 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-semibold tracking-tight text-white">Folio Control</h1>
            {isPublished && (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/15 rounded-full">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider">Live</span>
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Curate the content that appears on your public portfolio.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/8 text-zinc-300 rounded-xl text-[13px] font-medium hover:bg-zinc-800 transition-all"
          >
            <User className="w-3.5 h-3.5" />
            Edit Profile
          </button>

          <button
            onClick={handleSyncGithub}
            disabled={isSyncing}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/8 text-zinc-300 rounded-xl text-[13px] font-medium hover:bg-zinc-800 transition-all disabled:opacity-40"
          >
            {isSyncing ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Github className="w-3.5 h-3.5" />
            )}
            {isSyncing ? 'Syncing...' : 'Sync GitHub'}
          </button>

          <label
            className={cn(
              'flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[13px] font-medium transition-all cursor-pointer shadow-sm shadow-indigo-500/20',
              isImporting && 'opacity-50 pointer-events-none'
            )}
          >
            {isImporting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FileUp className="w-3.5 h-3.5" />
            )}
            {isImporting ? 'Processing...' : 'Import Resume'}
            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
          </label>
        </div>
      </div>

      {/* ── Tab Navigation ── */}
      <div className="flex items-center gap-0.5 bg-zinc-900/60 border border-white/5 rounded-xl p-1 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all whitespace-nowrap',
              activeTab === tab.id ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="folioTab"
                className="absolute inset-0 bg-zinc-800 rounded-lg"
                transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
              />
            )}
            <tab.icon className="w-3.5 h-3.5 relative z-10" />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {/* ─ Repos ─ */}
          {activeTab === 'repos' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-baseline gap-3">
                  <p className="text-[13px] font-medium text-zinc-300">
                    {selectedRepoIds.length} selected
                  </p>
                  <span className="text-[11px] text-zinc-600">of {repos.length} repositories</span>
                </div>
                <div className="flex gap-2">
                  <Dropdown
                    value={sortBy}
                    onChange={(val) => setSortBy(val as any)}
                    options={[
                      { label: 'Stars', value: 'stars' },
                      { label: 'Name', value: 'name' },
                      { label: 'Recently updated', value: 'updated-desc' },
                    ]}
                    icon={<ArrowUpDown className="w-3.5 h-3.5" />}
                    className="w-44"
                  />
                  <Dropdown
                    value={filterLang}
                    onChange={setFilterLang}
                    options={languages.map((l) => ({ label: l, value: l }))}
                    icon={<Filter className="w-3.5 h-3.5" />}
                    className="w-36"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {sortedRepos.map((repo, i) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                    isSelected={selectedRepoIds.includes(repo.id)}
                    onToggle={() => toggleRepoSelection(repo.id)}
                    index={i}
                  />
                ))}
              </div>

              {repoPagination && repoPagination.currentPage < repoPagination.totalPages && (
                <div className="flex justify-center pt-2">
                  <button
                    onClick={async () => {
                      setIsLoadingMore(true);
                      await fetchMoreRepos((repoPagination.currentPage ?? 1) + 1);
                      setIsLoadingMore(false);
                    }}
                    disabled={isLoadingMore}
                    className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 border border-white/8 text-[13px] font-medium text-zinc-300 rounded-xl hover:bg-zinc-800 transition-all disabled:opacity-40"
                  >
                    {isLoadingMore ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    {isLoadingMore
                      ? 'Loading...'
                      : `Load more (${repos.length} / ${repoPagination.totalItems})`}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ─ Skills ─ */}
          {activeTab === 'skills' && (
            <div className="max-w-2xl space-y-5">
              <form onSubmit={handleAddSkill} className="relative">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill — e.g. React, TypeScript, Figma"
                  className="w-full bg-zinc-900/50 border border-white/8 rounded-xl pl-4 pr-14 py-3.5 text-[13px] text-white placeholder-zinc-600 focus:outline-none focus:border-white/15 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newSkill.trim()}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-white text-zinc-950 rounded-lg text-sm font-bold disabled:opacity-30 hover:bg-zinc-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <SkillBadge
                      key={skill}
                      skill={skill}
                      onDelete={() => setSkillToDelete(skill)}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 border border-dashed border-white/6 rounded-2xl">
                  <p className="text-sm text-zinc-600">No skills added yet.</p>
                </div>
              )}
            </div>
          )}

          {/* ─ Professional ─ */}
          {activeTab === 'professional' && (
            <div className="space-y-12 max-w-4xl">
              {/* Experience */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-[15px] font-semibold text-white">Work Experience</h2>
                    <p className="text-[12px] text-zinc-500 mt-0.5">{experiences.length} entries</p>
                  </div>
                  <button
                    onClick={() => { setEditingExp(null); setShowExpModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/8 text-zinc-300 rounded-xl text-[13px] font-medium hover:bg-zinc-800 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>

                {experiences.length === 0 ? (
                  <div className="flex items-center justify-center h-28 border border-dashed border-white/6 rounded-2xl">
                    <p className="text-sm text-zinc-600">No experience entries. Sync GitHub or import a resume.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {experiences.map((exp) => (
                      <motion.div
                        key={exp.id}
                        layout
                        className="group flex items-start justify-between gap-4 p-4 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-white/8 hover:bg-zinc-900/50 transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[14px] font-semibold text-white truncate">{exp.position}</span>
                            {exp.isCurrent && (
                              <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/15 rounded-full text-[9px] font-semibold text-indigo-400 uppercase tracking-wider shrink-0">
                                Current
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] text-zinc-400">{exp.company}</p>
                          <p className="text-[11px] text-zinc-600 mt-0.5">
                            {exp.startDate && new Date(exp.startDate).getFullYear()}
                            {' — '}
                            {exp.isCurrent ? 'Present' : exp.endDate && new Date(exp.endDate).getFullYear()}
                          </p>
                          {exp.description && (
                            <p className="text-[12px] text-zinc-500 mt-1.5 leading-relaxed line-clamp-2">
                              {exp.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => { setEditingExp(exp); setShowExpModal(true); }}
                            className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-white/5 transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setExpToDelete(exp.id)}
                            className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/8 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>

              {/* Education */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-[15px] font-semibold text-white">Education</h2>
                    <p className="text-[12px] text-zinc-500 mt-0.5">{education.length} entries</p>
                  </div>
                  <button
                    onClick={() => { setEditingEdu(null); setShowEduModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/8 text-zinc-300 rounded-xl text-[13px] font-medium hover:bg-zinc-800 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>

                {education.length === 0 ? (
                  <div className="flex items-center justify-center h-28 border border-dashed border-white/6 rounded-2xl">
                    <p className="text-sm text-zinc-600">No education entries found.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <motion.div
                        key={edu.id}
                        layout
                        className="group flex items-start justify-between gap-4 p-4 bg-zinc-900/30 border border-white/5 rounded-2xl hover:border-white/8 hover:bg-zinc-900/50 transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-white truncate">{edu.school}</p>
                          <p className="text-[12px] text-zinc-400 mt-0.5">
                            {edu.degree}
                            {edu.fieldOfStudy && <span className="text-zinc-500"> · {edu.fieldOfStudy}</span>}
                          </p>
                          <p className="text-[11px] text-zinc-600 mt-0.5">
                            {edu.startDate && new Date(edu.startDate).getFullYear()}
                            {edu.endDate && ` — ${new Date(edu.endDate).getFullYear()}`}
                          </p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <button
                            onClick={() => { setEditingEdu(edu); setShowEduModal(true); }}
                            className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-white/5 transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEduToDelete(edu.id)}
                            className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/8 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ─ Testimonials ─ */}
          {activeTab === 'testimonials' && (
            <div className="space-y-5 max-w-5xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[12px] text-zinc-400">
                      {testimonials.filter((t) => t.isApproved).length} published
                    </span>
                  </div>
                  {testimonials.filter((t) => !t.isApproved).length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-[12px] text-zinc-400">
                        {testimonials.filter((t) => !t.isApproved).length} pending
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/review/${githubUser?.login}`;
                      navigator.clipboard.writeText(url);
                      addNotification('Review link copied.', 'success');
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/8 text-zinc-300 rounded-xl text-[13px] font-medium hover:bg-zinc-800 transition-all"
                  >
                    <Link className="w-3.5 h-3.5" />
                    Copy review link
                  </button>
                  <button
                    onClick={() => { setEditingTestimonial(null); setShowTestimonialModal(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 rounded-xl text-[13px] font-semibold hover:bg-zinc-100 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>
              </div>

              {testimonials.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-44 border border-dashed border-white/6 rounded-2xl gap-3">
                  <Star className="w-6 h-6 text-zinc-700" />
                  <p className="text-sm text-zinc-600">No testimonials yet.</p>
                </div>
              ) : (
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
                  {testimonials.map((t) => (
                    <div
                      key={t.id}
                      className={cn(
                        'break-inside-avoid group relative rounded-2xl border p-5 transition-all',
                        t.isApproved
                          ? 'bg-zinc-900/40 border-white/6 hover:border-white/10'
                          : 'bg-zinc-900/20 border-white/4'
                      )}
                    >
                      {!t.isApproved && (
                        <div className="absolute top-4 right-4 px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[9px] font-semibold uppercase tracking-wider rounded-md">
                          Pending
                        </div>
                      )}

                      <p className="text-[13px] text-zinc-300 leading-[1.7] mb-4">
                        &ldquo;{t.content}&rdquo;
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {t.avatarUrl ? (
                            <img
                              src={t.avatarUrl}
                              alt={t.name}
                              className="w-8 h-8 rounded-full object-cover border border-white/8"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs text-zinc-400">
                              {t.name[0]?.toUpperCase()}
                            </div>
                          )}
                          <div>
                            <p className="text-[12px] font-semibold text-zinc-200 leading-none">
                              {t.name}
                            </p>
                            <p className="text-[11px] text-zinc-500 mt-0.5">{t.role}</p>
                          </div>
                        </div>

                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {!t.isApproved && (
                            <button
                              onClick={async () => {
                                await approveTestimonial(t.id);
                                addNotification('Testimonial approved.', 'success');
                              }}
                              className="p-1.5 rounded-lg text-zinc-600 hover:text-emerald-400 hover:bg-emerald-500/8 transition-all"
                              title="Approve"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => { setEditingTestimonial(t); setShowTestimonialModal(true); }}
                            className="p-1.5 rounded-lg text-zinc-600 hover:text-white hover:bg-white/5 transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setTestimonialToDelete(t.id)}
                            className="p-1.5 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/8 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─ Assets ─ */}
          {activeTab === 'assets' && (
            <div className="space-y-5 max-w-5xl">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-zinc-400">
                  {assets.length} {assets.length === 1 ? 'file' : 'files'}
                </p>
                <label
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 bg-white text-zinc-950 rounded-xl text-[13px] font-semibold hover:bg-zinc-100 transition-all cursor-pointer',
                    isUploadingAsset && 'opacity-50 pointer-events-none'
                  )}
                >
                  {isUploadingAsset ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  {isUploadingAsset ? 'Uploading...' : 'Upload'}
                  <input
                    type="file"
                    className="hidden"
                    disabled={isUploadingAsset}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setIsUploadingAsset(true);
                      try {
                        await uploadAsset(file);
                        addNotification(`${file.name} uploaded.`, 'success');
                      } catch {
                        addNotification('Upload failed.', 'error');
                      } finally {
                        setIsUploadingAsset(false);
                        e.target.value = '';
                      }
                    }}
                  />
                </label>
              </div>

              {assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 border border-dashed border-white/6 rounded-2xl gap-3">
                  <FolderOpen className="w-7 h-7 text-zinc-700" />
                  <p className="text-sm text-zinc-600">No assets uploaded yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {assets.map((asset) => (
                    <div
                      key={asset.id}
                      className="group relative bg-zinc-900/30 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all flex flex-col"
                    >
                      {/* Thumbnail */}
                      <div className="aspect-square flex items-center justify-center bg-zinc-950/40 text-zinc-700 group-hover:text-zinc-500 transition-colors">
                        {asset.type === 'image' && asset.url ? (
                          <img
                            src={asset.url}
                            alt={asset.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          ICON_FOR_TYPE[asset.type] ?? <FileText className="w-8 h-8" />
                        )}
                      </div>

                      {/* Footer */}
                      <div className="px-3 py-2 flex items-center justify-between border-t border-white/4">
                        <p className="text-[11px] text-zinc-500 truncate flex-1 mr-1">{asset.name}</p>
                        <button
                          onClick={() => setAssetToDelete(asset.id)}
                          className="p-1 rounded-md text-zinc-700 hover:text-red-400 hover:bg-red-500/8 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                          title="Delete"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ── Modals ── */}
      <Modal isOpen={showEduModal} onClose={() => setShowEduModal(false)} title={editingEdu ? 'Edit Education' : 'Add Education'}>
        <EducationForm
          initialData={editingEdu || undefined}
          onSubmit={async (data) => {
            if (editingEdu) {
              await updateEducation(editingEdu.id, data);
              addNotification('Education updated.', 'success');
            } else {
              await addEducation(data);
              addNotification('Education added.', 'success');
            }
            setShowEduModal(false);
          }}
          onCancel={() => setShowEduModal(false)}
        />
      </Modal>

      <Modal isOpen={showExpModal} onClose={() => setShowExpModal(false)} title={editingExp ? 'Edit Experience' : 'Add Experience'}>
        <ExperienceForm
          initialData={editingExp || undefined}
          onSubmit={async (data) => {
            if (editingExp) {
              await updateExperience(editingExp.id, data);
              addNotification('Experience updated.', 'success');
            } else {
              await addExperience(data);
              addNotification('Experience added.', 'success');
            }
            setShowExpModal(false);
          }}
          onCancel={() => setShowExpModal(false)}
        />
      </Modal>

      <Modal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} title="Edit Public Profile">
        <ProfileEditForm
          onSubmit={async (data) => {
            setIsSavingProfile(true);
            try {
              updateCustomData(data);
              await saveProfile();
              addNotification('Profile saved.', 'success');
              setShowProfileModal(false);
            } catch {
              addNotification('Failed to save.', 'error');
            } finally {
              setIsSavingProfile(false);
            }
          }}
          onCancel={() => setShowProfileModal(false)}
          isSubmitting={isSavingProfile}
        />
      </Modal>

      <Modal
        isOpen={showTestimonialModal}
        onClose={() => setShowTestimonialModal(false)}
        title={editingTestimonial ? 'Edit Testimonial' : 'Add Testimonial'}
      >
        <TestimonialForm
          initialData={editingTestimonial || undefined}
          onSubmit={async (data) => {
            if (editingTestimonial) {
              await updateTestimonial(editingTestimonial.id, { ...data, isApproved: true });
              addNotification('Testimonial updated.', 'success');
            } else {
              await addTestimonial(data);
              addNotification('Testimonial added.', 'success');
            }
            setShowTestimonialModal(false);
          }}
          onCancel={() => setShowTestimonialModal(false)}
        />
      </Modal>

      {/* Deletion confirmations */}
      <ConfirmModal
        isOpen={!!skillToDelete}
        onClose={() => setSkillToDelete(null)}
        onConfirm={async () => {
          if (skillToDelete) {
            setSkills(skills.filter((s) => s !== skillToDelete));
            addNotification(`"${skillToDelete}" removed.`);
            setSkillToDelete(null);
          }
        }}
        title="Remove Skill"
        description={`Are you sure you want to remove "${skillToDelete}" from your profile?`}
        confirmLabel="Remove"
        type="danger"
      />

      <ConfirmModal
        isOpen={!!expToDelete}
        onClose={() => setExpToDelete(null)}
        onConfirm={async () => {
          if (expToDelete) {
            await deleteExperience(expToDelete);
            addNotification('Experience removed.');
            setExpToDelete(null);
          }
        }}
        title="Delete Experience"
        description="This action cannot be undone. Are you sure you want to delete this experience entry?"
        confirmLabel="Delete"
        type="danger"
      />

      <ConfirmModal
        isOpen={!!eduToDelete}
        onClose={() => setEduToDelete(null)}
        onConfirm={async () => {
          if (eduToDelete) {
            await deleteEducation(eduToDelete);
            addNotification('Education removed.');
            setEduToDelete(null);
          }
        }}
        title="Delete Education"
        description="This action cannot be undone. Are you sure you want to delete this education entry?"
        confirmLabel="Delete"
        type="danger"
      />

      <ConfirmModal
        isOpen={!!testimonialToDelete}
        onClose={() => setTestimonialToDelete(null)}
        onConfirm={async () => {
          if (testimonialToDelete) {
            await deleteTestimonial(testimonialToDelete);
            addNotification('Testimonial deleted.');
            setTestimonialToDelete(null);
          }
        }}
        title="Delete Testimonial"
        description="Are you sure you want to delete this testimonial? It will be permanently removed."
        confirmLabel="Delete"
        type="danger"
      />

      <ConfirmModal
        isOpen={!!assetToDelete}
        onClose={() => setAssetToDelete(null)}
        onConfirm={async () => {
          if (assetToDelete) {
            await deleteAsset(assetToDelete);
            addNotification('Asset deleted.');
            setAssetToDelete(null);
          }
        }}
        title="Delete Asset"
        description="Are you sure you want to delete this asset? This action will remove it permanently."
        confirmLabel="Delete"
        type="danger"
      />


      {/* Success modal */}
      <AnimatePresence>
        {mounted && showSuccessModal && (
          <SuccessModal
            source={successSource}
            counts={importedCounts}
            onClose={() => setShowSuccessModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
