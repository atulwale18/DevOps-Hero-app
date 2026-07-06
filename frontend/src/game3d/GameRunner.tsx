import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Sky, Sparkles } from '@react-three/drei';
import Player from './Player';
import WorldBuilder from './WorldBuilder';

export default function GameRunner() {
  return (
    <div className="absolute inset-0 z-0 bg-[#0f172a]">
      <Canvas shadows camera={{ position: [0, 5, 12], fov: 60, rotation: [-0.2, 0, 0] }}>
        <Sky distance={450000} sunPosition={[0, 5, -20]} inclination={0.2} azimuth={0.25} />
        
        <ambientLight intensity={1.5} color="#ffffff" />
        <directionalLight 
          castShadow 
          position={[5, 15, 10]} 
          intensity={2.5} 
          color="#fef08a"
          shadow-mapSize={[2048, 2048]}
        />
        
        {/* Game Objects */}
        <Suspense fallback={null}>
          <Player />
          <WorldBuilder />
        </Suspense>
        
        {/* Atmosphere */}
        <fog attach="fog" args={['#0f172a', 20, 90]} />
      </Canvas>
    </div>
  );
}
