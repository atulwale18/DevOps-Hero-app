import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

const LANE_WIDTH = 3;

export default function Player() {
  const groupRef = useRef<THREE.Group>(null);
  const { characterModel, isPlaying, isPausedForQuiz, isGameOver, speed, addDistance, setPlayerLane } = useGameStore();
  
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
    addDistance(speed * delta);

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        10 * delta
      );
      
      const bobbing = Math.sin(state.clock.elapsedTime * 15) * 0.1;
      groupRef.current.position.y = 1 + bobbing;
      
      const leanAngle = (groupRef.current.position.x - targetX) * 0.1;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        leanAngle,
        10 * delta
      );
    }
  });

  const isBoy = characterModel === 'boy';
  const bodyColor = isBoy ? '#3b82f6' : '#ec4899';
  const headColor = isBoy ? '#60a5fa' : '#f472b6';

  return (
    <group ref={groupRef} position={[0, 1, 0]}>
      {/* Body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color={bodyColor} metalness={0.8} roughness={0.2} />
      </mesh>
      {/* Head */}
      <mesh castShadow position={[0, 1.2, 0]}>
        {isBoy ? <boxGeometry args={[0.8, 0.8, 0.8]} /> : <sphereGeometry args={[0.5, 32, 32]} />}
        <meshStandardMaterial color={headColor} metalness={0.9} roughness={0.1} />
      </mesh>
    </group>
  );
}
