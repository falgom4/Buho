import React from 'react'
import TourViewer from './components/TourViewer/TourViewer'

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <header className="bg-gray-800 p-4">
        <h1 className="text-white text-2xl font-bold">Buho Editor</h1>
        <p className="text-gray-300">Editor de Tours Virtuales con Rutas de Escalada</p>
      </header>
      
      <main className="container mx-auto p-4">
        <TourViewer />
      </main>
    </div>
  )
}

export default App