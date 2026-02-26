import { GIMMICK, UNLOCK_TABLE, REMOVAL_GIMMICKS, GIMMICK_CONFIG } from '../constants.js';
import * as Grid from './GridLogic.js';

/**
 * Get all gimmick types unlocked at the given stage.
 */
export function getUnlockedGimmicks(stage) {
  const pool = [];
  for (let s = 1; s <= stage; s++) {
    const unlocks = UNLOCK_TABLE[s];
    if (unlocks) pool.push(...unlocks);
  }
  return pool;
}

/**
 * Apply a gimmick to a grid.
 * Returns { grid, logText }
 */
export function applyGimmick(type, grid) {
  const oldGrid = [...grid];
  let newGrid;
  let logText = '';

  switch (type) {
    case GIMMICK.CEILING: {
      const removed = grid[0] + grid[1] + grid[2];
      newGrid = Grid.removeRow(grid, 0);
      logText = removed > 0
        ? `天井に${removed}ピクセルが削り取られた！`
        : '天井をすり抜けた！';
      break;
    }
    case GIMMICK.FLOOR: {
      const removed = grid[6] + grid[7] + grid[8];
      newGrid = Grid.removeRow(grid, 2);
      logText = removed > 0
        ? `足元の${removed}ピクセルが砕けた……`
        : '足元は無事だった！';
      break;
    }
    case GIMMICK.NARROW: {
      const removed = Grid.countPixels(grid) - Grid.countPixels(Grid.removeCols(grid, [0, 2]));
      newGrid = Grid.removeCols(grid, [0, 2]);
      logText = removed > 0
        ? `狭い通路で${removed}ピクセルが削られた……`
        : '狭路を難なく通過した！';
      break;
    }
    case GIMMICK.ROTATE: {
      newGrid = Grid.rotateCW(grid);
      logText = '世界が90°ねじれた……！';
      break;
    }
    case GIMMICK.GRAVITY: {
      newGrid = Grid.gravity(grid);
      logText = '重力場に突入！ ピクセルが下に崩れた！';
      break;
    }
    case GIMMICK.MIRROR: {
      newGrid = Grid.mirror(grid);
      logText = '鏡の世界を通過した……左右が逆転！';
      break;
    }
    case GIMMICK.SHUFFLE: {
      newGrid = Grid.shuffle(grid);
      logText = '混沌の渦に巻き込まれた！ 形が……変わった！';
      break;
    }
    case GIMMICK.ENEMY_FRONT: {
      const result = Grid.enemyAttack(grid, 1);
      newGrid = result.grid;
      if (result.defended) logText = '前方の敵を撃退した！';
      else if (result.missed) logText = '敵の攻撃は空を切った！';
      else logText = '前方の敵にピクセルを奪われた……';
      break;
    }
    case GIMMICK.ENEMY_TOP: {
      const result = Grid.enemyAttack(grid, 0);
      newGrid = result.grid;
      if (result.defended) logText = '上方の敵を撃退した！';
      else if (result.missed) logText = '上方の攻撃は空を切った！';
      else logText = '上方の敵にピクセルを奪われた……';
      break;
    }
    case GIMMICK.ENEMY_BOTTOM: {
      const result = Grid.enemyAttack(grid, 2);
      newGrid = result.grid;
      if (result.defended) logText = '下方の敵を撃退した！';
      else if (result.missed) logText = '下方の攻撃は空を切った！';
      else logText = '下方の敵にピクセルを奪われた……';
      break;
    }
    default:
      newGrid = [...grid];
      logText = '???';
  }

  return { grid: newGrid, logText, oldGrid };
}

/**
 * Get the alert text for a gimmick.
 */
export function getAlertText(type, oldGrid, newGrid) {
  const cfg = GIMMICK_CONFIG[type];
  if (!cfg) return '';
  const lost = Grid.countPixels(oldGrid) - Grid.countPixels(newGrid);
  if (lost > 0) {
    return `${cfg.icon} ${cfg.label}！ -${lost}px`;
  }
  return `${cfg.icon} ${cfg.label}！`;
}
