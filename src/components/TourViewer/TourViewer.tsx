import React from 'react'

const TourViewer: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h2 className="text-xl font-semibold mb-4">Tour Viewer</h2>
      <div className="bg-gray-700 rounded-lg h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🦉</div>
          <p className="text-lg">Buho Tour Viewer</p>
          <p className="text-sm text-gray-400 mt-2">
            Aquí se mostrarán las imágenes panorámicas del tour virtual
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Three.js se integrará una vez instaladas las dependencias
          </p>
        </div>
      </div>
    </div>
  )
}

export default TourViewer