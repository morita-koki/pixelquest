import Phaser from 'phaser';
import {
  GAME_W, GAME_H, COLORS, CELL_SIZE, CELL_GAP, GRID_SIZE,
  FONT_MAIN, FONT_TITLE, GIMMICK_CONFIG,
} from '../constants.js';
import { generateStage } from '../logic/StageGenerator.js';
import { getUnlockedGimmicks } from '../logic/GimmickDefs.js';

const GRID_CELL = CELL_SIZE + CELL_GAP;
const GRID_TOTAL = GRID_CELL * GRID_SIZE - CELL_GAP;

export class EditScene extends Phaser.Scene {
  constructor() {
    super('EditScene');
  }

  init(data) {
    this.stage = data.stage || 1;
    this.totalPixels = data.totalPixels || 1;
    this.grid = new Array(9).fill(0);
  }

  create() {
    const gridOriginX = (GAME_W - GRID_TOTAL) / 2;
    const gridOriginY = 260;

    // HUD — stage number
    this.add.text(GAME_W / 2, 40, `STAGE ${this.stage}`, {
      fontFamily: FONT_TITLE,
      fontSize: '16px',
      color: '#4eff7a',
    }).setOrigin(0.5);

    // Pixel count display
    this.pixelCountText = this.add.text(GAME_W / 2, 200, '', {
      fontFamily: FONT_MAIN,
      fontSize: '18px',
      color: COLORS.TEXT,
    }).setOrigin(0.5);
    this.updatePixelCountText();

    // Instructions
    this.add.text(GAME_W / 2, 228, 'タップでピクセルを配置', {
      fontFamily: FONT_MAIN,
      fontSize: '14px',
      color: COLORS.TEXT_DIM,
    }).setOrigin(0.5);

    // Grid cells
    this.cells = [];
    this.cellBgs = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        const idx = row * 3 + col;
        const x = gridOriginX + col * GRID_CELL;
        const y = gridOriginY + row * GRID_CELL;

        const bg = this.add.rectangle(
          x + CELL_SIZE / 2, y + CELL_SIZE / 2,
          CELL_SIZE, CELL_SIZE,
          COLORS.GRID_EMPTY, 1
        ).setStrokeStyle(1, 0x444466);

        bg.setInteractive({ useHandCursor: true });
        bg.on('pointerdown', () => this.toggleCell(idx));

        this.cellBgs.push(bg);
        this.cells.push({ row, col, idx, bg });
      }
    }

    // Gimmick preview
    const unlocked = getUnlockedGimmicks(this.stage);
    const uniqueTypes = [...new Set(unlocked)];

    this.add.text(GAME_W / 2, 420, '出現ギミック', {
      fontFamily: FONT_MAIN,
      fontSize: '14px',
      color: COLORS.TEXT_DIM,
    }).setOrigin(0.5);

    const previewStartX = GAME_W / 2 - (uniqueTypes.length * 56) / 2 + 28;
    uniqueTypes.forEach((type, i) => {
      const cfg = GIMMICK_CONFIG[type];
      if (!cfg) return;
      const px = previewStartX + i * 56;
      const py = 460;
      const colorStr = '#' + cfg.color.toString(16).padStart(6, '0');

      this.add.text(px, py - 10, cfg.icon, {
        fontFamily: FONT_MAIN,
        fontSize: '20px',
        color: colorStr,
      }).setOrigin(0.5);

      this.add.text(px, py + 14, cfg.label, {
        fontFamily: FONT_MAIN,
        fontSize: '10px',
        color: COLORS.TEXT_DIM,
      }).setOrigin(0.5);
    });

    // Depart button
    this.departBg = this.add.rectangle(GAME_W / 2, 580, 200, 56, COLORS.PLAYER, 0.15)
      .setStrokeStyle(2, COLORS.PLAYER);
    this.departText = this.add.text(GAME_W / 2, 580, '出発', {
      fontFamily: FONT_MAIN,
      fontSize: '22px',
      color: '#4eff7a',
    }).setOrigin(0.5);

    this.departBg.setInteractive({ useHandCursor: true });
    this.departBg.on('pointerdown', () => this.depart());

    this.updateDepartButton();
  }

  toggleCell(idx) {
    if (this.grid[idx] === 1) {
      // Turn off
      this.grid[idx] = 0;
    } else {
      // Turn on — check pixel budget
      const used = this.grid.reduce((s, v) => s + v, 0);
      if (used >= this.totalPixels) return; // No more pixels available
      this.grid[idx] = 1;
    }
    this.updateGridVisuals();
    this.updatePixelCountText();
    this.updateDepartButton();
  }

  updateGridVisuals() {
    for (let i = 0; i < 9; i++) {
      if (this.grid[i] === 1) {
        this.cellBgs[i].setFillStyle(COLORS.PLAYER, 1);
        this.cellBgs[i].setStrokeStyle(1, 0x7fff9a);
      } else {
        this.cellBgs[i].setFillStyle(COLORS.GRID_EMPTY, 1);
        this.cellBgs[i].setStrokeStyle(1, 0x444466);
      }
    }
  }

  updatePixelCountText() {
    const used = this.grid.reduce((s, v) => s + v, 0);
    this.pixelCountText.setText(`ピクセル: ${used} / ${this.totalPixels}`);
  }

  updateDepartButton() {
    const used = this.grid.reduce((s, v) => s + v, 0);
    const enabled = used >= 1;
    this.departBg.setAlpha(enabled ? 1 : 0.3);
    this.departText.setAlpha(enabled ? 1 : 0.3);
  }

  depart() {
    const used = this.grid.reduce((s, v) => s + v, 0);
    if (used < 1) return;

    const stageData = generateStage(this.stage);

    this.scene.start('PlayScene', {
      grid: [...this.grid],
      stage: this.stage,
      totalPixels: this.totalPixels,
      stageData,
    });
  }
}
