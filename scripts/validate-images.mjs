#!/usr/bin/env node
/**
 * 验证所有图片 URL 是否可访问
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'src', 'data');

const spots = JSON.parse(readFileSync(join(DATA_DIR, 'spots.json'), 'utf-8'));
const foods = JSON.parse(readFileSync(join(DATA_DIR, 'food.json'), 'utf-8'));

const allUrls = new Set();
spots.forEach(s => { if (s.img) allUrls.add(s.img); });
foods.foods.forEach(f => { if (f.img) allUrls.add(f.img); });

console.log(`检查 ${allUrls.size} 个图片 URL...`);

let ok = 0, fail = 0;
const failed = [];

for (const url of allUrls) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(timeout);
    if (res.ok) {
      ok++;
      process.stdout.write('.');
    } else {
      fail++;
      failed.push({ url, status: res.status });
      process.stdout.write('x');
    }
  } catch (e) {
    fail++;
    failed.push({ url, error: e.message });
    process.stdout.write('!');
  }
}

console.log(`\n\n✅ 可用: ${ok}`);
console.log(`❌ 不可用: ${fail}`);

if (failed.length) {
  console.log('\n不可用的 URL:');
  failed.forEach(({ url, status, error }) => {
    console.log(`  ${status || error}: ${url.slice(0, 80)}...`);
  });
}
