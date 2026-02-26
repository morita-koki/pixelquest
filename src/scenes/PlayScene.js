import Phaser from 'phaser';
import {
  GAME_W, GAME_H, COLORS, CELL_SIZE, CELL_GAP, GRID_SIZE,
  FONT_MAIN, FONT_TITLE, GIMMICK_CONFIG, GIMMICK,
} from '../constants.js';
import { countPixels, getChangedIndices } from '../logic/GridLogic.js';
import { applyGimmick, getAlertText } from '../logic/GimmickDefs.js';
import { EventLog } from '../ui/EventLog.js';
import { GimmickAlert } from '../ui/GimmickAlert.js';

const GRID_CELL = CELL_SIZE + CELL_GAP;
const GRID_ORIGIN_X = GAME_W * 0.2 - (GRID_CELL * 1.5 - CELL_GAP / 2);
const GRID_ORIGIN_Y = GAME_H * 0.5 - (GRID_CELL * 1.5 - CELL_GAP / 2);

export class PlayScene extends Phaser.Scene {
  constructor() {
    super('PlayScene');
  }

  init(data) {
    this.grid = data.grid;
    this.stage = data.stage;
    this.totalPixels = data.totalPixels;
    this.stageData = data.stageData;
    this.scrollX = 0;
    this.paused = false;
    this.finished = false;
  }

  create() {
    this.eventLog = new EventLog(this);
    this.gimmickAlert = new GimmickAlert(this);

    // Stage label
    this.add.text(GAME_W / 2, 20, `STAGE ${this.stage}`, {
      fontFamily: FONT_TITLE,
      fontSize: '12px',
      color: '#4eff7a',
    }).setOrigin(0.5).setDepth(50);

    // Grid cell graphics
    this.cellRects = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const x = GRID_ORIGIN_X + col * GRID_CELL + CELL_SIZE / 2;
        const y = GRID_ORIGIN_Y + row * GRID_CELL + CELL_SIZE / 2;
        const rect = this.add.rectangle(x, y, CELL_SIZE, CELL_SIZE, COLORS.PLAYER)
          .setDepth(10);
        this.cellRects.push(rect);
      }
    }
    this.updateGridVisuals();

    // Grid border glow
    const gw = GRID_CELL * 3 - CELL_GAP + 8;
    this.add.rectangle(
      GRID_ORIGIN_X + (GRID_CELL * 3 - CELL_GAP) / 2,
      GRID_ORIGIN_Y + (GRID_CELL * 3 - CELL_GAP) / 2,
      gw, gw
    ).setStrokeStyle(1, COLORS.PLAYER, 0.3).setFillStyle(0x000000, 0).setDepth(9);

    // Gimmick markers (drawn in a container that scrolls)
    this.gimmickMarkers = [];
    for (const gimmick of this.stageData.gimmicks) {
      const cfg = GIMMICK_CONFIG[gimmick.type] || { icon: '?', label: '???', color: 0xffffff };
      const colorStr = '#' + cfg.color.toString(16).padStart(6, '0');

      const container = this.add.container(0, 0).setDepth(5);

      // Vertical line
      const line = this.add.rectangle(0, GAME_H / 2, 2, GAME_H * 0.6, cfg.color, 0.2);
      container.add(line);

      // Icon
      const icon = this.add.text(0, GAME_H * 0.5 - 80, cfg.icon, {
        fontFamily: FONT_MAIN,
        fontSize: '28px',
        color: colorStr,
      }).setOrigin(0.5);
      container.add(icon);

      // Label
      const label = this.add.text(0, GAME_H * 0.5 + 80, cfg.label, {
        fontFamily: FONT_MAIN,
        fontSize: '12px',
        color: colorStr,
      }).setOrigin(0.5);
      container.add(label);

      this.gimmickMarkers.push({ container, gimmick });
    }

    // Progress bar background
    this.progressBg = this.add.rectangle(GAME_W / 2, GAME_H - 20, GAME_W - 60, 6, 0x222233)
      .setDepth(50);
    this.progressFill = this.add.rectangle(
      30, GAME_H - 20, 0, 6, COLORS.PLAYER
    ).setOrigin(0, 0.5).setDepth(51);

    // Pixel count HUD
    this.pixelHud = this.add.text(GAME_W - 20, 20, '', {
      fontFamily: FONT_MAIN,
      fontSize: '14px',
      color: COLORS.TEXT,
    }).setOrigin(1, 0).setDepth(50);
    this.updatePixelHud();

    // Background scrolling dots (parallax decoration)
    this.bgDots = [];
    for (let i = 0; i < 30; i++) {
      const dot = this.add.rectangle(
        Phaser.Math.Between(0, GAME_W),
        Phaser.Math.Between(0, GAME_H),
        2, 2, 0xffffff, Phaser.Math.FloatBetween(0.03, 0.08)
      ).setDepth(0);
      this.bgDots.push(dot);
    }
  }

  update(time, delta) {
    if (this.finished || this.paused) return;

    const speed = this.stageData.speed;
    this.scrollX += speed * (delta / 16.67);

    // Update progress bar
    const progress = Math.min(this.scrollX / this.stageData.length, 1);
    this.progressFill.setSize((GAME_W - 60) * progress, 6);

    // Update gimmick marker positions
    for (const marker of this.gimmickMarkers) {
      const screenX = GAME_W * 0.75 + marker.gimmick.x - this.scrollX;
      marker.container.setPosition(screenX, 0);
      marker.container.setVisible(screenX > -100 && screenX < GAME_W + 100);

      if (marker.gimmick.triggered) {
        marker.container.setAlpha(0.2);
      }
    }

    // Parallax background dots
    for (const dot of this.bgDots) {
      dot.x -= speed * 0.3 * (delta / 16.67);
      if (dot.x < -5) dot.x = GAME_W + 5;
    }

    // Trigger gimmicks
    for (const gimmick of this.stageData.gimmicks) {
      if (!gimmick.triggered && this.scrollX >= gimmick.x) {
        gimmick.triggered = true;
        this.triggerGimmick(gimmick);
        return; // Process one gimmick per frame
      }
    }

    // Check stage clear
    if (this.scrollX >= this.stageData.length) {
      this.stageCleared();
    }
  }

  triggerGimmick(gimmick) {
    this.paused = true;
    const oldGrid = [...this.grid];
    const result = applyGimmick(gimmick.type, this.grid);
    this.grid = result.grid;

    // Alert
    const cfg = GIMMICK_CONFIG[gimmick.type];
    const alertText = getAlertText(gimmick.type, oldGrid, result.grid);
    this.gimmickAlert.show(alertText, cfg ? cfg.color : 0xffffff);

    // Log
    this.eventLog.add(result.logText);

    // Animate grid changes
    this.animateGridChange(oldGrid, this.grid, gimmick.type, () => {
      this.updatePixelHud();

      // Check death
      if (countPixels(this.grid) <= 0) {
        this.playerDied();
        return;
      }

      this.paused = false;
    });
  }

  animateGridChange(oldGrid, newGrid, type, onComplete) {
    const changes = getChangedIndices(oldGrid, newGrid);
    const duration = 200;

    // Animate removed cells
    for (const idx of changes.removed) {
      const rect = this.cellRects[idx];
      const dirY = type === GIMMICK.CEILING ? -1 :
                   type === GIMMICK.FLOOR || type === GIMMICK.GRAVITY ? 1 :
                   type === GIMMICK.ENEMY_BOTTOM ? 1 :
                   type === GIMMICK.ENEMY_TOP ? -1 : 0;

      this.tweens.add({
        targets: rect,
        alpha: 0,
        y: rect.y + dirY * 30,
        scaleX: 0.3,
        scaleY: 0.3,
        duration,
        ease: 'Quad.Out',
      });
    }

    // Animate added cells (flash in)
    for (const idx of changes.added) {
      const rect = this.cellRects[idx];
      rect.setAlpha(0).setScale(1.5);
      this.tweens.add({
        targets: rect,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration,
        ease: 'Quad.Out',
      });
    }

    // After animation, snap visuals to final state
    this.time.delayedCall(duration + 50, () => {
      this.updateGridVisuals();
      if (onComplete) onComplete();
    });
  }

  updateGridVisuals() {
    for (let i = 0; i < 9; i++) {
      const rect = this.cellRects[i];
      const row = Math.floor(i / 3);
      const col = i % 3;
      const x = GRID_ORIGIN_X + col * GRID_CELL + CELL_SIZE / 2;
      const y = GRID_ORIGIN_Y + row * GRID_CELL + CELL_SIZE / 2;

      rect.setPosition(x, y);
      rect.setScale(1);

      if (this.grid[i] === 1) {
        rect.setFillStyle(COLORS.PLAYER, 1);
        rect.setAlpha(1);
        rect.setVisible(true);
      } else {
        rect.setFillStyle(COLORS.GRID_EMPTY, 0.3);
        rect.setAlpha(0.3);
        rect.setVisible(true);
      }
    }
  }

  updatePixelHud() {
    const count = countPixels(this.grid);
    this.pixelHud.setText(`■ × ${count}`);
  }

  stageCleared() {
    this.finished = true;
    const remaining = countPixels(this.grid);

    this.time.delayedCall(500, () => {
      this.scene.start('ResultScene', {
        cleared: true,
        stage: this.stage,
        totalPixels: this.totalPixels,
        remainingPixels: remaining,
        newPixels: 1,
      });
    });
  }

  playerDied() {
    this.finished = true;

    // Flash screen red
    const flash = this.add.rectangle(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 0xff0000, 0.3)
      .setDepth(300);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 800,
      onComplete: () => flash.destroy(),
    });

    this.time.delayedCall(1200, () => {
      this.scene.start('ResultScene', {
        cleared: false,
        stage: this.stage,
        totalPixels: this.totalPixels,
        remainingPixels: 0,
        newPixels: 0,
      });
    });
  }
}
