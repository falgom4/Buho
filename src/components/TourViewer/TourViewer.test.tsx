import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import TourViewer from './TourViewer'

// Mock React Three Fiber Canvas component
vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="three-canvas">{children}</div>
  ),
}))

// Mock PanoramaScene component
vi.mock('./PanoramaScene', () => ({
  default: () => <div data-testid="panorama-scene">Panorama Scene</div>
}))

describe('TourViewer', () => {
  it('renders tour viewer title', () => {
    render(<TourViewer />)
    expect(screen.getByText('Tour Viewer')).toBeInTheDocument()
  })

  it('renders three.js canvas', () => {
    render(<TourViewer />)
    expect(screen.getByTestId('three-canvas')).toBeInTheDocument()
  })

  it('renders panorama scene component', () => {
    render(<TourViewer />)
    expect(screen.getByTestId('panorama-scene')).toBeInTheDocument()
  })

  it('shows instructions overlay', () => {
    render(<TourViewer />)
    expect(screen.getByText('🦉 Buho Tour Viewer')).toBeInTheDocument()
    expect(screen.getByText('Arrastra para explorar • Three.js activo')).toBeInTheDocument()
  })
})