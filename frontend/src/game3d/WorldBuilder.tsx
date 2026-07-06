import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';
import { getRandomQuestion } from '../data/questions';

const CHUNK_SIZE = 50; // Length of one floor chunk
const CHUNK_COUNT = 5; // How many chunks to render at once
const LANE_WIDTH = 3;

interface ObstacleData {
  id: string;
  lane: number;
  zOffset: number;
  type: 'barrier' | 'terminal';
}

interface ChunkData {
  id: string;
  zBase: number;
  obstacles: ObstacleData[];
}

export default function WorldBuilder() {
  const { isPlaying, isPausedForQuiz, isGameOver, speed, pauseForQuiz, takeDamage } = useGameStore();
  const worldRef = useRef<THREE.Group>(null);
  
  // Track how far the world has shifted overall to spawn new chunks
  const worldOffsetZ = useRef(0);
  
  // Initialize chunks
  const [chunks, setChunks] = useState<ChunkData[]>(() => {
    return Array.from({ length: CHUNK_COUNT }, (_, i) => generateChunk(-i * CHUNK_SIZE, i === 0));
  });

  function generateChunk(zBase: number, isSafe: boolean = false): ChunkData {
    const obstacles: ObstacleData[] = [];
    
    // Don't spawn obstacles in the very first safe chunk
    if (!isSafe) {
      // Spawn 1 to 3 obstacles per chunk
      const numObstacles = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numObstacles; i++) {
        const lane = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        // Distribute obstacles along the chunk length
        const zOffset = (Math.random() * (CHUNK_SIZE - 10)) + 5; 
        
        obstacles.push({
          id: Math.random().toString(),
          lane,
          zOffset,
          type: Math.random() > 0.3 ? 'barrier' : 'terminal'
        });
      }
    }
    
    return {
      id: Math.random().toString(),
      zBase,
      obstacles
    };
  }

  useFrame((_, delta) => {
    if (!isPlaying || isPausedForQuiz || isGameOver) return;
    
    if (worldRef.current) {
      // Move the entire world towards the camera (+Z direction)
      const moveAmount = speed * delta;
      worldRef.current.position.z += moveAmount;
      worldOffsetZ.current += moveAmount;

      // When the world has moved forward by one CHUNK_SIZE,
      // recycle the oldest chunk behind the camera and spawn a new one ahead.
      if (worldOffsetZ.current >= CHUNK_SIZE) {
        worldOffsetZ.current -= CHUNK_SIZE;
        
        setChunks(prevChunks => {
          const newChunks = [...prevChunks];
          // Remove the chunk that passed behind us
          newChunks.shift();
          // Find the Z base of the furthest chunk and place the new one after it
          const furthestZ = newChunks[newChunks.length - 1].zBase;
          newChunks.push(generateChunk(furthestZ - CHUNK_SIZE));
          return newChunks;
        });
      }
      
      // Collision Detection
      // Player is at Z = 0 globally.
      // An obstacle's global Z = chunk.zBase - obstacle.zOffset + worldRef.current.position.z
      const playerLane = useGameStore.getState().playerLane;
      
      chunks.forEach(chunk => {
        chunk.obstacles.forEach(obs => {
          // Calculate global Z of this obstacle
          const obsGlobalZ = chunk.zBase - obs.zOffset + worldRef.current.position.z;
          
          // If the obstacle is passing through Z = 0 (player's position)
          // We use a small threshold (e.g. between -0.5 and 0.5) to detect collision
          if (obsGlobalZ > -0.5 && obsGlobalZ < 0.5) {
            // Check if player is in the same lane
            if (obs.lane === playerLane) {
              // Simple cooldown to prevent multiple triggers for the same obstacle
              if (!(obs as any).hasCollided) {
                (obs as any).hasCollided = true;
                
                if (obs.type === 'terminal') {
                  pauseForQuiz(getRandomQuestion());
                } else if (obs.type === 'barrier') {
                  takeDamage();
                }
              }
            }
          }
        });
      });
    }
  });

  return (
    <group ref={worldRef}>
      {chunks.map((chunk) => (
        <group key={chunk.id} position={[0, 0, chunk.zBase]}>
          {/* Floor Tile */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow position={[0, -0.1, -CHUNK_SIZE / 2]}>
            <planeGeometry args={[LANE_WIDTH * 3 + 2, CHUNK_SIZE]} />
            <meshStandardMaterial color="#1e293b" />
          </mesh>
          
          {/* Lane Dividers */}
          <mesh position={[-1.5, 0, -CHUNK_SIZE / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.1, CHUNK_SIZE]} />
            <meshBasicMaterial color="#334155" />
          </mesh>
          <mesh position={[1.5, 0, -CHUNK_SIZE / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.1, CHUNK_SIZE]} />
            <meshBasicMaterial color="#334155" />
          </mesh>

          {/* Obstacles */}
          {chunk.obstacles.map(obs => (
            <group key={obs.id} position={[obs.lane * LANE_WIDTH, 0, -obs.zOffset]}>
              {obs.type === 'barrier' ? (
                <mesh castShadow position={[0, 1, 0]}>
                  <boxGeometry args={[2, 2, 1]} />
                  <meshStandardMaterial color="#ef4444" />
                </mesh>
              ) : (
                <mesh castShadow position={[0, 1.5, 0]}>
                  <boxGeometry args={[1.5, 3, 1.5]} />
                  <meshStandardMaterial color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.5} />
                </mesh>
              )}
            </group>
          ))}
        </group>
      ))}
    </group>
  );
}
