import React from 'react';
import { motion } from 'motion/react';
import { 
  Code, LayoutTemplate, Palette, Search, Sparkles, 
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Type, Settings, Trash2, X, Send, Paperclip, Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';
import { useToast } from '@/components/ui/Toast';
import { useWindowSize } from '@/hooks/useWindowSize';
import { PortfolioDataProvider } from '@/context/PortfolioDataContext';

interface EditorSidebarProps {
  activeTab: 'editor' | 'templates' | 'preview';
  setActiveTab: (tab: 'editor' | 'templates' | 'preview') => void;
  isCollapsed: boolean;
  isFullscreen: boolean;
  templateSearch: string;
  setTemplateSearch: (val: string) => void;
  templates: any[];
  activeTemplateId: string;
  onTemplateSelect: (template: any) => void;
  customData: any;
  updateCustomData: (data: any) => void;
  chatInput: string;
  setChatInput: (val: string) => void;
}

export function EditorSidebar({
  activeTab,
  setActiveTab,
  isCollapsed,
  isFullscreen,
  templateSearch,
  setTemplateSearch,
  templates,
  activeTemplateId,
  onTemplateSelect,
  customData,
  updateCustomData,
  chatInput,
  setChatInput
}: EditorSidebarProps) {
  const { toast } = useToast();
  const { width } = useWindowSize();
  const isMobile = width < 768;

  return (
    <motion.div 
      className={cn(
        "shrink-0 flex flex-col bg-[#1e1e1e] border-white/5 overflow-hidden transition-all duration-300",
        isMobile ? "border-b" : "border-r"
      )}
      initial={false}
      animate={{ 
        width: isMobile ? '100%' : (isCollapsed || isFullscreen) ? 0 : 320,
        height: isMobile ? (isCollapsed || isFullscreen) ? 0 : '100%' : '100%',
        opacity: (isCollapsed || isFullscreen) ? 0 : 1
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Top Tabs */}
      <div className="flex p-1 bg-[#141414] border-b border-white/5 w-full">
        <div className="flex p-0.5 bg-black/40 border border-white/5 rounded-full overflow-hidden w-full relative">
          {[
            { id: 'editor', label: 'Editor' },
            { id: 'templates', label: 'Templates' },
            ...(isMobile ? [{ id: 'preview', label: 'Preview' }] : [])
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

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activeTab === 'editor' ? (
          <div className="p-4 space-y-6">
            {/* Content Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Content</h3>
                <button className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium">Reset</button>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={customData.name}
                    onChange={(e) => updateCustomData({ name: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400 ml-1">Role / Headline</label>
                  <input 
                    type="text" 
                    value={customData.role}
                    onChange={(e) => updateCustomData({ role: e.target.value })}
                    className="w-full bg-[#2a2a2a] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] text-zinc-400 ml-1">Bio</label>
                  <textarea 
                    value={customData.bio}
                    onChange={(e) => updateCustomData({ bio: e.target.value })}
                    rows={3}
                    className="w-full bg-[#2a2a2a] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Typography Section */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Typography</h3>
              <div className="grid grid-cols-4 gap-1">
                {[AlignLeft, AlignCenter, AlignRight, AlignJustify].map((Icon, i) => (
                  <button key={i} className="h-8 flex items-center justify-center bg-[#2a2a2a] border border-white/5 rounded-md text-zinc-400 hover:text-white hover:bg-[#333] transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </button>
                ))}
              </div>
            </div>

            {/* AI Assistant Section */}
            <div className="pt-4 border-t border-white/5">
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 space-y-3">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">AI Assistant</span>
                </div>
                <p className="text-[10px] text-indigo-300/70 leading-relaxed">
                  "Try: Make my bio sound more professional and focus on my React experience."
                </p>
                <div className="relative">
                  <input 
                    type="text"
                    placeholder="Ask AI to edit..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        try {
                          // Default to bio for now, or detect field from prompt
                          await useStore.getState().enhanceWithAI('bio', chatInput);
                          setChatInput('');
                        } catch (err) {
                          toast.error('AI enhancement failed');
                        }
                      }
                    }}
                    className="w-full bg-black/20 border border-indigo-500/30 rounded-lg pl-3 pr-8 py-2 text-xs text-white placeholder:text-indigo-300/30 focus:outline-none focus:border-indigo-500/50"
                  />
                  <button 
                    onClick={async () => {
                      try {
                        await useStore.getState().enhanceWithAI('bio', chatInput);
                        setChatInput('');
                      } catch (err) {
                        toast.error('AI enhancement failed');
                      }
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300"
                  >
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
              <input 
                type="text"
                placeholder="Search templates..."
                value={templateSearch}
                onChange={(e) => setTemplateSearch(e.target.value)}
                className="w-full bg-[#2a2a2a] border border-white/5 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onTemplateSelect(t)}
                  className={cn(
                    "group relative flex flex-col p-3 rounded-xl border transition-all duration-300 text-left",
                    activeTemplateId === t.id 
                      ? "bg-indigo-500/10 border-indigo-500/50 ring-1 ring-indigo-500/50" 
                      : "bg-[#2a2a2a] border-white/5 hover:border-white/10 hover:bg-[#333]"
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={cn("p-1.5 rounded-lg", t.bg)}>
                      <t.icon className={cn("w-4 h-4", t.color)} />
                    </div>
                    {activeTemplateId === t.id && (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
                    )}
                  </div>

                  {/* High-Fidelity Thumbnail */}
                  <div className={cn("w-full aspect-[16/9] rounded-xl mb-3 relative overflow-hidden bg-zinc-950 border border-white/5 shadow-2xl group-hover:border-white/20 transition-all", t.color)}>
                    <div className="absolute inset-0 opacity-40 group-hover:opacity-100 transition-opacity duration-700 origin-top-left w-[400%] h-[400%] text-left" style={{ transform: 'scale(0.25)' }}>
                        <PortfolioDataProvider isPlaceholder>
                          <t.component />
                        </PortfolioDataProvider>
                    </div>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors z-10" />
                    <div className="absolute inset-0 flex items-center justify-center z-20">
                      <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20 shadow-2xl transform scale-90 group-hover:scale-110 transition-all opacity-0 group-hover:opacity-100">
                         <Play className="w-4 h-4 text-white fill-current ml-1" />
                      </div>
                    </div>
                  </div>
                  
                  <h4 className="text-xs font-bold text-white mb-1">{t.name}</h4>
                  <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-2">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Chat Bar */}
      <div className="p-3 bg-[#1e1e1e] border-t border-white/5">
        <div className="flex items-center gap-2 bg-[#2a2a2a] border border-white/5 rounded-full px-3 py-1.5">
          <button className="text-zinc-500 hover:text-zinc-300">
            <Paperclip className="w-3.5 h-3.5" />
          </button>
          <input 
            type="text" 
            placeholder="Describe changes..."
            className="flex-1 bg-transparent border-none text-[11px] text-white focus:outline-none placeholder:text-zinc-600"
          />
          <div className="flex items-center gap-1.5">
            <button className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 px-1.5 py-0.5 rounded transition-colors">
              <Sparkles className="w-3.5 h-3.5" /> Edit
            </button>
          </div>
          <button className="w-7 h-7 bg-zinc-700 hover:bg-zinc-600 text-white rounded-full flex items-center justify-center transition-colors">
            <Send className="w-3.5 h-3.5 -ml-0.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
