CREATE TABLE [dbo].[Warnings] (
    [WarningID]  INT           IDENTITY (-1, 1) NOT NULL,
    [SensorType] INT           NOT NULL,
    [Message]    NVARCHAR (50) NOT NULL,
    CONSTRAINT [PK_Warnings] PRIMARY KEY CLUSTERED ([WarningID] ASC),
    CONSTRAINT [FK_Warnings_SensorTypes] FOREIGN KEY ([SensorType]) REFERENCES [dbo].[SensorTypes] ([SensorType])
);

