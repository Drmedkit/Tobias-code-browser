
import React, { useState } from 'react';
import { CodeState, Language, ChatMessage } from './types';
import { CodeEditor } from './components/CodeEditor';
import { Preview } from './components/Preview';
import { ChatPanel } from './components/ChatPanel';
import { AssetLibrary } from './components/AssetLibrary';
import { generateTutorResponse } from './services/geminiService';
import { Code2, FileJson, FileType, Layout, Terminal, PanelLeft, PanelRight, Image as ImageIcon } from 'lucide-react';

const INITIAL_CODE: CodeState = {
  html: `<div class="game-container">
  <h1>Robo Runner</h1>
  <div id="player">
    <img src="https://robohash.org/hero-robot?set=set1&size=200x200" alt="Player" />
  </div>
  <p>Press arrow keys to move!</p>
</div>`,
  css: `body {
  font-family: 'Courier New', monospace;
  background-color: #1a1a1a;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  overflow: hidden;
}

.game-container {
  text-align: center;
  position: relative;
  width: 100%;
  height: 100%;
  background: url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=1000&q=80') center/cover;
}

h1 {
  text-shadow: 2px 2px 0 #000;
  margin-top: 2rem;
}

#player {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.1s ease;
}

#player img {
  width: 100px;
  height: 100px;
  filter: drop-shadow(0 0 10px rgba(0,255,255,0.5));
}`,
  javascript: `const player = document.getElementById('player');
let x = 50;
let y = 50;

// Simple movement logic
document.addEventListener('keydown', (e) => {
  const step = 2;
  
  if (e.key === 'ArrowUp') y -= step;
  if (e.key === 'ArrowDown') y += step;
  if (e.key === 'ArrowLeft') x -= step;
  if (e.key === 'ArrowRight') x += step;
  
  player.style.left = x + '%';
  player.style.top = y + '%';
});`
};

export default function App() {
  const [code, setCode] = useState<CodeState>(INITIAL_CODE);
  const [activeTab, setActiveTab] = useState<Language>(Language.HTML);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Layout toggles
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isPreviewOpen, setIsPreviewOpen] = useState(true);
  const [isAssetLibraryOpen, setIsAssetLibraryOpen] = useState(false);

  const handleCodeChange = (lang: Language, value: string) => {
    setCode(prev => ({ ...prev, [lang]: value }));
  };

  const handleSendMessage = async (text: string) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);
    setIsProcessing(true);

    try {
      const responseText = await generateTutorResponse(text, code);
      
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: responseText,
        timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to generate response", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-gray-100 font-sans overflow-hidden">
      {/* Top Bar */}
      <header className="h-12 border-b border-gray-800 flex items-center justify-between px-4 bg-gray-950 shrink-0 select-none">
        
        {/* Left Controls */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`p-1.5 rounded-md transition-colors ${isChatOpen ? 'bg-blue-900/30 text-blue-400' : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'}`}
            title="Toggle AI Chat"
          >
            <PanelLeft size={18} />
          </button>
          
          <div className="flex items-center gap-2 text-blue-500">
            <Terminal className="w-5 h-5" />
            <h1 className="font-bold text-base tracking-tight text-white hidden sm:block">CodeWeaver</h1>
          </div>
        </div>

        {/* Center Tabs */}
        <div className="flex items-center gap-1 bg-gray-900 p-1 rounded-lg border border-gray-800">
          <button
            onClick={() => setActiveTab(Language.HTML)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${activeTab === Language.HTML ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}
          >
            <Layout size={12} /> <span className="hidden sm:inline">HTML</span>
          </button>
          <button
            onClick={() => setActiveTab(Language.CSS)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${activeTab === Language.CSS ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}
          >
            <FileType size={12} /> <span className="hidden sm:inline">CSS</span>
          </button>
          <button
            onClick={() => setActiveTab(Language.JAVASCRIPT)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all flex items-center gap-2 ${activeTab === Language.JAVASCRIPT ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'}`}
          >
            <FileJson size={12} /> <span className="hidden sm:inline">JS</span>
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2">
           <button 
            onClick={() => setIsAssetLibraryOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium transition-colors mr-2 shadow-sm"
          >
            <ImageIcon size={14} />
            <span className="hidden sm:inline">Assets</span>
          </button>

           <button 
            onClick={() => setIsPreviewOpen(!isPreviewOpen)}
            className={`p-1.5 rounded-md transition-colors ${isPreviewOpen ? 'bg-blue-900/30 text-blue-400' : 'text-gray-400 hover:text-gray-100 hover:bg-gray-800'}`}
            title="Toggle Preview"
          >
            <PanelRight size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Flex Row */}
      <main className="flex-1 flex overflow-hidden">
        
        {/* Left Panel: Chat */}
        {isChatOpen && (
          <aside className="w-80 min-w-[250px] max-w-[400px] border-r border-gray-800 bg-gray-900 flex flex-col transition-all duration-300">
             <ChatPanel 
              messages={messages} 
              onSendMessage={handleSendMessage}
              isProcessing={isProcessing}
            />
          </aside>
        )}

        {/* Middle Panel: Code Editor */}
        <section className="flex-1 flex flex-col min-w-0 bg-gray-900 relative">
          <CodeEditor 
            code={code[activeTab]} 
            onChange={(val) => handleCodeChange(activeTab, val)} 
            language={activeTab}
            isActive={true}
          />
        </section>

        {/* Right Panel: Preview */}
        {isPreviewOpen && (
          <aside className="w-[40%] min-w-[320px] max-w-[60%] border-l border-gray-800 bg-gray-950 flex flex-col transition-all duration-300">
            <Preview code={code} />
          </aside>
        )}
      </main>

      {/* Asset Library Modal */}
      <AssetLibrary 
        isOpen={isAssetLibraryOpen} 
        onClose={() => setIsAssetLibraryOpen(false)} 
      />
    </div>
  );
}
