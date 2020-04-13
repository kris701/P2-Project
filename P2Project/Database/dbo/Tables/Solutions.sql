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
ALTER TABLE [dbo].[Solutions]  WITH CHECK ADD  CONSTRAINT [FK_Solutions_Warnings] FOREIGN KEY([WarningID])
REFERENCES [dbo].[Warnings] ([WarningID])
GO

ALTER TABLE [dbo].[Solutions] CHECK CONSTRAINT [FK_Solutions_Warnings]