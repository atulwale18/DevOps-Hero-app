import React from 'react';
import PhaserGame from '../game/PhaserGame';
import Dashboard from '../components/Dashboard';
import Terminal from '../components/Terminal';

export default function GamePage() {
  return (
    <div className="relative w-screen h-screen bg-slate-950 flex flex-col items-center justify-center overflow-hidden">
      <Dashboard />
      <div className="z-0">
        <PhaserGame />
      </div>
      <Terminal />
    </div>
  );
}
