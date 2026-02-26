/**
 * Pure grid logic — no Phaser dependency.
 * Grid is always a flat array of 9 elements (0 or 1).
 * Index layout:
 *   [0][1][2]
 *   [3][4][5]
 *   [6][7][8]
 */

export function countPixels(grid) {
  return grid.reduce((sum, v) => sum + v, 0);
}

/** 90° clockwise rotation */
const ROTATE_MAP = [6, 3, 0, 7, 4, 1, 8, 5, 2];

export function rotateCW(grid) {
  const next = new Array(9);
  for (let i = 0; i < 9; i++) {
    next[i] = grid[ROTATE_MAP[i]];
  }
  return next;
}

/** Gravity — each column's pixels fall to the bottom */
export function gravity(grid) {
  const next = [...grid];
  for (let col = 0; col < 3; col++) {
    const vals = [];
    for (let row = 0; row < 3; row++) {
      if (grid[row * 3 + col]) vals.push(1);
    }
    for (let row = 0; row < 3; row++) {
      const filledFrom = 3 - vals.length;
      next[row * 3 + col] = row >= filledFrom ? 1 : 0;
    }
  }
  return next;
}

/** Mirror — swap col 0 and col 2 per row */
export function mirror(grid) {
  const next = [...grid];
  for (let row = 0; row < 3; row++) {
    const base = row * 3;
    next[base + 0] = grid[base + 2];
    next[base + 2] = grid[base + 0];
  }
  return next;
}

/** Shuffle — randomly reposition ON pixels, preserving count */
export function shuffle(grid) {
  const count = countPixels(grid);
  const positions = [];
  for (let i = 0; i < 9; i++) positions.push(i);
  // Fisher-Yates shuffle
  for (let i = positions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }
  const next = new Array(9).fill(0);
  for (let i = 0; i < count; i++) {
    next[positions[i]] = 1;
  }
  return next;
}

/** Remove entire row (0=top, 1=mid, 2=bottom) */
export function removeRow(grid, row) {
  const next = [...grid];
  for (let col = 0; col < 3; col++) {
    next[row * 3 + col] = 0;
  }
  return next;
}

/** Remove specified columns */
export function removeCols(grid, cols) {
  const next = [...grid];
  for (const col of cols) {
    for (let row = 0; row < 3; row++) {
      next[row * 3 + col] = 0;
    }
  }
  return next;
}

/**
 * Enemy attack on a given row.
 * Returns { grid, defended, removed, missed }
 *   defended: col 2 had a pixel → attack blocked
 *   removed: index of pixel that was destroyed (or -1)
 *   missed: row was empty, attack whiffed
 */
export function enemyAttack(grid, row) {
  const next = [...grid];
  const base = row * 3;

  // Check col 2 first (rightmost = shield)
  if (grid[base + 2] === 1) {
    return { grid: next, defended: true, removed: -1, missed: false };
  }

  // Find rightmost pixel in the row
  for (let col = 1; col >= 0; col--) {
    if (grid[base + col] === 1) {
      next[base + col] = 0;
      return { grid: next, defended: false, removed: base + col, missed: false };
    }
  }

  // Row is empty — miss
  return { grid: next, defended: false, removed: -1, missed: true };
}

/**
 * Get the indices that changed between two grids (for animation).
 */
export function getChangedIndices(oldGrid, newGrid) {
  const removed = [];
  const added = [];
  for (let i = 0; i < 9; i++) {
    if (oldGrid[i] === 1 && newGrid[i] === 0) removed.push(i);
    if (oldGrid[i] === 0 && newGrid[i] === 1) added.push(i);
  }
  return { removed, added };
}
