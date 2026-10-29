import { CARDS, CHARACTERS, RELICS, ENEMIES, ACTS, COLOR_BY_CHAR } from './data.js';
import { generateMap, reachableNodes, NODE_TYPES } from './map.js';
import { Combat, makeCard } from '../combat.js';
import { rndInt, pick, shuffle, uid, clamp } from './util.js';

const SAVE_KEY = 'spire_best_v1';

function loadBest() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return { wins: 0, bestAct: 0, bestFloor: 0 };
    const o = JSON.parse(raw);
    return {
      wins: o.wins | 0,
      bestAct: o.bestAct | 0,
      bestFloor: o.bestFloor | 0,
    };
  } catch (e) {
    return { wins: 0, bestAct: 0, bestFloor: 0 };
  }
}

function saveBest(best) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(best));
  } catch (e) { /* приватный режим — молча игнорируем */ }
}

export function upgradeCard(card) {
  if (card.upgraded) return false;
  const def = CARDS[card.id];
  if (!def.upg) return false;
  card.upgraded = true;
  card.stats = { ...def.v, ...def.upg };
  return true;
}

export class Game {
  constructor(onChange) {
    this.onChange = onChange || (() => {});
    this.best = loadBest();
    this.screen = 'menu';
    this.resetRun();
  }

  emit() { this.onChange(); }

  resetRun() {
    this.screen = 'menu';
    this.charId = null;
    this.charName = '';
    this.charEmoji = '';
    this.charColor = 'red';
    this.deck = [];
    this.relics = [];
    this.hp = 0;
    this.maxHp = 0;
    this.gold = 0;
    this.act = 0;
    this.map = null;
    this.pos = null;
    this.combat = null;
    this.pending = null;
    this.floors = 0;
    this.runOver = false;
  }

  /* ---------------- Новая игра ---------------- */
  newRun(charId) {
    const ch = CHARACTERS[charId];
    this.charId = charId;
    this.charName = ch.name;
    this.charEmoji = ch.emoji;
    this.charColor = ch.color;

    this.deck = ch.deck.map(id => makeCard(id));
    this.relics = [];
    this.addRelic(ch.relic, true);

    this.maxHp = ch.maxHp;
    this.hp = ch.maxHp;
    this.gold = 99;
    this.act = 0;
    this.floors = 0;
    this.runOver = false;
    this.map = generateMap(0);
    this.pos = { row: -1, col: 0 };
    this.screen = 'map';
    this.emit();
  }

  /* ---------------- Реликвии ---------------- */
  addRelic(id, silent) {
    if (this.relics.some(r => r.id === id)) return false;
    const def = RELICS[id];
    const inst = { ...def };
    this.relics.push(inst);
    if (def.onPickup) def.onPickup(this);
    return true;
  }

  hasRelic(id) { return this.relics.some(r => r.id === id); }

  healOutOfCombat(n) {
    this.hp = clamp(this.hp + n, 0, this.maxHp);
  }

  /* ---------------- Карта ---------------- */
  reachable() { return reachableNodes(this.map, this.pos); }

  canEnter(row, col) {
    return this.reachable().some(n => n.row === row && n.col === col);
  }

  enterNode(row, col) {
    if (!this.canEnter(row, col)) return;
    const node = this.map.rows[row][col];
    this.pos = { row, col };
    node.visited = true;
    this.floors += 1;

    if (row > this.best.bestFloor) {
      this.best.bestFloor = row;
      this.best.bestAct = this.act;
      saveBest(this.best);
    }

    switch (node.type) {
      case 'combat':   this.startCombat('normal'); break;
      case 'elite':    this.startCombat('elite'); break;
      case 'boss':     this.startCombat('boss'); break;
      case 'rest':     this.screen = 'rest'; this.emit(); break;
      case 'shop':     this.openShop(); break;
      case 'treasure': this.openTreasure(); break;
    }
  }

  /* ---------------- Бой ---------------- */
  startCombat(kind) {
    const act = ACTS[this.act];
    let enemyIds = [];

    if (kind === 'boss') {
      enemyIds = [act.boss];
    } else if (kind === 'elite') {
      enemyIds = [pick(act.elite)];
    } else {
      const count = this.act === 0 ? rndInt(1, 2) : rndInt(2, 3);
      const pool = shuffle(act.normal);
      for (let i = 0; i < count; i++) enemyIds.push(pool[i % pool.length]);
    }

    this.combatKind = kind;
    this.combat = new Combat(this, enemyIds, kind);
    this.combat.onUpdate = () => this.emit();
    this.combat.onEnd = (res) => this.endCombat(res);
    this.screen = 'combat';
    this.emit();
    this.combat.start();
  }

  endCombat(result) {
    const cb = this.combat;
    if (result === 'lose') {
      this.screen = 'end';
      this.runOver = true;
      this.emit();
      return;
    }

    this.hp = cb.player.hp;
    this.maxHp = cb.player.maxHp;

    // реликвии «после боя»
    for (const r of this.relics) {
      if (r.onCombatEnd) r.onCombatEnd(this);
    }

    const goldBase = this.combatKind === 'boss' ? rndInt(80, 110)
      : this.combatKind === 'elite' ? rndInt(35, 50)
      : rndInt(12, 22);
    this.gold += goldBase;

    // формируем награду
    const reward = { gold: goldBase, cards: [], relic: null, bossRelics: null };

    // карты
    reward.cards = this.rollCardChoices(3);

    if (this.combatKind === 'elite') {
      const r = this.randomRelic(['starter', 'boss']);
      if (r) reward.relic = r;
    }
    if (this.combatKind === 'boss') {
      reward.bossRelics = this.randomBossRelics(3);
    }

    this.pending = reward;

    if (this.combatKind === 'boss') {
      // награда за босса — отдельный экран
      this.screen = 'reward';
      this.emit();
    } else {
      this.screen = 'reward';
      this.emit();
    }
  }

  /* ---------------- Пул карт ---------------- */
  rollCardChoices(n) {
    const color = COLOR_BY_CHAR[this.charId];
    const pool = Object.values(CARDS).filter(c =>
      (c.color === color || c.color === 'colorless') &&
      c.rarity !== 'basic' && c.rarity !== 'special'
    );
    const chosen = [];
    const used = new Set();
    let guard = 0;
    while (chosen.length < n && guard++ < 200) {
      const c = pick(pool);
      if (used.has(c.id)) continue;
      // редкие карты выпадают реже
      if (c.rarity === 'rare' && Math.random() < 0.55) continue;
      used.add(c.id);
      chosen.push(c);
    }
    return chosen.map(def => makeCard(def.id));
  }

  takeCard(card) {
    this.deck.push(makeCard(card.id, card.upgraded));
  }

  /* ---------------- Реликвии из наград ---------------- */
  randomRelic(excludeRarities = []) {
    const owned = new Set(this.relics.map(r => r.id));
    const pool = Object.values(RELICS).filter(r =>
      !owned.has(r.id) && !excludeRarities.includes(r.rarity)
    );
    if (!pool.length) return null;
    const def = pick(pool);
    return def;
  }

  randomBossRelics(n) {
    const owned = new Set(this.relics.map(r => r.id));
    const pool = Object.values(RELICS).filter(r => r.rarity === 'boss' && !owned.has(r.id));
    return shuffle(pool).slice(0, n);
  }

  /* ---------------- Лавка ---------------- */
  openShop() {
    const cards = this.rollCardChoices(4).map(c => ({
      card: c,
      price: c.stats.cost >= 3 ? rndInt(110, 150) : rndInt(45, 85)
    }));
    const relicDef = this.randomRelic(['starter', 'boss']);
    const relic = relicDef ? { def: relicDef, price: rndInt(140, 200) } : null;

    this.pending = { cards, relic, boughtCards: new Set(), boughtRelic: false };
    this.screen = 'shop';
    this.emit();
  }

  buyCard(index) {
    const p = this.pending;
    if (!p || p.boughtCards.has(index)) return;
    const item = p.cards[index];
    if (this.gold < item.price) return;
    this.gold -= item.price;
    this.takeCard(item.card);
    p.boughtCards.add(index);
    this.emit();
  }

  buyRelic() {
    const p = this.pending;
    if (!p || !p.relic || p.boughtRelic) return;
    if (this.gold < p.relic.price) return;
    this.gold -= p.relic.price;
    this.addRelic(p.relic.def.id);
    p.boughtRelic = true;
    this.emit();
  }

  /* ---------------- Сундук ---------------- */
  openTreasure() {
    const def = this.randomRelic(['starter', 'boss']);
    if (def) this.addRelic(def.id);
    this.pending = { relic: def, gold: rndInt(20, 45) };
    this.gold += this.pending.gold;
    this.screen = 'reward';
    this.pending.treasureOnly = true;
    this.emit();
  }

  /* ---------------- Костёр ---------------- */
  restHeal() {
    if (this.hasRelic('kingsSeal')) return;
    this.healOutOfCombat(Math.floor(this.maxHp * 0.3));
    this.pending = null;
    this.afterRest();
  }

  restUpgrade(cardUid) {
    const card = this.deck.find(c => c.uid === cardUid);
    if (!card) return;
    if (!upgradeCard(card)) return;
    this.pending = null;
    this.afterRest();
  }

  afterRest() {
    this.emit();
    this.advanceAfterNode();
  }

  /* ---------------- Переход после узла ---------------- */
  advanceAfterNode() {
    const node = this.map.rows[this.pos.row][this.pos.col];

    if (node.type === 'boss') {
      if (this.act >= ACTS.length - 1) {
        this.runOver = true;
        this.best.wins += 1;
        saveBest(this.best);
        this.screen = 'end';
        this.emit();
        return;
      }
      this.act += 1;
      this.map = generateMap(this.act);
      this.pos = { row: -1, col: 0 };
      this.emit();
      this.screen = 'map';
      this.emit();
      return;
    }

    this.screen = 'map';
    this.emit();
  }

  /* ---------------- Финал ---------------- */
  finishReward() {
    this.pending = null;
    if (this.combatKind === 'boss' && this.pos && this.map.rows[this.pos.row][this.pos.col].type === 'boss') {
      this.advanceAfterNode();
    } else {
      this.screen = 'map';
      this.emit();
    }
  }
}