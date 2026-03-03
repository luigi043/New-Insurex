export interface LegacyEmployeeForm {
  lstEmployee?: string[];
  UpdatePanel1?: any;
  pnlExists?: boolean;
  ddlCountries?: Array<{ value: string; label: string }>;
  txtPLainTextGen?: string;
  Literal1?: string;
  plInsurerTotals?: any;
  pnlPolicyList?: any;
  form1?: any;
  ErrorMessage?: string;
  successMessage?: string;
  txtEmail_Address?: string;
  pnlSuccess?: boolean;
  userName?: string;
  EditPartnerUserUC?: any;
  PartnerAddPartnerUser1?: any;
  ddlAsset_Financier?: Array<{ value: string; label: string }>;
  ddlPolicy_Type?: Array<{ value: string; label: string }>;
  ddlFunction?: Array<{ value: string; label: string }>;
  pnlStep1?: any;
  ddlAsset_Type?: Array<{ value: string; label: string }>;
  hdPartnerID?: string;
  hdAssetId?: string;
  pnlSaveButtons?: any;
  txtChargeTitle?: string;
  hdPolicyId?: string;
  hdAlnmlId?: string;
  AllAssets?: any;
  ddlReport?: Array<{ value: string; label: string }>;
  ReinstatedCover?: any;
  UninsuredAssets1?: any;
}

export interface LegacyReportData {
  financerReports?: {
    allAssets?: any[];
    reinstatedCover?: any[];
    uninsuredAssets?: any[];
  };
  insurerReports?: {
    uninsuredAssets?: any[];
  };
}