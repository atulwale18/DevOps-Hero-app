import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Sky, Environment } from '@react-three/drei';
import Player from './Player';
import WorldBuilder from './WorldBuilder';

export default function GameRunner() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 60, rotation: [-0.3, 0, 0] }}>
        <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} azimuth={0.25} />
        <ambientLight intensity={0.5} />
        <directionalLight 
          castShadow 
          position={[10, 20, 10]} 
          intensity={1.5} 
          shadow-mapSize={[1024, 1024]}
        />
        <Environment preset="city" />
        
        {/* Game Objects */}
        <Player />
        <WorldBuilder />
        
        {/* Fog for endless depth illusion */}
        <fog attach="fog" args={['#0f172a', 30, 100]} />
      </Canvas>
    </div>
  );
}
