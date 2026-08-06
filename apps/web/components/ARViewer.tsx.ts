'use client';
import { useEffect, useRef } from 'react';

export default function ARViewer({ modelUrl }: { modelUrl: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && sceneRef.current) {
      // Placeholder for 8thWall integration
      console.log('Loading AR model:', modelUrl);
      sceneRef.current.innerHTML = `
        <div class="bg-gray-200 h-full flex items-center justify-center rounded-lg">
          <p class="text-gray-500">🎮 AR Preview</p>
        </div>
      `;
    }
  }, [modelUrl]);

  return (
    <div ref={sceneRef} className="w-full h-[300px] rounded-lg overflow-hidden">
      <div className="bg-gray-200 h-full flex items-center justify-center">
        <p className="text-gray-500">🔮 AR Model: {modelUrl}</p>
      </div>
    </div>
  );
}