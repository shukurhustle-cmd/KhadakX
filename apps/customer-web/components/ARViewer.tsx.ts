'use client';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ARViewerProps {
  modelUrl: string;
  dishName: string;
  onClose?: () => void;
}

export function ARViewer({ modelUrl, dishName, onClose }: ARViewerProps) {
  const [loading, setLoading] = useState(true);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Placeholder for 8thWall/WebXR integration
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    if (sceneRef.current) {
      sceneRef.current.innerHTML = `
        <div class="flex items-center justify-center h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
          <div class="text-center text-white">
            <div class="text-6xl mb-4">🔮</div>
            <p class="text-xl font-semibold">${dishName}</p>
            <p class="text-sm opacity-80">AR Preview</p>
            <div class="mt-4 flex gap-2 justify-center">
              <span class="bg-white/20 px-3 py-1 rounded-full text-xs">🔄 Rotate</span>
              <span class="bg-white/20 px-3 py-1 rounded-full text-xs">🔍 Zoom</span>
            </div>
          </div>
        </div>
      `;
    }

    return () => clearTimeout(timer);
  }, [modelUrl, dishName]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">🔮 AR Preview</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div 
          ref={sceneRef} 
          className="w-full h-[400px] bg-gray-200"
        >
          {loading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>

        <div className="p-4 text-center text-sm text-gray-500">
          <p>Point your camera at a flat surface to see the dish in AR</p>
          <p className="mt-1 text-xs">This is a preview. Full AR available on mobile devices.</p>
        </div>
      </div>
    </motion.div>
  );
}