namespace InsureX.Domain.Enums;

public enum InvestigationNoteType
{
    General = 0,
    FieldInspection = 1,
    WitnessStatement = 2,
    ExpertAssessment = 3,
    DocumentReview = 4,
    FraudIndicator = 5,
    MedicalReport = 6,
    PoliceReport = 7,
    ThirdPartyCorrespondence = 8,
    InternalReview = 9
}

public enum InvestigationPriority
{
    Low = 0,
    Normal = 1,
    High = 2,
    Critical = 3
}
