import React from 'react';
import { motion } from 'motion/react';
import { useStore } from '@/store/useStore';
import { User, Mail, MapPin, AlignLeft, Save } from 'lucide-react';

export function Profile() {
  const githubUser = useStore((state) => state.githubUser);
  const customData = useStore((state) => state.customData);
  const updateCustomData = useStore((state) => state.updateCustomData);

  if (!githubUser) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    updateCustomData({ [name]: value });
  };

  return (
    <div className="space-y-12 max-w-3xl mx-auto">
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
            <label htmlFor="bio" className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <AlignLeft className="w-4 h-4 text-zinc-500" /> Bio / About
            </label>
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
              className="flex items-center gap-2 bg-white text-black font-medium rounded-xl px-6 py-3 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
            >
              <Save className="w-4 h-4" /> Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
