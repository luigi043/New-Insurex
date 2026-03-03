// Override System.Security.Claims.Claim globally in this project
global using Claim = InsureX.Domain.Entities.Claim;
global using ClaimStatus = InsureX.Domain.Enums.ClaimStatus;
global using ClaimType = InsureX.Domain.Enums.ClaimType;
