import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GameRunner from './game3d/GameRunner';
import Dashboard from './components/Dashboard';
import QuizModal from './components/QuizModal';

function MainGame() {
  return (
    <div className="relative w-screen h-screen bg-slate-900 overflow-hidden">
      <Dashboard />
      <GameRunner />
      <QuizModal />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainGame />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
