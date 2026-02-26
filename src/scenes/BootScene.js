import Phaser from 'phaser';
import { FONT_MAIN, FONT_TITLE, COLORS } from '../constants.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    const loadingText = this.add.text(240, 400, 'Loading...', {
      fontFamily: 'sans-serif',
      fontSize: '20px',
      color: COLORS.TEXT,
    }).setOrigin(0.5);

    // Wait for Google Fonts to be ready
    document.fonts.ready.then(() => {
      // Brief delay to ensure fonts are fully renderable
      this.time.delayedCall(200, () => {
        loadingText.destroy();
        this.scene.start('TitleScene');
      });
    });
  }
}
