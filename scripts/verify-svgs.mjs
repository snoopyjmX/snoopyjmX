import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const assetsDir = path.resolve(projectRoot, 'assets');
const readmePath = path.resolve(projectRoot, 'README.md');

function getAllSvgFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllSvgFiles(fullPath));
    } else if (file.endsWith('.svg')) {
      results.push(fullPath);
    }
  }
  return results;
}

export function verifySvgs() {
  console.log('[verify-svgs] Iniciando validação rigorosa dos arquivos SVG...');
  const files = getAllSvgFiles(assetsDir);
  let hasErrors = false;
  let checkedCount = 0;

  for (const file of files) {
    checkedCount++;
    const relPath = path.relative(projectRoot, file);
    const stat = fs.statSync(file);
    const sizeKb = stat.size / 1024;
    const content = fs.readFileSync(file, 'utf8');

    // 1. Size check (< 60 KB)
    if (sizeKb > 60) {
      console.error(`[ERRO] ${relPath} excede 60 KB: ${sizeKb.toFixed(2)} KB`);
      hasErrors = true;
    }

    // 2. <title> presence
    if (!content.includes('<title>') || !content.includes('</title>')) {
      console.error(`[ERRO] ${relPath} não possui tag <title>`);
      hasErrors = true;
    }

    // 3. prefers-reduced-motion block
    if (!content.includes('prefers-reduced-motion')) {
      console.error(`[ERRO] ${relPath} não possui bloco @media (prefers-reduced-motion)`);
      hasErrors = true;
    }

    // 4. No external @import
    if (content.includes('@import')) {
      console.error(`[ERRO] ${relPath} contém @import externo`);
      hasErrors = true;
    }

    // 5. No external http/https references outside standard XML namespaces
    const cleanContent = content
      .replace(/xmlns="http:\/\/www\.w3\.org\/2000\/svg"/g, '')
      .replace(/xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/g, '');

    const httpMatches = cleanContent.match(/https?:\/\/[^\s"'>]+/gi);
    if (httpMatches && httpMatches.length > 0) {
      console.error(`[ERRO] ${relPath} contém referências HTTP externas:`, httpMatches);
      hasErrors = true;
    }

    // 6. Basic XML well-formedness: check open and close tags for root <svg>
    if (!content.startsWith('<svg') || !content.trim().endsWith('</svg>')) {
      console.error(`[ERRO] ${relPath} não inicia com <svg ou não fecha com </svg>`);
      hasErrors = true;
    }
  }

  console.log(`[verify-svgs] ${checkedCount} arquivos SVG verificados.`);

  // 7. Verify all relative images referenced in README.md exist on disk (ignoring comments)
  console.log('[verify-svgs] Verificando caminhos de imagem no README.md...');
  const readmeContent = fs.readFileSync(readmePath, 'utf8');
  const uncommentedReadme = readmeContent.replace(/<!--[\s\S]*?-->/g, '');
  const imageRefs = Array.from(uncommentedReadme.matchAll(/(?:src|srcset)=["'](\.\/assets\/[^"']+)["']/g)).map(m => m[1]);

  const uniqueRefs = Array.from(new Set(imageRefs));
  let missingRefs = 0;

  for (const ref of uniqueRefs) {
    const fullImgPath = path.resolve(projectRoot, ref);
    if (!fs.existsSync(fullImgPath)) {
      console.error(`[ERRO] Imagem referenciada no README não encontrada: ${ref}`);
      missingRefs++;
      hasErrors = true;
    }
  }
  console.log(`[verify-svgs] ${uniqueRefs.length} referências de imagem locais checadas no README (${missingRefs} ausentes).`);

  if (hasErrors) {
    console.error('[verify-svgs] Falha na verificação de conformidade dos SVGs.');
    process.exit(1);
  } else {
    console.log('[verify-svgs] Todos os SVGs passaram nas validações de conformidade, segurança e acessibilidade!');
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  verifySvgs();
}
