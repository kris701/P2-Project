CREATE TABLE [dbo].[SensorTypes] (
    [SensorType] INT           IDENTITY (-1, 1) NOT NULL,
    [TypeName]   NVARCHAR (50) NOT NULL,
    CONSTRAINT [PK_SensorTypes] PRIMARY KEY CLUSTERED ([SensorType] ASC)
);

