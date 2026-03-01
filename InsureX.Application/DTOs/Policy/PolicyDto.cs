using System;
using System.Collections.Generic;

namespace InsureX.Application.DTOs.Policy;

public class PolicyDto
{
    public Guid Id { get; set; }
    public string PolicyNumber { get; set; } = string.Empty;
    public string PolicyType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Premium { get; set; }
    public decimal InsuredValue { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public string PartnerName { get; set; } = string.Empty;
    public string InsurerName { get; set; } = string.Empty;
    public int AssetCount { get; set; }
    public int ClaimCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CreatePolicyDto
{
    public string PolicyType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Premium { get; set; }
    public decimal InsuredValue { get; set; }
    public Guid PartnerId { get; set; }
    public Guid? InsurerId { get; set; }
    public Guid? FinancerId { get; set; }
}

public class UpdatePolicyDto
{
    public Guid Id { get; set; }
    public string PolicyType { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public decimal Premium { get; set; }
    public decimal InsuredValue { get; set; }
    public string Status { get; set; } = string.Empty;
    public string PaymentStatus { get; set; } = string.Empty;
    public Guid? InsurerId { get; set; }
    public Guid? FinancerId { get; set; }
}

public class PolicySearchDto
{
    public string? SearchTerm { get; set; }
    public string? Status { get; set; }
    public string? PolicyType { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
    public Guid? PartnerId { get; set; }
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 10;
}
