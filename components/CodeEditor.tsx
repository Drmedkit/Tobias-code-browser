import React, { useMemo, useState, useRef, useEffect } from 'react';
import Editor from 'react-simple-code-editor';
import { ChevronRight } from 'lucide-react';

// Access global Prism object
declare const Prism: any;

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  isActive: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language, isActive }) => {
  const [activeLine, setActiveLine] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Update active line based on cursor position
  const updateActiveLine = (e: any) => {
    const textarea = e.target as HTMLTextAreaElement;
    if (textarea && typeof textarea.selectionStart === 'number') {
      const value = textarea.value;
      const selectionStart = textarea.selectionStart;
      const linesBeforeCursor = value.substring(0, selectionStart).split('\n');
      setActiveLine(linesBeforeCursor.length - 1);
    }
  };

  if (!isActive) return null;

  // Determine Prism language key safely
  const prismLang = useMemo(() => {
    if (typeof Prism === 'undefined' || !Prism.languages) return null;
    if (language === 'html') return Prism.languages.markup;
    if (language === 'css') return Prism.languages.css;
    if (language === 'javascript') return Prism.languages.javascript;
    return Prism.languages.markup;
  }, [language]);

  const highlight = (code: string) => {
    if (!prismLang || typeof Prism === 'undefined') {
        // Fallback: simple escape to ensure text renders if Prism fails
        return code.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
    try {
        return Prism.highlight(code, prismLang, language === 'html' ? 'markup' : language);
    } catch (e) {
        console.warn("Syntax highlight error:", e);
        return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  };

  const lineCount = code.split('\n').length;
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);
  
  // Constants for layout
  const LINE_HEIGHT = 24; // 1.5rem (h-6)
  const PADDING_TOP = 16; // 1rem (py-4)

  return (
    <div 
      className="flex-1 h-full relative flex flex-col bg-[#1e1e1e] overflow-hidden group"
      ref={containerRef}
      // Capture events bubbling up from the textarea
      onClick={updateActiveLine}
      onKeyUp={updateActiveLine}
    >
      <div className="flex-1 flex overflow-auto relative custom-scrollbar font-mono text-sm">
        
        {/* Line Numbers Gutter */}
        <div 
          className="flex flex-col items-end px-3 pt-4 pb-4 bg-[#1e1e1e] border-r border-gray-800 select-none min-h-full z-20 sticky left-0 text-gray-600"
          style={{ minWidth: '3.5rem' }}
        >
          {lines.map((line, i) => (
            <div 
              key={line} 
              className={`leading-6 h-6 flex items-center justify-end w-full transition-colors duration-75 ${
                i === activeLine ? 'text-blue-400 font-bold' : ''
              }`}
            >
              {i === activeLine && (
                <ChevronRight size={10} className="mr-1 text-blue-500 animate-pulse" />
              )}
              {line}
            </div>
          ))}
        </div>

        {/* Editor Area Wrapper */}
        <div className="flex-1 relative min-h-full">
          
          {/* Active Line Highlight Background */}
          <div 
            className="absolute left-0 right-0 pointer-events-none bg-blue-500/10 border-l-2 border-blue-500 z-0 transition-all duration-75"
            style={{
              top: `${PADDING_TOP + activeLine * LINE_HEIGHT}px`,
              height: `${LINE_HEIGHT}px`,
            }}
          />

          {/* Editor */}
          <Editor
            value={code}
            onValueChange={onChange}
            highlight={highlight}
            padding={PADDING_TOP}
            className="font-mono min-h-full tracking-wide relative z-10"
            style={{
              fontFamily: '"Fira Code", "Fira Mono", monospace',
              fontSize: 14,
              backgroundColor: 'transparent',
              minHeight: '100%',
              lineHeight: '1.5rem',
              whiteSpace: 'pre', // Forces no-wrap to keep line numbers aligned
            }}
            textareaClassName="focus:outline-none selection:bg-blue-500/30"
          />

          {/* Empty State / Paste Hint */}
          {code.trim().length === 0 && (
            <div className="absolute top-20 left-10 pointer-events-none text-gray-600 select-none flex flex-col gap-2">
               <p className="flex items-center gap-2 text-sm font-medium">
                 <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                 Start coding here...
               </p>
               <p className="text-xs text-gray-700 max-w-[200px] leading-relaxed">
                 Type manually or copy snippets from the AI tutor and paste them (Ctrl+V).
               </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Language Badge */}
      <div className="absolute top-2 right-6 text-[10px] font-bold text-gray-500 pointer-events-none uppercase tracking-wider bg-[#1e1e1e]/90 px-2 py-0.5 rounded border border-gray-700/50 z-30 backdrop-blur-sm shadow-sm">
        {language}
      </div>
    </div>
  );
};