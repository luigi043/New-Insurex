// src/types/index.ts
export * from './auth.types';
export * from './policy.types';
export * from './claim.types';
export * from './asset.types';
export * from './user.types';
export * from './billing.types';
export * from './partner.types';
export * from './report.types';
export * from './auth.types';
export * from './policy.types';
export * from './claim.types';
export * from './asset.types';
export * from './billing.types';
export * from './partner.types';
export * from './report.types';
// Common types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}

export interface FilterOptions {
  search?: string;
  status?: string;
  fromDate?: string;
  toDate?: string;
  [key: string]: any;
}