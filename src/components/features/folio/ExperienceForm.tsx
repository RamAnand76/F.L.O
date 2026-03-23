'use client';

import React, { useState } from 'react';
import { Experience } from '@/services/profile.service';

interface ExperienceFormProps {
  initialData?: Experience;
  onSubmit: (data: Omit<Experience, 'id'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ExperienceForm({ initialData, onSubmit, onCancel, isSubmitting }: ExperienceFormProps) {
  const [formData, setFormData] = useState({
    company: initialData?.company || '',
    position: initialData?.position || '',
    location: initialData?.location || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    description: initialData?.description || '',
    isCurrent: initialData?.isCurrent || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.position) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 ml-1">Company *</label>
          <input 
            type="text" required
            placeholder="e.g. Google"
            value={formData.company}
            onChange={e => setFormData({...formData, company: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 ml-1">Position *</label>
          <input 
            type="text" required
            placeholder="e.g. Senior Software Engineer"
            value={formData.position}
            onChange={e => setFormData({...formData, position: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-zinc-400 ml-1">Location</label>
        <input 
          type="text"
          placeholder="e.g. Mountain View, CA or Remote"
          value={formData.location}
          onChange={e => setFormData({...formData, location: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 ml-1">Start Date</label>
          <input 
            type="date"
            value={formData.startDate}
            onChange={e => setFormData({...formData, startDate: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 ml-1">End Date</label>
          <input 
            type="date"
            disabled={formData.isCurrent}
            value={formData.endDate}
            onChange={e => setFormData({...formData, endDate: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none disabled:opacity-50" 
          />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer group w-fit">
        <input 
          type="checkbox"
          checked={formData.isCurrent}
          onChange={e => setFormData({...formData, isCurrent: e.target.checked, endDate: e.target.checked ? '' : formData.endDate})}
          className="w-4 h-4 rounded border-zinc-800 bg-zinc-950 text-indigo-600 focus:ring-indigo-500/50"
        />
        <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">I am currently working in this role</span>
      </label>

      <div className="space-y-1.5">
        <label className="text-xs text-zinc-400 ml-1">Description</label>
        <textarea 
          placeholder="Describe your impact, technologies used, etc."
          rows={3}
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none" 
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={isSubmitting || !formData.company || !formData.position}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}
