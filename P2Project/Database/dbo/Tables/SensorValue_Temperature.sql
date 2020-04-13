CREATE TABLE [dbo].[SensorValue_Temperature] (
    [ID]          INT      IDENTITY (1, 1) NOT NULL,
    [SensorID]    INT      NOT NULL,
    [Timestamp]   DATETIME DEFAULT (getdate()) NOT NULL,
    [SensorValue] INT      NOT NULL,
    CONSTRAINT [PK_SensorValue_Temperature] PRIMARY KEY CLUSTERED ([ID] ASC),
    CONSTRAINT [FK_SensorValue_Temperature_SensorInfo] FOREIGN KEY ([SensorID]) REFERENCES [dbo].[SensorInfo] ([SensorID])
);

