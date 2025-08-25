import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import PanoramaScene from './PanoramaScene'

const TourViewer: React.FC = () => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h2 className="text-xl font-semibold mb-4">Tour Viewer</h2>
      <div className="bg-gray-700 rounded-lg h-96 overflow-hidden relative">
        <Canvas
          camera={{
            fov: 75,
            near: 0.1,
            far: 1000,
            position: [0, 0, 0]
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={
            <mesh>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color="gray" />
            </mesh>
          }>
            <PanoramaScene />
          </Suspense>
          <ambientLight intensity={1} />
        </Canvas>
        
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded px-3 py-2 text-sm">
          <div className="text-white">🦉 Buho Tour Viewer</div>
          <div className="text-gray-300 text-xs">
            Arrastra para explorar • Three.js activo
          </div>
        </div>
      </div>
    </div>
  )
}

export default TourViewer