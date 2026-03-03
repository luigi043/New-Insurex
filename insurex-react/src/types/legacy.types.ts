// src/types/legacy.types.ts
// Proper TypeScript interfaces for legacy form data

export interface LegacyFormControls {
  // Dropdowns
  ddlCountries?: Array<{ value: string; label: string }>;
  ddlAsset_Financier?: Array<{ value: string; label: string }>;
  ddlPolicy_Type?: Array<{ value: string; label: string }>;
  ddlFunction?: Array<{ value: string; label: string }>;
  ddlAsset_Type?: Array<{ value: string; label: string }>;
  ddlReport?: Array<{ value: string; label: string }>;
  
  // Text inputs
  txtPLainTextGen?: string;
  txtEmail_Address?: string;
  userName?: string;
  txtChargeTitle?: string;
  
  // Lists
  lstEmployee?: string[];
  
  // Panels and containers
  pnlExists?: boolean;
  plInsurerTotals?: any;
  pnlPolicyList?: any;
  pnlSuccess?: boolean;
  pnlStep1?: any;
  pnlSaveButtons?: any;
  
  // Hidden fields
  hdPartnerID?: string;
  hdAssetId?: string;
  hdPolicyId?: string;
  hdAlnmlId?: string;
  
  // Messages and literals
  ErrorMessage?: string;
  successMessage?: string;
  Literal1?: string;
  
  // Update panels
  UpdatePanel1?: any;
  
  // Forms
  form1?: any;
  
  // User controls
  EditPartnerUserUC?: any;
  PartnerAddPartnerUser1?: any;
  AllAssets?: any;
  ReinstatedCover?: any;
  UninsuredAssets1?: any;
}

export interface LegacyReportConfig {
  financerReports?: {
    allAssets?: boolean;
    reinstatedCover?: boolean;
    uninsuredAssets?: boolean;
  };
  insurerReports?: {
    uninsuredAssets?: boolean;
  };
}

export interface LegacyFormData {
  controls: LegacyFormControls;
  reports: LegacyReportConfig;
  metadata?: {
    formName?: string;
    lastUpdated?: string;
    userRole?: string;
  };
}