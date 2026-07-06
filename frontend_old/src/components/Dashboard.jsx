import React from 'react';
import { useGameStore } from '../store/useGameStore';
import { Trophy, Star, Shield } from 'lucide-react';

export default function Dashboard() {
  const { xp, level, badges } = useGameStore();

  return (
    <div className="absolute top-4 left-4 flex gap-4 pointer-events-auto z-10">
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl flex items-center gap-3">
        <Star className="text-yellow-400 w-6 h-6" />
        <div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Level {level}</p>
          <p className="text-lg font-bold text-white">{xp} XP</p>
        </div>
      </div>
      
      {badges.length > 0 && (
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl flex gap-2">
          {badges.map((badge, idx) => (
            <div key={idx} className="relative group cursor-help">
              <Shield className="text-blue-400 w-8 h-8" />
              <div className="absolute top-full mt-2 hidden group-hover:block bg-black text-xs text-white p-2 rounded whitespace-nowrap">
                {badge}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
