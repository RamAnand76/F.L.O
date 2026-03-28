'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Briefcase, MessageSquare, Link, Star, 
  Send, CheckCircle2, ArrowLeft, Loader2, Sparkles,
  Quote, ShieldCheck
} from 'lucide-react';
import { testimonialsService } from '@/services/testimonials.service';
import { cn } from '@/lib/utils';

export default function PublicReviewPage() {
  const { username } = useParams();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    content: '',
    avatarUrl: '',
    caseStudyUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.content) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (typeof username !== 'string') throw new Error('Invalid username');
      await testimonialsService.submitPublic(username, formData);
      setIsSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 border border-emerald-500/30"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-400" />
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-white mb-4">Review Submitted!</h1>
          <p className="text-zinc-400 max-w-md mb-8 leading-relaxed">
            Thank you for sharing your feedback. Your review has been sent to <span className="text-white font-bold">@{username}</span> for approval before it goes live on their portfolio.
          </p>
          <button 
            onClick={() => router.push(`/${username}`)}
            className="px-8 py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-all shadow-xl flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" /> View Portfolio
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 selection:bg-indigo-500/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12 md:py-24">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full mb-6"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">Verified Submission</span>
          </motion.div>
          
          <motion.h1 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
          >
            Review <span className="text-indigo-400">@{username}</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg leading-relaxed"
          >
            Share your experience working with {username}. Your voucher helps them build real traction in the industry.
          </motion.p>
        </div>

        {/* Form Body */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-[#111111] border border-white/5 rounded-[2rem] p-8 md:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle Quote Icon Decor */}
          <Quote className="absolute -top-4 -right-4 w-32 h-32 text-white/[0.02] transform rotate-12 pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Your Name *</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text" 
                    required
                    placeholder="Sarah Johnson"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-black/60 transition-all font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Your Role *</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="text" 
                    required
                    placeholder="CEO @ TechFlow"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value})}
                    className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-black/60 transition-all font-medium" 
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">The Review *</label>
              <div className="relative group">
                <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                <textarea 
                  required
                  placeholder="What was it like working together? What results did they achieve?"
                  rows={5}
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-black/60 transition-all font-medium resize-none leading-relaxed" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Avatar URL (Optional)</label>
              <div className="relative group">
                <Link className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                <input 
                  type="url" 
                  placeholder="https://..."
                  value={formData.avatarUrl}
                  onChange={e => setFormData({...formData, avatarUrl: e.target.value})}
                  className="w-full bg-black/40 border border-white/5 rounded-xl pl-12 pr-4 py-4 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:bg-black/60 transition-all font-medium" 
                />
              </div>
              <p className="text-[10px] text-zinc-600 ml-1">Tip: Use your LinkedIn profile picture URL for a verified look.</p>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.role || !formData.content}
                className="w-full py-5 bg-white hover:bg-zinc-200 text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all shadow-[0_20px_40px_rgba(255,255,255,0.05)] disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Submit Review
                  </>
                )}
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-3 pt-4 py-2 opacity-40">
              <div className="h-px w-8 bg-zinc-800" />
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3" />
                <span className="text-[9px] font-black uppercase tracking-widest">Powered by F.L.O</span>
              </div>
              <div className="h-px w-8 bg-zinc-800" />
            </div>
          </form>
        </motion.div>

        {/* Footer info */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest leading-loose"
        >
          By submitting, you agree that your review will be publicly visible <br /> on {username}'s portfolio after verification.
        </motion.p>
      </div>
    </div>
  );
}
