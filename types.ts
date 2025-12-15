export interface SourceAnalysis {
  title: string;
  metaDescription: string;
  techStack: string[];
  summary: string;
  securityHeaders: string[];
}

export interface FetchResult {
  url: string;
  content: string;
  success: boolean;
  error?: string;
}

export enum ViewMode {
  SOURCE = 'SOURCE',
  ANALYSIS = 'ANALYSIS'
}
