export interface Asset {
  id: string;
  name: string;
  description?: string;
  type: AssetType;
  status: AssetStatus;
  value: number;
  ownerId: string;
  ownerName: string;
  location?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  year?: number;
  condition?: AssetCondition;
  documents?: AssetDocument[];
  images?: AssetImage[];
  policyId?: string;
  policyNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export enum AssetType {
  VEHICLE = 'VEHICLE',
  PROPERTY = 'PROPERTY',
  EQUIPMENT = 'EQUIPMENT',
  INVENTORY = 'INVENTORY',
  JEWELRY = 'JEWELRY',
  ELECTRONICS = 'ELECTRONICS',
  ART = 'ART',
  COLLECTIBLE = 'COLLECTIBLE',
  OTHER = 'OTHER'
}

export enum AssetStatus {
  ACTIVE = 'ACTIVE',
  INSURED = 'INSURED',
  PENDING = 'PENDING',
  SOLD = 'SOLD',
  DISPOSED = 'DISPOSED',
  DAMAGED = 'DAMAGED',
  LOST = 'LOST'
}

export enum AssetCondition {
  EXCELLENT = 'EXCELLENT',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
  DAMAGED = 'DAMAGED'
}

export interface AssetDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
}

export interface AssetImage {
  id: string;
  url: string;
  caption?: string;
  uploadedAt: string;
}

export interface CreateAssetData {
  name: string;
  description?: string;
  type: AssetType;
  value: number;
  ownerId?: string;
  ownerName: string;
  location?: string;
  purchaseDate?: string;
  purchasePrice?: number;
  serialNumber?: string;
  model?: string;
  manufacturer?: string;
  year?: number;
  condition?: AssetCondition;
  policyId?: string;
  notes?: string;
}

export interface UpdateAssetData extends Partial<CreateAssetData> {
  status?: AssetStatus;
}

export interface AssetFilters {
  search?: string;
  type?: AssetType;
  status?: AssetStatus;
  ownerId?: string;
  policyId?: string;
  minValue?: number;
  maxValue?: number;
}

export interface AssetStats {
  total: number;
  totalAssets: number;
  totalValue: number;
  byType: Record<AssetType, number>;
  byStatus: Record<AssetStatus, number>;
}
export interface AssetValuation {
  id: string;
  assetId: string;
  value: number;
  date: string;
  source?: string;
  notes?: string;
}

export interface Inspection {
  id: string;
  assetId: string;
  inspectorName: string;
  scheduledDate: string;
  completedDate?: string;
  status: InspectionStatus;
  result?: string;
  notes?: string;
  documents?: AssetDocument[];
}

export enum InspectionStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export interface CreateInspectionData {
  assetId: string;
  inspectorName: string;
  scheduledDate: string;
  notes?: string;
}
