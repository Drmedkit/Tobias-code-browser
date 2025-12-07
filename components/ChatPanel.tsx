import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2, Wand2, Copy, Check, Terminal } from 'lucide-react';

// Access global Prism object
declare const Prism: any;

interface ChatPanelProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
}

interface CodeBlockProps {
  language: string;
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = useMemo(() => {
    if (typeof Prism === 'undefined' || !Prism.languages) return code;
    
    // Normalize language key (e.g. 'js' -> 'javascript')
    let langKey = language.toLowerCase();
    if (langKey === 'js') langKey = 'javascript';
    if (langKey === 'ts') langKey = 'javascript'; // Fallback TS to JS for now
    if (langKey === 'html') langKey = 'markup';
    
    // Default to markup if unknown
    const grammar = Prism.languages[langKey] || Prism.languages.markup;
    try {
        return Prism.highlight(code, grammar, langKey);
    } catch (e) {
        return code;
    }
  }, [code, language]);

  return (
    <div className="my-4 rounded-lg overflow-hidden border border-gray-700 bg-[#0d1117] shadow-sm group">
      <div className="flex items-center justify-between px-3 py-1.5 bg-gray-800/50 border-b border-gray-700/50">
        <div className="flex items-center gap-2">
          <Terminal size={12} className="text-gray-500" />
          <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{language || 'text'}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors px-2 py-1 rounded hover:bg-gray-700/50"
        >
          {copied ? (
            <>
              <Check size={12} className="text-green-400" />
              <span className="text-green-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="p-3 overflow-x-auto custom-scrollbar bg-[#0d1117]">
        <pre 
          className="text-sm font-mono leading-relaxed" 
          style={{ margin: 0, whiteSpace: 'pre' }}
          dangerouslySetInnerHTML={{ __html: highlightedCode }} 
        />
      </div>
    </div>
  );
};

const MessageContent = ({ content }: { content: string }) => {
  const parts = useMemo(() => {
    const regex = /```(\w+)?\s*([\s\S]*?)```/g;
    const result: { type: 'text' | 'code'; content: string; language?: string }[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        result.push({ type: 'text', content: content.slice(lastIndex, match.index) });
      }
      result.push({ 
        type: 'code', 
        language: match[1] || 'text', 
        content: match[2].trim() 
      });
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < content.length) {
      result.push({ type: 'text', content: content.slice(lastIndex) });
    }

    return result;
  }, [content]);

  return (
    <div className="text-sm leading-relaxed space-y-2">
      {parts.map((part, index) => {
        if (part.type === 'code') {
          return <CodeBlock key={index} language={part.language!} code={part.content} />;
        }
        return (
          <p key={index} className="whitespace-pre-wrap">
            {part.content}
          </p>
        );
      })}
    </div>
  );
};

export const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage, isProcessing }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isProcessing) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="h-12 px-4 border-b border-gray-800 flex items-center gap-2 bg-gray-900 shrink-0">
         <Wand2 className="w-4 h-4 text-blue-400" />
         <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">AI Tutor</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-10 px-4">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-4">
               <Bot className="w-6 h-6 text-gray-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-300 mb-2">How can I help?</h3>
            <p className="text-xs leading-relaxed">Ask me to generate code, explain concepts, or fix bugs in your project.</p>
          </div>
        )}
        
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm border border-white/5 ${
              msg.role === 'user' ? 'bg-purple-600/20 text-purple-400' : 'bg-blue-600/20 text-blue-400'
            }`}>
              {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
            </div>
            
            <div className={`flex flex-col max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`rounded-xl px-4 py-3 shadow-sm ${
                msg.role === 'user' 
                  ? 'bg-purple-600 text-white rounded-tr-sm' 
                  : 'bg-[#1e1e1e] text-gray-200 rounded-tl-sm border border-gray-800 w-full'
              }`}>
                <MessageContent content={msg.content} />
              </div>
              <span className="text-[10px] text-gray-600 px-1 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isProcessing && (
           <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0 mt-1">
               <Bot size={14} />
             </div>
             <div className="bg-[#1e1e1e] rounded-xl rounded-tl-sm px-4 py-3 border border-gray-800 flex items-center shadow-sm">
               <Loader2 className="w-3 h-3 animate-spin text-gray-400" />
               <span className="ml-2 text-xs text-gray-400">CodeWeaver is thinking...</span>
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-800 bg-gray-900 shrink-0">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a coding question..."
            className="w-full bg-gray-950 border border-gray-700 text-gray-200 rounded-lg pl-4 pr-12 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-gray-600 shadow-inner"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={!input.trim() || isProcessing}
            className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed rounded-md text-white transition-all shadow-sm"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};