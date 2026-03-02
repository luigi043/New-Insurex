export interface Asset {
  id: string;
  assetId: string;
  name: string;
  type: AssetType;
  description?: string;
  status: AssetStatus;
  ownerId: string;
  ownerName: string;
  value: number;
  currency: string;
  purchaseDate?: string;
  purchasePrice?: number;
  location?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  registrationNumber?: string;
  year?: number;
  condition?: AssetCondition;
  dimensions?: AssetDimensions;
  images?: AssetImage[];
  documents?: AssetDocument[];
  policies?: AssetPolicy[];
  customFields?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export type AssetType =
  | 'vehicle'
  | 'property'
  | 'equipment'
  | 'machinery'
  | 'inventory'
  | 'electronics'
  | 'furniture'
  | 'art'
  | 'jewelry'
  | 'livestock'
  | 'crop'
  | 'vessel'
  | 'aircraft'
  | 'other';

export type AssetStatus = 'active' | 'inactive' | 'sold' | 'disposed' | 'under_maintenance';

export type AssetCondition = 'excellent' | 'good' | 'fair' | 'poor';

export interface AssetDimensions {
  length?: number;
  width?: number;
  height?: number;
  weight?: number;
  area?: number;
  volume?: number;
  unit: string;
}

export interface AssetImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  caption?: string;
  isPrimary: boolean;
  uploadedAt: string;
}

export interface AssetDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface AssetPolicy {
  id: string;
  policyId: string;
  policyNumber: string;
  coverageAmount: number;
  startDate: string;
  endDate: string;
}

export interface AssetFilter {
  type?: AssetType;
  status?: AssetStatus;
  search?: string;
  ownerId?: string;
  minValue?: number;
  maxValue?: number;
  location?: string;
}

export interface CreateAssetData {
  name: string;
  type: AssetType;
  description?: string;
  ownerId: string;
  value: number;
  currency?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  location?: string;
  manufacturer?: string;
  model?: string;
  serialNumber?: string;
  registrationNumber?: string;
  year?: number;
  condition?: AssetCondition;
  dimensions?: AssetDimensions;
  customFields?: Record<string, any>;
}

export interface UpdateAssetData extends Partial<CreateAssetData> {
  status?: AssetStatus;
}

export interface AssetStats {
  totalAssets: number;
  totalValue: number;
  assetsByType: Record<AssetType, number>;
  assetsByStatus: Record<AssetStatus, number>;
}

export interface AssetValuation {
  id: string;
  assetId: string;
  valuationDate: string;
  value: number;
  currency: string;
  method: string;
  appraiser?: string;
  notes?: string;
}

export interface AssetMaintenance {
  id: string;
  assetId: string;
  maintenanceDate: string;
  type: 'routine' | 'repair' | 'inspection' | 'upgrade';
  description: string;
  cost?: number;
  performedBy?: string;
  nextDueDate?: string;
  documents?: string[];
}
