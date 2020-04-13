CREATE TABLE [dbo].[SensorThresholds] (
    [ID]             INT IDENTITY (1, 1) NOT NULL,
    [SensorID]       INT NOT NULL,
    [SensorType]     INT NOT NULL,
    [ThresholdValue] INT NOT NULL,
    CONSTRAINT [PK_SensorThresholds] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_SensorThresholds_SensorInfo] FOREIGN KEY ([SensorID]) REFERENCES [dbo].[SensorInfo] ([SensorID]),
    CONSTRAINT [FK_SensorThresholds_SensorTypes] FOREIGN KEY ([SensorType]) REFERENCES [dbo].[SensorTypes] ([SensorType])
);

