import { FONT_MAIN, GAME_W } from '../constants.js';

const MAX_LOGS = 4;
const DISPLAY_TIME = 2000;
const FADE_TIME = 500;
const LOG_Y_START = 60;
const LOG_Y_GAP = 28;

export class EventLog {
  constructor(scene) {
    this.scene = scene;
    this.entries = [];
  }

  add(message) {
    const text = this.scene.add.text(GAME_W / 2, LOG_Y_START, message, {
      fontFamily: FONT_MAIN,
      fontSize: '16px',
      color: '#e0e0e0',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5, 0).setDepth(100);

    const entry = { text, timer: 0 };
    this.entries.unshift(entry);

    // Reposition all entries
    this.repositionAll();

    // Remove excess
    while (this.entries.length > MAX_LOGS) {
      const old = this.entries.pop();
      old.text.destroy();
    }

    // Auto-remove after delay
    this.scene.time.delayedCall(DISPLAY_TIME, () => {
      this.scene.tweens.add({
        targets: text,
        alpha: 0,
        duration: FADE_TIME,
        onComplete: () => {
          text.destroy();
          const idx = this.entries.indexOf(entry);
          if (idx >= 0) this.entries.splice(idx, 1);
          this.repositionAll();
        },
      });
    });
  }

  repositionAll() {
    for (let i = 0; i < this.entries.length; i++) {
      const entry = this.entries[i];
      if (entry.text.active) {
        this.scene.tweens.add({
          targets: entry.text,
          y: LOG_Y_START + i * LOG_Y_GAP,
          duration: 150,
          ease: 'Quad.Out',
        });
      }
    }
  }

  destroy() {
    for (const entry of this.entries) {
      entry.text.destroy();
    }
    this.entries = [];
  }
}
