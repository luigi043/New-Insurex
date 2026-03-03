# InsureX Usage Guide

**GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)

This guide provides comprehensive instructions for using the InsureX Insurance Management System. Whether you're an administrator, manager, insurer, broker, or accountant, this guide will help you navigate and utilize all features of the platform.

---

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [User Roles & Permissions](#user-roles--permissions)
3. [Authentication](#authentication)
4. [Dashboard](#dashboard)
5. [Policy Management](#policy-management)
6. [Claims Management](#claims-management)
7. [Asset Management](#asset-management)
8. [Partner Management](#partner-management)
9. [Billing & Invoicing](#billing--invoicing)
10. [Reports & Analytics](#reports--analytics)
11. [User Profile & Settings](#user-profile--settings)
12. [API Usage](#api-usage)
13. [Keyboard Shortcuts](#keyboard-shortcuts)
14. [Best Practices](#best-practices)
15. [Troubleshooting](#troubleshooting)

---

## Getting Started

### First Login

1. **Access the Application**
   - Open your browser and navigate to: `http://localhost:5173` (development) or your production URL
   - You'll be redirected to the login page

2. **Default Credentials**
   - **Email**: `admin@insurex.com`
   - **Password**: `Admin123!`
   - **⚠️ Important**: Change the default password after first login!

3. **Initial Setup**
   - After logging in, you'll see the dashboard
   - Complete your profile in Settings → Profile
   - Configure your tenant/organization settings (if applicable)

### Navigation Overview

The main navigation menu includes:

- **Dashboard** - Overview and statistics
- **Policies** - Policy management
- **Claims** - Claims processing
- **Assets** - Asset tracking
- **Partners** - Partner management
- **Billing** - Invoices and payments
- **Reports** - Analytics and reports
- **Settings** - System configuration
- **Profile** - User profile

---

## User Roles & Permissions

### Role Overview

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Admin** | System administrator | Full access, user management, system configuration |
| **Manager** | Department manager | Manage policies, claims, view all reports |
| **Insurer** | Insurance provider | Process claims, manage policies, approve/reject |
| **Broker/Agent** | Insurance broker | Create policies, submit claims, view own data |
| **Accountant** | Financial officer | Manage invoices, process payments, view financial reports |
| **Viewer** | Read-only user | View-only access to all modules |

### Permission Matrix

| Feature | Admin | Manager | Insurer | Broker | Accountant | Viewer |
|---------|-------|---------|---------|--------|------------|--------|
| Create Policy | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Edit Policy | ✅ | ✅ | ✅ | Own only | ❌ | ❌ |
| Delete Policy | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Submit Claim | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Approve Claim | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Process Payment | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| View Reports | ✅ | ✅ | Limited | Limited | Financial | ✅ |
| Manage Users | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| System Settings | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

---

## Authentication

### Login

1. Navigate to the login page
2. Enter your email address
3. Enter your password
4. Click **Login** or press `Enter`

**Remember Me**: Check this box to stay logged in for 7 days (uses refresh token)

### Registration

1. Click **Register** on the login page
2. Fill in the registration form:
   - Full Name
   - Email Address
   - Password (minimum 8 characters, must include uppercase, lowercase, number)
   - Confirm Password
   - Organization/Tenant (if applicable)
3. Click **Register**
4. Check your email for verification link (if email verification is enabled)

### Password Reset

1. Click **Forgot Password** on the login page
2. Enter your email address
3. Check your email for reset link
4. Click the link and enter a new password
5. Login with your new password

### Logout

- Click your profile icon in the top-right corner
- Select **Logout**
- Or use keyboard shortcut: `Ctrl+Shift+L` (Windows/Linux) or `Cmd+Shift+L` (Mac)

---

## Dashboard

The dashboard provides an overview of your insurance operations with key metrics and quick actions.

### Dashboard Components

#### Statistics Cards
- **Total Policies** - Count of all policies
- **Active Claims** - Number of claims in progress
- **Total Assets** - Count of tracked assets
- **Revenue** - Total revenue (if you have permission)

#### Recent Activities
- Latest policy creations
- Recent claim submissions
- Payment transactions
- System notifications

#### Quick Actions
- **Create Policy** - Quick access to policy creation
- **Submit Claim** - Start a new claim
- **Add Asset** - Register a new asset
- **Generate Invoice** - Create a new invoice

#### Charts & Graphs
- Policy status distribution (pie chart)
- Claims over time (line chart)
- Revenue trends (bar chart)
- Asset categories (donut chart)

### Customizing Dashboard

1. Click the **Customize** button (if available)
2. Select which widgets to display
3. Drag and drop to rearrange
4. Click **Save** to apply changes

---

## Policy Management

### Creating a Policy

1. Navigate to **Policies** → **New Policy**
2. Fill in the policy form:

   **Basic Information**
   - Policy Number (auto-generated or manual)
   - Policy Type (Life, Health, Auto, Property, etc.)
   - Start Date
   - End Date
   - Premium Amount
   - Payment Frequency (Monthly, Quarterly, Annually)

   **Insured Party**
   - Name
   - Email
   - Phone
   - Address
   - Date of Birth
   - Identification Number

   **Coverage Details**
   - Coverage Amount
   - Deductible
   - Coverage Type
   - Additional Benefits

   **Documents**
   - Upload policy documents (PDF, images)
   - Attach supporting documents

3. Click **Save Draft** or **Create Policy**
4. Policy will be created in **Draft** status

### Policy Status Workflow

```
Draft → Active → Expired/Cancelled
         ↓
      Renewed → Active
```

**Status Transitions**:
- **Draft** → **Active**: Activate the policy (requires payment)
- **Active** → **Cancelled**: Cancel policy (may require reason)
- **Active** → **Expired**: Automatically expires on end date
- **Expired** → **Active**: Renew the policy

### Viewing Policies

1. Navigate to **Policies** → **All Policies**
2. Use filters to narrow down:
   - Status (Draft, Active, Expired, Cancelled)
   - Policy Type
   - Date Range
   - Insured Party
   - Policy Number
3. Click on a policy to view details

### Editing a Policy

1. Navigate to the policy details page
2. Click **Edit** button
3. Modify the fields you need
4. Click **Save Changes**

**Note**: Some fields may be locked after activation (e.g., coverage amount)

### Policy Actions

- **Activate**: Change status from Draft to Active
- **Cancel**: Cancel an active policy
- **Renew**: Renew an expired policy
- **Download**: Download policy documents as PDF
- **Print**: Print policy details
- **Share**: Share policy via email

### Policy Search

Use the search bar to find policies by:
- Policy Number
- Insured Party Name
- Email Address
- Policy Type

---

## Claims Management

### Submitting a Claim

1. Navigate to **Claims** → **New Claim**
2. Select the associated policy
3. Fill in claim details:

   **Claim Information**
   - Claim Number (auto-generated)
   - Claim Type
   - Incident Date
   - Description of Loss
   - Claimed Amount
   - Location of Incident

   **Supporting Documents**
   - Upload photos
   - Attach receipts
   - Add medical reports (if applicable)
   - Include police reports (if applicable)

4. Click **Submit Claim**
5. Claim will be created in **Submitted** status

### Claim Status Workflow

```
Submitted → Under Review → Approved/Rejected
              ↓
          Investigation → Approved/Rejected
              ↓
          Approved → Paid
```

**Status Transitions**:
- **Submitted** → **Under Review**: Automatically moved by system
- **Under Review** → **Investigation**: Requires investigation
- **Under Review** → **Approved**: Claim approved
- **Under Review** → **Rejected**: Claim rejected (requires reason)
- **Approved** → **Paid**: Payment processed

### Processing Claims

**For Insurers/Managers**:

1. Navigate to **Claims** → **Pending Claims**
2. Click on a claim to review details
3. Review all documents and information
4. Take action:

   **Approve Claim**:
   - Click **Approve**
   - Enter approval amount (may differ from claimed amount)
   - Add notes
   - Click **Confirm Approval**

   **Reject Claim**:
   - Click **Reject**
   - Enter rejection reason (required)
   - Add notes
   - Click **Confirm Rejection**

   **Request Investigation**:
   - Click **Request Investigation**
   - Assign investigator
   - Add investigation notes
   - Click **Submit**

### Claim Actions

- **View Details**: See full claim information
- **Download Documents**: Download all attached documents
- **Add Notes**: Add internal notes (not visible to claimant)
- **Approve**: Approve the claim
- **Reject**: Reject the claim
- **Process Payment**: Mark claim as paid (Accountant role)

### Claim Search & Filters

Filter claims by:
- Status
- Claim Type
- Date Range
- Policy Number
- Claim Amount Range
- Assigned Investigator

---

## Asset Management

### Adding an Asset

1. Navigate to **Assets** → **New Asset**
2. Select asset category:
   - Real Estate
   - Vehicle
   - Equipment
   - Inventory
   - Intellectual Property
   - etc.

3. Fill in asset details:

   **Basic Information**
   - Asset Name
   - Asset Type
   - Serial Number (if applicable)
   - Purchase Date
   - Purchase Price
   - Current Value

   **Location**
   - Address
   - Building/Unit
   - GPS Coordinates (optional)

   **Insurance**
   - Associated Policy
   - Coverage Amount
   - Premium

   **Documents**
   - Purchase Receipt
   - Photos
   - Appraisal Documents

4. Click **Save Asset**

### Asset Categories

The system supports 11+ asset types:
1. **Real Estate** - Buildings, land, properties
2. **Vehicles** - Cars, trucks, motorcycles
3. **Equipment** - Machinery, tools, technology
4. **Inventory** - Stock, merchandise
5. **Intellectual Property** - Patents, trademarks, copyrights
6. **Financial Assets** - Investments, accounts
7. **Furniture & Fixtures** - Office furniture, fixtures
8. **Art & Collectibles** - Artwork, collectibles
9. **Livestock** - Animals, crops
10. **Watercraft** - Boats, ships
11. **Aircraft** - Planes, helicopters

### Asset Valuation

1. Navigate to asset details
2. Click **Update Valuation**
3. Enter new valuation:
   - Valuation Date
   - Valuation Amount
   - Valuation Method (Market, Cost, Income)
   - Appraiser Information
4. Upload appraisal documents
5. Click **Save Valuation**

**Valuation History**: View all historical valuations in the asset timeline

### Asset Inspections

1. Navigate to asset details
2. Click **Schedule Inspection**
3. Fill in inspection details:
   - Inspection Date
   - Inspector Name
   - Inspection Type (Routine, Damage Assessment, etc.)
   - Notes
4. Click **Schedule**

**After Inspection**:
- Upload inspection report
- Update asset condition
- Add photos
- Update valuation if needed

### Asset Depreciation

The system automatically calculates depreciation based on:
- Asset type
- Purchase date
- Useful life
- Depreciation method (Straight-line, Declining balance, etc.)

View depreciation schedule in asset details.

---

## Partner Management

### Adding a Partner

1. Navigate to **Partners** → **New Partner**
2. Select partner type:
   - **Agency** - Insurance agency
   - **Broker** - Insurance broker
   - **Insurer** - Insurance company
   - **Service Provider** - Third-party service provider

3. Fill in partner information:

   **Company Information**
   - Company Name
   - Registration Number
   - Tax ID
   - Industry
   - Website

   **Contact Information**
   - Primary Contact Name
   - Email
   - Phone
   - Address

   **Commission Structure**
   - Commission Rate (%)
   - Commission Type (Fixed, Percentage, Tiered)
   - Payment Terms

4. Upload documents:
   - Business License
   - Contract Agreement
   - Certifications

5. Click **Save Partner**

### Partner Types

- **Agency**: Insurance agencies that sell policies
- **Broker**: Independent brokers who connect clients with insurers
- **Insurer**: Insurance companies providing coverage
- **Service Provider**: Third-party services (inspectors, appraisers, etc.)

### Commission Management

1. Navigate to partner details
2. Click **Commission Structure**
3. Configure:
   - Commission Rate
   - Commission Calculation Method
   - Payment Schedule
   - Minimum/Maximum Limits
4. Click **Save**

**Commission Reports**: View commission history and pending payments

### Partner Performance

View partner metrics:
- Policies Sold
- Total Premium Generated
- Commission Earned
- Claims Ratio
- Customer Satisfaction

---

## Billing & Invoicing

### Creating an Invoice

1. Navigate to **Billing** → **New Invoice**
2. Select invoice type:
   - Policy Premium
   - Service Fee
   - Commission Payment
   - Other

3. Fill in invoice details:

   **Invoice Information**
   - Invoice Number (auto-generated)
   - Invoice Date
   - Due Date
   - Customer/Partner
   - Associated Policy (if applicable)

   **Line Items**
   - Description
   - Quantity
   - Unit Price
   - Tax Rate
   - Total

4. Add notes or terms
5. Click **Generate Invoice**

### Invoice Status

- **Draft**: Not yet sent
- **Sent**: Sent to customer
- **Paid**: Payment received
- **Overdue**: Past due date
- **Cancelled**: Invoice cancelled

### Processing Payments

1. Navigate to **Billing** → **Invoices**
2. Find the invoice to pay
3. Click **Record Payment**
4. Enter payment details:
   - Payment Date
   - Payment Method (Cash, Bank Transfer, Credit Card, Check)
   - Payment Amount
   - Reference Number
   - Notes
5. Upload payment receipt (optional)
6. Click **Record Payment**

### Payment Methods

- **Bank Transfer**: Wire transfer, ACH
- **Credit Card**: Visa, Mastercard, Amex
- **Check**: Physical check
- **Cash**: Cash payment
- **Online Payment**: Payment gateway integration

### Invoice Actions

- **View**: View invoice details
- **Download PDF**: Download invoice as PDF
- **Email**: Send invoice via email
- **Print**: Print invoice
- **Record Payment**: Record payment received
- **Send Reminder**: Send payment reminder email
- **Cancel**: Cancel invoice

### Late Fees

The system automatically calculates late fees for overdue invoices:
- Late fee rate (configurable)
- Grace period
- Maximum late fee amount

---

## Reports & Analytics

### Available Reports

1. **Policy Reports**
   - Policy Summary
   - Policy Status Distribution
   - Premium Analysis
   - Policy Renewals

2. **Claims Reports**
   - Claims Summary
   - Claims by Status
   - Claims by Type
   - Average Claim Amount
   - Claims Processing Time

3. **Financial Reports**
   - Revenue Report
   - Commission Report
   - Payment History
   - Outstanding Invoices

4. **Asset Reports**
   - Asset Inventory
   - Asset Valuation
   - Depreciation Report
   - Asset by Category

5. **Partner Reports**
   - Partner Performance
   - Commission Report
   - Partner Activity

### Generating Reports

1. Navigate to **Reports**
2. Select report type
3. Configure filters:
   - Date Range
   - Status
   - Category
   - Partner/Agent
4. Click **Generate Report**
5. View, download, or print the report

### Export Options

- **PDF**: Download as PDF
- **Excel**: Export to Excel (.xlsx)
- **CSV**: Export to CSV
- **Print**: Print directly

### Scheduled Reports

1. Navigate to **Reports** → **Scheduled Reports**
2. Click **Create Schedule**
3. Configure:
   - Report Type
   - Frequency (Daily, Weekly, Monthly)
   - Recipients
   - Format
4. Click **Save Schedule**

---

## User Profile & Settings

### Profile Management

1. Click your profile icon (top-right)
2. Select **Profile**
3. Update information:
   - Full Name
   - Email Address
   - Phone Number
   - Profile Picture
   - Bio
4. Click **Save Changes**

### Change Password

1. Navigate to **Profile** → **Security**
2. Enter current password
3. Enter new password
4. Confirm new password
5. Click **Change Password**

**Password Requirements**:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

### Notification Settings

1. Navigate to **Settings** → **Notifications**
2. Configure notification preferences:
   - Email Notifications
   - In-App Notifications
   - SMS Notifications (if enabled)
   - Notification Types:
     - Policy Updates
     - Claim Status Changes
     - Payment Reminders
     - System Alerts
3. Click **Save Preferences**

### System Settings (Admin Only)

1. Navigate to **Settings** → **System**
2. Configure:
   - General Settings
   - Email Configuration
   - Payment Gateway
   - Security Settings
   - Multi-tenancy Settings
3. Click **Save Settings**

---

## API Usage

### Authentication

**Login**:
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "expiresIn": 86400,
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "roles": ["Manager"]
  }
}
```

**Using the Token**:
```bash
GET /api/policies
Authorization: Bearer {token}
```

### Common API Endpoints

**Policies**:
- `GET /api/policies` - List all policies
- `GET /api/policies/{id}` - Get policy details
- `POST /api/policies` - Create policy
- `PUT /api/policies/{id}` - Update policy
- `DELETE /api/policies/{id}` - Delete policy
- `POST /api/policies/{id}/activate` - Activate policy

**Claims**:
- `GET /api/claims` - List all claims
- `GET /api/claims/{id}` - Get claim details
- `POST /api/claims` - Create claim
- `POST /api/claims/{id}/submit` - Submit claim
- `POST /api/claims/{id}/approve` - Approve claim
- `POST /api/claims/{id}/reject` - Reject claim

**Assets**:
- `GET /api/assets` - List all assets
- `GET /api/assets/{id}` - Get asset details
- `POST /api/assets` - Create asset
- `PUT /api/assets/{id}` - Update asset

**Invoices**:
- `GET /api/invoices` - List all invoices
- `POST /api/invoices` - Create invoice
- `POST /api/invoices/{id}/pay` - Record payment

### API Documentation

Full API documentation is available at:
- **Swagger UI**: `https://localhost:7001/swagger` (development)
- **OpenAPI Spec**: `/swagger/v1/swagger.json`

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+K` / `Cmd+K` | Open command palette |
| `Ctrl+/` / `Cmd+/` | Show keyboard shortcuts |
| `Ctrl+N` / `Cmd+N` | New (context-aware: policy, claim, etc.) |
| `Ctrl+F` / `Cmd+F` | Search |
| `Ctrl+S` / `Cmd+S` | Save |
| `Esc` | Close modal/dialog |
| `Ctrl+Shift+L` / `Cmd+Shift+L` | Logout |
| `Ctrl+B` / `Cmd+B` | Toggle sidebar |
| `Ctrl+,` / `Cmd+,` | Open settings |

---

## Best Practices

### Policy Management

1. **Always verify** insured party information before creating a policy
2. **Upload all documents** at policy creation to avoid delays
3. **Set reminders** for policy renewals
4. **Review policies regularly** for accuracy
5. **Document all changes** in policy notes

### Claims Processing

1. **Review all documents** before making a decision
2. **Add detailed notes** for all claim actions
3. **Follow up** on investigations promptly
4. **Communicate clearly** with claimants
5. **Process payments** within agreed timeframes

### Asset Management

1. **Update valuations** regularly (annually minimum)
2. **Schedule inspections** proactively
3. **Maintain accurate** asset information
4. **Upload supporting documents** for all assets
5. **Track depreciation** for accounting purposes

### Data Entry

1. **Use consistent** naming conventions
2. **Fill all required fields** completely
3. **Double-check** amounts and dates
4. **Attach supporting documents** when available
5. **Save drafts** frequently

### Security

1. **Never share** your login credentials
2. **Logout** when finished, especially on shared computers
3. **Use strong passwords** and change them regularly
4. **Report suspicious activity** immediately
5. **Follow role-based permissions** - don't attempt unauthorized actions

---

## Troubleshooting

### Common Issues

**Issue**: Can't login
- Verify email and password are correct
- Check if account is locked (too many failed attempts)
- Contact administrator to reset password

**Issue**: Page not loading
- Check internet connection
- Clear browser cache
- Try a different browser
- Check browser console for errors (F12)

**Issue**: Can't save changes
- Verify you have permission to edit
- Check if required fields are filled
- Ensure you're not editing a locked record
- Check for validation errors

**Issue**: Documents not uploading
- Verify file size is within limits (10MB default)
- Check file type is allowed (.jpg, .png, .pdf, .doc, .docx)
- Ensure stable internet connection
- Try a different file

**Issue**: Reports not generating
- Verify date range is valid
- Check if you have data for selected filters
- Ensure you have permission to view the report
- Try a smaller date range

### Getting Help

1. **Check Documentation**: Review this guide and README
2. **Contact Support**: Email support@insurex.com
3. **Report Issues**: [GitHub Issues](https://github.com/luigi043/New-Insurex/issues)
4. **Check Logs**: Review system logs for errors (Admin only)

---

## Additional Resources

- **API Documentation**: `/swagger` endpoint
- **GitHub Repository**: [https://github.com/luigi043/New-Insurex](https://github.com/luigi043/New-Insurex)
- **Setup Guide**: [SETUP.md](./SETUP.md)
- **Development Checklist**: [Checklist.md](../Checklist.md)

---

**Last Updated**: 2026-03-03  
**Version**: 1.0.0  
**For support**: [GitHub Issues](https://github.com/luigi043/New-Insurex/issues)
