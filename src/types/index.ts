export interface Tour {
  id: string;
  title: string;
  description: string;
  scenes: Scene[];
  created: string;
  version: string;
}

export interface Scene {
  id: string;
  name: string;
  panoramaUrl: string;
  hotspots: Hotspot[];
  routes: Route[];
}

export interface Hotspot {
  id: string;
  type: 'navigation' | 'info' | 'route';
  position: Position3D;
  title: string;
  content?: string;
  target?: string;
  icon: string;
}

export interface Route {
  id: string;
  name: string;
  difficulty: string;
  color: string;
  strokeWidth: number;
  points: Position2D[];
  type: 'boulder' | 'route' | 'traverse';
  description?: string;
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface Position2D {
  x: number;
  y: number;
}

export interface TourManifest {
  id: string;
  title: string;
  description: string;
  version: string;
  created: string;
  scenes: string[];
  totalSize: number;
  offline: OfflineConfig;
}

export interface OfflineConfig {
  downloadable: boolean;
  priority: 'high' | 'medium' | 'low';
  cacheDuration: number;
}