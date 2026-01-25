#!/usr/bin/env python3
"""
市相 (ShiXiang) 数据抓取脚本
在本地运行，生成静态 JSON 文件
"""

import json
import os
from datetime import datetime, timezone
from pathlib import Path

import akshare as ak
import pandas as pd

# 输出目录
OUTPUT_DIR = Path(__file__).parent.parent / "public" / "data"


def fetch_cn_stocks():
    """抓取 A 股数据 (Sina 源)"""
    print("抓取 A 股数据...")
    try:
        df = ak.stock_zh_a_spot()
        print(f"  获取 {len(df)} 只 A 股")

        stocks = []
        for _, row in df.iterrows():
            symbol = str(row.get("代码", ""))
            if not symbol:
                continue

            current = float(row.get("最新价", 0) or 0)
            prev = float(row.get("昨收", 0) or 0)
            change = current - prev if prev else 0
            change_pct = (change / prev * 100) if prev else 0

            stocks.append({
                "symbol": f"CN:{symbol}",
                "code": symbol,
                "name": row.get("名称", ""),
                "price": current,
                "prev_close": prev,
                "change": round(change, 2),
                "change_pct": round(change_pct, 2),
            })

        return stocks
    except Exception as e:
        print(f"  A 股抓取失败: {e}")
        return []


def fetch_hk_stocks():
    """抓取港股数据 (Sina 源)"""
    print("抓取港股数据...")
    try:
        df = ak.stock_hk_spot()
        print(f"  获取 {len(df)} 只港股")

        stocks = []
        for _, row in df.iterrows():
            symbol = str(row.get("symbol", ""))
            if not symbol:
                continue

            # 港股代码格式化为 5 位
            code = symbol.zfill(5)
            current = float(row.get("lasttrade", 0) or 0)
            prev = float(row.get("prevclose", 0) or 0)
            change = current - prev if prev else 0
            change_pct = (change / prev * 100) if prev else 0

            stocks.append({
                "symbol": f"HK:{code}",
                "code": code,
                "name": row.get("name", ""),
                "name_cn": row.get("engname", ""),  # Sina 的 engname 实际是中文名
                "price": current,
                "prev_close": prev,
                "change": round(change, 2),
                "change_pct": round(change_pct, 2),
            })

        return stocks
    except Exception as e:
        print(f"  港股抓取失败: {e}")
        return []


def fetch_us_stocks():
    """抓取美股数据"""
    print("抓取美股数据...")
    try:
        # 尝试 Eastmoney 源（本地可能能用）
        df = ak.stock_us_spot_em()
        print(f"  获取 {len(df)} 只美股 (Eastmoney)")

        stocks = []
        for _, row in df.iterrows():
            symbol = str(row.get("代码", "")).replace(".", "-")  # 转换 BRK.B -> BRK-B
            if not symbol:
                continue

            current = float(row.get("最新价", 0) or 0)
            prev = float(row.get("昨收", 0) or 0)
            change = current - prev if prev else 0
            change_pct = (change / prev * 100) if prev else 0

            stocks.append({
                "symbol": f"US:{symbol}",
                "code": symbol,
                "name": row.get("名称", ""),
                "price": current,
                "prev_close": prev,
                "change": round(change, 2),
                "change_pct": round(change_pct, 2),
            })

        return stocks
    except Exception as e:
        print(f"  Eastmoney 源失败: {e}")
        print("  尝试 Sina 源...")

        try:
            # Sina 源较慢，但可能更稳定
            df = ak.stock_us_spot()
            print(f"  获取 {len(df)} 只美股 (Sina)")

            stocks = []
            for _, row in df.iterrows():
                symbol = str(row.get("name", "")).upper()
                if not symbol:
                    continue

                current = float(row.get("price", 0) or 0)
                prev = float(row.get("prevclose", 0) or 0)
                change = current - prev if prev else 0
                change_pct = (change / prev * 100) if prev else 0

                stocks.append({
                    "symbol": f"US:{symbol}",
                    "code": symbol,
                    "name": row.get("cname", ""),
                    "price": current,
                    "prev_close": prev,
                    "change": round(change, 2),
                    "change_pct": round(change_pct, 2),
                })

            return stocks
        except Exception as e2:
            print(f"  Sina 源也失败: {e2}")
            return []


def main():
    print("=" * 50)
    print("市相 (ShiXiang) 数据抓取")
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)

    # 确保输出目录存在
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # 抓取各市场数据
    cn_stocks = fetch_cn_stocks()
    hk_stocks = fetch_hk_stocks()
    us_stocks = fetch_us_stocks()

    # 合并所有数据
    all_stocks = cn_stocks + hk_stocks + us_stocks

    # 创建索引 (symbol -> data)
    stocks_index = {s["symbol"]: s for s in all_stocks}

    # 元数据
    metadata = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "counts": {
            "CN": len(cn_stocks),
            "HK": len(hk_stocks),
            "US": len(us_stocks),
            "total": len(all_stocks),
        }
    }

    # 保存文件
    # 1. 完整数据 (用于搜索)
    with open(OUTPUT_DIR / "stocks.json", "w", encoding="utf-8") as f:
        json.dump({
            "metadata": metadata,
            "stocks": all_stocks,
        }, f, ensure_ascii=False)
    print(f"\n保存 stocks.json ({len(all_stocks)} 只股票)")

    # 2. 索引数据 (用于单只查询)
    with open(OUTPUT_DIR / "stocks-index.json", "w", encoding="utf-8") as f:
        json.dump({
            "metadata": metadata,
            "index": stocks_index,
        }, f, ensure_ascii=False)
    print(f"保存 stocks-index.json")

    # 3. 分市场数据 (可选，减小单文件大小)
    for market, stocks in [("CN", cn_stocks), ("HK", hk_stocks), ("US", us_stocks)]:
        with open(OUTPUT_DIR / f"stocks-{market.lower()}.json", "w", encoding="utf-8") as f:
            json.dump({
                "metadata": {
                    "updated_at": metadata["updated_at"],
                    "count": len(stocks),
                },
                "stocks": stocks,
            }, f, ensure_ascii=False)
        print(f"保存 stocks-{market.lower()}.json ({len(stocks)} 只)")

    print("\n" + "=" * 50)
    print("抓取完成!")
    print(f"  A 股: {len(cn_stocks)}")
    print(f"  港股: {len(hk_stocks)}")
    print(f"  美股: {len(us_stocks)}")
    print(f"  合计: {len(all_stocks)}")
    print("=" * 50)


if __name__ == "__main__":
    main()
