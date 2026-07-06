import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

const LANE_WIDTH = 3;

export default function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const { isPlaying, isPausedForQuiz, isGameOver, speed, addDistance, setPlayerLane } = useGameStore();
  
  // Lane: -1 (Left), 0 (Center), 1 (Right)
  const [currentLane, setCurrentLane] = useState(0);
  const targetX = currentLane * LANE_WIDTH;

  // Handle Input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying || isPausedForQuiz || isGameOver) return;
      
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setCurrentLane(prev => {
          const newLane = Math.max(prev - 1, -1);
          setPlayerLane(newLane);
          return newLane;
        });
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setCurrentLane(prev => {
          const newLane = Math.min(prev + 1, 1);
          setPlayerLane(newLane);
          return newLane;
        });
      }
      // Jump and Slide not fully implemented with physics yet, just lane switching for MVP
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, isPausedForQuiz, isGameOver]);

  useFrame((state, delta) => {
    if (!isPlaying || isPausedForQuiz || isGameOver) return;
    
    // Add distance (this drives the game score/speed)
    // Distance added is speed * time
    addDistance(speed * delta);

    // Smoothly interpolate player X position to target lane
    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        10 * delta
      );
      
      // Simulate running bobbing motion
      const bobbing = Math.sin(state.clock.elapsedTime * 15) * 0.1;
      groupRef.current.position.y = 1 + bobbing;
      
      // Slight leaning when switching lanes
      const leanAngle = (groupRef.current.position.x - targetX) * 0.1;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        leanAngle,
        10 * delta
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 1, 0]}>
      {/* Robot Character Placeholder */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#60a5fa" metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}
