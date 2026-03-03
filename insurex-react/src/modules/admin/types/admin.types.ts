export interface TenantSettings {
  companyName: string;
  defaultCurrency: string;
  timeZone: string;
  dateFormat: string;
  defaultPolicyTerm: number;
  gracePeriodDays: number;
  notifications: {
    emailEnabled: boolean;
    policyExpiryAlerts: boolean;
    paymentReminders: boolean;
    claimUpdates: boolean;
  };
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: number;
  userName: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
}

export interface AuditLogFilter {
  startDate?: string;
  endDate?: string;
  userId?: number;
  action?: string;
  entityType?: string;
}

export interface SystemHealth {
  status: 'Healthy' | 'Degraded' | 'Unhealthy';
  timestamp: string;
  checks: {
    database: { status: 'Healthy' | 'Unhealthy'; responseTime: number };
    api: { status: 'Healthy' | 'Unhealthy'; responseTime: number };
    storage: { status: 'Healthy' | 'Unhealthy'; responseTime: number };
  };
}

export interface BackupInfo {
  id: string;
  timestamp: string;
  size: number;
  status: 'InProgress' | 'Completed' | 'Failed';
  type: 'Automatic' | 'Manual';
}

export interface IntegrationConfig {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Inactive' | 'Error';
  config: Record<string, any>;
  lastSyncAt?: string;
}
