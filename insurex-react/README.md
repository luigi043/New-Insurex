# InsureX Frontend

A modern React-based frontend for the InsureX Insurance Management System.

## Features

- **Authentication**: Login, Register, Forgot Password, Reset Password
- **Dashboard**: Overview with statistics, recent claims, and expiring policies
- **Policies**: Full CRUD operations for insurance policies
- **Assets**: Manage insured assets with details and documentation
- **Claims**: Submit and track insurance claims
- **Partners**: Manage broker and agent relationships
- **Billing**: Invoice management and payment tracking
- **Reports**: Generate and download various reports
- **Profile & Settings**: User profile management and preferences

## Tech Stack

- **Framework**: React 18 with TypeScript
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **State Management**: React Context API

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Authentication components
│   ├── Common/         # Shared components (ConfirmDialog, etc.)
│   ├── Layout/         # Layout component with sidebar
│   └── Notifications/  # Toast notification system
├── hooks/              # Custom React hooks
├── pages/              # Page components
│   ├── auth/           # Login, Register, ForgotPassword, ResetPassword
│   ├── dashboard/      # Dashboard
│   ├── policies/       # PolicyList, PolicyForm, PolicyDetails
│   ├── assets/         # AssetList, AssetForm, AssetDetails
│   ├── claims/         # ClaimList, ClaimForm, ClaimDetails
│   ├── partners/       # PartnerList, PartnerForm
│   ├── billing/        # BillingList
│   ├── profile/        # Profile
│   ├── reports/        # Reports
│   └── settings/       # Settings
├── services/           # API services
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

## API Integration

The frontend expects a REST API with the following endpoints:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password
- `PUT /auth/profile` - Update profile
- `POST /auth/change-password` - Change password

### Policies
- `GET /policies` - List policies
- `GET /policies/:id` - Get policy details
- `POST /policies` - Create policy
- `PUT /policies/:id` - Update policy
- `DELETE /policies/:id` - Delete policy
- `GET /policies/stats` - Get policy statistics
- `POST /policies/:id/renew` - Renew policy
- `POST /policies/:id/cancel` - Cancel policy
- `POST /policies/:id/activate` - Activate policy
- `GET /policies/expiring` - Get expiring policies

### Assets
- `GET /assets` - List assets
- `GET /assets/:id` - Get asset details
- `POST /assets` - Create asset
- `PUT /assets/:id` - Update asset
- `DELETE /assets/:id` - Delete asset
- `GET /assets/stats` - Get asset statistics

### Claims
- `GET /claims` - List claims
- `GET /claims/:id` - Get claim details
- `POST /claims` - Create claim
- `PUT /claims/:id` - Update claim
- `DELETE /claims/:id` - Delete claim
- `GET /claims/stats` - Get claim statistics
- `POST /claims/:id/submit` - Submit claim
- `POST /claims/:id/workflow` - Workflow actions

## Authentication Flow

1. User logs in with email and password
2. Server returns JWT token and refresh token
3. Tokens are stored in localStorage
4. Axios interceptor adds token to all requests
5. On 401 error, the interceptor attempts to refresh the token
6. If refresh fails, user is redirected to login

## Key Components

### AuthProvider
Manages authentication state and provides auth methods to the app.

### PrivateRoute
Protects routes that require authentication. Can also check for specific roles.

### NotificationProvider
Provides toast notifications throughout the app.

### Layout
Main layout with sidebar navigation and header.

## Custom Hooks

### useAuth
Access authentication context (user, login, logout, etc.)

### usePolicies
Manage policies with CRUD operations and pagination.

### useAssets
Manage assets with CRUD operations.

### useClaims
Manage claims with CRUD operations and workflow actions.

### useNotification
Show toast notifications (success, error, warning, info).

## TypeScript Types

All types are defined in `src/types/`:
- `auth.types.ts` - User, LoginCredentials, etc.
- `policy.types.ts` - Policy, PolicyType, etc.
- `asset.types.ts` - Asset, AssetType, etc.
- `claim.types.ts` - Claim, ClaimType, etc.
- `user.types.ts` - UserRole, Partner, etc.
- `billing.types.ts` - Invoice, Payment, etc.

## License

MIT
