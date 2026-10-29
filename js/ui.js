import { CARDS, RELICS, STATUS_INFO, CHARACTERS, ACTS } from './data.js';
import { NODE_TYPES } from './map.js';
import { upgradeCard } from './game.js';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function el(tag, attrs = {}, ...children) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'style') e.style.cssText = v;
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else if (k === 'html') e.innerHTML = v;
    else if (v !== undefined && v !== null) e.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null) continue;
    e.append(c.nodeType ? c : document.createTextNode(String(c)));
  }
  return e;
}

export function showScreen(name) {
  $$('.view').forEach(v => v.classList.remove('active'));
  const v = document.getElementById('view-' + name);
  if (v) v.classList.add('active');
}

export function toast(text) {
  const t = $('#toast');
  t.textContent = text;
  t.classList.remove('hidden');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.add('hidden'), 1600);
}

/* ---------- HUD ---------- */
export function renderHud(game) {
  const inRun = game.charId;
  $('#hud-char').textContent = inRun ? `${game.charEmoji} ${game.charName}` : '';
  $('#hud-hp').textContent = inRun ? `❤ ${game.hp}/${game.maxHp}` : '';
  $('#hud-gold').textContent = inRun ? `🪙 ${game.gold}` : '';
  $('#hud-act').textContent = inRun && ACTS[game.act] ? ACTS[game.act].name : '';
  $('#btn-relics').style.display = inRun ? '' : 'none';
  $('#btn-deck').style.display = inRun ? '' : 'none';
}

/* ============================================================
   МЕНЮ
   ============================================================ */
export function renderMenu(game) {
  const v = $('#view-menu');
  v.innerHTML = '';
  const best = game.best;
  v.append(
    el('div', { class: 'menu-wrap' },
      el('h1', { class: 'game-title' }, 'ШПИЛЬ ТЕНЕЙ'),
      el('div', { class: 'game-sub' }, 'карточный рогалик · 3 акта · 3 героя'),
      el('div', { class: 'menu-buttons' },
        el('button', { class: 'btn primary', onclick: () => { game.screen = 'char'; game.emit(); } }, 'Новая игра'),
        el('button', { class: 'btn', onclick: () => showDeckModal(game) }, 'Колода'),
        el('button', { class: 'btn', onclick: () => showHelp() }, 'Как играть')
      ),
      el('div', { class: 'record-line' },
        `Побед: ${best.wins} · Лучший этаж: ${best.bestFloor} · Лучший акт: ${best.bestAct + 1}`)
    )
  );
  showScreen('menu');
}

/* ============================================================
   ВЫБОР ПЕРСОНАЖА
   ============================================================ */
export function renderCharSelect(game) {
  const v = $('#view-char');
  v.innerHTML = '';
  const grid = el('div', { class: 'char-grid' });

  for (const ch of Object.values(CHARACTERS)) {
    const relic = RELICS[ch.relic];
    grid.append(
      el('div', { class: 'char-card', onclick: () => { game.newRun(ch.id); } },
        el('div', { class: 'emoji' }, ch.emoji),
        el('h3', {}, ch.name),
        el('div', { class: 'desc' }, ch.desc),
        el('div', { class: 'relic-item', style: 'width:100%;padding:8px;' },
          el('div', { class: 'ico' }, relic.icon),
          el('div', { class: 'rname' }, relic.name),
          el('div', { class: 'rdesc' }, relic.desc)
        ),
        el('div', { class: 'char-stats' },
          el('span', {}, `❤ ${ch.maxHp}`),
          el('span', {}, `🃏 ${ch.deck.length}`)
        )
      )
    );
  }

  v.append(
    el('h2', { class: 'section-title' }, 'ВЫБЕРИТЕ ГЕРОЯ'),
    grid,
    el('div', { class: 'center-buttons', style: 'margin-top:24px;' },
      el('button', { class: 'btn', onclick: () => { game.screen = 'menu'; game.emit(); } }, 'Назад')
    )
  );
  showScreen('char');
}

/* ============================================================
   КАРТА
   ============================================================ */
export function renderMap(game) {
  const v = $('#view-map');
  v.innerHTML = '';

  const ROW_H = 108;
  const rows = game.map.rows;
  const height = rows.length * ROW_H + 60;

  const wrap = el('div', { class: 'map-wrap', style: `height:${height}px;` });

  // SVG линии
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('class', 'map-svg');
  svg.setAttribute('viewBox', `0 0 100 ${height}`);
  svg.setAttribute('preserveAspectRatio', 'none');

  const posOf = (r, c) => {
    const count = rows[r].length;
    const x = ((c + 0.5) / count) * 100;
    const y = height - (r * ROW_H + 50);
    return { x, y };
  };

  for (let r = 0; r < rows.length - 1; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      const node = rows[r][c];
      const a = posOf(r, c);
      for (const nc of node.next) {
        const b = posOf(r + 1, nc);
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
        line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
        line.setAttribute('stroke', '#3a4257');
        line.setAttribute('stroke-width', '0.45');
        line.setAttribute('stroke-dasharray', '1.4 1.2');
        svg.appendChild(line);
      }
    }
  }
  wrap.appendChild(svg);

  // узлы
  const reach = game.reachable();
  const reachSet = new Set(reach.map(n => `${n.row}:${n.col}`));

  for (let r = 0; r < rows.length; r++) {
    for (let c = 0; c < rows[r].length; c++) {
      const node = rows[r][c];
      const type = NODE_TYPES[node.type];
      const p = posOf(r, c);
      const isReach = reachSet.has(`${r}:${c}`);
      const isCurrent = game.pos && game.pos.row === r && game.pos.col === c;

      const div = el('div', {
        class: `map-node${isReach ? ' reachable' : ''}${node.visited && !isCurrent ? ' visited' : ''}${isCurrent ? ' current' : ''}${node.type === 'boss' ? ' boss' : ''}`,
        style: `left:${p.x}%; bottom:${height - p.y - 27}px; border-color:${isReach ? '#e8c15a' : type.color};`,
        title: type.name,
      }, type.icon);

      if (isReach) {
        div.addEventListener('click', () => game.enterNode(r, c));
      }
      wrap.appendChild(div);
    }
  }

  v.append(wrap);

  const scrollEl = v;
  requestAnimationFrame(() => {
    const cur = wrap.querySelector('.current');
    if (cur) cur.scrollIntoView({ block: 'center', behavior: 'smooth' });
  });

  showScreen('map');
}

/* ============================================================
   БОЙ
   ============================================================ */
let selectedCard = null;

export function resetSelection() { selectedCard = null; }

export function renderCombat(game) {
  const cb = game.combat;
  if (!cb) return;
  const v = $('#view-combat');
  v.innerHTML = '';

  const layout = el('div', { class: 'combat-layout' });

  /* --- Враги --- */
  const enemiesRow = el('div', { class: 'enemies-row' });
  for (const e of cb.enemies) {
    const dead = e.hp <= 0;
    const canTarget = selectedCard && CARDS[selectedCard.id].target === 'enemy' && !dead;

    const intentText = (() => {
      if (dead || !e.intent) return '';
      const m = e.intent;
      const dmg = cb.intentDamage(e);
      if (m.dmg) {
        const hits = m.hits || 1;
        return `⚔ ${dmg}${hits > 1 ? '×' + hits : ''}`;
      }
      if (m.block && m.self) return '⬆ Укрепление';
      if (m.self) return '⬆ Усиление';
      if (m.player) return '⬇ Ослабление';
      if (m.block) return '🛡 Защита';
      if (m.heal) return '💚 Лечение';
      return '?';
    })();

    const intentClass = (() => {
      if (!e.intent) return '';
      if (e.intent.dmg) return 'attack';
      if (e.intent.self) return 'buff';
      if (e.intent.player) return 'debuff';
      return 'defend';
    })();

    const node = el('div', {
      class: `enemy${dead ? ' dead' : ''}${canTarget ? ' targetable' : ''}`,
      onclick: () => {
        if (canTarget) playSelected(game, e);
      }
    },
      el('div', { class: `intent ${intentClass}` }, intentText),
      el('div', { class: 'enemy-body' }, e.icon),
      el('div', { class: 'enemy-name' }, e.name),
      el('div', { class: 'hp-bar' },
        el('div', { class: 'fill', style: `width:${(e.hp / e.maxHp) * 100}%` }),
        el('div', { class: 'text' }, `${e.hp}/${e.maxHp}`)
      ),
      e.block > 0 ? el('div', { class: 'block-badge' }, `🛡 ${e.block}`) : null,
      statusList(e.status)
    );
    enemiesRow.append(node);
  }
  layout.append(enemiesRow);

  /* --- Игрок --- */
  const p = cb.player;
  layout.append(
    el('div', { class: 'player-area' },
      el('div', { class: 'player-avatar' }, p.icon),
      el('div', { class: 'player-info' },
        el('div', { style: 'font-weight:700;color:#e8c15a;margin-bottom:4px;' }, p.name),
        el('div', { class: 'hp-bar player' },
          el('div', { class: 'fill', style: `width:${(p.hp / p.maxHp) * 100}%` }),
          el('div', { class: 'text' }, `${p.hp}/${p.maxHp}`)
        ),
        p.block > 0 ? el('div', { class: 'block-badge' }, `🛡 ${p.block}`) : null,
        statusList(p.status)
      ),
      el('div', { class: 'energy-orb' }, `${p.energy}/${p.maxEnergy + cb.extraEnergy}`)
    )
  );

  /* --- Рука --- */
  const hand = el('div', { class: 'hand' });
  for (const card of cb.hand) {
    const def = CARDS[card.id];
    const s = card.stats;
    const playable = s.cost <= p.energy && cb.phase === 'player';
    const div = el('div', {
      class: `card ${def.type}${card.upgraded ? ' upgraded' : ''}${selectedCard === card ? ' selected' : ''}${playable ? '' : ' unplayable'}`,
      onclick: (ev) => {
        ev.stopPropagation();
        if (!playable) return;
        if (def.target === 'enemy') {
          selectedCard = (selectedCard === card) ? null : card;
          renderCombat(game);
        } else {
          selectedCard = card;
          playSelected(game, null);
        }
      }
    },
      el('div', { class: 'cost' }, s.cost),
      el('div', { class: 'cname' }, def.name),
      el('div', { class: 'cdesc' }, def.desc(s)),
      el('div', { class: 'ctype' },
        def.type === 'attack' ? 'атака' : def.type === 'skill' ? 'навык' : def.type === 'power' ? 'сила' : '')
    );
    hand.append(div);
  }
  layout.append(hand);

  /* --- Управление --- */
  layout.append(
    el('div', { class: 'combat-controls' },
      el('div', { class: 'pile-info' }, `Колода: ${cb.drawPile.length}`),
      el('button', {
        class: 'btn primary',
        disabled: cb.phase !== 'player' ? 'disabled' : undefined,
        onclick: () => { if (cb.phase === 'player') { selectedCard = null; cb.endTurn(); } }
      }, cb.phase === 'player' ? 'Завершить ход' : 'Ход врагов...'),
      el('div', { class: 'pile-info' }, `Сброс: ${cb.discardPile.length}`)
    )
  );

  v.append(layout);
  showScreen('combat');
}

function statusList(status) {
  const keys = Object.keys(status).filter(k => status[k] > 0);
  if (!keys.length) return el('div', { class: 'status-list' });
  return el('div', { class: 'status-list' },
    ...keys.map(k => {
      const info = STATUS_INFO[k] || { name: k, good: true, icon: '•' };
      return el('div', {
        class: `status-chip ${info.good ? 'good' : 'bad'}`,
        title: info.name
      }, `${info.icon}${status[k]}`);
    })
  );
}

function playSelected(game, target) {
  const cb = game.combat;
  if (!cb || !selectedCard) return;
  const card = selectedCard;
  selectedCard = null;
  cb.playCard(card, target);
  renderCombat(game);
}

/* ============================================================
   НАГРАДА
   ============================================================ */
export function renderReward(game) {
  const v = $('#view-reward');
  v.innerHTML = '';
  const p = game.pending;
  if (!p) { game.finishReward(); return; }

  const panel = el('div', { class: 'panel' });

  if (p.treasureOnly) {
    panel.append(el('h2', {}, '🎁 СУНДУК'));
    if (p.relic) {
      panel.append(el('div', { class: 'reward-grid' }, relicCard(p.relic)));
    }
    panel.append(el('div', { style: 'text-align:center;color:#e8c15a;margin-bottom:16px;' }, `+${p.gold} золота`));
    panel.append(el('div', { class: 'center-buttons' },
      el('button', { class: 'btn primary', onclick: () => { game.pending = null; game.screen = 'map'; game.emit(); } }, 'Продолжить')
    ));
    v.append(panel);
    showScreen('reward');
    return;
  }

  panel.append(el('h2', {}, '🏆 ПОБЕДА'));
  panel.append(el('div', { style: 'text-align:center;color:#e8c15a;font-size:18px;margin-bottom:18px;' },
    `+${p.gold} золота`));

  if (p.relic) {
    panel.append(el('h3', { style: 'text-align:center;color:#8f98ad;font-size:14px;letter-spacing:2px;' }, 'РЕЛИКВИЯ'));
    panel.append(el('div', { class: 'reward-grid' }, relicCard(p.relic)));
  }

  if (p.bossRelics && p.bossRelics.length) {
    panel.append(el('h3', { style: 'text-align:center;color:#8f98ad;font-size:14px;letter-spacing:2px;margin-top:14px;' }, 'РЕЛИКВИЯ БОССА'));
    const grid = el('div', { class: 'reward-grid' });
    for (const r of p.bossRelics) {
      const card = relicCard(r, 'boss');
      card.style.cursor = 'pointer';
      card.addEventListener('click', () => {
        game.addRelic(r.id);
        game.pending.bossRelics = null;
        game.emit();
      });
      grid.append(card);
    }
    panel.append(grid);
  }

  if (p.cards && p.cards.length) {
    panel.append(el('h3', { style: 'text-align:center;color:#8f98ad;font-size:14px;letter-spacing:2px;margin-top:14px;' }, 'ВЫБЕРИТЕ КАРТУ'));
    const grid = el('div', { class: 'reward-grid' });
    for (const c of p.cards) {
      const def = CARDS[c.id];
      const cardEl = el('div', {
        class: `card ${def.type}${c.upgraded ? ' upgraded' : ''}`,
        style: 'width:132px;height:186px;',
        onclick: () => {
          game.takeCard(c);
          game.pending.cards = null;
          toast(`Карта «${def.name}» добавлена в колоду`);
          game.emit();
        }
      },
        el('div', { class: 'cost' }, c.stats.cost),
        el('div', { class: 'cname' }, def.name),
        el('div', { class: 'cdesc' }, def.desc(c.stats)),
        el('div', { class: 'ctype' }, def.type === 'attack' ? 'атака' : def.type === 'skill' ? 'навык' : 'сила')
      );
      grid.append(cardEl);
    }
    panel.append(grid);
  }

  panel.append(el('div', { class: 'center-buttons', style: 'margin-top:18px;' },
    el('button', { class: 'btn', onclick: () => { game.pending.cards = null; game.pending.bossRelics = null; game.emit(); } }, 'Пропустить карту'),
    el('button', {
      class: 'btn primary',
      onclick: () => {
        if (game.pending && game.pending.bossRelics && game.pending.bossRelics.length) {
          toast('Сначала выберите реликвию босса');
          return;
        }
        const wasBoss = game.combatKind === 'boss';
        game.pending = null;
        if (wasBoss) game.advanceAfterNode();
        else { game.screen = 'map'; game.emit(); }
      }
    }, 'Продолжить')
  ));

  v.append(panel);
  showScreen('reward');
}

function relicCard(def, extraClass = '') {
  return el('div', { class: `relic-item ${extraClass}` },
    el('div', { class: 'ico' }, def.icon),
    el('div', { class: 'rname' }, def.name),
    el('div', { class: 'rdesc' }, def.desc)
  );
}

/* ============================================================
   КОСТЁР
   ============================================================ */
export function renderRest(game) {
  const v = $('#view-rest');
  v.innerHTML = '';

  const panel = el('div', { class: 'panel' });
  panel.append(el('h2', {}, '🔥 КОСТЁР'));
  panel.append(el('div', {
    style: 'text-align:center;color:#8f98ad;margin-bottom:20px;'
  }, `HP: ${game.hp}/${game.maxHp}`));

  const canHeal = !game.hasRelic('kingsSeal');
  const healAmount = Math.floor(game.maxHp * 0.3);

  panel.append(el('div', { class: 'center-buttons' },
    el('button', {
      class: 'btn primary',
      disabled: canHeal ? undefined : 'disabled',
      onclick: () => { game.restHeal(); }
    }, canHeal ? `Отдохнуть (+${healAmount} HP)` : 'Печать короля: лечение запрещено'),
    el('button', {
      class: 'btn',
      onclick: () => showUpgradeModal(game)
    }, 'Точить карту')
  ));

  v.append(panel);
  showScreen('rest');
}

function showUpgradeModal(game) {
  const overlay = $('#overlay');
  overlay.innerHTML = '';
  overlay.classList.remove('hidden');

  const upgradable = game.deck.filter(c => !c.upgraded && CARDS[c.id].upg);

  const grid = el('div', { class: 'deck-grid' });
  for (const c of upgradable) {
    const def = CARDS[c.id];
    const newStats = { ...def.v, ...def.upg };
    grid.append(el('div', {
      class: `card ${def.type}`,
      style: 'width:132px;height:190px;',
      onclick: () => {
        overlay.classList.add('hidden');
        game.restUpgrade(c.uid);
        toast(`«${def.name}» улучшена`);
      }
    },
      el('div', { class: 'cost' }, newStats.cost),
      el('div', { class: 'cname' }, def.name + ' +'),
      el('div', { class: 'cdesc' }, def.desc(newStats)),
      el('div', { class: 'ctype' }, def.type === 'attack' ? 'атака' : def.type === 'skill' ? 'навык' : 'сила')
    ));
  }

  overlay.append(
    el('h2', { style: 'color:#e8c15a;letter-spacing:2px;' }, 'ВЫБЕРИТЕ КАРТУ ДЛЯ УЛУЧШЕНИЯ'),
    upgradable.length ? grid : el('div', { style: 'color:#8f98ad;' }, 'Нет карт для улучшения'),
    el('button', { class: 'btn', onclick: () => overlay.classList.add('hidden') }, 'Отмена')
  );
}

/* ============================================================
   ЛАВКА
   ============================================================ */
export function renderShop(game) {
  const v = $('#view-shop');
  v.innerHTML = '';
  const p = game.pending;

  const panel = el('div', { class: 'panel' });
  panel.append(el('h2', {}, '🛒 ЛАВКА'));
  panel.append(el('div', { style: 'text-align:center;color:#e8c15a;margin-bottom:16px;' }, `Золото: ${game.gold}`));

  if (p && p.relic && !p.boughtRelic) {
    const r = p.relic;
    const item = relicCard(r.def);
    item.style.cursor = 'pointer';
    item.append(el('div', { style: 'color:#e8c15a;margin-top:6px;font-weight:700;' }, `🪙 ${r.price}`));
    item.addEventListener('click', () => {
      if (game.gold < r.price) { toast('Недостаточно золота'); return; }
      game.buyRelic();
      toast('Реликвия куплена');
    });
    panel.append(el('div', { class: 'reward-grid' }, item));
  }

  if (p) {
    const grid = el('div', { class: 'reward-grid' });
    p.cards.forEach((item, i) => {
      if (p.boughtCards.has(i)) return;
      const def = CARDS[item.card.id];
      const c = item.card;
      const cardEl = el('div', {
        class: `card ${def.type}`,
        style: 'width:132px;height:190px;',
        onclick: () => {
          if (game.gold < item.price) { toast('Недостаточно золота'); return; }
          game.buyCard(i);
          toast(`Куплена «${def.name}»`);
        }
      },
        el('div', { class: 'cost' }, c.stats.cost),
        el('div', { class: 'cname' }, def.name),
        el('div', { class: 'cdesc' }, def.desc(c.stats)),
        el('div', { class: 'ctype' }, `🪙 ${item.price}`)
      );
      grid.append(cardEl);
    });
    panel.append(grid);
  }

  panel.append(el('div', { class: 'center-buttons', style: 'margin-top:16px;' },
    el('button', { class: 'btn primary', onclick: () => { game.pending = null; game.screen = 'map'; game.emit(); } }, 'Уйти')
  ));

  v.append(panel);
  showScreen('shop');
}

/* ============================================================
   ФИНАЛ
   ============================================================ */
export function renderEnd(game) {
  const v = $('#view-end');
  v.innerHTML = '';
  const win = game.hp > 0;

  v.append(
    el('div', { class: 'end-wrap' },
      el('h1', { class: `end-title ${win ? 'win' : 'lose'}` }, win ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ'),
      el('div', { style: 'color:#8f98ad;font-size:15px;max-width:520px;text-align:center;line-height:1.6;' },
        win
          ? 'Сердце Шпиля остановлено. Вы прошли все три акта.'
          : `Вы пали в ${ACTS[game.act] ? ACTS[game.act].name : 'Шпиле'}. Этаж: ${game.floors}.`),
      el('div', { style: 'color:#e8c15a;' },
        `Побед всего: ${game.best.wins} · Лучший этаж: ${game.best.bestFloor}`),
      el('div', { class: 'center-buttons' },
        el('button', { class: 'btn primary', onclick: () => { game.resetRun(); game.emit(); } }, 'В меню'),
        el('button', { class: 'btn', onclick: () => { const id = game.charId; game.resetRun(); game.newRun(id); } }, 'Заново тем же героем')
      )
    )
  );
  showScreen('end');
}

/* ============================================================
   МОДАЛКИ
   ============================================================ */
export function showDeckModal(game) {
  const overlay = $('#overlay');
  overlay.innerHTML = '';
  overlay.classList.remove('hidden');

  const grid = el('div', { class: 'deck-grid' });
  const sorted = [...game.deck].sort((a, b) => CARDS[a.id].name.localeCompare(CARDS[b.id].name));

  for (const c of sorted) {
    const def = CARDS[c.id];
    grid.append(el('div', {
      class: `card ${def.type}${c.upgraded ? ' upgraded' : ''}`,
      style: 'width:120px;height:170px;'
    },
      el('div', { class: 'cost' }, c.stats.cost),
      el('div', { class: 'cname' }, def.name),
      el('div', { class: 'cdesc' }, def.desc(c.stats)),
      el('div', { class: 'ctype' }, def.type === 'attack' ? 'атака' : def.type === 'skill' ? 'навык' : 'сила')
    ));
  }

  overlay.append(
    el('h2', { style: 'color:#e8c15a;letter-spacing:2px;' }, `КОЛОДА (${game.deck.length})`),
    grid,
    el('button', { class: 'btn', onclick: () => overlay.classList.add('hidden') }, 'Закрыть')
  );
}

export function showRelicModal(game) {
  const overlay = $('#overlay');
  overlay.innerHTML = '';
  overlay.classList.remove('hidden');

  const grid = el('div', { class: 'reward-grid' });
  if (!game.relics.length) {
    grid.append(el('div', { style: 'color:#8f98ad;' }, 'Реликвий пока нет'));
  }
  for (const r of game.relics) grid.append(relicCard(r, r.rarity === 'boss' ? 'boss' : ''));

  overlay.append(
    el('h2', { style: 'color:#e8c15a;letter-spacing:2px;' }, `РЕЛИКВИИ (${game.relics.length})`),
    grid,
    el('button', { class: 'btn', onclick: () => overlay.classList.add('hidden') }, 'Закрыть')
  );
}

export function showHelp() {
  const overlay = $('#overlay');
  overlay.innerHTML = '';
  overlay.classList.remove('hidden');

  overlay.append(
    el('h2', { style: 'color:#e8c15a;letter-spacing:2px;' }, 'КАК ИГРАТЬ'),
    el('div', {
      class: 'panel',
      style: 'max-width:680px;line-height:1.7;color:#c6cde0;font-size:14px;'
    },
      el('p', {}, '🃏 Каждый ход вы получаете 3 энергии и 5 карт. Нажмите на карту, чтобы разыграть её. Атаки требуют выбрать цель кликом по врагу.'),
      el('p', {}, '🛡 Броня поглощает урон и сбрасывается в начале вашего следующего хода.'),
      el('p', {}, '⚔️ После боя выбирайте одну карту из трёх — так растёт колода.'),
      el('p', {}, '💀 Элиты дают реликвии. 👑 Боссы дают уникальные боссовые реликвии.'),
      el('p', {}, '🔥 На костре можно отдохнуть (+30% HP) или улучшить карту.'),
      el('p', {}, '🗺 Карта акта: бой, элита, костёр, лавка, сундук. Дойдите до босса и пройдите 3 акта.'),
      el('p', {}, '☠️ Яд тикает в начале хода врага. Уязвимость (+50% урона), Слабость (−25% урона), Хрупкость (−25% брони) спадают в конце хода.'),
      el('p', {}, '💡 Совет: блок важнее урона. Убивайте врагов по одному, чтобы получать меньше атак за ход.')
    ),
    el('button', { class: 'btn', onclick: () => overlay.classList.add('hidden') }, 'Понятно')
  );
}

/* ============================================================
   ГЛАВНЫЙ РЕНДЕР
   ============================================================ */
export function render(game) {
  renderHud(game);
  switch (game.screen) {
    case 'menu':    renderMenu(game); break;
    case 'char':    renderCharSelect(game); break;
    case 'map':     renderMap(game); break;
    case 'combat':  renderCombat(game); break;
    case 'reward':  renderReward(game); break;
    case 'rest':    renderRest(game); break;
    case 'shop':    renderShop(game); break;
    case 'end':     renderEnd(game); break;
    default:        renderMenu(game);
  }
}