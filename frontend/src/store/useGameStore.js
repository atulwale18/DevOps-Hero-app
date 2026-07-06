import { create } from 'zustand';
import * as THREE from 'three';

export const useGameStore = create((set) => ({
  xp: 0,
  level: 1,
  badges: [],
  currentMission: null,
  isTerminalOpen: false,
  playerPosition: new THREE.Vector3(),
  
  addXp: (amount) => set((state) => ({ xp: state.xp + amount })),
  setLevel: (level) => set({ level }),
  addBadge: (badge) => set((state) => ({ badges: [...state.badges, badge] })),
  setMission: (mission) => set({ currentMission: mission }),
  toggleTerminal: (isOpen) => set({ isTerminalOpen: isOpen }),
}));
