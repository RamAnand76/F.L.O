'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/store/useStore';
import { 
  Plus, Filter, ArrowUpDown, AlertCircle, LayoutGrid, Award, 
  GraduationCap, MessageSquare, FolderOpen, Trash2, 
  Image as ImageIcon, FileText, Upload, Quote, Briefcase, Pencil,
  Github, FileUp, Loader2, Sparkles, CheckCircle2
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

export type FolioTab = 'repos' | 'skills' | 'professional' | 'testimonials' | 'assets';

export default function FolioControlPage() {
  const { 
    repos, selectedRepoIds, toggleRepoSelection, skills, setSkills,
    education, experiences, fetchProfile, syncGithubProfile, importResume,
    addEducation, updateEducation, deleteEducation,
    addExperience, updateExperience, deleteExperience
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

  const [showEduModal, setShowEduModal] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  const [showExpModal, setShowExpModal] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);
  
  const [testimonials, setTestimonials] = useState([
    { id: '1', name: 'Sarah Chen', role: 'Product Designer', content: 'Outstanding work on the design system. Fast, efficient, and great eye for detail.', avatar: 'S' },
  ]);
  const [assets, setAssets] = useState([
    { id: '1', name: 'Portfolio_v1.pdf', type: 'pdf', url: '#' },
  ]);

  useEffect(() => {
    fetchProfile().finally(() => setIsLoading(false));
  }, [fetchProfile]);

  const handleSyncGithub = async () => {
    setIsSyncing(true);
    try {
      await syncGithubProfile();
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
    try {
      await importResume(file);
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsImporting(false);
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
          <motion.p className="text-zinc-400 text-base md:text-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            Curate the content that appears on your portfolio.
          </motion.p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleSyncGithub}
            disabled={isSyncing}
            className="px-5 py-2.5 bg-zinc-900 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-zinc-800 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Github className="w-4 h-4" />}
            Sync from GitHub
          </button>
          
          <label className={cn(
            "px-5 py-2.5 bg-indigo-600 rounded-xl text-xs font-bold text-white hover:bg-indigo-500 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-500/20",
            isImporting && "opacity-50 pointer-events-none"
          )}>
            {isImporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileUp className="w-4 h-4" />}
            {isImporting ? 'Processing...' : 'Upload Resume'}
            <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeUpload} />
          </label>
        </div>
      </header>

      {/* Mobile Grid Tabs */}
      <div className="grid grid-cols-3 gap-2 mb-10 md:hidden">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={cn(
              "relative flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl text-[10px] font-bold transition-all duration-300 border",
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
              "relative group px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 whitespace-nowrap text-zinc-500 hover:text-zinc-300",
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
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-8 max-w-2xl">
              <h2 className="text-xl md:text-2xl font-medium tracking-tight">Skills & Tech Stack</h2>
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
            <div className="space-y-20 max-w-5xl mx-auto">
              {/* Experience Subsection */}
              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 rounded-lg"><Briefcase className="w-5 h-5 text-indigo-400" /></div>
                    <h2 className="text-xl md:text-2xl text-white font-medium">Work Experience</h2>
                  </div>
                  <button onClick={() => { setEditingExp(null); setShowExpModal(true); }} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/5 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Experience
                  </button>
                </div>

                <div className="columns-1 md:columns-2 gap-6 space-y-6">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="break-inside-avoid p-6 bg-zinc-900/30 border border-white/5 rounded-3xl group relative hover:border-white/10 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-bold">{exp.company[0]}</div>
                          <div>
                            <h4 className="font-bold text-white leading-tight">{exp.company}</h4>
                            <p className="text-xs text-zinc-500">{exp.position}</p>
                          </div>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingExp(exp); setShowExpModal(true); }} className="p-1.5 text-zinc-500 hover:text-white"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => deleteExperience(exp.id)} className="p-1.5 text-zinc-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                        {exp.startDate && new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? 'Present' : (exp.endDate && new Date(exp.endDate).getFullYear())}
                      </p>
                      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">{exp.description}</p>
                    </div>
                  ))}
                  {experiences.length === 0 && <div className="p-8 border-2 border-dashed border-white/5 rounded-3xl text-center text-zinc-500 text-sm">No experience entries found. Sync from GitHub or add manually.</div>}
                </div>
              </section>

              {/* Education Subsection */}
              <section className="space-y-8">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg"><GraduationCap className="w-5 h-5 text-purple-400" /></div>
                    <h2 className="text-xl md:text-2xl text-white font-medium">Education</h2>
                  </div>
                  <button onClick={() => { setEditingEdu(null); setShowEduModal(true); }} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg border border-white/5 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Education
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {education.map((edu) => (
                    <div key={edu.id} className="p-6 bg-zinc-900/30 border border-white/5 rounded-3xl group relative hover:border-white/10 transition-all">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="font-bold text-white leading-tight">{edu.school}</h4>
                          <p className="text-xs text-purple-400 font-medium">{edu.degree} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => { setEditingEdu(edu); setShowEduModal(true); }} className="p-1.5 text-zinc-500 hover:text-white"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => deleteEducation(edu.id)} className="p-1.5 text-zinc-500 hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                        {edu.startDate && new Date(edu.startDate).getFullYear()} - {edu.endDate && new Date(edu.endDate).getFullYear()}
                      </p>
                      <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 italic">{edu.description}</p>
                    </div>
                  ))}
                  {education.length === 0 && <div className="p-8 border-2 border-dashed border-white/5 rounded-3xl text-center text-zinc-500 text-sm">No education entries found.</div>}
                </div>
              </section>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="space-y-12 max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">Testimonials</h2>
                <button className="px-5 py-2.5 bg-white text-black text-xs font-bold rounded-full flex items-center gap-2 shadow-xl"><Plus className="w-4 h-4" /> Add Testimonial</button>
              </div>
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {testimonials.map(t => (
                  <div key={t.id} className="break-inside-avoid p-8 bg-[#1a1a1a]/40 border border-white/5 rounded-3xl relative group">
                    <Quote className="absolute -right-4 -top-4 w-24 h-24 text-white/5" />
                    <p className="text-sm text-zinc-300 leading-relaxed mb-8 relative z-10 font-medium">“{t.content}”</p>
                    <div className="flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold text-white">{t.avatar}</div>
                        <div><p className="text-sm font-bold text-white">{t.name}</p><p className="text-xs text-zinc-500">{t.role}</p></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6"><h2 className="text-xl md:text-2xl font-medium tracking-tight">Assets</h2><button className="px-5 py-2.5 bg-white text-black text-xs font-bold rounded-full flex items-center gap-2 shadow-xl"><Upload className="w-4 h-4" /> Upload Asset</button></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {assets.map(asset => (
                  <div key={asset.id} className="aspect-square bg-[#1a1a1a]/40 border border-white/5 rounded-2xl flex flex-col items-center justify-center p-4">
                    <div className="p-4 bg-white/5 rounded-2xl mb-3">{asset.type === 'image' ? <ImageIcon className="w-6 h-6 text-indigo-400" /> : <FileText className="w-6 h-6 text-emerald-400" />}</div>
                    <p className="text-[10px] text-white text-center font-bold line-clamp-1">{asset.name}</p>
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
          onCancel={() => setShowExpModal(true)}
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
    </div>
  );
}
