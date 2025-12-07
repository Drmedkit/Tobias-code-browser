export enum Language {
  HTML = 'html',
  CSS = 'css',
  JAVASCRIPT = 'javascript'
}

export interface CodeState {
  html: string;
  css: string;
  javascript: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface AIOptions {
  codeContext: CodeState;
}