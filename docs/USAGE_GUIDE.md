# InsureX Usage Guide

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)

This guide covers how to use the InsureX Insurance Management System from both a user and developer perspective.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Authentication](#authentication)
4. [Dashboard](#dashboard)
5. [Policy Management](#policy-management)
6. [Claims Processing](#claims-processing)
7. [Asset Management](#asset-management)
8. [Partner Management](#partner-management)
9. [Billing & Invoicing](#billing--invoicing)
10. [Reports & Analytics](#reports--analytics)
11. [API Reference](#api-reference)
12. [Common Workflows](#common-workflows)

---

## System Overview

InsureX is designed to handle the complete insurance lifecycle:

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   POLICIES   │───▶│    CLAIMS    │───▶│   PAYMENTS   │
│  Management  │    │  Processing  │    │   & Billing  │
└──────────────┘    └──────────────┘    └──────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│    ASSETS    │    │   PARTNERS   │    │   REPORTS    │
│   Tracking   │    │   Network    │    │  Analytics   │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## User Roles & Permissions

### Role Hierarchy

| Role | Access Level | Primary Responsibilities |
|------|--------------|-------------------------|
| **Admin** | Full | System configuration, user management, all modules |
| **Manager** | High | Approve claims, manage policies, view reports |
| **Insurer** | Medium | Process claims, underwrite policies |
| **Broker/Agent** | Medium | Create policies, submit claims for clients |
| **Accountant** | Limited | Manage invoices, process payments |
| **Viewer** | Read-only | View dashboards and reports |

### Permission Matrix

| Module | Admin | Manager | Insurer | Agent | Accountant | Viewer |
|--------|-------|---------|---------|-------|------------|--------|
| Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Policies (Create) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Policies (Approve) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Claims (Submit) | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Claims (Approve) | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Payments | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| Reports | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Authentication

### Login

1. Navigate to the login page (`/login`)
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to the dashboard

**Default Test Accounts:**

| Email | Password | Role |
|-------|----------|------|
| admin@insurex.com | Admin123! | Admin |
| manager@insurex.com | Manager123! | Manager |
| agent@insurex.com | Agent123! | Agent |

### Registration (If Enabled)

1. Click "Register" on the login page
2. Fill in required fields:
   - Full Name
   - Email Address
   - Password (min 8 chars, 1 uppercase, 1 number)
   - Confirm Password
3. Click "Create Account"
4. Verify email (if email verification is enabled)

### Password Reset

1. Click "Forgot Password" on login page
2. Enter your email address
3. Check email for reset link
4. Create new password

### API Authentication

All API requests require a JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

**Obtain Token:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@insurex.com",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1...",
  "refreshToken": "a1b2c3d4...",
  "expiresIn": 604800,
  "user": {
    "id": 1,
    "email": "admin@insurex.com",
    "role": "Admin"
  }
}
```

---

## Dashboard

The dashboard provides an overview of system activity:

### Widgets

| Widget | Description |
|--------|-------------|
| **Active Policies** | Total number of active policies |
| **Pending Claims** | Claims awaiting processing |
| **Monthly Revenue** | Invoice revenue for current month |
| **Recent Activities** | Latest system activities |

### Quick Actions

- Create New Policy
- Submit Claim
- Generate Invoice
- View Reports

---

## Policy Management

### Policy Lifecycle

```
┌────────┐    ┌────────┐    ┌────────┐    ┌─────────┐
│ DRAFT  │───▶│PENDING │───▶│ ACTIVE │───▶│ EXPIRED │
└────────┘    └────────┘    └────────┘    └─────────┘
                  │              │
                  │              ▼
                  │         ┌───────────┐
                  └────────▶│ CANCELLED │
                            └───────────┘
```

### Create a New Policy

1. Navigate to **Policies** → **Create New**
2. Fill in policy details:
   - **Policy Type**: Life, Health, Auto, Property, etc.
   - **Policyholder**: Select or create customer
   - **Coverage Amount**: Insurance coverage limit
   - **Premium**: Monthly/Annual payment amount
   - **Start Date**: Policy effective date
   - **End Date**: Policy expiration date
3. Attach required documents
4. Click **Save as Draft** or **Submit for Approval**

### Policy Actions

| Action | Description | Required Role |
|--------|-------------|---------------|
| Edit | Modify policy details | Agent+ |
| Activate | Move from Pending to Active | Insurer+ |
| Cancel | Terminate policy | Manager+ |
| Renew | Create renewal policy | Agent+ |
| View History | See all policy changes | All |

### API Endpoints

```http
# List policies
GET /api/policies?page=1&pageSize=10&status=Active

# Get policy by ID
GET /api/policies/{id}

# Create policy
POST /api/policies
{
  "policyType": "Auto",
  "policyholderName": "John Doe",
  "coverageAmount": 50000,
  "premium": 500,
  "startDate": "2026-01-01",
  "endDate": "2027-01-01"
}

# Update policy
PUT /api/policies/{id}

# Activate policy
POST /api/policies/{id}/activate

# Cancel policy
POST /api/policies/{id}/cancel

# Renew policy
POST /api/policies/{id}/renew
```

---

## Claims Processing

### Claim Workflow

```
┌───────────┐    ┌────────────┐    ┌───────────────┐
│ SUBMITTED │───▶│ UNDER_REVIEW│───▶│ INVESTIGATION │
└───────────┘    └────────────┘    └───────────────┘
                       │                    │
                       ▼                    ▼
                 ┌──────────┐        ┌───────────┐
                 │ APPROVED │        │ REJECTED  │
                 └──────────┘        └───────────┘
                       │
                       ▼
                 ┌──────────┐
                 │   PAID   │
                 └──────────┘
```

### Submit a Claim

1. Navigate to **Claims** → **Submit New Claim**
2. Select the **Policy** for the claim
3. Fill in claim details:
   - **Claim Type**: Accident, Theft, Medical, etc.
   - **Incident Date**: When the event occurred
   - **Description**: Detailed description of the incident
   - **Claimed Amount**: Amount being claimed
4. Upload supporting documents (photos, police reports, etc.)
5. Click **Submit Claim**

### Process a Claim (Insurer/Manager)

1. Navigate to **Claims** → **Pending Claims**
2. Select a claim to review
3. Review submitted documents
4. Choose action:
   - **Approve**: Accept the claim
   - **Reject**: Deny with reason
   - **Request More Info**: Ask for additional documents
5. Add processing notes
6. Submit decision

### API Endpoints

```http
# List claims
GET /api/claims?status=Pending

# Get claim details
GET /api/claims/{id}

# Submit claim
POST /api/claims
{
  "policyId": 123,
  "claimType": "Accident",
  "incidentDate": "2026-02-15",
  "description": "Vehicle collision...",
  "claimedAmount": 5000
}

# Approve claim
POST /api/claims/{id}/approve
{
  "approvedAmount": 4500,
  "notes": "Approved with deductible"
}

# Reject claim
POST /api/claims/{id}/reject
{
  "reason": "Policy not active at time of incident"
}

# Mark as paid
POST /api/claims/{id}/pay
{
  "paymentMethod": "BankTransfer",
  "transactionId": "TXN123456"
}
```

---

## Asset Management

### Asset Categories

| Category | Asset Types |
|----------|-------------|
| **Vehicles** | Cars, Trucks, Motorcycles, Boats |
| **Property** | Buildings, Land, Equipment |
| **Personal** | Jewelry, Electronics, Art |
| **Commercial** | Machinery, Inventory, Tools |

### Register an Asset

1. Navigate to **Assets** → **Add Asset**
2. Select asset category
3. Fill in details:
   - **Asset Name**: Description
   - **Category**: Type of asset
   - **Purchase Value**: Original value
   - **Current Value**: Appraised value
   - **Purchase Date**: Acquisition date
   - **Location**: Where asset is located
4. Upload photos/documents
5. Click **Save Asset**

### Asset Valuation

Assets support depreciation tracking:

```
Original Value: $50,000
Depreciation: 10% per year
Age: 3 years
Current Value: $50,000 × (0.9)³ = $36,450
```

### API Endpoints

```http
# List assets
GET /api/assets?category=Vehicle

# Get asset details
GET /api/assets/{id}

# Create asset
POST /api/assets
{
  "name": "2024 Toyota Camry",
  "category": "Vehicle",
  "purchaseValue": 35000,
  "currentValue": 32000,
  "purchaseDate": "2024-06-15"
}

# Update valuation
PUT /api/assets/{id}/valuation
{
  "currentValue": 30000,
  "valuationDate": "2026-03-01"
}
```

---

## Partner Management

### Partner Types

| Type | Description |
|------|-------------|
| **Agency** | Insurance agencies that sell policies |
| **Broker** | Independent insurance brokers |
| **Insurer** | Insurance underwriters |
| **Service Provider** | Repair shops, hospitals, etc. |

### Commission Structure

Partners earn commissions based on:

- **New Policy**: % of first-year premium
- **Renewal**: % of renewal premium
- **Claim Processing**: Fixed fee per claim

### API Endpoints

```http
# List partners
GET /api/partners?type=Agency

# Get partner profile
GET /api/partners/{id}

# Register partner
POST /api/partners
{
  "name": "ABC Insurance Agency",
  "type": "Agency",
  "contactEmail": "contact@abc.com",
  "commissionRate": 15
}

# Get partner performance
GET /api/partners/{id}/performance
```

---

## Billing & Invoicing

### Invoice Types

| Type | Trigger |
|------|---------|
| **Premium** | Policy activation/renewal |
| **Deductible** | Claim processing |
| **Service Fee** | Administrative services |

### Generate Invoice

1. Navigate to **Billing** → **Create Invoice**
2. Select invoice type
3. Choose related policy/claim
4. Verify amounts
5. Click **Generate Invoice**
6. Send to customer via email

### Payment Processing

Supported payment methods:
- Bank Transfer
- Credit Card
- Check
- Cash

### API Endpoints

```http
# List invoices
GET /api/invoices?status=Unpaid

# Get invoice
GET /api/invoices/{id}

# Create invoice
POST /api/invoices
{
  "policyId": 123,
  "type": "Premium",
  "amount": 500,
  "dueDate": "2026-04-01"
}

# Record payment
POST /api/invoices/{id}/pay
{
  "amount": 500,
  "paymentMethod": "CreditCard",
  "transactionId": "CC123456"
}

# Get payment history
GET /api/invoices/{id}/payments
```

---

## Reports & Analytics

### Available Reports

| Report | Description |
|--------|-------------|
| **Policy Summary** | Active policies by type |
| **Claims Report** | Claims by status and type |
| **Revenue Report** | Premium collection summary |
| **Partner Performance** | Commission and sales by partner |
| **Aging Report** | Overdue invoices |

### Generate Report

1. Navigate to **Reports**
2. Select report type
3. Set filters (date range, type, etc.)
4. Click **Generate**
5. View online or export to PDF/Excel

### API Endpoints

```http
# Policy statistics
GET /api/policies/stats
{
  "totalPolicies": 1250,
  "activePolices": 980,
  "pendingPolicies": 45,
  "totalCoverage": 125000000
}

# Claim statistics
GET /api/claims/stats
{
  "totalClaims": 450,
  "pendingClaims": 32,
  "approvedClaims": 380,
  "totalPaidAmount": 2500000
}

# Revenue report
GET /api/reports/revenue?startDate=2026-01-01&endDate=2026-03-01
```

---

## Common Workflows

### Workflow 1: New Customer Onboarding

```
1. Create Customer Profile
   └── POST /api/customers

2. Register Assets
   └── POST /api/assets (for each asset)

3. Create Policy
   └── POST /api/policies

4. Generate Premium Invoice
   └── POST /api/invoices

5. Activate Policy (after payment)
   └── POST /api/policies/{id}/activate
```

### Workflow 2: Claim to Payment

```
1. Customer Submits Claim
   └── POST /api/claims

2. Insurer Reviews Claim
   └── GET /api/claims/{id}

3. Request Documents (if needed)
   └── POST /api/claims/{id}/request-documents

4. Approve/Reject Claim
   └── POST /api/claims/{id}/approve
   └── POST /api/claims/{id}/reject

5. Process Payment (if approved)
   └── POST /api/claims/{id}/pay
```

### Workflow 3: Policy Renewal

```
1. System identifies expiring policies
   └── GET /api/policies?expiringWithin=30

2. Generate renewal quote
   └── POST /api/policies/{id}/renewal-quote

3. Customer accepts quote
   └── POST /api/policies/{id}/renew

4. Generate renewal invoice
   └── POST /api/invoices

5. Activate renewed policy
   └── POST /api/policies/{newId}/activate
```

---

## Keyboard Shortcuts (Frontend)

| Shortcut | Action |
|----------|--------|
| `Ctrl + N` | Create new item |
| `Ctrl + S` | Save current form |
| `Ctrl + F` | Open search |
| `Escape` | Close modal/dialog |
| `?` | Show help |

---

## Error Codes

### Common API Errors

| Code | Message | Resolution |
|------|---------|------------|
| 400 | Bad Request | Check request body format |
| 401 | Unauthorized | Login or refresh token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | State transition not allowed |
| 422 | Validation Error | Check field requirements |
| 429 | Too Many Requests | Wait and retry |
| 500 | Server Error | Contact support |

### Business Logic Errors

| Error | Cause | Resolution |
|-------|-------|------------|
| `POLICY_NOT_ACTIVE` | Claim submitted for inactive policy | Activate policy first |
| `INSUFFICIENT_COVERAGE` | Claim exceeds coverage | Reduce claimed amount |
| `DUPLICATE_CLAIM` | Similar claim already exists | Review existing claims |
| `INVALID_STATE_TRANSITION` | Action not allowed in current state | Check workflow rules |

---

## Support

For technical issues or questions:

- **GitHub Issues**: [New-Insurex Issues](https://github.com/luigi043/New-Insurex/issues)
- **API Documentation**: `/swagger` when running locally
- **Developer Docs**: See `/docs/ONBOARDING.md`

---

**Last Updated**: 2026-03-03
