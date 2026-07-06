import React from 'react';
import Scene from '../game3d/Scene';
import Dashboard from '../components/Dashboard';
import Terminal from '../components/Terminal';

export default function GamePage() {
  return (
    <div className="relative w-screen h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden m-0 p-0">
      <Dashboard />
      
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      <div className="absolute top-8 text-white z-10 pointer-events-none text-center">
        <h1 className="text-4xl font-bold font-sans drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-slate-100">DevOps Hero: 3D</h1>
        <p className="text-slate-300 drop-shadow-[0_1px_1px_rgba(0,0,0,1)]">Use W, A, S, D to move. Walk to the glowing server.</p>
      </div>

      <Terminal />
    </div>
  );
}
