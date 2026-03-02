# InsureX - Insurance Management System Frontend

A modern React-based frontend for the InsureX Insurance Management System, built with TypeScript, Material-UI, and Vite.

## Features

- **Authentication & Authorization**: JWT-based authentication with role-based access control
- **Policy Management**: Create, view, edit, and manage insurance policies
- **Asset Management**: Track and manage insured assets
- **Claims Processing**: Submit, review, and process insurance claims
- **Partner Management**: Manage agencies, brokers, and service providers
- **Billing & Invoicing**: Generate invoices and track payments
- **Reporting**: Dashboard with statistics and analytics
- **Responsive Design**: Mobile-friendly interface with Material-UI

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) v5
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **State Management**: React Context API + Custom Hooks

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components (AuthProvider, PrivateRoute)
│   ├── Layout/         # Layout components (Sidebar, Header)
│   └── Notifications/  # Notification system
├── hooks/              # Custom React hooks
│   ├── useAuth.ts      # Authentication hook
│   ├── usePolicies.ts  # Policies management hook
│   ├── useAssets.ts    # Assets management hook
│   ├── useClaims.ts    # Claims management hook
│   ├── usePartners.ts  # Partners management hook
│   ├── useBilling.ts   # Billing management hook
│   └── useNotification.ts # Notification hook
├── pages/              # Page components
│   ├── auth/           # Login, Register, ForgotPassword, ResetPassword
│   ├── dashboard/      # Dashboard page
│   ├── policies/       # PolicyList, PolicyForm, PolicyDetails
│   ├── assets/         # AssetList, AssetForm, AssetDetails
│   ├── claims/         # ClaimList, ClaimForm, ClaimDetails
│   ├── partners/       # PartnerList, PartnerForm
│   ├── billing/        # BillingList
│   ├── reports/        # Reports page
│   ├── profile/        # User profile page
│   └── settings/       # Settings page
├── services/           # API service functions
│   ├── api.service.ts  # Axios instance configuration
│   ├── auth.service.ts # Authentication API calls
│   ├── policy.service.ts
│   ├── asset.service.ts
│   ├── claim.service.ts
│   ├── partner.service.ts
│   └── billing.service.ts
├── types/              # TypeScript type definitions
│   ├── auth.types.ts
│   ├── policy.types.ts
│   ├── asset.types.ts
│   ├── claim.types.ts
│   ├── partner.types.ts
│   ├── billing.types.ts
│   └── index.ts
├── utils/              # Utility functions
│   └── formatters.ts   # Date and currency formatters
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/luigi043/New-Insurex.git
cd New-Insurex/insurex-react
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_URL=http://localhost:3001/api
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## API Integration

The frontend expects a REST API with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Policies
- `GET /api/policies` - List all policies
- `GET /api/policies/:id` - Get policy details
- `POST /api/policies` - Create new policy
- `PATCH /api/policies/:id` - Update policy
- `DELETE /api/policies/:id` - Delete policy
- `GET /api/policies/stats` - Get policy statistics

### Assets
- `GET /api/assets` - List all assets
- `GET /api/assets/:id` - Get asset details
- `POST /api/assets` - Create new asset
- `PATCH /api/assets/:id` - Update asset
- `DELETE /api/assets/:id` - Delete asset
- `GET /api/assets/stats` - Get asset statistics

### Claims
- `GET /api/claims` - List all claims
- `GET /api/claims/:id` - Get claim details
- `POST /api/claims` - Create new claim
- `PATCH /api/claims/:id` - Update claim
- `DELETE /api/claims/:id` - Delete claim
- `POST /api/claims/:id/submit` - Submit claim
- `POST /api/claims/:id/approve` - Approve claim
- `POST /api/claims/:id/reject` - Reject claim
- `GET /api/claims/stats` - Get claim statistics

### Partners
- `GET /api/partners` - List all partners
- `GET /api/partners/:id` - Get partner details
- `POST /api/partners` - Create new partner
- `PATCH /api/partners/:id` - Update partner
- `DELETE /api/partners/:id` - Delete partner
- `GET /api/partners/stats` - Get partner statistics

### Billing
- `GET /api/billing` - List all invoices
- `GET /api/billing/:id` - Get invoice details
- `POST /api/billing` - Create new invoice
- `PATCH /api/billing/:id` - Update invoice
- `POST /api/billing/:id/payment` - Record payment
- `GET /api/billing/stats` - Get billing statistics

## User Roles

- **ADMIN**: Full access to all features
- **MANAGER**: Can manage policies, claims, and view reports
- **AGENT**: Can create policies and submit claims
- **VIEWER**: Read-only access to policies and claims

## Customization

### Theme

The application uses Material-UI's theming system. You can customize the theme in `App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3001/api` |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support, please open an issue in the GitHub repository.
