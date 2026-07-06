import React from 'react';
import { Canvas } from '@react-three/fiber';
import { KeyboardControls } from '@react-three/drei';
import Environment from './Environment';
import Player from './Player';
import MissionStation from './MissionStation';

export default function Scene() {
  return (
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'KeyW', 'w'] },
        { name: 'backward', keys: ['ArrowDown', 'KeyS', 's'] },
        { name: 'left', keys: ['ArrowLeft', 'KeyA', 'a'] },
        { name: 'right', keys: ['ArrowRight', 'KeyD', 'd'] },
      ]}
    >
      <Canvas shadows camera={{ position: [0, 12, 12], fov: 50 }}>
        <Environment />
        <Player />
        <MissionStation position={[-5, 0.5, -5]} />
      </Canvas>
    </KeyboardControls>
  );
}
