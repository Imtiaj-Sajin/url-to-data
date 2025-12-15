import React, { useState } from 'react';
import { Search, Globe, Code, Sparkles, AlertCircle, Copy, Check } from 'lucide-react';
import { fetchUrlSource } from './services/fetchService';
import { analyzeHtmlContent } from './services/geminiService';
import { SourceViewer } from './components/SourceViewer';
import { AnalysisPanel } from './components/AnalysisPanel';
import { ViewMode, SourceAnalysis } from './types';

function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [sourceCode, setSourceCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SOURCE);
  const [analysis, setAnalysis] = useState<SourceAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setSourceCode('');
    setAnalysis(null);
    setAnalysisError(null);
    setViewMode(ViewMode.SOURCE); // Reset to source view on new fetch

    const result = await fetchUrlSource(url);

    if (result.success) {
      setSourceCode(result.content);
    } else {
      setError(result.error || 'Failed to fetch URL');
    }
    setLoading(false);
  };

  const handleAnalyze = async () => {
    if (!sourceCode) return;
    
    setAnalyzing(true);
    setAnalysisError(null);
    setViewMode(ViewMode.ANALYSIS); // Switch to analysis view automatically
    
    try {
      const result = await analyzeHtmlContent(sourceCode);
      setAnalysis(result);
    } catch (err: any) {
      setAnalysisError(err.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const copyToClipboard = () => {
    if (!sourceCode) return;
    navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0f172a] sticky top-0 z-10 backdrop-blur-md bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-500/20">
              <Code className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">SourceSleuth</h1>
          </div>
          <div className="text-sm text-slate-500 hidden sm:block">
            Powered by Gemini 2.5 & Proxy
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 flex flex-col gap-6 h-[calc(100vh-80px)]">
        
        {/* Input Section */}
        <section className="w-full">
          <form onSubmit={handleFetch} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Globe className={`w-5 h-5 transition-colors ${loading ? 'text-indigo-400 animate-pulse' : 'text-slate-500 group-focus-within:text-indigo-400'}`} />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter website URL (e.g., example.com)"
              className="w-full pl-12 pr-32 py-4 bg-slate-800/50 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-slate-500 transition-all"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Fetching...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Fetch</span>
                </>
              )}
            </button>
          </form>
          {error && (
            <div className="mt-3 flex items-start gap-2 text-red-400 bg-red-950/20 p-3 rounded-lg border border-red-900/50">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </section>

        {/* Workspace */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
          
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-900 flex items-center justify-between shrink-0">
            <div className="flex bg-slate-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode(ViewMode.SOURCE)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === ViewMode.SOURCE ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
              >
                <Code className="w-4 h-4" />
                Raw Source
              </button>
              <button
                onClick={() => setViewMode(ViewMode.ANALYSIS)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${viewMode === ViewMode.ANALYSIS ? 'bg-indigo-900/50 text-indigo-200 shadow-sm ring-1 ring-indigo-500/50' : 'text-slate-400 hover:text-white'}`}
              >
                <Sparkles className="w-4 h-4" />
                AI Analysis
              </button>
            </div>

            {sourceCode && viewMode === ViewMode.SOURCE && (
              <button
                onClick={copyToClipboard}
                className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
            )}
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-hidden relative">
            {viewMode === ViewMode.SOURCE && (
               sourceCode ? (
                 <SourceViewer content={sourceCode} />
               ) : (
                 <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <Code className="w-16 h-16 mb-4 opacity-20" />
                    <p>Enter a URL to view its source code</p>
                 </div>
               )
            )}

            {viewMode === ViewMode.ANALYSIS && (
              <div className="h-full p-6 overflow-hidden">
                 <AnalysisPanel 
                    analysis={analysis} 
                    loading={analyzing} 
                    error={analysisError} 
                    onAnalyze={handleAnalyze}
                    hasSource={!!sourceCode}
                 />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
