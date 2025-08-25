import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders main title', () => {
    render(<App />)
    expect(screen.getByText('Buho Editor')).toBeInTheDocument()
  })

  it('renders subtitle', () => {
    render(<App />)
    expect(screen.getByText('Editor de Tours Virtuales con Rutas de Escalada')).toBeInTheDocument()
  })

  it('renders tour viewer section', () => {
    render(<App />)
    expect(screen.getByText('Tour Viewer')).toBeInTheDocument()
  })
})