CREATE TABLE [dbo].[SensorThresholds](
	[ID] [int] NOT NULL,
	[SensorID] [int] NOT NULL,
	[SensorType] [int] NOT NULL,
	[ThresholdValue] [int] NOT NULL,
 CONSTRAINT [PK_SensorThresholds] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[SensorThresholds]  WITH CHECK ADD  CONSTRAINT [FK_SensorThresholds_SensorInfo] FOREIGN KEY([SensorID])
REFERENCES [dbo].[SensorInfo] ([SensorID])
GO

ALTER TABLE [dbo].[SensorThresholds] CHECK CONSTRAINT [FK_SensorThresholds_SensorInfo]
GO
ALTER TABLE [dbo].[SensorThresholds]  WITH CHECK ADD  CONSTRAINT [FK_SensorThresholds_SensorTypes] FOREIGN KEY([SensorType])
REFERENCES [dbo].[SensorTypes] ([SensorType])
GO

ALTER TABLE [dbo].[SensorThresholds] CHECK CONSTRAINT [FK_SensorThresholds_SensorTypes]