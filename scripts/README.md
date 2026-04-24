# 🛠️ 济南旅游攻略 - 工具脚本

## 数据管理

### `enrich-data.mjs` - 数据增强 V1
基础数据增强，生成核心景点和美食数据。
```bash
node scripts/enrich-data.mjs
```

### `enrich-data-v2.mjs` - 数据增强 V2
追加更多景点和美食。
```bash
node scripts/enrich-data-v2.mjs
```

### `enrich-data-v3.mjs` - 数据增强 V3
继续追加，目标 80+ 景点。
```bash
node scripts/enrich-data-v3.mjs
```

### `enrich-data-v4.mjs` - 数据增强 V4
最终增强，达到 80 景点 + 68 美食。
```bash
node scripts/enrich-data-v4.mjs
```

### `validate-data.mjs` - 数据验证
验证 JSON 格式、字段完整性、坐标范围。
```bash
node scripts/validate-data.mjs
```

### `validate-images.mjs` - 图片验证
检查所有图片 URL 是否可访问。
```bash
node scripts/validate-images.mjs
```

## 部署

### `update-and-deploy.sh` - 一键更新部署
数据验证 → 构建 → Git 提交 → 部署到 GitHub Pages。
```bash
bash scripts/update-and-deploy.sh
```

## 数据统计

当前数据量：
- **80 个景点**（泉水 16、自然 33、历史 17、美食街 7、文化 6、亲子 1）
- **68 个美食**（鲁菜 22、小吃 23、老字号 3、早餐 9、夜宵 5、饮品 6）
- **45 个图片 URL**（全部验证可用）
- **0 个数据错误**
