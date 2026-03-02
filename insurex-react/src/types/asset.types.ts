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

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  value: number;
  status: AssetStatus;
  policyId: string;
  location: string;
  acquisitionDate: string;
}
