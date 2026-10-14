import { getTheme, escapeXml, getCommonDefs, getCornerBrackets } from './tokens.mjs';
import { createBaseStyles, renderCardContainer } from './layout.mjs';

// 1. Stats Card SVG (440 x 215)
export function generateStatsSvg(data, themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);
  const defs = getCommonDefs(theme);

  const isPlaceholder = data.isPlaceholder;
  const titleAttr = isPlaceholder ? 'Estatísticas de Contribuição (aguardando primeira atualização)' : 'Estatísticas Gerais de Desenvolvimento';
  const summary = data.summary || {
    totalCommitsYear: 0,
    totalPRs: 0,
    totalIssues: 0,
    totalStars: 0,
    totalRepos: { total: 0, public: 0, private: 0 }
  };

  const metrics = [
    { label: 'COMMITS (ÚLTIMO ANO)', value: summary.totalCommitsYear, sub: 'atividades registradas' },
    { label: 'PULL REQUESTS', value: summary.totalPRs, sub: 'abertos e mergeados' },
    { label: 'ISSUES RESOLVIDAS', value: summary.totalIssues, sub: 'reportadas e geridas' },
    { label: 'ESTRELAS RECEBIDAS', value: summary.totalStars, sub: 'reconhecimento da comunidade' }
  ];

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 215" width="440" height="215" role="img" aria-label="Estatísticas de Atividade">
  <title>${escapeXml(titleAttr)}</title>
  <style>
    ${styles}
    .metric-val {
      font-size: 24px;
      font-weight: 800;
      fill: var(--text);
    }
    .metric-label {
      font-size: 9.5px;
      font-weight: 700;
      letter-spacing: 0.8px;
      fill: var(--text-sec);
    }
    .metric-sub {
      font-size: 9px;
      fill: var(--text-ter);
    }
    .count-anim {
      animation: fade-in-up 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  </style>
  ${defs}

  ${renderCardContainer({
    x: 0,
    y: 0,
    width: 440,
    height: 215,
    theme,
    title: 'MÉTRICAS // GITHUB CORE',
    statusText: isPlaceholder ? 'AGUARDANDO SYNC' : 'ATIVO · 365D',
    statusColor: isPlaceholder ? theme.textTertiary : theme.success,
    statusPulse: !isPlaceholder
  })}

  <!-- 2x2 Grid of Metrics -->
  <!-- Top Left: Commits -->
  <g transform="translate(24, 60)" class="count-anim">
    <rect x="0" y="0" width="186" height="60" rx="6" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
    <text x="14" y="22" class="metric-label">${metrics[0].label}</text>
    <text x="14" y="48" class="metric-val" fill="${theme.accentPrimary}">${metrics[0].value.toLocaleString('pt-BR')}</text>
  </g>

  <!-- Top Right: Pull Requests -->
  <g transform="translate(230, 60)" class="count-anim">
    <rect x="0" y="0" width="186" height="60" rx="6" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
    <text x="14" y="22" class="metric-label">${metrics[1].label}</text>
    <text x="14" y="48" class="metric-val">${metrics[1].value}</text>
  </g>

  <!-- Bottom Left: Issues -->
  <g transform="translate(24, 134)" class="count-anim">
    <rect x="0" y="0" width="186" height="60" rx="6" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
    <text x="14" y="22" class="metric-label">${metrics[2].label}</text>
    <text x="14" y="48" class="metric-val">${metrics[2].value}</text>
  </g>

  <!-- Bottom Right: Repos / Stars -->
  <g transform="translate(230, 134)" class="count-anim">
    <rect x="0" y="0" width="186" height="60" rx="6" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
    <text x="14" y="22" class="metric-label">REPOSITÓRIOS</text>
    <text x="14" y="48" class="metric-val">
      ${summary.totalRepos?.total || 0}
      <tspan font-size="11" font-weight="500" fill="${theme.textTertiary}"> (${summary.totalRepos?.public || 0} pub · ${summary.totalRepos?.private || 0} priv)</tspan>
    </text>
  </g>
</svg>`;
}

// 2. Streak Card SVG (440 x 215)
export function generateStreakSvg(data, themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);
  const defs = getCommonDefs(theme);

  const isPlaceholder = data.isPlaceholder;
  const titleAttr = isPlaceholder ? 'Sequência de Commits (aguardando primeira atualização)' : 'Sequência de Commits e Consistência';
  const summary = data.summary || { currentStreak: 0, longestStreak: 0 };
  const current = summary.currentStreak || 0;
  const longest = summary.longestStreak || 0;

  // Calculate circular stroke offset (circumference of r=38 is 2 * PI * 38 = 238.76)
  const circumference = 238.76;
  const ratio = longest > 0 ? Math.min(1, current / longest) : 0;
  const dashoffset = Math.round(circumference * (1 - ratio));

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 215" width="440" height="215" role="img" aria-label="Sequência de Commits">
  <title>${escapeXml(titleAttr)}</title>
  <style>
    ${styles}
    .ring-track {
      fill: none;
      stroke: ${theme.surfaceSubtle};
      stroke-width: 8;
    }
    .ring-fill {
      fill: none;
      stroke: ${theme.accentPrimary};
      stroke-width: 8;
      stroke-linecap: round;
      stroke-dasharray: ${circumference};
      stroke-dashoffset: ${dashoffset};
      transform: rotate(-90deg);
      transform-origin: 75px 125px;
      animation: draw-line 2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  </style>
  ${defs}

  ${renderCardContainer({
    x: 0,
    y: 0,
    width: 440,
    height: 215,
    theme,
    title: 'STREAK // CONSISTÊNCIA',
    statusText: isPlaceholder ? 'AGUARDANDO SYNC' : 'DIÁRIO',
    statusColor: isPlaceholder ? theme.textTertiary : theme.accentPrimary,
    statusPulse: !isPlaceholder
  })}

  <!-- Left: Animated Ring -->
  <g transform="translate(10, 0)">
    <circle cx="75" cy="125" r="38" class="ring-track" />
    <circle cx="75" cy="125" r="38" class="ring-fill" />
    <text x="75" y="129" fill="${theme.text}" font-size="20" font-weight="800" text-anchor="middle">
      ${current}
    </text>
    <text x="75" y="142" fill="${theme.textTertiary}" font-size="9" font-weight="600" text-anchor="middle">
      DIAS
    </text>
  </g>

  <!-- Right: Streak Stats Box -->
  <g transform="translate(160, 60)">
    <!-- Current Streak -->
    <rect x="0" y="0" width="256" height="60" rx="6" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
    <text x="14" y="22" fill="${theme.textSecondary}" font-size="9.5" font-weight="700" letter-spacing="0.8">SEQUÊNCIA ATUAL</text>
    <text x="14" y="48" fill="${theme.accentPrimary}" font-size="22" font-weight="800">
      ${current} <tspan font-size="12" font-weight="600" fill="${theme.textSecondary}">dias consecutivos</tspan>
    </text>
  </g>

  <g transform="translate(160, 134)">
    <!-- Longest Streak -->
    <rect x="0" y="0" width="256" height="60" rx="6" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
    <text x="14" y="22" fill="${theme.textSecondary}" font-size="9.5" font-weight="700" letter-spacing="0.8">RECORDE PESSOAL</text>
    <text x="14" y="48" fill="${theme.text}" font-size="22" font-weight="800">
      ${longest} <tspan font-size="12" font-weight="600" fill="${theme.textSecondary}">dias consecutivos</tspan>
    </text>
  </g>
</svg>`;
}

// 3. Languages Bar SVG (890 x 140)
export function generateLanguagesSvg(data, themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);
  const defs = getCommonDefs(theme);

  const isPlaceholder = data.isPlaceholder;
  const titleAttr = isPlaceholder ? 'Linguagens Mais Utilizadas (aguardando primeira atualização)' : 'Linguagens e Tecnologias Mais Utilizadas';
  const languages = data.languages || [
    { name: 'TypeScript', percent: 50, color: '#3178c6' },
    { name: 'JavaScript', percent: 30, color: '#f7df1e' },
    { name: 'SQL', percent: 20, color: '#e38c00' }
  ];

  const totalWidth = 830;
  let currentX = 0;

  const barSegments = languages.map((lang, index) => {
    const width = Math.max(8, Math.round((lang.percent / 100) * totalWidth));
    const segmentX = currentX;
    currentX += width;
    const isFirst = index === 0;
    const isLast = index === languages.length - 1;

    return `
      <rect x="${segmentX}" y="0" width="${width}" height="14" fill="${lang.color || theme.accentPrimary}" rx="${isFirst || isLast ? '3' : '0'}" />
    `;
  }).join('');

  // Legend Items
  let legendX = 20;
  const legendItems = languages.slice(0, 5).map((lang) => {
    const itemSvg = `
      <g transform="translate(${legendX}, 0)">
        <circle cx="5" cy="5" r="4" fill="${lang.color || theme.accentPrimary}" />
        <text x="15" y="8" fill="${theme.text}" font-size="11" font-weight="600">${escapeXml(lang.name)}</text>
        <text x="15" y="22" fill="${theme.textSecondary}" font-size="10" font-weight="500">${lang.percent}%</text>
      </g>
    `;
    legendX += 160;
    return itemSvg;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 890 140" width="890" height="140" role="img" aria-label="Linguagens Mais Utilizadas">
  <title>${escapeXml(titleAttr)}</title>
  <style>
    ${styles}
    .lang-bar {
      transform-origin: left;
      animation: fade-in-up 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
  </style>
  ${defs}

  ${renderCardContainer({
    x: 0,
    y: 0,
    width: 890,
    height: 140,
    theme,
    title: 'LINGUAGENS // CÓDIGO FONTE',
    statusText: 'EXCLUI MARKUP &amp; LOCKFILES',
    statusColor: theme.textSecondary,
    statusPulse: false
  })}

  <!-- Stacked Bar Container -->
  <g transform="translate(30, 54)">
    <rect x="0" y="0" width="${totalWidth}" height="14" rx="4" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
    <g class="lang-bar">
      ${barSegments}
    </g>
  </g>

  <!-- Legend Items Row -->
  <g transform="translate(10, 88)">
    ${legendItems}
  </g>
</svg>`;
}

// 4. Heatmap Calendar SVG (890 x 175)
export function generateHeatmapSvg(data, themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);
  const defs = getCommonDefs(theme);

  const isPlaceholder = data.isPlaceholder;
  const titleAttr = isPlaceholder ? 'Calendário de Contribuições (aguardando primeira atualização)' : 'Calendário de Contribuições (52 Semanas)';

  // 5 intensity levels for the cyan cells
  const colors = theme.name === 'dark' ? [
    theme.surfaceSubtle, // level 0: empty
    'rgba(0, 229, 255, 0.22)', // level 1
    'rgba(0, 229, 255, 0.48)', // level 2
    'rgba(0, 229, 255, 0.75)', // level 3
    '#00e5ff' // level 4
  ] : [
    theme.surfaceSubtle,
    'rgba(0, 119, 153, 0.25)',
    'rgba(0, 119, 153, 0.50)',
    'rgba(0, 119, 153, 0.75)',
    '#007799'
  ];

  // Generate 52 weeks x 7 days
  const weeks = data.contributionWeeks || generateSyntheticWeeks();

  const cellSize = 11;
  const cellGap = 3.5;
  const startX = 54;
  const startY = 62;

  let columnsSvg = '';
  weeks.forEach((week, wIdx) => {
    const colDelay = +(wIdx * 0.018).toFixed(2);
    const colX = startX + wIdx * (cellSize + cellGap);
    let colCells = '';

    week.days.forEach((day, dIdx) => {
      const y = startY + dIdx * (cellSize + cellGap);
      const level = Math.min(4, Math.max(0, day.level || 0));
      const color = colors[level];
      const count = day.count || 0;
      const date = day.date || '';
      const tooltip = `${date}: ${count} ${count === 1 ? 'contrib' : 'contribs'}`;

      colCells += `<rect x="${colX}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="${color}"><title>${escapeXml(tooltip)}</title></rect>`;
    });

    columnsSvg += `<g style="animation:fade-in-up .4s ease-out ${colDelay}s both">${colCells}</g>`;
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 890 175" width="890" height="175" role="img" aria-label="Calendário de Contribuições">
  <title>${escapeXml(titleAttr)}</title>
  <style>
    ${styles}
    .day-label {
      font-size: 9px;
      font-weight: 600;
      fill: var(--text-ter);
    }
  </style>
  ${defs}

  ${renderCardContainer({
    x: 0,
    y: 0,
    width: 890,
    height: 175,
    theme,
    title: 'HEATMAP // 52 SEMANAS',
    statusText: isPlaceholder ? 'AGUARDANDO SYNC' : 'ATIVIDADE ANUAL',
    statusColor: isPlaceholder ? theme.textTertiary : theme.accentPrimary,
    statusPulse: !isPlaceholder
  })}

  <!-- Day Labels (Seg, Qua, Sex) -->
  <g transform="translate(24, 0)">
    <text x="0" y="${startY + (cellSize + cellGap) * 1 + 8}" class="day-label">Seg</text>
    <text x="0" y="${startY + (cellSize + cellGap) * 3 + 8}" class="day-label">Qua</text>
    <text x="0" y="${startY + (cellSize + cellGap) * 5 + 8}" class="day-label">Sex</text>
  </g>

  <!-- Heatmap Grid -->
  <g>
    ${columnsSvg}
  </g>

  <!-- Legend (Menos -> Mais) -->
  <g transform="translate(730, 155)">
    <text x="-42" y="9" fill="${theme.textTertiary}" font-size="9" font-weight="600">Menos</text>
    <rect x="0" y="0" width="10" height="10" rx="2" fill="${colors[0]}" />
    <rect x="13" y="0" width="10" height="10" rx="2" fill="${colors[1]}" />
    <rect x="26" y="0" width="10" height="10" rx="2" fill="${colors[2]}" />
    <rect x="39" y="0" width="10" height="10" rx="2" fill="${colors[3]}" />
    <rect x="52" y="0" width="10" height="10" rx="2" fill="${colors[4]}" />
    <text x="68" y="9" fill="${theme.textTertiary}" font-size="9" font-weight="600">Mais</text>
  </g>
</svg>`;
}

// 5. Hours of Commits & Day of Week SVG (890 x 205)
export function generateHoursSvg(data, themeName = 'dark') {
  const theme = getTheme(themeName);
  const styles = createBaseStyles(theme);
  const defs = getCommonDefs(theme);

  const isPlaceholder = data.isPlaceholder;
  const titleAttr = isPlaceholder ? 'Distribuição de Commits por Hora e Dia (aguardando primeira atualização)' : 'Distribuição de Commits por Hora e Dia da Semana';

  const hours = data.commitHours || Array(24).fill(0);
  const days = data.commitDays || Array(7).fill(0);
  const maxHour = Math.max(...hours, 1);
  const maxDay = Math.max(...days, 1);

  // Hours Bars (24 bars)
  const barWidth = 14;
  const barGap = 6;
  const chartHeight = 75;
  const startX = 36;
  const baseLineY = 145;

  let hourBarsSvg = '';
  for (let i = 0; i < 24; i++) {
    const val = hours[i];
    const h = Math.max(3, Math.round((val / maxHour) * chartHeight));
    const x = startX + i * (barWidth + barGap);
    const y = baseLineY - h;
    const isPeak = val === maxHour && val > 0;

    hourBarsSvg += `
      <g>
        <rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="3" fill="${isPeak ? theme.accentPrimary : theme.accentSecondary}" opacity="${val > 0 ? (isPeak ? '1' : '0.8') : '0.2'}" />
        <title>${i}h: ${val} commits</title>
        ${i % 3 === 0 ? `<text x="${x + 7}" y="${baseLineY + 16}" fill="${theme.textTertiary}" font-size="9" font-weight="600" text-anchor="middle">${i}h</text>` : ''}
      </g>
    `;
  }

  // Days Bars (7 bars: Dom, Seg, Ter, Qua, Qui, Sex, Sab)
  const dayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const dayStartX = 580;
  const dayBarWidth = 26;
  const dayGap = 12;

  let dayBarsSvg = '';
  for (let i = 0; i < 7; i++) {
    const val = days[i];
    const h = Math.max(3, Math.round((val / maxDay) * chartHeight));
    const x = dayStartX + i * (dayBarWidth + dayGap);
    const y = baseLineY - h;
    const isPeak = val === maxDay && val > 0;

    dayBarsSvg += `
      <g>
        <rect x="${x}" y="${y}" width="${dayBarWidth}" height="${h}" rx="3" fill="${isPeak ? theme.accentPrimary : theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
        <title>${dayLabels[i]}: ${val} commits</title>
        <text x="${x + 13}" y="${baseLineY + 16}" fill="${theme.textSecondary}" font-size="9" font-weight="600" text-anchor="middle">${dayLabels[i]}</text>
      </g>
    `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 890 205" width="890" height="205" role="img" aria-label="Distribuição de Commits">
  <title>${escapeXml(titleAttr)}</title>
  <style>
    ${styles}
    .chart-label {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
      fill: var(--text-sec);
    }
  </style>
  ${defs}

  ${renderCardContainer({
    x: 0,
    y: 0,
    width: 890,
    height: 205,
    theme,
    title: 'DISTRIBUIÇÃO TEMPORAL // HORÁRIO DE BRASÍLIA',
    statusText: 'AMERICA/SAO_PAULO',
    statusColor: theme.textSecondary,
    statusPulse: false
  })}

  <!-- Subheaders -->
  <text x="36" y="58" class="chart-label">HORÁRIO DO DIA (00h - 23h)</text>
  <text x="580" y="58" class="chart-label">DIA DA SEMANA</text>

  <!-- Divider between charts -->
  <line x1="535" y1="52" x2="535" y2="175" stroke="${theme.borderSubtle}" stroke-width="1" stroke-dasharray="2 4" />

  <!-- Base Grid Lines -->
  <line x1="36" y1="${baseLineY}" x2="512" y2="${baseLineY}" stroke="${theme.borderSubtle}" stroke-width="1" />
  <line x1="580" y1="${baseLineY}" x2="846" y2="${baseLineY}" stroke="${theme.borderSubtle}" stroke-width="1" />

  <!-- Hours Bars -->
  <g class="fade-in">
    ${hourBarsSvg}
  </g>

  <!-- Day Bars -->
  <g class="fade-in">
    ${dayBarsSvg}
  </g>
</svg>`;
}

// Helper to generate 52 weeks of synthetic data for fallback
function generateSyntheticWeeks() {
  const weeks = [];
  const now = new Date();
  for (let w = 51; w >= 0; w--) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const dayDate = new Date(now);
      dayDate.setDate(now.getDate() - (w * 7 + (6 - d)));
      const rand = Math.random();
      let level = 0;
      let count = 0;
      if (rand > 0.45) {
        level = 1;
        count = 1;
      }
      if (rand > 0.70) {
        level = 2;
        count = 3;
      }
      if (rand > 0.88) {
        level = 3;
        count = 6;
      }
      if (rand > 0.96) {
        level = 4;
        count = 11;
      }
      days.push({
        date: dayDate.toISOString().split('T')[0],
        count,
        level
      });
    }
    weeks.push({ days });
  }
  return weeks;
}
