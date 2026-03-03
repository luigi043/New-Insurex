# InsureX API Reference

**Base URL:** `https://api.insurex.com/api`  
**Authentication:** Bearer JWT Token  
**Content-Type:** `application/json`

## Standard Response Format

All endpoints return responses in this format:

```json
{
  "success": true,
  "message": "Optional message",
  "data": { },
  "errors": null,
  "statusCode": 200,
  "traceId": "correlation-id"
}
```

## Authentication

### POST /auth/login
Login with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "base64-refresh-token",
  "expiresAt": "2026-03-04T00:00:00Z",
  "user": { "id": 1, "role": "Admin" }
}
```

### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "newuser@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "tenantId": 1
}
```

### POST /auth/refresh
Refresh an expired JWT token.

**Request:**
```json
{ "refreshToken": "base64-refresh-token" }
```

---

## Policies

### GET /policies
List all policies (paginated).

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| pageNumber | int | 1 | Page number |
| pageSize | int | 10 | Items per page |
| sortBy | string | null | Sort column |
| sortDescending | bool | false | Sort direction |
| searchTerm | string | null | Search in policy number/description |

### GET /policies/{id}
Get a single policy by ID.

### POST /policies
Create a new policy.

**Request:**
```json
{
  "policyNumber": "POL-2026-001",
  "type": "Property",
  "premiumAmount": 1200.00,
  "coverageAmount": 500000.00,
  "deductible": 1000.00,
  "startDate": "2026-01-01",
  "endDate": "2027-01-01",
  "paymentFrequency": "Monthly"
}
```

### POST /policies/{id}/activate
Activate a draft policy.

### POST /policies/{id}/cancel
Cancel an active policy.

**Request:**
```json
{ "reason": "Customer requested cancellation" }
```

### POST /policies/{id}/renew
Renew an expiring policy.

**Request:**
```json
{ "newEndDate": "2028-01-01" }
```

---

## Claims

### GET /claims
List all claims (paginated).

### GET /claims/filter
Filter claims with advanced criteria.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| policyId | int? | Filter by policy |
| status | string? | Claim status |
| claimType | string? | Claim type |
| fromIncidentDate | DateTime? | Incident date from |
| toIncidentDate | DateTime? | Incident date to |
| minAmount | decimal? | Minimum claimed amount |
| maxAmount | decimal? | Maximum claimed amount |

### POST /claims
Create a new claim.

### POST /claims/{id}/submit
Submit a claim for review.

### POST /claims/{id}/approve
Approve a claim.

**Request:**
```json
{
  "approvedAmount": 4500.00,
  "notes": "Approved after field inspection"
}
```

### POST /claims/{id}/reject
Reject a claim.

**Request:**
```json
{ "reason": "Insufficient documentation" }
```

### POST /claims/{id}/pay
Mark a claim as paid.

**Request:**
```json
{ "paymentReference": "PAY-2026-001" }
```

---

## Investigation Notes

### GET /claims/{claimId}/investigation-notes
List investigation notes for a claim.

### POST /claims/{claimId}/investigation-notes
Create an investigation note.

**Request:**
```json
{
  "title": "Field Inspection Report",
  "content": "Inspected property at 123 Main St...",
  "noteType": "FieldInspection",
  "priority": "High",
  "isConfidential": false,
  "followUpDate": "2026-03-10"
}
```

### POST /claims/{claimId}/investigation-notes/{noteId}/resolve
Resolve an investigation note.

---

## Reports

### GET /reports/definitions
List available report definitions.

### POST /reports/generate/{reportId}
Generate a report.

**Request:**
```json
{
  "fromDate": "2026-01-01",
  "toDate": "2026-03-01"
}
```

### GET /reports/policies/summary
Generate policy summary report.

### GET /reports/claims/summary
Generate claims summary report.

### GET /reports/financial
Generate financial report.

### GET /reports/loss-ratio
Generate loss ratio report by policy type.

---

## Workflows

### POST /workflows/definitions
Create a custom workflow definition.

**Request:**
```json
{
  "name": "Claim Approval Workflow",
  "entityType": "Claim",
  "isActive": true
}
```

### POST /workflows/instances/start
Start a workflow instance.

**Request:**
```json
{
  "definitionId": 1,
  "entityType": "Claim",
  "entityId": 42
}
```

### POST /workflows/instances/{id}/transition
Transition a workflow to the next status.

**Request:**
```json
{
  "toStatus": "Approved",
  "notes": "All checks passed"
}
```

---

## Audit

### GET /audit
Search audit entries with filtering.

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| userId | int? | Filter by user |
| entityType | string? | Filter by entity type |
| action | string? | Filter by action (Create/Update/Delete) |
| fromDate | DateTime? | From date |
| toDate | DateTime? | To date |
| searchTerm | string? | Search in values |

### GET /audit/compliance-report
Generate compliance report.

**Query Parameters:** `from`, `to` (required)

### GET /audit/export
Export audit log as CSV.

---

## Tenants (Admin Only)

### POST /tenants/onboard
Onboard a new tenant with admin user.

**Request:**
```json
{
  "tenantName": "Acme Insurance",
  "contactEmail": "admin@acme.com",
  "adminEmail": "admin@acme.com",
  "adminFirstName": "Admin",
  "adminLastName": "User",
  "adminPassword": "SecurePass123!",
  "initialSettings": {
    "currency": "EUR",
    "timezone": "Europe/London"
  }
}
```

### GET /tenants/{id}/settings
Get all tenant settings.

### PUT /tenants/{id}/settings/{key}
Update a tenant setting.

**Request:**
```json
{
  "value": "EUR",
  "description": "Default currency",
  "category": "Financial"
}
```

---

## Error Codes

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | VALIDATION_ERROR | Invalid request data |
| 401 | UNAUTHORIZED | Missing or invalid token |
| 403 | FORBIDDEN | Insufficient permissions |
| 404 | NOT_FOUND | Resource not found |
| 409 | CONFLICT | Duplicate resource |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |

## Rate Limiting

- **Default:** 100 requests per minute per client
- **Headers:** `X-RateLimit-Remaining`, `Retry-After`

## Roles

| Role | Description |
|------|-------------|
| Admin | Full system access |
| Manager | Management operations |
| Insurer | Insurance operations |
| Broker | Broker operations |
| ClaimsProcessor | Claims management |
| Accountant | Financial operations |
| Underwriter | Underwriting operations |
| Viewer | Read-only access |
