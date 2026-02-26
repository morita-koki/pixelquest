import Phaser from 'phaser';
import { GAME_W, GAME_H, COLORS, FONT_MAIN, FONT_TITLE } from '../constants.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    // Floating pixel particles
    this.pixels = [];
    for (let i = 0; i < 20; i++) {
      const px = this.add.rectangle(
        Phaser.Math.Between(40, GAME_W - 40),
        Phaser.Math.Between(40, GAME_H - 40),
        Phaser.Math.Between(4, 10),
        Phaser.Math.Between(4, 10),
        COLORS.PLAYER,
        Phaser.Math.FloatBetween(0.1, 0.35)
      );
      this.pixels.push({
        obj: px,
        vy: Phaser.Math.FloatBetween(-0.3, -0.8),
        vx: Phaser.Math.FloatBetween(-0.2, 0.2),
      });
    }

    // Title — two lines
    this.add.text(GAME_W / 2, 260, '1 PIXEL', {
      fontFamily: FONT_TITLE,
      fontSize: '32px',
      color: '#4eff7a',
    }).setOrigin(0.5);

    this.add.text(GAME_W / 2, 310, 'QUEST', {
      fontFamily: FONT_TITLE,
      fontSize: '32px',
      color: '#4eff7a',
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(GAME_W / 2, 370, '形が、運命。', {
      fontFamily: FONT_MAIN,
      fontSize: '18px',
      color: COLORS.TEXT_DIM,
    }).setOrigin(0.5);

    // START button
    const btnBg = this.add.rectangle(GAME_W / 2, 520, 200, 56, COLORS.PLAYER, 0.15)
      .setStrokeStyle(2, COLORS.PLAYER);
    const btnText = this.add.text(GAME_W / 2, 520, 'START', {
      fontFamily: FONT_TITLE,
      fontSize: '18px',
      color: '#4eff7a',
    }).setOrigin(0.5);

    btnBg.setInteractive({ useHandCursor: true });
    btnBg.on('pointerover', () => {
      btnBg.setFillStyle(COLORS.PLAYER, 0.3);
    });
    btnBg.on('pointerout', () => {
      btnBg.setFillStyle(COLORS.PLAYER, 0.15);
    });
    btnBg.on('pointerdown', () => {
      this.scene.start('EditScene', { stage: 1, totalPixels: 1 });
    });

    // Pulse animation on button
    this.tweens.add({
      targets: [btnBg, btnText],
      alpha: { from: 1, to: 0.6 },
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  update() {
    // Animate floating pixels
    for (const p of this.pixels) {
      p.obj.y += p.vy;
      p.obj.x += p.vx;
      if (p.obj.y < -20) {
        p.obj.y = GAME_H + 20;
        p.obj.x = Phaser.Math.Between(40, GAME_W - 40);
      }
    }
  }
}
