export enum AssetType {
  Vehicle = 'Vehicle',
  Property = 'Property',
  Watercraft = 'Watercraft',
  Aviation = 'Aviation',
  StockInventory = 'StockInventory',
  AccountsReceivable = 'AccountsReceivable',
  Machinery = 'Machinery',
  PlantEquipment = 'PlantEquipment',
  BusinessInterruption = 'BusinessInterruption',
  KeymanInsurance = 'KeymanInsurance',
  ElectronicEquipment = 'ElectronicEquipment'
}

export enum AssetStatus {
  Active = 'Active',
  Inactive = 'Inactive',
  UnderMaintenance = 'UnderMaintenance',
  Disposed = 'Disposed',
  Claimed = 'Claimed'
}

export enum VehicleType {
  Car = 'Car',
  Truck = 'Truck',
  Motorcycle = 'Motorcycle',
  Bus = 'Bus',
  Van = 'Van',
  Trailer = 'Trailer',
  Other = 'Other'
}

export enum FuelType {
  Petrol = 'Petrol',
  Diesel = 'Diesel',
  Electric = 'Electric',
  Hybrid = 'Hybrid',
  LPG = 'LPG',
  Other = 'Other'
}

export interface CreateAssetRequest {
  assetType: AssetType;
  policyId: string;
  name: string;
  description?: string;
  value: number;
  location: string;
  acquisitionDate: string;
  // Vehicle specific
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleYear?: number;
  vehicleRegistrationNumber?: string;
  vehicleVinNumber?: string;
  vehicleType?: VehicleType;
  fuelType?: FuelType;
  // Add other asset type specific fields as needed
}

export interface AssetResponse {
  id: string;
  name: string;
  type: AssetType;
  value: number;
  status: AssetStatus;
  createdAt: string;
}