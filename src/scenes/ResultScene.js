import Phaser from 'phaser';
import {
  GAME_W, GAME_H, COLORS, FONT_MAIN, FONT_TITLE,
  CLEAR_TEXTS, DEATH_TEXTS,
} from '../constants.js';

export class ResultScene extends Phaser.Scene {
  constructor() {
    super('ResultScene');
  }

  init(data) {
    this.cleared = data.cleared;
    this.stage = data.stage;
    this.totalPixels = data.totalPixels;
    this.remainingPixels = data.remainingPixels;
    this.newPixels = data.newPixels || 0;
  }

  create() {
    if (this.cleared) {
      this.showClearScreen();
    } else {
      this.showDeathScreen();
    }
  }

  showClearScreen() {
    // Title
    this.add.text(GAME_W / 2, 60, 'STAGE CLEAR', {
      fontFamily: FONT_TITLE,
      fontSize: '20px',
      color: '#4eff7a',
    }).setOrigin(0.5);

    this.add.text(GAME_W / 2, 100, `STAGE ${this.stage}`, {
      fontFamily: FONT_TITLE,
      fontSize: '14px',
      color: '#4eff7a',
    }).setOrigin(0.5);

    // Stats
    this.add.text(GAME_W / 2, 170, `残存ピクセル: ${this.remainingPixels}`, {
      fontFamily: FONT_MAIN,
      fontSize: '18px',
      color: COLORS.TEXT,
    }).setOrigin(0.5);

    this.add.text(GAME_W / 2, 200, `獲得ピクセル: +${this.newPixels}`, {
      fontFamily: FONT_MAIN,
      fontSize: '18px',
      color: '#ffd644',
    }).setOrigin(0.5);

    // Flavor text
    const flavor = Phaser.Utils.Array.GetRandom(CLEAR_TEXTS);
    this.add.text(GAME_W / 2, 270, flavor, {
      fontFamily: FONT_MAIN,
      fontSize: '15px',
      color: COLORS.TEXT_DIM,
      wordWrap: { width: 600 },
      align: 'center',
    }).setOrigin(0.5);

    // Next stage button
    const nextPixels = Math.min(this.totalPixels + this.newPixels, 9);
    this.createButton(GAME_W / 2, 380, '次のステージへ', COLORS.PLAYER, () => {
      this.scene.start('EditScene', {
        stage: this.stage + 1,
        totalPixels: nextPixels,
      });
    });
  }

  showDeathScreen() {
    // Title
    this.add.text(GAME_W / 2, 60, 'GAME OVER', {
      fontFamily: FONT_TITLE,
      fontSize: '20px',
      color: '#fb7185',
    }).setOrigin(0.5);

    this.add.text(GAME_W / 2, 100, `STAGE ${this.stage}`, {
      fontFamily: FONT_TITLE,
      fontSize: '14px',
      color: '#fb7185',
    }).setOrigin(0.5);

    // Flavor text
    const flavor = Phaser.Utils.Array.GetRandom(DEATH_TEXTS);
    this.add.text(GAME_W / 2, 200, flavor, {
      fontFamily: FONT_MAIN,
      fontSize: '15px',
      color: COLORS.TEXT_DIM,
      wordWrap: { width: 600 },
      align: 'center',
    }).setOrigin(0.5);

    // Retry button
    this.createButton(GAME_W / 2, 320, 'リトライ', COLORS.PLAYER, () => {
      this.scene.start('EditScene', {
        stage: this.stage,
        totalPixels: this.totalPixels,
      });
    });

    // Title button
    this.createButton(GAME_W / 2, 400, 'タイトルへ', 0x888888, () => {
      this.scene.start('TitleScene');
    });
  }

  createButton(x, y, label, color, callback) {
    const colorStr = '#' + color.toString(16).padStart(6, '0');
    const bg = this.add.rectangle(x, y, 240, 50, color, 0.15)
      .setStrokeStyle(2, color);
    const text = this.add.text(x, y, label, {
      fontFamily: FONT_MAIN,
      fontSize: '18px',
      color: colorStr,
    }).setOrigin(0.5);

    bg.setInteractive({ useHandCursor: true });
    bg.on('pointerover', () => bg.setFillStyle(color, 0.3));
    bg.on('pointerout', () => bg.setFillStyle(color, 0.15));
    bg.on('pointerdown', callback);
  }
}
