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
