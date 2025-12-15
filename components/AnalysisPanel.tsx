import React from 'react';
import { SourceAnalysis } from '../types';
import { ShieldCheck, Layers, FileText, Activity } from 'lucide-react';

interface AnalysisPanelProps {
  analysis: SourceAnalysis | null;
  loading: boolean;
  error: string | null;
  onAnalyze: () => void;
  hasSource: boolean;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis, loading, error, onAnalyze, hasSource }) => {
  if (!hasSource) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 p-8 text-center border border-slate-800 rounded-lg bg-slate-900/50">
        <Activity className="w-12 h-12 mb-4 opacity-50" />
        <p>Fetch a URL to enable AI analysis.</p>
      </div>
    );
  }

  if (!analysis && !loading && !error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center border border-slate-800 rounded-lg bg-slate-900/50">
        <h3 className="text-xl font-bold text-white mb-2">Deep Insights</h3>
        <p className="text-slate-400 mb-6">Use Gemini AI to scan the source code for technologies, SEO meta data, and security headers.</p>
        <button
          onClick={onAnalyze}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold transition-all shadow-lg shadow-indigo-500/20"
        >
          <Activity className="w-5 h-5" />
          Analyze with Gemini
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-indigo-400 animate-pulse">Analyzing source code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/30 border border-red-900 rounded-lg text-red-200">
        <h3 className="font-bold mb-2">Analysis Failed</h3>
        <p>{error}</p>
        <button onClick={onAnalyze} className="mt-4 text-sm underline hover:text-white">Try Again</button>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto code-scroll pr-2 space-y-6">
      <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
        <div className="flex items-center gap-2 mb-3 text-indigo-400">
          <FileText className="w-5 h-5" />
          <h3 className="font-semibold uppercase tracking-wider text-sm">Page Summary</h3>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">{analysis?.title || 'No Title Detected'}</h2>
        <p className="text-slate-300 leading-relaxed">{analysis?.summary}</p>
        {analysis?.metaDescription && (
            <div className="mt-4 p-3 bg-slate-900/50 rounded border border-slate-700/50 text-sm text-slate-400 italic">
                "{analysis.metaDescription}"
            </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 mb-4 text-emerald-400">
            <Layers className="w-5 h-5" />
            <h3 className="font-semibold uppercase tracking-wider text-sm">Tech Stack</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {analysis?.techStack && analysis.techStack.length > 0 ? (
              analysis.techStack.map((tech, i) => (
                <span key={i} className="px-3 py-1 bg-emerald-950/50 text-emerald-300 border border-emerald-900 rounded-full text-xs font-medium">
                  {tech}
                </span>
              ))
            ) : (
              <span className="text-slate-500 text-sm">No specific frameworks detected.</span>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
          <div className="flex items-center gap-2 mb-4 text-amber-400">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-semibold uppercase tracking-wider text-sm">Security Info</h3>
          </div>
          <ul className="space-y-2">
            {analysis?.securityHeaders && analysis.securityHeaders.length > 0 ? (
              analysis.securityHeaders.map((header, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                   <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div>
                   {header}
                </li>
              ))
            ) : (
               <li className="text-slate-500 text-sm">No specific security headers noted.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
