import { getTheme, escapeXml, getCommonDefs, getCornerBrackets } from './tokens.mjs';

export function createBaseStyles(theme) {
  return `
    :root {
      --bg: ${theme.bg};
      --surface: ${theme.surface};
      --surface-subtle: ${theme.surfaceSubtle};
      --border: ${theme.border};
      --border-subtle: ${theme.borderSubtle};
      --text: ${theme.text};
      --text-sec: ${theme.textSecondary};
      --text-ter: ${theme.textTertiary};
      --accent: ${theme.accentPrimary};
      --accent-subtle: ${theme.accentPrimarySubtle};
      --accent-glow: ${theme.accentPrimaryGlow};
      --accent-sec: ${theme.accentSecondary};
      --accent-sec-subtle: ${theme.accentSecondarySubtle};
      --success: ${theme.success};
      --font-mono: ${theme.typography.fontFamily};
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    text {
      font-family: var(--font-mono);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Pulse animation for status dots */
    @keyframes pulse-glow {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.45;
        transform: scale(0.85);
      }
    }

    .pulse {
      transform-origin: center;
      animation: pulse-glow 3.5s ease-in-out infinite;
    }

    /* Staggered entrance reveal (opacity only to preserve SVG translate transforms) */
    @keyframes fade-in-up {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .fade-in {
      animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    /* Stroke draw effect */
    @keyframes draw-line {
      to {
        stroke-dashoffset: 0;
      }
    }

    /* Very subtle rare glitch (1x every 8s, 0.3s duration) */
    @keyframes subtle-glitch {
      0%, 96%, 100% {
        opacity: 1;
      }
      97% {
        opacity: 0.75;
      }
      98% {
        opacity: 0.9;
      }
      99% {
        opacity: 1;
      }
    }

    .glitch-text {
      animation: subtle-glitch 8s infinite ease-in-out;
    }

    /* Scanline traversing effect */
    @keyframes scanline-sweep {
      0% {
        transform: translateY(-20px);
        opacity: 0;
      }
      10% {
        opacity: 0.6;
      }
      90% {
        opacity: 0.6;
      }
      100% {
        transform: translateY(300px);
        opacity: 0;
      }
    }

    .scanline {
      animation: scanline-sweep 7s linear infinite;
    }

    /* Traveling light dot */
    @keyframes travel-dot {
      0% {
        transform: translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 0.9;
      }
      90% {
        opacity: 0.9;
      }
      100% {
        transform: translateX(1100px);
        opacity: 0;
      }
    }

    /* Cursor blink */
    @keyframes blink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }

    .cursor {
      animation: blink 1.1s infinite steps(1);
    }

    /* Accessibility: prefers-reduced-motion */
    @media (prefers-reduced-motion: reduce) {
      *, .pulse, .fade-in, .glitch-text, .scanline, .cursor, .animated-stroke {
        animation: none !important;
        transition: none !important;
        opacity: 1 !important;
        stroke-dashoffset: 0 !important;
        transform: none !important;
      }
    }
  `;
}

export function renderCardContainer({
  x = 0,
  y = 0,
  width,
  height,
  theme,
  rx = 12,
  showGrid = true,
  cornerSize = 8,
  title = '',
  statusText = '',
  statusColor = null,
  statusPulse = true
}) {
  const corners = getCornerBrackets(x + 2, y + 2, width - 4, height - 4, cornerSize, theme.accentPrimary);
  const statusCol = statusColor || theme.success;

  return `
    <!-- Card Frame -->
    <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${theme.surface}" stroke="${theme.border}" stroke-width="1.2" />
    <rect x="${x + 1}" y="${y + 1}" width="${width - 2}" height="${height - 2}" rx="${rx - 1}" fill="url(#ambientGlow)" />
    ${showGrid ? `<rect x="${x + 4}" y="${y + 4}" width="${width - 8}" height="${height - 8}" rx="${rx - 2}" fill="url(#cyberGrid)" />` : ''}
    ${corners}

    ${title || statusText ? `
      <!-- Card Header Line -->
      <line x1="${x + 16}" y1="${y + 38}" x2="${x + width - 16}" y2="${y + 38}" stroke="${theme.borderSubtle}" stroke-width="1" />
    ` : ''}

    ${title ? `
      <text x="${x + 20}" y="${y + 26}" fill="${theme.text}" font-size="14" font-weight="700" letter-spacing="1">
        ${escapeXml(title)}
      </text>
    ` : ''}

    ${statusText ? `
      <g transform="translate(${x + width - 20}, ${y + 22})">
        <text x="-10" y="3" fill="${statusCol}" font-size="11" font-weight="600" text-anchor="end" letter-spacing="0.5">
          ${escapeXml(statusText)}
        </text>
        <circle cx="0" cy="0" r="4" fill="${statusCol}" class="${statusPulse ? 'pulse' : ''}" />
        <circle cx="0" cy="0" r="6" fill="${statusCol}" opacity="0.3" class="${statusPulse ? 'pulse' : ''}" />
      </g>
    ` : ''}
  `;
}

export function renderChip({ x, y, label, indicator = null, theme, width = null }) {
  const charWidth = 7.2;
  const padding = 16;
  const indWidth = indicator ? 14 : 0;
  const chipWidth = width || Math.max(68, Math.round(label.length * charWidth + padding + indWidth));
  const height = 22;

  let indDot = '';
  let textX = x + (chipWidth / 2);

  if (indicator) {
    const isUsing = indicator === 'em uso';
    const dotColor = isUsing ? theme.accentPrimary : theme.accentSecondary;
    indDot = `
      <circle cx="${x + 9}" cy="${y + 11}" r="3" fill="${dotColor}" />
    `;
    textX = x + 18 + ((chipWidth - 22) / 2);
  }

  return `
    <g class="chip">
      <rect x="${x}" y="${y}" width="${chipWidth}" height="${height}" rx="5" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
      ${indDot}
      <text x="${textX}" y="${y + 15}" fill="${theme.textSecondary}" font-size="11" text-anchor="middle" font-weight="500">
        ${escapeXml(label)}
      </text>
    </g>
  `;
}

export function renderProgressBar({ x, y, width, height = 7, current, total, label = '', theme }) {
  const percentage = Math.min(100, Math.max(0, (current / total) * 100));
  const fillWidth = Math.round((percentage / 100) * width);

  return `
    <g class="progress-bar-group">
      ${label ? `
        <text x="${x}" y="${y - 6}" fill="${theme.textSecondary}" font-size="11" font-weight="600" letter-spacing="0.5">
          ${escapeXml(label)}
        </text>
        <text x="${x + width}" y="${y - 6}" fill="${theme.accentPrimary}" font-size="11" font-weight="700" text-anchor="end">
          ${current}/${total} (${Math.round(percentage)}%)
        </text>
      ` : ''}
      <!-- Track -->
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="3.5" fill="${theme.surfaceSubtle}" stroke="${theme.borderSubtle}" stroke-width="1" />
      <!-- Fill -->
      <rect x="${x}" y="${y}" width="${fillWidth}" height="${height}" rx="3.5" fill="${theme.accentPrimary}" />
    </g>
  `;
}

