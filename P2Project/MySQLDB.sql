-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: dat2c1_03
-- ------------------------------------------------------
-- Server version	5.7.29-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `SensorInfo`
--

DROP TABLE IF EXISTS `SensorInfo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SensorInfo` (
  `SensorID` int(11) NOT NULL,
  `RoomID` int(11) NOT NULL,
  PRIMARY KEY (`SensorID`),
  KEY `FK_RoomID_RoomID_idx` (`RoomID`),
  CONSTRAINT `FK_RoomID_RoomID` FOREIGN KEY (`RoomID`) REFERENCES `SensorRooms` (`RoomID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SensorInfo`
--

LOCK TABLES `SensorInfo` WRITE;
/*!40000 ALTER TABLE `SensorInfo` DISABLE KEYS */;
INSERT INTO `SensorInfo` VALUES (0,0),(1,0),(2,1),(3,1);
/*!40000 ALTER TABLE `SensorInfo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SensorRooms`
--

DROP TABLE IF EXISTS `SensorRooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SensorRooms` (
  `RoomID` int(11) NOT NULL,
  `RoomName` varchar(50) NOT NULL,
  PRIMARY KEY (`RoomID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SensorRooms`
--

LOCK TABLES `SensorRooms` WRITE;
/*!40000 ALTER TABLE `SensorRooms` DISABLE KEYS */;
INSERT INTO `SensorRooms` VALUES (0,'testa'),(1,'testb');
/*!40000 ALTER TABLE `SensorRooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SensorThresholds`
--

DROP TABLE IF EXISTS `SensorThresholds`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SensorThresholds` (
  `ID` int(11) NOT NULL,
  `SensorID` int(11) NOT NULL,
  `SensorType` int(11) NOT NULL,
  `ThresholdValue` int(11) NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `FK_SensorID_SensorID_idx` (`SensorID`),
  KEY `FK_SensorType_SensorType_idx` (`SensorType`),
  CONSTRAINT `FK_SensorID_SensorID` FOREIGN KEY (`SensorID`) REFERENCES `SensorInfo` (`SensorID`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `FK_SensorType_SensorType` FOREIGN KEY (`SensorType`) REFERENCES `SensorTypes` (`SensorType`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SensorThresholds`
--

LOCK TABLES `SensorThresholds` WRITE;
/*!40000 ALTER TABLE `SensorThresholds` DISABLE KEYS */;
/*!40000 ALTER TABLE `SensorThresholds` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SensorTypes`
--

DROP TABLE IF EXISTS `SensorTypes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SensorTypes` (
  `SensorType` int(11) NOT NULL,
  `TypeName` varchar(45) NOT NULL,
  PRIMARY KEY (`SensorType`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SensorTypes`
--

LOCK TABLES `SensorTypes` WRITE;
/*!40000 ALTER TABLE `SensorTypes` DISABLE KEYS */;
/*!40000 ALTER TABLE `SensorTypes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SensorValue_CO2`
--

DROP TABLE IF EXISTS `SensorValue_CO2`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SensorValue_CO2` (
  `ValueID` int(11) NOT NULL,
  `SensorID` int(11) NOT NULL,
  `Timestamp` datetime NOT NULL,
  `SensorValue` int(11) NOT NULL,
  PRIMARY KEY (`ValueID`),
  KEY `FK_SensorID_SensorID_idx` (`SensorID`),
  CONSTRAINT `FK_SensorValueID_SensorID` FOREIGN KEY (`SensorID`) REFERENCES `SensorInfo` (`SensorID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SensorValue_CO2`
--

LOCK TABLES `SensorValue_CO2` WRITE;
/*!40000 ALTER TABLE `SensorValue_CO2` DISABLE KEYS */;
/*!40000 ALTER TABLE `SensorValue_CO2` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SensorValue_RH`
--

DROP TABLE IF EXISTS `SensorValue_RH`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SensorValue_RH` (
  `ValueID` int(11) NOT NULL,
  `SensorID` int(11) NOT NULL,
  `Timestamp` datetime NOT NULL,
  `SensorValue` int(11) NOT NULL,
  PRIMARY KEY (`ValueID`),
  KEY `FK_SensorValue_RH_SensorID_idx` (`SensorID`),
  CONSTRAINT `FK_SensorValue_RH_SensorID` FOREIGN KEY (`SensorID`) REFERENCES `SensorInfo` (`SensorID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SensorValue_RH`
--

LOCK TABLES `SensorValue_RH` WRITE;
/*!40000 ALTER TABLE `SensorValue_RH` DISABLE KEYS */;
/*!40000 ALTER TABLE `SensorValue_RH` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `SensorValue_Temperature`
--

DROP TABLE IF EXISTS `SensorValue_Temperature`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `SensorValue_Temperature` (
  `ValueID` int(11) NOT NULL,
  `SensorID` int(11) NOT NULL,
  `Timestamp` datetime NOT NULL,
  `SensorValue` int(11) NOT NULL,
  PRIMARY KEY (`ValueID`),
  KEY `FK_SensorValue_Temperature_SensorID_idx` (`SensorID`),
  CONSTRAINT `FK_SensorValue_Temperature_SensorID` FOREIGN KEY (`SensorID`) REFERENCES `SensorInfo` (`SensorID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `SensorValue_Temperature`
--

LOCK TABLES `SensorValue_Temperature` WRITE;
/*!40000 ALTER TABLE `SensorValue_Temperature` DISABLE KEYS */;
/*!40000 ALTER TABLE `SensorValue_Temperature` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Solutions`
--

DROP TABLE IF EXISTS `Solutions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Solutions` (
  `SolutionID` int(11) NOT NULL,
  `WarningID` int(11) NOT NULL,
  `WarningPriority` int(11) NOT NULL,
  `Message` varchar(150) NOT NULL,
  PRIMARY KEY (`SolutionID`),
  KEY `FK_Solutions_WarningID_idx` (`WarningID`),
  CONSTRAINT `FK_Solutions_WarningID` FOREIGN KEY (`WarningID`) REFERENCES `Warnings` (`WarningID`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Solutions`
--

LOCK TABLES `Solutions` WRITE;
/*!40000 ALTER TABLE `Solutions` DISABLE KEYS */;
/*!40000 ALTER TABLE `Solutions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Warnings`
--

DROP TABLE IF EXISTS `Warnings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Warnings` (
  `WarningID` int(11) NOT NULL,
  `SensorType` int(11) NOT NULL,
  `Message` varchar(150) NOT NULL,
  PRIMARY KEY (`WarningID`),
  KEY `FK_Warnings_SensorType_idx` (`SensorType`),
  CONSTRAINT `FK_Warnings_SensorType` FOREIGN KEY (`SensorType`) REFERENCES `SensorTypes` (`SensorType`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Warnings`
--

LOCK TABLES `Warnings` WRITE;
/*!40000 ALTER TABLE `Warnings` DISABLE KEYS */;
/*!40000 ALTER TABLE `Warnings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-04-18  0:25:19
