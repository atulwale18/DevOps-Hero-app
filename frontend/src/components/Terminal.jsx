import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { X } from 'lucide-react';

export default function Terminal() {
  const { currentMission, isTerminalOpen, toggleTerminal, addXp, addBadge } = useGameStore();
  const [history, setHistory] = useState([]);
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isTerminalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isTerminalOpen]);

  if (!isTerminalOpen || !currentMission) return null;

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newHistory = [...history, { type: 'cmd', text: `$ ${input}` }];
    
    // Evaluate command
    // Expected command can be a string or a RegExp
    const isMatch = currentMission.expectedCommand instanceof RegExp 
      ? currentMission.expectedCommand.test(input.trim())
      : currentMission.expectedCommand === input.trim();

    if (isMatch) {
      newHistory.push({ type: 'success', text: 'Success! Mission completed.' });
      newHistory.push({ type: 'info', text: `+${currentMission.rewardXP} XP` });
      
      addXp(currentMission.rewardXP);
      if (currentMission.rewardBadge) {
        addBadge(currentMission.rewardBadge);
      }
      
      // Complete mission and Auto close after delay
      setTimeout(() => {
        useGameStore.getState().completeMission(currentMission.id);
        toggleTerminal(false);
        setHistory([]);
      }, 2000);
    } else {
      newHistory.push({ type: 'error', text: 'Command failed or incorrect.' });
      if (currentMission.hint) {
        newHistory.push({ type: 'info', text: `AI Hint: ${currentMission.hint}` });
      }
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center pointer-events-auto z-50">
      <div className="bg-slate-900 w-full max-w-2xl rounded-lg overflow-hidden border border-slate-700 shadow-2xl font-mono text-sm">
        <div className="bg-slate-800 px-4 py-2 flex justify-between items-center border-b border-slate-700">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <p className="text-slate-400 text-xs">Terminal - {currentMission.title}</p>
          <button onClick={() => toggleTerminal(false)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <div className="p-4 h-80 overflow-y-auto bg-slate-950 text-slate-300">
          <div className="mb-4 text-blue-400">
            <p>Task: {currentMission.description}</p>
          </div>
          
          {history.map((line, i) => (
            <div key={i} className={`mb-1 ${line.type === 'error' ? 'text-red-400' : line.type === 'success' ? 'text-green-400' : line.type === 'info' ? 'text-yellow-400' : ''}`}>
              {line.text}
            </div>
          ))}
          
          <form onSubmit={handleCommand} className="flex gap-2 mt-2">
            <span className="text-green-500">admin@devops-hero:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-slate-100"
              autoFocus
            />
          </form>
        </div>
      </div>
    </div>
  );
}
