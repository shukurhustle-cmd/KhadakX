'use client';

import { useEffect, useRef } from 'react';

export default function ARViewer({ modelUrl }: { modelUrl: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sceneRef.current) {
      console.log('Loading AR model:', modelUrl);
    }
  }, [modelUrl]);

  return (
    <div ref={sceneRef} className="w-full h-[300px] rounded-lg overflow-hidden">
      <div className="bg-gray-200 h-full flex items-center justify-center rounded-lg">
        <p className="text-gray-500">🔮 AR Model: {modelUrl}</p>
      </div>
    </div>
  );
}
