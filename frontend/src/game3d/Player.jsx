import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useKeyboardControls } from '@react-three/drei';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';

export default function Player() {
  const playerRef = useRef();
  const groupRef = useRef();
  const [, get] = useKeyboardControls();
  
  const direction = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    if (!groupRef.current || !playerRef.current) return;
    
    // Update global position for distance checks
    useGameStore.getState().playerPosition.copy(groupRef.current.position);

    // Camera follow (Isometric-style angle)
    state.camera.position.lerp(
      new THREE.Vector3(
        groupRef.current.position.x + 15,
        15,
        groupRef.current.position.z + 15
      ),
      0.05
    );
    state.camera.lookAt(groupRef.current.position.x, 0, groupRef.current.position.z);

    if (useGameStore.getState().isTerminalOpen) return;

    const { forward, backward, left, right } = get();
    const speed = 10 * delta;
    
    direction.current.set(0, 0, 0);

    if (forward) direction.current.z -= 1;
    if (backward) direction.current.z += 1;
    if (left) direction.current.x -= 1;
    if (right) direction.current.x += 1;

    if (direction.current.lengthSq() > 0) {
      direction.current.normalize().multiplyScalar(speed);
      groupRef.current.position.add(direction.current);
      
      const targetPos = groupRef.current.position.clone().add(direction.current);
      playerRef.current.lookAt(targetPos);
      
      // Walking bob animation
      playerRef.current.position.y = Math.sin(state.clock.elapsedTime * 15) * 0.2;
    } else {
      playerRef.current.position.y = THREE.MathUtils.lerp(playerRef.current.position.y, 0, 0.1);
    }
  });

  return (
    <group ref={groupRef} position={[0, 1, 0]}>
      <group ref={playerRef}>
        {/* Robot Body */}
        <mesh castShadow position={[0, 0.8, 0]}>
          <boxGeometry args={[1, 1.2, 0.8]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.2} />
        </mesh>
        
        {/* Robot Head */}
        <mesh castShadow position={[0, 1.8, 0]}>
          <boxGeometry args={[0.8, 0.6, 0.8]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.5} roughness={0.2} />
        </mesh>
        
        {/* Visor */}
        <mesh position={[0, 1.8, 0.41]}>
          <boxGeometry args={[0.6, 0.2, 0.1]} />
          <meshStandardMaterial color="#0ea5e9" emissive="#0ea5e9" emissiveIntensity={2} />
        </mesh>

        {/* Hover Thruster (Base) */}
        <mesh castShadow position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.4, 0.2, 0.4, 16]} />
          <meshStandardMaterial color="#334155" />
        </mesh>
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 16]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={3} />
        </mesh>
      </group>
    </group>
  );
}
