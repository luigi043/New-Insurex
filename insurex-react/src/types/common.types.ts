/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
  statusCode?: number;
}

/**
 * Pagination request parameters
 */
export interface PaginationRequest {
  page: number;
  pageSize: number;
  sortBy?: string;
  sortDescending?: boolean;
}

/**
 * Paged result wrapper
 */
export interface PagedResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

/**
 * Sort direction
 */
export enum SortDirection {
  Ascending = 'asc',
  Descending = 'desc'
}

/**
 * Sort option
 */
export interface SortOption {
  field: string;
  direction: SortDirection;
}

/**
 * Filter operator
 */
export enum FilterOperator {
  Equals = 'eq',
  NotEquals = 'ne',
  GreaterThan = 'gt',
  GreaterThanOrEqual = 'gte',
  LessThan = 'lt',
  LessThanOrEqual = 'lte',
  Contains = 'contains',
  StartsWith = 'startswith',
  EndsWith = 'endswith',
  In = 'in',
  Between = 'between'
}

/**
 * Filter criteria
 */
export interface FilterCriteria {
  field: string;
  operator: FilterOperator;
  value: any;
  value2?: any; // For between operator
}

/**
 * Audit information
 */
export interface AuditInfo {
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

/**
 * Address information
 */
export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/**
 * Contact information
 */
export interface ContactInfo {
  email: string;
  phone?: string;
  mobile?: string;
  fax?: string;
}

/**
 * Select option for dropdowns
 */
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

/**
 * File upload info
 */
export interface FileInfo {
  id: string;
  name: string;
  size: number;
  contentType: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

/**
 * Notification type
 */
export enum NotificationType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info'
}

/**
 * Notification
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

/**
 * Menu item
 */
export interface MenuItem {
  id: string;
  label: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
  permissions?: string[];
  badge?: number;
  external?: boolean;
}

/**
 * Tab item
 */
export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  badge?: number;
}

/**
 * Chart data point
 */
export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

/**
 * Time series data point
 */
export interface TimeSeriesDataPoint {
  date: string;
  value: number;
}

/**
 * Dashboard widget
 */
export interface DashboardWidget {
  id: string;
  type: 'stat' | 'chart' | 'list' | 'table';
  title: string;
  data: any;
  config?: Record<string, any>;
}

/**
 * Search result
 */
export interface SearchResult<T> {
  item: T;
  score: number;
  highlights?: Record<string, string[]>;
}

/**
 * Export format
 */
export enum ExportFormat {
  CSV = 'csv',
  Excel = 'xlsx',
  PDF = 'pdf',
  JSON = 'json'
}

/**
 * Report parameter
 */
export interface ReportParameter {
  name: string;
  type: 'string' | 'number' | 'date' | 'boolean' | 'select';
  label: string;
  required?: boolean;
  defaultValue?: any;
  options?: SelectOption[];
}

/**
 * Report definition
 */
export interface ReportDefinition {
  id: string;
  name: string;
  description?: string;
  category: string;
  parameters: ReportParameter[];
  supportedFormats: ExportFormat[];
}

/**
 * Activity log entry
 */
export interface ActivityLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: Record<string, any>;
  ipAddress?: string;
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
  statusCode: number;
}

/**
 * Id Name pair (for lookups)
 */
export interface IdNamePair {
  id: number;
  name: string;
}

/**
 * Code Name pair (for enums)
 */
export interface CodeNamePair {
  code: string;
  name: string;
}
