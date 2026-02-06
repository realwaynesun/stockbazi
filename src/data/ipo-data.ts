/**
 * 市相 - Curated IPO Data
 * 精选股票IPO数据
 *
 * Data Sources:
 * - US Stocks: Wikipedia (CC BY-SA), SEC EDGAR filings (public domain)
 * - A-shares: 上海证券交易所官网, 深圳证券交易所官网
 * - HK Stocks: 香港交易所官网
 *
 * All IPO dates are factual public information about when securities began trading.
 */

import type { Exchange } from '../lib/stock/types';

export interface IpoEntry {
  name: string;
  ipoDate: string;  // YYYY-MM-DD format
  exchange: Exchange;
}

/**
 * IPO数据表 - 使用交易所前缀作为键以避免冲突
 * Key format: EXCHANGE:SYMBOL (e.g., NASDAQ:AAPL, SSE:600519, HKEX:0700)
 */
export const IPO_DATA: Record<string, IpoEntry> = {
  // ============================================================
  // US STOCKS - NASDAQ
  // ============================================================
  'NASDAQ:AAPL': { name: 'Apple Inc.', ipoDate: '1980-12-12', exchange: 'NASDAQ' },
  'NASDAQ:MSFT': { name: 'Microsoft Corporation', ipoDate: '1986-03-13', exchange: 'NASDAQ' },
  'NASDAQ:GOOGL': { name: 'Alphabet Inc. Class A', ipoDate: '2004-08-19', exchange: 'NASDAQ' },
  'NASDAQ:GOOG': { name: 'Alphabet Inc. Class C', ipoDate: '2004-08-19', exchange: 'NASDAQ' },
  'NASDAQ:AMZN': { name: 'Amazon.com Inc.', ipoDate: '1997-05-15', exchange: 'NASDAQ' },
  'NASDAQ:TSLA': { name: 'Tesla, Inc.', ipoDate: '2010-06-29', exchange: 'NASDAQ' },
  'NASDAQ:NVDA': { name: 'NVIDIA Corporation', ipoDate: '1999-01-22', exchange: 'NASDAQ' },
  'NASDAQ:META': { name: 'Meta Platforms, Inc.', ipoDate: '2012-05-18', exchange: 'NASDAQ' },
  'NASDAQ:NFLX': { name: 'Netflix, Inc.', ipoDate: '2002-05-23', exchange: 'NASDAQ' },
  'NASDAQ:AMD': { name: 'Advanced Micro Devices', ipoDate: '1972-09-27', exchange: 'NASDAQ' },
  'NASDAQ:INTC': { name: 'Intel Corporation', ipoDate: '1971-10-13', exchange: 'NASDAQ' },
  'NASDAQ:CSCO': { name: 'Cisco Systems, Inc.', ipoDate: '1990-02-16', exchange: 'NASDAQ' },
  'NASDAQ:ADBE': { name: 'Adobe Inc.', ipoDate: '1986-08-13', exchange: 'NASDAQ' },
  'NASDAQ:AVGO': { name: 'Broadcom Inc.', ipoDate: '2009-08-06', exchange: 'NASDAQ' },
  'NASDAQ:COST': { name: 'Costco Wholesale Corporation', ipoDate: '1985-12-05', exchange: 'NASDAQ' },
  'NASDAQ:PEP': { name: 'PepsiCo, Inc.', ipoDate: '1972-10-10', exchange: 'NASDAQ' },
  'NASDAQ:CMCSA': { name: 'Comcast Corporation', ipoDate: '1972-06-29', exchange: 'NASDAQ' },
  'NASDAQ:QCOM': { name: 'Qualcomm Inc.', ipoDate: '1991-12-13', exchange: 'NASDAQ' },
  'NASDAQ:TMUS': { name: 'T-Mobile US, Inc.', ipoDate: '2007-04-19', exchange: 'NASDAQ' },
  'NASDAQ:SBUX': { name: 'Starbucks Corporation', ipoDate: '1992-06-26', exchange: 'NASDAQ' },
  'NASDAQ:AMGN': { name: 'Amgen Inc.', ipoDate: '1983-06-17', exchange: 'NASDAQ' },
  'NASDAQ:INTU': { name: 'Intuit Inc.', ipoDate: '1993-03-12', exchange: 'NASDAQ' },
  'NASDAQ:ISRG': { name: 'Intuitive Surgical, Inc.', ipoDate: '2000-06-13', exchange: 'NASDAQ' },
  'NASDAQ:MDLZ': { name: 'Mondelez International', ipoDate: '2012-10-02', exchange: 'NASDAQ' },
  'NASDAQ:GILD': { name: 'Gilead Sciences, Inc.', ipoDate: '1992-01-22', exchange: 'NASDAQ' },
  'NASDAQ:ADP': { name: 'Automatic Data Processing', ipoDate: '1961-09-21', exchange: 'NASDAQ' },
  'NASDAQ:REGN': { name: 'Regeneron Pharmaceuticals', ipoDate: '1991-04-04', exchange: 'NASDAQ' },
  'NASDAQ:VRTX': { name: 'Vertex Pharmaceuticals', ipoDate: '1991-07-25', exchange: 'NASDAQ' },
  'NASDAQ:ADI': { name: 'Analog Devices, Inc.', ipoDate: '1969-03-18', exchange: 'NASDAQ' },
  'NASDAQ:PANW': { name: 'Palo Alto Networks', ipoDate: '2012-07-20', exchange: 'NASDAQ' },
  'NASDAQ:MU': { name: 'Micron Technology', ipoDate: '1984-06-06', exchange: 'NASDAQ' },
  'NASDAQ:LRCX': { name: 'Lam Research Corporation', ipoDate: '1984-08-14', exchange: 'NASDAQ' },
  'NASDAQ:KLAC': { name: 'KLA Corporation', ipoDate: '1980-10-22', exchange: 'NASDAQ' },
  'NASDAQ:SNPS': { name: 'Synopsys, Inc.', ipoDate: '1992-02-26', exchange: 'NASDAQ' },
  'NASDAQ:CDNS': { name: 'Cadence Design Systems', ipoDate: '1987-07-16', exchange: 'NASDAQ' },
  'NASDAQ:MRVL': { name: 'Marvell Technology', ipoDate: '2000-06-27', exchange: 'NASDAQ' },
  'NASDAQ:FTNT': { name: 'Fortinet, Inc.', ipoDate: '2009-11-18', exchange: 'NASDAQ' },
  'NASDAQ:ABNB': { name: 'Airbnb, Inc.', ipoDate: '2020-12-10', exchange: 'NASDAQ' },
  'NASDAQ:PYPL': { name: 'PayPal Holdings, Inc.', ipoDate: '2015-07-20', exchange: 'NASDAQ' },
  'NASDAQ:MELI': { name: 'MercadoLibre, Inc.', ipoDate: '2007-08-10', exchange: 'NASDAQ' },
  'NASDAQ:CRWD': { name: 'CrowdStrike Holdings', ipoDate: '2019-06-12', exchange: 'NASDAQ' },
  'NASDAQ:WDAY': { name: 'Workday, Inc.', ipoDate: '2012-10-12', exchange: 'NASDAQ' },
  'NASDAQ:TEAM': { name: 'Atlassian Corporation', ipoDate: '2015-12-10', exchange: 'NASDAQ' },
  'NASDAQ:DDOG': { name: 'Datadog, Inc.', ipoDate: '2019-09-19', exchange: 'NASDAQ' },
  'NASDAQ:ZS': { name: 'Zscaler, Inc.', ipoDate: '2018-03-16', exchange: 'NASDAQ' },
  'NASDAQ:SNOW': { name: 'Snowflake Inc.', ipoDate: '2020-09-16', exchange: 'NASDAQ' },
  'NASDAQ:TTD': { name: 'The Trade Desk, Inc.', ipoDate: '2016-09-21', exchange: 'NASDAQ' },
  'NASDAQ:COIN': { name: 'Coinbase Global, Inc.', ipoDate: '2021-04-14', exchange: 'NASDAQ' },
  'NASDAQ:ROKU': { name: 'Roku, Inc.', ipoDate: '2017-09-28', exchange: 'NASDAQ' },
  'NASDAQ:OKTA': { name: 'Okta, Inc.', ipoDate: '2017-04-07', exchange: 'NASDAQ' },

  // ============================================================
  // US STOCKS - NYSE
  // ============================================================
  'NYSE:BRK-A': { name: 'Berkshire Hathaway Inc. Class A', ipoDate: '1980-03-07', exchange: 'NYSE' },
  'NYSE:BRK-B': { name: 'Berkshire Hathaway Inc. Class B', ipoDate: '1996-05-09', exchange: 'NYSE' },
  'NYSE:JPM': { name: 'JPMorgan Chase & Co.', ipoDate: '1969-03-05', exchange: 'NYSE' },
  'NYSE:V': { name: 'Visa Inc.', ipoDate: '2008-03-19', exchange: 'NYSE' },
  'NYSE:MA': { name: 'Mastercard Incorporated', ipoDate: '2006-05-25', exchange: 'NYSE' },
  'NYSE:JNJ': { name: 'Johnson & Johnson', ipoDate: '1944-09-25', exchange: 'NYSE' },
  'NYSE:WMT': { name: 'Walmart Inc.', ipoDate: '1972-08-25', exchange: 'NYSE' },
  'NYSE:PG': { name: 'Procter & Gamble Company', ipoDate: '1890-01-01', exchange: 'NYSE' },
  'NYSE:UNH': { name: 'UnitedHealth Group', ipoDate: '1984-10-17', exchange: 'NYSE' },
  'NYSE:HD': { name: 'The Home Depot, Inc.', ipoDate: '1981-09-22', exchange: 'NYSE' },
  'NYSE:DIS': { name: 'The Walt Disney Company', ipoDate: '1957-11-12', exchange: 'NYSE' },
  'NYSE:KO': { name: 'The Coca-Cola Company', ipoDate: '1919-09-05', exchange: 'NYSE' },
  'NYSE:MRK': { name: 'Merck & Co., Inc.', ipoDate: '1946-06-17', exchange: 'NYSE' },
  'NYSE:PFE': { name: 'Pfizer Inc.', ipoDate: '1944-01-01', exchange: 'NYSE' },
  'NYSE:ABBV': { name: 'AbbVie Inc.', ipoDate: '2013-01-02', exchange: 'NYSE' },
  'NYSE:LLY': { name: 'Eli Lilly and Company', ipoDate: '1952-10-01', exchange: 'NYSE' },
  'NYSE:NKE': { name: 'NIKE, Inc.', ipoDate: '1980-12-02', exchange: 'NYSE' },
  'NYSE:BA': { name: 'The Boeing Company', ipoDate: '1962-01-02', exchange: 'NYSE' },
  'NYSE:CRM': { name: 'Salesforce, Inc.', ipoDate: '2004-06-23', exchange: 'NYSE' },
  'NYSE:ORCL': { name: 'Oracle Corporation', ipoDate: '1986-03-12', exchange: 'NYSE' },
  'NYSE:IBM': { name: 'International Business Machines', ipoDate: '1911-06-16', exchange: 'NYSE' },
  'NYSE:GS': { name: 'The Goldman Sachs Group', ipoDate: '1999-05-04', exchange: 'NYSE' },
  'NYSE:MS': { name: 'Morgan Stanley', ipoDate: '1986-03-21', exchange: 'NYSE' },
  'NYSE:BAC': { name: 'Bank of America Corporation', ipoDate: '1998-10-01', exchange: 'NYSE' },
  'NYSE:WFC': { name: 'Wells Fargo & Company', ipoDate: '1998-11-02', exchange: 'NYSE' },
  'NYSE:C': { name: 'Citigroup Inc.', ipoDate: '1998-10-08', exchange: 'NYSE' },
  'NYSE:AXP': { name: 'American Express Company', ipoDate: '1977-05-18', exchange: 'NYSE' },
  'NYSE:CVX': { name: 'Chevron Corporation', ipoDate: '1921-06-22', exchange: 'NYSE' },
  'NYSE:XOM': { name: 'Exxon Mobil Corporation', ipoDate: '1920-07-30', exchange: 'NYSE' },
  'NYSE:CAT': { name: 'Caterpillar Inc.', ipoDate: '1929-12-02', exchange: 'NYSE' },
  'NYSE:GE': { name: 'General Electric Company', ipoDate: '1892-04-15', exchange: 'NYSE' },
  'NYSE:MMM': { name: '3M Company', ipoDate: '1946-02-14', exchange: 'NYSE' },
  'NYSE:HON': { name: 'Honeywell International', ipoDate: '1925-12-01', exchange: 'NYSE' },
  'NYSE:UPS': { name: 'United Parcel Service', ipoDate: '1999-11-10', exchange: 'NYSE' },
  'NYSE:FDX': { name: 'FedEx Corporation', ipoDate: '1978-04-12', exchange: 'NYSE' },
  'NYSE:RTX': { name: 'RTX Corporation', ipoDate: '2020-04-03', exchange: 'NYSE' },
  'NYSE:LMT': { name: 'Lockheed Martin Corporation', ipoDate: '1995-03-15', exchange: 'NYSE' },
  'NYSE:NEE': { name: 'NextEra Energy, Inc.', ipoDate: '1984-04-26', exchange: 'NYSE' },
  'NYSE:DUK': { name: 'Duke Energy Corporation', ipoDate: '2012-07-03', exchange: 'NYSE' },
  'NYSE:SO': { name: 'The Southern Company', ipoDate: '1949-01-03', exchange: 'NYSE' },
  'NYSE:T': { name: 'AT&T Inc.', ipoDate: '1984-01-01', exchange: 'NYSE' },
  'NYSE:VZ': { name: 'Verizon Communications', ipoDate: '2000-07-03', exchange: 'NYSE' },
  'NYSE:MCD': { name: 'McDonald\'s Corporation', ipoDate: '1965-04-21', exchange: 'NYSE' },
  'NYSE:UBER': { name: 'Uber Technologies, Inc.', ipoDate: '2019-05-10', exchange: 'NYSE' },
  'NYSE:SQ': { name: 'Block, Inc.', ipoDate: '2015-11-19', exchange: 'NYSE' },
  'NYSE:SHOP': { name: 'Shopify Inc.', ipoDate: '2015-05-21', exchange: 'NYSE' },
  'NYSE:SPOT': { name: 'Spotify Technology S.A.', ipoDate: '2018-04-03', exchange: 'NYSE' },
  'NYSE:PLTR': { name: 'Palantir Technologies', ipoDate: '2020-09-30', exchange: 'NYSE' },
  'NYSE:RBLX': { name: 'Roblox Corporation', ipoDate: '2021-03-10', exchange: 'NYSE' },
  'NYSE:SNAP': { name: 'Snap Inc.', ipoDate: '2017-03-02', exchange: 'NYSE' },

  // ============================================================
  // A-SHARES - SSE (上海证券交易所)
  // ============================================================
  'SSE:600519': { name: '贵州茅台', ipoDate: '2001-08-27', exchange: 'SSE' },
  'SSE:601318': { name: '中国平安', ipoDate: '2007-03-01', exchange: 'SSE' },
  'SSE:600036': { name: '招商银行', ipoDate: '2002-04-09', exchange: 'SSE' },
  'SSE:601398': { name: '工商银行', ipoDate: '2006-10-27', exchange: 'SSE' },
  'SSE:600900': { name: '长江电力', ipoDate: '2003-11-18', exchange: 'SSE' },
  'SSE:601166': { name: '兴业银行', ipoDate: '2007-02-05', exchange: 'SSE' },
  'SSE:600276': { name: '恒瑞医药', ipoDate: '2000-10-18', exchange: 'SSE' },
  'SSE:600887': { name: '伊利股份', ipoDate: '1996-03-12', exchange: 'SSE' },
  'SSE:601888': { name: '中国中免', ipoDate: '2009-10-15', exchange: 'SSE' },
  'SSE:600309': { name: '万华化学', ipoDate: '2001-01-05', exchange: 'SSE' },
  'SSE:603259': { name: '药明康德', ipoDate: '2018-05-08', exchange: 'SSE' },
  'SSE:601012': { name: '隆基绿能', ipoDate: '2012-04-11', exchange: 'SSE' },
  'SSE:600030': { name: '中信证券', ipoDate: '2003-01-06', exchange: 'SSE' },
  'SSE:601688': { name: '华泰证券', ipoDate: '2010-02-26', exchange: 'SSE' },
  'SSE:600050': { name: '中国联通', ipoDate: '2002-10-09', exchange: 'SSE' },
  'SSE:601857': { name: '中国石油', ipoDate: '2007-11-05', exchange: 'SSE' },
  'SSE:600028': { name: '中国石化', ipoDate: '2001-08-08', exchange: 'SSE' },
  'SSE:601628': { name: '中国人寿', ipoDate: '2007-01-09', exchange: 'SSE' },
  'SSE:601601': { name: '中国太保', ipoDate: '2007-12-25', exchange: 'SSE' },
  'SSE:600000': { name: '浦发银行', ipoDate: '1999-11-10', exchange: 'SSE' },
  'SSE:601939': { name: '建设银行', ipoDate: '2007-09-25', exchange: 'SSE' },
  'SSE:601288': { name: '农业银行', ipoDate: '2010-07-15', exchange: 'SSE' },
  'SSE:601988': { name: '中国银行', ipoDate: '2006-07-05', exchange: 'SSE' },
  'SSE:600585': { name: '海螺水泥', ipoDate: '2002-02-07', exchange: 'SSE' },
  'SSE:601899': { name: '紫金矿业', ipoDate: '2008-04-25', exchange: 'SSE' },
  'SSE:601668': { name: '中国建筑', ipoDate: '2009-07-29', exchange: 'SSE' },
  'SSE:600048': { name: '保利发展', ipoDate: '2006-07-31', exchange: 'SSE' },
  'SSE:601390': { name: '中国中铁', ipoDate: '2007-12-03', exchange: 'SSE' },
  'SSE:601186': { name: '中国铁建', ipoDate: '2008-03-10', exchange: 'SSE' },
  'SSE:600104': { name: '上汽集团', ipoDate: '1997-11-25', exchange: 'SSE' },
  'SSE:601766': { name: '中国中车', ipoDate: '2008-08-18', exchange: 'SSE' },
  'SSE:600016': { name: '民生银行', ipoDate: '2000-12-19', exchange: 'SSE' },
  'SSE:601328': { name: '交通银行', ipoDate: '2007-05-15', exchange: 'SSE' },
  'SSE:600196': { name: '复星医药', ipoDate: '1998-08-07', exchange: 'SSE' },
  'SSE:600009': { name: '上海机场', ipoDate: '1998-02-18', exchange: 'SSE' },
  'SSE:600837': { name: '海通证券', ipoDate: '2007-02-28', exchange: 'SSE' },
  'SSE:600690': { name: '海尔智家', ipoDate: '1993-11-19', exchange: 'SSE' },
  'SSE:601225': { name: '陕西煤业', ipoDate: '2014-01-28', exchange: 'SSE' },
  'SSE:600809': { name: '山西汾酒', ipoDate: '1994-01-06', exchange: 'SSE' },
  'SSE:601919': { name: '中远海控', ipoDate: '2007-06-26', exchange: 'SSE' },
  'SSE:603288': { name: '海天味业', ipoDate: '2014-02-11', exchange: 'SSE' },
  'SSE:600406': { name: '国电南瑞', ipoDate: '2003-10-16', exchange: 'SSE' },
  'SSE:601111': { name: '中国国航', ipoDate: '2006-08-18', exchange: 'SSE' },

  // ============================================================
  // A-SHARES - SZSE (深圳证券交易所)
  // ============================================================
  'SZSE:000858': { name: '五粮液', ipoDate: '1998-04-27', exchange: 'SZSE' },
  'SZSE:000333': { name: '美的集团', ipoDate: '2013-09-18', exchange: 'SZSE' },
  'SZSE:002594': { name: '比亚迪', ipoDate: '2011-06-30', exchange: 'SZSE' },
  'SZSE:300750': { name: '宁德时代', ipoDate: '2018-06-11', exchange: 'SZSE' },
  'SZSE:000001': { name: '平安银行', ipoDate: '1991-04-03', exchange: 'SZSE' },
  'SZSE:000002': { name: '万科A', ipoDate: '1991-01-29', exchange: 'SZSE' },
  'SZSE:000651': { name: '格力电器', ipoDate: '1996-11-18', exchange: 'SZSE' },
  'SZSE:000568': { name: '泸州老窖', ipoDate: '1994-05-09', exchange: 'SZSE' },
  'SZSE:002415': { name: '海康威视', ipoDate: '2010-05-28', exchange: 'SZSE' },
  'SZSE:002352': { name: '顺丰控股', ipoDate: '2017-02-24', exchange: 'SZSE' },
  'SZSE:000725': { name: '京东方A', ipoDate: '1997-06-10', exchange: 'SZSE' },
  'SZSE:002714': { name: '牧原股份', ipoDate: '2014-01-28', exchange: 'SZSE' },
  'SZSE:300059': { name: '东方财富', ipoDate: '2010-03-19', exchange: 'SZSE' },
  'SZSE:002475': { name: '立讯精密', ipoDate: '2010-09-15', exchange: 'SZSE' },
  'SZSE:300124': { name: '汇川技术', ipoDate: '2010-09-28', exchange: 'SZSE' },
  'SZSE:002230': { name: '科大讯飞', ipoDate: '2008-05-12', exchange: 'SZSE' },
  'SZSE:000661': { name: '长春高新', ipoDate: '1996-12-18', exchange: 'SZSE' },
  'SZSE:002271': { name: '东方雨虹', ipoDate: '2008-09-10', exchange: 'SZSE' },
  'SZSE:300015': { name: '爱尔眼科', ipoDate: '2009-10-30', exchange: 'SZSE' },
  'SZSE:300122': { name: '智飞生物', ipoDate: '2010-09-28', exchange: 'SZSE' },
  'SZSE:002241': { name: '歌尔股份', ipoDate: '2008-05-22', exchange: 'SZSE' },
  'SZSE:002049': { name: '紫光国微', ipoDate: '2005-06-06', exchange: 'SZSE' },
  'SZSE:000100': { name: 'TCL科技', ipoDate: '2004-01-30', exchange: 'SZSE' },
  'SZSE:002304': { name: '洋河股份', ipoDate: '2009-11-06', exchange: 'SZSE' },
  'SZSE:300274': { name: '阳光电源', ipoDate: '2011-11-02', exchange: 'SZSE' },
  'SZSE:002812': { name: '恩捷股份', ipoDate: '2016-11-10', exchange: 'SZSE' },
  'SZSE:000063': { name: '中兴通讯', ipoDate: '1997-11-18', exchange: 'SZSE' },
  'SZSE:002142': { name: '宁波银行', ipoDate: '2007-07-19', exchange: 'SZSE' },
  'SZSE:000538': { name: '云南白药', ipoDate: '1993-12-15', exchange: 'SZSE' },
  'SZSE:002027': { name: '分众传媒', ipoDate: '2015-12-28', exchange: 'SZSE' },
  'SZSE:000069': { name: '华侨城A', ipoDate: '1997-09-10', exchange: 'SZSE' },
  'SZSE:002460': { name: '赣锋锂业', ipoDate: '2010-08-10', exchange: 'SZSE' },
  'SZSE:300760': { name: '迈瑞医疗', ipoDate: '2018-10-16', exchange: 'SZSE' },
  'SZSE:002032': { name: '苏泊尔', ipoDate: '2004-08-17', exchange: 'SZSE' },
  'SZSE:000876': { name: '新希望', ipoDate: '1998-03-11', exchange: 'SZSE' },

  // ============================================================
  // HK STOCKS - HKEX (香港交易所)
  // ============================================================
  'HKEX:0700': { name: '腾讯控股', ipoDate: '2004-06-16', exchange: 'HKEX' },
  'HKEX:9988': { name: '阿里巴巴-SW', ipoDate: '2019-11-26', exchange: 'HKEX' },
  'HKEX:3690': { name: '美团-W', ipoDate: '2018-09-20', exchange: 'HKEX' },
  'HKEX:1810': { name: '小米集团-W', ipoDate: '2018-07-09', exchange: 'HKEX' },
  'HKEX:9618': { name: '京东集团-SW', ipoDate: '2020-06-18', exchange: 'HKEX' },
  'HKEX:9999': { name: '网易-S', ipoDate: '2020-06-11', exchange: 'HKEX' },
  'HKEX:2318': { name: '中国平安', ipoDate: '2004-06-24', exchange: 'HKEX' },
  'HKEX:0941': { name: '中国移动', ipoDate: '1997-10-23', exchange: 'HKEX' },
  'HKEX:1398': { name: '工商银行', ipoDate: '2006-10-27', exchange: 'HKEX' },
  'HKEX:0939': { name: '建设银行', ipoDate: '2005-10-27', exchange: 'HKEX' },
  'HKEX:3988': { name: '中国银行', ipoDate: '2006-06-01', exchange: 'HKEX' },
  'HKEX:2628': { name: '中国人寿', ipoDate: '2003-12-18', exchange: 'HKEX' },
  'HKEX:1299': { name: '友邦保险', ipoDate: '2010-10-29', exchange: 'HKEX' },
  'HKEX:0388': { name: '香港交易所', ipoDate: '2000-06-27', exchange: 'HKEX' },
  'HKEX:0005': { name: '汇丰控股', ipoDate: '1991-12-17', exchange: 'HKEX' },
  'HKEX:0883': { name: '中国海洋石油', ipoDate: '2001-02-28', exchange: 'HKEX' },
  'HKEX:0857': { name: '中国石油股份', ipoDate: '2000-04-07', exchange: 'HKEX' },
  'HKEX:0386': { name: '中国石油化工', ipoDate: '2000-10-19', exchange: 'HKEX' },
  'HKEX:2020': { name: '安踏体育', ipoDate: '2007-07-10', exchange: 'HKEX' },
  'HKEX:9626': { name: '哔哩哔哩-SW', ipoDate: '2021-03-29', exchange: 'HKEX' },
  'HKEX:9888': { name: '百度集团-SW', ipoDate: '2021-03-23', exchange: 'HKEX' },
  'HKEX:0027': { name: '银河娱乐', ipoDate: '1991-07-26', exchange: 'HKEX' },
  'HKEX:1928': { name: '金沙中国有限公司', ipoDate: '2009-11-30', exchange: 'HKEX' },
  'HKEX:0066': { name: '港铁公司', ipoDate: '2000-10-05', exchange: 'HKEX' },
  'HKEX:0001': { name: '长和', ipoDate: '2015-03-18', exchange: 'HKEX' },
  'HKEX:0016': { name: '新鸿基地产', ipoDate: '1972-08-23', exchange: 'HKEX' },
  'HKEX:0002': { name: '中电控股', ipoDate: '1998-01-29', exchange: 'HKEX' },
  'HKEX:0003': { name: '香港中华煤气', ipoDate: '1960-06-03', exchange: 'HKEX' },
  'HKEX:0011': { name: '恒生银行', ipoDate: '1972-06-19', exchange: 'HKEX' },
  'HKEX:0012': { name: '恒基地产', ipoDate: '1981-07-14', exchange: 'HKEX' },
  'HKEX:1211': { name: '比亚迪股份', ipoDate: '2002-07-31', exchange: 'HKEX' },
  'HKEX:2269': { name: '药明生物', ipoDate: '2017-06-13', exchange: 'HKEX' },
  'HKEX:0175': { name: '吉利汽车', ipoDate: '2004-05-28', exchange: 'HKEX' },
  'HKEX:1024': { name: '快手-W', ipoDate: '2021-02-05', exchange: 'HKEX' },
  'HKEX:0981': { name: '中芯国际', ipoDate: '2004-03-18', exchange: 'HKEX' },
  'HKEX:9961': { name: '携程集团-S', ipoDate: '2021-04-19', exchange: 'HKEX' },
  'HKEX:6098': { name: '碧桂园服务', ipoDate: '2018-06-19', exchange: 'HKEX' },
  'HKEX:2382': { name: '舜宇光学科技', ipoDate: '2007-06-15', exchange: 'HKEX' },
  'HKEX:0241': { name: '阿里健康', ipoDate: '2014-01-21', exchange: 'HKEX' },
  'HKEX:1177': { name: '中国生物制药', ipoDate: '2000-09-29', exchange: 'HKEX' },

  // ============================================================
  // JAPAN STOCKS - TSE (東京証券取引所)
  // ============================================================
  'TSE:7203': { name: 'Toyota Motor', ipoDate: '1949-05-16', exchange: 'TSE' },
  'TSE:6758': { name: 'Sony Group', ipoDate: '1958-12-01', exchange: 'TSE' },
  'TSE:6861': { name: 'Keyence', ipoDate: '1987-10-26', exchange: 'TSE' },
  'TSE:9984': { name: 'SoftBank Group', ipoDate: '1994-07-22', exchange: 'TSE' },
  'TSE:6098': { name: 'Recruit Holdings', ipoDate: '2014-10-16', exchange: 'TSE' },
  'TSE:8306': { name: 'Mitsubishi UFJ', ipoDate: '2001-04-02', exchange: 'TSE' },
  'TSE:6501': { name: 'Hitachi', ipoDate: '1949-05-16', exchange: 'TSE' },
  'TSE:7974': { name: 'Nintendo', ipoDate: '1962-01-06', exchange: 'TSE' },
  'TSE:9432': { name: 'NTT', ipoDate: '1987-02-09', exchange: 'TSE' },
  'TSE:4063': { name: 'Shin-Etsu Chemical', ipoDate: '1949-05-16', exchange: 'TSE' },
};

/**
 * 获取所有支持的股票代码列表
 */
export function getSupportedSymbols(): string[] {
  return Object.keys(IPO_DATA).map(key => {
    const [, symbol] = key.split(':');
    return symbol;
  });
}

/**
 * 获取按交易所分组的股票数量
 */
export function getStockCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const key of Object.keys(IPO_DATA)) {
    const [exchange] = key.split(':');
    counts[exchange] = (counts[exchange] || 0) + 1;
  }
  return counts;
}
