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
  it('renders tour title', () => {
    render(<TourViewer />)
    expect(screen.getByText('Demo Tour - Boulder El Mirador')).toBeInTheDocument()
  })

  it('renders three.js canvas', () => {
    render(<TourViewer />)
    expect(screen.getByTestId('three-canvas')).toBeInTheDocument()
  })

  it('renders panorama scene component', () => {
    render(<TourViewer />)
    expect(screen.getByTestId('panorama-scene')).toBeInTheDocument()
  })

  it('shows current scene info', () => {
    render(<TourViewer />)
    expect(screen.getByText('🦉 Boulder Principal')).toBeInTheDocument()
    expect(screen.getByText('Arrastra para explorar • Rueda para zoom • Click hotspots')).toBeInTheDocument()
  })

  it('shows navigation controls', () => {
    render(<TourViewer />)
    expect(screen.getByText('1 de 2')).toBeInTheDocument()
  })
})