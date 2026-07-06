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

  const leftArmRef = useRef<THREE.Mesh>(null);
  const rightArmRef = useRef<THREE.Mesh>(null);
  const leftLegRef = useRef<THREE.Mesh>(null);
  const rightLegRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!isPlaying || isPausedForQuiz || isGameOver) return;
    
    addDistance(speed * delta);

    if (groupRef.current) {
      groupRef.current.position.x = THREE.MathUtils.lerp(
        groupRef.current.position.x,
        targetX,
        10 * delta
      );
      
      const time = state.clock.elapsedTime;
      const runSpeed = 15;
      
      // Bobbing
      groupRef.current.position.y = 1.2 + Math.abs(Math.sin(time * runSpeed)) * 0.2;
      
      // Leaning
      const leanAngle = (groupRef.current.position.x - targetX) * 0.1;
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        leanAngle,
        10 * delta
      );
      
      // Animate Limbs
      if (leftArmRef.current && rightArmRef.current && leftLegRef.current && rightLegRef.current) {
        const swing = Math.sin(time * runSpeed) * 0.8;
        
        leftArmRef.current.rotation.x = swing;
        rightArmRef.current.rotation.x = -swing;
        
        leftLegRef.current.rotation.x = -swing;
        rightLegRef.current.rotation.x = swing;
      }
    }
  });

  const isBoy = characterModel === 'boy';
  const jacketColor = isBoy ? '#1d4ed8' : '#7e22ce'; // Darker blue/purple for jacket
  const pantsColor = '#1e293b';
  const skinColor = '#fcd34d';
  const shoeColor = '#0f172a';
  const hairColor = isBoy ? '#451a03' : '#171717';

  return (
    <group ref={groupRef} position={[0, 1.2, 0]}>
      {/* Head */}
      <mesh castShadow position={[0, 0.7, 0]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color={skinColor} roughness={0.4} />
      </mesh>
      {/* Hair */}
      <mesh castShadow position={[0, 1.05, -0.05]}>
        <boxGeometry args={[0.65, 0.2, 0.65]} />
        <meshStandardMaterial color={hairColor} roughness={0.8} />
      </mesh>
      {/* Glasses */}
      <mesh position={[0, 0.75, -0.31]}>
        <boxGeometry args={[0.5, 0.15, 0.05]} />
        <meshStandardMaterial color="#000000" metalness={0.8} />
      </mesh>
      
      {/* Torso (Jacket) */}
      <mesh castShadow position={[0, 0, 0]}>
        <boxGeometry args={[0.7, 0.9, 0.4]} />
        <meshStandardMaterial color={jacketColor} roughness={0.7} />
      </mesh>
      
      {/* Backpack */}
      <mesh castShadow position={[0, 0.1, 0.25]}>
        <boxGeometry args={[0.5, 0.6, 0.2]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Left Arm */}
      <mesh ref={leftArmRef} castShadow position={[-0.45, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color={jacketColor} />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArmRef} castShadow position={[0.45, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.7, 0.2]} />
        <meshStandardMaterial color={jacketColor} />
      </mesh>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.2, -0.45, 0]}>
        <mesh castShadow position={[0, -0.35, 0]}>
          <boxGeometry args={[0.25, 0.7, 0.25]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>
        {/* Shoe */}
        <mesh castShadow position={[0, -0.75, -0.1]}>
          <boxGeometry args={[0.26, 0.15, 0.35]} />
          <meshStandardMaterial color={shoeColor} />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.2, -0.45, 0]}>
        <mesh castShadow position={[0, -0.35, 0]}>
          <boxGeometry args={[0.25, 0.7, 0.25]} />
          <meshStandardMaterial color={pantsColor} />
        </mesh>
        {/* Shoe */}
        <mesh castShadow position={[0, -0.75, -0.1]}>
          <boxGeometry args={[0.26, 0.15, 0.35]} />
          <meshStandardMaterial color={shoeColor} />
        </mesh>
      </group>
    </group>
  );
}
