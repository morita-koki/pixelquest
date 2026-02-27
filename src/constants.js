// ── Colors ──
export const COLORS = {
  BG:         0x0a0a0c,
  PLAYER:     0x4eff7a,
  ENEMY:      0xfb7185,
  CEILING:    0xf87171,
  FLOOR:      0xf87171,
  NARROW:     0xfbbf24,
  ROTATE:     0xa78bfa,
  GRAVITY:    0x60a5fa,
  MIRROR:     0x34d399,
  SHUFFLE:    0xc084fc,
  UI_ACCENT:  0xffd644,
  TEXT:        '#e0e0e0',
  TEXT_DIM:    '#888888',
  GRID_EMPTY: 0x222233,
};

// ── Dimensions ──
export const GAME_W = 800;
export const GAME_H = 480;
export const CELL_SIZE = 32;
export const CELL_GAP = 4;
export const GRID_SIZE = 3;

// ── Fonts ──
export const FONT_MAIN  = 'DotGothic16';
export const FONT_TITLE = '"Press Start 2P"';

// ── Gimmick types ──
export const GIMMICK = {
  CEILING:      'ceiling',
  FLOOR:        'floor',
  NARROW:       'narrow',
  ROTATE:       'rotate',
  GRAVITY:      'gravity',
  MIRROR:       'mirror',
  SHUFFLE:      'shuffle',
  ENEMY_FRONT:  'enemy_front',
  ENEMY_TOP:    'enemy_top',
  ENEMY_BOTTOM: 'enemy_bottom',
};

// Category helpers
export const REMOVAL_GIMMICKS = [GIMMICK.CEILING, GIMMICK.FLOOR, GIMMICK.NARROW];

// ── Gimmick visual config ──
export const GIMMICK_CONFIG = {
  [GIMMICK.CEILING]:      { label: '天井',     icon: '▼', color: COLORS.CEILING },
  [GIMMICK.FLOOR]:        { label: '底',       icon: '▲', color: COLORS.FLOOR },
  [GIMMICK.NARROW]:       { label: '狭路',     icon: '◁▷', color: COLORS.NARROW },
  [GIMMICK.ROTATE]:       { label: '回転',     icon: '↻',  color: COLORS.ROTATE },
  [GIMMICK.GRAVITY]:      { label: '重力',     icon: '↓',  color: COLORS.GRAVITY },
  [GIMMICK.MIRROR]:       { label: '反転',     icon: '⇔', color: COLORS.MIRROR },
  [GIMMICK.SHUFFLE]:      { label: 'シャッフル', icon: '✦', color: COLORS.SHUFFLE },
  [GIMMICK.ENEMY_FRONT]:  { label: '前方の敵', icon: '◆',  color: COLORS.ENEMY },
  [GIMMICK.ENEMY_TOP]:    { label: '上方の敵', icon: '◆',  color: COLORS.ENEMY },
  [GIMMICK.ENEMY_BOTTOM]: { label: '下方の敵', icon: '◆',  color: COLORS.ENEMY },
};

// ── Unlock table (stage → newly unlocked gimmicks) ──
export const UNLOCK_TABLE = {
  1: [GIMMICK.CEILING, GIMMICK.ENEMY_FRONT],
  2: [GIMMICK.NARROW, GIMMICK.ENEMY_TOP],
  3: [GIMMICK.ROTATE],
  4: [GIMMICK.GRAVITY, GIMMICK.ENEMY_BOTTOM],
  5: [GIMMICK.MIRROR],
  6: [GIMMICK.FLOOR],
  7: [GIMMICK.SHUFFLE],
};

// ── Stage generation params ──
export const STAGE = {
  BASE_SPEED: 2.0,
  SPEED_INCREMENT: 0.15,
  GIMMICK_MIN_GAP: 300,
  GIMMICK_MAX_GAP: 400,
  START_MARGIN: 500,
  END_MARGIN: 300,
};

// ── Flavor texts ──
export const CLEAR_TEXTS = [
  '3×3の小さな体で、世界を越えた。',
  'ピクセルは少なくとも、勇気は無限大。',
  'その形に、正解はない。ただ、生き残った形があるだけだ。',
  'わずか数ドットの英雄譚が、また1ページ刻まれた。',
  '削られてなお進む者を、人は勇者と呼ぶ。',
];

export const DEATH_TEXTS = [
  '最後のピクセルが闇に溶けた……',
  '0ピクセル。存在すら許されない。',
  'その形では、この世界を越えられなかった。',
  'すべてのドットが散った。だが、また組み直せる。',
  '勇者は消えた。しかしグリッドは、まだそこにある。',
];
