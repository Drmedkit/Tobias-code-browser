import React, { useMemo, useState, useRef, useEffect, useCallback } from 'react';
import Editor from 'react-simple-code-editor';
import { ChevronRight, AlertCircle, AlertTriangle } from 'lucide-react';

// Access global objects
declare const Prism: any;
declare const acorn: any;
declare const HTMLHint: any;

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  isActive: boolean;
}

interface ValidationError {
  line: number;
  column?: number;
  message: string;
  severity: 'error' | 'warning';
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, onChange, language, isActive }) => {
  const [activeLine, setActiveLine] = useState(0);
  const [errors, setErrors] = useState<ValidationError[]>([]);
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

  const validateCode = useCallback((source: string, lang: string) => {
    const foundErrors: ValidationError[] = [];

    if (lang === 'javascript' && typeof acorn !== 'undefined') {
      try {
        acorn.parse(source, { ecmaVersion: 2020 });
      } catch (err: any) {
        if (err.loc) {
          foundErrors.push({
            line: err.loc.line,
            column: err.loc.column,
            message: err.message.replace(/\s\(\d+:\d+\)/, ''), // Remove (line:col) suffix if present
            severity: 'error'
          });
        }
      }
    } else if (lang === 'html' && typeof HTMLHint !== 'undefined') {
      const hints = HTMLHint.verify(source, {
        "tag-pair": true,
        "tagname-lowercase": true,
        "attr-lowercase": true,
        "attr-value-double-quotes": true,
        "id-unique": true,
        "spec-char-escape": true
      });
      hints.forEach((hint: any) => {
        foundErrors.push({
          line: hint.line,
          column: hint.col,
          message: hint.message,
          severity: hint.type === 'error' ? 'error' : 'warning'
        });
      });
    } else if (lang === 'css') {
      // Basic balanced brace check for CSS
      const openBraces = (source.match(/{/g) || []).length;
      const closeBraces = (source.match(/}/g) || []).length;
      if (openBraces !== closeBraces) {
        foundErrors.push({
          line: source.split('\n').length, // Just flag the end of file roughly
          message: openBraces > closeBraces ? "Missing closing brace '}'" : "Unexpected closing brace '}'",
          severity: 'error'
        });
      }
    }

    setErrors(foundErrors);
  }, []);

  // Debounced validation
  useEffect(() => {
    if (!isActive) return;
    const timer = setTimeout(() => validateCode(code, language), 800);
    return () => clearTimeout(timer);
  }, [code, language, isActive, validateCode]);

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
    let result = code;
    if (prismLang) {
       try {
         result = Prism.highlight(code, prismLang, language === 'html' ? 'markup' : language);
       } catch (e) {
         console.warn("Prism Error", e);
       }
    }
    // Fallback escape
    if (result === code) {
       result = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
    return result;
  };

  const lineCount = code.split('\n').length;
  const lines = Array.from({ length: lineCount }, (_, i) => i + 1);
  
  const LINE_HEIGHT = 24; // 1.5rem
  const PADDING_TOP = 16; // 1rem

  // Group errors by line for easier lookup
  const errorsByLine = errors.reduce((acc, err) => {
    acc[err.line] = err;
    return acc;
  }, {} as Record<number, ValidationError>);

  const activeError = errorsByLine[activeLine + 1];

  return (
    <div 
      className="flex-1 h-full relative flex flex-col bg-[#1e1e1e] overflow-hidden group"
      ref={containerRef}
      onClick={updateActiveLine}
      onKeyUp={updateActiveLine}
    >
      <div className="flex-1 flex overflow-auto relative custom-scrollbar font-mono text-sm">
        
        {/* Line Numbers Gutter */}
        <div 
          className="flex flex-col items-end px-3 pt-4 pb-4 bg-[#1e1e1e] border-r border-gray-800 select-none min-h-full z-20 sticky left-0 text-gray-600"
          style={{ minWidth: '3.5rem' }}
        >
          {lines.map((line, i) => {
            const hasError = !!errorsByLine[line];
            return (
              <div 
                key={line} 
                className={`leading-6 h-6 flex items-center justify-end w-full transition-colors duration-75 relative ${
                  hasError ? 'text-red-400 font-bold' : (i === activeLine ? 'text-blue-400 font-bold' : '')
                }`}
              >
                {hasError && (
                  <AlertCircle size={10} className="absolute left-0 top-1.5 text-red-500" />
                )}
                {i === activeLine && !hasError && (
                  <ChevronRight size={10} className="mr-1 text-blue-500 animate-pulse" />
                )}
                {line}
              </div>
            );
          })}
        </div>

        {/* Editor Area Wrapper */}
        <div className="flex-1 relative min-h-full">
          
          {/* Active Line Highlight Background */}
          <div 
            className="absolute left-0 right-0 pointer-events-none bg-blue-500/5 border-l-2 border-blue-500/50 z-0 transition-all duration-75"
            style={{
              top: `${PADDING_TOP + activeLine * LINE_HEIGHT}px`,
              height: `${LINE_HEIGHT}px`,
            }}
          />

          {/* Error Line Highlights */}
          {errors.map((err, idx) => (
             <div 
              key={idx}
              className="absolute left-0 right-0 pointer-events-none bg-red-500/20 z-0"
              style={{
                top: `${PADDING_TOP + (err.line - 1) * LINE_HEIGHT}px`,
                height: `${LINE_HEIGHT}px`,
              }}
           />
          ))}

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
              whiteSpace: 'pre',
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
      
      {/* Footer / Error Panel */}
      <div className="bg-[#1e1e1e] border-t border-gray-800 shrink-0">
         {/* Language Badge */}
         <div className="flex justify-between items-center px-4 py-1 text-[10px] text-gray-500 bg-[#191919]">
            <span className="uppercase tracking-wider font-bold">{language}</span>
            <span>{code.length} chars</span>
         </div>
         
         {/* Error Message */}
         {activeError && (
           <div className="px-4 py-2 bg-red-900/20 border-t border-red-900/50 flex items-start gap-2 text-red-200 animate-in slide-in-from-bottom-2">
              <AlertTriangle size={14} className="mt-0.5 shrink-0 text-red-400" />
              <div className="text-xs">
                 <span className="font-bold">Line {activeError.line}:</span> {activeError.message}
              </div>
           </div>
         )}
         {errors.length > 0 && !activeError && (
           <div className="px-4 py-1.5 bg-red-900/10 border-t border-red-900/30 flex items-center gap-2 text-red-300/80 text-xs">
             <AlertCircle size={12} />
             <span>{errors.length} issue{errors.length > 1 ? 's' : ''} detected. Click the red line to see details.</span>
           </div>
         )}
      </div>
    </div>
  );
};