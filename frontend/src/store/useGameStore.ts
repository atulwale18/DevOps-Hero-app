import { create } from 'zustand';

export type Question = {
  id: string;
  category: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

type GameState = {
  // Game metrics
  score: number;
  distance: number;
  health: number;
  maxHealth: number;
  speed: number;
  multiplier: number;
  
  // Game Status
  isPlaying: boolean;
  isGameOver: boolean;
  isPausedForQuiz: boolean;
  
  // Active Quiz
  currentQuestion: Question | null;
  
  // Player Configuration
  characterModel: 'male' | 'female';
  playerLane: number;
  
  // Actions
  startGame: () => void;
  pauseForQuiz: (q: Question) => void;
  answerQuiz: (isCorrect: boolean) => void;
  addDistance: (amount: number) => void;
  takeDamage: () => void;
  collectPowerup: (type: string) => void;
  setCharacter: (model: 'male' | 'female') => void;
  reset: () => void;
};

const INITIAL_SPEED = 15;

export const useGameStore = create<GameState>((set) => ({
  score: 0,
  distance: 0,
  health: 3,
  maxHealth: 3,
  speed: INITIAL_SPEED,
  multiplier: 1,
  
  isPlaying: false,
  isGameOver: false,
  isPausedForQuiz: false,
  currentQuestion: null,
  
  characterModel: 'male',
  playerLane: 0,
  
  startGame: () => set({ isPlaying: true, isGameOver: false, isPausedForQuiz: false, score: 0, distance: 0, health: 3, speed: INITIAL_SPEED, multiplier: 1, playerLane: 0 }),
  
  pauseForQuiz: (q) => set({ isPausedForQuiz: true, currentQuestion: q }),
  
  answerQuiz: (isCorrect) => set((state) => {
    if (isCorrect) {
      // Correct answer: +10 points, increase multiplier
      return {
        isPausedForQuiz: false,
        currentQuestion: null,
        score: state.score + 10 * state.multiplier,
        multiplier: Math.min(state.multiplier + 1, 5) // max 5x multiplier
      };
    } else {
      // Wrong answer: Lose health, reset multiplier
      const newHealth = state.health - 1;
      return {
        isPausedForQuiz: false,
        currentQuestion: null,
        health: newHealth,
        multiplier: 1,
        isGameOver: newHealth <= 0,
        isPlaying: newHealth > 0
      };
    }
  }),
  
  addDistance: (amount) => set((state) => {
    const newDist = state.distance + amount;
    // Speed increases slightly every 100 units of distance
    const newSpeed = INITIAL_SPEED + Math.floor(newDist / 100) * 2;
    return { distance: newDist, speed: newSpeed };
  }),
  
  takeDamage: () => set((state) => {
    const newHealth = state.health - 1;
    return {
      health: newHealth,
      multiplier: 1,
      isGameOver: newHealth <= 0,
      isPlaying: newHealth > 0
    };
  }),
  
  collectPowerup: (type) => set((state) => {
    switch (type) {
      case 'docker': return { score: state.score + 20 };
      case 'kubernetes': return { health: Math.min(state.health + 1, state.maxHealth) };
      case 'aws': return { speed: state.speed + 10 }; // Temporary boost handled via separate effect ideally
      case 'grafana': return { multiplier: state.multiplier * 2 };
      default: return state;
    }
  }),
  
  setCharacter: (model) => set({ characterModel: model }),
  setPlayerLane: (lane) => set({ playerLane: lane }),
  
  reset: () => set({ isPlaying: false, isGameOver: false, isPausedForQuiz: false, score: 0, distance: 0, health: 3, speed: INITIAL_SPEED, multiplier: 1, playerLane: 0 })
}));
