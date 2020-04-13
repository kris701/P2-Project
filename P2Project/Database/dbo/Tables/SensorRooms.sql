CREATE TABLE [dbo].[SensorRooms] (
    [RoomID]   INT           IDENTITY (-1, 1) NOT NULL,
    [RoomName] NVARCHAR (50) NOT NULL,
    CONSTRAINT [PK_SensorRooms] PRIMARY KEY CLUSTERED ([RoomID] ASC)
);

