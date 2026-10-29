import { rndInt, pick, shuffle } from './util.js';

export const NODE_TYPES = {
  combat:   { id: 'combat',   name: 'Бой',    icon: '⚔️',  color: '#c0392b' },
  elite:    { id: 'elite',    name: 'Элита',  icon: '💀',  color: '#8e44ad' },
  rest:     { id: 'rest',     name: 'Костёр', icon: '🔥',  color: '#e67e22' },
  shop:     { id: 'shop',     name: 'Лавка',  icon: '🛒',  color: '#27ae60' },
  treasure: { id: 'treasure', name: 'Сундук', icon: '🎁',  color: '#f1c40f' },
  boss:     { id: 'boss',     name: 'Босс',   icon: '👑',  color: '#e74c3c' },
};

const ROWS = 9;

function pickType(row) {
  if (row === 0) return 'combat';
  if (row === ROWS - 1) return 'rest';
  const r = Math.random();
  if (r < 0.50) return 'combat';
  if (r < 0.66) return 'elite';
  if (r < 0.78) return 'rest';
  if (r < 0.88) return 'shop';
  return 'treasure';
}

/**
 * Генерирует карту акта.
 * rows[0] — нижний ряд (старт), последний ряд — босс.
 */
export function generateMap(actIndex) {
  const rows = [];

  for (let r = 0; r < ROWS; r++) {
    const count = 3;
    const row = [];
    for (let c = 0; c < count; c++) {
      row.push({ row: r, col: c, type: pickType(r), visited: false, next: [] });
    }
    rows.push(row);
  }
  rows.push([{ row: ROWS, col: 0, type: 'boss', visited: false, next: [] }]);

  // связи
  for (let r = 0; r < rows.length - 1; r++) {
    const cur = rows[r];
    const nxt = rows[r + 1];
    for (let c = 0; c < cur.length; c++) {
      const set = new Set();
      for (const d of [-1, 0, 1]) {
        const nc = Math.max(0, Math.min(nxt.length - 1, c + d));
        set.add(nc);
      }
      cur[c].next = [...set].sort((a, b) => a - b);
    }
  }

  return { actIndex, rows };
}

/** Узлы, доступные из текущей позиции */
export function reachableNodes(map, pos) {
  if (!pos || pos.row < 0) {
    return map.rows[0].map(n => ({ row: n.row, col: n.col, node: n }));
  }
  const cur = map.rows[pos.row][pos.col];
  return cur.next.map(c => ({ row: pos.row + 1, col: c, node: map.rows[pos.row + 1][c] }));
}