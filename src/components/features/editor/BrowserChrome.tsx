import React from 'react';
import { Code, ChevronDown, Maximize2, Minimize2 } from 'lucide-react';

interface BrowserChromeProps {
  isFullscreen: boolean;
  setIsFullscreen: (val: boolean) => void;
}

export function BrowserChrome({ isFullscreen, setIsFullscreen }: BrowserChromeProps) {
  return (
    <div className="h-12 flex items-center justify-between px-4 bg-[#141414] border-b border-white/5 shrink-0">
      <button className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors border border-white/5">
        <Code className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 px-4 py-1.5 bg-[#1e1e1e] rounded-md border border-white/5 text-xs text-zinc-400 cursor-pointer hover:bg-[#252525] transition-colors">
        preview--your-portfolio.app <span className="text-zinc-600">/</span> index <ChevronDown className="w-3 h-3 ml-1" />
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Preview"}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
        <div className="w-[1px] h-4 bg-white/10 mx-1" />
        <div className="flex gap-1.5 ml-1">
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
          <div className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
        </div>
      </div>
    </div>
  );
}
