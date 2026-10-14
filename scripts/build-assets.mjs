import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getTheme, escapeXml, getCommonDefs, getCornerBrackets } from './lib/tokens.mjs';
import { createBaseStyles, renderCardContainer, renderChip, renderProgressBar } from './lib/layout.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsDir = path.resolve(__dirname, '../assets');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Formats timestamp in America/Sao_Paulo
export function getSaoPauloTimestamp() {
  const d = new Date();
  const options = {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  };
  const parts = new Intl.DateTimeFormat('pt-BR', options).formatToParts(d);
  const part = (type) => parts.find(p => p.type === type)?.value || '';
  return `${part('day')}/${part('month')}/${part('year')} ${part('hour')}:${part('minute')} BRT`;
}

// 1. Header Banner SVG (1200 x 280)
export function generateHeaderSvg(themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);
  const defs = getCommonDefs(theme);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 280" width="1200" height="280" role="img" aria-label="Header Banner - João Marcelo Garcês">
  <title>João Marcelo Garcês // Full-Stack Developer &amp; DevOps</title>
  <style>
    ${styles}
    .hud-box {
      fill: ${theme.surfaceSubtle};
      stroke: ${theme.borderSubtle};
      stroke-width: 1;
    }
    .draw-path {
      stroke-dasharray: 600;
      stroke-dashoffset: 600;
      animation: draw-line 2.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  </style>
  ${defs}

  <!-- Background Base -->
  <rect width="1200" height="280" rx="14" fill="${theme.bg}" stroke="${theme.border}" stroke-width="1.2" />
  <rect width="1200" height="280" rx="14" fill="url(#ambientGlow)" />
  <rect width="1200" height="280" rx="14" fill="url(#cyberGrid)" />

  <!-- Corner Brackets -->
  ${getCornerBrackets(12, 12, 1176, 256, 12, theme.accentPrimary)}

  <!-- Scanline Sweep Effect -->
  <g opacity="0.12" class="scanline">
    <line x1="16" y1="0" x2="1184" y2="0" stroke="${theme.accentPrimary}" stroke-width="2" />
  </g>

  <!-- Top Status Badge -->
  <g transform="translate(48, 44)" class="fade-in">
    <rect x="0" y="0" width="220" height="24" rx="4" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
    <circle cx="14" cy="12" r="4" fill="${theme.success}" class="pulse" />
    <circle cx="14" cy="12" r="6" fill="${theme.success}" opacity="0.3" class="pulse" />
    <text x="26" y="16" fill="${theme.textSecondary}" font-size="11" font-weight="600" letter-spacing="1">SYSTEM ONLINE · GOIÂNIA/BR</text>
  </g>

  <!-- Decorative Orbit / Radar Indicator (Right Background) -->
  <g transform="translate(1080, 140)" opacity="${theme.name === 'dark' ? '0.25' : '0.18'}">
    <circle cx="0" cy="0" r="70" fill="none" stroke="${theme.accentSecondary}" stroke-width="1" stroke-dasharray="4 6" />
    <circle cx="0" cy="0" r="48" fill="none" stroke="${theme.accentPrimary}" stroke-width="1" />
    <circle cx="0" cy="0" r="24" fill="none" stroke="${theme.border}" stroke-width="1" />
    <line x1="-80" y1="0" x2="80" y2="0" stroke="${theme.border}" stroke-width="0.75" />
    <line x1="0" y1="-80" x2="0" y2="80" stroke="${theme.border}" stroke-width="0.75" />
    <circle cx="34" cy="-34" r="3" fill="${theme.accentPrimary}" />
  </g>

  <!-- Big Name with Rare Subtle Glitch -->
  <g transform="translate(48, 116)" class="fade-in">
    <text x="0" y="0" fill="${theme.text}" font-size="34" font-weight="800" letter-spacing="2" class="glitch-text">JOÃO MARCELO GARCÊS</text>
  </g>

  <!-- Accent Line (Draws on entrance) -->
  <g transform="translate(48, 134)">
    <line x1="0" y1="0" x2="520" y2="0" stroke="url(#cyanLineGrad)" stroke-width="2" class="draw-path" />
  </g>

  <!-- Subtitle with perfectly aligned trailing cursor inside tspan (no overlap) -->
  <g transform="translate(48, 168)" class="fade-in">
    <text x="0" y="0" fill="${theme.textSecondary}" font-size="15" font-weight="500" letter-spacing="0.5">Full-Stack Developer (React &amp; Node.js) // DevOps leve<tspan fill="${theme.accentPrimary}" font-weight="700" class="cursor"> ▌</tspan></text>
  </g>

  <!-- Secondary Philosophy Tagline -->
  <g transform="translate(48, 202)" class="fade-in">
    <text x="0" y="0" fill="${theme.textTertiary}" font-size="12" font-weight="400" letter-spacing="0.5">Estudante de Engenharia de Software (UniGOiás) · Goiânia, Brasil</text>
  </g>

  <!-- Terminal Status Panel (Right side) -->
  <g transform="translate(720, 48)" class="fade-in">
    <rect x="0" y="0" width="410" height="184" rx="8" class="hud-box" />
    ${getCornerBrackets(0, 0, 410, 184, 8, theme.accentSecondary)}

    <!-- HUD Header -->
    <rect x="0" y="0" width="410" height="28" rx="8" fill="${theme.surface}" />
    <line x1="0" y1="28" x2="410" y2="28" stroke="${theme.borderSubtle}" stroke-width="1" />
    <circle cx="16" cy="14" r="3.5" fill="${theme.accentPrimary}" />
    <circle cx="28" cy="14" r="3.5" fill="${theme.accentSecondary}" />
    <circle cx="40" cy="14" r="3.5" fill="${theme.success}" />
    <text x="56" y="18" fill="${theme.textSecondary}" font-size="11" font-weight="600" letter-spacing="1">STATUS_PANEL // SYS_DIAGNOSTIC</text>

    <!-- HUD Items -->
    <g transform="translate(20, 58)">
      <text x="0" y="0" fill="${theme.textTertiary}" font-size="11" font-weight="600">ROLE:</text>
      <text x="90" y="0" fill="${theme.text}" font-size="11" font-weight="600">FULL-STACK DEVELOPER</text>

      <text x="0" y="28" fill="${theme.textTertiary}" font-size="11" font-weight="600">TRILHA:</text>
      <text x="90" y="28" fill="${theme.accentPrimary}" font-size="11" font-weight="600">50% FRONT · 30% BACK · 20% OPS</text>

      <text x="0" y="56" fill="${theme.textTertiary}" font-size="11" font-weight="600">PREFERÊNCIA:</text>
      <text x="90" y="56" fill="${theme.text}" font-size="11" font-weight="500">Front-end · Aprendizado Prático</text>

      <text x="0" y="84" fill="${theme.textTertiary}" font-size="11" font-weight="600">IDIOMAS:</text>
      <text x="90" y="84" fill="${theme.textSecondary}" font-size="11" font-weight="500">PT (nativo) · EN/ES (intermediário)</text>

      <text x="0" y="108" fill="${theme.textTertiary}" font-size="10" font-weight="500">DEPLOY_STATE:</text>
      <text x="90" y="108" fill="${theme.success}" font-size="10" font-weight="600">CLEAN // PRODUCTION-READY</text>
    </g>
  </g>
</svg>`;
}

// 2. Typing SVG (850 x 52) - Completely self-contained CSS typewriter
export function generateTypingSvg(themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);

  // 4 phrases
  const phrases = [
    'Desenvolvendo aplicações web e mobile com React, TypeScript e Node.js.',
    'Interesse em IA aplicada, engenharia de prompt e arquitetura moderna.',
    'Foco em código limpo, testes automatizados e entrega contínua.',
    'Sempre aprendendo na prática, construindo projetos reais.'
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 52" width="850" height="52" role="img" aria-label="Cyberpunk Terminal Typing Animation">
  <title>${escapeXml(phrases[0])}</title>
  <style>
    ${styles}
    .typing-container {
      font-family: var(--font-mono);
      font-size: 14px;
      font-weight: 500;
      fill: var(--text);
    }
    .phrase {
      opacity: 0;
      position: relative;
    }
    /* Total cycle: 16s (4 phrases x 4s each) */
    @keyframes cycle-phrase-1 {
      0%, 2% { opacity: 0; clip-path: inset(0 100% 0 0); }
      4%, 22% { opacity: 1; clip-path: inset(0 0% 0 0); }
      24%, 100% { opacity: 0; clip-path: inset(0 100% 0 0); }
    }
    @keyframes cycle-phrase-2 {
      0%, 24% { opacity: 0; clip-path: inset(0 100% 0 0); }
      26%, 47% { opacity: 1; clip-path: inset(0 0% 0 0); }
      49%, 100% { opacity: 0; clip-path: inset(0 100% 0 0); }
    }
    @keyframes cycle-phrase-3 {
      0%, 49% { opacity: 0; clip-path: inset(0 100% 0 0); }
      51%, 72% { opacity: 1; clip-path: inset(0 0% 0 0); }
      74%, 100% { opacity: 0; clip-path: inset(0 100% 0 0); }
    }
    @keyframes cycle-phrase-4 {
      0%, 74% { opacity: 0; clip-path: inset(0 100% 0 0); }
      76%, 97% { opacity: 1; clip-path: inset(0 0% 0 0); }
      99%, 100% { opacity: 0; clip-path: inset(0 100% 0 0); }
    }

    .p1 { animation: cycle-phrase-1 16s steps(42, end) infinite; }
    .p2 { animation: cycle-phrase-2 16s steps(42, end) infinite; }
    .p3 { animation: cycle-phrase-3 16s steps(42, end) infinite; }
    .p4 { animation: cycle-phrase-4 16s steps(42, end) infinite; }

    @media (prefers-reduced-motion: reduce) {
      .p1 { opacity: 1 !important; clip-path: none !important; animation: none !important; }
      .p2, .p3, .p4 { display: none !important; }
    }
  </style>

  <rect width="850" height="52" rx="8" fill="${theme.surface}" stroke="${theme.border}" stroke-width="1.2" />
  ${getCornerBrackets(4, 4, 842, 44, 6, theme.accentPrimary)}

  <!-- Terminal prompt icon -->
  <g transform="translate(24, 31)">
    <text x="0" y="0" fill="${theme.accentPrimary}" font-size="15" font-weight="700">&gt;</text>
  </g>

  <!-- Animated Phrases -->
  <g transform="translate(48, 31)" class="typing-container">
    <text class="phrase p1" x="0" y="0">${escapeXml(phrases[0])}<tspan fill="${theme.accentPrimary}" class="cursor"> ▌</tspan></text>
    <text class="phrase p2" x="0" y="0">${escapeXml(phrases[1])}<tspan fill="${theme.accentPrimary}" class="cursor"> ▌</tspan></text>
    <text class="phrase p3" x="0" y="0">${escapeXml(phrases[2])}<tspan fill="${theme.accentPrimary}" class="cursor"> ▌</tspan></text>
    <text class="phrase p4" x="0" y="0">${escapeXml(phrases[3])}<tspan fill="${theme.accentPrimary}" class="cursor"> ▌</tspan></text>
  </g>
</svg>`;
}

// 3. Divider SVG (1200 x 18)
export function generateDividerSvg(themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 18" width="1200" height="18" role="img" aria-label="Cyberpunk Section Divider">
  <title>Divider</title>
  <style>
    ${styles}
    .light-dot {
      animation: travel-dot 5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }
  </style>
  <defs>
    <linearGradient id="divGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${theme.accentPrimary}" stop-opacity="0" />
      <stop offset="15%" stop-color="${theme.border}" stop-opacity="0.8" />
      <stop offset="50%" stop-color="${theme.accentPrimary}" stop-opacity="0.8" />
      <stop offset="85%" stop-color="${theme.accentSecondary}" stop-opacity="0.8" />
      <stop offset="100%" stop-color="${theme.accentSecondary}" stop-opacity="0" />
    </linearGradient>
  </defs>

  <!-- Central Base Line -->
  <line x1="50" y1="9" x2="1150" y2="9" stroke="url(#divGrad)" stroke-width="1.2" />

  <!-- Center Decorative Node -->
  <g transform="translate(600, 9)">
    <circle cx="0" cy="0" r="3" fill="${theme.accentPrimary}" />
    <circle cx="0" cy="0" r="5" fill="${theme.accentPrimary}" opacity="0.25" />
    <line x1="-15" y1="0" x2="-6" y2="0" stroke="${theme.accentPrimary}" stroke-width="1.5" />
    <line x1="6" y1="0" x2="15" y2="0" stroke="${theme.accentPrimary}" stroke-width="1.5" />
  </g>

  <!-- Traveling Light Dot -->
  <g class="light-dot" transform="translate(50, 9)">
    <circle cx="0" cy="0" r="2.5" fill="${theme.accentPrimary}" />
    <circle cx="0" cy="0" r="6" fill="${theme.accentPrimary}" opacity="0.3" />
  </g>
</svg>`;
}

// 4. Section Headers SVG (600 x 44)
export function generateSectionHeaderSvg(number, title, themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 44" width="600" height="44" role="img" aria-label="Seção ${number} - ${title}">
  <title>${number} // ${title}</title>
  <style>
    ${styles}
    .section-draw {
      stroke-dasharray: 450;
      stroke-dashoffset: 450;
      animation: draw-line 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  </style>

  <!-- Section Prefix and Title -->
  <g transform="translate(4, 26)">
    <text x="0" y="0" fill="${theme.accentPrimary}" font-size="16" font-weight="800" letter-spacing="1.5">${escapeXml(number)} //</text>
    <text x="70" y="0" fill="${theme.text}" font-size="16" font-weight="700" letter-spacing="1">${escapeXml(title)}</text>
  </g>

  <!-- Underline with Accent -->
  <line x1="4" y1="38" x2="450" y2="38" stroke="${theme.borderSubtle}" stroke-width="1.5" />
  <line x1="4" y1="38" x2="300" y2="38" stroke="${theme.accentPrimary}" stroke-width="1.5" class="section-draw" />
  <circle cx="300" cy="38" r="2" fill="${theme.accentPrimary}" />
</svg>`;
}

// 5. Navigation Bar SVG (900 x 44)
export function generateNavSvg(themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);
  const defs = getCommonDefs(theme);

  const items = [
    { num: '01', label: 'SOBRE', x: 25 },
    { num: '02', label: 'PROJETOS', x: 195 },
    { num: '03', label: 'STACK', x: 385 },
    { num: '04', label: 'ATIVIDADE', x: 555 },
    { num: '05', label: 'CONTATO', x: 745 }
  ];

  const itemsSvg = items.map(item => `
    <g transform="translate(${item.x}, 12)">
      <rect x="0" y="0" width="135" height="22" rx="4" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
      <text x="14" y="15" fill="${theme.accentPrimary}" font-size="10" font-weight="700">${item.num}.</text>
      <text x="36" y="15" fill="${theme.text}" font-size="11" font-weight="600" letter-spacing="0.5">${item.label}</text>
    </g>
  `).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 44" width="900" height="44" role="img" aria-label="Barra de Navegação do Perfil">
  <title>Navegação: Sobre, Projetos, Stack, Atividade, Contato</title>
  <style>${styles}</style>
  ${defs}

  <rect width="900" height="44" rx="8" fill="${theme.surface}" stroke="${theme.border}" stroke-width="1.2" />
  ${getCornerBrackets(4, 4, 892, 36, 6, theme.accentPrimary)}

  ${itemsSvg}
</svg>`;
}

// 6. Project Cards (~390 x 215)
export function generateCardSillage(themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);
  const defs = getCommonDefs(theme);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 215" width="390" height="215" role="img" aria-label="Card do Projeto Sillage">
  <title>Sillage — PWA de Perfumaria de Nicho</title>
  <style>${styles}</style>
  ${defs}

  ${renderCardContainer({
    x: 0,
    y: 0,
    width: 390,
    height: 215,
    theme,
    title: 'SILLAGE',
    statusText: 'EM REFINAMENTO',
    statusColor: theme.accentSecondary,
    statusPulse: true
  })}

  <!-- One line description -->
  <text x="20" y="60" fill="${theme.textSecondary}" font-size="11" font-weight="500">
    PWA de catálogo e coleção de perfumaria de nicho
  </text>

  <!-- Progress Bar (4/12 phases) -->
  ${renderProgressBar({
    x: 20,
    y: 92,
    width: 350,
    height: 7,
    current: 4,
    total: 12,
    label: 'PROGRESSO (FASES CONCLUÍDAS)',
    theme
  })}

  <!-- Stack Chips -->
  <g transform="translate(20, 116)">
    ${renderChip({ x: 0, y: 0, label: 'React 19', theme })}
    ${renderChip({ x: 74, y: 0, label: 'TypeScript', theme })}
    ${renderChip({ x: 168, y: 0, label: 'Vite', theme })}
    ${renderChip({ x: 218, y: 0, label: 'Tailwind', theme })}
    ${renderChip({ x: 292, y: 0, label: 'Supabase', theme })}
  </g>

  <!-- Quality & Testing Highlights -->
  <g transform="translate(20, 160)">
    <rect x="0" y="0" width="350" height="38" rx="6" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
    <circle cx="14" cy="19" r="3.5" fill="${theme.accentPrimary}" />
    <text x="26" y="16" fill="${theme.text}" font-size="10" font-weight="600">QUALIDADE: 49 E2E (Playwright) · 220 pgTAP</text>
    <text x="26" y="29" fill="${theme.textTertiary}" font-size="9.5" font-weight="500">123 Unitários · WCAG AA (axe-core) · CI Actions</text>
  </g>
</svg>`;
}

export function generateCardNos(themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);
  const defs = getCommonDefs(theme);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 215" width="390" height="215" role="img" aria-label="Card do Projeto NÓS">
  <title>NÓS — App Privado para Casais</title>
  <style>${styles}</style>
  ${defs}

  ${renderCardContainer({
    x: 0,
    y: 0,
    width: 390,
    height: 215,
    theme,
    title: 'NÓS',
    statusText: 'EM PRODUÇÃO',
    statusColor: theme.success,
    statusPulse: true
  })}

  <!-- One line description -->
  <text x="20" y="60" fill="${theme.textSecondary}" font-size="11" font-weight="500">
    App privado para casais (mensagens, memórias e datas)
  </text>

  <!-- Production Highlight Badge -->
  <g transform="translate(20, 78)">
    <rect x="0" y="0" width="350" height="24" rx="4" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
    <text x="12" y="16" fill="${theme.accentPrimary}" font-size="10" font-weight="700">STATUS:</text>
    <text x="70" y="16" fill="${theme.text}" font-size="10.5" font-weight="600">PWA em Produção na Vercel</text>
  </g>

  <!-- Stack Chips -->
  <g transform="translate(20, 116)">
    ${renderChip({ x: 0, y: 0, label: 'React Native', theme })}
    ${renderChip({ x: 104, y: 0, label: 'Expo Router', theme })}
    ${renderChip({ x: 202, y: 0, label: 'TypeScript', theme })}
    ${renderChip({ x: 294, y: 0, label: 'Supabase', theme })}
  </g>

  <!-- Security & Architecture Highlights -->
  <g transform="translate(20, 160)">
    <rect x="0" y="0" width="350" height="38" rx="6" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
    <circle cx="14" cy="19" r="3.5" fill="${theme.success}" />
    <text x="26" y="16" fill="${theme.text}" font-size="10" font-weight="600">ARQUITETURA: RLS Versionada · Convites por Código</text>
    <text x="26" y="29" fill="${theme.textTertiary}" font-size="9.5" font-weight="500">Security Headers · Design System Próprio · Reanimated</text>
  </g>
</svg>`;
}

export function generateCardPaggo(themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);
  const defs = getCommonDefs(theme);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 390 215" width="390" height="215" role="img" aria-label="Card do Projeto Paggo.AI">
  <title>Paggo.AI — Controle Financeiro Pessoal</title>
  <style>${styles}</style>
  ${defs}

  ${renderCardContainer({
    x: 0,
    y: 0,
    width: 390,
    height: 215,
    theme,
    title: 'PAGGO.AI',
    statusText: 'EM DESENVOLVIMENTO',
    statusColor: theme.accentPrimary,
    statusPulse: true
  })}

  <!-- One line description -->
  <text x="20" y="60" fill="${theme.textSecondary}" font-size="11" font-weight="500">
    Controle financeiro pessoal web + mobile (TCC em equipe de 3)
  </text>

  <!-- Role Highlight Badge -->
  <g transform="translate(20, 78)">
    <rect x="0" y="0" width="350" height="24" rx="4" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
    <text x="12" y="16" fill="${theme.accentPrimary}" font-size="10" font-weight="700">PAPEL:</text>
    <text x="64" y="16" fill="${theme.text}" font-size="10.5" font-weight="600">Front-End Web (Cadastro &amp; Bancos) &amp; QA</text>
  </g>

  <!-- Stack Chips -->
  <g transform="translate(20, 116)">
    ${renderChip({ x: 0, y: 0, label: 'React', theme })}
    ${renderChip({ x: 58, y: 0, label: 'Node.js', theme })}
    ${renderChip({ x: 126, y: 0, label: 'Express', theme })}
    ${renderChip({ x: 196, y: 0, label: 'Prisma', theme })}
    ${renderChip({ x: 256, y: 0, label: 'PostgreSQL', theme })}
  </g>

  <!-- Integrations & Scope -->
  <g transform="translate(20, 160)">
    <rect x="0" y="0" width="350" height="38" rx="6" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
    <circle cx="14" cy="19" r="3.5" fill="${theme.accentPrimary}" />
    <text x="26" y="16" fill="${theme.text}" font-size="10" font-weight="600">ESCOPO: Open Finance · Dashboards com Recharts</text>
    <text x="26" y="29" fill="${theme.textTertiary}" font-size="9.5" font-weight="500">Expo Mobile · PostgreSQL via Prisma ORM</text>
  </g>
</svg>`;
}

// 7. Stack Panels (~380 x 240)
export function generateStackFrontend(themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);
  const defs = getCommonDefs(theme);

  const items = [
    { label: 'React', ind: 'em uso' },
    { label: 'TypeScript', ind: 'em uso' },
    { label: 'JavaScript', ind: 'em uso' },
    { label: 'Vite', ind: 'em uso' },
    { label: 'Tailwind CSS', ind: 'em uso' },
    { label: 'React Native', ind: 'em uso' },
    { label: 'Expo', ind: 'em uso' },
    { label: 'HTML5 / CSS3', ind: 'em uso' }
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 240" width="380" height="240" role="img" aria-label="Painel de Stack: Front-end">
  <title>Stack // Front-end (50% foco de estudo)</title>
  <style>${styles}</style>
  ${defs}

  ${renderCardContainer({
    x: 0,
    y: 0,
    width: 380,
    height: 240,
    theme,
    title: '03.1 // FRONT-END',
    statusText: '50% FOCO',
    statusColor: theme.accentPrimary,
    statusPulse: false
  })}

  <!-- Legend -->
  <g transform="translate(20, 56)">
    <circle cx="6" cy="6" r="3" fill="${theme.accentPrimary}" />
    <text x="16" y="9" fill="${theme.textTertiary}" font-size="10" font-weight="600">● EM USO EM PROJETOS ATIVOS</text>
  </g>

  <!-- Chips Grid -->
  <g transform="translate(20, 76)">
    <!-- Row 1 -->
    ${renderChip({ x: 0, y: 0, label: items[0].label, indicator: items[0].ind, theme, width: 105 })}
    ${renderChip({ x: 115, y: 0, label: items[1].label, indicator: items[1].ind, theme, width: 120 })}
    ${renderChip({ x: 245, y: 0, label: items[2].label, indicator: items[2].ind, theme, width: 95 })}

    <!-- Row 2 -->
    ${renderChip({ x: 0, y: 34, label: items[3].label, indicator: items[3].ind, theme, width: 85 })}
    ${renderChip({ x: 95, y: 34, label: items[4].label, indicator: items[4].ind, theme, width: 130 })}
    ${renderChip({ x: 235, y: 34, label: items[5].label, indicator: items[5].ind, theme, width: 105 })}

    <!-- Row 3 -->
    ${renderChip({ x: 0, y: 68, label: items[6].label, indicator: items[6].ind, theme, width: 85 })}
    ${renderChip({ x: 95, y: 68, label: items[7].label, indicator: items[7].ind, theme, width: 145 })}
  </g>

  <!-- Track note -->
  <g transform="translate(20, 206)">
    <text x="0" y="0" fill="${theme.textTertiary}" font-size="10" font-weight="500">Desenvolvimento de interfaces modernas, PWA e mobile</text>
  </g>
</svg>`;
}

export function generateStackBackend(themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);
  const defs = getCommonDefs(theme);

  const items = [
    { label: 'Node.js', ind: 'em uso' },
    { label: 'Express', ind: 'em uso' },
    { label: 'PostgreSQL', ind: 'em uso' },
    { label: 'Prisma ORM', ind: 'em uso' },
    { label: 'Supabase', ind: 'em uso' }
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 240" width="380" height="240" role="img" aria-label="Painel de Stack: Back-end">
  <title>Stack // Back-end (30% foco de estudo)</title>
  <style>${styles}</style>
  ${defs}

  ${renderCardContainer({
    x: 0,
    y: 0,
    width: 380,
    height: 240,
    theme,
    title: '03.2 // BACK-END',
    statusText: '30% FOCO',
    statusColor: theme.accentSecondary,
    statusPulse: false
  })}

  <!-- Legend -->
  <g transform="translate(20, 56)">
    <circle cx="6" cy="6" r="3" fill="${theme.accentPrimary}" />
    <text x="16" y="9" fill="${theme.textTertiary}" font-size="10" font-weight="600">● EM USO EM PROJETOS ATIVOS</text>
  </g>

  <!-- Chips Grid -->
  <g transform="translate(20, 76)">
    <!-- Row 1 -->
    ${renderChip({ x: 0, y: 0, label: items[0].label, indicator: items[0].ind, theme, width: 105 })}
    ${renderChip({ x: 115, y: 0, label: items[1].label, indicator: items[1].ind, theme, width: 105 })}
    ${renderChip({ x: 230, y: 0, label: items[2].label, indicator: items[2].ind, theme, width: 110 })}

    <!-- Row 2 -->
    ${renderChip({ x: 0, y: 34, label: items[3].label, indicator: items[3].ind, theme, width: 120 })}
    ${renderChip({ x: 130, y: 34, label: items[4].label, indicator: items[4].ind, theme, width: 115 })}
  </g>

  <!-- Track note -->
  <g transform="translate(20, 206)">
    <text x="0" y="0" fill="${theme.textTertiary}" font-size="10" font-weight="500">APIs RESTful, bancos relacionais e BaaS moderno</text>
  </g>
</svg>`;
}

export function generateStackOps(themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);
  const defs = getCommonDefs(theme);

  const items = [
    { label: 'Docker', ind: 'estudando' },
    { label: 'GitHub Actions', ind: 'em uso' },
    { label: 'Vercel', ind: 'em uso' },
    { label: 'Git', ind: 'em uso' },
    { label: 'Playwright', ind: 'em uso' },
    { label: 'pgTAP', ind: 'em uso' }
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 240" width="380" height="240" role="img" aria-label="Painel de Stack: Ops e Qualidade">
  <title>Stack // Ops &amp; Qualidade (20% foco de estudo)</title>
  <style>${styles}</style>
  ${defs}

  ${renderCardContainer({
    x: 0,
    y: 0,
    width: 380,
    height: 240,
    theme,
    title: '03.3 // OPS &amp; QUALIDADE',
    statusText: '20% FOCO',
    statusColor: theme.success,
    statusPulse: false
  })}

  <!-- Legend with two states -->
  <g transform="translate(20, 56)">
    <circle cx="6" cy="6" r="3" fill="${theme.accentPrimary}" />
    <text x="14" y="9" fill="${theme.textTertiary}" font-size="9.5" font-weight="600">● EM USO</text>
    <circle cx="85" cy="6" r="3" fill="${theme.accentSecondary}" />
    <text x="93" y="9" fill="${theme.textTertiary}" font-size="9.5" font-weight="600">● ESTUDANDO</text>
  </g>

  <!-- Chips Grid -->
  <g transform="translate(20, 76)">
    <!-- Row 1 -->
    ${renderChip({ x: 0, y: 0, label: items[0].label, indicator: items[0].ind, theme, width: 105 })}
    ${renderChip({ x: 115, y: 0, label: items[1].label, indicator: items[1].ind, theme, width: 145 })}
    ${renderChip({ x: 270, y: 0, label: items[2].label, indicator: items[2].ind, theme, width: 70 })}

    <!-- Row 2 -->
    ${renderChip({ x: 0, y: 34, label: items[3].label, indicator: items[3].ind, theme, width: 75 })}
    ${renderChip({ x: 85, y: 34, label: items[4].label, indicator: items[4].ind, theme, width: 125 })}
    ${renderChip({ x: 220, y: 34, label: items[5].label, indicator: items[5].ind, theme, width: 95 })}
  </g>

  <!-- Track note -->
  <g transform="translate(20, 206)">
    <text x="0" y="0" fill="${theme.textTertiary}" font-size="10" font-weight="500">CI/CD automatizado, pipelines de teste E2E e deploy</text>
  </g>
</svg>`;
}

// 8. Footer Banner SVG (1200 x 86)
export function generateFooterSvg(themeName = 'dark', timestamp = null) {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);
  const defs = getCommonDefs(theme);
  const timeStr = timestamp || getSaoPauloTimestamp();

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 86" width="1200" height="86" role="img" aria-label="Rodapé do Perfil">
  <title>Terminal Rodapé: $ git commit -m "sempre aprendendo"</title>
  <style>${styles}</style>
  ${defs}

  <rect width="1200" height="86" rx="10" fill="${theme.surface}" stroke="${theme.border}" stroke-width="1.2" />
  <rect width="1200" height="86" rx="10" fill="url(#ambientGlow)" />
  ${getCornerBrackets(6, 6, 1188, 74, 8, theme.accentPrimary)}

  <!-- Git Commit Command line -->
  <g transform="translate(32, 38)">
    <text x="0" y="0" fill="${theme.accentPrimary}" font-size="13" font-weight="700">&gt;</text>
    <text x="16" y="0" fill="${theme.textSecondary}" font-size="13" font-weight="600">$ git commit -m &quot;<tspan fill="${theme.text}">sempre aprendendo</tspan>&quot;</text>
  </g>

  <!-- Bottom Details -->
  <g transform="translate(32, 62)">
    <circle cx="4" cy="-4" r="3" fill="${theme.success}" class="pulse" />
    <text x="14" y="0" fill="${theme.textTertiary}" font-size="11" font-weight="500">SYS_ID: SNOOPYJMX // CORE: OPERACIONAL // GOIÂNIA, BR</text>
  </g>

  <!-- Timestamp updated in America/Sao_Paulo -->
  <g transform="translate(1168, 50)">
    <text x="0" y="0" fill="${theme.textTertiary}" font-size="11" font-weight="500" text-anchor="end">
      atualizado em: <tspan fill="${theme.accentPrimary}" font-weight="600">${escapeXml(timeStr)}</tspan>
    </text>
  </g>
</svg>`;
}

// Build all static assets
export function buildAllAssets(options = {}) {
  const timestamp = options.timestamp || getSaoPauloTimestamp();
  const themes = ['dark', 'light'];

  const assets = [
    // Header
    { name: 'header', fn: (t) => generateHeaderSvg(t) },
    // Typing
    { name: 'typing', fn: (t) => generateTypingSvg(t) },
    // Divider
    { name: 'divider', fn: (t) => generateDividerSvg(t) },
    // Nav
    { name: 'nav', fn: (t) => generateNavSvg(t) },
    // Section headers
    { name: 'section-sobre', fn: (t) => generateSectionHeaderSvg('01', 'SOBRE', t) },
    { name: 'section-projetos', fn: (t) => generateSectionHeaderSvg('02', 'PROJETOS', t) },
    { name: 'section-stack', fn: (t) => generateSectionHeaderSvg('03', 'STACK TECNOLÓGICO', t) },
    { name: 'section-atividade', fn: (t) => generateSectionHeaderSvg('04', 'ATIVIDADE &amp; MÉTRICAS', t) },
    { name: 'section-contato', fn: (t) => generateSectionHeaderSvg('05', 'CONTATO', t) },
    // Project Cards
    { name: 'card-sillage', fn: (t) => generateCardSillage(t) },
    { name: 'card-nos', fn: (t) => generateCardNos(t) },
    { name: 'card-paggo', fn: (t) => generateCardPaggo(t) },
    // Stack Panels
    { name: 'stack-frontend', fn: (t) => generateStackFrontend(t) },
    { name: 'stack-backend', fn: (t) => generateStackBackend(t) },
    { name: 'stack-ops', fn: (t) => generateStackOps(t) },
    // Footer
    { name: 'footer', fn: (t) => generateFooterSvg(t, timestamp) }
  ];

  console.log(`[build-assets] Gerando ativos para os temas: ${themes.join(', ')}...`);

  for (const asset of assets) {
    for (const theme of themes) {
      const fileName = `${asset.name}-${theme}.svg`;
      const filePath = path.join(assetsDir, fileName);
      const content = asset.fn(theme);
      fs.writeFileSync(filePath, content, 'utf8');
    }
    // Also save default matching dark version
    const defaultPath = path.join(assetsDir, `${asset.name}.svg`);
    const defaultContent = asset.fn('dark');
    fs.writeFileSync(defaultPath, defaultContent, 'utf8');
  }

  console.log(`[build-assets] Sucesso! ${assets.length * 2 + assets.length} arquivos gerados em assets/`);
}

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  buildAllAssets();
}

