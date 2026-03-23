'use client';

import React, { useState } from 'react';
import { Education } from '@/services/profile.service';

interface EducationFormProps {
  initialData?: Education;
  onSubmit: (data: Omit<Education, 'id'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function EducationForm({ initialData, onSubmit, onCancel, isSubmitting }: EducationFormProps) {
  const [formData, setFormData] = useState({
    school: initialData?.school || '',
    degree: initialData?.degree || '',
    fieldOfStudy: initialData?.fieldOfStudy || '',
    startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    description: initialData?.description || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.school) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs text-zinc-400 ml-1">Institution Name *</label>
        <input 
          type="text" 
          required
          placeholder="e.g. Stanford University"
          value={formData.school}
          onChange={e => setFormData({...formData, school: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 ml-1">Degree</label>
          <input 
            type="text" 
            placeholder="e.g. Master's"
            value={formData.degree}
            onChange={e => setFormData({...formData, degree: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 ml-1">Field of Study</label>
          <input 
            type="text" 
            placeholder="e.g. Computer Science"
            value={formData.fieldOfStudy}
            onChange={e => setFormData({...formData, fieldOfStudy: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 ml-1">Start Date</label>
          <input 
            type="date" 
            value={formData.startDate}
            onChange={e => setFormData({...formData, startDate: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 ml-1">End Date</label>
          <input 
            type="date" 
            value={formData.endDate}
            onChange={e => setFormData({...formData, endDate: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs text-zinc-400 ml-1">Description</label>
        <textarea 
          placeholder="Briefly describe your focus, relevant coursework, etc."
          rows={3}
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none resize-none" 
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
          disabled={isSubmitting || !formData.school}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
}
