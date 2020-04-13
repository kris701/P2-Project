CREATE TABLE [dbo].[SensorValue_CO2](
	[ID] [int] NOT NULL,
	[SensorID] [int] NOT NULL,
	[Timestamp] [datetime] NOT NULL,
	[SensorValue] [int] NOT NULL,
 CONSTRAINT [PK_SensorValue_CO2] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[SensorValue_CO2]  WITH CHECK ADD  CONSTRAINT [FK_SensorValue_CO2_SensorInfo] FOREIGN KEY([SensorID])
REFERENCES [dbo].[SensorInfo] ([SensorID])
GO

ALTER TABLE [dbo].[SensorValue_CO2] CHECK CONSTRAINT [FK_SensorValue_CO2_SensorInfo]
GO
ALTER TABLE [dbo].[SensorValue_CO2] ADD  DEFAULT (getdate()) FOR [Timestamp]