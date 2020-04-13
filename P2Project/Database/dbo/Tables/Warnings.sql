CREATE TABLE [dbo].[Warnings](
	[WarningID] [int] NOT NULL,
	[SensorType] [int] NOT NULL,
	[Message] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Warnings] PRIMARY KEY CLUSTERED 
(
	[WarningID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Warnings]  WITH CHECK ADD  CONSTRAINT [FK_Warnings_SensorTypes] FOREIGN KEY([SensorType])
REFERENCES [dbo].[SensorTypes] ([SensorType])
GO

ALTER TABLE [dbo].[Warnings] CHECK CONSTRAINT [FK_Warnings_SensorTypes]