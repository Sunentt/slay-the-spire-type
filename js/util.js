/* ============================================================
   util.js — вспомогательные функции
   ============================================================ */

export function rndInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

let _uidCounter = 0;
export function uid() {
  return `u${++_uidCounter}_${Math.random().toString(36).slice(2, 8)}`;
}

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}