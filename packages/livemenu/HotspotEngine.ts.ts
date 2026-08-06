import { Hotspot } from './ImageMapper';

export interface HotspotInteraction {
  type: 'click' | 'hover' | 'tap';
  hotspot: Hotspot;
  event: Event;
}

export class HotspotEngine {
  private listeners: Map<string, ((interaction: HotspotInteraction) => void)[]> = new Map();

  addEventListener(type: 'click' | 'hover' | 'tap', callback: (interaction: HotspotInteraction) => void): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(callback);
  }

  removeEventListener(type: 'click' | 'hover' | 'tap', callback: (interaction: HotspotInteraction) => void): void {
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  triggerInteraction(type: 'click' | 'hover' | 'tap', hotspot: Hotspot, event: Event): void {
    const callbacks = this.listeners.get(type);
    if (callbacks) {
      const interaction: HotspotInteraction = { type, hotspot, event };
      callbacks.forEach(cb => cb(interaction));
    }
  }

  processEvent(event: MouseEvent | TouchEvent, imageId: string, hotspots: Hotspot[]): Hotspot | null {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = ((event.clientX || 0) - rect.left) / rect.width * 100;
    const y = ((event.clientY || 0) - rect.top) / rect.height * 100;

    for (const hotspot of hotspots) {
      if (x >= hotspot.x && x <= hotspot.x + hotspot.width &&
          y >= hotspot.y && y <= hotspot.y + hotspot.height) {
        return hotspot;
      }
    }
    return null;
  }
}