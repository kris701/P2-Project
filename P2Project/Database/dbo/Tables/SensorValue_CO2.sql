CREATE TABLE [dbo].[SensorValue_CO2] (
    [ID]          INT      IDENTITY (1, 1) NOT NULL,
    [SensorID]    INT      NOT NULL,
    [Timestamp]   DATETIME DEFAULT (getdate()) NOT NULL,
    [SensorValue] INT      NOT NULL,
    CONSTRAINT [PK_SensorValue_CO2] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_SensorValue_CO2_SensorInfo] FOREIGN KEY ([SensorID]) REFERENCES [dbo].[SensorInfo] ([SensorID])
);

