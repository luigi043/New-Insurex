# InsureX Frontend - Corrections and Additions

## Summary

This corrected version of the InsureX React frontend fixes the duplicate code issues found in the original repository and adds all missing components, services, hooks, and types needed for a complete, functional insurance management system.

## Issues Fixed

### 1. Duplicate Code Removal
The original repository had files with duplicated content (the entire file content was repeated twice). This has been fixed in:
- `App.tsx`
- `Dashboard.tsx`
- `Login.tsx`

### 2. Missing Files Created

#### Types (`/src/types/`)
- `auth.types.ts` - User authentication types and interfaces
- `policy.types.ts` - Policy management types
- `asset.types.ts` - Asset management types
- `claim.types.ts` - Claims processing types
- `partner.types.ts` - Partner management types
- `billing.types.ts` - Billing and invoicing types
- `index.ts` - Type exports

#### Services (`/src/services/`)
- `api.service.ts` - Axios instance with interceptors for auth and error handling
- `auth.service.ts` - Authentication API calls
- `policy.service.ts` - Policy CRUD operations
- `asset.service.ts` - Asset CRUD operations
- `claim.service.ts` - Claims management API
- `partner.service.ts` - Partner management API
- `billing.service.ts` - Billing and invoicing API
- `index.ts` - Service exports

#### Hooks (`/src/hooks/`)
- `useAuth.ts` - Authentication state management
- `usePolicies.ts` - Policies data management with pagination
- `useAssets.ts` - Assets data management with pagination
- `useClaims.ts` - Claims data management with workflow actions
- `usePartners.ts` - Partners data management
- `useBilling.ts` - Billing data management
- `useNotification.ts` - Toast notification system
- `index.ts` - Hook exports

#### Components (`/src/components/`)
- `Auth/AuthProvider.tsx` - Authentication context provider
- `Auth/PrivateRoute.tsx` - Protected route component
- `Layout/Layout.tsx` - Main layout with sidebar and navigation
- `Notifications/NotificationProvider.tsx` - Toast notification provider
- `Common/ConfirmDialog.tsx` - Reusable confirmation dialog

#### Pages (`/src/pages/`)
- `auth/Login.tsx` - Login page (corrected)
- `auth/Register.tsx` - User registration page
- `auth/ForgotPassword.tsx` - Password reset request page
- `auth/ResetPassword.tsx` - Password reset confirmation page
- `Dashboard.tsx` - Main dashboard with statistics (corrected)
- `policies/PolicyList.tsx` - Policy listing with filters
- `policies/PolicyForm.tsx` - Policy creation/editing form
- `policies/PolicyDetails.tsx` - Policy detail view
- `assets/AssetList.tsx` - Asset listing with filters
- `assets/AssetForm.tsx` - Asset creation/editing form
- `assets/AssetDetails.tsx` - Asset detail view
- `claims/ClaimList.tsx` - Claims listing with status filters
- `claims/ClaimForm.tsx` - Claim submission form
- `claims/ClaimDetails.tsx` - Claim detail view with actions
- `partners/PartnerList.tsx` - Partner listing
- `partners/PartnerForm.tsx` - Partner creation/editing form
- `billing/BillingList.tsx` - Invoice listing
- `reports/Reports.tsx` - Reports and analytics page
- `profile/Profile.tsx` - User profile page
- `settings/Settings.tsx` - Application settings page
- `NotFound.tsx` - 404 error page

#### Utilities (`/src/utils/`)
- `formatters.ts` - Date and currency formatting utilities

#### Configuration Files
- `main.tsx` - Application entry point
- `vite-env.d.ts` - Vite type declarations
- `index.html` - HTML entry point
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `tsconfig.node.json` - TypeScript configuration for Node
- `vite.config.ts` - Vite build configuration

## Features Implemented

### Authentication
- JWT-based authentication with automatic token refresh
- Login, registration, password reset flows
- Role-based access control (ADMIN, MANAGER, AGENT, VIEWER)
- Protected routes with PrivateRoute component

### Policy Management
- Create, read, update, delete policies
- Policy status tracking (DRAFT, PENDING, ACTIVE, EXPIRED, CANCELLED, SUSPENDED)
- Policy types (LIFE, HEALTH, AUTO, HOME, BUSINESS, TRAVEL, LIABILITY, PROPERTY)
- Coverage details and beneficiaries management
- Document upload support

### Asset Management
- Track insured assets
- Asset types (VEHICLE, PROPERTY, EQUIPMENT, INVENTORY, JEWELRY, etc.)
- Asset status tracking
- Image and document uploads
- Link assets to policies

### Claims Processing
- Submit new claims
- Claims workflow: SUBMITTED → UNDER_REVIEW → APPROVED/REJECTED → SETTLED
- Claim history tracking
- Document uploads
- Assignment to adjusters

### Partner Management
- Manage agencies, brokers, repair shops, medical providers
- Partner status tracking
- Commission rate management
- Document management

### Billing & Invoicing
- Generate invoices for premiums
- Payment recording
- Overdue invoice tracking
- PDF generation support

### UI/UX
- Responsive Material-UI design
- Sidebar navigation with mobile support
- Toast notifications
- Confirmation dialogs
- Loading states and error handling
- Data tables with pagination and filtering

## How to Use

### 1. Install Dependencies
```bash
cd /mnt/okcomputer/output/insurex-react-corrected
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
VITE_API_URL=http://localhost:3001/api
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

## API Integration

The frontend expects a REST API server running at the configured `VITE_API_URL`. All API calls include JWT authentication headers automatically.

### Authentication Flow
1. User logs in with email/password
2. Server returns accessToken and refreshToken
3. Tokens are stored in localStorage
4. Axios interceptor adds Authorization header to all requests
5. On 401 errors, the interceptor attempts token refresh
6. If refresh fails, user is redirected to login

### Data Fetching Pattern
```typescript
const { policies, isLoading, error, fetchPolicies } = usePolicies({
  page: 1,
  limit: 10,
  filters: { status: 'ACTIVE' }
});
```

## File Structure

```
insurex-react-corrected/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
├── CHANGES.md
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── vite-env.d.ts
    ├── components/
    │   ├── Auth/
    │   ├── Layout/
    │   ├── Notifications/
    │   └── Common/
    ├── hooks/
    ├── pages/
    │   ├── auth/
    │   ├── policies/
    │   ├── assets/
    │   ├── claims/
    │   ├── partners/
    │   ├── billing/
    │   ├── reports/
    │   ├── profile/
    │   └── settings/
    ├── services/
    ├── types/
    └── utils/
```

## Next Steps

1. Connect to your backend API
2. Customize the theme colors in `App.tsx`
3. Add additional features as needed
4. Write tests for components and hooks
5. Set up CI/CD pipeline

## Notes

- All components are written in TypeScript with proper type definitions
- The code follows React best practices with functional components and hooks
- Material-UI v5 is used for consistent styling
- The notification system provides user feedback for all actions
- Error boundaries should be added for production use
