import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import { Text, Float } from '@react-three/drei';
import * as THREE from 'three';

export default function MissionStation({ position }) {
  const interacted = useRef(false);
  const stationWorldPos = new THREE.Vector3(...position);

  useFrame(() => {
    const playerPos = useGameStore.getState().playerPosition;
    const distance = stationWorldPos.distanceTo(playerPos);

    if (distance < 3.5 && !interacted.current && !useGameStore.getState().isTerminalOpen) {
      interacted.current = true;
      
      useGameStore.getState().setMission({
        id: 1,
        title: 'Linux: File Backup',
        description: 'Create a backup of the logs folder. Use tar -czvf backup.tar logs/',
        expectedCommand: /^tar -czvf backup\.tar logs\/?$/,
        rewardXP: 100,
        rewardBadge: 'Linux Explorer',
        hint: 'Use tar with -czvf flags.'
      });
      useGameStore.getState().toggleTerminal(true);
      
      setTimeout(() => { interacted.current = false; }, 4000);
    }
  });

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <group>
          {/* Server Rack Body */}
          <mesh castShadow position={[0, 1.5, 0]}>
            <boxGeometry args={[1.5, 3, 1.5]} />
            <meshStandardMaterial color="#1e293b" metalness={0.8} roughness={0.2} />
          </mesh>
          
          {/* Server Lights */}
          <mesh position={[0, 2.5, 0.76]}>
            <boxGeometry args={[1.2, 0.2, 0.1]} />
            <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0, 2.0, 0.76]}>
            <boxGeometry args={[1.2, 0.2, 0.1]} />
            <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} />
          </mesh>
          <mesh position={[0, 1.5, 0.76]}>
            <boxGeometry args={[1.2, 0.2, 0.1]} />
            <meshStandardMaterial color="#eab308" emissive="#eab308" emissiveIntensity={1} />
          </mesh>
        </group>
      </Float>
      
      <Text 
        position={[0, 4, 0]} 
        fontSize={0.6} 
        color="#22c55e" 
        anchorX="center" 
        anchorY="middle"
        outlineWidth={0.04}
        outlineColor="#000"
      >
        Linux Server
      </Text>
      
      {/* Ground Glow */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <circleGeometry args={[2, 32]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}
