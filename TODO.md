# Dashboard Redesign & API Integration TODO

## Plan
Match the dashboard to the reference image and ensure the entire project is in English.

---

## Steps

### Frontend
- [x] 1. Add missing mock data constants to `mockData.ts` (`MOCK_DASHBOARD_OVERVIEW`, `MOCK_PREMIUMS_VS_REINSTATED`, `MOCK_INSURANCE_STATUS_PIE`)
- [ ] 2. Fix vite proxy target (`localhost:3001` → `https://localhost:5001`)
- [ ] 3. Create `insurex-react/.env.local` with `VITE_DEMO_MODE=true`

### Backend
- [ ] 4. Create `DashboardOverviewDto.cs`
- [ ] 5. Create `PremiumsVsReinstatedDto.cs`
- [ ] 6. Create `InsuranceStatusDto.cs`
- [ ] 7. Add 3 new method signatures to `IDashboardService.cs`
- [ ] 8. Implement 3 new methods in `DashboardService.cs`
- [ ] 9. Add 3 new endpoints to `DashboardController.cs`

---

## Progress
- [ ] All steps complete
