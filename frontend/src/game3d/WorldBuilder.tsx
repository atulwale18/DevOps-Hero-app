import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { useGameStore } from '../store/useGameStore';
import * as THREE from 'three';
import { Grid, useTexture } from '@react-three/drei';
import { getRandomQuestion } from '../data/questions';

const CHUNK_SIZE = 50; // Length of one floor chunk
const CHUNK_COUNT = 5; // How many chunks to render at once
const LANE_WIDTH = 3;

interface ObstacleData {
  id: string;
  lane: number;
  zOffset: number;
  type: 'barrier' | 'terminal' | 'coin';
}

interface ChunkData {
  id: string;
  zBase: number;
  obstacles: ObstacleData[];
}

export default function WorldBuilder() {
  const { isPlaying, isPausedForQuiz, isGameOver, speed, pauseForQuiz, takeDamage, collectPowerup } = useGameStore();
  const worldRef = useRef<THREE.Group>(null);
  
  const dockerTex = useTexture('/assets/docker.png');
  const k8sTex = useTexture('/assets/k8s.png');
  
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
      // Spawn 1 to 5 objects per chunk
      const numObstacles = Math.floor(Math.random() * 5) + 1;
      
      for (let i = 0; i < numObstacles; i++) {
        const lane = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        const zOffset = (Math.random() * (CHUNK_SIZE - 10)) + 5; 
        
        const rand = Math.random();
        let type: 'barrier' | 'terminal' | 'coin' = 'coin'; // mostly coins
        if (rand > 0.7) type = 'barrier';
        else if (rand > 0.5) type = 'terminal';
        
        obstacles.push({
          id: Math.random().toString(),
          lane,
          zOffset,
          type
        });
      }
    }
    
    return {
      id: Math.random().toString(),
      zBase,
      obstacles
    };
  }

  useFrame((state, delta) => {
    if (!isPlaying || isPausedForQuiz || isGameOver) return;
    
    if (worldRef.current) {
      const moveAmount = speed * delta;
      worldRef.current.position.z += moveAmount;
      worldOffsetZ.current += moveAmount;

      if (worldOffsetZ.current >= CHUNK_SIZE) {
        worldOffsetZ.current -= CHUNK_SIZE;
        
        setChunks(prevChunks => {
          const newChunks = [...prevChunks];
          newChunks.shift();
          const furthestZ = newChunks[newChunks.length - 1].zBase;
          newChunks.push(generateChunk(furthestZ - CHUNK_SIZE));
          return newChunks;
        });
      }
      
      const playerLane = useGameStore.getState().playerLane;
      
      chunks.forEach(chunk => {
        chunk.obstacles.forEach(obs => {
          const obsGlobalZ = chunk.zBase - obs.zOffset + worldRef.current.position.z;
          
          if (obsGlobalZ > -0.5 && obsGlobalZ < 0.5) {
            if (obs.lane === playerLane) {
              if (!(obs as any).hasCollided) {
                (obs as any).hasCollided = true;
                
                if (obs.type === 'terminal') {
                  const askedIds = useGameStore.getState().askedQuestionIds;
                  pauseForQuiz(getRandomQuestion(askedIds));
                } else if (obs.type === 'barrier') {
                  takeDamage();
                } else if (obs.type === 'coin') {
                  // Fake a powerup collection for simple points
                  collectPowerup('docker'); 
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
          {/* Cyberpunk Grid Floor */}
          <Grid 
            position={[0, -0.1, -CHUNK_SIZE / 2]} 
            args={[LANE_WIDTH * 3 + 4, CHUNK_SIZE]} 
            cellSize={1} 
            cellThickness={1.5} 
            cellColor="#3b82f6" 
            sectionSize={LANE_WIDTH} 
            sectionThickness={2.5} 
            sectionColor="#6366f1" 
            fadeDistance={80} 
            fadeStrength={1} 
          />
          
          <mesh position={[-1.5, 0, -CHUNK_SIZE / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.2, CHUNK_SIZE]} />
            <meshBasicMaterial color="#ec4899" transparent opacity={0.3} />
          </mesh>
          <mesh position={[1.5, 0, -CHUNK_SIZE / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.2, CHUNK_SIZE]} />
            <meshBasicMaterial color="#ec4899" transparent opacity={0.3} />
          </mesh>

          {chunk.obstacles.map(obs => {
            if ((obs as any).hasCollided && obs.type === 'coin') return null;

            const isDocker = Math.random() > 0.5;
            const tex = isDocker ? dockerTex : k8sTex;

            return (
              <group key={obs.id} position={[obs.lane * LANE_WIDTH, 0, -obs.zOffset]}>
                {obs.type === 'barrier' && (
                  <mesh castShadow position={[0, 1, 0]}>
                    <boxGeometry args={[2.5, 2, 1]} />
                    <meshStandardMaterial color="#0f172a" emissive="#ef4444" emissiveIntensity={0.8} />
                  </mesh>
                )}
                {obs.type === 'terminal' && (
                  <mesh castShadow position={[0, 1.5, 0]}>
                    <boxGeometry args={[2, 3, 0.5]} />
                    <meshStandardMaterial map={tex} color="#3b82f6" emissive="#1d4ed8" emissiveIntensity={0.2} />
                  </mesh>
                )}
                {obs.type === 'coin' && (
                  <mesh castShadow position={[0, 1, 0]} rotation={[0, Math.random() * Math.PI, 0]}>
                    <cylinderGeometry args={[0.6, 0.6, 0.2, 16]} />
                    <meshStandardMaterial color="#eab308" emissive="#ca8a04" metalness={1} roughness={0.1} />
                  </mesh>
                )}
              </group>
            );
          })}
        </group>
      ))}
    </group>
  );
}
