# InsureX Deployment Guide

## Environments

| Environment | Purpose | URL |
|-------------|---------|-----|
| Development | Local development | `http://localhost:5000` |
| Staging | Pre-production testing | `https://staging-api.insurex.com` |
| Production | Live system | `https://api.insurex.com` |

## Prerequisites

- Docker & Docker Compose
- Kubernetes cluster (for K8s deployment)
- SQL Server 2019+
- .NET 8.0 SDK (for local builds)

## Docker Deployment

### Build and Run

```bash
# Build the Docker image
docker build -t insurex-api:latest -f Dockerfile .

# Run with Docker Compose (includes SQL Server)
docker-compose up -d
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `ConnectionStrings__DefaultConnection` | SQL Server connection string | Yes |
| `JwtSettings__SecretKey` | JWT signing key (min 32 chars) | Yes |
| `JwtSettings__Issuer` | JWT issuer | Yes |
| `JwtSettings__Audience` | JWT audience | Yes |
| `ASPNETCORE_ENVIRONMENT` | Environment name | Yes |
| `Cors__AllowedOrigins__0` | Allowed CORS origin | Yes |
| `EmailSettings__SmtpServer` | SMTP server | No |
| `EmailSettings__Password` | SMTP password | No |

## Kubernetes Deployment

### 1. Create Namespace

```bash
kubectl apply -f k8s/namespace.yml
```

### 2. Configure Secrets

Edit `k8s/secret.yml` with production values, then:

```bash
kubectl apply -f k8s/secret.yml
```

### 3. Apply Configuration

```bash
kubectl apply -f k8s/configmap.yml
```

### 4. Run Database Migration

```bash
kubectl apply -f k8s/db-migration-job.yml
kubectl wait --for=condition=complete job/insurex-db-migration -n insurex --timeout=120s
```

### 5. Deploy Application

```bash
kubectl apply -f k8s/deployment.yml
kubectl apply -f k8s/service.yml
kubectl apply -f k8s/ingress.yml
kubectl apply -f k8s/hpa.yml
```

### 6. Setup Backups

```bash
kubectl apply -f k8s/backup-cronjob.yml
```

### 7. Verify Deployment

```bash
kubectl get pods -n insurex
kubectl get svc -n insurex
kubectl logs -f deployment/insurex-api -n insurex
```

### Health Checks

| Endpoint | Purpose |
|----------|---------|
| `/health` | Full health check (DB + memory) |
| `/health/ready` | Readiness probe (DB connectivity) |
| `/health/live` | Liveness probe (app is running) |

## CI/CD Pipeline

The GitHub Actions pipeline (`ci.yml` and `deploy.yml`) automates:

1. **Build** - Compile .NET solution
2. **Test** - Run unit tests with coverage
3. **Security Scan** - Check for vulnerable packages
4. **Docker Build** - Build and push container image
5. **Deploy Staging** - Deploy to staging environment
6. **Deploy Production** - Deploy to production (manual approval)

## Database Management

### Migrations

EF Core migrations run automatically on startup. For manual migration:

```bash
cd InsureX.Infrastructure
dotnet ef migrations add <MigrationName> --startup-project ../InsureX.API
dotnet ef database update --startup-project ../InsureX.API
```

### Backup Strategy

- **Automated**: Daily backups via Kubernetes CronJob at 2 AM UTC
- **Retention**: 30 days
- **Storage**: Persistent Volume Claim (50GB)

### Recovery

```bash
# Restore from backup
/opt/mssql-tools/bin/sqlcmd -S <server> -U <user> -P <password> \
  -Q "RESTORE DATABASE [InsureX] FROM DISK = N'/backups/<backup_file>.bak' WITH REPLACE"
```

## Monitoring

### Logging

- **Development**: Console + File (daily rolling)
- **Staging**: Console + File (14-day retention)
- **Production**: Console + File (30-day retention)

All logs include:
- Correlation ID for request tracing
- Tenant ID for multi-tenant debugging
- Request timing metrics

### Health Monitoring

The API exposes health check endpoints compatible with:
- Kubernetes liveness/readiness probes
- External monitoring tools (Datadog, New Relic, etc.)

### Performance Headers

- `X-Cache: HIT/MISS` - Response caching status
- `X-Correlation-ID` - Request correlation ID

## Security Checklist

- [x] JWT authentication with token rotation
- [x] Role-based authorization
- [x] Rate limiting (100 req/min)
- [x] Security headers (HSTS, CSP, X-Frame-Options)
- [x] Input validation middleware
- [x] Global exception handling (no stack traces in production)
- [x] CORS configuration
- [x] Soft delete (no permanent data loss)
- [x] Audit trail on all data changes
- [x] Tenant isolation at database level
- [ ] SSL/TLS termination (configure at ingress/load balancer)
- [ ] WAF rules (configure at cloud provider level)

## Troubleshooting

### Common Issues

**Database connection fails:**
- Verify connection string in environment variables
- Check SQL Server is running and accessible
- Ensure firewall rules allow connection

**JWT authentication fails:**
- Verify `JwtSettings__SecretKey` matches across all instances
- Check token expiration settings
- Ensure clock sync between servers

**Rate limiting too aggressive:**
- Adjust `PermitLimit` and `Window` in `Program.cs`
- Consider per-tenant rate limits

**Memory usage high:**
- Check health endpoint: `GET /health`
- Review EF Core query patterns for N+1 issues
- Consider increasing memory limits in K8s deployment
