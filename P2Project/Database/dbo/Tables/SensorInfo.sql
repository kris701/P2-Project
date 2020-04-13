CREATE TABLE [dbo].[SensorInfo] (
    [SensorID] INT IDENTITY (0, 1) NOT NULL,
    [RoomID]   INT NOT NULL,
    CONSTRAINT [PK_SensorInfo] PRIMARY KEY CLUSTERED ([SensorID] ASC),
    CONSTRAINT [FK_SensorInfo_SensorRooms] FOREIGN KEY ([RoomID]) REFERENCES [dbo].[SensorRooms] ([RoomID])
);

