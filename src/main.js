import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene.js';
import { TitleScene } from './scenes/TitleScene.js';
import { EditScene } from './scenes/EditScene.js';
import { PlayScene } from './scenes/PlayScene.js';
import { ResultScene } from './scenes/ResultScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 480,
  backgroundColor: '#0a0a0c',
  parent: 'game',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, TitleScene, EditScene, PlayScene, ResultScene],
};

new Phaser.Game(config);
