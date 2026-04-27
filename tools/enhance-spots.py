#!/usr/bin/env python3
"""Add computed fields to spots.json: distanceFromCenter, popularity, sceneTags, sortScore."""

import json
import math
import os

CENTER_LAT = 36.6512
CENTER_LNG = 117.1201

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SPOTS_PATH = os.path.join(BASE_DIR, "src", "data", "spots.json")
SPOTS_MIN_PATH = os.path.join(BASE_DIR, "src", "data", "spots.min.json")


def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def calc_distance(spot):
    return round(haversine(CENTER_LAT, CENTER_LNG, spot["lat"], spot["lng"]), 1)


def calc_popularity(spot):
    raw = spot["reviews"] / 50 * 0.6 + spot["rating"] / 5 * 40
    return max(1, min(100, round(raw)))


def calc_scene_tags(spot):
    tags = []
    audience = spot.get("audience", [])
    mapping = {
        "family": "亲子出游",
        "couple": "情侣约会",
        "solo": "独自散心",
        "elder": "长辈同行",
    }
    for key, tag in mapping.items():
        if key in audience:
            tags.append(tag)
    if spot.get("cat") == "amusement":
        tags.append("朋友聚会")
    if spot.get("price", 0) == 0:
        tags.append("免费游玩")
    return tags


def calc_sort_score(spot):
    score = spot["rating"] * 20
    score += min(spot["reviews"] / 100, 20)
    if spot.get("badge") == "must":
        score += 10
    elif spot.get("badge") == "hot":
        score += 5
    return round(score, 2)


def main():
    with open(SPOTS_PATH, "r", encoding="utf-8") as f:
        spots = json.load(f)

    print(f"Loaded {len(spots)} spots from {SPOTS_PATH}")

    for spot in spots:
        spot["distanceFromCenter"] = calc_distance(spot)
        spot["popularity"] = calc_popularity(spot)
        spot["sceneTags"] = calc_scene_tags(spot)
        spot["sortScore"] = calc_sort_score(spot)

    with open(SPOTS_PATH, "w", encoding="utf-8") as f:
        json.dump(spots, f, ensure_ascii=False, indent=2)
    print(f"Written formatted JSON to {SPOTS_PATH}")

    with open(SPOTS_MIN_PATH, "w", encoding="utf-8") as f:
        json.dump(spots, f, ensure_ascii=False, separators=(",", ":"))
    print(f"Written minified JSON to {SPOTS_MIN_PATH}")

    s = spots[0]
    print(f"\nSample ({s['name']}):")
    print(f"  distanceFromCenter: {s['distanceFromCenter']} km")
    print(f"  popularity: {s['popularity']}")
    print(f"  sceneTags: {s['sceneTags']}")
    print(f"  sortScore: {s['sortScore']}")

    print(f"\nDone. Enhanced {len(spots)} spots with 4 new fields.")


if __name__ == "__main__":
    main()
