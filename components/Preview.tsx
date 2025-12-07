import React, { useEffect, useState, useRef } from 'react';
import { CodeState } from '../types';
import { RefreshCw } from 'lucide-react';

interface PreviewProps {
  code: CodeState;
}

export const Preview: React.FC<PreviewProps> = ({ code }) => {
  const [srcDoc, setSrcDoc] = useState('');
  const [key, setKey] = useState(0); // Used to force iframe refresh
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Debounce the preview update to avoid flashing on every keystroke
    const timeoutId = setTimeout(() => {
      const documentContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              ${code.css}
            </style>
          </head>
          <body>
            ${code.html}
            <script>
              try {
                ${code.javascript}
              } catch (err) {
                console.error(err);
                document.body.innerHTML += '<div style="color:red; background:#ffe6e6; padding:10px; margin-top:10px; border:1px solid red; border-radius:4px;">JavaScript Error: ' + err.message + '</div>';
              }
            </script>
          </body>
        </html>
      `;
      setSrcDoc(documentContent);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [code]);

  const handleRefresh = () => {
    setKey(prev => prev + 1);
  };

  return (
    <div className="w-full h-full flex flex-col bg-white">
      <div className="bg-gray-100 border-b border-gray-300 h-10 px-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 group">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400 group-hover:bg-red-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400 group-hover:bg-yellow-500"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-400 group-hover:bg-green-500"></div>
          </div>
          <span className="text-xs text-gray-500 ml-2 font-mono">localhost:3000</span>
        </div>
        <button 
          onClick={handleRefresh}
          className="p-1 hover:bg-gray-200 rounded text-gray-500 transition-colors"
          title="Refresh Preview"
        >
          <RefreshCw size={12} />
        </button>
      </div>
      <iframe
        key={key}
        ref={iframeRef}
        title="preview"
        srcDoc={srcDoc}
        className="flex-1 w-full h-full border-none bg-white"
        sandbox="allow-scripts allow-modals"
      />
    </div>
  );
};