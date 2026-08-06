import React, { useState, useRef, useEffect } from 'react';
import { Hotspot } from './ImageMapper';

interface TouchLayerProps {
  imageId: string;
  hotspots: Hotspot[];
  onHotspotClick?: (hotspot: Hotspot) => void;
  onHotspotHover?: (hotspot: Hotspot | null) => void;
  children: React.ReactNode;
}

export function TouchLayer({ 
  imageId, 
  hotspots, 
  onHotspotClick, 
  onHotspotHover,
  children 
}: TouchLayerProps) {
  const [hoveredHotspot, setHoveredHotspot] = useState<Hotspot | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const hit = hotspots.find(h => 
      x >= h.x && x <= h.x + h.width &&
      y >= h.y && y <= h.y + h.height
    );

    if (hit && onHotspotClick) {
      onHotspotClick(hit);
    }
  };

  const handleHover = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const hit = hotspots.find(h => 
      x >= h.x && x <= h.x + h.width &&
      y >= h.y && y <= h.y + h.height
    );

    setHoveredHotspot(hit || null);
    if (onHotspotHover) {
      onHotspotHover(hit || null);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full"
      onClick={handleClick}
      onMouseMove={handleHover}
      onMouseLeave={() => {
        setHoveredHotspot(null);
        if (onHotspotHover) onHotspotHover(null);
      }}
    >
      {children}
      
      {/* Hotspot overlays */}
      {hotspots.map(hotspot => (
        <div
          key={hotspot.id}
          className={`absolute border-2 rounded-lg transition-all duration-200 cursor-pointer
            ${hoveredHotspot?.id === hotspot.id ? 'border-blue-500 bg-blue-100/20' : 'border-transparent hover:border-blue-300'}`}
          style={{
            left: `${hotspot.x}%`,
            top: `${hotspot.y}%`,
            width: `${hotspot.width}%`,
            height: `${hotspot.height}%`,
          }}
          title={hotspot.label}
        >
          {hoveredHotspot?.id === hotspot.id && (
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/75 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {hotspot.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}