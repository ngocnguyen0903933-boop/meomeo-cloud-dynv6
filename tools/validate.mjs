import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';

// Deliberate public allowlist. Tooling, Git history and private additions are never deployed.
const files = ['index.html', '404.html', 'CNAME', 'robots.txt', 'sitemap.xml',
  'status/index.html', 'releases/index.html', 'docs/index.html', 'health/index.html', 'overview/index.html'];
for (const directory of ['assets', 'api']) {
  for (const file of readdirSync(directory)) {
    if (!statSync(join(directory, file)).isFile()) throw new Error(`Unexpected directory: ${file}`);
    files.push(`${directory}/${file}`);
  }
}
for (const file of ['api/health.json', 'api/status.json', 'api/version.json', 'api/releases.json', 'SECURITY.md']) {
  if (!existsSync(file)) throw new Error(`Missing required file: ${file}`);
}
const secret = /BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}/;
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  if (secret.test(text)) throw new Error(`Potential secret pattern: ${file}`);
  if (file.endsWith('.json')) JSON.parse(text);
  if (file.endsWith('.html')) {
    if (!text.includes('Content-Security-Policy')) throw new Error(`Missing CSP: ${file}`);
    for (const [, script] of text.matchAll(/<script[^>]*>([^]*?)<\/script>/g)) {
      if (script.trim() && !text.includes(`sha256-${createHash('sha256').update(script).digest('base64')}`)) {
        throw new Error(`Unhashed inline script: ${file}`);
      }
    }
    for (const [, anchor] of text.matchAll(/href="#([^"]+)"/g)) {
      if (!text.includes(`id="${anchor}"`)) throw new Error(`Broken anchor #${anchor} in ${file}`);
    }
    for (const [, target] of text.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
      if (target.startsWith('//')) throw new Error(`Protocol-relative URL: ${file}`);
      const path = target.endsWith('/') ? `${target}index.html` : target;
      if (!files.includes(path.slice(1))) throw new Error(`Broken public link ${target} in ${file}`);
    }
  }
}
if (existsSync('_site')) throw new Error('Use a clean checkout: _site already exists.');
mkdirSync('_site');
for (const file of files) {
  const destination = join('_site', file);
  mkdirSync(resolve(destination, '..'), { recursive: true });
  cpSync(file, destination);
}
const generatedAt = new Date().toISOString();
const buildId = process.env.GITHUB_SHA || 'local-preview';
for (const file of ['health', 'status', 'version']) {
  const path = `_site/api/${file}.json`;
  const data = JSON.parse(readFileSync(path, 'utf8'));
  Object.assign(data, { generatedAt, buildId });
  if (file === 'version') data.immutableVersionId = `meo-cloud-web-${buildId}`;
  writeFileSync(path, `${JSON.stringify(data, null, 2)}\n`);
}
console.log(`Validated and staged ${files.length} public files. Build ${buildId}.`);
