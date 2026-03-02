// Asset Types
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

// Claim Types
export enum ClaimStatus {
  Submitted = 'Submitted',
  UnderReview = 'UnderReview',
  AdditionalInfoRequired = 'AdditionalInfoRequired',
  Approved = 'Approved',
  Rejected = 'Rejected',
  Paid = 'Paid',
  Closed = 'Closed',
  Withdrawn = 'Withdrawn'
}

// User Types
export enum UserRole {
  Client = 'Client',
  Financer = 'Financer',
  Insurer = 'Insurer',
  Admin = 'Admin',
  Broker = 'Broker'
}