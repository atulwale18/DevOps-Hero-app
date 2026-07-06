import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Heart, HeartCrack, Zap, Trophy, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const { score, distance, health, maxHealth, multiplier, isPlaying, isGameOver, startGame } = useGameStore();

  if (!isPlaying && !isGameOver) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80">
        <div className="text-center">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400 mb-8 drop-shadow-[0_0_20px_rgba(59,130,246,0.5)]">
            DEVOPS RUNNER
          </h1>
          <button 
            onClick={startGame}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full text-xl shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all hover:scale-105"
          >
            INITIALIZE DEPLOYMENT
          </button>
        </div>
      </div>
    );
  }

  if (isGameOver) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-red-950/90">
        <div className="text-center bg-black/50 p-12 rounded-3xl border border-red-500/50">
          <ShieldAlert className="w-24 h-24 text-red-500 mx-auto mb-6" />
          <h2 className="text-4xl font-bold text-red-500 mb-2">SYSTEM FAILURE</h2>
          <p className="text-red-200 mb-8">Production deployment crashed.</p>
          
          <div className="flex justify-center gap-12 mb-12">
            <div>
              <p className="text-slate-400 text-sm uppercase">Final Score</p>
              <p className="text-4xl font-bold text-white">{score}</p>
            </div>
            <div>
              <p className="text-slate-400 text-sm uppercase">Distance</p>
              <p className="text-4xl font-bold text-white">{Math.floor(distance)}m</p>
            </div>
          </div>

          <button 
            onClick={startGame}
            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-full text-xl shadow-[0_0_30px_rgba(220,38,38,0.5)] transition-all hover:scale-105"
          >
            REBOOT SYSTEM
          </button>
        </div>
      </div>
    );
  }

  // Active HUD
  return (
    <div className="absolute top-0 left-0 w-full p-6 z-40 pointer-events-none flex justify-between items-start">
      
      {/* Left: Score & Multiplier */}
      <div className="flex flex-col gap-2">
        <div className="bg-black/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 flex items-center gap-4">
          <Trophy className="text-yellow-400 w-6 h-6" />
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase">Score</p>
            <p className="text-white text-2xl font-black">{score}</p>
          </div>
        </div>
        {multiplier > 1 && (
          <div className="bg-emerald-900/60 border border-emerald-500 rounded-lg px-3 py-1 flex items-center gap-2 w-fit animate-pulse">
            <Zap className="text-emerald-400 w-4 h-4" />
            <span className="text-emerald-400 font-bold text-sm">{multiplier}x MULTIPLIER</span>
          </div>
        )}
      </div>

      {/* Center: Distance */}
      <div className="bg-black/60 backdrop-blur-md border border-blue-900/50 rounded-full px-8 py-3">
        <p className="text-blue-400 text-sm font-bold uppercase text-center">Distance</p>
        <p className="text-white text-3xl font-black text-center">{Math.floor(distance)}m</p>
      </div>

      {/* Right: Health (Lives) */}
      <div className="bg-black/60 backdrop-blur-md border border-slate-700 rounded-xl p-4 flex gap-2">
        {[...Array(maxHealth)].map((_, i) => {
          if (i < health) {
            return <Heart key={i} className="text-red-500 w-8 h-8 fill-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" />;
          }
          return <HeartCrack key={i} className="text-slate-700 w-8 h-8" />;
        })}
      </div>

    </div>
  );
}
