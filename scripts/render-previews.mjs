import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const previewDir = path.resolve(projectRoot, 'design/preview');

if (!fs.existsSync(previewDir)) {
  fs.mkdirSync(previewDir, { recursive: true });
}

// Candidates for Chrome/Chromium executable
const executablePaths = [
  '/Users/joao/Library/Caches/ms-playwright/chromium-1243/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
];

let selectedExecutable = executablePaths.find(p => fs.existsSync(p));

const targets = [
  { name: 'header', file: 'assets/header-dark.svg', lightFile: 'assets/header-light.svg' },
  { name: 'typing', file: 'assets/typing-dark.svg', lightFile: 'assets/typing-light.svg' },
  { name: 'card-sillage', file: 'assets/card-sillage-dark.svg', lightFile: 'assets/card-sillage-light.svg' },
  { name: 'card-nos', file: 'assets/card-nos-dark.svg', lightFile: 'assets/card-nos-light.svg' },
  { name: 'card-paggo', file: 'assets/card-paggo-dark.svg', lightFile: 'assets/card-paggo-light.svg' },
  { name: 'stack-frontend', file: 'assets/stack-frontend-dark.svg', lightFile: 'assets/stack-frontend-light.svg' },
  { name: 'stats', file: 'assets/generated/stats-dark.svg', lightFile: 'assets/generated/stats-light.svg' },
  { name: 'streak', file: 'assets/generated/streak-dark.svg', lightFile: 'assets/generated/streak-light.svg' },
  { name: 'heatmap', file: 'assets/generated/heatmap-dark.svg', lightFile: 'assets/generated/heatmap-light.svg' },
  { name: 'hours', file: 'assets/generated/hours-dark.svg', lightFile: 'assets/generated/hours-light.svg' }
];

async function renderAll() {
  console.log(`[render-previews] Usando navegador: ${selectedExecutable || 'Playwright padrão'}`);
  const browser = await chromium.launch({
    executablePath: selectedExecutable,
    headless: true
  });

  console.log(`[render-previews] Renderizando capturas em design/preview/...`);

  for (const target of targets) {
    const fullDarkPath = path.resolve(projectRoot, target.file);
    const fullLightPath = path.resolve(projectRoot, target.lightFile);

    if (!fs.existsSync(fullDarkPath)) {
      console.warn(`[render-previews] Arquivo não encontrado: ${target.file}`);
      continue;
    }

    const svgContent = fs.readFileSync(fullDarkPath, 'utf8');

    // Context for desktop testing
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      deviceScaleFactor: 2
    });
    const page = await context.newPage();

    // Embed SVG into a clean HTML container replicating GitHub profile
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 40px;
              background-color: #0d1117;
              display: flex;
              justify-content: center;
              align-items: center;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif;
            }
            .svg-container {
              max-width: 100%;
              box-shadow: 0 8px 24px rgba(0,0,0,0.5);
              border-radius: 12px;
              overflow: hidden;
            }
            img {
              display: block;
              width: 100%;
              height: auto;
            }
          </style>
        </head>
        <body>
          <div class="svg-container">
            ${svgContent}
          </div>
        </body>
      </html>
    `;

    await page.setContent(html);

    // 1. Capture at t = 0.5s
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(previewDir, `${target.name}-dark-t0.5s.png`) });

    // 2. Capture at t = 2.0s
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(previewDir, `${target.name}-dark-t2.0s.png`) });

    // 3. Capture at t = 5.0s
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(previewDir, `${target.name}-dark-t5.0s.png`) });

    await context.close();

    // 4. Capture Light Mode
    if (fs.existsSync(fullLightPath)) {
      const lightSvg = fs.readFileSync(fullLightPath, 'utf8');
      const lightContext = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        deviceScaleFactor: 2
      });
      const lightPage = await lightContext.newPage();
      await lightPage.setContent(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                margin: 0;
                padding: 40px;
                background-color: #ffffff;
                display: flex;
                justify-content: center;
                align-items: center;
              }
              .svg-container {
                max-width: 100%;
                border-radius: 12px;
                overflow: hidden;
              }
            </style>
          </head>
          <body>
            <div class="svg-container">
              ${lightSvg}
            </div>
          </body>
        </html>
      `);
      await lightPage.waitForTimeout(2000);
      await lightPage.screenshot({ path: path.join(previewDir, `${target.name}-light.png`) });
      await lightContext.close();
    }

    // 5. Mobile 360px viewport test
    const mobileContext = await browser.newContext({
      viewport: { width: 360, height: 640 },
      deviceScaleFactor: 2,
      isMobile: true
    });
    const mobilePage = await mobileContext.newPage();
    await mobilePage.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              margin: 0;
              padding: 12px;
              background-color: #0d1117;
            }
            .svg-container {
              width: 100%;
            }
            svg {
              width: 100% !important;
              height: auto !important;
            }
          </style>
        </head>
        <body>
          <div class="svg-container">
            ${svgContent}
          </div>
        </body>
      </html>
    `);
    await mobilePage.waitForTimeout(2000);
    await mobilePage.screenshot({ path: path.join(previewDir, `${target.name}-mobile-360px.png`) });
    await mobileContext.close();

    console.log(`[render-previews] ✓ ${target.name} renderizado (t=0.5s, 2s, 5s, light, mobile 360px)`);
  }

  await browser.close();
  console.log('[render-previews] Todas as capturas de tela foram salvas com sucesso em design/preview/!');
}

renderAll().catch(err => {
  console.error('[render-previews] Erro durante a renderização:', err);
  process.exit(1);
});

