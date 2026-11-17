import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('PWA manifest is valid and describes the Arabic app', async () => {
  const manifest = JSON.parse(await read('manifest.json'));
  assert.equal(manifest.lang, 'ar');
  assert.equal(manifest.dir, 'rtl');
  assert.ok(manifest.name);
  for (const icon of manifest.icons) {
    await read(icon.src.replace(/^\.\//, ''));
  }
});

test('main pages have Arabic RTL metadata and their local resources exist', async () => {
  for (const page of ['index.html', 'wallet.html']) {
    const html = await read(page);
    assert.match(html, /<html[^>]+lang="ar"[^>]+dir="rtl"/);
    for (const [, path] of html.matchAll(/(?:src|href)="(\.\/[^"#?]+)"/g)) {
      await assert.doesNotReject(read(path.replace(/^\.\//, '')), `${page} references missing ${path}`);
    }
  }
});

test('service worker precaches the customer wallet and keeps a versioned cache', async () => {
  const sw = await read('sw.js');
  assert.match(sw, /CACHE_NAME\s*=\s*["'][^"']+v\d+["']/);
  assert.match(sw, /\.\/wallet\.html/);
  assert.match(sw, /self\.addEventListener\(["']activate["']/);
  assert.match(sw, /self\.addEventListener\(["']fetch["']/);
});

test('README documents local-only storage as a production limitation', async () => {
  const readme = await read('README.md');
  assert.match(readme, /localStorage/);
  assert.match(readme, /ليس نظاماً آمناً/);
});
