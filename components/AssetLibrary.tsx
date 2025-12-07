
import React, { useState } from 'react';
import { X, Copy, Image as ImageIcon, Music, Gamepad2, Check, Package } from 'lucide-react';
import { ASSETS } from '../data/assets';

interface AssetLibraryProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = 'sprites' | 'items' | 'backgrounds' | 'audio';

export const AssetLibrary: React.FC<AssetLibraryProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<Tab>('sprites');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tabs = [
    { id: 'sprites', label: 'Sprites', icon: Gamepad2 },
    { id: 'items', label: 'Items', icon: Package },
    { id: 'backgrounds', label: 'Backgrounds', icon: ImageIcon },
    { id: 'audio', label: 'Audio', icon: Music },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="h-14 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900 shrink-0">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-md">
              <ImageIcon size={18} className="text-blue-500" />
            </div>
            Game Assets Library
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-800 px-6 bg-gray-900/50 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'border-blue-500 text-blue-400' 
                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-700'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#0d1117] custom-scrollbar">
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {ASSETS[activeTab]?.map((asset: any) => (
              <div 
                key={asset.id}
                className="group relative bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden hover:border-blue-500/50 transition-all hover:shadow-lg hover:shadow-blue-500/10 flex flex-col"
              >
                {/* Preview Area */}
                <div className="aspect-square bg-[#161b22] flex items-center justify-center p-4 relative pattern-grid">
                  {asset.type === 'image' ? (
                    <img 
                      src={asset.url} 
                      alt={asset.name}
                      className={`object-contain drop-shadow-lg transition-transform group-hover:scale-110 duration-300 ${activeTab === 'sprites' ? 'w-full h-full rendering-pixelated' : 'max-w-[80%] max-h-[80%]'}`}
                      loading="lazy"
                      style={{ imageRendering: 'pixelated' }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                      <Music size={32} />
                    </div>
                  )}

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[1px]">
                     <button
                        onClick={() => handleCopy(asset.id, asset.url)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-200"
                     >
                       {copiedId === asset.id ? (
                         <>
                           <Check size={12} /> Copied!
                         </>
                       ) : (
                         <>
                           <Copy size={12} /> Copy URL
                         </>
                       )}
                     </button>
                  </div>
                </div>

                {/* Info Footer */}
                <div className="p-2.5 border-t border-gray-700/50 bg-gray-800 flex-1 flex flex-col justify-center">
                  <h3 className="text-xs font-semibold text-gray-200 truncate">{asset.name}</h3>
                  <p className="text-[10px] text-gray-500 truncate mt-0.5">{asset.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-blue-900/20 border border-blue-900/50 rounded-lg text-xs text-blue-200 flex items-start gap-3">
            <div className="p-1 bg-blue-500/20 rounded shrink-0">
               <Copy size={14} className="text-blue-400" />
            </div>
            <div>
              <p className="mb-2">Click "Copy URL" on an asset, then paste it into your code:</p>
              <div className="space-y-1 font-mono text-[10px] opacity-90">
                <div className="bg-blue-950/50 px-2 py-1 rounded border border-blue-900/30 flex justify-between">
                   <span>&lt;img src="<span className="text-yellow-300">PASTED_URL</span>" /&gt;</span>
                   <span className="text-gray-500 ml-4">// HTML Image</span>
                </div>
                <div className="bg-blue-950/50 px-2 py-1 rounded border border-blue-900/30 flex justify-between">
                   <span>background-image: url('<span className="text-yellow-300">PASTED_URL</span>');</span>
                   <span className="text-gray-500 ml-4">// CSS Background</span>
                </div>
                <div className="bg-blue-950/50 px-2 py-1 rounded border border-blue-900/30 flex justify-between">
                   <span>new Audio('<span className="text-yellow-300">PASTED_URL</span>').play();</span>
                   <span className="text-gray-500 ml-4">// JS Audio</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
