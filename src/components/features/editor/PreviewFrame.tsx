import React from 'react';
import { Monitor, Smartphone, RefreshCw, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MinimalTemplate } from '@/components/templates/MinimalTemplate';
import { DeveloperTemplate } from '@/components/templates/DeveloperTemplate';
import { CreativeTemplate } from '@/components/templates/CreativeTemplate';

interface PreviewFrameProps {
  deviceMode: 'desktop' | 'mobile';
  setDeviceMode: (mode: 'desktop' | 'mobile') => void;
  selectedTemplate: string;
  customData: any;
  onExport: () => void;
  githubUser: any;
}

export function PreviewFrame({
  deviceMode,
  setDeviceMode,
  selectedTemplate,
  customData,
  onExport,
  githubUser
}: PreviewFrameProps) {
  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0a0a0a]">
      {/* Preview Toolbar */}
      <div className="h-10 flex items-center justify-between px-4 bg-[#1a1a1a] border-b border-white/5 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-black/20 p-0.5 rounded-lg border border-white/5">
            <button 
              onClick={() => setDeviceMode('desktop')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                deviceMode === 'desktop' ? "bg-[#333] text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => setDeviceMode('mobile')}
              className={cn(
                "p-1.5 rounded-md transition-all",
                deviceMode === 'mobile' ? "bg-[#333] text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="w-[1px] h-4 bg-white/10" />
          <button className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <a 
            href={`/${githubUser?.login || 'profile'}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-medium text-zinc-400 hover:text-white transition-colors"
          >
            <ExternalLink className="w-3 h-3" /> <span className="hidden sm:inline">Open</span>
          </a>
          <button 
            onClick={onExport}
            className="px-2 sm:px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] sm:text-[11px] font-bold rounded-lg transition-all shadow-lg shadow-indigo-500/20"
          >
            Publish
          </button>
        </div>
      </div>

      {/* Actual Preview Area */}
      <div className="flex-1 overflow-hidden p-4 lg:p-8 flex justify-center bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px]">
        <div 
          className={cn(
            "bg-white shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500 ease-out overflow-hidden relative",
            deviceMode === 'desktop' ? "w-full h-full rounded-xl" : "w-[375px] h-[667px] rounded-[3rem] border-[8px] border-zinc-800"
          )}
        >
          <div className="absolute inset-0 overflow-y-auto custom-scrollbar bg-white">
            {selectedTemplate === 'minimal' && <MinimalTemplate />}
            {selectedTemplate === 'developer' && <DeveloperTemplate />}
            {selectedTemplate === 'creative' && <CreativeTemplate />}
          </div>
        </div>
      </div>
    </div>
  );
}
