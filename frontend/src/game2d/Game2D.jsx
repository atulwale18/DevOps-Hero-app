import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { linuxMissions } from '../data/missions';

export default function Game2D() {
  const [playerPos, setPlayerPos] = useState({ x: 300, y: 300 });
  const keys = useRef({});
  const requestRef = useRef();
  
  // Game state refs
  const interacted = useRef(false);
  
  // Hardcoded server position
  const serverPos = { x: 700, y: 300 };
  const interactRadius = 150;

  useEffect(() => {
    const handleKeyDown = (e) => { keys.current[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e) => { keys.current[e.key.toLowerCase()] = false; };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const update = () => {
    // Only move if terminal is closed
    if (!useGameStore.getState().isTerminalOpen) {
      setPlayerPos(pos => {
        let newX = pos.x;
        let newY = pos.y;
        const speed = 7; // pixels per frame

        if (keys.current['w'] || keys.current['arrowup']) newY -= speed;
        if (keys.current['s'] || keys.current['arrowdown']) newY += speed;
        if (keys.current['a'] || keys.current['arrowleft']) newX -= speed;
        if (keys.current['d'] || keys.current['arrowright']) newX += speed;
        
        // Boundaries
        if (newX < 50) newX = 50;
        if (newX > 1870) newX = 1870;
        if (newY < 50) newY = 50;
        if (newY > 1030) newY = 1030;

        // Interaction Check
        const dx = newX - serverPos.x;
        const dy = newY - serverPos.y;
        const distance = Math.sqrt(dx*dx + dy*dy);

        if (distance < interactRadius && !interacted.current) {
          interacted.current = true;
          
          const completed = useGameStore.getState().completedMissions;
          const nextMission = linuxMissions.find(m => !completed.includes(m.id));
          
          if (nextMission) {
            useGameStore.getState().setMission(nextMission);
          } else {
            useGameStore.getState().setMission({
               id: 'complete',
               title: 'Level Complete',
               description: 'All Linux Village tasks complete. Proceed to Git Island! (Type: exit)',
               expectedCommand: /^exit$/,
               rewardXP: 0
            });
          }
          
          useGameStore.getState().toggleTerminal(true);
          setTimeout(() => { interacted.current = false; }, 4000);
        }

        return { x: newX, y: newY };
      });
    }
    
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black">
      
      {/* World Container (translates oppositely to player to keep player centered) */}
      <div 
        className="absolute top-0 left-0 w-[1920px] h-[1080px]"
        style={{
           transform: `translate(${window.innerWidth/2 - playerPos.x}px, ${window.innerHeight/2 - playerPos.y}px)`
        }}
      >
        {/* Beautiful Isometric Background */}
        <img 
          src="/assets/bg.png" 
          alt="Cyber Floor" 
          className="absolute inset-0 w-[1920px] h-[1080px] object-cover opacity-80"
        />

        {/* Server Station Sprite */}
        <div 
           className="absolute z-10 animate-pulse flex flex-col items-center justify-center"
           style={{ 
             left: serverPos.x - 100, 
             top: serverPos.y - 100,
             width: 200, height: 200 
           }}
        >
          <img src="/assets/server.png" className="w-full h-full object-cover rounded-full shadow-[0_0_80px_rgba(34,197,94,0.7)]" alt="Server Node" />
          <div className="absolute -top-10 text-green-400 font-bold text-2xl drop-shadow-[0_2px_2px_rgba(0,0,0,1)] whitespace-nowrap bg-black/50 px-4 py-1 rounded-full border border-green-500/50">
            Linux Server
          </div>
        </div>

        {/* Player Drone Sprite */}
        <div 
           className="absolute z-20"
           style={{ 
             left: playerPos.x - 60, 
             top: playerPos.y - 60,
             width: 120, height: 120,
           }}
        >
          <img src="/assets/player.png" className="w-full h-full object-cover rounded-full border-4 border-blue-500 shadow-[0_0_50px_rgba(59,130,246,0.9)]" alt="Player Robot" />
        </div>
      </div>
    </div>
  );
}
