'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/store/useStore';
import { 
  Plus, Filter, ArrowUpDown, AlertCircle, LayoutGrid, Award, 
  GraduationCap, MessageSquare, FolderOpen, Trash2, 
  Image as ImageIcon, FileText, Upload, Quote, Briefcase, Pencil
} from 'lucide-react';
import { useWindowSize } from '@/hooks/useWindowSize';
import { cn } from '@/lib/utils';

// Extracted Components
import { RepoCard } from '@/components/features/dashboard/RepoCard';
import { SkillBadge } from '@/components/features/dashboard/SkillBadge';
import { Modal } from '@/components/ui/Modal';
import { Dropdown } from '@/components/ui/Dropdown';

export type FolioTab = 'repos' | 'skills' | 'experiences' | 'education' | 'testimonials' | 'assets';

export default function FolioControlPage() {
  const repos = useStore((state) => state.repos);
  const selectedRepoIds = useStore((state) => state.selectedRepoIds);
  const toggleRepoSelection = useStore((state) => state.toggleRepoSelection);
  const skills = useStore((state) => state.skills);
  const setSkills = useStore((state) => state.setSkills);
  const repoPagination = useStore((state) => state.repoPagination);
  const fetchMoreRepos = useStore((state) => state.fetchMoreRepos);
  
  const { width } = useWindowSize();
  const isMobile = width < 1024;

  const [activeTab, setActiveTab] = useState<FolioTab>('repos');
  
  // Local state for sections
  const [experiences, setExperiences] = useState([
    { id: '1', company: 'Pitch', role: 'Director of Product', period: '2022 - Present', content: 'Leading a team of 15 designers and engineers to build the next generation of presentation software.', avatar: 'P' },
    { id: '2', company: 'Branch', role: 'Senior Product Designer', period: '2020 - 2022', content: 'Designed core features for the mobile branching platform used by millions.', avatar: 'B' }
  ]);
  const [education, setEducation] = useState([
    { id: '1', school: 'Stanford University', degree: 'MS Computer Science', year: '2020 - 2022', desc: 'Specialized in AI and Distributed Systems. Graduated with honors.' },
    { id: '2', school: 'MIT', degree: 'BS Software Engineering', year: '2016 - 2020', desc: 'Core focus on algorithms, data structures, and web technologies.' }
  ]);
  const [testimonials, setTestimonials] = useState([
    { id: '1', name: 'Sarah Chen', role: 'Product Manager @ Google', content: 'Incredible attention to detail and a absolute joy to work with.', avatar: 'SC' },
    { id: '2', name: 'Carl Sagan', role: 'Director @ NASA', content: 'Consistently do work that is both beautiful and extremely easy to use. We’re big fans!', avatar: 'CS' }
  ]);
  const [assets, setAssets] = useState([
    { id: '1', name: 'Resume_2024.pdf', type: 'pdf', url: '#' },
    { id: '2', name: 'profile_shot.jpg', type: 'image', url: '#' }
  ]);

  const [newSkill, setNewSkill] = useState('');
  const [sortBy, setSortBy] = useState<'stars' | 'name' | 'updated-desc' | 'updated-asc'>('stars');
  const [filterLang, setFilterLang] = useState<string>('All');
  const [skillToDelete, setSkillToDelete] = useState<string | null>(null);

  const [showAddEdu, setShowAddEdu] = useState(false);
  const [eduForm, setEduForm] = useState({ school: '', degree: '', year: '', desc: '' });

  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({ name: '', role: '', content: '' });

  const [showAddExp, setShowAddExp] = useState(false);
  const [expForm, setExpForm] = useState({ company: '', role: '', period: '', content: '' });

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
    if (filterLang !== 'All') result = result.filter(r => r.language === filterLang);
    result.sort((a, b) => {
      if (sortBy === 'stars') return b.stargazers_count - a.stargazers_count;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'updated-desc') return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      if (sortBy === 'updated-asc') return new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
      return 0;
    });
    return result;
  }, [repos, sortBy, filterLang]);

  const tabs = [
    { id: 'repos', label: 'Projects', icon: LayoutGrid },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'experiences', label: 'Experiences', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { id: 'assets', label: 'Assets', icon: FolderOpen }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 md:space-y-12 mb-20">
      <header className="border-b border-white/5 pb-8">
        <motion.h1 
          className="text-3xl md:text-4xl font-semibold tracking-tighter mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Folio Control
        </motion.h1>
        <motion.p 
          className="text-zinc-400 text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Curate the content that appears on your portfolio.
        </motion.p>
      </header>

      {/* Mobile: 2-row 3-col icon grid (no scroll) */}
      <div className="grid grid-cols-3 gap-2 mb-10 md:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "relative flex flex-col items-center justify-center gap-1.5 py-3 rounded-2xl text-[10px] font-bold transition-all duration-300 border",
              activeTab === tab.id
                ? "bg-zinc-800 text-white border-white/10 shadow-lg"
                : "bg-zinc-900/40 text-zinc-500 border-white/5 hover:text-zinc-300 hover:bg-zinc-800/60"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="folioActiveTabMobile"
                className="absolute inset-0 bg-zinc-800 rounded-2xl"
                transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
              />
            )}
            <tab.icon className="w-4 h-4 relative z-10" />
            <span className="relative z-10 leading-none">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Desktop: horizontal pill strip */}
      <div className="hidden md:flex p-1 bg-zinc-900/80 border border-white/5 rounded-full backdrop-blur-xl mb-12 w-fit mx-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "relative group px-6 py-2.5 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 whitespace-nowrap",
              activeTab === tab.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="folioActiveTab"
                className="absolute inset-0 bg-zinc-800 rounded-full"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <tab.icon className={cn("w-4 h-4 relative z-10 transition-colors", activeTab === tab.id ? "text-white" : "text-zinc-500 group-hover:text-zinc-300")} />
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="min-h-[400px]"
        >
          {activeTab === 'repos' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">Repositories</h2>
                <span className="text-sm text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                  {selectedRepoIds.length} Selected
                </span>
              </div>
              
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

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedRepos.map((repo, index) => (
                  <RepoCard 
                    key={repo.id}
                    repo={repo}
                    isSelected={selectedRepoIds.includes(repo.id)}
                    onToggle={() => toggleRepoSelection(repo.id)}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-8 max-w-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">Skills & Tech Stack</h2>
              </div>
              
              <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-6 md:p-8 space-y-8">
                <form onSubmit={handleAddSkill} className="relative">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill (e.g. React)"
                    className="w-full bg-zinc-950/50 border border-white/10 rounded-xl pl-4 pr-12 py-4 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                  />
                  <button
                    type="submit"
                    disabled={!newSkill.trim()}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-white text-black hover:bg-zinc-200 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </form>

                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} onDelete={() => setSkillToDelete(skill)} />
                  ))}
                  {skills.length === 0 && <p className="text-sm text-zinc-500 italic">No skills added yet.</p>}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'experiences' && (
            <div className="space-y-12 max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">Work Experiences</h2>
                <button 
                  onClick={() => setShowAddExp(true)}
                  className="px-5 py-2.5 bg-white text-black text-xs font-bold rounded-full transition-all flex items-center gap-2 shadow-xl"
                >
                  <Plus className="w-4 h-4" /> Add Experience
                </button>
              </div>

              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {experiences.map((exp) => (
                  <motion.div 
                    key={exp.id} 
                    className="break-inside-avoid p-8 bg-[#1a1a1a]/40 border border-white/5 rounded-3xl group relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between relative z-10 mb-6">
                       <div className="flex items-center gap-4">
                         <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 flex items-center justify-center text-lg font-bold text-white shadow-xl">
                           {exp.avatar}
                         </div>
                         <div>
                           <h4 className="text-base font-bold text-white tracking-tight">{exp.company}</h4>
                           <p className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">{exp.period}</p>
                         </div>
                       </div>
                       <div className="flex gap-2">
                          <button className="p-2 text-zinc-600 hover:text-white transition-all bg-white/5 rounded-lg opacity-0 group-hover:opacity-100"><Pencil className="w-4 h-4" /></button>
                          <button 
                            onClick={() => setExperiences(experiences.filter(e => e.id !== exp.id))}
                            className="p-2 text-zinc-600 hover:text-red-400 transition-all bg-white/5 rounded-lg opacity-0 group-hover:opacity-100"
                          ><Trash2 className="w-4 h-4" /></button>
                       </div>
                    </div>

                    <p className="text-xs font-bold text-indigo-400 mb-3 tracking-widest uppercase">{exp.role}</p>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium line-clamp-4">
                      {exp.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-8 max-w-4xl mx-auto px-4 relative">
              <div className="flex items-center justify-between mb-16">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">Education Roadmap</h2>
                <button 
                  onClick={() => setShowAddEdu(true)}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-full transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  <Plus className="w-4 h-4" /> Add Education
                </button>
              </div>

              {/* Vertical Timeline Line */}
              <div className="absolute left-1/2 top-32 bottom-20 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-transparent hidden md:block" />

              <div className="space-y-24 md:space-y-32">
                {education.map((edu, idx) => (
                  <div key={edu.id} className={cn(
                    "relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0",
                    idx % 2 === 1 ? "md:flex-row-reverse" : ""
                  )}>
                    {/* Timeline Node */}
                    <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-indigo-500 ring-4 ring-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-10 hidden md:block" />
                    
                    {/* Content Card */}
                    <div className="w-full md:w-[45%]">
                      <motion.div 
                        whileHover={{ y: -5 }}
                        className="p-6 bg-zinc-900/30 border border-white/5 rounded-2xl relative group overflow-hidden"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{edu.year}</span>
                          <div className="flex gap-2">
                             <button className="p-1 px-2 text-[10px] font-bold text-zinc-600 hover:text-white opacity-0 group-hover:opacity-100 transition-all border border-white/5 rounded">Edit</button>
                             <button 
                              onClick={() => setEducation(education.filter(e => e.id !== edu.id))}
                              className="p-1 px-2 text-[10px] font-bold text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all border border-white/5 rounded hover:bg-red-500/10"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                        <h4 className="text-lg font-bold text-white mb-1">{edu.school}</h4>
                        <p className="text-sm font-medium text-purple-400 mb-3">{edu.degree}</p>
                        <p className="text-xs text-zinc-500 leading-relaxed line-clamp-2 italic">{edu.desc}</p>
                      </motion.div>
                    </div>

                    <div className="w-full md:w-[45%] hidden md:block" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="space-y-12 max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">Testimonials</h2>
                <button 
                  onClick={() => setShowAddTestimonial(true)}
                  className="px-5 py-2.5 bg-white text-black text-xs font-bold rounded-full transition-all flex items-center gap-2 shadow-xl"
                >
                  <Plus className="w-4 h-4" /> Add Testimonial
                </button>
              </div>

              {/* Wall of Love Grid */}
              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {testimonials.map((t) => (
                  <motion.div 
                    key={t.id} 
                    className="break-inside-avoid p-8 bg-[#1a1a1a]/40 border border-white/5 rounded-3xl hover:border-white/10 transition-all group relative overflow-hidden"
                  >
                    <Quote className="absolute -right-4 -top-4 w-24 h-24 text-white/5 group-hover:text-white/10 transition-colors" />
                    
                    <p className="text-sm md:text-base text-zinc-300 leading-relaxed mb-8 relative z-10 font-medium">
                      “{t.content}”
                    </p>

                    <div className="flex items-center justify-between relative z-10">
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 overflow-hidden flex items-center justify-center text-xs font-bold text-white">
                           {t.avatar}
                         </div>
                         <div>
                           <p className="text-sm font-bold text-white">{t.name}</p>
                           <p className="text-xs text-zinc-500">{t.role}</p>
                         </div>
                       </div>
                       <div className="flex gap-2">
                          <button className="p-2 text-zinc-600 hover:text-white transition-all bg-white/5 rounded-lg opacity-0 group-hover:opacity-100"><Pencil className="w-4 h-4" /></button>
                          <button 
                            onClick={() => setTestimonials(testimonials.filter(item => item.id !== t.id))}
                            className="p-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all bg-white/5 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assets' && (
            <div className="space-y-8 max-w-4xl mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-medium tracking-tight">Assets</h2>
                <button className="px-5 py-2.5 bg-white text-black text-xs font-bold rounded-full transition-all flex items-center gap-2 shadow-xl">
                  <Upload className="w-4 h-4" /> Upload Asset
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {assets.map((asset) => (
                  <div key={asset.id} className="relative group aspect-square bg-[#1a1a1a]/40 border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 transition-all flex flex-col items-center justify-center p-4">
                    <div className="p-4 bg-white/5 rounded-2xl mb-3">
                      {asset.type === 'image' ? <ImageIcon className="w-8 h-8 text-indigo-400" /> : <FileText className="w-8 h-8 text-emerald-400" />}
                    </div>
                    <p className="text-[10px] font-bold text-white text-center line-clamp-1 w-full">{asset.name}</p>
                    <p className="text-[9px] text-zinc-500 mt-1 uppercase tracking-widest">{asset.type}</p>
                    
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-black/80 backdrop-blur-md translate-y-full group-hover:translate-y-0 transition-all flex gap-2">
                       <button className="flex-1 py-1 text-[9px] font-bold bg-white/10 hover:bg-white/20 text-white rounded">View</button>
                       <button 
                        onClick={() => setAssets(assets.filter(a => a.id !== asset.id))}
                        className="p-1 px-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded transition-all"
                       >
                         <Trash2 className="w-3.5 h-3.5" />
                       </button>
                    </div>
                  </div>
                ))}
                
                <button className="aspect-square border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2 text-zinc-600 hover:text-zinc-400 hover:border-white/10 transition-all">
                  <Plus className="w-6 h-6" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">New Asset</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Modals for adding items */}
      <Modal isOpen={showAddExp} onClose={() => setShowAddExp(false)} title="Add Experience">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 ml-1">Company</label>
              <input 
                type="text" value={expForm.company}
                onChange={e => setExpForm({...expForm, company: e.target.value})}
                placeholder="e.g. Google"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-zinc-400 ml-1">Period</label>
              <input 
                type="text" value={expForm.period}
                onChange={e => setExpForm({...expForm, period: e.target.value})}
                placeholder="2022 - Present"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 ml-1">Role</label>
            <input 
              type="text" value={expForm.role}
              onChange={e => setExpForm({...expForm, role: e.target.value})}
              placeholder="Senior Product Designer"
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 ml-1">What did you do?</label>
            <textarea 
              rows={3} value={expForm.content}
              onChange={e => setExpForm({...expForm, content: e.target.value})}
              placeholder="Describe your impact..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" 
            />
          </div>
          <button 
            onClick={() => {
              setExperiences([...experiences, { id: Date.now().toString(), ...expForm, avatar: expForm.company[0] }]);
              setShowAddExp(false);
              setExpForm({ company: '', role: '', period: '', content: '' });
            }}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
          >
            Add Experience
          </button>
        </div>
      </Modal>

      <Modal isOpen={showAddEdu} onClose={() => setShowAddEdu(false)} title="Add Education">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 ml-1">Institution Name</label>
            <input 
              type="text" 
              placeholder="e.g. Stanford University"
              value={eduForm.school}
              onChange={e => setEduForm({...eduForm, school: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 ml-1">Degree / Certificate</label>
            <input 
              type="text" 
              placeholder="e.g. Master of Computer Science"
              value={eduForm.degree}
              onChange={e => setEduForm({...eduForm, degree: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
            />
          </div>
          <div className="space-y-1.5">
             <label className="text-xs text-zinc-400 ml-1">Description</label>
             <textarea 
               placeholder="Briefly describe your focus..."
               rows={2}
               value={eduForm.desc}
               onChange={e => setEduForm({...eduForm, desc: e.target.value})}
               className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none" 
             />
           </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 ml-1">Year Range</label>
            <input 
              type="text" 
              placeholder="e.g. 2018 - 2022"
              value={eduForm.year}
              onChange={e => setEduForm({...eduForm, year: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
            />
          </div>
          <button 
            onClick={() => {
              setEducation([...education, { id: Date.now().toString(), ...eduForm }]);
              setShowAddEdu(false);
              setEduForm({ school: '', degree: '', year: '', desc: '' });
            }}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg"
          >
            Add Education
          </button>
        </div>
      </Modal>

      {/* Modal for adding testimonial */}
      <Modal isOpen={showAddTestimonial} onClose={() => setShowAddTestimonial(false)} title="Add Testimonial">
        <div className="space-y-4">
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
               <label className="text-xs text-zinc-400 ml-1">Name</label>
               <input 
                 type="text" 
                 placeholder="Sarah Chen"
                 value={testimonialForm.name}
                 onChange={e => setTestimonialForm({...testimonialForm, name: e.target.value})}
                 className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" 
               />
             </div>
             <div className="space-y-1.5">
               <label className="text-xs text-zinc-400 ml-1">Role/Title</label>
               <input 
                 type="text" 
                 placeholder="Product Designer"
                 value={testimonialForm.role}
                 onChange={e => setTestimonialForm({...testimonialForm, role: e.target.value})}
                 className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" 
               />
             </div>
           </div>
           <div className="space-y-1.5">
             <label className="text-xs text-zinc-400 ml-1">Testimonial Content</label>
             <textarea 
               placeholder="Write or paste the testimonial here..."
               rows={4}
               value={testimonialForm.content}
               onChange={e => setTestimonialForm({...testimonialForm, content: e.target.value})}
               className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none" 
             />
           </div>
           <button 
             onClick={() => {
               setTestimonials([...testimonials, { id: Date.now().toString(), ...testimonialForm, avatar: testimonialForm.name[0] + (testimonialForm.name.split(' ')[1]?.[0] || '') }]);
               setShowAddTestimonial(false);
               setTestimonialForm({ name: '', role: '', content: '' });
             }}
             className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg"
           >
             Add Testimonial
           </button>
        </div>
      </Modal>

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
