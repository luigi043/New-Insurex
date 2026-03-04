# GitHub Pages Demo - Task TODO

## Steps

- [x] 1. Create mock data (`insurex-react/src/services/mock/mockData.ts`)
- [x] 2. Create mock axios interceptor (`insurex-react/src/services/mock/mockInterceptor.ts`)
- [x] 3. Modify `insurex-react/src/main.tsx` - initialize mock interceptor in demo mode
- [x] 4. `insurex-react/src/hooks/useAuth.ts` - no change needed (localStorage pre-seed + mock `/auth/me` handles auto-login)
- [x] 5. Modify `insurex-react/src/pages/auth/Login.tsx` - add "Try Demo" button
- [x] 6. Modify `insurex-react/vite.config.ts` - add base path for GitHub Pages
- [x] 7. Create `insurex-react/public/404.html` - SPA routing fix
- [x] 8. Modify `insurex-react/index.html` - add redirect handler script
- [x] 9. Create `insurex-react/.env.demo` - demo environment variables
- [x] 10. Create `.github/workflows/deploy-pages.yml` - GitHub Actions workflow
- [ ] 11. Create git branch `blackboxai/github-pages-demo` and commit all changes
