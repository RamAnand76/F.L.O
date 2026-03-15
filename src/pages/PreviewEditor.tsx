import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '@/store/useStore';
import { 
  Code, LayoutTemplate, Palette, Github, X, Sparkles,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Extracted Feature Components
import { EditorSidebar } from '@/components/features/editor/EditorSidebar';
import { BrowserChrome } from '@/components/features/editor/BrowserChrome';
import { PreviewFrame } from '@/components/features/editor/PreviewFrame';

export function PreviewEditor() {
  const [activeTab, setActiveTab] = useState<'editor' | 'templates'>('editor');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [chatInput, setChatInput] = useState('');
  const [templateSearch, setTemplateSearch] = useState('');
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [isEditorCollapsed, setIsEditorCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
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
  const customData = useStore((state) => state.customData);
  const updateCustomData = useStore((state) => state.updateCustomData);

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
      "h-[calc(100vh-10rem)] w-full flex rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#1e1e1e] font-sans relative",
      isFullscreen && "fixed inset-0 w-screen h-screen z-[500] rounded-none border-none"
    )}>
      
      <EditorSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
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

      {/* Collapse Toggle Button */}
      {!isFullscreen && (
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
      <div className="flex-1 flex flex-col bg-[#0a0a0a] min-w-0 relative">
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
        />
      </div>

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
                      defaultValue="my-portfolio-2024"
                      className="w-full bg-[#2a2a2a] border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-zinc-400 ml-1">Custom Domain (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="portfolio.yourname.com"
                      className="w-full bg-[#2a2a2a] border border-white/5 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setShowExportModal(false);
                    setShowShareToast(true);
                    setTimeout(() => setShowShareToast(false), 5000);
                  }}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Deploy to GitHub
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
              <p className="text-xs text-zinc-400">Your site will be live in a few minutes.</p>
            </div>
            <button onClick={() => setShowShareToast(false)} className="ml-4 text-zinc-500 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isFullscreen) {
    return createPortal(editorContent, document.body);
  }

  return editorContent;
}
