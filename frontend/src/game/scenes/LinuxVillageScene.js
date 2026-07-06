import Phaser from 'phaser';
import { useGameStore } from '../../store/useGameStore';

export default class LinuxVillageScene extends Phaser.Scene {
  constructor() {
    super('LinuxVillageScene');
  }

  preload() {
    // Assets would load here
  }

  create() {
    this.cameras.main.setBackgroundColor('#2d3748');
    
    this.add.text(400, 80, 'Linux Village', { fontSize: '32px', fill: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
    this.add.text(400, 110, 'Use Arrow Keys to move. Walk to the green station.', { fontSize: '14px', fill: '#cbd5e1' }).setOrigin(0.5);

    // Player
    this.player = this.add.rectangle(400, 300, 32, 32, 0x4299e1);
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    
    // Mission Station
    this.station = this.add.rectangle(200, 300, 48, 48, 0x48bb78);
    this.physics.add.existing(this.station, true);
    
    this.add.text(200, 250, 'Mission: Backup', { fontSize: '14px', fill: '#fff' }).setOrigin(0.5);

    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.physics.add.collider(this.player, this.station, this.handleStationInteraction, null, this);
    this.interacted = false;
  }

  handleStationInteraction() {
    if (!this.interacted && !useGameStore.getState().isTerminalOpen) {
      useGameStore.getState().setMission({
        id: 1,
        title: 'File Backup',
        description: 'Create a backup of the logs folder. Use tar -czvf backup.tar logs/',
        expectedCommand: /^tar -czvf backup\.tar logs\/?$/,
        rewardXP: 100,
        rewardBadge: 'Linux Explorer',
        hint: 'Use tar with -czvf flags.'
      });
      useGameStore.getState().toggleTerminal(true);
      
      this.interacted = true;
      setTimeout(() => { this.interacted = false; }, 3000);
      
      // Bounce player back slightly
      this.player.body.setVelocity(0);
      this.player.y += 20;
    }
  }

  update() {
    if (useGameStore.getState().isTerminalOpen) {
      this.player.body.setVelocity(0);
      return;
    }

    const speed = 250;
    this.player.body.setVelocity(0);

    if (this.cursors.left.isDown) this.player.body.setVelocityX(-speed);
    else if (this.cursors.right.isDown) this.player.body.setVelocityX(speed);

    if (this.cursors.up.isDown) this.player.body.setVelocityY(-speed);
    else if (this.cursors.down.isDown) this.player.body.setVelocityY(speed);
  }
}
