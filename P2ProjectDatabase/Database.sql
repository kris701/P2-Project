USE [DB_A4BDCF_p2projekt]
GO
/****** Object:  Table [dbo].[CO2]    Script Date: 25-03-2020 11:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CO2](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[SensorID] [int] NOT NULL,
	[SensorValue] [float] NULL,
	[Timestamp] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[RH]    Script Date: 25-03-2020 11:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[RH](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[SensorID] [int] NOT NULL,
	[SensorValue] [float] NULL,
	[Timestamp] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SensorData]    Script Date: 25-03-2020 11:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SensorData](
	[SensorID] [int] NOT NULL,
	[RoomName] [nvarchar](50) NULL,
 CONSTRAINT [PK_SensorData] PRIMARY KEY CLUSTERED 
(
	[SensorID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SensorInfo]    Script Date: 25-03-2020 11:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SensorInfo](
	[SensorID] [int] NOT NULL,
	[RoomID] [int] NOT NULL,
 CONSTRAINT [PK_SensorInfo] PRIMARY KEY CLUSTERED 
(
	[SensorID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SensorRooms]    Script Date: 25-03-2020 11:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SensorRooms](
	[RoomID] [int] NOT NULL,
	[RoomName] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_SensorRooms] PRIMARY KEY CLUSTERED 
(
	[RoomID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SensorThresholds]    Script Date: 25-03-2020 11:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
/****** Object:  Table [dbo].[SensorTypes]    Script Date: 25-03-2020 11:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SensorTypes](
	[SensorType] [int] NOT NULL,
	[TypeName] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_SensorTypes] PRIMARY KEY CLUSTERED 
(
	[SensorType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SensorValue_CO2]    Script Date: 25-03-2020 11:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
/****** Object:  Table [dbo].[SensorValue_RH]    Script Date: 25-03-2020 11:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SensorValue_RH](
	[ID] [int] NOT NULL,
	[SensorID] [int] NOT NULL,
	[Timestamp] [datetime] NOT NULL,
	[SensorValue] [int] NOT NULL,
 CONSTRAINT [PK_SensorValue_RH] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SensorValue_Temperature]    Script Date: 25-03-2020 11:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SensorValue_Temperature](
	[ID] [int] NOT NULL,
	[SensorID] [int] NOT NULL,
	[Timestamp] [datetime] NOT NULL,
	[SensorValue] [int] NOT NULL,
 CONSTRAINT [PK_SensorValue_Temperature] PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Solutions]    Script Date: 25-03-2020 11:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Solutions](
	[SolutionID] [int] NOT NULL,
	[WarningID] [int] NOT NULL,
	[WarningPriority] [int] NOT NULL,
	[Message] [nvarchar](50) NOT NULL,
 CONSTRAINT [PK_Solutions] PRIMARY KEY CLUSTERED 
(
	[SolutionID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Temperature]    Script Date: 25-03-2020 11:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Temperature](
	[ID] [int] IDENTITY(1,1) NOT NULL,
	[SensorID] [int] NOT NULL,
	[SensorValue] [float] NULL,
	[Timestamp] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[ID] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Warnings]    Script Date: 25-03-2020 11:53:07 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
ALTER TABLE [dbo].[CO2] ADD  DEFAULT (getdate()) FOR [Timestamp]
GO
ALTER TABLE [dbo].[RH] ADD  DEFAULT (getdate()) FOR [Timestamp]
GO
ALTER TABLE [dbo].[SensorValue_CO2] ADD  DEFAULT (getdate()) FOR [Timestamp]
GO
ALTER TABLE [dbo].[SensorValue_RH] ADD  DEFAULT (getdate()) FOR [Timestamp]
GO
ALTER TABLE [dbo].[SensorValue_Temperature] ADD  DEFAULT (getdate()) FOR [Timestamp]
GO
ALTER TABLE [dbo].[Temperature] ADD  DEFAULT (getdate()) FOR [Timestamp]
GO
ALTER TABLE [dbo].[CO2]  WITH CHECK ADD  CONSTRAINT [FK_SensorData_CO2] FOREIGN KEY([SensorID])
REFERENCES [dbo].[SensorData] ([SensorID])
GO
ALTER TABLE [dbo].[CO2] CHECK CONSTRAINT [FK_SensorData_CO2]
GO
ALTER TABLE [dbo].[RH]  WITH CHECK ADD  CONSTRAINT [FK_SensorData_RH] FOREIGN KEY([SensorID])
REFERENCES [dbo].[SensorData] ([SensorID])
GO
ALTER TABLE [dbo].[RH] CHECK CONSTRAINT [FK_SensorData_RH]
GO
ALTER TABLE [dbo].[SensorInfo]  WITH CHECK ADD  CONSTRAINT [FK_SensorInfo_SensorRooms] FOREIGN KEY([RoomID])
REFERENCES [dbo].[SensorRooms] ([RoomID])
GO
ALTER TABLE [dbo].[SensorInfo] CHECK CONSTRAINT [FK_SensorInfo_SensorRooms]
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
GO
ALTER TABLE [dbo].[SensorValue_CO2]  WITH CHECK ADD  CONSTRAINT [FK_SensorValue_CO2_SensorInfo] FOREIGN KEY([SensorID])
REFERENCES [dbo].[SensorInfo] ([SensorID])
GO
ALTER TABLE [dbo].[SensorValue_CO2] CHECK CONSTRAINT [FK_SensorValue_CO2_SensorInfo]
GO
ALTER TABLE [dbo].[SensorValue_RH]  WITH CHECK ADD  CONSTRAINT [FK_SensorValue_RH_SensorInfo] FOREIGN KEY([SensorID])
REFERENCES [dbo].[SensorInfo] ([SensorID])
GO
ALTER TABLE [dbo].[SensorValue_RH] CHECK CONSTRAINT [FK_SensorValue_RH_SensorInfo]
GO
ALTER TABLE [dbo].[SensorValue_Temperature]  WITH CHECK ADD  CONSTRAINT [FK_SensorValue_Temperature_SensorInfo] FOREIGN KEY([SensorID])
REFERENCES [dbo].[SensorInfo] ([SensorID])
GO
ALTER TABLE [dbo].[SensorValue_Temperature] CHECK CONSTRAINT [FK_SensorValue_Temperature_SensorInfo]
GO
ALTER TABLE [dbo].[Solutions]  WITH CHECK ADD  CONSTRAINT [FK_Solutions_Warnings] FOREIGN KEY([WarningID])
REFERENCES [dbo].[Warnings] ([WarningID])
GO
ALTER TABLE [dbo].[Solutions] CHECK CONSTRAINT [FK_Solutions_Warnings]
GO
ALTER TABLE [dbo].[Temperature]  WITH CHECK ADD  CONSTRAINT [FK_SensorData_Temperature] FOREIGN KEY([SensorID])
REFERENCES [dbo].[SensorData] ([SensorID])
GO
ALTER TABLE [dbo].[Temperature] CHECK CONSTRAINT [FK_SensorData_Temperature]
GO
ALTER TABLE [dbo].[Warnings]  WITH CHECK ADD  CONSTRAINT [FK_Warnings_SensorTypes] FOREIGN KEY([SensorType])
REFERENCES [dbo].[SensorTypes] ([SensorType])
GO
ALTER TABLE [dbo].[Warnings] CHECK CONSTRAINT [FK_Warnings_SensorTypes]
GO
