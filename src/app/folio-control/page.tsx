'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/store/useStore';
import { Plus, Filter, ArrowUpDown, AlertCircle } from 'lucide-react';

// Extracted Components
import { RepoCard } from '@/components/features/dashboard/RepoCard';
import { SkillBadge } from '@/components/features/dashboard/SkillBadge';
import { Modal } from '@/components/ui/Modal';
import { Dropdown } from '@/components/ui/Dropdown';

export default function FolioControlPage() {
  const repos = useStore((state) => state.repos);
  const selectedRepoIds = useStore((state) => state.selectedRepoIds);
  const toggleRepoSelection = useStore((state) => state.toggleRepoSelection);
  const skills = useStore((state) => state.skills);
  const setSkills = useStore((state) => state.setSkills);
  const repoPagination = useStore((state) => state.repoPagination);
  const fetchMoreRepos = useStore((state) => state.fetchMoreRepos);
  
  const [newSkill, setNewSkill] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'name' | 'updated-desc' | 'updated-asc'>('stars');
  const [filterLang, setFilterLang] = useState<string>('All');
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
    setSkillToDelete(null);
  };

  const languages = useMemo(() => {
    const langs = new Set(repos.map(r => r.language).filter(Boolean));
    return ['All', ...Array.from(langs)] as string[];
  }, [repos]);

  const sortOptions = [
    { label: 'Sort by Stars', value: 'stars' },
    { label: 'Sort by Name', value: 'name' },
    { label: 'Last updated (newest first)', value: 'updated-desc' },
    { label: 'Last updated (oldest first)', value: 'updated-asc' },
  ];

  const langOptions = languages.map(lang => ({ label: lang, value: lang }));

  const filteredAndSortedRepos = useMemo(() => {
    let result = [...repos];
    
    if (filterLang !== 'All') {
      result = result.filter(r => r.language === filterLang);
    }
    
    result.sort((a, b) => {
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'updated-desc') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (sortBy === 'updated-asc') return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      return 0;
    });
    
    return result;
  }, [repos, sortBy, filterLang]);

  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      <header className="border-b border-white/5 pb-8">
        <motion.h1 
          className="text-4xl font-semibold tracking-tighter mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Folio Control
        </motion.h1>
        <motion.p 
          className="text-zinc-400 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Curate the content that appears on your portfolio.
        </motion.p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-medium tracking-tight">Repositories</h2>
              <span className="text-sm text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                {selectedRepoIds.length} Selected
              </span>
            </div>

            <AnimatePresence>
              {selectedRepoIds.length > 6 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-200/90 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0 text-amber-500" />
                    <p>You have selected {selectedRepoIds.length} repositories. Only the first 6 will be displayed on your portfolio.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Dropdown
                value={sortBy}
                onChange={(val) => setSortBy(val as any)}
                options={sortOptions}
                icon={<ArrowUpDown className="w-4 h-4" />}
                className="w-full sm:w-64"
              />
              
              <Dropdown
                value={filterLang}
                onChange={setFilterLang}
                options={langOptions}
                icon={<Filter className="w-4 h-4" />}
                className="w-full sm:w-48"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredAndSortedRepos.map((repo, index) => (
                  <RepoCard 
                    key={repo.id}
                    repo={repo}
                    isSelected={selectedRepoIds.includes(repo.id)}
                    onToggle={() => toggleRepoSelection(repo.id)}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>
            
            {((repoPagination && repoPagination.currentPage < repoPagination.totalPages) || repos.length >= (repoPagination?.currentPage || 1) * (repoPagination?.itemsPerPage || 10)) && (
              <motion.div 
                className="mt-8 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <button
                  onClick={() => fetchMoreRepos((repoPagination?.currentPage || 1) + 1)}
                  className="px-6 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-sm font-medium text-white rounded-full transition-all flex items-center gap-2 group shadow-xl"
                >
                  <ArrowUpDown className="w-4 h-4 text-zinc-400 group-hover:text-white transition-colors" />
                  Load More Projects
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>

        <div className="space-y-8">
          <motion.div 
            className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 backdrop-blur-sm sticky top-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-xl font-medium tracking-tight mb-6">Skills & Tech Stack</h2>
            
            <form onSubmit={handleAddSkill} className="mb-6 relative">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Add a skill (e.g. React)"
                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
              <button
                type="submit"
                disabled={!newSkill.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {skills.map((skill) => (
                  <SkillBadge 
                    key={skill}
                    skill={skill}
                    onDelete={() => setSkillToDelete(skill)}
                  />
                ))}
              </AnimatePresence>
              {skills.length === 0 && (
                <p className="text-sm text-zinc-500 italic">No skills added yet.</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Skill Removal Confirmation Modal */}
      <Modal
        isOpen={!!skillToDelete}
        onClose={() => setSkillToDelete(null)}
        title="Remove Skill?"
        maxWidth="max-w-sm"
        zIndex={200}
      >
        <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Are you sure you want to remove <span className="text-white font-semibold">"{skillToDelete}"</span> from your skills?
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => setSkillToDelete(null)}
            className="flex-1 px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => skillToDelete && handleRemoveSkill(skillToDelete)}
            className="flex-1 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold transition-all shadow-lg shadow-red-500/20"
          >
            Remove
          </button>
        </div>
      </Modal>
    </div>
  );
}
