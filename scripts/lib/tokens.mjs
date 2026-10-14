import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokensPath = path.resolve(__dirname, '../../design/tokens.json');

export const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));

export function getTheme(themeName = 'dark') {
  const theme = tokens.themes[themeName] || tokens.themes.dark;
  return {
    ...theme,
    typography: tokens.typography,
    radii: tokens.radii,
    animation: tokens.animation
  };
}

export function escapeXml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export function getCommonDefs(theme) {
  return `
    <defs>
      <!-- Cyberpunk Radial Ambient Glow -->
      <radialGradient id="ambientGlow" cx="80%" cy="20%" r="70%">
        <stop offset="0%" stop-color="${theme.accentSecondary}" stop-opacity="${theme.name === 'dark' ? '0.12' : '0.07'}" />
        <stop offset="100%" stop-color="${theme.bg}" stop-opacity="0" />
      </radialGradient>

      <!-- Linear Accent Accent Line Gradient -->
      <linearGradient id="cyanLineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="${theme.accentPrimary}" stop-opacity="0" />
        <stop offset="30%" stop-color="${theme.accentPrimary}" stop-opacity="0.9" />
        <stop offset="70%" stop-color="${theme.accentSecondary}" stop-opacity="0.9" />
        <stop offset="100%" stop-color="${theme.accentSecondary}" stop-opacity="0" />
      </linearGradient>

      <!-- Subtle Card Header Gradient -->
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${theme.surfaceSubtle}" stop-opacity="0.6" />
        <stop offset="100%" stop-color="${theme.surface}" stop-opacity="0.95" />
      </linearGradient>

      <!-- Scanline Pattern -->
      <pattern id="scanlines" width="100" height="4" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="100" y2="0" stroke="${theme.grid}" stroke-width="1" />
      </pattern>

      <!-- Subtle Dot Matrix Grid -->
      <pattern id="cyberGrid" width="24" height="24" patternUnits="userSpaceOnUse">
        <path d="M 24 0 L 0 0 0 24" fill="none" stroke="${theme.grid}" stroke-width="0.75" />
      </pattern>
    </defs>
  `;
}

export function getCornerBrackets(x, y, w, h, size = 8, color = null) {
  const stroke = color || 'var(--border)';
  return `
    <g class="corner-brackets" stroke="${stroke}" stroke-width="1.5" fill="none">
      <!-- Top Left -->
      <path d="M ${x} ${y + size} L ${x} ${y} L ${x + size} ${y}" />
      <!-- Top Right -->
      <path d="M ${x + w - size} ${y} L ${x + w} ${y} L ${x + w} ${y + size}" />
      <!-- Bottom Left -->
      <path d="M ${x} ${y + h - size} L ${x} ${y + h} L ${x + size} ${y + h}" />
      <!-- Bottom Right -->
      <path d="M ${x + w - size} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y + h - size}" />
    </g>
  `;
}

