-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: 127.0.0.1    Database: LoginRegistrationDB
-- ------------------------------------------------------
-- Server version	8.0.22

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
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vorname` varchar(255) NOT NULL,
  `nachname` varchar(255) NOT NULL,
  `passwort` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `geburtstag` date NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'test','test','testtest','test@gmail.com','1990-10-01'),(3,'as','as','as','as','2001-01-10'),(5,'heute','heute','as','heute','2001-01-10'),(6,'Samed','Esen','$2a$12$kPgu/dZwdq01rAuHvWnedexMExI3t7FGDzZ34pKMd.vkFEnyiPhR.','esen.samed@gmail.com','2000-10-01'),(7,'Thomas','Esen','$2a$12$mJUYFo2XVMbcxDP7eYfYUOkRS/i2u1RRFtxjjCWsTQFTtGAe2Ktce','asdfasdfd@gmail.com','2000-10-01'),(8,'Thomas','Esen','$2a$12$QKz76r7solx7gjDFSJxzFOo87y57kXvaJQ6mq0fg4r3KAZBQg8k2W','123hsh@gmail.com','2000-10-01'),(9,'TEST','Esen','$2a$12$AMFoI3m3Z2ZBS3FnFe0HPeZq0MbrgIUMasNHUwDKI6qEGCPFuhQnW','asdfasdfasdfasdf@gmail.com','2000-10-01'),(10,'TEST','Esen','$2a$12$.SsfGePpQiKM2Kt0Mxb41eAaKTQ2.rzvp0sQlpMxd4Sdsm2vPnuWK','7171717@gmail.com','2000-10-01'),(11,'TEST','Esen','$2a$12$kPt1hrneVaomOHInohB8KuhbEd8xsgAXF2eqQSEmq5iAXed0hnhCW','46464646@gmail.com','2001-10-21'),(12,'TEST','Esen','$2a$12$J3EdBHwiYnRQDEgjX6N3XeVxyqjr/3TqAqPmFXM11VLOZzk3p6DNS','46432364646@gmail.com','2001-10-21');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-11-15 19:42:15
