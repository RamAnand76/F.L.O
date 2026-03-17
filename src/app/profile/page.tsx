'use client';

import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '@/store/useStore';
import { User, Mail, MapPin, AlignLeft, Save, Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function ProfilePage() {
  const githubUser = useStore((state) => state.githubUser);
  const customData = useStore((state) => state.customData);
  const updateCustomData = useStore((state) => state.updateCustomData);
  const saveProfile = useStore((state) => state.saveProfile);
  const [isSaving, setIsSaving] = React.useState(false);
  const { toast } = useToast();

  if (!githubUser) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateCustomData({ [name]: value });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveProfile();
      toast.success('Profile saved successfully!');
    } catch (error) {
      toast.error('Failed to save profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-12 max-w-3xl">
      <header className="border-b border-white/5 pb-8 text-center">
        <motion.div 
          className="relative w-32 h-32 mx-auto mb-6"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <img 
            src={githubUser.avatar_url} 
            alt={githubUser.login} 
            className="w-full h-full object-cover rounded-full border-4 border-zinc-900 shadow-2xl"
          />
          <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/10" />
        </motion.div>
        <motion.h1 
          className="text-4xl font-semibold tracking-tighter mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Profile Settings
        </motion.h1>
        <motion.p 
          className="text-zinc-400 text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Customize the personal details shown on your portfolio.
        </motion.p>
      </header>

      <motion.div 
        className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <User className="w-4 h-4 text-zinc-500" /> Display Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={customData.name}
                onChange={handleChange}
                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-zinc-500" /> Public Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={customData.email}
                onChange={handleChange}
                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-zinc-500" /> Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={customData.location}
              onChange={handleChange}
              className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="bio" className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-zinc-500" /> Bio / About
              </label>
              <button
                type="button"
                onClick={async () => {
                  const userPrompt = window.prompt('How would you like to enhance your bio? (e.g. "Make it more professional")');
                  if (userPrompt) {
                    try {
                      await useStore.getState().enhanceWithAI('bio', userPrompt);
                      toast.success('Bio enhanced with AI!');
                    } catch (error) {
                      toast.error('AI enhancement failed. Please try again.');
                    }
                  }
                }}
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3" /> Enhance with AI
              </button>
            </div>
            <textarea
              id="bio"
              name="bio"
              value={customData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full bg-zinc-950/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none"
            />
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-white text-black font-medium rounded-xl px-6 py-3 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
