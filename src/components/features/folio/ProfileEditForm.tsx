'use client';

import React, { useState } from 'react';
import { Sparkles, Save, User, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';

interface ProfileEditFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function ProfileEditForm({ onSubmit, onCancel, isSubmitting }: ProfileEditFormProps) {
  const { customData, enhanceWithAI } = useStore();
  const [formData, setFormData] = useState({ ...customData });
  const [isEnhancing, setIsEnhancing] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleAI = async (field: 'bio' | 'name') => {
    setIsEnhancing(field);
    try {
      const prompt = field === 'bio' 
        ? "Professional, engaging developer bio focusing on impact and passion." 
        : "Professional full name formatting.";
      
      const currentValue = (formData as any)[field] || '';
      // We use the store's AI service but update local state directly for preview before final save
      const { aiService } = await import('@/services/ai.service');
      const response = await aiService.enhanceText(prompt, field, currentValue);
      if (response.enhancedText) {
        setFormData(prev => ({ ...prev, [field]: response.enhancedText }));
      }
    } catch (error) {
      console.error('AI enhancement failed:', error);
    } finally {
      setIsEnhancing(null);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 ml-1">Display Name</label>
            <div className="relative">
              <input 
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
              />
              <button 
                type="button"
                onClick={() => handleAI('name')}
                disabled={!!isEnhancing}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-indigo-400 transition-colors"
              >
                <Sparkles className={`w-4 h-4 ${isEnhancing === 'name' ? 'animate-pulse text-indigo-400' : ''}`} />
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 ml-1">Email Address</label>
            <input 
              type="email" 
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs text-zinc-400 ml-1">Bio / Headline</label>
            <button 
              type="button"
              onClick={() => handleAI('bio')}
              disabled={!!isEnhancing}
              className="text-[10px] uppercase font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
            >
              <Sparkles className={`w-3 h-3 ${isEnhancing === 'bio' ? 'animate-spin' : ''}`} />
              AI Polish
            </button>
          </div>
          <textarea 
            rows={4}
            value={formData.bio}
            onChange={e => setFormData({...formData, bio: e.target.value})}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 resize-none" 
            placeholder="Tell your professional story..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 ml-1">Location</label>
            <input 
              type="text" 
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 ml-1">Personal Website</label>
            <input 
              type="text" 
              value={formData.website}
              onChange={e => setFormData({...formData, website: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50" 
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 ml-1">GitHub URL</label>
            <input 
              type="text" 
              value={formData.github}
              onChange={e => setFormData({...formData, github: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 ml-1">Twitter URL</label>
            <input 
              type="text" 
              value={formData.twitter}
              onChange={e => setFormData({...formData, twitter: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50" 
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 ml-1">LinkedIn URL</label>
            <input 
              type="text" 
              value={formData.linkedin}
              onChange={e => setFormData({...formData, linkedin: e.target.value})}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500/50" 
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-xl transition-all"
        >
          Discard
        </button>
        <button 
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Profile
        </button>
      </div>
    </form>
  );
}
