/* ============================================================
   sprites.js — SVG-спрайты героев и врагов
   ============================================================ */

const wrap = (cls, viewBox, content) =>
  `<svg class="sprite ${cls}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax meet">${content}</svg>`;

/* ---------- ГЕРОИ ---------- */
export const CHAR_SPRITES = {
  warrior: wrap('sprite-char', '0 0 100 140', `
    <ellipse cx="50" cy="135" rx="30" ry="4" fill="rgba(0,0,0,0.45)"/>
    <path d="M18,125 Q8,75 22,45 L78,45 Q92,75 82,125 Z" fill="#5a1010"/>
    <rect x="33" y="105" width="12" height="30" fill="#3a1a1a"/>
    <rect x="55" y="105" width="12" height="30" fill="#3a1a1a"/>
    <path d="M28,55 L72,55 L76,110 L24,110 Z" fill="#c0392b"/>
    <path d="M28,55 L72,55 L74,68 L26,68 Z" fill="#8a2020"/>
    <rect x="26" y="85" width="48" height="6" fill="#3a1a1a"/>
    <circle cx="50" cy="88" r="4" fill="#e8c15a"/>
    <rect x="18" y="60" width="12" height="40" fill="#a02a1e" rx="3"/>
    <rect x="70" y="60" width="12" height="40" fill="#a02a1e" rx="3"/>
    <circle cx="24" cy="103" r="7" fill="#e8b88a"/>
    <circle cx="76" cy="103" r="7" fill="#e8b88a"/>
    <circle cx="50" cy="38" r="17" fill="#e8b88a"/>
    <path d="M31,38 Q31,14 50,12 Q69,14 69,38 L69,44 L31,44 Z" fill="#7a1010"/>
    <rect x="31" y="38" width="38" height="6" fill="#5a0808"/>
    <path d="M33,22 Q20,10 16,20 Q24,24 33,30" fill="#e8c15a"/>
    <path d="M67,22 Q80,10 84,20 Q76,24 67,30" fill="#e8c15a"/>
    <rect x="38" y="40" width="24" height="3" fill="#000"/>
    <path d="M76,60 L78,15 L80,60 Z" fill="#d0d0d0"/>
    <rect x="72" y="60" width="12" height="5" fill="#8a6220"/>
  `),

  rogue: wrap('sprite-char', '0 0 100 140', `
    <ellipse cx="50" cy="135" rx="30" ry="4" fill="rgba(0,0,0,0.45)"/>
    <path d="M22,130 Q12,55 25,42 Q50,50 75,42 Q88,55 78,130 Z" fill="#1e4a30"/>
    <path d="M22,130 Q16,90 25,70 L75,70 Q84,90 78,130 Z" fill="#2a5a3a" opacity="0.7"/>
    <path d="M25,50 Q24,10 50,8 Q76,10 75,50 Q62,42 50,42 Q38,42 25,50 Z" fill="#2a5a3a"/>
    <ellipse cx="50" cy="42" rx="16" ry="11" fill="#0a1a10"/>
    <ellipse cx="43" cy="42" rx="2.5" ry="2" fill="#7ef29b"/>
    <ellipse cx="57" cy="42" rx="2.5" ry="2" fill="#7ef29b"/>
    <path d="M46,50 Q50,53 54,50" stroke="#7ef29b" stroke-width="1" fill="none"/>
    <path d="M14,70 L22,95 L20,75 L26,70 Z" fill="#c0c0c0"/>
    <rect x="16" y="70" width="8" height="3" fill="#8a6220"/>
    <path d="M86,70 L78,95 L80,75 L74,70 Z" fill="#c0c0c0"/>
    <rect x="76" y="70" width="8" height="3" fill="#8a6220"/>
  `),

  guardian: wrap('sprite-char', '0 0 100 140', `
    <ellipse cx="50" cy="135" rx="30" ry="4" fill="rgba(0,0,0,0.45)"/>
    <path d="M26,55 L74,55 L78,115 L22,115 Z" fill="#2d7dd2"/>
    <path d="M26,55 L74,55 L76,70 L24,70 Z" fill="#1a4a7a"/>
    <rect x="34" y="110" width="11" height="25" fill="#1a4a7a"/>
    <rect x="55" y="110" width="11" height="25" fill="#1a4a7a"/>
    <ellipse cx="24" cy="62" rx="12" ry="10" fill="#3a8dd8"/>
    <ellipse cx="76" cy="62" rx="12" ry="10" fill="#3a8dd8"/>
    <circle cx="50" cy="35" r="16" fill="#e8b88a"/>
    <path d="M34,35 Q34,15 50,13 Q66,15 66,35 L66,46 L34,46 Z" fill="#1a4a7a"/>
    <rect x="34" y="38" width="32" height="4" fill="#0d2a4a"/>
    <rect x="48" y="8" width="4" height="20" fill="#e8c15a"/>
    <path d="M50,8 L46,12 L54,12 Z" fill="#e8c15a"/>
    <ellipse cx="18" cy="85" rx="15" ry="20" fill="#3a8dd8" stroke="#e8c15a" stroke-width="2"/>
    <line x1="18" y1="68" x2="18" y2="102" stroke="#e8c15a" stroke-width="1.5"/>
    <line x1="6" y1="85" x2="30" y2="85" stroke="#e8c15a" stroke-width="1.5"/>
    <circle cx="18" cy="85" r="3" fill="#e8c15a"/>
    <rect x="82" y="35" width="3" height="90" fill="#6a4a20"/>
    <path d="M83.5,22 L78,38 L89,38 Z" fill="#c0c0c0"/>
  `),
};

/* ---------- ВРАГИ ---------- */
export const ENEMY_SPRITES = {
  jawWorm: wrap('sprite-enemy', '0 0 120 120', `
    <ellipse cx="60" cy="108" rx="45" ry="6" fill="rgba(0,0,0,0.4)"/>
    <ellipse cx="60" cy="80" rx="42" ry="28" fill="#7a5a3a"/>
    <ellipse cx="60" cy="80" rx="38" ry="24" fill="#a07a4a"/>
    <path d="M25,70 Q60,58 95,70" stroke="#5a4020" stroke-width="2" fill="none"/>
    <path d="M20,88 Q60,76 100,88" stroke="#5a4020" stroke-width="2" fill="none"/>
    <ellipse cx="40" cy="80" rx="14" ry="10" fill="#3a1a0a"/>
    <path d="M30,72 L33,82 L36,72 L39,82 L42,72 L45,82 L48,72 L51,82" stroke="#fff" stroke-width="2" fill="none"/>
    <circle cx="85" cy="65" r="7" fill="#fff"/>
    <circle cx="87" cy="65" r="4" fill="#000"/>
  `),

  acidSlime: wrap('sprite-enemy', '0 0 120 120', `
    <ellipse cx="60" cy="108" rx="45" ry="6" fill="rgba(0,0,0,0.4)"/>
    <ellipse cx="60" cy="85" rx="42" ry="30" fill="#2a7f3a"/>
    <ellipse cx="60" cy="80" rx="40" ry="28" fill="#4db85e"/>
    <ellipse cx="45" cy="72" rx="8" ry="6" fill="#8fffa0" opacity="0.7"/>
    <circle cx="45" cy="78" r="7" fill="#fff"/>
    <circle cx="75" cy="78" r="7" fill="#fff"/>
    <circle cx="46" cy="79" r="4" fill="#000"/>
    <circle cx="76" cy="79" r="4" fill="#000"/>
    <path d="M48,90 Q60,96 72,90" stroke="#0a2a10" stroke-width="2" fill="none"/>
    <circle cx="35" cy="105" r="3" fill="#4db85e"/>
    <circle cx="85" cy="103" r="4" fill="#4db85e"/>
  `),

  cultist: wrap('sprite-enemy', '0 0 120 140', `
    <ellipse cx="60" cy="135" rx="40" ry="4" fill="rgba(0,0,0,0.4)"/>
    <path d="M35,130 Q25,60 40,55 L80,55 Q95,60 85,130 Z" fill="#4a2a6a"/>
    <path d="M35,130 Q35,100 42,85 L78,85 Q85,100 85,130 Z" fill="#2a1a3a"/>
    <path d="M38,55 Q38,20 60,18 Q82,20 82,55 Q70,48 60,48 Q50,48 38,55 Z" fill="#4a2a6a"/>
    <ellipse cx="60" cy="48" rx="18" ry="12" fill="#0a0a14"/>
    <circle cx="52" cy="48" r="2.5" fill="#c39bf0"/>
    <circle cx="68" cy="48" r="2.5" fill="#c39bf0"/>
    <rect x="90" y="30" width="3" height="100" fill="#8a5a30"/>
    <circle cx="91.5" cy="28" r="7" fill="#c39bf0" opacity="0.8"/>
    <circle cx="91.5" cy="28" r="4" fill="#e8c1ff"/>
  `),

  looter: wrap('sprite-enemy', '0 0 120 140', `
    <ellipse cx="60" cy="135" rx="40" ry="4" fill="rgba(0,0,0,0.4)"/>
    <path d="M40,120 L42,75 L78,75 L80,120 Z" fill="#6a4a2a"/>
    <rect x="40" y="90" width="40" height="4" fill="#3a2a1a"/>
    <circle cx="50" cy="92" r="3" fill="#e8c15a"/>
    <circle cx="70" cy="92" r="3" fill="#e8c15a"/>
    <circle cx="60" cy="55" r="20" fill="#7ab84a"/>
    <path d="M40,50 L28,32 L44,44 Z" fill="#7ab84a"/>
    <path d="M80,50 L92,32 L76,44 Z" fill="#7ab84a"/>
    <circle cx="52" cy="52" r="4" fill="#fff"/>
    <circle cx="68" cy="52" r="4" fill="#fff"/>
    <circle cx="53" cy="53" r="2" fill="#000"/>
    <circle cx="69" cy="53" r="2" fill="#000"/>
    <path d="M50,64 Q60,72 70,64" stroke="#0a2a10" stroke-width="2" fill="none"/>
    <ellipse cx="100" cy="95" rx="14" ry="20" fill="#a07a4a"/>
  `),

  serpentPriest: wrap('sprite-enemy', '0 0 120 140', `
    <ellipse cx="60" cy="135" rx="40" ry="4" fill="rgba(0,0,0,0.4)"/>
    <path d="M35,130 Q28,70 42,60 L78,60 Q92,70 85,130 Z" fill="#1a4a2a"/>
    <path d="M35,130 Q38,100 45,85 L75,85 Q82,100 85,130 Z" fill="#0d2a1a"/>
    <!-- Snake head -->
    <ellipse cx="60" cy="45" rx="22" ry="18" fill="#2a7a3a"/>
    <circle cx="50" cy="42" r="4" fill="#ff3a3a"/>
    <circle cx="70" cy="42" r="4" fill="#ff3a3a"/>
    <circle cx="50" cy="42" r="1.5" fill="#000"/>
    <circle cx="70" cy="42" r="1.5" fill="#000"/>
    <path d="M52,58 Q60,64 68,58" stroke="#0a2a10" stroke-width="2" fill="none"/>
    <path d="M55,58 L55,62 M65,58 L65,62" stroke="#fff" stroke-width="1.5"/>
    <rect x="92" y="35" width="3" height="95" fill="#5a3a1a"/>
    <circle cx="93.5" cy="32" r="6" fill="#7ef29b" opacity="0.8"/>
  `),

  centurion: wrap('sprite-enemy', '0 0 120 140', `
    <ellipse cx="60" cy="135" rx="40" ry="4" fill="rgba(0,0,0,0.4)"/>
    <path d="M32,60 L88,60 L90,120 L30,120 Z" fill="#8a3a2a"/>
    <rect x="35" y="115" width="15" height="20" fill="#3a1a0a"/>
    <rect x="70" y="115" width="15" height="20" fill="#3a1a0a"/>
    <circle cx="60" cy="40" r="18" fill="#e8b88a"/>
    <path d="M42,38 Q42,15 60,13 Q78,15 78,38 L78,42 L42,42 Z" fill="#8a2010"/>
    <rect x="42" y="35" width="36" height="4" fill="#5a1008"/>
    <rect x="58" y="13" width="4" height="25" fill="#e8c15a"/>
    <!-- Shield -->
    <ellipse cx="20" cy="85" rx="14" ry="18" fill="#8a3a2a" stroke="#e8c15a" stroke-width="2"/>
    <!-- Sword -->
    <rect x="98" y="55" width="4" height="60" fill="#d0d0d0"/>
    <rect x="94" y="55" width="12" height="5" fill="#5a3a1a"/>
  `),

  mystic: wrap('sprite-enemy', '0 0 120 140', `
    <ellipse cx="60" cy="135" rx="40" ry="4" fill="rgba(0,0,0,0.4)"/>
    <path d="M35,130 Q28,65 42,58 L78,58 Q92,65 85,130 Z" fill="#3a2a5a"/>
    <path d="M38,58 Q38,20 60,18 Q82,20 82,58 Q70,50 60,50 Q50,50 38,58 Z" fill="#2a1a3a"/>
    <ellipse cx="60" cy="50" rx="16" ry="10" fill="#0a0814"/>
    <circle cx="52" cy="50" r="2.5" fill="#e8c1ff"/>
    <circle cx="68" cy="50" r="2.5" fill="#e8c1ff"/>
    <!-- Orb -->
    <circle cx="60" cy="95" r="14" fill="#8e44ad" opacity="0.4"/>
    <circle cx="60" cy="95" r="9" fill="#c39bf0"/>
    <circle cx="57" cy="92" r="3" fill="#fff"/>
    <rect x="88" y="40" width="3" height="90" fill="#3a2a1a"/>
    <circle cx="89.5" cy="38" r="6" fill="#c39bf0"/>
  `),

  darkKnight: wrap('sprite-enemy', '0 0 120 140', `
    <ellipse cx="60" cy="135" rx="42" ry="4" fill="rgba(0,0,0,0.5)"/>
    <path d="M25,60 L95,60 L96,120 L24,120 Z" fill="#1a1a24"/>
    <path d="M25,60 L95,60 L94,72 L26,72 Z" fill="#0a0a14"/>
    <rect x="35" y="115" width="14" height="20" fill="#0a0a14"/>
    <rect x="71" y="115" width="14" height="20" fill="#0a0a14"/>
    <circle cx="60" cy="38" r="18" fill="#3a3a4a"/>
    <path d="M42,38 Q42,14 60,12 Q78,14 78,38 L78,45 L42,45 Z" fill="#0a0a14"/>
    <path d="M46,38 L54,38 M66,38 L74,38" stroke="#e05a3a" stroke-width="3"/>
    <path d="M42,14 L38,4 L46,10 M78,14 L82,4 L74,10" fill="#5a3a2a"/>
    <!-- Greatsword -->
    <rect x="100" y="30" width="6" height="85" fill="#7a7a8a"/>
    <rect x="94" y="30" width="18" height="6" fill="#3a2a1a"/>
    <rect x="100" y="25" width="6" height="10" fill="#7a7a8a"/>
  `),

  wraith: wrap('sprite-enemy', '0 0 120 140', `
    <ellipse cx="60" cy="130" rx="30" ry="4" fill="rgba(0,0,0,0.3)"/>
    <path d="M60,20 Q90,20 90,70 Q90,100 80,130 L40,130 Q30,100 30,70 Q30,20 60,20 Z" fill="#8fb4c8" opacity="0.6"/>
    <ellipse cx="60" cy="50" rx="22" ry="26" fill="#d0e8f0" opacity="0.8"/>
    <circle cx="52" cy="48" r="3" fill="#0a1a2a"/>
    <circle cx="68" cy="48" r="3" fill="#0a1a2a"/>
    <ellipse cx="60" cy="60" rx="5" ry="7" fill="#0a1a2a"/>
    <path d="M40,90 Q50,105 45,125 M80,90 Q70,105 75,125" stroke="#8fb4c8" stroke-width="2" fill="none" opacity="0.6"/>
  `),

  demon: wrap('sprite-enemy', '0 0 120 140', `
    <ellipse cx="60" cy="135" rx="42" ry="4" fill="rgba(0,0,0,0.5)"/>
    <path d="M28,60 L92,60 L94,120 L26,120 Z" fill="#7a1a1a"/>
    <rect x="35" y="115" width="14" height="20" fill="#3a0808"/>
    <rect x="71" y="115" width="14" height="20" fill="#3a0808"/>
    <circle cx="60" cy="40" r="20" fill="#a02a1a"/>
    <!-- Horns -->
    <path d="M42,28 L32,10 L48,22 Z" fill="#3a0808"/>
    <path d="M78,28 L88,10 L72,22 Z" fill="#3a0808"/>
    <!-- Eyes -->
    <circle cx="52" cy="40" r="4" fill="#ffcc00"/>
    <circle cx="68" cy="40" r="4" fill="#ffcc00"/>
    <circle cx="52" cy="40" r="1.5" fill="#000"/>
    <circle cx="68" cy="40" r="1.5" fill="#000"/>
    <!-- Mouth -->
    <path d="M48,52 Q60,62 72,52" stroke="#0a0202" stroke-width="2" fill="#0a0202"/>
    <path d="M52,52 L52,58 M56,53 L56,60 M60,53 L60,60 M64,53 L64,60 M68,52 L68,58" stroke="#fff" stroke-width="1.5"/>
  `),

  gremlinNob: wrap('sprite-enemy', '0 0 120 140', `
    <ellipse cx="60" cy="135" rx="45" ry="5" fill="rgba(0,0,0,0.5)"/>
    <path d="M30,80 Q26,60 40,55 L80,55 Q94,60 90,80 L92,130 L28,130 Z" fill="#3a6a2a"/>
    <rect x="34" y="125" width="16" height="15" fill="#1a3a10"/>
    <rect x="70" y="125" width="16" height="15" fill="#1a3a10"/>
    <circle cx="60" cy="45" r="24" fill="#5a8f3a"/>
    <path d="M40,38 L30,18 L46,32 Z" fill="#5a8f3a"/>
    <path d="M80,38 L90,18 L74,32 Z" fill="#5a8f3a"/>
    <circle cx="50" cy="42" r="5" fill="#fff"/>
    <circle cx="70" cy="42" r="5" fill="#fff"/>
    <circle cx="51" cy="43" r="2.5" fill="#000"/>
    <circle cx="71" cy="43" r="2.5" fill="#000"/>
    <path d="M46,55 Q60,64 74,55" stroke="#0a1a02" stroke-width="2" fill="#0a1a02"/>
    <path d="M50,55 L50,60 M55,56 L55,62 M60,56 L60,62 M65,56 L65,62 M70,55 L70,60" stroke="#fff" stroke-width="1.5"/>
    <!-- Club -->
    <rect x="95" y="35" width="6" height="90" fill="#5a3a1a"/>
    <ellipse cx="98" cy="35" rx="10" ry="14" fill="#7a5a2a"/>
  `),

  colossus: wrap('sprite-enemy', '0 0 120 140', `
    <ellipse cx="60" cy="135" rx="50" ry="5" fill="rgba(0,0,0,0.5)"/>
    <path d="M22,60 L98,60 L100,130 L20,130 Z" fill="#4a4a52"/>
    <path d="M22,60 L98,60 L96,80 L24,80 Z" fill="#3a3a42"/>
    <rect x="28" y="125" width="20" height="15" fill="#2a2a32"/>
    <rect x="72" y="125" width="20" height="15" fill="#2a2a32"/>
    <rect x="42" y="45" width="36" height="30" fill="#5a5a62"/>
    <circle cx="52" cy="55" r="4" fill="#7ef29b"/>
    <circle cx="68" cy="55" r="4" fill="#7ef29b"/>
    <rect x="52" y="65" width="16" height="3" fill="#2a2a32"/>
    <path d="M15,80 L25,95 L20,110 L10,110 Z" fill="#4a4a52"/>
    <path d="M105,80 L95,95 L100,110 L110,110 Z" fill="#4a4a52"/>
  `),

  nemesis: wrap('sprite-enemy', '0 0 120 140', `
    <ellipse cx="60" cy="135" rx="40" ry="5" fill="rgba(0,0,0,0.5)"/>
    <path d="M30,130 Q20,60 40,50 L80,50 Q100,60 90,130 Z" fill="#0a0a14"/>
    <path d="M35,130 Q38,100 45,85 L75,85 Q82,100 85,130 Z" fill="#050510"/>
    <!-- Skull -->
    <ellipse cx="60" cy="42" rx="20" ry="22" fill="#e8e8e8"/>
    <ellipse cx="52" cy="40" rx="5" ry="6" fill="#0a0a14"/>
    <ellipse cx="68" cy="40" rx="5" ry="6" fill="#0a0a14"/>
    <path d="M56,52 L56,60 M60,52 L60,62 M64,52 L64,60" stroke="#0a0a14" stroke-width="2"/>
    <!-- Scythe -->
    <rect x="100" y="20" width="3" height="110" fill="#3a2a1a"/>
    <path d="M103,22 Q85,15 70,30 Q88,25 103,35 Z" fill="#c0c0c0"/>
  `),

  slimeKing: wrap('sprite-enemy', '0 0 120 140', `
    <ellipse cx="60" cy="125" rx="50" ry="6" fill="rgba(0,0,0,0.4)"/>
    <ellipse cx="60" cy="95" rx="50" ry="35" fill="#2a7f3a"/>
    <ellipse cx="60" cy="90" rx="46" ry="32" fill="#5ecf6a"/>
    <ellipse cx="45" cy="80" rx="10" ry="8" fill="#a0ffb0" opacity="0.7"/>
    <!-- Crown -->
    <path d="M35,55 L40,35 L50,48 L60,28 L70,48 L80,35 L85,55 Z" fill="#e8c15a" stroke="#8a6220" stroke-width="2"/>
    <circle cx="40" cy="35" r="2" fill="#ff5555"/>
    <circle cx="60" cy="28" r="2" fill="#5555ff"/>
    <circle cx="80" cy="35" r="2" fill="#55ff55"/>
    <!-- Eyes -->
    <circle cx="45" cy="88" r="8" fill="#fff"/>
    <circle cx="75" cy="88" r="8" fill="#fff"/>
    <circle cx="46" cy="89" r="4" fill="#000"/>
    <circle cx="76" cy="89" r="4" fill="#000"/>
    <path d="M50,102 Q60,110 70,102" stroke="#0a2a10" stroke-width="2" fill="none"/>
  `),

  automaton: wrap('sprite-enemy', '0 0 120 140', `
    <ellipse cx="60" cy="135" rx="45" ry="5" fill="rgba(0,0,0,0.5)"/>
    <path d="M25,60 L95,60 L98,130 L22,130 Z" fill="#8a5a2a"/>
    <path d="M25,60 L95,60 L94,78 L26,78 Z" fill="#5a3a1a"/>
    <rect x="28" y="125" width="16" height="15" fill="#3a2a10"/>
    <rect x="76" y="125" width="16" height="15" fill="#3a2a10"/>
    <rect x="42" y="30" width="36" height="35" fill="#a07a4a" rx="4"/>
    <circle cx="52" cy="48" r="5" fill="#ff3a3a"/>
    <circle cx="68" cy="48" r="5" fill="#ff3a3a"/>
    <circle cx="52" cy="48" r="2" fill="#ffaaaa"/>
    <circle cx="68" cy="48" r="2" fill="#ffaaaa"/>
    <rect x="50" y="60" width="20" height="4" fill="#5a3a1a"/>
    <rect x="58" y="18" width="4" height="14" fill="#5a3a1a"/>
    <circle cx="60" cy="16" r="4" fill="#e8c15a"/>
  `),

  spireHeart: wrap('sprite-enemy', '0 0 120 140', `
    <ellipse cx="60" cy="130" rx="55" ry="6" fill="rgba(0,0,0,0.5)"/>
    <!-- Artery vessels -->
    <path d="M25,40 Q15,70 25,100 M95,40 Q105,70 95,100" stroke="#5a0a0a" stroke-width="6" fill="none"/>
    <path d="M35,25 Q30,50 40,80 M85,25 Q90,50 80,80" stroke="#8a1a1a" stroke-width="4" fill="none"/>
    <!-- Heart body -->
    <path d="M60,20 Q95,25 95,70 Q95,115 60,130 Q25,115 25,70 Q25,25 60,20 Z" fill="#a02020"/>
    <path d="M60,35 Q85,40 85,70 Q85,105 60,118 Q35,105 35,70 Q35,40 60,35 Z" fill="#c0392b"/>
    <!-- Pulsing veins -->
    <path d="M45,50 Q55,60 50,80 M75,50 Q65,60 70,80" stroke="#5a0808" stroke-width="3" fill="none"/>
    <!-- Eye -->
    <ellipse cx="60" cy="70" rx="14" ry="10" fill="#1a0000"/>
    <ellipse cx="60" cy="70" rx="8" ry="6" fill="#ff3a3a"/>
    <ellipse cx="60" cy="70" rx="3" ry="4" fill="#0a0000"/>
    <!-- Spikes -->
    <path d="M20,70 L12,65 L20,80 Z M100,70 L108,65 L100,80 Z" fill="#5a0a0a"/>
  `),
};

/* ---------- Публичное API ---------- */
export function getCharSprite(charId) {
  return CHAR_SPRITES[charId] || '';
}

export function getEnemySprite(enemyId, fallbackEmoji = '?') {
  return ENEMY_SPRITES[enemyId] || wrap('sprite-enemy', '0 0 120 120',
    `<text x="60" y="82" font-size="72" text-anchor="middle">${fallbackEmoji}</text>`);
}