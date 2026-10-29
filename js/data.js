/* ============================================================
   data.js — карты, реликвии, враги, персонажи, акты
   ============================================================ */

export const STATUS_INFO = {
  str:         { name: 'Сила',               good: true,  icon: '⚔' },
  dex:         { name: 'Ловкость',           good: true,  icon: '🛡' },
  vuln:        { name: 'Уязвимость',         good: false, icon: '💔', decay: true },
  weak:        { name: 'Слабость',           good: false, icon: '🥀', decay: true },
  frail:       { name: 'Хрупкость',          good: false, icon: '🦴', decay: true },
  poison:      { name: 'Яд',                 good: false, icon: '☠' },
  thorns:      { name: 'Шипы',               good: true,  icon: '🌵' },
  metallicize: { name: 'Металлизация',       good: true,  icon: '⛓' },
  regen:       { name: 'Регенерация',        good: true,  icon: '❤' },
  artifact:    { name: 'Артефакт',           good: true,  icon: '🔮' },
  demon:       { name: 'Демоническая форма', good: true,  icon: '😈' },
  fumes:       { name: 'Ядовитые пары',      good: true,  icon: '🌫' },
  juggernaut:  { name: 'Джаггернаут',        good: true,  icon: '🗿' },
  cuts:        { name: 'Тысяча порезов',     good: true,  icon: '🗡' },
  envenom:     { name: 'Отрава',             good: true,  icon: '🧪' },
  fortress:    { name: 'Крепость',           good: true,  icon: '🏰' },
};

/* ============================================================
   КАРТЫ
   v   — базовые значения, upg — значения после улучшения
   ============================================================ */
export const CARDS = {

  /* ---------------- Базовые ---------------- */
  strike: {
    id: 'strike', name: 'Удар', type: 'attack', color: 'red', rarity: 'basic', target: 'enemy',
    v: { cost: 1, dmg: 6 }, upg: { dmg: 9 },
    desc: s => `Наносит ${s.dmg} урона.`,
    play: (c, s) => c.attack(s.dmg)
  },
  defend: {
    id: 'defend', name: 'Защита', type: 'skill', color: 'red', rarity: 'basic', target: 'self',
    v: { cost: 1, blk: 5 }, upg: { blk: 8 },
    desc: s => `Даёт ${s.blk} брони.`,
    play: (c, s) => c.block(s.blk)
  },
  bash: {
    id: 'bash', name: 'Сокрушение', type: 'attack', color: 'red', rarity: 'basic', target: 'enemy',
    v: { cost: 2, dmg: 8, vuln: 2 }, upg: { dmg: 10, vuln: 3 },
    desc: s => `Наносит ${s.dmg} урона. Накладывает ${s.vuln} уязвимости.`,
    play: (c, s) => { c.attack(s.dmg); c.statusTarget('vuln', s.vuln); }
  },
  neutralize: {
    id: 'neutralize', name: 'Нейтрализация', type: 'attack', color: 'green', rarity: 'basic', target: 'enemy',
    v: { cost: 0, dmg: 3, weak: 1 }, upg: { dmg: 4, weak: 2 },
    desc: s => `Наносит ${s.dmg} урона. Накладывает ${s.weak} слабости.`,
    play: (c, s) => { c.attack(s.dmg); c.statusTarget('weak', s.weak); }
  },

  /* ---------------- Воитель (red) ---------------- */
  cleave: {
    id: 'cleave', name: 'Рассечение', type: 'attack', color: 'red', rarity: 'common', target: 'all',
    v: { cost: 1, dmg: 8 }, upg: { dmg: 11 },
    desc: s => `Наносит ${s.dmg} урона всем врагам.`,
    play: (c, s) => c.attackAll(s.dmg)
  },
  twinStrike: {
    id: 'twinStrike', name: 'Двойной удар', type: 'attack', color: 'red', rarity: 'common', target: 'enemy',
    v: { cost: 1, dmg: 5 }, upg: { dmg: 7 },
    desc: s => `Наносит ${s.dmg} урона дважды.`,
    play: (c, s) => { c.attack(s.dmg); c.attack(s.dmg); }
  },
  pommel: {
    id: 'pommel', name: 'Рукоять', type: 'attack', color: 'red', rarity: 'common', target: 'enemy',
    v: { cost: 1, dmg: 9, draw: 1 }, upg: { dmg: 10, draw: 2 },
    desc: s => `Наносит ${s.dmg} урона. Взять ${s.draw} карт.`,
    play: (c, s) => { c.attack(s.dmg); c.draw(s.draw); }
  },
  shrug: {
    id: 'shrug', name: 'Пожатие плечами', type: 'skill', color: 'red', rarity: 'common', target: 'self',
    v: { cost: 1, blk: 8, draw: 1 }, upg: { blk: 11, draw: 1 },
    desc: s => `Даёт ${s.blk} брони. Взять ${s.draw} карт.`,
    play: (c, s) => { c.block(s.blk); c.draw(s.draw); }
  },
  bloodletting: {
    id: 'bloodletting', name: 'Кровопускание', type: 'skill', color: 'red', rarity: 'uncommon', target: 'self',
    v: { cost: 0, hp: 3, energy: 2 }, upg: { hp: 3, energy: 3 },
    desc: s => `Теряете ${s.hp} HP. Получаете ${s.energy} энергии.`,
    play: (c, s) => { c.loseHp(s.hp); c.gainEnergy(s.energy); }
  },
  inflame: {
    id: 'inflame', name: 'Воспламенение', type: 'power', color: 'red', rarity: 'uncommon', target: 'self',
    v: { cost: 1, n: 2 }, upg: { n: 3 },
    desc: s => `Даёт ${s.n} силы.`,
    play: (c, s) => c.statusSelf('str', s.n)
  },
  metallicize: {
    id: 'metallicize', name: 'Металлизация', type: 'power', color: 'red', rarity: 'uncommon', target: 'self',
    v: { cost: 1, n: 3 }, upg: { n: 4 },
    desc: s => `В конце хода даёт ${s.n} брони.`,
    play: (c, s) => c.statusSelf('metallicize', s.n)
  },
  heavyBlade: {
    id: 'heavyBlade', name: 'Тяжёлый клинок', type: 'attack', color: 'red', rarity: 'uncommon', target: 'enemy',
    v: { cost: 2, dmg: 14, mult: 3 }, upg: { dmg: 18, mult: 5 },
    desc: s => `Наносит ${s.dmg} урона. Сила учитывается ${s.mult} раза.`,
    play: (c, s) => c.attackRaw(s.dmg + (c.player.status.str || 0) * s.mult)
  },
  offering: {
    id: 'offering', name: 'Жертва', type: 'skill', color: 'red', rarity: 'rare', target: 'self', exhaust: true,
    v: { cost: 0, hp: 6, energy: 2, draw: 3 }, upg: { hp: 6, energy: 2, draw: 5 },
    desc: s => `Теряете ${s.hp} HP. Получаете ${s.energy} энергии. Взять ${s.draw} карт.`,
    play: (c, s) => { c.loseHp(s.hp); c.gainEnergy(s.energy); c.draw(s.draw); }
  },
  demonForm: {
    id: 'demonForm', name: 'Демоническая форма', type: 'power', color: 'red', rarity: 'rare', target: 'self',
    v: { cost: 3, n: 2 }, upg: { n: 3 },
    desc: s => `В начале каждого хода даёт ${s.n} силы.`,
    play: (c, s) => c.statusSelf('demon', s.n)
  },
  reaper: {
    id: 'reaper', name: 'Жнец', type: 'attack', color: 'red', rarity: 'rare', target: 'all', exhaust: true,
    v: { cost: 2, dmg: 4 }, upg: { dmg: 5 },
    desc: s => `Наносит ${s.dmg} урона всем врагам. Восстанавливает HP на сумму нанесённого урона.`,
    play: (c, s) => { const dealt = c.attackAll(s.dmg); c.heal(dealt); }
  },
  feed: {
    id: 'feed', name: 'Пожирание', type: 'attack', color: 'red', rarity: 'rare', target: 'enemy', exhaust: true,
    v: { cost: 1, dmg: 10, max: 3 }, upg: { dmg: 12, max: 3 },
    desc: s => `Наносит ${s.dmg} урона. Если убивает — +${s.max} макс. HP.`,
    play: (c, s) => { const killed = c.attack(s.dmg); if (killed) c.gainMaxHp(s.max); }
  },
  limitBreak: {
    id: 'limitBreak', name: 'Предел', type: 'skill', color: 'red', rarity: 'rare', target: 'self', exhaust: true,
    v: { cost: 1 }, upg: { cost: 0 },
    desc: () => `Удваивает вашу Силу.`,
    play: (c) => c.doubleStatusSelf('str')
  },

  /* ---------------- Плутовка (green) ---------------- */
  deadlyPoison: {
    id: 'deadlyPoison', name: 'Смертельный яд', type: 'skill', color: 'green', rarity: 'common', target: 'enemy',
    v: { cost: 1, poison: 5 }, upg: { poison: 7 },
    desc: s => `Накладывает ${s.poison} яда.`,
    play: (c, s) => c.statusTarget('poison', s.poison)
  },
  slice: {
    id: 'slice', name: 'Порез', type: 'attack', color: 'green', rarity: 'common', target: 'enemy',
    v: { cost: 0, dmg: 6 }, upg: { dmg: 9 },
    desc: s => `Наносит ${s.dmg} урона.`,
    play: (c, s) => c.attack(s.dmg)
  },
  daggerSpray: {
    id: 'daggerSpray', name: 'Веер кинжалов', type: 'attack', color: 'green', rarity: 'common', target: 'all',
    v: { cost: 1, dmg: 4 }, upg: { dmg: 6 },
    desc: s => `Наносит ${s.dmg} урона всем врагам дважды.`,
    play: (c, s) => { c.attackAll(s.dmg); c.attackAll(s.dmg); }
  },
  backflip: {
    id: 'backflip', name: 'Сальто', type: 'skill', color: 'green', rarity: 'common', target: 'self',
    v: { cost: 1, blk: 5, draw: 2 }, upg: { blk: 8, draw: 2 },
    desc: s => `Даёт ${s.blk} брони. Взять ${s.draw} карт.`,
    play: (c, s) => { c.block(s.blk); c.draw(s.draw); }
  },
  footwork: {
    id: 'footwork', name: 'Работа ног', type: 'power', color: 'green', rarity: 'uncommon', target: 'self',
    v: { cost: 1, n: 2 }, upg: { n: 3 },
    desc: s => `Даёт ${s.n} ловкости.`,
    play: (c, s) => c.statusSelf('dex', s.n)
  },
  catalyst: {
    id: 'catalyst', name: 'Катализатор', type: 'skill', color: 'green', rarity: 'uncommon', target: 'enemy', exhaust: true,
    v: { cost: 1, mult: 2 }, upg: { mult: 3 },
    desc: s => `Умножает Яд на цели на ${s.mult}.`,
    play: (c, s) => c.multiplyTargetStatus('poison', s.mult)
  },
  bouncingFlask: {
    id: 'bouncingFlask', name: 'Отскакивающая колба', type: 'skill', color: 'green', rarity: 'uncommon', target: 'all',
    v: { cost: 2, poison: 3 }, upg: { poison: 4 },
    desc: s => `Накладывает ${s.poison} яда всем врагам.`,
    play: (c, s) => c.statusAll('poison', s.poison)
  },
  bladeDance: {
    id: 'bladeDance', name: 'Танец клинков', type: 'skill', color: 'green', rarity: 'common', target: 'self',
    v: { cost: 1, n: 3 }, upg: { n: 4 },
    desc: s => `Добавляет ${s.n} «Клинков» в руку.`,
    play: (c, s) => c.addCard('blade', 'hand', s.n)
  },
  blade: {
    id: 'blade', name: 'Клинок', type: 'attack', color: 'green', rarity: 'special', target: 'enemy',
    v: { cost: 0, dmg: 4 }, upg: { dmg: 6 },
    desc: s => `Наносит ${s.dmg} урона.`,
    play: (c, s) => c.attack(s.dmg)
  },
  noxiousFumes: {
    id: 'noxiousFumes', name: 'Ядовитые пары', type: 'power', color: 'green', rarity: 'uncommon', target: 'self',
    v: { cost: 1, n: 2 }, upg: { n: 3 },
    desc: s => `В начале хода накладывает ${s.n} яда всем врагам.`,
    play: (c, s) => c.statusSelf('fumes', s.n)
  },
  thousandCuts: {
    id: 'thousandCuts', name: 'Тысяча порезов', type: 'power', color: 'green', rarity: 'rare', target: 'self',
    v: { cost: 2, n: 1 }, upg: { n: 2 },
    desc: s => `За каждую сыгранную карту наносит ${s.n} урона всем врагам.`,
    play: (c, s) => c.statusSelf('cuts', s.n)
  },
  legSweep: {
    id: 'legSweep', name: 'Подсечка', type: 'skill', color: 'green', rarity: 'uncommon', target: 'enemy',
    v: { cost: 2, blk: 11, weak: 2 }, upg: { blk: 14, weak: 3 },
    desc: s => `Даёт ${s.blk} брони. Накладывает ${s.weak} слабости.`,
    play: (c, s) => { c.block(s.blk); c.statusTarget('weak', s.weak); }
  },
  envenom: {
    id: 'envenom', name: 'Отрава', type: 'power', color: 'green', rarity: 'rare', target: 'self',
    v: { cost: 2, n: 1 }, upg: { cost: 1, n: 1 },
    desc: s => `Неблокированный урон накладывает ${s.n} яда.`,
    play: (c, s) => c.statusSelf('envenom', s.n)
  },
  predator: {
    id: 'predator', name: 'Хищник', type: 'attack', color: 'green', rarity: 'uncommon', target: 'enemy',
    v: { cost: 2, dmg: 15, draw: 2 }, upg: { dmg: 20, draw: 2 },
    desc: s => `Наносит ${s.dmg} урона. Взять ${s.draw} карт.`,
    play: (c, s) => { c.attack(s.dmg); c.draw(s.draw); }
  },

  /* ---------------- Страж (blue) ---------------- */
  ironWave: {
    id: 'ironWave', name: 'Железная волна', type: 'attack', color: 'blue', rarity: 'common', target: 'enemy',
    v: { cost: 1, dmg: 5, blk: 5 }, upg: { dmg: 7, blk: 7 },
    desc: s => `Наносит ${s.dmg} урона и даёт ${s.blk} брони.`,
    play: (c, s) => { c.attack(s.dmg); c.block(s.blk); }
  },
  thornsCard: {
    id: 'thornsCard', name: 'Шипы', type: 'power', color: 'blue', rarity: 'uncommon', target: 'self',
    v: { cost: 1, n: 3 }, upg: { n: 4 },
    desc: s => `Даёт ${s.n} шипов.`,
    play: (c, s) => c.statusSelf('thorns', s.n)
  },
  bodySlam: {
    id: 'bodySlam', name: 'Таран', type: 'attack', color: 'blue', rarity: 'common', target: 'enemy',
    v: { cost: 1 }, upg: { cost: 0 },
    desc: () => `Наносит урон, равный вашей текущей броне.`,
    play: (c) => c.attackRaw(c.player.block)
  },
  entrench: {
    id: 'entrench', name: 'Окопы', type: 'skill', color: 'blue', rarity: 'uncommon', target: 'self',
    v: { cost: 2 }, upg: { cost: 1 },
    desc: () => `Удваивает вашу броню.`,
    play: (c) => c.block(c.player.block)
  },
  flameBarrier: {
    id: 'flameBarrier', name: 'Огненный барьер', type: 'skill', color: 'blue', rarity: 'uncommon', target: 'self',
    v: { cost: 2, blk: 12, thorns: 4 }, upg: { blk: 16, thorns: 6 },
    desc: s => `Даёт ${s.blk} брони и ${s.thorns} шипов.`,
    play: (c, s) => { c.block(s.blk); c.statusSelf('thorns', s.thorns); }
  },
  impervious: {
    id: 'impervious', name: 'Непреклонность', type: 'skill', color: 'blue', rarity: 'rare', target: 'self', exhaust: true,
    v: { cost: 2, blk: 30 }, upg: { blk: 40 },
    desc: s => `Даёт ${s.blk} брони.`,
    play: (c, s) => c.block(s.blk)
  },
  juggernaut: {
    id: 'juggernaut', name: 'Джаггернаут', type: 'power', color: 'blue', rarity: 'rare', target: 'self',
    v: { cost: 2, n: 5 }, upg: { n: 7 },
    desc: s => `При получении брони наносит ${s.n} урона случайному врагу.`,
    play: (c, s) => c.statusSelf('juggernaut', s.n)
  },
  shockwave: {
    id: 'shockwave', name: 'Ударная волна', type: 'skill', color: 'blue', rarity: 'uncommon', target: 'all', exhaust: true,
    v: { cost: 2, n: 3 }, upg: { n: 5 },
    desc: s => `Накладывает ${s.n} слабости и ${s.n} уязвимости всем врагам.`,
    play: (c, s) => { c.statusAll('weak', s.n); c.statusAll('vuln', s.n); }
  },
  ghostArmor: {
    id: 'ghostArmor', name: 'Призрачная броня', type: 'skill', color: 'blue', rarity: 'common', target: 'self', exhaust: true,
    v: { cost: 1, blk: 10 }, upg: { blk: 15 },
    desc: s => `Даёт ${s.blk} брони.`,
    play: (c, s) => c.block(s.blk)
  },
  titanFist: {
    id: 'titanFist', name: 'Кулак титана', type: 'attack', color: 'blue', rarity: 'common', target: 'enemy',
    v: { cost: 2, dmg: 16 }, upg: { dmg: 22 },
    desc: s => `Наносит ${s.dmg} урона.`,
    play: (c, s) => c.attack(s.dmg)
  },
  fortress: {
    id: 'fortress', name: 'Крепость', type: 'power', color: 'blue', rarity: 'rare', target: 'self',
    v: { cost: 2, n: 1 }, upg: { cost: 1, n: 1 },
    desc: () => `Броня больше не сбрасывается в начале хода.`,
    play: (c, s) => c.statusSelf('fortress', s.n)
  },
  shieldBurst: {
    id: 'shieldBurst', name: 'Взрыв щита', type: 'attack', color: 'blue', rarity: 'uncommon', target: 'all',
    v: { cost: 1 }, upg: { cost: 0 },
    desc: () => `Наносит всем врагам урон, равный половине вашей брони.`,
    play: (c) => c.attackAll(Math.floor(c.player.block / 2))
  },

  /* ---------------- Нейтральные (colorless) ---------------- */
  flashOfSteel: {
    id: 'flashOfSteel', name: 'Вспышка стали', type: 'attack', color: 'colorless', rarity: 'common', target: 'enemy',
    v: { cost: 0, dmg: 3 }, upg: { dmg: 6 },
    desc: s => `Наносит ${s.dmg} урона. Взять 1 карту.`,
    play: (c, s) => { c.attack(s.dmg); c.draw(1); }
  },
  swiftStrike: {
    id: 'swiftStrike', name: 'Быстрый удар', type: 'attack', color: 'colorless', rarity: 'common', target: 'enemy',
    v: { cost: 0, dmg: 7 }, upg: { dmg: 10 },
    desc: s => `Наносит ${s.dmg} урона.`,
    play: (c, s) => c.attack(s.dmg)
  },
  goodInstincts: {
    id: 'goodInstincts', name: 'Хорошие инстинкты', type: 'skill', color: 'colorless', rarity: 'common', target: 'self',
    v: { cost: 0, blk: 6 }, upg: { blk: 9 },
    desc: s => `Даёт ${s.blk} брони.`,
    play: (c, s) => c.block(s.blk)
  },
  bandageUp: {
    id: 'bandageUp', name: 'Перевязка', type: 'skill', color: 'colorless', rarity: 'uncommon', target: 'self', exhaust: true,
    v: { cost: 0, heal: 4 }, upg: { heal: 6 },
    desc: s => `Восстанавливает ${s.heal} HP.`,
    play: (c, s) => c.heal(s.heal)
  },
  panacea: {
    id: 'panacea', name: 'Панацея', type: 'skill', color: 'colorless', rarity: 'uncommon', target: 'self', exhaust: true,
    v: { cost: 0, n: 1 }, upg: { n: 2 },
    desc: s => `Даёт ${s.n} артефакта.`,
    play: (c, s) => c.statusSelf('artifact', s.n)
  },
  blind: {
    id: 'blind', name: 'Ослепление', type: 'skill', color: 'colorless', rarity: 'uncommon', target: 'all',
    v: { cost: 0, n: 2 }, upg: { n: 3 },
    desc: s => `Накладывает ${s.n} слабости всем врагам.`,
    play: (c, s) => c.statusAll('weak', s.n)
  },
  darkShackles: {
    id: 'darkShackles', name: 'Тёмные оковы', type: 'skill', color: 'colorless', rarity: 'uncommon', target: 'enemy', exhaust: true,
    v: { cost: 0, n: 2 }, upg: { n: 3 },
    desc: s => `Цель теряет ${s.n} силы.`,
    play: (c, s) => c.stealStr(s.n)
  },
};

/* ============================================================
   РЕЛИКВИИ
   ============================================================ */
export const RELICS = {
  /* --- стартовые --- */
  burningBlood: {
    id: 'burningBlood', name: 'Кровавый амулет', icon: '🩸', rarity: 'starter',
    desc: 'Восстанавливает 6 HP после боя.',
    onCombatEnd: (g) => g.healOutOfCombat(6)
  },
  snakeRing: {
    id: 'snakeRing', name: 'Змеиное кольцо', icon: '🐍', rarity: 'starter',
    desc: 'В начале боя берёте на 2 карты больше.',
    onCombatStart: (cb) => { cb.bonusDraw += 2; }
  },
  ironShell: {
    id: 'ironShell', name: 'Стальной панцирь', icon: '🛡', rarity: 'starter',
    desc: 'В начале боя даёт 8 брони.',
    onCombatStart: (cb) => cb.gainBlock(cb.player, 8)
  },

  /* --- обычные --- */
  vajra: {
    id: 'vajra', name: 'Ваджра', icon: '🔱', rarity: 'common',
    desc: 'Даёт 1 силы в начале боя.',
    onCombatStart: (cb) => cb.addStatus(cb.player, 'str', 1)
  },
  anchor: {
    id: 'anchor', name: 'Якорь', icon: '⚓', rarity: 'common',
    desc: 'Даёт 10 брони в начале боя.',
    onCombatStart: (cb) => cb.gainBlock(cb.player, 10)
  },
  bagOfPrep: {
    id: 'bagOfPrep', name: 'Сумка подготовки', icon: '🎒', rarity: 'common',
    desc: 'В начале боя берёте на 2 карты больше.',
    onCombatStart: (cb) => { cb.bonusDraw += 2; }
  },
  bloodVial: {
    id: 'bloodVial', name: 'Кровавый сосуд', icon: '🧪', rarity: 'common',
    desc: 'Восстанавливает 2 HP в начале боя.',
    onCombatStart: (cb) => cb.healEntity(cb.player, 2)
  },
  lantern: {
    id: 'lantern', name: 'Фонарь', icon: '🏮', rarity: 'common',
    desc: 'Даёт 1 дополнительную энергию в первом ходу.',
    onCombatStart: (cb) => { cb.firstTurnEnergy += 1; }
  },
  bronzeScales: {
    id: 'bronzeScales', name: 'Бронзовые чешуйки', icon: '🐉', rarity: 'common',
    desc: 'Даёт 3 шипов в начале боя.',
    onCombatStart: (cb) => cb.addStatus(cb.player, 'thorns', 3)
  },
  smoothStone: {
    id: 'smoothStone', name: 'Гладкий камень', icon: '🪨', rarity: 'common',
    desc: 'Даёт 1 ловкости в начале боя.',
    onCombatStart: (cb) => cb.addStatus(cb.player, 'dex', 1)
  },
  regenPendant: {
    id: 'regenPendant', name: 'Амулет регенерации', icon: '💚', rarity: 'uncommon',
    desc: 'Даёт 2 регенерации в начале боя.',
    onCombatStart: (cb) => cb.addStatus(cb.player, 'regen', 2)
  },
  heartOfIron: {
    id: 'heartOfIron', name: 'Сердце гор', icon: '❤️‍🔥', rarity: 'uncommon',
    desc: '+15 к максимальному HP при получении.',
    onPickup: (g) => { g.maxHp += 15; g.hp += 15; }
  },
  goldIdol: {
    id: 'goldIdol', name: 'Золотой идол', icon: '🏆', rarity: 'uncommon',
    desc: '+50 золота при получении.',
    onPickup: (g) => { g.gold += 50; }
  },
  luckyCoin: {
    id: 'luckyCoin', name: 'Счастливая монета', icon: '🪙', rarity: 'common',
    desc: '+12 золота после каждого боя.',
    onCombatEnd: (g) => { g.gold += 12; }
  },

  /* --- боссовые (уникальные) --- */
  demonCrown: {
    id: 'demonCrown', name: 'Демоническая корона', icon: '👑', rarity: 'boss',
    desc: '+1 энергия каждый ход, но в начале боя берёте на 2 карты меньше.',
    onCombatStart: (cb) => { cb.extraEnergy += 1; cb.bonusDraw -= 2; }
  },
  philosopherStone: {
    id: 'philosopherStone', name: 'Философский камень', icon: '💎', rarity: 'boss',
    desc: '+1 энергия каждый ход. Враги начинают бой с +1 силы.',
    onCombatStart: (cb) => {
      cb.extraEnergy += 1;
      cb.enemies.forEach(e => cb.addStatus(e, 'str', 1));
    }
  },
  bloodChalice: {
    id: 'bloodChalice', name: 'Кровавый кубок', icon: '🍷', rarity: 'boss',
    desc: '+1 энергия каждый ход. Теряете 3 HP после каждого боя.',
    onCombatStart: (cb) => { cb.extraEnergy += 1; },
    onCombatEnd: (g) => { g.hp = Math.max(1, g.hp - 3); }
  },
  kingsSeal: {
    id: 'kingsSeal', name: 'Печать короля', icon: '🔱', rarity: 'boss',
    desc: '+1 энергия каждый ход, но костры больше не лечат.',
    onCombatStart: (cb) => { cb.extraEnergy += 1; }
  },
  abyssHeart: {
    id: 'abyssHeart', name: 'Сердце бездны', icon: '🖤', rarity: 'boss',
    desc: '+1 энергия каждый ход и +1 карта в начале боя.',
    onCombatStart: (cb) => { cb.extraEnergy += 1; cb.bonusDraw += 1; }
  },
  blackBlood: {
    id: 'blackBlood', name: 'Чёрная кровь', icon: '🩸', rarity: 'boss',
    desc: 'Восстанавливает 12 HP после боя.',
    onCombatEnd: (g) => g.healOutOfCombat(12)
  },
};

/* ============================================================
   ПЕРСОНАЖИ
   ============================================================ */
export const CHARACTERS = {
  warrior: {
    id: 'warrior', name: 'Воитель', emoji: '⚔️', color: 'red', maxHp: 80,
    relic: 'burningBlood',
    desc: 'Мастер грубой силы. Накапливает Силу, добивает врагов и жертвует HP ради темпа.',
    deck: ['strike', 'strike', 'strike', 'strike', 'strike',
           'defend', 'defend', 'defend', 'defend', 'bash']
  },
  rogue: {
    id: 'rogue', name: 'Плутовка', emoji: '🗡️', color: 'green', maxHp: 70,
    relic: 'snakeRing',
    desc: 'Ставит на Яд, Слабость и добор карт. Побеждает за счёт темпа и накопления отравы.',
    deck: ['strike', 'strike', 'strike', 'strike', 'strike',
           'defend', 'defend', 'defend', 'defend', 'defend', 'neutralize']
  },
  guardian: {
    id: 'guardian', name: 'Страж', emoji: '🛡️', color: 'blue', maxHp: 75,
    relic: 'ironShell',
    desc: 'Живёт за счёт брони. Шипы, Металлизация и превращение защиты в урон.',
    deck: ['strike', 'strike', 'strike', 'strike',
           'defend', 'defend', 'defend', 'defend', 'defend', 'ironWave']
  },
};

/* ============================================================
   ВРАГИ
   moves: dmg / hits / block / heal / self[] / player[]
   ============================================================ */
export const ENEMIES = {
  /* ---------------- Акт I ---------------- */
  jawWorm: {
    id: 'jawWorm', name: 'Челюстной червь', icon: '🐛', hp: [40, 46],
    moves: [
      { id: 'chomp',  name: 'Укус',  intent: 'attack', dmg: 11, weight: 3 },
      { id: 'thrash', name: 'Рывок', intent: 'attack_defend', dmg: 7, block: 5, weight: 3 },
      { id: 'bellow', name: 'Рёв',   intent: 'buff', self: [['str', 3]], weight: 1, maxUses: 1 }
    ]
  },
  acidSlime: {
    id: 'acidSlime', name: 'Кислотный слизень', icon: '🟢', hp: [28, 34],
    moves: [
      { id: 'spit',    name: 'Плевок',   intent: 'attack', dmg: 9, weight: 3 },
      { id: 'tackle',  name: 'Наскок',   intent: 'attack', dmg: 5, hits: 2, weight: 3 },
      { id: 'lick',    name: 'Облизать', intent: 'debuff', player: [['weak', 1]], weight: 2 }
    ]
  },
  cultist: {
    id: 'cultist', name: 'Культист', icon: '🧙', hp: [46, 52],
    pattern: ['ritual', 'darkStrike', 'darkStrike', 'darkStrike'],
    moves: [
      { id: 'ritual',     name: 'Ритуал',       intent: 'buff', self: [['str', 3]], weight: 1, maxUses: 1 },
      { id: 'darkStrike', name: 'Тёмный удар',  intent: 'attack', dmg: 6, weight: 3 }
    ]
  },
  looter: {
    id: 'looter', name: 'Гоблин-вор', icon: '👺', hp: [42, 48],
    moves: [
      { id: 'mug',   name: 'Грабёж',  intent: 'attack', dmg: 10, weight: 3 },
      { id: 'stab',  name: 'Удар',    intent: 'attack', dmg: 6, weight: 3 },
      { id: 'guard', name: 'Защита',  intent: 'defend', block: 6, weight: 2 }
    ]
  },

  /* ---------------- Акт II ---------------- */
  serpentPriest: {
    id: 'serpentPriest', name: 'Змеиный жрец', icon: '🐍', hp: [54, 60],
    moves: [
      { id: 'curse', name: 'Проклятие', intent: 'debuff', player: [['vuln', 2]], weight: 2 },
      { id: 'bite',  name: 'Укус',      intent: 'attack', dmg: 12, weight: 3 },
      { id: 'pray',  name: 'Молитва',   intent: 'buff', block: 8, self: [['str', 2]], weight: 2 }
    ]
  },
  centurion: {
    id: 'centurion', name: 'Центурион', icon: '⚔️', hp: [66, 72],
    moves: [
      { id: 'slash', name: 'Разрез',   intent: 'attack', dmg: 14, weight: 3 },
      { id: 'fury',  name: 'Ярость',   intent: 'attack', dmg: 6, hits: 2, weight: 3 },
      { id: 'guard', name: 'Строй',    intent: 'defend', block: 12, weight: 2 }
    ]
  },
  mystic: {
    id: 'mystic', name: 'Мистик', icon: '🔮', hp: [58, 64],
    moves: [
      { id: 'bolt',  name: 'Разряд',   intent: 'attack', dmg: 11, weight: 3 },
      { id: 'curse', name: 'Порча',    intent: 'debuff', player: [['weak', 2]], weight: 2 },
      { id: 'bless', name: 'Благо',    intent: 'buff', block: 10, self: [['str', 2]], weight: 2 }
    ]
  },

  /* ---------------- Акт III ---------------- */
  darkKnight: {
    id: 'darkKnight', name: 'Тёмный рыцарь', icon: '🖤', hp: [88, 96],
    moves: [
      { id: 'cleave', name: 'Раскол',  intent: 'attack', dmg: 16, weight: 3 },
      { id: 'guard',  name: 'Гвардия', intent: 'buff', block: 14, self: [['str', 3]], weight: 2 },
      { id: 'curse',  name: 'Скверна', intent: 'debuff', player: [['frail', 2]], weight: 2 }
    ]
  },
  wraith: {
    id: 'wraith', name: 'Призрак', icon: '👻', hp: [70, 78],
    moves: [
      { id: 'drain',  name: 'Вытягивание', intent: 'attack', dmg: 9, heal: 5, weight: 3 },
      { id: 'wail',   name: 'Вой',         intent: 'debuff', player: [['weak', 2]], weight: 2 },
      { id: 'strike', name: 'Удар',        intent: 'attack', dmg: 12, weight: 3 }
    ]
  },
  demon: {
    id: 'demon', name: 'Демон', icon: '😈', hp: [100, 110],
    moves: [
      { id: 'claw',  name: 'Когти',    intent: 'attack', dmg: 12, hits: 2, weight: 3 },
      { id: 'roar',  name: 'Рык',      intent: 'buff', self: [['str', 4]], weight: 1 },
      { id: 'blast', name: 'Взрыв',    intent: 'attack', dmg: 18, weight: 2 }
    ]
  },

  /* ---------------- Элиты ---------------- */
  gremlinNob: {
    id: 'gremlinNob', name: 'Гремлин-надзиратель', icon: '👹', hp: [82, 88], elite: true,
    pattern: ['roar', 'rush', 'skullBash', 'rush', 'skullBash'],
    moves: [
      { id: 'roar',      name: 'Рёв',        intent: 'buff', self: [['str', 3]], weight: 1, maxUses: 1 },
      { id: 'rush',      name: 'Натиск',     intent: 'attack', dmg: 14, weight: 3 },
      { id: 'skullBash', name: 'Удар черепом', intent: 'attack_debuff', dmg: 16, player: [['vuln', 2]], weight: 3 }
    ]
  },
  colossus: {
    id: 'colossus', name: 'Колосс', icon: '🗿', hp: [130, 140], elite: true,
    pattern: ['heavy', 'fortify', 'crush', 'heavy'],
    moves: [
      { id: 'heavy',   name: 'Тяжёлый удар', intent: 'attack', dmg: 20, weight: 3 },
      { id: 'fortify', name: 'Укрепление',   intent: 'buff', block: 15, self: [['str', 4]], weight: 2 },
      { id: 'crush',   name: 'Дробление',    intent: 'attack', dmg: 10, hits: 2, weight: 3 }
    ]
  },
  nemesis: {
    id: 'nemesis', name: 'Немезида', icon: '💀', hp: [160, 170], elite: true,
    pattern: ['scythe', 'haste', 'curse', 'scythe'],
    moves: [
      { id: 'scythe', name: 'Коса',   intent: 'attack', dmg: 22, weight: 3 },
      { id: 'haste',  name: 'Ускорение', intent: 'buff', block: 10, self: [['str', 3]], weight: 2 },
      { id: 'curse',  name: 'Проклятие', intent: 'debuff', player: [['vuln', 3]], weight: 2 }
    ]
  },

  /* ---------------- Боссы ---------------- */
  slimeKing: {
    id: 'slimeKing', name: 'Король слизней', icon: '👑', hp: [150, 150], boss: true,
    pattern: ['slam', 'goop', 'slam', 'absorb'],
    moves: [
      { id: 'slam',   name: 'Сокрушающий удар', intent: 'attack', dmg: 18, weight: 3 },
      { id: 'goop',   name: 'Слизь',            intent: 'debuff', player: [['weak', 2], ['vuln', 2]], weight: 2 },
      { id: 'absorb', name: 'Поглощение',       intent: 'buff', block: 12, self: [['str', 3]], weight: 2 }
    ]
  },
  automaton: {
    id: 'automaton', name: 'Бронзовый автоматон', icon: '🤖', hp: [200, 200], boss: true,
    pattern: ['beam', 'flail', 'hyperBeam', 'repair'],
    moves: [
      { id: 'beam',      name: 'Луч',        intent: 'attack', dmg: 22, weight: 3 },
      { id: 'flail',     name: 'Цеп',        intent: 'attack', dmg: 9, hits: 2, weight: 3 },
      { id: 'hyperBeam', name: 'Гиперлуч',   intent: 'attack', dmg: 28, weight: 2 },
      { id: 'repair',    name: 'Ремонт',     intent: 'buff', block: 20, self: [['str', 5]], weight: 2 }
    ]
  },
  spireHeart: {
    id: 'spireHeart', name: 'Сердце Шпиля', icon: '🫀', hp: [280, 280], boss: true,
    pattern: ['blood', 'debilitate', 'beat', 'regenerate'],
    moves: [
      { id: 'blood',       name: 'Кровопускание', intent: 'attack', dmg: 26, weight: 3 },
      { id: 'debilitate',  name: 'Истощение',     intent: 'debuff', player: [['weak', 3], ['frail', 3]], weight: 2 },
      { id: 'beat',        name: 'Пульс',         intent: 'attack', dmg: 12, hits: 3, weight: 3 },
      { id: 'regenerate',  name: 'Регенерация',   intent: 'buff', heal: 25, block: 20, weight: 2 }
    ]
  },
};

/* ============================================================
   АКТЫ
   ============================================================ */
export const ACTS = [
  {
    id: 0, name: 'Акт I — Гнилые катакомбы', icon: '🕯',
    normal: ['jawWorm', 'acidSlime', 'cultist', 'looter'],
    elite: ['gremlinNob'],
    boss: 'slimeKing'
  },
  {
    id: 1, name: 'Акт II — Забытый город', icon: '🏛',
    normal: ['serpentPriest', 'centurion', 'mystic'],
    elite: ['colossus'],
    boss: 'automaton'
  },
  {
    id: 2, name: 'Акт III — Сердце Шпиля', icon: '🌋',
    normal: ['darkKnight', 'wraith', 'demon'],
    elite: ['nemesis'],
    boss: 'spireHeart'
  },
];

export const COLOR_BY_CHAR = { warrior: 'red', rogue: 'green', guardian: 'blue' };