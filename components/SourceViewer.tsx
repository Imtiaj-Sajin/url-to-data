import React from 'react';

interface SourceViewerProps {
  content: string;
}

export const SourceViewer: React.FC<SourceViewerProps> = ({ content }) => {
  return (
    <div className="relative w-full h-full bg-[#1e293b] rounded-lg border border-slate-700 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <span className="text-xs text-slate-400 font-mono">view-source</span>
      </div>
      <div className="flex-1 overflow-auto code-scroll p-4">
        {/* whitespace-pre preserves formatting, overflow-auto allows scrolling for long lines */}
        <pre className="text-sm font-mono text-slate-300 whitespace-pre tab-4">
          {content}
        </pre>
      </div>
    </div>
  );
};