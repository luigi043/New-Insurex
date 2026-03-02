-- InsureX Database Upgrade Script
-- Run via: dotnet ef database update  OR paste into SSMS

-- ── Claims Table ─────────────────────────────────────────────────────────────
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Claims')
BEGIN
    CREATE TABLE [dbo].[Claims] (
        [Id]               INT            IDENTITY(1,1) NOT NULL,
        [ClaimNumber]      NVARCHAR(50)   NOT NULL,
        [PolicyId]         INT            NOT NULL,
        [DateOfLoss]       DATETIME2      NOT NULL,
        [DateReported]     DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
        [Status]           INT            NOT NULL DEFAULT 0,
        [Description]      NVARCHAR(MAX)  NOT NULL DEFAULT '',
        [ClaimedAmount]    DECIMAL(18,2)  NOT NULL DEFAULT 0,
        [ApprovedAmount]   DECIMAL(18,2)  NULL,
        [PaidAmount]       DECIMAL(18,2)  NULL,
        [ClaimantName]     NVARCHAR(200)  NOT NULL DEFAULT '',
        [ClaimantContact]  NVARCHAR(200)  NOT NULL DEFAULT '',
        [AssessorNotes]    NVARCHAR(MAX)  NULL,
        [RejectionReason]  NVARCHAR(MAX)  NULL,
        [AssessedDate]     DATETIME2      NULL,
        [ApprovedDate]     DATETIME2      NULL,
        [PaidDate]         DATETIME2      NULL,
        [CreatedBy]        NVARCHAR(256)  NOT NULL DEFAULT '',
        [CreatedAt]        DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedBy]        NVARCHAR(256)  NULL,
        [UpdatedAt]        DATETIME2      NULL,
        CONSTRAINT [PK_Claims] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Claims_Policies] FOREIGN KEY ([PolicyId])
            REFERENCES [dbo].[Policies] ([Id]) ON DELETE CASCADE
    );

    CREATE UNIQUE INDEX [IX_Claims_ClaimNumber] ON [dbo].[Claims] ([ClaimNumber]);
    CREATE INDEX [IX_Claims_PolicyId] ON [dbo].[Claims] ([PolicyId]);
    CREATE INDEX [IX_Claims_Status] ON [dbo].[Claims] ([Status]);
    PRINT 'Created table: Claims';
END
GO

-- ── ClaimDocuments Table ──────────────────────────────────────────────────────
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ClaimDocuments')
BEGIN
    CREATE TABLE [dbo].[ClaimDocuments] (
        [Id]          INT            IDENTITY(1,1) NOT NULL,
        [ClaimId]     INT            NOT NULL,
        [FileName]    NVARCHAR(500)  NOT NULL,
        [FilePath]    NVARCHAR(1000) NOT NULL,
        [ContentType] NVARCHAR(100)  NOT NULL,
        [FileSize]    BIGINT         NOT NULL DEFAULT 0,
        [UploadedAt]  DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT [PK_ClaimDocuments] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_ClaimDocuments_Claims] FOREIGN KEY ([ClaimId])
            REFERENCES [dbo].[Claims] ([Id]) ON DELETE CASCADE
    );
    PRINT 'Created table: ClaimDocuments';
END
GO

-- ── Assets Table ──────────────────────────────────────────────────────────────
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Assets')
BEGIN
    CREATE TABLE [dbo].[Assets] (
        [Id]               INT            IDENTITY(1,1) NOT NULL,
        [PolicyId]         INT            NOT NULL,
        [AssetType]        INT            NOT NULL,
        [Description]      NVARCHAR(500)  NOT NULL DEFAULT '',
        [InsuredValue]     DECIMAL(18,2)  NOT NULL DEFAULT 0,
        [ExtendedDataJson] NVARCHAR(MAX)  NULL,
        [IsActive]         BIT            NOT NULL DEFAULT 1,
        [CreatedAt]        DATETIME2      NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt]        DATETIME2      NULL,
        CONSTRAINT [PK_Assets] PRIMARY KEY ([Id]),
        CONSTRAINT [FK_Assets_Policies] FOREIGN KEY ([PolicyId])
            REFERENCES [dbo].[Policies] ([Id]) ON DELETE CASCADE
    );

    CREATE INDEX [IX_Assets_PolicyId] ON [dbo].[Assets] ([PolicyId]);
    CREATE INDEX [IX_Assets_AssetType] ON [dbo].[Assets] ([AssetType]);
    PRINT 'Created table: Assets';
END
GO

-- ── Auto-generate ClaimNumber trigger ────────────────────────────────────────
IF NOT EXISTS (SELECT * FROM sys.triggers WHERE name = 'TR_Claims_ClaimNumber')
BEGIN
    EXEC('
    CREATE TRIGGER [TR_Claims_ClaimNumber]
    ON [dbo].[Claims]
    AFTER INSERT
    AS
    BEGIN
        UPDATE c
        SET ClaimNumber = ''CLM-'' + FORMAT(GETUTCDATE(), ''yyyyMM'') + ''-'' + RIGHT(''00000'' + CAST(c.Id AS VARCHAR), 5)
        FROM [dbo].[Claims] c
        INNER JOIN inserted i ON c.Id = i.Id
        WHERE c.ClaimNumber = ''''
    END
    ');
    PRINT 'Created trigger: TR_Claims_ClaimNumber';
END
GO

PRINT 'Migration complete.';
GO
