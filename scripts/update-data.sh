#!/bin/bash
# 市相 (ShiXiang) 数据更新脚本
# 用法: ./scripts/update-data.sh

set -e

cd "$(dirname "$0")/.."

echo "========================================"
echo "市相 (ShiXiang) 数据更新"
echo "========================================"

# 激活虚拟环境
source .venv/bin/activate

# 运行数据抓取
python scripts/fetch-stock-data.py

echo ""
echo "数据更新完成！"
echo "运行 'npm run dev' 或 'vercel --prod' 部署。"
