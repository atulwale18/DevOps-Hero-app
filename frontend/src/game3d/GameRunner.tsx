import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Sparkles } from '@react-three/drei';
import Player from './Player';
import WorldBuilder from './WorldBuilder';

export default function GameRunner() {
  return (
    <div className="absolute inset-0 z-0 bg-[#050510]">
      <Canvas shadows camera={{ position: [0, 5, 12], fov: 60, rotation: [-0.2, 0, 0] }}>
        <ambientLight intensity={0.5} color="#4c1d95" />
        <directionalLight 
          castShadow 
          position={[5, 10, 15]} 
          intensity={3} 
          color="#60a5fa"
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[0, 2, -20]} intensity={5} color="#ec4899" distance={50} />
        
        {/* Game Objects */}
        <Suspense fallback={null}>
          <Player />
          <WorldBuilder />
        </Suspense>
        
        {/* Atmosphere */}
        <Sparkles count={200} scale={20} size={2} speed={0.4} opacity={0.2} color="#60a5fa" />
        <fog attach="fog" args={['#050510', 20, 80]} />
      </Canvas>
    </div>
  );
}
