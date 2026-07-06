import React from 'react';
import Game2D from '../game2d/Game2D';
import Dashboard from '../components/Dashboard';
import Terminal from '../components/Terminal';

export default function GamePage() {
  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden m-0 p-0">
      <Dashboard />
      
      <div className="absolute inset-0 z-0">
        <Game2D />
      </div>

      <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white z-10 pointer-events-none text-center bg-black/60 px-6 py-4 rounded-xl border border-blue-500/30 backdrop-blur-md">
        <h1 className="text-4xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">DevOps Hero</h1>
        <p className="text-blue-200 mt-2">Use W, A, S, D to fly your drone. Approach the glowing Server Node.</p>
      </div>

      <Terminal />
    </div>
  );
}
