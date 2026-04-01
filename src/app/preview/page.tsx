'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/store/useStore';
import { useWindowSize } from '@/hooks/useWindowSize';
import { 
  Code, LayoutTemplate, Palette, Github, X, Sparkles,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { deployService } from '@/services/deploy.service';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

// Components
import { EditorSidebar } from '@/components/features/editor/EditorSidebar';
import { BrowserChrome } from '@/components/features/editor/BrowserChrome';
import { PreviewFrame } from '@/components/features/editor/PreviewFrame';

export type EditorTab = 'editor' | 'templates' | 'preview';

export default function PreviewEditorPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<EditorTab>('editor');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [chatInput, setChatInput] = useState('');
  const [templateSearch, setTemplateSearch] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [repoName, setRepoName] = useState('my-portfolio-2024');
  const [customDomain, setCustomDomain] = useState('');
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  
  React.useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const selectedTemplate = useStore((state) => state.selectedTemplate);
  const setSelectedTemplate = useStore((state) => state.setSelectedTemplate);
  const githubUser = useStore((state) => state.githubUser);
  const customData = useStore((state) => state.customData);
  const updateCustomData = useStore((state) => state.updateCustomData);
  const { width } = useWindowSize();
  const isMobile = width < 768;

  const templates = [
    { id: 'minimal', actualId: 'minimal', name: 'Interstellar', desc: 'Clean, typography-focused design.', icon: LayoutTemplate, color: 'text-zinc-300', bg: 'bg-zinc-100/10' },
    { id: 'developer', actualId: 'developer', name: 'The Matrix', desc: 'Dark, monospace, code-centric vibe.', icon: Code, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { id: 'creative', actualId: 'creative', name: 'Spider-Verse', desc: 'Bold colors and bento-box layouts.', icon: Palette, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { id: 'saas', actualId: 'minimal', name: 'Manifest', desc: 'Optimized for conversions with a SaaS aesthetic.', icon: LayoutTemplate, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { id: 'brutalist', actualId: 'creative', name: 'The Flash', desc: 'Raw, unpolished, and highly structural.', icon: Palette, color: 'text-red-400', bg: 'bg-red-500/10' }
  ] as const;

  const [activeTemplateId, setActiveTemplateId] = useState<string>(
    templates.find(t => t.actualId === selectedTemplate)?.id || 'minimal'
  );

  const handleTemplateSelect = (t: any) => {
    setActiveTemplateId(t.id);
    setSelectedTemplate(t.actualId as any);
  };

  const editorContent = (
    <div className={cn(
      "h-[calc(100vh-6rem)] md:h-[calc(100vh-10rem)] w-full flex flex-col md:flex-row rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#1e1e1e] font-sans relative",
      isFullscreen && "fixed inset-0 w-screen h-screen z-[500] rounded-none border-none"
    )}>
      
      {(!isMobile || activeTab !== 'preview') && (
        <EditorSidebar 
          activeTab={activeTab as any}
          setActiveTab={setActiveTab as any}
          isCollapsed={isEditorCollapsed}
          isFullscreen={isFullscreen}
          templateSearch={templateSearch}
          setTemplateSearch={setTemplateSearch}
          templates={[...templates]}
          activeTemplateId={activeTemplateId}
          onTemplateSelect={handleTemplateSelect}
          customData={customData}
          updateCustomData={updateCustomData}
          chatInput={chatInput}
          setChatInput={setChatInput}
        />
      )}

      {/* Collapse Toggle Button (Desktop Only) */}
      {!isFullscreen && !isMobile && (
        <motion.button
          animate={{ left: isEditorCollapsed ? 0 : 320 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={() => setIsEditorCollapsed(!isEditorCollapsed)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-50 w-6 h-12 bg-[#2a2a2a] border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-all duration-300 shadow-xl",
            isEditorCollapsed && "translate-x-0 rounded-l-none"
          )}
        >
          {isEditorCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </motion.button>
      )}

      {/* Right Main Area (Preview Container) */}
      {(!isMobile || activeTab === 'preview') && (
        <div className="flex-1 flex flex-col bg-[#0a0a0a] min-w-0 relative">
          {/* Mobile Preview Tab Switcher (Only if in preview tab) */}
          {isMobile && (
             <div className="flex p-1 bg-[#141414] border-b border-white/5 w-full">
               <div className="flex p-0.5 bg-black/40 border border-white/5 rounded-full overflow-hidden w-full relative">
                 {[
                   { id: 'editor', label: 'Editor' },
                   { id: 'templates', label: 'Templates' },
                   { id: 'preview', label: 'Preview' }
                 ].map((tab) => (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={cn(
                       "relative flex-1 py-1.5 text-[10px] font-bold rounded-full transition-all duration-300", 
                       activeTab === tab.id ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                     )}
                   >
                     {activeTab === tab.id && (
                       <motion.div
                         layoutId="sidebarActiveTab"
                         className="absolute inset-0 bg-[#333] rounded-full shadow-inner"
                         transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                       />
                     )}
                     <span className="relative z-10">{tab.label}</span>
                   </button>
                 ))}
               </div>
             </div>
          )}

          <BrowserChrome 
            isFullscreen={isFullscreen}
            setIsFullscreen={setIsFullscreen}
          />
          
          <PreviewFrame 
            deviceMode={deviceMode}
            setDeviceMode={setDeviceMode}
            selectedTemplate={selectedTemplate}
            customData={customData}
            onExport={() => setShowExportModal(true)}
            githubUser={githubUser}
          />
        </div>
      )}

      {/* Modals & Overlays */}
      <AnimatePresence>
        {showExportModal && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-[#1e1e1e] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Publish Portfolio</h3>
                  <button onClick={() => setShowExportModal(false)} className="text-zinc-500 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Github className="w-5 h-5" />
                      <span className="font-bold text-sm uppercase tracking-wider">GitHub Pages</span>
                    </div>
                    <p className="text-xs text-indigo-300/70 leading-relaxed">
                      We'll create a new repository and deploy your portfolio instantly.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 ml-1">Repository Name</label>
                    <input 
                      type="text" 
                      value={repoName}
                      onChange={(e) => setRepoName(e.target.value)}
                      className="w-full bg-[#2a2a2a] border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 ml-1">Custom Domain (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="portfolio.yourname.com"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      className="w-full bg-[#2a2a2a] border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                <button 
                  disabled={isDeploying}
                  onClick={async () => {
                    setIsDeploying(true);
                    try {
                      const res = await deployService.deployToGitHubPages(repoName, customDomain);
                      setDeployedUrl(res.deployedUrl || null);
                      setShowExportModal(false);
                      setShowShareToast(true);
                      setTimeout(() => setShowShareToast(false), 8000);
                    } catch (error: any) {
                      toast.error(error.message || 'Deployment failed. Please try again.');
                    } finally {
                      setIsDeploying(false);
                    }
                  }}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isDeploying ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} 
                  {isDeploying ? 'Deploying...' : 'Deploy to GitHub'}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showShareToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[700] px-6 py-4 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Deployment Started!</h4>
              {deployedUrl ? (
                <p className="text-xs text-zinc-400">
                  Your site will be live at: <a href={deployedUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">{deployedUrl}</a>
                </p>
              ) : (
                <p className="text-xs text-zinc-400">Your site will be live in a few minutes.</p>
              )}
            </div>
            <button onClick={() => setShowShareToast(false)} className="ml-4 text-zinc-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  // Use createPortal for full screen mode if we are on client
  if (typeof document !== 'undefined' && isFullscreen) {
    return createPortal(editorContent, document.body);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {editorContent}
    </div>
  );
}
