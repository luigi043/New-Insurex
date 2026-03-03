# InsureX Admin Guide

## Tenant Management

### Onboarding a New Tenant

1. Call `POST /api/tenants/onboard` with tenant details and admin credentials
2. The system automatically:
   - Creates the tenant record
   - Creates an admin user for the tenant
   - Applies default settings (currency, timezone, notification preferences)
   - Sets subscription expiry to 1 year from creation

### Managing Tenant Settings

Settings are organized by category:

| Category | Key | Default | Description |
|----------|-----|---------|-------------|
| Financial | currency | USD | Default currency |
| General | timezone | UTC | Default timezone |
| General | date_format | yyyy-MM-dd | Date display format |
| Claims | auto_approve_claims_under | 0 | Auto-approve threshold (0=disabled) |
| Policies | policy_renewal_reminder_days | 30 | Renewal reminder days |
| Billing | invoice_payment_terms_days | 30 | Default payment terms |
| Notifications | enable_email_notifications | true | Email notifications |
| Claims | max_claim_attachments | 10 | Max attachments per claim |

### Activating/Deactivating Tenants

- `POST /api/tenants/{id}/activate` - Re-enable a deactivated tenant
- `POST /api/tenants/{id}/deactivate` - Disable tenant access

## User Management

### Roles and Permissions

| Role | Policies | Claims | Assets | Invoices | Partners | Reports | Audit | Tenants |
|------|----------|--------|--------|----------|----------|---------|-------|---------|
| Admin | Full | Full | Full | Full | Full | Full | Full | Full |
| Manager | Full | Full | Full | Full | Full | Full | View | - |
| Insurer | Full | Full | Full | Full | Full | Full | - | - |
| Broker | CRUD | Create/View | CRUD | View | View | View | - | - |
| ClaimsProcessor | View | Full | View | - | - | View | - | - |
| Accountant | View | View | View | Full | View | Full | - | - |
| Underwriter | Full | View | View | View | View | View | - | - |
| Viewer | View | View | View | View | View | View | - | - |

## Workflow Management

### Creating Custom Workflows

1. Create a workflow definition specifying the entity type
2. Add steps defining valid transitions (from → to status)
3. Configure approval requirements per step
4. Start workflow instances for specific entities

### Approval Chains

- Steps can require multiple approvals (`approvalCount`)
- Approvers are assigned per step
- Transitions are blocked until required approvals are met

## Audit & Compliance

### Audit Trail

Every data change is automatically logged with:
- Who made the change (user email)
- What changed (entity type, ID, old/new values)
- When it happened (timestamp)
- Where it came from (IP address, request path)
- Correlation ID for request tracing

### Compliance Reports

Generate compliance reports via `GET /api/audit/compliance-report?from=...&to=...`

Reports include:
- Total audit entries in period
- Breakdown by action type (Create/Update/Delete)
- Breakdown by entity type
- Breakdown by user
- Daily activity summary
- High-risk activities (deletions, user/tenant changes)

### Exporting Audit Logs

Export filtered audit logs as CSV: `GET /api/audit/export?from=...&to=...&format=csv`

## Reporting

### Predefined Reports

| Report | Endpoint | Description |
|--------|----------|-------------|
| Policy Summary | `/api/reports/policies/summary` | Policy counts, premiums, status breakdown |
| Claims Summary | `/api/reports/claims/summary` | Claim counts, amounts, status breakdown |
| Financial | `/api/reports/financial` | Premium vs claims, loss ratio, invoicing |
| Loss Ratio | `/api/reports/loss-ratio` | Loss ratio by policy type |
| Expiring Policies | `/api/reports/expiring-policies` | Policies expiring within N days |
| Partner Performance | `/api/reports/partner-performance` | Partner activity and premium volume |

### Custom Reports

1. Create a report definition via `POST /api/reports/definitions`
2. Generate on demand via `POST /api/reports/generate/{id}`
3. Export in CSV format via `POST /api/reports/export/{id}`

## Monitoring

### Health Checks

| Endpoint | Probe Type | Checks |
|----------|-----------|--------|
| `/health` | Full | Database + Memory |
| `/health/ready` | Readiness | Database connectivity |
| `/health/live` | Liveness | Application running |

### Key Metrics to Monitor

- Response times (via `RequestTimingMiddleware` logs)
- Error rates (5xx responses)
- Database connection pool usage
- Memory consumption (health check threshold: 1GB)
- Rate limiting rejections
- Authentication failures
