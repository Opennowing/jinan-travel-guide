#!/usr/bin/env python3
"""
Jinan Travel Guide — Data Builder
Builds modular, validated, indexed data files from source data.
Run: python3 build-data.py
"""
import json, os, hashlib
from datetime import datetime

DATA_DIR = os.path.dirname(os.path.abspath(__file__))
INDEX_DIR = os.path.join(DATA_DIR, 'indexes')
os.makedirs(INDEX_DIR, exist_ok=True)

# ══════════════════════════════════════
# VALIDATION SCHEMA
# ══════════════════════════════════════
SPOT_REQUIRED = ['id','name','cat','badge','img','price','priceOld','rating','reviews',
                 'dur','open','book','discount','bestTime','crowd','desc','meta',
                 'trust','combo','audience','lat','lng','transport','photos','tips',
                 'bestPhoto','nearby']
SPOT_CATS = {'spring','nature','history','food','landmark','culture','family','amusement'}
SPOT_BADGES = {'must','hot','free','hidden','kid','night','new'}
AUDIENCE_TYPES = {'family','couple','elder','solo','kid','group'}

FOOD_REQUIRED = ['id','name','cat','tag','desc','history','season','tips','must',
                 'img','shops','price','difficulty','where']
FOOD_CATS = {'lucai','xiaochi','laozihao','zaocan','yexiao','yinpin','tesu','mianlei'}

def validate_spot(s, idx):
    errors = []
    for f in SPOT_REQUIRED:
        if f not in s:
            errors.append(f"missing '{f}'")
    if s.get('cat') not in SPOT_CATS:
        errors.append(f"invalid cat '{s.get('cat')}'")
    if s.get('badge') not in SPOT_BADGES:
        errors.append(f"invalid badge '{s.get('badge')}'")
    if not isinstance(s.get('lat'), (int,float)) or not (35.5 < s.get('lat',0) < 37.5):
        errors.append(f"lat out of range: {s.get('lat')}")
    if not isinstance(s.get('lng'), (int,float)) or not (116.0 < s.get('lng',0) < 118.0):
        errors.append(f"lng out of range: {s.get('lng')}")
    if not isinstance(s.get('audience'), list):
        errors.append("audience must be array")
    if errors:
        print(f"  ⚠️  Spot #{idx} '{s.get('name','?')}': {', '.join(errors)}")
    return len(errors) == 0

def validate_food(f, idx):
    errors = []
    for field in FOOD_REQUIRED:
        if field not in f:
            errors.append(f"missing '{field}'")
    if f.get('cat') not in FOOD_CATS:
        errors.append(f"invalid cat '{f.get('cat')}'")
    if not isinstance(f.get('shops'), list) or len(f.get('shops',[])) == 0:
        errors.append("shops must be non-empty array")
    if errors:
        print(f"  ⚠️  Food #{idx} '{f.get('name','?')}': {', '.join(errors)}")
    return len(errors) == 0

# ══════════════════════════════════════
# LOAD EXISTING DATA
# ══════════════════════════════════════
print("📂 Loading existing data...")
with open(os.path.join(DATA_DIR, 'spots.json'), 'r') as f:
    spots = json.load(f)
with open(os.path.join(DATA_DIR, 'food.json'), 'r') as f:
    food_data = json.load(f)
    foods = food_data.get('foods', food_data)
    categories = food_data.get('categories', [])

print(f"  spots: {len(spots)}, foods: {len(foods)}")

# ══════════════════════════════════════
# NORMALIZE & CLEAN
# ══════════════════════════════════════
print("\n🔧 Normalizing...")

# Normalize spot cats: map any non-standard to standard
SPOT_CAT_MAP = {
    'landmark': 'landmark',   # keep — we'll add it to HTML
    'family': 'family',       # keep — we'll add it to HTML
    'amusement': 'family',    # merge into family
    'night': 'spring',        # night activities → spring (趵突泉夜间场)
}

for s in spots:
    if s['cat'] in SPOT_CAT_MAP:
        s['cat'] = SPOT_CAT_MAP[s['cat']]
    # Ensure audience is list
    if not isinstance(s.get('audience'), list):
        s['audience'] = []
    # Ensure photos is list
    if not isinstance(s.get('photos'), list):
        s['photos'] = []

# ══════════════════════════════════════
# VALIDATE ALL
# ══════════════════════════════════════
print("\n✅ Validating...")
spot_ok = sum(1 for i,s in enumerate(spots) if validate_spot(s, i))
food_ok = sum(1 for i,f in enumerate(foods) if validate_food(f, i))
print(f"  Spots: {spot_ok}/{len(spots)} valid")
print(f"  Foods: {food_ok}/{len(foods)} valid")

# ══════════════════════════════════════
# BUILD INDEXES
# ══════════════════════════════════════
print("\n📇 Building indexes...")

# Spot index by category
spot_by_cat = {}
for s in spots:
    cat = s['cat']
    spot_by_cat.setdefault(cat, []).append(s['id'])

# Spot index by badge
spot_by_badge = {}
for s in spots:
    badge = s['badge']
    spot_by_badge.setdefault(badge, []).append(s['id'])

# Spot index by audience
spot_by_audience = {}
for s in spots:
    for a in s.get('audience', []):
        spot_by_audience.setdefault(a, []).append(s['id'])

# Spot search index (lightweight)
spot_search = []
for s in spots:
    spot_search.append({
        'id': s['id'],
        'name': s['name'],
        'cat': s['cat'],
        'badge': s['badge'],
        'price': s['price'],
        'rating': s['rating'],
        'reviews': s['reviews'],
        'lat': s['lat'],
        'lng': s['lng'],
        'keywords': ' '.join([s['name'], s['desc'], s.get('transport',''), 
                               ' '.join(s.get('photos',[])), ' '.join(s.get('nearby',[]))]).lower()
    })

# Food index by category
food_by_cat = {}
for f in foods:
    cat = f['cat']
    food_by_cat.setdefault(cat, []).append(f['id'])

# Food search index
food_search = []
for f in foods:
    shop_names = ' '.join(s['name'] for s in f.get('shops',[]))
    food_search.append({
        'id': f['id'],
        'name': f['name'],
        'cat': f['cat'],
        'tag': f.get('tag',''),
        'must': f.get('must', False),
        'price': f.get('price',''),
        'keywords': ' '.join([f['name'], f.get('desc',''), f.get('tag',''), 
                               shop_names, f.get('where','')]).lower()
    })

# Restaurant index (unique shops across all foods)
restaurants = {}
for f in foods:
    for s in f.get('shops', []):
        name = s['name']
        if name not in restaurants:
            restaurants[name] = {
                'name': name,
                'avg': s.get('avg',''),
                'addr': s.get('addr',''),
                'rating': s.get('rating', 0),
                'hours': s.get('hours',''),
                'phone': s.get('phone',''),
                'lat': s.get('lat'),
                'lng': s.get('lng'),
                'foods': []
            }
        restaurants[name]['foods'].append(f['name'])

# ══════════════════════════════════════
# WRITE FILES
# ══════════════════════════════════════
print("\n💾 Writing files...")

# Main data files (pretty-printed for debugging)
with open(os.path.join(DATA_DIR, 'spots.json'), 'w') as f:
    json.dump(spots, f, ensure_ascii=False, indent=2)
print(f"  spots.json: {len(spots)} spots ({os.path.getsize(os.path.join(DATA_DIR, 'spots.json'))//1024}KB)")

food_output = {'categories': categories, 'foods': foods}
with open(os.path.join(DATA_DIR, 'food.json'), 'w') as f:
    json.dump(food_output, f, ensure_ascii=False, indent=2)
print(f"  food.json: {len(foods)} foods ({os.path.getsize(os.path.join(DATA_DIR, 'food.json'))//1024}KB)")

# Compact versions (for production, no indentation)
with open(os.path.join(DATA_DIR, 'spots.min.json'), 'w') as f:
    json.dump(spots, f, ensure_ascii=False, separators=(',',':'))
print(f"  spots.min.json: {os.path.getsize(os.path.join(DATA_DIR, 'spots.min.json'))//1024}KB")

with open(os.path.join(DATA_DIR, 'food.min.json'), 'w') as f:
    json.dump(food_output, f, ensure_ascii=False, separators=(',',':'))
print(f"  food.min.json: {os.path.getsize(os.path.join(DATA_DIR, 'food.min.json'))//1024}KB")

# Index files
with open(os.path.join(INDEX_DIR, 'spot-index.json'), 'w') as f:
    json.dump({
        'byCat': spot_by_cat,
        'byBadge': spot_by_badge,
        'byAudience': spot_by_audience,
        'search': spot_search
    }, f, ensure_ascii=False, separators=(',',':'))
print(f"  indexes/spot-index.json: {os.path.getsize(os.path.join(INDEX_DIR, 'spot-index.json'))//1024}KB")

with open(os.path.join(INDEX_DIR, 'food-index.json'), 'w') as f:
    json.dump({
        'byCat': food_by_cat,
        'search': food_search
    }, f, ensure_ascii=False, separators=(',',':'))
print(f"  indexes/food-index.json: {os.path.getsize(os.path.join(INDEX_DIR, 'food-index.json'))//1024}KB")

with open(os.path.join(INDEX_DIR, 'restaurants.json'), 'w') as f:
    json.dump(list(restaurants.values()), f, ensure_ascii=False, separators=(',',':'))
print(f"  indexes/restaurants.json: {len(restaurants)} restaurants ({os.path.getsize(os.path.join(INDEX_DIR, 'restaurants.json'))//1024}KB)")

# Meta file
meta = {
    'version': '2.0',
    'built': datetime.now().isoformat(),
    'spotCount': len(spots),
    'foodCount': len(foods),
    'restaurantCount': len(restaurants),
    'spotCats': list(spot_by_cat.keys()),
    'foodCats': list(food_by_cat.keys()),
    'spotBadges': list(spot_by_badge.keys()),
    'checksums': {
        'spots': hashlib.md5(json.dumps(spots, ensure_ascii=False).encode()).hexdigest()[:8],
        'foods': hashlib.md5(json.dumps(foods, ensure_ascii=False).encode()).hexdigest()[:8]
    }
}
with open(os.path.join(DATA_DIR, 'meta.json'), 'w') as f:
    json.dump(meta, f, ensure_ascii=False, indent=2)

# Update city-config.json stats
config_path = os.path.join(DATA_DIR, 'city-config.json')
with open(config_path, 'r') as f:
    config = json.load(f)
config['stats']['spots'] = f"{len(spots)}+"
config['stats']['foods'] = f"{len(foods)}+"
config['stats']['restaurants'] = f"{len(restaurants)}+"
with open(config_path, 'w') as f:
    json.dump(config, f, ensure_ascii=False, indent=2)

print(f"\n🎉 Build complete!")
print(f"   {len(spots)} spots, {len(foods)} foods, {len(restaurants)} restaurants")
print(f"   Total data: {(os.path.getsize(os.path.join(DATA_DIR, 'spots.json')) + os.path.getsize(os.path.join(DATA_DIR, 'food.json')))//1024}KB (pretty)")
print(f"   Total data: {(os.path.getsize(os.path.join(DATA_DIR, 'spots.min.json')) + os.path.getsize(os.path.join(DATA_DIR, 'food.min.json')))//1024}KB (compact)")
