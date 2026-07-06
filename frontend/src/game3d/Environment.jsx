import React from 'react';
import { Grid, Stars, Sparkles, Float } from '@react-three/drei';

export default function Environment() {
  return (
    <>
      <color attach="background" args={['#0a0a1a']} />
      <ambientLight intensity={0.8} />
      <directionalLight 
        position={[10, 20, 10]} 
        intensity={2} 
        castShadow 
      />
      <pointLight position={[0, 5, 0]} intensity={1} color="#4f46e5" />
      
      {/* Floating Platforms */}
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
        <mesh receiveShadow position={[0, -0.5, 0]}>
          <boxGeometry args={[30, 1, 30]} />
          <meshStandardMaterial color="#1e1e2f" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Glow edge */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[30.2, 0.1, 30.2]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.3} />
        </mesh>
      </Float>

      {/* Cyber Grid */}
      <Grid 
        position={[0, 0.01, 0]} 
        args={[30, 30]} 
        cellSize={1} 
        cellThickness={1} 
        cellColor="#4f46e5" 
        sectionSize={5} 
        sectionThickness={1.5} 
        sectionColor="#818cf8" 
        fadeDistance={25} 
        fadeStrength={1} 
      />

      <Stars radius={50} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={150} scale={30} size={2} speed={0.4} color="#60a5fa" />
    </>
  );
}
