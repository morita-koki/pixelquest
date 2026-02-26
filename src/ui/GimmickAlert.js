import { FONT_MAIN, GAME_W, GAME_H } from '../constants.js';

export class GimmickAlert {
  constructor(scene) {
    this.scene = scene;
  }

  show(message, color = 0xffffff) {
    const colorStr = '#' + color.toString(16).padStart(6, '0');
    const text = this.scene.add.text(GAME_W / 2, GAME_H * 0.38, message, {
      fontFamily: FONT_MAIN,
      fontSize: '28px',
      color: colorStr,
      stroke: '#000000',
      strokeThickness: 4,
      align: 'center',
    }).setOrigin(0.5).setDepth(200).setScale(0.5).setAlpha(1);

    // Pop-in animation: scale 0.5 → 1.1 → 1.0
    this.scene.tweens.add({
      targets: text,
      scale: 1.1,
      duration: 150,
      ease: 'Quad.Out',
      onComplete: () => {
        this.scene.tweens.add({
          targets: text,
          scale: 1.0,
          duration: 100,
          ease: 'Quad.In',
          onComplete: () => {
            // Hold then fade
            this.scene.time.delayedCall(500, () => {
              this.scene.tweens.add({
                targets: text,
                alpha: 0,
                y: text.y - 20,
                duration: 300,
                onComplete: () => text.destroy(),
              });
            });
          },
        });
      },
    });
  }
}
