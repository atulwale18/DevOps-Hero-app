import { create } from 'zustand';

export const useGameStore = create((set) => ({
  xp: 0,
  level: 1,
  badges: [],
  currentMission: null,
  isTerminalOpen: false,
  playerPosition: { x: 0, y: 0, z: 0 },
  completedMissions: [],
  
  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
  setLevel: (level) => set({ level }),
  addBadge: (badge) => set((state) => ({ badges: [...state.badges, badge] })),
  setMission: (mission) => set({ currentMission: mission }),
  completeMission: (missionId) => set((state) => ({ 
    completedMissions: [...state.completedMissions, missionId],
    currentMission: null 
  })),
  toggleTerminal: (isOpen) => set({ isTerminalOpen: isOpen }),
}));
