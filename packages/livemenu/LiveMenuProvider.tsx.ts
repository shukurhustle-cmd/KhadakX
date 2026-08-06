import React, { createContext, useContext, useState } from 'react';
import { ImageMapper, MenuImage } from './ImageMapper';
import { HotspotEngine } from './HotspotEngine';

interface LiveMenuContextType {
  imageMapper: ImageMapper;
  hotspotEngine: HotspotEngine;
  currentImage: MenuImage | null;
  setCurrentImage: (image: MenuImage | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LiveMenuContext = createContext<LiveMenuContextType | undefined>(undefined);

export function LiveMenuProvider({ children }: { children: React.ReactNode }) {
  const [imageMapper] = useState(() => new ImageMapper());
  const [hotspotEngine] = useState(() => new HotspotEngine());
  const [currentImage, setCurrentImage] = useState<MenuImage | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <LiveMenuContext.Provider value={{
      imageMapper,
      hotspotEngine,
      currentImage,
      setCurrentImage,
      loading,
      setLoading,
    }}>
      {children}
    </LiveMenuContext.Provider>
  );
}

export function useLiveMenu() {
  const context = useContext(LiveMenuContext);
  if (!context) {
    throw new Error('useLiveMenu must be used within a LiveMenuProvider');
  }
  return context;
}