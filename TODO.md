# Build Fix TODO

## Controllers - Add `using InsureX.Application.DTOs.Filters;`
- [x] Controllers/AssetsController.cs
- [x] Controllers/PoliciesController.cs
- [x] Controllers/ClaimsController.cs
- [x] Controllers/InvoicesController.cs
- [x] Controllers/PartnersController.cs

## Features - Fix domain model mismatches
- [ ] Features/Assets/CreateAsset/CreateAssetCommand.cs
- [ ] Features/Assets/GetAssets/GetAssetsQuery.cs
- [ ] Features/Claims/ProcessClaim/ProcessClaimCommand.cs
- [ ] Features/Claims/CreateClaim/CreateClaimCommand.cs
- [ ] Features/Auth/Register/RegisterCommand.cs

## Verify
- [ ] dotnet build → 0 errors
- [ ] dotnet run
