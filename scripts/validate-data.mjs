#!/usr/bin/env node
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'src', 'data');

const spots = JSON.parse(readFileSync(join(DATA_DIR, 'spots.json'), 'utf-8'));
const foods = JSON.parse(readFileSync(join(DATA_DIR, 'food.json'), 'utf-8'));

let errors = 0;
let warnings = 0;

function err(msg) { console.log(`  ❌ ${msg}`); errors++; }
function warn(msg) { console.log(`  ⚠️  ${msg}`); warnings++; }
function ok(msg) { console.log(`  ✅ ${msg}`); }

console.log('═'.repeat(50));
console.log('济南旅游攻略 - 数据完整性验证');
console.log('═'.repeat(50));

// ── 景点验证 ──
console.log(`\n📍 景点: ${spots.length} 个`);
const spotIds = new Set();
spots.forEach(s => {
  if (!s.id) err(`${s.name || '未知'}: 缺少 id`);
  if (spotIds.has(s.id)) err(`${s.name}: id 重复 (${s.id})`);
  spotIds.add(s.id);
  if (!s.name) err(`${s.id}: 缺少 name`);
  if (!s.cat) err(`${s.name}: 缺少 cat`);
  if (!s.desc) warn(`${s.name}: 缺少 desc`);
  if (typeof s.lat !== 'number' || s.lat < 36.3 || s.lat > 37.0) err(`${s.name}: 纬度异常 (${s.lat})`);
  if (typeof s.lng !== 'number' || s.lng < 116.8 || s.lng > 117.6) err(`${s.name}: 经度异常 (${s.lng})`);
  if (!s.img) warn(`${s.name}: 缺少 img`);
  if (!s.audience || !s.audience.length) warn(`${s.name}: 缺少 audience`);
});

const cats = {};
spots.forEach(s => { cats[s.cat] = (cats[s.cat] || 0) + 1; });
console.log(`  分类: ${Object.entries(cats).map(([k,v]) => `${k}(${v})`).join(', ')}`);

// ── 美食验证 ──
console.log(`\n🍜 美食: ${foods.foods.length} 个`);
const foodIds = new Set();
foods.foods.forEach(f => {
  if (!f.id) err(`${f.name || '未知'}: 缺少 id`);
  if (foodIds.has(f.id)) err(`${f.name}: id 重复 (${f.id})`);
  foodIds.add(f.id);
  if (!f.name) err(`${f.id}: 缺少 name`);
  if (!f.cat) err(`${f.name}: 缺少 cat`);
  if (!f.desc) warn(`${f.name}: 缺少 desc`);
  if (!f.shops || !f.shops.length) warn(`${f.name}: 缺少 shops`);
  else f.shops.forEach(s => {
    if (s.lat && (s.lat < 36.3 || s.lat > 37.0)) err(`${f.name}/${s.name}: 餐厅纬度异常`);
    if (s.lng && (s.lng < 116.8 || s.lng > 117.6)) err(`${f.name}/${s.name}: 餐厅经度异常`);
  });
});

const foodCats = {};
foods.foods.forEach(f => { foodCats[f.cat] = (foodCats[f.cat] || 0) + 1; });
console.log(`  分类: ${Object.entries(foodCats).map(([k,v]) => `${k}(${v})`).join(', ')}`);

// ── 汇总 ──
console.log('\n' + '═'.repeat(50));
if (errors) console.log(`❌ ${errors} 个错误`);
else console.log('✅ 无错误');
if (warnings) console.log(`⚠️  ${warnings} 个警告`);
else console.log('✅ 无警告');
console.log(`\n📊 统计: ${spots.length} 景点 + ${foods.foods.length} 美食 = ${spots.length + foods.foods.length} 条数据`);
console.log('═'.repeat(50));
