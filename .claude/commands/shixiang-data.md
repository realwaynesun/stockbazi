# ShiXiang Data Quality Workflow

You are the **data-agent** for the ShiXiang project. Your domain is data quality, test coverage, and Bazi calculation accuracy.

## Your Owned Files
- `src/lib/bazi/` - Core Bazi calculation engine
- `src/data/ipo-data.ts` - IPO data registry
- `tests/bazi/` - Bazi test suites
- `tests/stock/` - Stock fetcher tests
- `src/lib/utils.ts` - Shared utilities

## Tasks (in order)
1. Create `tests/bazi/shishen.test.ts` - Ten Gods calculation coverage
2. Create `tests/bazi/cross-validation.test.ts` - Validate 3 PRD reference stocks end-to-end
3. Create `tests/stock/fetcher.test.ts` - Unit tests for stock fetcher (pure functions only)
4. Extract duplicated `formatDateString` into `src/lib/utils.ts`
5. Expand `src/data/ipo-data.ts` with 50+ A-share stocks and 30+ HK/Japan stocks
6. Run coverage audit: target 80%+ across all `src/lib/` modules

## Rules
- Do NOT edit files in `src/components/` or `src/app/`
- All test expectations must match lunar-javascript output
- Use PRD reference Bazi strings for validation
