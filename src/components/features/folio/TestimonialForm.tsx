'use client';

import React, { useState } from 'react';
import { Testimonial } from '@/services/testimonials.service';
import { Plus, User, Briefcase, MessageSquare, Link, Star } from 'lucide-react';

interface TestimonialFormProps {
  initialData?: Testimonial;
  onSubmit: (data: Omit<Testimonial, 'id'>) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TestimonialForm({ initialData, onSubmit, onCancel, isSubmitting }: TestimonialFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    role: initialData?.role || '',
    content: initialData?.content || '',
    avatarUrl: initialData?.avatarUrl || '',
    isFeatured: initialData?.isFeatured || false,
    caseStudyUrl: initialData?.caseStudyUrl || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.content) return;
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Reviewer Name *</label>
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input 
            type="text" 
            required
            placeholder="e.g. Sarah Johnson"
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Their Role *</label>
          <div className="relative">
            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              required
              placeholder="e.g. Senior Product Designer"
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors" 
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Avatar URL</label>
          <div className="relative">
            <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input 
              type="url" 
              placeholder="https://..."
              value={formData.avatarUrl}
              onChange={e => setFormData({...formData, avatarUrl: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors" 
            />
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">The Testimonial *</label>
        <div className="relative">
          <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-zinc-500" />
          <textarea 
            required
            placeholder="Write the testimonial content here..."
            rows={4}
            value={formData.content}
            onChange={e => setFormData({...formData, content: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors resize-none" 
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Case Study URL (Optional)</label>
        <input 
          type="url" 
          placeholder="Link to a full case study or project"
          value={formData.caseStudyUrl}
          onChange={e => setFormData({...formData, caseStudyUrl: e.target.value})}
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-colors" 
        />
      </div>

      <div className="flex items-center gap-3 p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
        <button 
          type="button"
          onClick={() => setFormData({...formData, isFeatured: !formData.isFeatured})}
          className={`w-10 h-6 rounded-full transition-colors relative ${formData.isFeatured ? 'bg-blue-600' : 'bg-zinc-700'}`}
        >
          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isFeatured ? 'left-5' : 'left-1'}`} />
        </button>
        <div className="flex flex-col">
          <span className="text-xs font-bold text-white">Feature this testimonial</span>
          <span className="text-[10px] text-zinc-500">Highlighted testimonials get special styling on your portfolio.</span>
        </div>
        {formData.isFeatured && <Star className="w-4 h-4 text-blue-400 ml-auto fill-blue-400" />}
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-4 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl transition-all"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={isSubmitting || !formData.name || !formData.role || !formData.content}
          className="flex-1 py-4 bg-white text-black font-bold rounded-2xl transition-all shadow-lg disabled:opacity-50 active:scale-[0.98]"
        >
          {isSubmitting ? 'Saving...' : initialData ? 'Update' : 'Add Testimonial'}
        </button>
      </div>
    </form>
  );
}
