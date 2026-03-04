# InsureX - South Africa Demo Fix & Enhancement

## Tasks

- [x] 1. Fix `formatters.ts` - locale `en-ZA`, currency `ZAR`
- [x] 2. Update `auth.types.ts` - add Employee & Client roles
- [x] 3. Update `mockData.ts` - SA context + 3 demo users (Admin, Employee, Client)
- [x] 4. Update `mockInterceptor.ts` - route login by email to correct user
- [x] 5. Fix `asset.types.ts` - add `assetNumber` and `currency` fields
- [x] 6. Fix `useAssets.ts` - `deleteAsset` returns boolean, stability fixes
- [x] 7. Fix `PolicyList.tsx` - memoize filters, use ZAR currency
- [x] 8. Fix `AssetList.tsx` - fix all property name mismatches & enum casing
- [x] 9. Enhance `Dashboard.tsx` - add animated pie + area + bar + line charts (recharts)
- [x] 10. Update `Login.tsx` - show 3 demo user quick-login buttons
- [x] 11. Fix `usePolicies.ts` - JSON.stringify(filters) dep to prevent re-render loop

## Build Status
✅ `npm run build:demo` — 13,582 modules transformed, built in 45.95s — ZERO ERRORS

## CI / Deployment History
| Run | Commit | Result | Root Cause |
|-----|--------|--------|------------|
| #12 | initial | ❌ | `package-lock.json` not tracked → removed `cache: npm`, `npm ci` → `npm install` |
| #13 | deps fix | ❌ | ERESOLVE `@mui/lab@7` vs `@mui/material@^5` → added `--legacy-peer-deps` |
| #14 | peer-deps | ❌ | Concurrency group `pages` conflict → renamed to unique group |
| #15 | concurrency | ❌ | Linux case-sensitivity: git tracked `pages/Assets/` but App.tsx imported `./pages/assets/` |
| #16 | `ec9ef8b` | ✅ **SUCCESS** | `git mv` two-step rename for Assets/Billing/Claims/Reports → all lowercase |

## 🚀 DEPLOYED
- **URL:** https://luigi043.github.io/New-Insurex/
- **Branch:** `blackboxai/github-pages-demo`
- **Commit:** `ec9ef8b`
- **Run:** #16 (22660904427) — `conclusion: success`

## Demo Credentials
| Role | Email | Password | Name |
|------|-------|----------|------|
| Admin | admin@insurex.co.za | Admin1234! | Thabo Nkosi |
| Employee | employee@insurex.co.za | Employee1234! | Nomsa Dlamini |
| Client | client@insurex.co.za | Client1234! | Sipho Mthembu |
