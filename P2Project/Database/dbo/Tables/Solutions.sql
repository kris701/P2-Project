CREATE TABLE [dbo].[Solutions] (
    [SolutionID]      INT           IDENTITY (-1, 1) NOT NULL,
    [WarningID]       INT           NOT NULL,
    [WarningPriority] INT           NOT NULL,
    [Message]         NVARCHAR (50) NULL,
    CONSTRAINT [PK_Solutions] PRIMARY KEY CLUSTERED ([SolutionID] ASC),
    CONSTRAINT [FK_Solutions_Warnings] FOREIGN KEY ([WarningID]) REFERENCES [dbo].[Warnings] ([WarningID])
);

