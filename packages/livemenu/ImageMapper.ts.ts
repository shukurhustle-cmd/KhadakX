export interface Hotspot {
  id: string;
  x: number;      // Percentage (0-100)
  y: number;      // Percentage (0-100)
  width: number;  // Percentage (0-100)
  height: number; // Percentage (0-100)
  label: string;
  itemId: string;
  type: 'dish' | 'category' | 'info';
}

export interface MenuImage {
  id: string;
  url: string;
  hotspots: Hotspot[];
  categories: string[];
}

export class ImageMapper {
  private images: Map<string, MenuImage> = new Map();

  registerImage(image: MenuImage): void {
    this.images.set(image.id, image);
  }

  getImage(id: string): MenuImage | undefined {
    return this.images.get(id);
  }

  getAllImages(): MenuImage[] {
    return Array.from(this.images.values());
  }

  getHotspotsForImage(imageId: string): Hotspot[] {
    const image = this.images.get(imageId);
    return image?.hotspots || [];
  }

  getHotspotAtPosition(imageId: string, x: number, y: number): Hotspot | null {
    const image = this.images.get(imageId);
    if (!image) return null;

    for (const hotspot of image.hotspots) {
      const { x: hx, y: hy, width: hw, height: hh } = hotspot;
      if (x >= hx && x <= hx + hw && y >= hy && y <= hy + hh) {
        return hotspot;
      }
    }
    return null;
  }
}