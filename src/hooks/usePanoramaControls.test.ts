import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePanoramaControls } from './usePanoramaControls'

// Mock React Three Fiber
vi.mock('@react-three/fiber', () => ({
  useThree: () => ({
    camera: {
      lookAt: vi.fn()
    },
    gl: {
      domElement: {
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
      }
    }
  })
}))

describe('usePanoramaControls', () => {
  it('returns phi and theta values', () => {
    const { result } = renderHook(() => usePanoramaControls())
    
    expect(result.current).toHaveProperty('phi')
    expect(result.current).toHaveProperty('theta')
    expect(typeof result.current.phi).toBe('number')
    expect(typeof result.current.theta).toBe('number')
  })

  it('initializes with default values', () => {
    const { result } = renderHook(() => usePanoramaControls())
    
    expect(result.current.phi).toBe(0)
    expect(result.current.theta).toBe(0)
  })
})