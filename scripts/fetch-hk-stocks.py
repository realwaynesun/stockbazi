#!/usr/bin/env python3
"""
港股数据抓取 - 使用 yfinance
"""

import json
from datetime import datetime, timezone
from pathlib import Path
import yfinance as yf
import akshare as ak

OUTPUT_DIR = Path(__file__).parent.parent / "public" / "data"


def get_hk_stock_list():
    """获取港股列表"""
    print("获取港股列表...")
    try:
        # 尝试从 AKShare 获取港股列表
        df = ak.stock_hk_spot()
        symbols = df["symbol"].tolist()
        print(f"  从 AKShare 获取 {len(symbols)} 只港股代码")
        return symbols
    except Exception as e:
        print(f"  AKShare 获取失败: {e}")
        # 备用：常见港股列表
        return [
            "00700", "09988", "03690", "01810", "02318",
            "00941", "00005", "02020", "09618", "01211",
            "00388", "00883", "02269", "00027", "01038",
            "00016", "00002", "00001", "00003", "00006",
            "00011", "00012", "00017", "00019", "00066",
            "00175", "00267", "00288", "00386", "00688",
            "00762", "00823", "00857", "00868", "00939",
            "00960", "00981", "01024", "01109", "01177",
            "01299", "01398", "01876", "01928", "02007",
            "02018", "02313", "02319", "02328", "02382",
            "02388", "02628", "02899", "03328", "03988",
            "06030", "06098", "06618", "06862", "09633",
            "09888", "09961", "09999",
        ]


def fetch_hk_stocks():
    """抓取港股数据"""
    print("抓取港股数据...")

    symbols = get_hk_stock_list()

    stocks = []
    total = len(symbols)

    for i, symbol in enumerate(symbols):
        code = symbol.zfill(5)
        ticker_symbol = f"{code}.HK"

        if i % 50 == 0:
            print(f"  进度: {i}/{total} ({i*100//total}%)")

        try:
            ticker = yf.Ticker(ticker_symbol)
            info = ticker.info

            current = info.get("regularMarketPrice") or info.get("currentPrice") or 0
            prev = info.get("regularMarketPreviousClose") or info.get("previousClose") or 0

            if current == 0:
                continue

            change = current - prev if prev else 0
            change_pct = (change / prev * 100) if prev else 0

            stocks.append({
                "symbol": f"HK:{code}",
                "code": code,
                "name": info.get("shortName", ""),
                "name_cn": info.get("longName", ""),
                "price": round(current, 2),
                "prev_close": round(prev, 2),
                "change": round(change, 2),
                "change_pct": round(change_pct, 2),
            })
        except Exception as e:
            continue

    return stocks


def main():
    print("=" * 50)
    print("港股数据抓取 (yfinance)")
    print(f"时间: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print("=" * 50)

    hk_stocks = fetch_hk_stocks()

    if not hk_stocks:
        print("未获取到港股数据")
        return

    # 保存港股数据
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    with open(OUTPUT_DIR / "stocks-hk.json", "w", encoding="utf-8") as f:
        json.dump({
            "metadata": {
                "updated_at": datetime.now(timezone.utc).isoformat(),
                "count": len(hk_stocks),
            },
            "stocks": hk_stocks,
        }, f, ensure_ascii=False)

    print(f"\n保存 stocks-hk.json ({len(hk_stocks)} 只)")

    # 更新合并数据
    print("\n更新合并数据...")

    # 读取现有的 CN 和 US 数据
    with open(OUTPUT_DIR / "stocks-cn.json", "r", encoding="utf-8") as f:
        cn_data = json.load(f)
    with open(OUTPUT_DIR / "stocks-us.json", "r", encoding="utf-8") as f:
        us_data = json.load(f)

    all_stocks = cn_data["stocks"] + hk_stocks + us_data["stocks"]
    stocks_index = {s["symbol"]: s for s in all_stocks}

    metadata = {
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "counts": {
            "CN": len(cn_data["stocks"]),
            "HK": len(hk_stocks),
            "US": len(us_data["stocks"]),
            "total": len(all_stocks),
        }
    }

    with open(OUTPUT_DIR / "stocks.json", "w", encoding="utf-8") as f:
        json.dump({"metadata": metadata, "stocks": all_stocks}, f, ensure_ascii=False)

    with open(OUTPUT_DIR / "stocks-index.json", "w", encoding="utf-8") as f:
        json.dump({"metadata": metadata, "index": stocks_index}, f, ensure_ascii=False)

    print("=" * 50)
    print("完成!")
    print(f"  港股: {len(hk_stocks)}")
    print(f"  合计: {len(all_stocks)}")
    print("=" * 50)


if __name__ == "__main__":
    main()
