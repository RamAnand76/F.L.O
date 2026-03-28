'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/store/useStore';
import {
  Plus, Filter, ArrowUpDown, AlertCircle, LayoutGrid, Award,
  GraduationCap, MessageSquare, FolderOpen, Trash2,
  Image as ImageIcon, FileText, Upload, Quote, Briefcase, Pencil,
  Github, FileUp, Loader2, Sparkles, CheckCircle2, X,
  MoreHorizontal, Music, Play, FileCode, FileArchive, Code2, User
} from 'lucide-react';
import { useWindowSize } from '@/hooks/useWindowSize';
import { cn } from '@/lib/utils';
import { Education, Experience } from '@/services/profile.service';

// Extracted Components
import { RepoCard } from '@/components/features/dashboard/RepoCard';
import { SkillBadge } from '@/components/features/dashboard/SkillBadge';
import { Modal } from '@/components/ui/Modal';
import { Dropdown } from '@/components/ui/Dropdown';
import { EducationForm } from '@/components/features/folio/EducationForm';
import { ExperienceForm } from '@/components/features/folio/ExperienceForm';
import { TestimonialForm } from '@/components/features/folio/TestimonialForm';
import { ProfileEditForm } from '@/components/features/folio/ProfileEditForm';
import { Testimonial } from '@/services/testimonials.service';

export type FolioTab = 'repos' | 'skills' | 'professional' | 'testimonials' | 'assets';

export default function FolioControlPage() {
  const {
    repos, selectedRepoIds, toggleRepoSelection, skills, setSkills,
    education, experiences, fetchProfile, syncGithubProfile, importResume,
    addEducation, updateEducation, deleteEducation,
    addExperience, updateExperience, deleteExperience,
    fetchMoreRepos, repoPagination,
    testimonials, fetchTestimonials, addTestimonial, updateTestimonial, deleteTestimonial,
    assets, fetchAssets, uploadAsset, deleteAsset,
    customData, updateCustomData, saveProfile, isPublished
  } = useStore();

  const { width } = useWindowSize();
  const [activeTab, setActiveTab] = useState<FolioTab>('repos');

  // Local UI state
  const [newSkill, setNewSkill] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'name' | 'updated-desc' | 'updated-asc'>('stars');
  const [filterLang, setFilterLang] = useState<string>('All');
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [showEduModal, setShowEduModal] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isUploadingAsset, setIsUploadingAsset] = useState(false);
  const [successSource, setSuccessSource] = useState<'github' | 'resume'>('github');
  const [importedCounts, setImportedCounts] = useState({ edu: 0, exp: 0 });

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    Promise.allSettled([
      fetchProfile(),
      fetchTestimonials(),
      fetchAssets()
    ]).finally(() => setIsLoading(false));
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
        exp: Math.max(0, useStore.getState().experiences.length - prevExp)
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Sync failed:', error);
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
        exp: Math.max(0, useStore.getState().experiences.length - prevExp)
      });
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
      // Reset input
      e.target.value = '';
    }
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const languages = useMemo(() => {
    const langs = new Set(repos.map(r => r.language).filter(Boolean));
    return ['All', ...Array.from(langs)] as string[];
  }, [repos]);

  const filteredAndSortedRepos = useMemo(() => {
    let result = [...repos];
    if (filterLang !== 'All') result = result.filter(r => r.language === filterLang);
    result.sort((a, b) => {
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'updated-desc') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      return 0;
    });
    return result;
  }, [repos, sortBy, filterLang]);

  const tabs = [
    { id: 'repos', label: 'Projects', icon: LayoutGrid },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'assets', label: 'Assets', icon: FolderOpen }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 md:space-y-12 mb-20">
      <header className="border-b border-white/5 pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <motion.h1 className="text-3xl md:text-4xl font-semibold tracking-tighter" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            Folio Control
          </motion.h1>
          <div className="flex items-center gap-2">
            <motion.p className="text-zinc-400 text-base md:text-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              Curate the content that appears on your portfolio.
            </motion.p>
            {isPublished && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Live</span>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowProfileModal(true)}
            className="px-5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-zinc-800 transition-all flex items-center gap-2"
          >
            <User className="w-4 h-4 text-indigo-400" />
            Edit Profile
          </button>
          <button
            onClick={handleSyncGithub}
            disabled={isSyncing}
            className="px-5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-zinc-800 transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
            Sync from GitHub
          </button>

          <label className={cn(
            "px-5 py-2.5 bg-indigo-600 rounded-xl text-xs font-bold text-white hover:bg-indigo-500 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20",
            isImporting && "opacity-50 pointer-events-none"
          )}>
            {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
            {isImporting ? 'Processing...' : 'Import from Resume'}
            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
          </label>
        </div>
      </header>

      {/* Mobile Grid Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-10 md:hidden">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn(
            "relative flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl text-[10px] font-bold transition-all duration-300 border cursor-pointer",
            activeTab === tab.id ? "bg-zinc-800 text-white border-white/10 shadow-lg" : "bg-zinc-900/40 text-zinc-500 border-white/5 hover:text-zinc-300 hover:bg-zinc-800/60"
          )}>
            {activeTab === tab.id && <motion.div layoutId="folioActiveTabMobile" className="absolute inset-0 bg-zinc-800 rounded-2xl" transition={{ type: "spring", bounce: 0.2, duration: 0.5 }} />}
            <tab.icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10 leading-none">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Desktop Pill Tabs */}
      <div className="hidden md:flex p-1 bg-zinc-900/80 border border-white/5 rounded-full backdrop-blur-xl mb-12 w-fit mx-auto">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn(
            "relative group px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 whitespace-nowrap text-zinc-500 hover:text-zinc-300 cursor-pointer",
            activeTab === tab.id && "text-white"
          )}>
            {activeTab === tab.id && <motion.div layoutId="folioActiveTab" className="absolute inset-0 bg-zinc-800 rounded-full" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />}
            <tab.icon className={cn("w-4 h-4 relative z-10 transition-colors", activeTab === tab.id ? "text-white" : "text-zinc-500 group-hover:text-zinc-300")} />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="min-h-[400px]">
          {activeTab === 'repos' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">Repositories</h2>
                <span className="text-sm text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  {selectedRepoIds.length} Selected
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Dropdown value={sortBy} onChange={(val) => setSortBy(val as any)} options={[{ label: 'Sort by Stars', value: 'stars' }, { label: 'Sort by Name', value: 'name' }]} icon={<ArrowUpDown className="w-4 h-4" />} className="w-full sm:w-64" />
                <Dropdown value={filterLang} onChange={setFilterLang} options={languages.map(l => ({ label: l, value: l }))} icon={<Filter className="w-4 h-4" />} className="w-full sm:w-48" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedRepos.map((repo, i) => <RepoCard key={repo.id} repo={repo} isSelected={selectedRepoIds.includes(repo.id)} onToggle={() => toggleRepoSelection(repo.id)} index={i} />)}
              </div>

              {/* Load More */}
              {repoPagination && repoPagination.currentPage < repoPagination.totalPages && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={async () => {
                      setIsLoadingMore(true);
                      await fetchMoreRepos((repoPagination.currentPage ?? 1) + 1);
                      setIsLoadingMore(false);
                    }}
                    disabled={isLoadingMore}
                    className="px-8 py-3 bg-zinc-900 border border-white/10 text-sm font-bold text-white rounded-xl hover:bg-zinc-800 transition-all flex items-center gap-2 disabled:opacity-50"
                  >
                    {isLoadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {isLoadingMore ? 'Loading...' : `Load More (${repos.length} / ${repoPagination.totalItems})`}
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-8 max-w-2xl mx-auto">
              <h2 className="text-xl md:text-2xl font-medium tracking-tight text-center">Skills & Tech Stack</h2>
              <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 space-y-8">
                <form onSubmit={handleAddSkill} className="relative">
                  <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill (e.g. React)" className="w-full bg-zinc-950/50 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50" />
                  <button type="submit" disabled={!newSkill.trim()} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white text-black rounded-lg disabled:opacity-50"><Plus className="w-5 h-5" /></button>
                </form>
                <div className="flex flex-wrap gap-3">
                  {skills.map(skill => <SkillBadge key={skill} skill={skill} onDelete={() => setSkillToDelete(skill)} />)}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'professional' && (
            <div className="space-y-32 max-w-6xl mx-auto py-12">
              {/* Experience Section */}
              <section className="space-y-16">
                <header className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-500/10 rounded-2xl flex items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/5">
                      <Briefcase className="w-6 h-6 text-indigo-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">Work Experience</h2>
                      <p className="text-xs text-zinc-500">Your professional journey and contributions.</p>
                    </div>
                  </div>
                  <button onClick={() => { setEditingExp(null); setShowExpModal(true); }} className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl border border-white/10 transition-all flex items-center gap-2 group shadow-xl">
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add Experience
                  </button>
                </header>

                <div className="space-y-16 relative">
                  {/* Vertical Line Connector */}
                  <div className="absolute left-[3.1rem] top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block" />

                  {experiences.map((exp, index) => {
                    const colors = ['#6366f1', '#a855f7', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];
                    const color = colors[index % colors.length];

                    return (
                      <motion.div
                        key={exp.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group flex flex-col md:flex-row gap-6 md:gap-0 items-start md:items-center"
                      >
                        {/* 01. Number and Label */}
                        <div className="w-24 shrink-0 md:pr-4">
                          <span className="block text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] mb-1">XP</span>
                          <span className="text-5xl font-black tracking-tighter text-zinc-800 group-hover:text-zinc-200 transition-colors duration-500">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                        </div>

                        {/* 02. Company and Actions */}
                        <div className="w-full md:w-64 md:px-8 space-y-3 shrink-0">
                          <h3 className="text-xl md:text-2xl font-bold text-white leading-tight group-hover:text-indigo-400 transition-colors">
                            {exp.company}
                          </h3>
                          <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingExp(exp); setShowExpModal(true); }} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => deleteExperience(exp.id)} className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>

                        {/* 03. Connector & Point */}
                        <div className="hidden md:flex flex-1 items-center px-4">
                          <div className="flex-1 h-px bg-gradient-to-r from-white/5 via-white/10 to-transparent" style={{ backgroundColor: `${color}20` }} />
                          <div className="w-2.5 h-2.5 rounded-full shrink-0 mr-12 transition-all duration-500 group-hover:scale-125" style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}60` }} />
                        </div>

                        {/* 04. Details and List */}
                        <div className="flex-[1.5] space-y-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <div className="md:hidden w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                              <h4 className="text-base font-bold text-zinc-200 tracking-tight">{exp.position}</h4>
                            </div>
                            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                              <span>{exp.startDate && new Date(exp.startDate).getFullYear()}</span>
                              <span className="w-4 h-px bg-zinc-800" />
                              <span className={cn(exp.isCurrent ? "text-indigo-400" : "")}>
                                {exp.isCurrent ? 'PRESENT' : (exp.endDate && new Date(exp.endDate).getFullYear())}
                              </span>
                            </p>
                          </div>
                          <p className="text-sm text-zinc-500 leading-relaxed max-w-lg group-hover:text-zinc-400 transition-colors">
                            {exp.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  {experiences.length === 0 && <div className="p-12 border border-dashed border-white/5 rounded-[2.5rem] text-center text-zinc-600 font-medium">No experience data found. Try syncing from GitHub or uploading a resume.</div>}
                </div>
              </section>

              {/* Education Section */}
              <section className="space-y-16">
                <header className="flex items-center justify-between border-b border-white/5 pb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 shadow-lg shadow-purple-500/5">
                      <GraduationCap className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">Education</h2>
                      <p className="text-xs text-zinc-500">Academic foundation and certifications.</p>
                    </div>
                  </div>
                  <button onClick={() => { setEditingEdu(null); setShowEduModal(true); }} className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold rounded-xl border border-white/10 transition-all flex items-center gap-2 group shadow-xl">
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add Education
                  </button>
                </header>

                <div className="space-y-16 relative">
                  <div className="absolute left-[3.1rem] top-8 bottom-8 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent hidden md:block" />

                  {education.map((edu, index) => {
                    const colors = ['#ec4899', '#a855f7', '#6366f1', '#06b6d4', '#10b981'];
                    const color = colors[index % colors.length];

                    return (
                      <motion.div
                        key={edu.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative group flex flex-col md:flex-row gap-6 md:gap-0 items-start md:items-center"
                      >
                        <div className="w-24 shrink-0 md:pr-4">
                          <span className="block text-[10px] font-black text-zinc-700 uppercase tracking-[0.2em] mb-1">EDU</span>
                          <span className="text-5xl font-black tracking-tighter text-zinc-800 group-hover:text-zinc-200 transition-colors duration-500">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                        </div>

                        <div className="w-full md:w-64 md:px-8 space-y-3 shrink-0">
                          <h3 className="text-xl md:text-2xl font-bold text-white leading-tight group-hover:text-purple-400 transition-colors">
                            {edu.school}
                          </h3>
                          <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingEdu(edu); setShowEduModal(true); }} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-zinc-500 hover:text-white transition-all"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={() => deleteEducation(edu.id)} className="p-2 bg-white/5 hover:bg-red-500/10 rounded-lg text-zinc-500 hover:text-red-400 transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>

                        <div className="hidden md:flex flex-1 items-center px-4">
                          <div className="flex-1 h-px bg-gradient-to-r from-white/5 via-white/10 to-transparent" style={{ backgroundColor: `${color}20` }} />
                          <div className="w-2.5 h-2.5 rounded-full shrink-0 mr-12 transition-all duration-500 group-hover:scale-125" style={{ backgroundColor: color, boxShadow: `0 0 20px ${color}60` }} />
                        </div>

                        <div className="flex-[1.5] space-y-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <div className="md:hidden w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                              <h4 className="text-base font-bold text-zinc-200 tracking-tight">
                                {edu.degree} {edu.fieldOfStudy && <span className="text-zinc-500 font-normal">in {edu.fieldOfStudy}</span>}
                              </h4>
                            </div>
                            <p className="text-[11px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                              <span>{edu.startDate && new Date(edu.startDate).getFullYear()}</span>
                              <span className="w-4 h-px bg-zinc-800" />
                              <span>{edu.endDate && new Date(edu.endDate).getFullYear()}</span>
                            </p>
                          </div>
                          <p className="text-sm text-zinc-500 leading-relaxed max-w-lg group-hover:text-zinc-400 transition-colors">
                            {edu.description}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}
                  {education.length === 0 && <div className="p-12 border border-dashed border-white/5 rounded-[2.5rem] text-center text-zinc-600 font-medium">No education entries found.</div>}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="space-y-12 max-w-6xl mx-auto py-8">
              <div className="flex flex-col items-center justify-center mb-12 text-center relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-yellow-500/5 blur-[120px] rounded-full pointer-events-none" />

                <h2 className="text-3xl md:text-5xl font-medium tracking-tight text-white mb-6">Your Testimonials</h2>
                <button 
                  onClick={() => { setEditingTestimonial(null); setShowTestimonialModal(true); }}
                  className="px-5 py-2.5 bg-white text-black text-xs font-bold rounded-full flex items-center gap-2 shadow-xl hover:scale-105 transition-transform cursor-pointer relative z-10"
                >
                  <Plus className="w-4 h-4" /> Add Testimonial
                </button>
              </div>

              <div className={testimonials.length > 0 ? "columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6" : ""}>
                {testimonials.length === 0 && (
                  <div className="p-16 border border-dashed border-white/5 rounded-[2.5rem] text-center flex flex-col items-center justify-center min-h-[300px]">
                    <Sparkles className="w-8 h-8 text-zinc-700 mb-4" />
                    <p className="text-zinc-400 font-medium text-lg mb-2">No voices heard yet.</p>
                    <p className="text-zinc-600 text-sm max-w-sm">Use the Add Testimonial button above to let your network speak for you and build your credibility.</p>
                  </div>
                )}
                {testimonials.map(t => {
                  const isFeatured = (t as any).isFeatured;
                  return (
                    <div
                      key={t.id}
                      className={cn(
                        "break-inside-avoid relative flex flex-col rounded-[1.5rem] transition-all duration-300 group",
                        isFeatured
                          ? "bg-[#181a20] border border-[#0088ff] shadow-[0_0_40px_-5px_rgba(0,136,255,0.25)] z-10 lg:scale-[1.02]"
                          : "bg-[#13141b] border border-white/5 hover:border-white/10"
                      )}
                    >
                      <div className="p-8 flex flex-col h-full">
                        <p className={cn(
                          "leading-[1.7] font-light mb-8",
                          isFeatured ? "text-[15px] sm:text-[17px] text-white font-normal" : "text-[14px] sm:text-[15px] text-zinc-300"
                        )}>
                          "{t.content}"
                        </p>
                        <div className="flex items-center gap-4 mt-auto">
                          <img src={t.avatarUrl || ''} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                          <div className="flex flex-col leading-tight">
                            <span className={cn("font-medium", isFeatured ? "text-[15px] text-white" : "text-[14px] text-zinc-300")}>{t.name}</span>
                            <span className={cn("text-[12px] mt-0.5", isFeatured ? "text-zinc-400" : "text-zinc-500")}>{t.role}</span>
                          </div>
                          <div className="flex gap-1 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={(e) => { e.stopPropagation(); setEditingTestimonial(t); setShowTestimonialModal(true); }} className="p-1.5 hover:bg-white/10 rounded-md text-zinc-500 hover:text-white"><Pencil className="w-3.5 h-3.5" /></button>
                            <button onClick={(e) => { e.stopPropagation(); deleteTestimonial(t.id); }} className="p-1.5 hover:bg-red-500/10 rounded-md text-zinc-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      </div>

                      {isFeatured && (
                        <div className="w-full bg-[#0088ff] text-white text-center py-3.5 text-sm font-semibold rounded-b-[1.4rem] cursor-pointer hover:bg-[#0077ee] transition-colors -mt-1 relative z-10">
                          View Full Case Study
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-8 max-w-6xl mx-auto py-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">Assets</h2>
                <div className="flex items-center gap-3">
                  <Dropdown value="newest" onChange={() => { }} options={[{ label: 'Newest First', value: 'newest' }]} className="w-40 hidden md:block" />
                  <Dropdown value="grid" onChange={() => { }} options={[{ label: 'Grid View', value: 'grid' }]} className="w-36 hidden md:block" />
                  <label className="px-5 py-2.5 bg-white text-black text-xs font-bold rounded-xl flex items-center gap-2 shadow-xl hover:bg-zinc-200 transition-colors cursor-pointer relative overflow-hidden">
                    {isUploadingAsset ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploadingAsset ? 'Uploading...' : 'Upload'}
                    <input 
                      type="file" 
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                      disabled={isUploadingAsset}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsUploadingAsset(true);
                        try {
                          await uploadAsset(file);
                        } catch (err) {
                          console.error("Asset upload failed", err);
                        } finally {
                          setIsUploadingAsset(false);
                          e.target.value = '';
                        }
                      }} 
                    />
                  </label>
                </div>
              </div>

              <div className={assets.length > 0 ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5" : ""}>
                {assets.length === 0 && (
                  <div className="p-16 border border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center text-center min-h-[300px]">
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-5">
                      <FolderOpen className="w-8 h-8 text-zinc-500" />
                    </div>
                    <p className="text-zinc-300 font-medium mb-2 text-lg">Your vault is empty</p>
                    <p className="text-zinc-500 text-sm max-w-sm">Upload images, videos, audio, or documents to store them securely. They'll be organized right here.</p>
                  </div>
                )}
                {assets.map(asset => (
                  <div key={asset.id} className="group relative bg-[#18181b] border border-white/5 rounded-[1.5rem] p-3 hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:shadow-[0_0_30px_-10px_rgba(99,102,241,0.15)] transition-all cursor-pointer flex flex-col h-full">
                    <div className="w-full aspect-[4/3] bg-zinc-900/60 rounded-2xl flex items-center justify-center mb-3 group-hover:bg-indigo-500/10 transition-colors">
                      {asset.type === 'image' && <ImageIcon className="w-12 h-12 md:w-16 md:h-16 text-zinc-500 group-hover:text-indigo-400 transition-colors" />}
                      {asset.type === 'video' && <Play className="w-12 h-12 md:w-16 md:h-16 text-zinc-500 group-hover:text-indigo-400 transition-colors fill-zinc-500 group-hover:fill-indigo-400/20" />}
                      {asset.type === 'audio' && <Music className="w-12 h-12 md:w-16 md:h-16 text-zinc-500 group-hover:text-indigo-400 transition-colors" />}
                      {asset.type === 'code' && <Code2 className="w-12 h-12 md:w-16 md:h-16 text-zinc-500 group-hover:text-indigo-400 transition-colors" />}
                      {asset.type === 'archive' && <FileArchive className="w-12 h-12 md:w-16 md:h-16 text-zinc-500 group-hover:text-indigo-400 transition-colors" />}
                      {asset.type === 'doc' && <FileText className="w-12 h-12 md:w-16 md:h-16 text-zinc-500 group-hover:text-indigo-400 transition-colors" />}
                    </div>
                    <div className="flex items-center justify-between px-2 pb-1 mt-auto">
                      <p className="text-xs font-medium text-zinc-400 truncate w-[85%] group-hover:text-indigo-300 transition-colors">{asset.name}</p>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteAsset(asset.id); }}
                        className="text-zinc-500 hover:text-red-400 transition-colors p-1.5 -mr-1.5 bg-white/0 hover:bg-red-500/10 rounded-lg group/btn"
                        title="Delete Asset"
                      >
                        <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modals */}
      <Modal isOpen={showEduModal} onClose={() => setShowEduModal(false)} title={editingEdu ? 'Edit Education' : 'Add Education'}>
        <EducationForm
          initialData={editingEdu || undefined}
          onSubmit={async (data) => {
            if (editingEdu) await updateEducation(editingEdu.id, data);
            else await addEducation(data);
            setShowEduModal(false);
          }}
          onCancel={() => setShowEduModal(false)}
        />
      </Modal>

      <Modal isOpen={showExpModal} onClose={() => setShowExpModal(false)} title={editingExp ? 'Edit Experience' : 'Add Experience'}>
        <ExperienceForm
          initialData={editingExp || undefined}
          onSubmit={async (data) => {
            if (editingExp) await updateExperience(editingExp.id, data);
            else await addExperience(data);
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
              setShowProfileModal(false);
            } catch (err) {
              console.error('Failed to save profile:', err);
            } finally {
              setIsSavingProfile(false);
            }
          }}
          onCancel={() => setShowProfileModal(false)}
          isSubmitting={isSavingProfile}
        />
      </Modal>

      <Modal isOpen={showTestimonialModal} onClose={() => setShowTestimonialModal(false)} title={editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}>
        <TestimonialForm 
          initialData={editingTestimonial || undefined}
          onSubmit={async (data) => {
            if (editingTestimonial) await updateTestimonial(editingTestimonial.id, data);
            else await addTestimonial(data);
            setShowTestimonialModal(false);
          }}
          onCancel={() => setShowTestimonialModal(false)}
        />
      </Modal>

      <Modal isOpen={!!skillToDelete} onClose={() => setSkillToDelete(null)} title="Remove Skill?">
        <div className="text-center p-6 space-y-6">
          <p className="text-zinc-400">Are you sure you want to remove <span className="text-white font-bold">{skillToDelete}</span>?</p>
          <div className="flex gap-3">
            <button onClick={() => setSkillToDelete(null)} className="flex-1 py-3 bg-zinc-900 rounded-xl font-bold">Cancel</button>
            <button onClick={() => { setSkills(skills.filter(s => s !== skillToDelete)); setSkillToDelete(null); }} className="flex-1 py-3 bg-red-600 rounded-xl font-bold">Remove</button>
          </div>
        </div>
      </Modal>

      {/* Premium Success Modal */}
      {mounted && createPortal(
        <AnimatePresence>
          {showSuccessModal && (
            <div className="fixed inset-0 flex items-center justify-center p-4 z-[99999]">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowSuccessModal(false)}
                className="absolute inset-0 bg-black/90 backdrop-blur-md"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative w-full max-w-sm bg-gradient-to-b from-zinc-900 to-black border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_-12px_rgba(79,70,229,0.3)]"
              >
                {/* Animated Background Element */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />

                {/* Close Button */}
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/5 transition-all group z-[20]"
                >
                  <X className="w-4 h-4 text-zinc-500 group-hover:text-white" />
                </button>

                <div className="relative p-10 flex flex-col items-center text-center space-y-8">
                  {/* Success Icon Wrapper */}
                  <div className="relative">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 12, delay: 0.2 }}
                      className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-xl shadow-indigo-500/20 rotate-12"
                    >
                      <CheckCircle2 className="w-12 h-12 text-white -rotate-12" />
                    </motion.div>

                    {/* Decorative Sparkles */}
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-2 -right-2 p-2 bg-zinc-800 rounded-full border border-white/10"
                    >
                      <Sparkles className="w-4 h-4 text-yellow-500" />
                    </motion.div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight text-white whitespace-nowrap">
                      {successSource === 'github' ? 'GitHub Synced!' : 'Resume Imported!'}
                    </h3>
                    <div className="flex flex-col gap-1.5 mt-4">
                      <div className="flex items-center gap-2 justify-center text-sm font-medium">
                        <span className="text-zinc-500">Education added:</span>
                        <span className="text-white bg-indigo-500/20 px-2 py-0.5 rounded-md">{importedCounts.edu}</span>
                      </div>
                      <div className="flex items-center gap-2 justify-center text-sm font-medium">
                        <span className="text-zinc-500">Experience added:</span>
                        <span className="text-white bg-purple-500/20 px-2 py-0.5 rounded-md">{importedCounts.exp}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowSuccessModal(false)}
                    className="w-full py-4 bg-white text-black text-sm font-bold rounded-2xl hover:bg-zinc-200 transition-all shadow-lg active:scale-[0.98]"
                  >
                    Continue to Dashboard
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>, 
        document.body
      )}
    </div>
  );
}
