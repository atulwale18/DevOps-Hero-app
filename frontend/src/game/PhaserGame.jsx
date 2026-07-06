import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import LinuxVillageScene from './scenes/LinuxVillageScene';

export default function PhaserGame() {
  const gameRef = useRef(null);

  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'phaser-container',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: [LinuxVillageScene]
    };

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => {
      game.destroy(true);
    };
  }, []);

  return (
    <div className="w-full flex justify-center items-center">
      <div id="phaser-container" className="rounded-xl overflow-hidden shadow-2xl border-4 border-slate-700 bg-black"></div>
    </div>
  );
}
