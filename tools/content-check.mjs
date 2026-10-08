import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

// Scope checks, not automated substantiation of historical product claims.
const pages = ['index.html', 'overview/index.html', 'docs/index.html', 'status/index.html', 'releases/index.html', 'health/index.html', '404.html'];
for (const file of pages) {
  const html = readFileSync(file, 'utf8');
  assert.match(html, /<html lang="en">/, `${file}: English language`);
  assert.equal([...html.matchAll(/<h1[ >]/g)].length, 1, `${file}: one h1`);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: unique IDs`);
  for (const [, path, fragment] of html.matchAll(/href="(\/[^"#?]*)#([^"?]+)"/g)) {
    const target = path.endsWith('/') ? join(path.slice(1), 'index.html') : path.slice(1);
    assert(existsSync(target), `${file}: missing ${target}`);
    assert(readFileSync(target, 'utf8').includes(`id="${fragment}"`), `${file}: broken ${path}#${fragment}`);
  }
  for (const [, attrs] of html.matchAll(/<img\b([^>]+)>/g)) assert.match(attrs, /\balt="[^"]*"/, `${file}: image alternative`);
  assert(!/lorem ipsum|TODO|API_KEY|https?:\/\/192\.0\.2\.1/i.test(html), `${file}: placeholder or debug data`);
}
const overview = readFileSync('overview/index.html', 'utf8');
for (const phrase of ['no registered company yet', 'no investors', 'no institutional funding', 'PC Prime Core', 'Android companion', 'Teacher → Core → Tool', 'Claude v0.2', 'not a runtime integration', 'Research Room', 'No support, eligibility or acceptance is implied', 'founder@meomeoai.dynv6.net']) {
  assert(overview.includes(phrase), `Missing reviewer disclosure: ${phrase}`);
}
assert.equal(readFileSync('CNAME', 'utf8').trim(), 'meomeoai.dynv6.net');
assert.equal(JSON.parse(readFileSync('api/releases.json', 'utf8')).releases.length, 0);
console.log(`Content structure, English disclosures, cross-page anchors and release honesty checked on ${pages.length} pages.`);
