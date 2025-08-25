import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock ResizeObserver que requiere @react-three/fiber
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock para TextDecoder/TextEncoder para tests de Three.js
global.TextDecoder = global.TextDecoder || class TextDecoder {
  decode() {
    return '';
  }
};

global.TextEncoder = global.TextEncoder || class TextEncoder {
  encode() {
    return new Uint8Array();
  }
};

// Mock para WebGL context que usa Three.js
HTMLCanvasElement.prototype.getContext = vi.fn(() => {
  return {
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    getImageData: vi.fn(() => ({ data: [] })),
    putImageData: vi.fn(),
    createImageData: vi.fn(() => ({ data: [] })),
    setTransform: vi.fn(),
    drawImage: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
  };
}) as any;

// Mock URL.createObjectURL para cargar texturas
global.URL.createObjectURL = vi.fn(() => 'mocked-object-url')