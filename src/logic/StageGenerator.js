import { STAGE, REMOVAL_GIMMICKS } from '../constants.js';
import { getUnlockedGimmicks } from './GimmickDefs.js';

/**
 * Generate stage data for a given stage number.
 * Returns { gimmicks: [{ type, x }], length, speed }
 */
export function generateStage(stage) {
  const pool = getUnlockedGimmicks(stage);
  const gimmickCount = Math.min(3 + Math.floor(stage * 0.8), 10);
  const speed = STAGE.BASE_SPEED + stage * STAGE.SPEED_INCREMENT;

  const gimmicks = [];
  let x = STAGE.START_MARGIN;

  for (let i = 0; i < gimmickCount; i++) {
    const type = pickGimmick(pool, gimmicks);
    const gap = STAGE.GIMMICK_MIN_GAP +
      Math.random() * (STAGE.GIMMICK_MAX_GAP - STAGE.GIMMICK_MIN_GAP);
    x += gap;
    gimmicks.push({ type, x, triggered: false });
  }

  const length = x + STAGE.END_MARGIN;

  return { gimmicks, length, speed };
}

function pickGimmick(pool, placed) {
  const lastType = placed.length > 0 ? placed[placed.length - 1].type : null;

  // Count recent consecutive removal gimmicks
  let removalStreak = 0;
  for (let i = placed.length - 1; i >= 0; i--) {
    if (REMOVAL_GIMMICKS.includes(placed[i].type)) removalStreak++;
    else break;
  }

  const candidates = pool.filter(type => {
    // Avoid same type consecutively
    if (type === lastType) return false;
    // Avoid 3 consecutive removal gimmicks
    if (removalStreak >= 2 && REMOVAL_GIMMICKS.includes(type)) return false;
    return true;
  });

  // Fallback to full pool if filter was too strict
  const finalPool = candidates.length > 0 ? candidates : pool;
  return finalPool[Math.floor(Math.random() * finalPool.length)];
}

/**
 * Get pixels available for a given stage.
 */
export function getPixelsForStage(stage) {
  return Math.min(stage, 9);
}
