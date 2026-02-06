# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**市相 (ShiXiang)** - A stock analysis application that uses Chinese Bazi (Four Pillars of Destiny) metaphysics to analyze stocks based on their IPO date and time. The project treats a stock's IPO moment as its "birth time" and applies traditional Chinese astrology concepts (四柱八字, 五行, 十神) to generate unique market analysis perspectives.

This is an entertainment/educational project with clear disclaimers that it does not constitute investment advice.

## Commands

```bash
# Development
npm run dev          # Start Next.js dev server

# Build
npm run build        # Generates Prisma client, then builds Next.js

# Testing
npm run test         # Run vitest in watch mode
npm run test:run     # Run tests once
npm run test:coverage # Run tests with coverage
npx vitest tests/bazi/calculator.test.ts  # Run single test file

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to SQLite
npx prisma studio    # Open Prisma database GUI

# Linting
npm run lint         # Run ESLint
```

## Architecture

### Core Calculation Flow

```
User Input (Stock Symbol)
    ↓
/api/stock/[symbol]/route.ts  →  fetchStockInfo() → Yahoo Finance
    ↓
IPO Date + Time + Timezone
    ↓
calculateBazi()  →  toBeijingTime() → lunar-javascript
    ↓
BaziResult (四柱八字)
    ↓
┌─────────────────────────────────┐
│  calculateWuXingStrength()      │  Five Elements analysis
│  calculateDaYun()               │  Major Luck Cycles (100 years)
│  calculateShiShen()             │  Ten Gods relationships
└─────────────────────────────────┘
    ↓
generateAnalysisReport()  →  Financial interpretation
```

### Key Modules

**`src/lib/bazi/`** - Core Bazi calculation engine:
- `calculator.ts` - Converts IPO datetime to Beijing time, calculates Four Pillars using lunar-javascript
- `wuxing.ts` - Five Elements strength calculation with 藏干 (hidden stems) weights and 月令 (monthly) coefficients
- `dayun.ts` - Major Luck Cycles (大运) calculation based on solar terms
- `shishen.ts` - Ten Gods (十神) relationships relative to Day Master
- `constants.ts` - Lookup tables for 天干, 地支, 五行 mappings
- `types.ts` - TypeScript type definitions for all Bazi concepts

**`src/lib/stock/`** - Stock data fetching:
- Fetches IPO dates from Yahoo Finance
- Handles multi-market support (US, China A-shares, Hong Kong, Tokyo)
- Default IPO times based on exchange opening times

**`src/lib/interpret/`** - Financial interpretation:
- Maps traditional Bazi concepts to financial terminology
- Generates analysis reports combining all calculated data

### Critical Concepts

**Time Zone Handling**: All Bazi calculations require Beijing time (Asia/Shanghai). The system converts any timezone to Beijing time before calculation. US stock IPO at 09:30 EST becomes 22:30 Beijing time (亥时).

**Solar Term Boundaries**: Chinese year changes at 立春 (Spring Begins), not January 1st. The code handles this via lunar-javascript.

**Validation Test Cases** (from PRD):
| Stock | IPO DateTime | Timezone | Expected Bazi |
|-------|-------------|----------|---------------|
| AAPL | 1980-12-12 09:30 | America/New_York | 庚申 戊子 己未 乙亥 |
| TSLA | 2010-06-29 09:30 | America/New_York | 庚寅 壬午 庚戌 丁亥 |
| 茅台 | 2001-08-27 09:30 | Asia/Shanghai | 辛巳 丙申 壬戌 乙巳 |

### Database

SQLite with Prisma ORM. Schema in `prisma/schema.prisma`:
- `Stock` - Basic stock info with IPO date/time/timezone
- `BaziResult` - Cached calculation results (static data)

### External Dependencies

- `lunar-javascript` - Core library for Chinese calendar and Bazi calculations
- `luxon` - Timezone conversion
- `echarts` - Five Elements radar chart visualization

## Task Management

This project uses `tk` for task tracking.

### Rules
- Before starting work, run `tk ls` and `tk ready` to see pending tasks
- When discovering new issues, bugs, or work needed, immediately run `tk create "description" -t task`
- Start a task with `tk start <id>`, complete with `tk close <id>`
- If a task depends on another, run `tk dep <id> <dependency-id>`
- **Important**: If you take shortcuts or write simplified implementations, you MUST create a ticket documenting this
- Do not silently deviate from the plan - file a ticket first