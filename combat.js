import { CARDS, ENEMIES, STATUS_INFO } from './js/data.js';
import { rndInt, pick, shuffle, uid } from './js/util.js';

/* ---------- Вспомогательные ---------- */
function makeCard(id, upgraded = false) {
  const def = CARDS[id];
  const stats = { ...def.v, ...(upgraded && def.upg ? def.upg : {}) };
  return { uid: uid(), id, upgraded, stats };
}

function createEnemy(defId) {
  const def = ENEMIES[defId];
  const hp = rndInt(def.hp[0], def.hp[1]);
  return {
    uid: uid(),
    id: defId,
    name: def.name,
    icon: def.icon,
    hp,
    maxHp: hp,
    block: 0,
    status: {},
    isPlayer: false,
    def,
    lastMove: null,
    uses: {},
    intent: null,
  };
}

/* ---------- Контекст карты ---------- */
class CardCtx {
  constructor(combat, card, target) {
    this.cb = combat;
    this.card = card;
    this.target = target;
  }
  get player() { return this.cb.player; }
  get alive() { return this.cb.aliveEnemies; }

  attack(n) {
    if (!this.target || this.target.hp <= 0) return 0;
    return this.cb.playerAttack(this.target, n);
  }
  attackRaw(n) {
    if (!this.target || this.target.hp <= 0) return 0;
    return this.cb.playerAttack(this.target, n, true);
  }
  attackAll(n) {
    let total = 0;
    for (const e of this.cb.aliveEnemies.slice()) total += this.cb.playerAttack(e, n);
    return total;
  }
  block(n) { this.cb.gainBlock(this.cb.player, n); }
  heal(n) { this.cb.healEntity(this.cb.player, n); }
  loseHp(n) { this.cb.loseHp(this.cb.player, n); }
  draw(n) { this.cb.drawCards(n); }
  gainEnergy(n) { this.cb.player.energy += n; }
  gainMaxHp(n) { this.cb.game.maxHp += n; this.cb.player.maxHp += n; this.cb.player.hp += n; }
  statusTarget(k, n) { if (this.target && this.target.hp > 0) this.cb.addStatus(this.target, k, n); }
  statusAll(k, n) { this.cb.aliveEnemies.slice().forEach(e => this.cb.addStatus(e, k, n)); }
  statusSelf(k, n) { this.cb.addStatus(this.cb.player, k, n); }
  multiplyTargetStatus(k, mult) {
    if (!this.target || this.target.hp <= 0) return;
    const cur = this.target.status[k] || 0;
    if (cur > 0) this.target.status[k] = cur * mult;
  }
  doubleStatusSelf(k) {
    const cur = this.cb.player.status[k] || 0;
    if (cur > 0) this.cb.player.status[k] = cur * 2;
  }
  stealStr(n) {
    if (!this.target || this.target.hp <= 0) return;
    this.target.status.str = Math.max(0, (this.target.status.str || 0) - n);
    if (this.target.status.str === 0) delete this.target.status.str;
  }
  addCard(id, dest, n = 1) { for (let i = 0; i < n; i++) this.cb.addCardTo(id, dest); }
}

/* ============================================================
   COMBAT
   ============================================================ */
export class Combat {
  constructor(game, enemyIds, kind) {
    this.game = game;
    this.kind = kind; // 'normal' | 'elite' | 'boss'

    this.player = {
      uid: 'player',
      name: game.charName,
      icon: game.charEmoji,
      hp: game.hp,
      maxHp: game.maxHp,
      block: 0,
      energy: 0,
      maxEnergy: 3,
      status: {},
      isPlayer: true,
    };

    this.enemies = enemyIds.map(createEnemy);

    const deck = game.deck.map(c => makeCard(c.id, c.upgraded));
    this.drawPile = shuffle(deck);
    this.hand = [];
    this.discardPile = [];
    this.exhaustPile = [];

    this.bonusDraw = 0;
    this.firstTurnEnergy = 0;
    this.extraEnergy = 0;

    this.turn = 0;
    this.phase = 'player'; // player | enemy | over
    this.result = null;
    this.token = 0;
    this.onUpdate = null;
    this.onEnd = null;
    this.log = [];
  }

  get aliveEnemies() { return this.enemies.filter(e => e.hp > 0); }

  pushLog(text) {
    this.log.push(text);
    if (this.log.length > 40) this.log.shift();
  }

  update() { this.onUpdate && this.onUpdate(); }

  /* ---------------- Старт ---------------- */
  start() {
    for (const r of this.game.relics) r.onCombatStart && r.onCombatStart(this);
    this.enemies.forEach(e => this.rollIntent(e));
    this.startPlayerTurn(true);
    this.update();
  }

  /* ---------------- Статусы ---------------- */
  addStatus(entity, key, n) {
    if (!n || n <= 0) return;
    if (entity.status.artifact && !STATUS_INFO[key].good) {
      entity.status.artifact -= 1;
      if (entity.status.artifact <= 0) delete entity.status.artifact;
      return;
    }
    entity.status[key] = (entity.status[key] || 0) + n;
  }

  decayStatuses(entity) {
    for (const key of Object.keys(entity.status)) {
      if (STATUS_INFO[key] && STATUS_INFO[key].decay) {
        entity.status[key] -= 1;
        if (entity.status[key] <= 0) delete entity.status[key];
      }
    }
  }

  /* ---------------- Урон ---------------- */
  calcDamage(base, attacker, defender, ignoreStr) {
    let d = base + (ignoreStr ? 0 : (attacker.status.str || 0));
    if (attacker.status.weak) d *= 0.75;
    if (defender.status.vuln) d *= 1.5;
    return Math.max(0, Math.floor(d));
  }

  applyDamage(target, amount, source) {
    if (target.hp <= 0) return 0;
    const blocked = Math.min(target.block, amount);
    target.block -= blocked;
    const real = amount - blocked;
    target.hp -= real;

    if (real > 0 && source === this.player && target !== this.player && this.player.status.envenom) {
      this.addStatus(target, 'poison', this.player.status.envenom);
    }
    if (target.hp <= 0) {
      target.hp = 0;
      this.pushLog(`${target.name} повержен!`);
    }
    return real;
  }

  playerAttack(target, base, ignoreStr = false) {
    if (target.hp <= 0) return 0;
    const dmg = this.calcDamage(base, this.player, target, ignoreStr);
    return this.applyDamage(target, dmg, this.player);
  }

  loseHp(entity, n) {
    entity.hp = Math.max(0, entity.hp - n);
    if (entity.hp <= 0) this.pushLog(`${entity.name} падает без сил...`);
  }

  healEntity(entity, n) {
    entity.hp = Math.min(entity.maxHp, entity.hp + n);
  }

  gainBlock(entity, n) {
    if (n <= 0) return;
    if (entity.status.frail) n = Math.floor(n * 0.75);
    entity.block += n;
    if (entity === this.player && this.player.status.juggernaut) {
      const t = pick(this.aliveEnemies);
      if (t) this.applyDamage(t, this.player.status.juggernaut, this.player);
    }
  }

  /* ---------------- Колода ---------------- */
  addCardTo(id, dest) {
    const card = makeCard(id);
    if (dest === 'hand') this.hand.push(card);
    else if (dest === 'draw') this.drawPile.unshift(card);
    else this.discardPile.push(card);
  }

  drawCards(n) {
    for (let i = 0; i < n; i++) {
      if (this.hand.length >= 10) break;
      if (this.drawPile.length === 0) {
        if (this.discardPile.length === 0) break;
        this.drawPile = shuffle(this.discardPile);
        this.discardPile = [];
      }
      this.hand.push(this.drawPile.pop());
    }
  }

  discardHand() {
    this.discardPile.push(...this.hand);
    this.hand = [];
  }

  /* ---------------- Ходы ---------------- */
  startPlayerTurn(first = false) {
    this.turn += 1;
    if (!first) this.player.block = this.player.status.fortress ? this.player.block : 0;

    this.player.energy = this.player.maxEnergy + this.extraEnergy
      + (first ? this.firstTurnEnergy : 0);

    // силы в начале хода
    if (this.player.status.demon) this.addStatus(this.player, 'str', this.player.status.demon);
    if (this.player.status.regen) this.healEntity(this.player, this.player.status.regen);
    if (this.player.status.fumes) {
      this.aliveEnemies.slice().forEach(e => this.addStatus(e, 'poison', this.player.status.fumes));
    }

    this.drawCards(5 + (first ? Math.max(0, this.bonusDraw) : 0));
    this.phase = 'player';
    this.checkCombatEnd();
  }

  endTurn() {
    if (this.phase !== 'player') return;
    this.phase = 'enemy';

    this.discardHand();
    if (this.player.status.metallicize) this.gainBlock(this.player, this.player.status.metallicize);
    this.decayStatuses(this.player);

    const token = this.token;
    this.update();

    setTimeout(() => {
      if (token !== this.token) return;
      if (this.phase === 'over') return;
      this.resolveEnemyTurn();
    }, 450);
  }

  resolveEnemyTurn() {
    for (const e of this.enemies) {
      if (e.hp <= 0) continue;
      if (this.player.hp <= 0) break;

      // яд тикает в начале хода врага
      if (e.status.poison) {
        const p = e.status.poison;
        this.applyDamage(e, p, null);
        e.status.poison -= 1;
        if (e.status.poison <= 0) delete e.status.poison;
        if (e.hp <= 0) { this.checkCombatEnd(); continue; }
      }

      const move = e.intent;
      if (move) this.execMove(e, move);

      if (e.hp > 0) {
        this.decayStatuses(e);
        this.rollIntent(e);
      }
      if (this.player.hp <= 0) break;
    }

    this.checkCombatEnd();
    if (this.phase === 'over') { this.update(); return; }

    this.startPlayerTurn(false);
    this.update();
  }

  execMove(enemy, move) {
    this.pushLog(`${enemy.name}: ${move.name}`);

    if (move.dmg) {
      const hits = move.hits || 1;
      for (let i = 0; i < hits; i++) {
        if (this.player.hp <= 0) break;
        const dmg = this.calcDamage(move.dmg, enemy, this.player);
        this.applyDamage(this.player, dmg, enemy);
        if (this.player.status.thorns) {
          this.applyDamage(enemy, this.player.status.thorns, this.player);
          if (enemy.hp <= 0) break;
        }
      }
    }
    if (move.block) this.gainBlock(enemy, move.block);
    if (move.heal) this.healEntity(enemy, move.heal);
    if (move.self) move.self.forEach(([k, n]) => this.addStatus(enemy, k, n));
    if (move.player) move.player.forEach(([k, n]) => this.addStatus(this.player, k, n));
  }

  rollIntent(enemy) {
    const def = enemy.def;

    if (def.pattern) {
      const idx = (enemy.uses.__pattern || 0) % def.pattern.length;
      const moveId = def.pattern[idx];
      enemy.uses.__pattern = idx + 1;
      enemy.intent = def.moves.find(m => m.id === moveId) || def.moves[0];
      enemy.lastMove = enemy.intent.id;
      return;
    }

    const options = def.moves.filter(m => {
      if (m.maxUses && (enemy.uses[m.id] || 0) >= m.maxUses) return false;
      if (def.moves.length > 1 && enemy.lastMove === m.id && def.moves.length > 2) return false;
      return true;
    });
    const pool = options.length ? options : def.moves;

    let total = pool.reduce((s, m) => s + (m.weight || 1), 0);
    let r = Math.random() * total;
    let chosen = pool[pool.length - 1];
    for (const m of pool) {
      r -= (m.weight || 1);
      if (r <= 0) { chosen = m; break; }
    }

    enemy.intent = chosen;
    enemy.lastMove = chosen.id;
    enemy.uses[chosen.id] = (enemy.uses[chosen.id] || 0) + 1;
  }

  /* ---------------- Розыгрыш карты ---------------- */
  playCard(card, target) {
    if (this.phase !== 'player') return false;
    const def = CARDS[card.id];
    const s = card.stats;

    if (s.cost > this.player.energy) return false;
    if (def.target === 'enemy' && (!target || target.hp <= 0)) return false;

    const idx = this.hand.indexOf(card);
    if (idx < 0) return false;

    this.player.energy -= s.cost;
    this.hand.splice(idx, 1);

    const ctx = new CardCtx(this, card, target);
    try {
      def.play(ctx, s);
    } catch (err) {
      console.error('Ошибка карты', card.id, err);
    }

    // Тысяча порезов
    if (this.player.status.cuts) {
      this.aliveEnemies.slice().forEach(e =>
        this.applyDamage(e, this.player.status.cuts, this.player));
    }

    if (def.type === 'power') {
      // силы уходят «в игру» — просто не попадают в сброс
    } else if (def.exhaust) {
      this.exhaustPile.push(card);
    } else {
      this.discardPile.push(card);
    }

    this.checkCombatEnd();
    this.update();
    return true;
  }

  /* ---------------- Итог боя ---------------- */
  checkCombatEnd() {
    if (this.phase === 'over') return;
    if (this.player.hp <= 0) {
      this.player.hp = 0;
      this.phase = 'over';
      this.result = 'lose';
      this.game.hp = 0;
      setTimeout(() => this.onEnd && this.onEnd('lose'), 500);
      return;
    }
    if (this.aliveEnemies.length === 0) {
      this.phase = 'over';
      this.result = 'win';
      this.game.hp = this.player.hp;
      setTimeout(() => this.onEnd && this.onEnd('win'), 500);
    }
  }

  /* ---------------- Предпросмотр урона для UI ---------------- */
  intentDamage(enemy) {
    if (!enemy.intent || !enemy.intent.dmg) return null;
    return this.calcDamage(enemy.intent.dmg, enemy, this.player);
  }

  getStatsPreview(card) {
    return card.stats;
  }
}

export { makeCard };