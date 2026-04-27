CREATE DATABASE  IF NOT EXISTS `smart_mom_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `smart_mom_db`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: smart_mom_db
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `advisor_availability`
--

DROP TABLE IF EXISTS `advisor_availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `advisor_availability` (
  `id` int NOT NULL AUTO_INCREMENT,
  `advisor_id` int NOT NULL,
  `day_of_week` enum('monday','tuesday','wednesday','thursday','friday','saturday','sunday') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_369f2a154a3ce6e74b08656bcbd` (`advisor_id`),
  CONSTRAINT `FK_369f2a154a3ce6e74b08656bcbd` FOREIGN KEY (`advisor_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advisor_availability`
--

LOCK TABLES `advisor_availability` WRITE;
/*!40000 ALTER TABLE `advisor_availability` DISABLE KEYS */;
INSERT INTO `advisor_availability` VALUES (2,11,'monday','09:00:00','17:00:00','2026-02-28 10:54:24.139822','2026-02-28 10:54:24.139822'),(3,11,'tuesday','09:00:00','17:00:00','2026-02-28 10:54:24.143488','2026-02-28 10:54:24.143488'),(4,15,'wednesday','14:00:00','17:00:00','2026-02-28 13:10:49.099620','2026-02-28 13:10:49.099620'),(5,15,'thursday','09:00:00','17:00:00','2026-02-28 13:10:49.107620','2026-02-28 13:10:49.107620'),(6,15,'friday','09:00:00','17:00:00','2026-02-28 13:10:49.114318','2026-02-28 13:10:49.114318'),(11,26,'monday','09:00:00','12:00:00','2026-03-28 03:34:52.593054','2026-03-28 03:34:52.593054'),(12,26,'saturday','09:00:00','12:00:00','2026-03-28 03:34:52.597075','2026-03-28 03:34:52.597075'),(13,26,'sunday','09:00:00','12:00:00','2026-03-28 03:34:52.601180','2026-03-28 03:34:52.601180');
/*!40000 ALTER TABLE `advisor_availability` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `appointments`
--

DROP TABLE IF EXISTS `appointments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `appointments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int NOT NULL,
  `advisor_id` int NOT NULL,
  `child_id` int NOT NULL,
  `appointment_date` date NOT NULL,
  `appointment_time` time NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled','rejected') NOT NULL DEFAULT 'pending',
  `reason` text,
  `notes` text,
  `time_slot` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_fc4911456d96e7698249c9118d0` (`parent_id`),
  KEY `FK_1d2560c6b8a37c1e117f83f6ab9` (`advisor_id`),
  KEY `FK_58735989ce83056369952f20b52` (`child_id`),
  CONSTRAINT `FK_1d2560c6b8a37c1e117f83f6ab9` FOREIGN KEY (`advisor_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK_58735989ce83056369952f20b52` FOREIGN KEY (`child_id`) REFERENCES `children` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_fc4911456d96e7698249c9118d0` FOREIGN KEY (`parent_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
INSERT INTO `appointments` VALUES (1,13,11,7,'2026-03-05','14:00:00','rejected','Fever',NULL,'evening','2026-02-28 11:19:57.863873','2026-02-28 11:20:33.000000'),(2,14,11,8,'2026-03-02','14:00:00','confirmed','Fever',NULL,'evening','2026-02-28 13:06:58.233883','2026-02-28 13:08:15.000000'),(3,19,11,9,'2026-03-27','09:00:00','pending','',NULL,'morning','2026-03-25 02:51:03.234716','2026-03-25 02:51:03.234716'),(5,19,26,9,'2026-03-28','09:00:00','confirmed','Fever','Take medicine such as paracetamol, -- blah blah2 ok','morning','2026-03-28 03:36:42.248248','2026-03-28 05:54:20.000000');
/*!40000 ALTER TABLE `appointments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `children`
--

DROP TABLE IF EXISTS `children`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `children` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int NOT NULL,
  `name` varchar(255) NOT NULL,
  `date_of_birth` date NOT NULL,
  `gender` enum('male','female','other') NOT NULL,
  `allergies` text,
  `medical_conditions` text,
  `medications` text,
  `blood_type` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_e7f4185179e59c184d4ad363040` (`parent_id`),
  CONSTRAINT `FK_e7f4185179e59c184d4ad363040` FOREIGN KEY (`parent_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `children`
--

LOCK TABLES `children` WRITE;
/*!40000 ALTER TABLE `children` DISABLE KEYS */;
INSERT INTO `children` VALUES (1,1,'Emma Johnson','2020-05-15','female','No known allergies',NULL,NULL,NULL,'2026-02-14 10:36:45.458868','2026-02-14 10:36:45.563826'),(5,8,'Issa','2024-09-11','male','','',NULL,'','2026-02-28 10:45:04.600436','2026-02-28 10:45:04.600436'),(6,8,'Lily','2020-02-21','female','','',NULL,'','2026-02-28 10:45:23.227501','2026-02-28 10:45:23.227501'),(7,13,'Sue','2024-08-27','female','','',NULL,'','2026-02-28 11:19:17.813501','2026-02-28 11:19:17.813501'),(8,14,'Emily','2024-02-28','female','','',NULL,'','2026-02-28 13:00:54.314462','2026-02-28 13:00:54.314462'),(9,19,'Hnin Thandar','2018-04-05','female','Peanuts','',NULL,'O+','2026-03-25 02:44:17.211312','2026-03-25 02:44:17.211312'),(12,24,'Baby 1','2025-05-05','male','','',NULL,'AB+','2026-03-28 01:30:43.891600','2026-03-28 01:30:43.891600'),(13,24,'Baby 2','2023-06-06','female','','',NULL,'A-','2026-03-28 01:31:41.865351','2026-03-28 01:31:41.865351'),(14,24,'Baby 3','2009-01-12','female','','',NULL,'O-','2026-03-28 01:32:54.702185','2026-03-28 01:32:54.702185'),(15,24,'Bab 4','2018-07-12','male','','',NULL,'A-','2026-03-28 02:16:57.427719','2026-03-28 02:16:57.427719'),(16,24,'Baby 5','2020-01-13','male','','',NULL,'A+','2026-03-28 02:24:50.449684','2026-03-28 02:24:50.449684'),(17,19,'Hnin Lay','2020-02-28','male','','',NULL,'A-','2026-03-28 02:30:44.170383','2026-03-28 02:30:44.170383'),(19,25,'Baby Thoon','2022-02-02','male','','',NULL,'A-','2026-03-28 06:11:21.707453','2026-03-28 06:11:21.707453'),(20,27,'Baby Aura','2022-02-24','female','','',NULL,'A+','2026-04-24 04:16:39.837534','2026-04-24 04:16:39.837534');
/*!40000 ALTER TABLE `children` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `growth_tracking`
--

DROP TABLE IF EXISTS `growth_tracking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `growth_tracking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `measurement_date` date NOT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `bmi` decimal(5,2) DEFAULT NULL,
  `head_circumference` decimal(5,2) DEFAULT NULL,
  `notes` text,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_adedd9926c1364523812e925e69` (`child_id`),
  CONSTRAINT `FK_adedd9926c1364523812e925e69` FOREIGN KEY (`child_id`) REFERENCES `children` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `growth_tracking`
--

LOCK TABLES `growth_tracking` WRITE;
/*!40000 ALTER TABLE `growth_tracking` DISABLE KEYS */;
INSERT INTO `growth_tracking` VALUES (1,5,'2026-01-09',100.00,16.50,16.50,NULL,NULL,'2026-02-28 10:46:45.391996'),(2,5,'2026-02-28',102.00,20.00,19.22,NULL,NULL,'2026-02-28 10:47:09.987246'),(3,5,'2026-01-23',100.00,16.80,16.80,NULL,NULL,'2026-02-28 10:47:41.983376'),(4,8,'2026-02-06',80.00,12.40,19.37,NULL,NULL,'2026-02-28 13:02:37.405039'),(5,8,'2026-02-10',85.00,16.80,23.25,NULL,NULL,'2026-02-28 13:02:56.503517'),(6,8,'2026-02-28',100.00,18.00,18.00,NULL,NULL,'2026-02-28 13:03:07.965131'),(7,9,'2026-03-25',120.00,16.60,11.53,NULL,NULL,'2026-03-25 08:07:00.481971'),(8,9,'2026-03-28',100.00,16.90,16.90,NULL,NULL,'2026-03-25 08:07:33.752624'),(9,17,'2026-03-28',119.80,16.50,11.50,NULL,NULL,'2026-03-28 02:30:44.190459'),(11,9,'2026-03-30',120.00,17.00,11.81,NULL,NULL,'2026-03-28 05:50:53.271875'),(12,19,'2026-03-28',110.00,16.50,13.64,NULL,NULL,'2026-03-28 06:11:21.733775'),(13,20,'2026-04-24',101.00,16.30,15.98,NULL,NULL,'2026-04-24 04:16:39.863415');
/*!40000 ALTER TABLE `growth_tracking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nutrition_plans`
--

DROP TABLE IF EXISTS `nutrition_plans`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nutrition_plans` (
  `id` int NOT NULL AUTO_INCREMENT,
  `child_id` int NOT NULL,
  `plan_date` date NOT NULL,
  `breakfast` text,
  `lunch` text,
  `dinner` text,
  `snacks` text,
  `notes` text,
  `age_group` varchar(255) DEFAULT NULL,
  `goals` text,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`),
  KEY `FK_d564311c636abc762ba8db35beb` (`child_id`),
  CONSTRAINT `FK_d564311c636abc762ba8db35beb` FOREIGN KEY (`child_id`) REFERENCES `children` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=99 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nutrition_plans`
--

LOCK TABLES `nutrition_plans` WRITE;
/*!40000 ALTER TABLE `nutrition_plans` DISABLE KEYS */;
INSERT INTO `nutrition_plans` VALUES (29,14,'2026-03-28','Oatmeal + Chia seeds + Mixed nuts + Honey + Milk','Rice x2 servings + Chicken thigh + Fried egg + Vegetables','Chicken soup + Cheese bread + Warm milk',NULL,'Week:1,Day:1','13-18','weight_gain,height_growth','2026-03-28 02:05:59.071804','2026-03-28 02:05:59.071804'),(30,14,'2026-03-29','Oatmeal + Chia seeds + Mixed nuts + Honey + Milk','Pasta + Meat bolognese + Cheese + Garlic bread','Turkey meatballs + Whole wheat spaghetti + Marinara sauce',NULL,'Week:1,Day:2','13-18','weight_gain,height_growth','2026-03-28 02:05:59.074825','2026-03-28 02:05:59.074825'),(31,14,'2026-03-30','Protein smoothie + Banana + Peanut butter + Oats','Chicken + Broccoli + Cheese + Milk','Grilled salmon + Quinoa + Steamed asparagus',NULL,'Week:1,Day:3','13-18','weight_gain,height_growth','2026-03-28 02:05:59.078028','2026-03-28 02:05:59.078028'),(32,14,'2026-03-31','Peanut butter toast + Full-fat milk + Banana + Honey','Large salad + Grilled salmon + Whole grain bread','Lean beef steak + Brown rice + Roasted vegetables',NULL,'Week:1,Day:4','13-18','weight_gain,height_growth','2026-03-28 02:05:59.081130','2026-03-28 02:05:59.081130'),(33,14,'2026-04-01','Rice + Fried egg + Stir-fried vegetables','Fried rice + Shrimp + Egg + Vegetables','Rice + Egg plant curry + Yogurt',NULL,'Week:1,Day:5','13-18','weight_gain,height_growth','2026-03-28 02:05:59.085068','2026-03-28 02:05:59.085068'),(34,14,'2026-04-02','Peanut butter toast + Full-fat milk + Banana + Honey','Rice x2 servings + Chicken thigh + Fried egg + Vegetables','Chicken soup + Cheese bread + Warm milk',NULL,'Week:1,Day:6','13-18','weight_gain,height_growth','2026-03-28 02:05:59.087912','2026-03-28 02:05:59.087912'),(35,14,'2026-04-03','Whole grain toast x2 + Avocado + Poached egg + Orange juice','Pasta + Meat bolognese + Cheese + Garlic bread','Turkey meatballs + Whole wheat spaghetti + Marinara sauce',NULL,'Week:1,Day:7','13-18','weight_gain,height_growth','2026-03-28 02:05:59.090427','2026-03-28 02:05:59.090427'),(36,14,'2026-04-04','Protein smoothie + Banana + Peanut butter + Oats','Chicken + Broccoli + Cheese + Milk','Grilled salmon + Quinoa + Steamed asparagus',NULL,'Week:2,Day:1','13-18','weight_gain,height_growth','2026-03-28 02:05:59.092943','2026-03-28 02:05:59.092943'),(37,14,'2026-04-05','Oatmeal + Chia seeds + Mixed nuts + Honey + Milk','Large salad + Grilled salmon + Whole grain bread','Lean beef steak + Brown rice + Roasted vegetables',NULL,'Week:2,Day:2','13-18','weight_gain,height_growth','2026-03-28 02:05:59.095784','2026-03-28 02:05:59.095784'),(38,14,'2026-04-06','Rice + Fried egg + Stir-fried vegetables','Fried rice + Shrimp + Egg + Vegetables','Rice + Egg plant curry + Yogurt',NULL,'Week:2,Day:3','13-18','weight_gain,height_growth','2026-03-28 02:05:59.098783','2026-03-28 02:05:59.098783'),(39,14,'2026-04-07','Peanut butter toast + Full-fat milk + Banana + Honey','Rice x2 servings + Chicken thigh + Fried egg + Vegetables','Chicken soup + Cheese bread + Warm milk',NULL,'Week:2,Day:4','13-18','weight_gain,height_growth','2026-03-28 02:05:59.103354','2026-03-28 02:05:59.103354'),(40,14,'2026-04-08','Whole grain toast x2 + Avocado + Poached egg + Orange juice','Pasta + Meat bolognese + Cheese + Garlic bread','Turkey meatballs + Whole wheat spaghetti + Marinara sauce',NULL,'Week:2,Day:5','13-18','weight_gain,height_growth','2026-03-28 02:05:59.106272','2026-03-28 02:05:59.106272'),(41,14,'2026-04-09','Protein smoothie + Banana + Peanut butter + Oats','Chicken + Broccoli + Cheese + Milk','Grilled salmon + Quinoa + Steamed asparagus',NULL,'Week:2,Day:6','13-18','weight_gain,height_growth','2026-03-28 02:05:59.109520','2026-03-28 02:05:59.109520'),(42,14,'2026-04-10','Oatmeal + Chia seeds + Mixed nuts + Honey + Milk','Large salad + Grilled salmon + Whole grain bread','Lean beef steak + Brown rice + Roasted vegetables',NULL,'Week:2,Day:7','13-18','weight_gain,height_growth','2026-03-28 02:05:59.112337','2026-03-28 02:05:59.112337'),(43,14,'2026-04-11','Rice + Fried egg + Stir-fried vegetables','Fried rice + Shrimp + Egg + Vegetables','Rice + Egg plant curry + Yogurt',NULL,'Week:3,Day:1','13-18','weight_gain,height_growth','2026-03-28 02:05:59.114849','2026-03-28 02:05:59.114849'),(44,14,'2026-04-12','Peanut butter toast + Full-fat milk + Banana + Honey','Rice x2 servings + Chicken thigh + Fried egg + Vegetables','Chicken soup + Cheese bread + Warm milk',NULL,'Week:3,Day:2','13-18','weight_gain,height_growth','2026-03-28 02:05:59.119252','2026-03-28 02:05:59.119252'),(45,14,'2026-04-13','Whole grain toast x2 + Avocado + Poached egg + Orange juice','Pasta + Meat bolognese + Cheese + Garlic bread','Turkey meatballs + Whole wheat spaghetti + Marinara sauce',NULL,'Week:3,Day:3','13-18','weight_gain,height_growth','2026-03-28 02:05:59.122383','2026-03-28 02:05:59.122383'),(46,14,'2026-04-14','Protein smoothie + Banana + Peanut butter + Oats','Chicken + Broccoli + Cheese + Milk','Grilled salmon + Quinoa + Steamed asparagus',NULL,'Week:3,Day:4','13-18','weight_gain,height_growth','2026-03-28 02:05:59.126479','2026-03-28 02:05:59.126479'),(47,14,'2026-04-15','Oatmeal + Chia seeds + Mixed nuts + Honey + Milk','Large salad + Grilled salmon + Whole grain bread','Lean beef steak + Brown rice + Roasted vegetables',NULL,'Week:3,Day:5','13-18','weight_gain,height_growth','2026-03-28 02:05:59.130624','2026-03-28 02:05:59.130624'),(48,14,'2026-04-16','Rice + Fried egg + Stir-fried vegetables','Fried rice + Shrimp + Egg + Vegetables','Rice + Egg plant curry + Yogurt',NULL,'Week:3,Day:6','13-18','weight_gain,height_growth','2026-03-28 02:05:59.135761','2026-03-28 02:05:59.135761'),(49,14,'2026-04-17','Peanut butter toast + Full-fat milk + Banana + Honey','Rice x2 servings + Chicken thigh + Fried egg + Vegetables','Chicken soup + Cheese bread + Warm milk',NULL,'Week:3,Day:7','13-18','weight_gain,height_growth','2026-03-28 02:05:59.145424','2026-03-28 02:05:59.145424'),(50,14,'2026-04-18','Whole grain toast x2 + Avocado + Poached egg + Orange juice','Pasta + Meat bolognese + Cheese + Garlic bread','Turkey meatballs + Whole wheat spaghetti + Marinara sauce',NULL,'Week:4,Day:1','13-18','weight_gain,height_growth','2026-03-28 02:05:59.150023','2026-03-28 02:05:59.150023'),(51,14,'2026-04-19','Protein smoothie + Banana + Peanut butter + Oats','Chicken + Broccoli + Cheese + Milk','Grilled salmon + Quinoa + Steamed asparagus',NULL,'Week:4,Day:2','13-18','weight_gain,height_growth','2026-03-28 02:05:59.153744','2026-03-28 02:05:59.153744'),(52,14,'2026-04-20','Oatmeal + Chia seeds + Mixed nuts + Honey + Milk','Large salad + Grilled salmon + Whole grain bread','Lean beef steak + Brown rice + Roasted vegetables',NULL,'Week:4,Day:3','13-18','weight_gain,height_growth','2026-03-28 02:05:59.157013','2026-03-28 02:05:59.157013'),(53,14,'2026-04-21','Rice + Fried egg + Stir-fried vegetables','Fried rice + Shrimp + Egg + Vegetables','Rice + Egg plant curry + Yogurt',NULL,'Week:4,Day:4','13-18','weight_gain,height_growth','2026-03-28 02:05:59.159940','2026-03-28 02:05:59.159940'),(54,14,'2026-04-22','Peanut butter toast + Full-fat milk + Banana + Honey','Rice x2 servings + Chicken thigh + Fried egg + Vegetables','Chicken soup + Cheese bread + Warm milk',NULL,'Week:4,Day:5','13-18','weight_gain,height_growth','2026-03-28 02:05:59.162742','2026-03-28 02:05:59.162742'),(55,14,'2026-04-23','Whole grain toast x2 + Avocado + Poached egg + Orange juice','Pasta + Meat bolognese + Cheese + Garlic bread','Turkey meatballs + Whole wheat spaghetti + Marinara sauce',NULL,'Week:4,Day:6','13-18','weight_gain,height_growth','2026-03-28 02:05:59.166017','2026-03-28 02:05:59.166017'),(56,14,'2026-04-24','Protein smoothie + Banana + Peanut butter + Oats','Chicken + Broccoli + Cheese + Milk','Grilled salmon + Quinoa + Steamed asparagus',NULL,'Week:4,Day:7','13-18','weight_gain,height_growth','2026-03-28 02:05:59.169896','2026-03-28 02:05:59.169896'),(66,9,'2026-03-28','Oatmeal + Dried fruits + Nuts + Orange juice','Noodles + Stir-fried beef + Vegetables','Chicken soup + Rice + Steamed vegetables',NULL,'Week:1,Day:1','6-12','weight_gain','2026-03-28 05:49:39.446344','2026-03-28 05:49:39.446344'),(67,9,'2026-03-29','Whole grain toast + Peanut butter + Banana + Milk','Noodles + Stir-fried beef + Vegetables','Grilled fish + Brown rice + Mixed salad',NULL,'Week:1,Day:2','6-12','weight_gain','2026-03-28 05:49:39.452675','2026-03-28 05:49:39.452675'),(68,9,'2026-03-30','Boiled eggs x2 + Rice + Sliced tomato','Rice + Grilled chicken + Salad + Water','Rice + Beef stew + Potato + Bread',NULL,'Week:1,Day:3','6-12','weight_gain','2026-03-28 05:49:39.460859','2026-03-28 05:49:39.460859'),(69,9,'2026-03-31','Oatmeal + Full cream + Peanut butter + Banana','Fried rice + Pork + Egg x2 + Corn','Rice + Beef stew + Steamed broccoli',NULL,'Week:1,Day:4','6-12','weight_gain','2026-03-28 05:49:39.474219','2026-03-28 05:49:39.474219'),(70,9,'2026-04-01','Peanut butter toast + Full-fat milk + Banana + Honey','Fried rice + Shrimp + Carrot + Egg','Spaghetti + Meat sauce + Garlic bread',NULL,'Week:1,Day:5','6-12','weight_gain','2026-03-28 05:49:39.490588','2026-03-28 05:49:39.490588'),(71,9,'2026-04-02','Oatmeal + Dried fruits + Nuts + Orange juice','Rice + Fish fillet + Steamed corn','Chicken soup + Rice + Steamed vegetables',NULL,'Week:1,Day:6','6-12','weight_gain','2026-03-28 05:49:39.507205','2026-03-28 05:49:39.507205'),(72,9,'2026-04-03','Whole grain toast + Peanut butter + Banana + Milk','Noodles + Stir-fried beef + Vegetables','Grilled fish + Brown rice + Mixed salad',NULL,'Week:1,Day:7','6-12','weight_gain','2026-03-28 05:49:39.521178','2026-03-28 05:49:39.521178'),(73,9,'2026-04-04','Boiled eggs x2 + Rice + Sliced tomato','Rice + Grilled chicken + Salad + Water','Rice + Beef stew + Potato + Bread',NULL,'Week:2,Day:1','6-12','weight_gain','2026-03-28 05:49:39.531981','2026-03-28 05:49:39.531981'),(74,9,'2026-04-05','Oatmeal + Full cream + Peanut butter + Banana','Fried rice + Pork + Egg x2 + Corn','Rice + Beef stew + Steamed broccoli',NULL,'Week:2,Day:2','6-12','weight_gain','2026-03-28 05:49:39.545097','2026-03-28 05:49:39.545097'),(75,9,'2026-04-06','Peanut butter toast + Full-fat milk + Banana + Honey','Fried rice + Shrimp + Carrot + Egg','Spaghetti + Meat sauce + Garlic bread',NULL,'Week:2,Day:3','6-12','weight_gain','2026-03-28 05:49:39.559698','2026-03-28 05:49:39.559698'),(76,9,'2026-04-07','Oatmeal + Dried fruits + Nuts + Orange juice','Rice + Fish fillet + Steamed corn','Chicken soup + Rice + Steamed vegetables',NULL,'Week:2,Day:4','6-12','weight_gain','2026-03-28 05:49:39.573938','2026-03-28 05:49:39.573938'),(77,9,'2026-04-08','Whole grain toast + Peanut butter + Banana + Milk','Noodles + Stir-fried beef + Vegetables','Grilled fish + Brown rice + Mixed salad',NULL,'Week:2,Day:5','6-12','weight_gain','2026-03-28 05:49:39.589318','2026-03-28 05:49:39.589318'),(78,9,'2026-04-09','Boiled eggs x2 + Rice + Sliced tomato','Rice + Grilled chicken + Salad + Water','Rice + Beef stew + Potato + Bread',NULL,'Week:2,Day:6','6-12','weight_gain','2026-03-28 05:49:39.597826','2026-03-28 05:49:39.597826'),(79,9,'2026-04-10','Oatmeal + Full cream + Peanut butter + Banana','Fried rice + Pork + Egg x2 + Corn','Rice + Beef stew + Steamed broccoli',NULL,'Week:2,Day:7','6-12','weight_gain','2026-03-28 05:49:39.613394','2026-03-28 05:49:39.613394'),(80,9,'2026-04-11','Peanut butter toast + Full-fat milk + Banana + Honey','Fried rice + Shrimp + Carrot + Egg','Spaghetti + Meat sauce + Garlic bread',NULL,'Week:3,Day:1','6-12','weight_gain','2026-03-28 05:49:39.629928','2026-03-28 05:49:39.629928'),(81,9,'2026-04-12','Oatmeal + Dried fruits + Nuts + Orange juice','Rice + Fish fillet + Steamed corn','Chicken soup + Rice + Steamed vegetables',NULL,'Week:3,Day:2','6-12','weight_gain','2026-03-28 05:49:39.645866','2026-03-28 05:49:39.645866'),(82,9,'2026-04-13','Whole grain toast + Peanut butter + Banana + Milk','Noodles + Stir-fried beef + Vegetables','Grilled fish + Brown rice + Mixed salad',NULL,'Week:3,Day:3','6-12','weight_gain','2026-03-28 05:49:39.666052','2026-03-28 05:49:39.666052'),(83,9,'2026-04-14','Boiled eggs x2 + Rice + Sliced tomato','Rice + Grilled chicken + Salad + Water','Rice + Beef stew + Potato + Bread',NULL,'Week:3,Day:4','6-12','weight_gain','2026-03-28 05:49:39.711052','2026-03-28 05:49:39.711052'),(84,9,'2026-04-15','Oatmeal + Full cream + Peanut butter + Banana','Fried rice + Pork + Egg x2 + Corn','Rice + Beef stew + Steamed broccoli',NULL,'Week:3,Day:5','6-12','weight_gain','2026-03-28 05:49:39.721612','2026-03-28 05:49:39.721612'),(85,9,'2026-04-16','Peanut butter toast + Full-fat milk + Banana + Honey','Fried rice + Shrimp + Carrot + Egg','Spaghetti + Meat sauce + Garlic bread',NULL,'Week:3,Day:6','6-12','weight_gain','2026-03-28 05:49:39.729803','2026-03-28 05:49:39.729803'),(86,9,'2026-04-17','Oatmeal + Dried fruits + Nuts + Orange juice','Rice + Fish fillet + Steamed corn','Chicken soup + Rice + Steamed vegetables',NULL,'Week:3,Day:7','6-12','weight_gain','2026-03-28 05:49:39.738767','2026-03-28 05:49:39.738767'),(87,9,'2026-04-18','Whole grain toast + Peanut butter + Banana + Milk','Noodles + Stir-fried beef + Vegetables','Grilled fish + Brown rice + Mixed salad',NULL,'Week:4,Day:1','6-12','weight_gain','2026-03-28 05:49:39.747732','2026-03-28 05:49:39.747732'),(88,9,'2026-04-19','Boiled eggs x2 + Rice + Sliced tomato','Rice + Fish fillet + Steamed corn','Rice + Beef stew + Potato + Bread',NULL,'Week:4,Day:2','6-12','weight_gain','2026-03-28 05:49:39.754189','2026-03-28 05:49:39.754189'),(89,9,'2026-04-20','Oatmeal + Full cream + Peanut butter + Banana','Fried rice + Pork + Egg x2 + Corn','Rice + Beef stew + Steamed broccoli',NULL,'Week:4,Day:3','6-12','weight_gain','2026-03-28 05:49:39.762762','2026-03-28 05:49:39.762762'),(90,9,'2026-04-21','Peanut butter toast + Full-fat milk + Banana + Honey','Fried rice + Shrimp + Carrot + Egg','Spaghetti + Meat sauce + Garlic bread',NULL,'Week:4,Day:4','6-12','weight_gain','2026-03-28 05:49:39.770959','2026-03-28 05:49:39.770959'),(91,9,'2026-04-22','Oatmeal + Dried fruits + Nuts + Orange juice','Rice + Fish fillet + Steamed corn','Chicken soup + Rice + Steamed vegetables',NULL,'Week:4,Day:5','6-12','weight_gain','2026-03-28 05:49:39.777580','2026-03-28 05:49:39.777580'),(92,9,'2026-04-23','Whole grain toast + Peanut butter + Banana + Milk','Noodles + Stir-fried beef + Vegetables','Grilled fish + Brown rice + Mixed salad',NULL,'Week:4,Day:6','6-12','weight_gain','2026-03-28 05:49:39.783792','2026-03-28 05:49:39.783792'),(93,9,'2026-04-24','Boiled eggs x2 + Rice + Sliced tomato','Rice + Grilled chicken + Salad + Water','Rice + Beef stew + Potato + Bread',NULL,'Week:4,Day:7','6-12','weight_gain','2026-03-28 05:49:39.789783','2026-03-28 05:49:39.789783'),(95,20,'2026-04-24','Peanut butter toast + Full-fat milk + Banana + Honey','Fried rice + Egg + Corn','Chicken leg + Mashed potato with butter + Steamed carrot',NULL,'Week:1,Day:1','3-5','weight_gain,height_growth','2026-04-24 04:22:10.210474','2026-04-24 04:22:10.210474'),(98,19,'2026-04-24','French toast + Strawberry jam + Milk','Pasta + Meat bolognese + Cheese + Garlic bread','Rice + Beef stew + Potato + Bread',NULL,'Week:1,Day:1','3-5','weight_gain','2026-04-24 04:41:06.354861','2026-04-24 04:41:06.354861');
/*!40000 ALTER TABLE `nutrition_plans` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `parent_meal_selections`
--

DROP TABLE IF EXISTS `parent_meal_selections`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `parent_meal_selections` (
  `id` int NOT NULL AUTO_INCREMENT,
  `parent_id` int NOT NULL,
  `child_id` int NOT NULL,
  `age_group` varchar(20) NOT NULL,
  `nutrition_goal` varchar(200) NOT NULL,
  `plan_version` enum('free','premium') NOT NULL DEFAULT 'free',
  `bmi_value` decimal(5,2) DEFAULT NULL,
  `generated_date` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `is_active` tinyint NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_meal_selections`
--

LOCK TABLES `parent_meal_selections` WRITE;
/*!40000 ALTER TABLE `parent_meal_selections` DISABLE KEYS */;
INSERT INTO `parent_meal_selections` VALUES (1,24,13,'0-2','weight_gain,height_growth,immunity_boost','premium',NULL,'2026-03-28 01:43:45.543480',1),(2,24,12,'0-2','weight_gain,height_growth,immunity_boost','premium',NULL,'2026-03-28 01:47:45.133027',0),(3,24,12,'0-2','weight_gain,height_growth,immunity_boost','premium',NULL,'2026-03-28 01:47:57.365284',1),(5,24,14,'13-18','weight_gain,height_growth','premium',NULL,'2026-03-28 02:05:58.800148',1),(15,19,9,'6-12','weight_gain','premium',11.53,'2026-03-28 05:49:38.686023',1),(17,27,20,'3-5','weight_gain,height_growth','free',15.98,'2026-04-24 04:22:10.151425',1),(20,25,19,'3-5','weight_gain','free',13.64,'2026-04-24 04:41:06.296852',1);
/*!40000 ALTER TABLE `parent_meal_selections` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `selected_meal_plan_items`
--

DROP TABLE IF EXISTS `selected_meal_plan_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `selected_meal_plan_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `selection_id` int NOT NULL,
  `meal_plan_id` text NOT NULL,
  `week_number` int NOT NULL DEFAULT '1',
  `day_number` int NOT NULL DEFAULT '1',
  `meal_time` enum('breakfast','lunch','dinner') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_5886690d927f66e58b27fcd5d61` (`selection_id`),
  CONSTRAINT `FK_5886690d927f66e58b27fcd5d61` FOREIGN KEY (`selection_id`) REFERENCES `parent_meal_selections` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=547 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selected_meal_plan_items`
--

LOCK TABLES `selected_meal_plan_items` WRITE;
/*!40000 ALTER TABLE `selected_meal_plan_items` DISABLE KEYS */;
INSERT INTO `selected_meal_plan_items` VALUES (1,1,'Berries + Honey + Yogurt + Granola',1,1,'breakfast'),(2,1,'Lentil soup + Soft steamed broccoli + Breast milk',1,1,'lunch'),(3,1,'Rice + Beef stew + Potato + Bread',1,1,'dinner'),(4,1,'Oat cereal + Mashed avocado + Formula',1,2,'breakfast'),(5,1,'Soft tofu + Steamed fish puree + Rice water',1,2,'lunch'),(6,1,'Grilled fish + Rice + Milk before bed',1,2,'dinner'),(7,1,'Rice porridge + Pureed sweet potato + Breast milk',1,3,'breakfast'),(8,1,'Sardine rice + Green vegetables + Yogurt',1,3,'lunch'),(9,1,'Warm rice porridge + Pureed spinach + Warm water',1,3,'dinner'),(10,1,'Full-fat milk + Cheese toast + Boiled egg + Orange juice',1,4,'breakfast'),(11,1,'Chicken + Broccoli + Cheese + Milk',1,4,'lunch'),(12,1,'Rice cereal + Pureed mango + Breast milk',1,4,'dinner'),(13,1,'Soft scrambled egg + Pureed carrot + Warm water',1,5,'breakfast'),(14,1,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',1,5,'lunch'),(15,1,'Vegetable stew + Brown rice + Probiotic yogurt',1,5,'dinner'),(16,1,'Berries + Honey + Yogurt + Granola',1,6,'breakfast'),(17,1,'Lentil soup + Soft steamed broccoli + Breast milk',1,6,'lunch'),(18,1,'Rice + Beef stew + Potato + Bread',1,6,'dinner'),(19,1,'Oat cereal + Mashed avocado + Formula',1,7,'breakfast'),(20,1,'Soft tofu + Steamed fish puree + Rice water',1,7,'lunch'),(21,1,'Grilled fish + Rice + Milk before bed',1,7,'dinner'),(22,1,'Rice porridge + Pureed sweet potato + Breast milk',2,1,'breakfast'),(23,1,'Sardine rice + Green vegetables + Yogurt',2,1,'lunch'),(24,1,'Warm rice porridge + Pureed spinach + Warm water',2,1,'dinner'),(25,1,'Full-fat milk + Cheese toast + Boiled egg + Orange juice',2,2,'breakfast'),(26,1,'Chicken + Broccoli + Cheese + Milk',2,2,'lunch'),(27,1,'Rice cereal + Pureed mango + Breast milk',2,2,'dinner'),(28,1,'Soft scrambled egg + Pureed carrot + Warm water',2,3,'breakfast'),(29,1,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',2,3,'lunch'),(30,1,'Vegetable stew + Brown rice + Probiotic yogurt',2,3,'dinner'),(31,1,'Berries + Honey + Yogurt + Granola',2,4,'breakfast'),(32,1,'Lentil soup + Soft steamed broccoli + Breast milk',2,4,'lunch'),(33,1,'Rice + Beef stew + Potato + Bread',2,4,'dinner'),(34,1,'Oat cereal + Mashed avocado + Formula',2,5,'breakfast'),(35,1,'Soft tofu + Steamed fish puree + Rice water',2,5,'lunch'),(36,1,'Grilled fish + Rice + Milk before bed',2,5,'dinner'),(37,1,'Rice porridge + Pureed sweet potato + Breast milk',2,6,'breakfast'),(38,1,'Sardine rice + Green vegetables + Yogurt',2,6,'lunch'),(39,1,'Warm rice porridge + Pureed spinach + Warm water',2,6,'dinner'),(40,1,'Full-fat milk + Cheese toast + Boiled egg + Orange juice',2,7,'breakfast'),(41,1,'Chicken + Broccoli + Cheese + Milk',2,7,'lunch'),(42,1,'Rice cereal + Pureed mango + Breast milk',2,7,'dinner'),(43,1,'Soft scrambled egg + Pureed carrot + Warm water',3,1,'breakfast'),(44,1,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',3,1,'lunch'),(45,1,'Vegetable stew + Brown rice + Probiotic yogurt',3,1,'dinner'),(46,1,'Berries + Honey + Yogurt + Granola',3,2,'breakfast'),(47,1,'Lentil soup + Soft steamed broccoli + Breast milk',3,2,'lunch'),(48,1,'Rice + Beef stew + Potato + Bread',3,2,'dinner'),(49,1,'Oat cereal + Mashed avocado + Formula',3,3,'breakfast'),(50,1,'Soft tofu + Steamed fish puree + Rice water',3,3,'lunch'),(51,1,'Grilled fish + Rice + Milk before bed',3,3,'dinner'),(52,1,'Rice porridge + Pureed sweet potato + Breast milk',3,4,'breakfast'),(53,1,'Sardine rice + Green vegetables + Yogurt',3,4,'lunch'),(54,1,'Warm rice porridge + Pureed spinach + Warm water',3,4,'dinner'),(55,1,'Full-fat milk + Cheese toast + Boiled egg + Orange juice',3,5,'breakfast'),(56,1,'Chicken + Broccoli + Cheese + Milk',3,5,'lunch'),(57,1,'Rice cereal + Pureed mango + Breast milk',3,5,'dinner'),(58,1,'Soft scrambled egg + Pureed carrot + Warm water',3,6,'breakfast'),(59,1,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',3,6,'lunch'),(60,1,'Vegetable stew + Brown rice + Probiotic yogurt',3,6,'dinner'),(61,1,'Berries + Honey + Yogurt + Granola',3,7,'breakfast'),(62,1,'Lentil soup + Soft steamed broccoli + Breast milk',3,7,'lunch'),(63,1,'Rice + Beef stew + Potato + Bread',3,7,'dinner'),(64,1,'Oat cereal + Mashed avocado + Formula',4,1,'breakfast'),(65,1,'Soft tofu + Steamed fish puree + Rice water',4,1,'lunch'),(66,1,'Grilled fish + Rice + Milk before bed',4,1,'dinner'),(67,1,'Rice porridge + Pureed sweet potato + Breast milk',4,2,'breakfast'),(68,1,'Sardine rice + Green vegetables + Yogurt',4,2,'lunch'),(69,1,'Warm rice porridge + Pureed spinach + Warm water',4,2,'dinner'),(70,1,'Full-fat milk + Cheese toast + Boiled egg + Orange juice',4,3,'breakfast'),(71,1,'Chicken + Broccoli + Cheese + Milk',4,3,'lunch'),(72,1,'Rice cereal + Pureed mango + Breast milk',4,3,'dinner'),(73,1,'Soft scrambled egg + Pureed carrot + Warm water',4,4,'breakfast'),(74,1,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',4,4,'lunch'),(75,1,'Vegetable stew + Brown rice + Probiotic yogurt',4,4,'dinner'),(76,1,'Berries + Honey + Yogurt + Granola',4,5,'breakfast'),(77,1,'Lentil soup + Soft steamed broccoli + Breast milk',4,5,'lunch'),(78,1,'Rice + Beef stew + Potato + Bread',4,5,'dinner'),(79,1,'Oat cereal + Mashed avocado + Formula',4,6,'breakfast'),(80,1,'Soft tofu + Steamed fish puree + Rice water',4,6,'lunch'),(81,1,'Grilled fish + Rice + Milk before bed',4,6,'dinner'),(82,1,'Rice porridge + Pureed sweet potato + Breast milk',4,7,'breakfast'),(83,1,'Sardine rice + Green vegetables + Yogurt',4,7,'lunch'),(84,1,'Warm rice porridge + Pureed spinach + Warm water',4,7,'dinner'),(85,2,'Oatmeal + Full cream + Peanut butter + Banana',1,1,'breakfast'),(86,2,'Vegetable puree soup + Soft bread + Warm milk',1,1,'lunch'),(87,2,'Rice + Beef stew + Potato + Bread',1,1,'dinner'),(88,2,'Mashed potato + Steamed pumpkin puree + Milk',1,2,'breakfast'),(89,2,'Sardine rice + Green vegetables + Yogurt',1,2,'lunch'),(90,2,'Vegetable stew + Brown rice + Probiotic yogurt',1,2,'dinner'),(91,2,'Eggs x2 + Avocado toast + Whole milk + Orange juice',1,3,'breakfast'),(92,2,'Pasta + Meat bolognese + Cheese + Garlic bread',1,3,'lunch'),(93,2,'Chicken soup + Cheese bread + Warm milk',1,3,'dinner'),(94,2,'Smoothie (orange + mango + ginger) + Greek yogurt',1,4,'breakfast'),(95,2,'Lentil soup + Soft steamed broccoli + Breast milk',1,4,'lunch'),(96,2,'Rice cereal + Pureed mango + Breast milk',1,4,'dinner'),(97,2,'Breast milk / Formula + Mashed banana',1,5,'breakfast'),(98,2,'Fried rice + Pork + Egg x2 + Corn',1,5,'lunch'),(99,2,'Grilled fish + Rice + Milk before bed',1,5,'dinner'),(100,2,'Oatmeal + Full cream + Peanut butter + Banana',1,6,'breakfast'),(101,2,'Vegetable puree soup + Soft bread + Warm milk',1,6,'lunch'),(102,2,'Rice + Beef stew + Potato + Bread',1,6,'dinner'),(103,2,'Mashed potato + Steamed pumpkin puree + Milk',1,7,'breakfast'),(104,2,'Sardine rice + Green vegetables + Yogurt',1,7,'lunch'),(105,2,'Vegetable stew + Brown rice + Probiotic yogurt',1,7,'dinner'),(106,2,'Eggs x2 + Avocado toast + Whole milk + Orange juice',2,1,'breakfast'),(107,2,'Pasta + Meat bolognese + Cheese + Garlic bread',2,1,'lunch'),(108,2,'Chicken soup + Cheese bread + Warm milk',2,1,'dinner'),(109,2,'Smoothie (orange + mango + ginger) + Greek yogurt',2,2,'breakfast'),(110,2,'Lentil soup + Soft steamed broccoli + Breast milk',2,2,'lunch'),(111,2,'Rice cereal + Pureed mango + Breast milk',2,2,'dinner'),(112,2,'Breast milk / Formula + Mashed banana',2,3,'breakfast'),(113,2,'Fried rice + Pork + Egg x2 + Corn',2,3,'lunch'),(114,2,'Grilled fish + Rice + Milk before bed',2,3,'dinner'),(115,2,'Oatmeal + Full cream + Peanut butter + Banana',2,4,'breakfast'),(116,2,'Vegetable puree soup + Soft bread + Warm milk',2,4,'lunch'),(117,2,'Rice + Beef stew + Potato + Bread',2,4,'dinner'),(118,2,'Mashed potato + Steamed pumpkin puree + Milk',2,5,'breakfast'),(119,2,'Sardine rice + Green vegetables + Yogurt',2,5,'lunch'),(120,2,'Vegetable stew + Brown rice + Probiotic yogurt',2,5,'dinner'),(121,2,'Eggs x2 + Avocado toast + Whole milk + Orange juice',2,6,'breakfast'),(122,2,'Pasta + Meat bolognese + Cheese + Garlic bread',2,6,'lunch'),(123,2,'Chicken soup + Cheese bread + Warm milk',2,6,'dinner'),(124,2,'Smoothie (orange + mango + ginger) + Greek yogurt',2,7,'breakfast'),(125,2,'Lentil soup + Soft steamed broccoli + Breast milk',2,7,'lunch'),(126,2,'Rice cereal + Pureed mango + Breast milk',2,7,'dinner'),(127,2,'Breast milk / Formula + Mashed banana',3,1,'breakfast'),(128,2,'Fried rice + Pork + Egg x2 + Corn',3,1,'lunch'),(129,2,'Grilled fish + Rice + Milk before bed',3,1,'dinner'),(130,2,'Oatmeal + Full cream + Peanut butter + Banana',3,2,'breakfast'),(131,2,'Vegetable puree soup + Soft bread + Warm milk',3,2,'lunch'),(132,2,'Rice + Beef stew + Potato + Bread',3,2,'dinner'),(133,2,'Mashed potato + Steamed pumpkin puree + Milk',3,3,'breakfast'),(134,2,'Sardine rice + Green vegetables + Yogurt',3,3,'lunch'),(135,2,'Vegetable stew + Brown rice + Probiotic yogurt',3,3,'dinner'),(136,2,'Eggs x2 + Avocado toast + Whole milk + Orange juice',3,4,'breakfast'),(137,2,'Pasta + Meat bolognese + Cheese + Garlic bread',3,4,'lunch'),(138,2,'Chicken soup + Cheese bread + Warm milk',3,4,'dinner'),(139,2,'Smoothie (orange + mango + ginger) + Greek yogurt',3,5,'breakfast'),(140,2,'Lentil soup + Soft steamed broccoli + Breast milk',3,5,'lunch'),(141,2,'Rice cereal + Pureed mango + Breast milk',3,5,'dinner'),(142,2,'Breast milk / Formula + Mashed banana',3,6,'breakfast'),(143,2,'Fried rice + Pork + Egg x2 + Corn',3,6,'lunch'),(144,2,'Grilled fish + Rice + Milk before bed',3,6,'dinner'),(145,2,'Oatmeal + Full cream + Peanut butter + Banana',3,7,'breakfast'),(146,2,'Vegetable puree soup + Soft bread + Warm milk',3,7,'lunch'),(147,2,'Rice + Beef stew + Potato + Bread',3,7,'dinner'),(148,2,'Mashed potato + Steamed pumpkin puree + Milk',4,1,'breakfast'),(149,2,'Sardine rice + Green vegetables + Yogurt',4,1,'lunch'),(150,2,'Vegetable stew + Brown rice + Probiotic yogurt',4,1,'dinner'),(151,2,'Eggs x2 + Avocado toast + Whole milk + Orange juice',4,2,'breakfast'),(152,2,'Pasta + Meat bolognese + Cheese + Garlic bread',4,2,'lunch'),(153,2,'Chicken soup + Cheese bread + Warm milk',4,2,'dinner'),(154,2,'Smoothie (orange + mango + ginger) + Greek yogurt',4,3,'breakfast'),(155,2,'Lentil soup + Soft steamed broccoli + Breast milk',4,3,'lunch'),(156,2,'Rice cereal + Pureed mango + Breast milk',4,3,'dinner'),(157,2,'Breast milk / Formula + Mashed banana',4,4,'breakfast'),(158,2,'Fried rice + Pork + Egg x2 + Corn',4,4,'lunch'),(159,2,'Grilled fish + Rice + Milk before bed',4,4,'dinner'),(160,2,'Oatmeal + Full cream + Peanut butter + Banana',4,5,'breakfast'),(161,2,'Vegetable puree soup + Soft bread + Warm milk',4,5,'lunch'),(162,2,'Rice + Beef stew + Potato + Bread',4,5,'dinner'),(163,2,'Mashed potato + Steamed pumpkin puree + Milk',4,6,'breakfast'),(164,2,'Sardine rice + Green vegetables + Yogurt',4,6,'lunch'),(165,2,'Vegetable stew + Brown rice + Probiotic yogurt',4,6,'dinner'),(166,2,'Eggs x2 + Avocado toast + Whole milk + Orange juice',4,7,'breakfast'),(167,2,'Pasta + Meat bolognese + Cheese + Garlic bread',4,7,'lunch'),(168,2,'Chicken soup + Cheese bread + Warm milk',4,7,'dinner'),(169,3,'Oatmeal + Full cream + Peanut butter + Banana',1,1,'breakfast'),(170,3,'Vegetable puree soup + Soft bread + Warm milk',1,1,'lunch'),(171,3,'Rice + Beef stew + Potato + Bread',1,1,'dinner'),(172,3,'Mashed potato + Steamed pumpkin puree + Milk',1,2,'breakfast'),(173,3,'Sardine rice + Green vegetables + Yogurt',1,2,'lunch'),(174,3,'Vegetable stew + Brown rice + Probiotic yogurt',1,2,'dinner'),(175,3,'Eggs x2 + Avocado toast + Whole milk + Orange juice',1,3,'breakfast'),(176,3,'Pasta + Meat bolognese + Cheese + Garlic bread',1,3,'lunch'),(177,3,'Chicken soup + Cheese bread + Warm milk',1,3,'dinner'),(178,3,'Smoothie (orange + mango + ginger) + Greek yogurt',1,4,'breakfast'),(179,3,'Lentil soup + Soft steamed broccoli + Breast milk',1,4,'lunch'),(180,3,'Rice cereal + Pureed mango + Breast milk',1,4,'dinner'),(181,3,'Breast milk / Formula + Mashed banana',1,5,'breakfast'),(182,3,'Fried rice + Pork + Egg x2 + Corn',1,5,'lunch'),(183,3,'Grilled fish + Rice + Milk before bed',1,5,'dinner'),(184,3,'Oatmeal + Full cream + Peanut butter + Banana',1,6,'breakfast'),(185,3,'Vegetable puree soup + Soft bread + Warm milk',1,6,'lunch'),(186,3,'Rice + Beef stew + Potato + Bread',1,6,'dinner'),(187,3,'Mashed potato + Steamed pumpkin puree + Milk',1,7,'breakfast'),(188,3,'Sardine rice + Green vegetables + Yogurt',1,7,'lunch'),(189,3,'Vegetable stew + Brown rice + Probiotic yogurt',1,7,'dinner'),(190,3,'Eggs x2 + Avocado toast + Whole milk + Orange juice',2,1,'breakfast'),(191,3,'Pasta + Meat bolognese + Cheese + Garlic bread',2,1,'lunch'),(192,3,'Chicken soup + Cheese bread + Warm milk',2,1,'dinner'),(193,3,'Smoothie (orange + mango + ginger) + Greek yogurt',2,2,'breakfast'),(194,3,'Lentil soup + Soft steamed broccoli + Breast milk',2,2,'lunch'),(195,3,'Rice cereal + Pureed mango + Breast milk',2,2,'dinner'),(196,3,'Breast milk / Formula + Mashed banana',2,3,'breakfast'),(197,3,'Fried rice + Pork + Egg x2 + Corn',2,3,'lunch'),(198,3,'Grilled fish + Rice + Milk before bed',2,3,'dinner'),(199,3,'Oatmeal + Full cream + Peanut butter + Banana',2,4,'breakfast'),(200,3,'Vegetable puree soup + Soft bread + Warm milk',2,4,'lunch'),(201,3,'Rice + Beef stew + Potato + Bread',2,4,'dinner'),(202,3,'Mashed potato + Steamed pumpkin puree + Milk',2,5,'breakfast'),(203,3,'Sardine rice + Green vegetables + Yogurt',2,5,'lunch'),(204,3,'Vegetable stew + Brown rice + Probiotic yogurt',2,5,'dinner'),(205,3,'Eggs x2 + Avocado toast + Whole milk + Orange juice',2,6,'breakfast'),(206,3,'Pasta + Meat bolognese + Cheese + Garlic bread',2,6,'lunch'),(207,3,'Chicken soup + Cheese bread + Warm milk',2,6,'dinner'),(208,3,'Smoothie (orange + mango + ginger) + Greek yogurt',2,7,'breakfast'),(209,3,'Lentil soup + Soft steamed broccoli + Breast milk',2,7,'lunch'),(210,3,'Rice cereal + Pureed mango + Breast milk',2,7,'dinner'),(211,3,'Breast milk / Formula + Mashed banana',3,1,'breakfast'),(212,3,'Fried rice + Pork + Egg x2 + Corn',3,1,'lunch'),(213,3,'Grilled fish + Rice + Milk before bed',3,1,'dinner'),(214,3,'Oatmeal + Full cream + Peanut butter + Banana',3,2,'breakfast'),(215,3,'Vegetable puree soup + Soft bread + Warm milk',3,2,'lunch'),(216,3,'Rice + Beef stew + Potato + Bread',3,2,'dinner'),(217,3,'Mashed potato + Steamed pumpkin puree + Milk',3,3,'breakfast'),(218,3,'Sardine rice + Green vegetables + Yogurt',3,3,'lunch'),(219,3,'Vegetable stew + Brown rice + Probiotic yogurt',3,3,'dinner'),(220,3,'Eggs x2 + Avocado toast + Whole milk + Orange juice',3,4,'breakfast'),(221,3,'Pasta + Meat bolognese + Cheese + Garlic bread',3,4,'lunch'),(222,3,'Chicken soup + Cheese bread + Warm milk',3,4,'dinner'),(223,3,'Smoothie (orange + mango + ginger) + Greek yogurt',3,5,'breakfast'),(224,3,'Lentil soup + Soft steamed broccoli + Breast milk',3,5,'lunch'),(225,3,'Rice cereal + Pureed mango + Breast milk',3,5,'dinner'),(226,3,'Breast milk / Formula + Mashed banana',3,6,'breakfast'),(227,3,'Fried rice + Pork + Egg x2 + Corn',3,6,'lunch'),(228,3,'Grilled fish + Rice + Milk before bed',3,6,'dinner'),(229,3,'Oatmeal + Full cream + Peanut butter + Banana',3,7,'breakfast'),(230,3,'Vegetable puree soup + Soft bread + Warm milk',3,7,'lunch'),(231,3,'Rice + Beef stew + Potato + Bread',3,7,'dinner'),(232,3,'Mashed potato + Steamed pumpkin puree + Milk',4,1,'breakfast'),(233,3,'Sardine rice + Green vegetables + Yogurt',4,1,'lunch'),(234,3,'Vegetable stew + Brown rice + Probiotic yogurt',4,1,'dinner'),(235,3,'Eggs x2 + Avocado toast + Whole milk + Orange juice',4,2,'breakfast'),(236,3,'Pasta + Meat bolognese + Cheese + Garlic bread',4,2,'lunch'),(237,3,'Chicken soup + Cheese bread + Warm milk',4,2,'dinner'),(238,3,'Smoothie (orange + mango + ginger) + Greek yogurt',4,3,'breakfast'),(239,3,'Lentil soup + Soft steamed broccoli + Breast milk',4,3,'lunch'),(240,3,'Rice cereal + Pureed mango + Breast milk',4,3,'dinner'),(241,3,'Breast milk / Formula + Mashed banana',4,4,'breakfast'),(242,3,'Fried rice + Pork + Egg x2 + Corn',4,4,'lunch'),(243,3,'Grilled fish + Rice + Milk before bed',4,4,'dinner'),(244,3,'Oatmeal + Full cream + Peanut butter + Banana',4,5,'breakfast'),(245,3,'Vegetable puree soup + Soft bread + Warm milk',4,5,'lunch'),(246,3,'Rice + Beef stew + Potato + Bread',4,5,'dinner'),(247,3,'Mashed potato + Steamed pumpkin puree + Milk',4,6,'breakfast'),(248,3,'Sardine rice + Green vegetables + Yogurt',4,6,'lunch'),(249,3,'Vegetable stew + Brown rice + Probiotic yogurt',4,6,'dinner'),(250,3,'Eggs x2 + Avocado toast + Whole milk + Orange juice',4,7,'breakfast'),(251,3,'Pasta + Meat bolognese + Cheese + Garlic bread',4,7,'lunch'),(252,3,'Chicken soup + Cheese bread + Warm milk',4,7,'dinner'),(337,5,'Oatmeal + Chia seeds + Mixed nuts + Honey + Milk',1,1,'breakfast'),(338,5,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',1,1,'lunch'),(339,5,'Chicken soup + Cheese bread + Warm milk',1,1,'dinner'),(340,5,'Oatmeal + Chia seeds + Mixed nuts + Honey + Milk',1,2,'breakfast'),(341,5,'Pasta + Meat bolognese + Cheese + Garlic bread',1,2,'lunch'),(342,5,'Turkey meatballs + Whole wheat spaghetti + Marinara sauce',1,2,'dinner'),(343,5,'Protein smoothie + Banana + Peanut butter + Oats',1,3,'breakfast'),(344,5,'Chicken + Broccoli + Cheese + Milk',1,3,'lunch'),(345,5,'Grilled salmon + Quinoa + Steamed asparagus',1,3,'dinner'),(346,5,'Peanut butter toast + Full-fat milk + Banana + Honey',1,4,'breakfast'),(347,5,'Large salad + Grilled salmon + Whole grain bread',1,4,'lunch'),(348,5,'Lean beef steak + Brown rice + Roasted vegetables',1,4,'dinner'),(349,5,'Rice + Fried egg + Stir-fried vegetables',1,5,'breakfast'),(350,5,'Fried rice + Shrimp + Egg + Vegetables',1,5,'lunch'),(351,5,'Rice + Egg plant curry + Yogurt',1,5,'dinner'),(352,5,'Peanut butter toast + Full-fat milk + Banana + Honey',1,6,'breakfast'),(353,5,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',1,6,'lunch'),(354,5,'Chicken soup + Cheese bread + Warm milk',1,6,'dinner'),(355,5,'Whole grain toast x2 + Avocado + Poached egg + Orange juice',1,7,'breakfast'),(356,5,'Pasta + Meat bolognese + Cheese + Garlic bread',1,7,'lunch'),(357,5,'Turkey meatballs + Whole wheat spaghetti + Marinara sauce',1,7,'dinner'),(358,5,'Protein smoothie + Banana + Peanut butter + Oats',2,1,'breakfast'),(359,5,'Chicken + Broccoli + Cheese + Milk',2,1,'lunch'),(360,5,'Grilled salmon + Quinoa + Steamed asparagus',2,1,'dinner'),(361,5,'Oatmeal + Chia seeds + Mixed nuts + Honey + Milk',2,2,'breakfast'),(362,5,'Large salad + Grilled salmon + Whole grain bread',2,2,'lunch'),(363,5,'Lean beef steak + Brown rice + Roasted vegetables',2,2,'dinner'),(364,5,'Rice + Fried egg + Stir-fried vegetables',2,3,'breakfast'),(365,5,'Fried rice + Shrimp + Egg + Vegetables',2,3,'lunch'),(366,5,'Rice + Egg plant curry + Yogurt',2,3,'dinner'),(367,5,'Peanut butter toast + Full-fat milk + Banana + Honey',2,4,'breakfast'),(368,5,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',2,4,'lunch'),(369,5,'Chicken soup + Cheese bread + Warm milk',2,4,'dinner'),(370,5,'Whole grain toast x2 + Avocado + Poached egg + Orange juice',2,5,'breakfast'),(371,5,'Pasta + Meat bolognese + Cheese + Garlic bread',2,5,'lunch'),(372,5,'Turkey meatballs + Whole wheat spaghetti + Marinara sauce',2,5,'dinner'),(373,5,'Protein smoothie + Banana + Peanut butter + Oats',2,6,'breakfast'),(374,5,'Chicken + Broccoli + Cheese + Milk',2,6,'lunch'),(375,5,'Grilled salmon + Quinoa + Steamed asparagus',2,6,'dinner'),(376,5,'Oatmeal + Chia seeds + Mixed nuts + Honey + Milk',2,7,'breakfast'),(377,5,'Large salad + Grilled salmon + Whole grain bread',2,7,'lunch'),(378,5,'Lean beef steak + Brown rice + Roasted vegetables',2,7,'dinner'),(379,5,'Rice + Fried egg + Stir-fried vegetables',3,1,'breakfast'),(380,5,'Fried rice + Shrimp + Egg + Vegetables',3,1,'lunch'),(381,5,'Rice + Egg plant curry + Yogurt',3,1,'dinner'),(382,5,'Peanut butter toast + Full-fat milk + Banana + Honey',3,2,'breakfast'),(383,5,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',3,2,'lunch'),(384,5,'Chicken soup + Cheese bread + Warm milk',3,2,'dinner'),(385,5,'Whole grain toast x2 + Avocado + Poached egg + Orange juice',3,3,'breakfast'),(386,5,'Pasta + Meat bolognese + Cheese + Garlic bread',3,3,'lunch'),(387,5,'Turkey meatballs + Whole wheat spaghetti + Marinara sauce',3,3,'dinner'),(388,5,'Protein smoothie + Banana + Peanut butter + Oats',3,4,'breakfast'),(389,5,'Chicken + Broccoli + Cheese + Milk',3,4,'lunch'),(390,5,'Grilled salmon + Quinoa + Steamed asparagus',3,4,'dinner'),(391,5,'Oatmeal + Chia seeds + Mixed nuts + Honey + Milk',3,5,'breakfast'),(392,5,'Large salad + Grilled salmon + Whole grain bread',3,5,'lunch'),(393,5,'Lean beef steak + Brown rice + Roasted vegetables',3,5,'dinner'),(394,5,'Rice + Fried egg + Stir-fried vegetables',3,6,'breakfast'),(395,5,'Fried rice + Shrimp + Egg + Vegetables',3,6,'lunch'),(396,5,'Rice + Egg plant curry + Yogurt',3,6,'dinner'),(397,5,'Peanut butter toast + Full-fat milk + Banana + Honey',3,7,'breakfast'),(398,5,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',3,7,'lunch'),(399,5,'Chicken soup + Cheese bread + Warm milk',3,7,'dinner'),(400,5,'Whole grain toast x2 + Avocado + Poached egg + Orange juice',4,1,'breakfast'),(401,5,'Pasta + Meat bolognese + Cheese + Garlic bread',4,1,'lunch'),(402,5,'Turkey meatballs + Whole wheat spaghetti + Marinara sauce',4,1,'dinner'),(403,5,'Protein smoothie + Banana + Peanut butter + Oats',4,2,'breakfast'),(404,5,'Chicken + Broccoli + Cheese + Milk',4,2,'lunch'),(405,5,'Grilled salmon + Quinoa + Steamed asparagus',4,2,'dinner'),(406,5,'Oatmeal + Chia seeds + Mixed nuts + Honey + Milk',4,3,'breakfast'),(407,5,'Large salad + Grilled salmon + Whole grain bread',4,3,'lunch'),(408,5,'Lean beef steak + Brown rice + Roasted vegetables',4,3,'dinner'),(409,5,'Rice + Fried egg + Stir-fried vegetables',4,4,'breakfast'),(410,5,'Fried rice + Shrimp + Egg + Vegetables',4,4,'lunch'),(411,5,'Rice + Egg plant curry + Yogurt',4,4,'dinner'),(412,5,'Peanut butter toast + Full-fat milk + Banana + Honey',4,5,'breakfast'),(413,5,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',4,5,'lunch'),(414,5,'Chicken soup + Cheese bread + Warm milk',4,5,'dinner'),(415,5,'Whole grain toast x2 + Avocado + Poached egg + Orange juice',4,6,'breakfast'),(416,5,'Pasta + Meat bolognese + Cheese + Garlic bread',4,6,'lunch'),(417,5,'Turkey meatballs + Whole wheat spaghetti + Marinara sauce',4,6,'dinner'),(418,5,'Protein smoothie + Banana + Peanut butter + Oats',4,7,'breakfast'),(419,5,'Chicken + Broccoli + Cheese + Milk',4,7,'lunch'),(420,5,'Grilled salmon + Quinoa + Steamed asparagus',4,7,'dinner'),(448,15,'Oatmeal + Dried fruits + Nuts + Orange juice',1,1,'breakfast'),(449,15,'Noodles + Stir-fried beef + Vegetables',1,1,'lunch'),(450,15,'Chicken soup + Rice + Steamed vegetables',1,1,'dinner'),(451,15,'Whole grain toast + Peanut butter + Banana + Milk',1,2,'breakfast'),(452,15,'Noodles + Stir-fried beef + Vegetables',1,2,'lunch'),(453,15,'Grilled fish + Brown rice + Mixed salad',1,2,'dinner'),(454,15,'Boiled eggs x2 + Rice + Sliced tomato',1,3,'breakfast'),(455,15,'Rice + Grilled chicken + Salad + Water',1,3,'lunch'),(456,15,'Rice + Beef stew + Potato + Bread',1,3,'dinner'),(457,15,'Oatmeal + Full cream + Peanut butter + Banana',1,4,'breakfast'),(458,15,'Fried rice + Pork + Egg x2 + Corn',1,4,'lunch'),(459,15,'Rice + Beef stew + Steamed broccoli',1,4,'dinner'),(460,15,'Peanut butter toast + Full-fat milk + Banana + Honey',1,5,'breakfast'),(461,15,'Fried rice + Shrimp + Carrot + Egg',1,5,'lunch'),(462,15,'Spaghetti + Meat sauce + Garlic bread',1,5,'dinner'),(463,15,'Oatmeal + Dried fruits + Nuts + Orange juice',1,6,'breakfast'),(464,15,'Rice + Fish fillet + Steamed corn',1,6,'lunch'),(465,15,'Chicken soup + Rice + Steamed vegetables',1,6,'dinner'),(466,15,'Whole grain toast + Peanut butter + Banana + Milk',1,7,'breakfast'),(467,15,'Noodles + Stir-fried beef + Vegetables',1,7,'lunch'),(468,15,'Grilled fish + Brown rice + Mixed salad',1,7,'dinner'),(469,15,'Boiled eggs x2 + Rice + Sliced tomato',2,1,'breakfast'),(470,15,'Rice + Grilled chicken + Salad + Water',2,1,'lunch'),(471,15,'Rice + Beef stew + Potato + Bread',2,1,'dinner'),(472,15,'Oatmeal + Full cream + Peanut butter + Banana',2,2,'breakfast'),(473,15,'Fried rice + Pork + Egg x2 + Corn',2,2,'lunch'),(474,15,'Rice + Beef stew + Steamed broccoli',2,2,'dinner'),(475,15,'Peanut butter toast + Full-fat milk + Banana + Honey',2,3,'breakfast'),(476,15,'Fried rice + Shrimp + Carrot + Egg',2,3,'lunch'),(477,15,'Spaghetti + Meat sauce + Garlic bread',2,3,'dinner'),(478,15,'Oatmeal + Dried fruits + Nuts + Orange juice',2,4,'breakfast'),(479,15,'Rice + Fish fillet + Steamed corn',2,4,'lunch'),(480,15,'Chicken soup + Rice + Steamed vegetables',2,4,'dinner'),(481,15,'Whole grain toast + Peanut butter + Banana + Milk',2,5,'breakfast'),(482,15,'Noodles + Stir-fried beef + Vegetables',2,5,'lunch'),(483,15,'Grilled fish + Brown rice + Mixed salad',2,5,'dinner'),(484,15,'Boiled eggs x2 + Rice + Sliced tomato',2,6,'breakfast'),(485,15,'Rice + Grilled chicken + Salad + Water',2,6,'lunch'),(486,15,'Rice + Beef stew + Potato + Bread',2,6,'dinner'),(487,15,'Oatmeal + Full cream + Peanut butter + Banana',2,7,'breakfast'),(488,15,'Fried rice + Pork + Egg x2 + Corn',2,7,'lunch'),(489,15,'Rice + Beef stew + Steamed broccoli',2,7,'dinner'),(490,15,'Peanut butter toast + Full-fat milk + Banana + Honey',3,1,'breakfast'),(491,15,'Fried rice + Shrimp + Carrot + Egg',3,1,'lunch'),(492,15,'Spaghetti + Meat sauce + Garlic bread',3,1,'dinner'),(493,15,'Oatmeal + Dried fruits + Nuts + Orange juice',3,2,'breakfast'),(494,15,'Rice + Fish fillet + Steamed corn',3,2,'lunch'),(495,15,'Chicken soup + Rice + Steamed vegetables',3,2,'dinner'),(496,15,'Whole grain toast + Peanut butter + Banana + Milk',3,3,'breakfast'),(497,15,'Noodles + Stir-fried beef + Vegetables',3,3,'lunch'),(498,15,'Grilled fish + Brown rice + Mixed salad',3,3,'dinner'),(499,15,'Boiled eggs x2 + Rice + Sliced tomato',3,4,'breakfast'),(500,15,'Rice + Grilled chicken + Salad + Water',3,4,'lunch'),(501,15,'Rice + Beef stew + Potato + Bread',3,4,'dinner'),(502,15,'Oatmeal + Full cream + Peanut butter + Banana',3,5,'breakfast'),(503,15,'Fried rice + Pork + Egg x2 + Corn',3,5,'lunch'),(504,15,'Rice + Beef stew + Steamed broccoli',3,5,'dinner'),(505,15,'Peanut butter toast + Full-fat milk + Banana + Honey',3,6,'breakfast'),(506,15,'Fried rice + Shrimp + Carrot + Egg',3,6,'lunch'),(507,15,'Spaghetti + Meat sauce + Garlic bread',3,6,'dinner'),(508,15,'Oatmeal + Dried fruits + Nuts + Orange juice',3,7,'breakfast'),(509,15,'Rice + Fish fillet + Steamed corn',3,7,'lunch'),(510,15,'Chicken soup + Rice + Steamed vegetables',3,7,'dinner'),(511,15,'Whole grain toast + Peanut butter + Banana + Milk',4,1,'breakfast'),(512,15,'Noodles + Stir-fried beef + Vegetables',4,1,'lunch'),(513,15,'Grilled fish + Brown rice + Mixed salad',4,1,'dinner'),(514,15,'Boiled eggs x2 + Rice + Sliced tomato',4,2,'breakfast'),(515,15,'Rice + Fish fillet + Steamed corn',4,2,'lunch'),(516,15,'Rice + Beef stew + Potato + Bread',4,2,'dinner'),(517,15,'Oatmeal + Full cream + Peanut butter + Banana',4,3,'breakfast'),(518,15,'Fried rice + Pork + Egg x2 + Corn',4,3,'lunch'),(519,15,'Rice + Beef stew + Steamed broccoli',4,3,'dinner'),(520,15,'Peanut butter toast + Full-fat milk + Banana + Honey',4,4,'breakfast'),(521,15,'Fried rice + Shrimp + Carrot + Egg',4,4,'lunch'),(522,15,'Spaghetti + Meat sauce + Garlic bread',4,4,'dinner'),(523,15,'Oatmeal + Dried fruits + Nuts + Orange juice',4,5,'breakfast'),(524,15,'Rice + Fish fillet + Steamed corn',4,5,'lunch'),(525,15,'Chicken soup + Rice + Steamed vegetables',4,5,'dinner'),(526,15,'Whole grain toast + Peanut butter + Banana + Milk',4,6,'breakfast'),(527,15,'Noodles + Stir-fried beef + Vegetables',4,6,'lunch'),(528,15,'Grilled fish + Brown rice + Mixed salad',4,6,'dinner'),(529,15,'Boiled eggs x2 + Rice + Sliced tomato',4,7,'breakfast'),(530,15,'Rice + Grilled chicken + Salad + Water',4,7,'lunch'),(531,15,'Rice + Beef stew + Potato + Bread',4,7,'dinner'),(535,17,'Peanut butter toast + Full-fat milk + Banana + Honey',1,1,'breakfast'),(536,17,'Fried rice + Egg + Corn',1,1,'lunch'),(537,17,'Chicken leg + Mashed potato with butter + Steamed carrot',1,1,'dinner'),(544,20,'French toast + Strawberry jam + Milk',1,1,'breakfast'),(545,20,'Pasta + Meat bolognese + Cheese + Garlic bread',1,1,'lunch'),(546,20,'Rice + Beef stew + Potato + Bread',1,1,'dinner');
/*!40000 ALTER TABLE `selected_meal_plan_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tips`
--

DROP TABLE IF EXISTS `tips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tips` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('safety','health') NOT NULL,
  `title` varchar(255) NOT NULL,
  `category` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `age_group` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tips`
--

LOCK TABLES `tips` WRITE;
/*!40000 ALTER TABLE `tips` DISABLE KEYS */;
INSERT INTO `tips` VALUES (2,'health','v fdvfvddf','Vaccination','dfd','All Ages','2026-03-28 05:57:10.456296','2026-03-28 05:57:10.456296');
/*!40000 ALTER TABLE `tips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `user_type` enum('parent','advisor','admin') NOT NULL,
  `age` int DEFAULT NULL,
  `approval_status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `experience_years` int DEFAULT NULL,
  `password_reset_token` varchar(255) DEFAULT NULL,
  `password_reset_expires` datetime DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `specialty` varchar(255) DEFAULT NULL,
  `license_number` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `refresh_token` varchar(255) DEFAULT NULL,
  `plan_type` enum('free','premium') NOT NULL DEFAULT 'free',
  PRIMARY KEY (`id`),
  UNIQUE KEY `IDX_97672ac88f789774dd47f7c8be` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'parent@smartmom.com','$2a$2b$10$aICbsW4OHujzT3HpVRzoV.S/httqpnfVZCBqaJ0tBTHNDe3uI.U.S','Sarah Johnson','parent',32,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-14 10:36:46.221395','2026-02-14 10:36:46.303197',NULL,'free'),(3,'hninsunyein07@gmail.com','$2b$10$aICbsW4OHujzT3HpVRzoV.S/httqpnfVZCBqaJ0tBTHNDe3uI.U.S','hninsu','parent',27,'approved',NULL,'f7da3bb2dbc7ee956b6f5d0887149fe738a719bf00a40ee6164e7aae6f34a228','2026-04-24 12:10:42',NULL,NULL,NULL,'2026-02-14 10:36:46.221395','2026-04-24 04:10:42.000000',NULL,'free'),(4,'minmin@gmail.com','$2b$10$NLa9E9G6VUIDSPQA3wjpZei7LmwwpU5MNUl6n9a48vVbByCOza1xy','Ko Min Min','parent',32,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-14 10:36:46.221395','2026-02-14 10:36:46.303197',NULL,'free'),(6,'testmom2@test.com','$2b$10$FvHX8kVD8gwKlpkuG/gI2OpC/Vkac1IEv5/JooiY2CAbw8eOivPJG','Test Mom','parent',30,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-28 10:38:30.432280','2026-02-28 10:38:30.432280',NULL,'free'),(7,'testmom3@test.com','$2b$10$b2lcdXBFCIBlFN.k4VoEmuNDAJGA3VBc9g/nUaaYWed4UinWb/1PG','Test Mom3','parent',28,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-28 10:38:36.050019','2026-02-28 10:38:36.050019',NULL,'free'),(8,'hnin@gmail.com','$2b$10$AVUfRasJb3TR2jmD/5P0zOMLuiKZ2F7lcKrbtuXlS2uvs/74PN5Vq','Aurelia','parent',26,'approved',NULL,'cbda82b2276a3242d24a5b9a94a6a76d54b8ee437988204c0f519c38a8ed147d','2026-02-28 18:50:08',NULL,NULL,NULL,'2026-02-28 10:39:07.044190','2026-02-28 10:50:08.000000',NULL,'free'),(11,'jonanthan@gmail.com','$2b$10$uNDW7r3CIN59Xj6tDUCSTeLDj6q3qXxmDdi7fzd0TdPwhQOj4vfna','Dr.Jonanthan','advisor',NULL,'approved',2,NULL,NULL,'+959444416781','Nutrition','123456','2026-02-28 10:54:24.127419','2026-02-28 11:15:45.000000',NULL,'free'),(12,'admin@smartmom.com','$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','System Admin','admin',NULL,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-28 10:59:01.184195','2026-03-28 05:56:46.000000','f62dcb0359112d5797f89c6583d3f15b5855b55ecc626920f4ebd285b8f6e66a','free'),(13,'hninsunyein@gmail.com','$2b$10$1DtlOWwHbpCTMcxTvUifHu1y60887ri7.euQCAy1DhQSPfxjgjzo6','Hnin Su Nyein','parent',26,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-28 11:18:34.023954','2026-02-28 11:18:34.023954',NULL,'free'),(14,'mpale@gmail.com','$2b$10$HpcKYNb22CDLIzuM6aOnQ./90UmUuhJHzhI8bxpyF8DHpfDjENF8y','MPale','parent',35,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-28 13:00:05.921301','2026-02-28 13:00:05.921301',NULL,'free'),(15,'mpale2@gmail.com','$2b$10$Kfr9LsZBU3coOm.RHNoKI.sYCzQnihpTi1n.ReQL9L.sEm8poFK/G','Dr.Mpale','advisor',NULL,'approved',6,NULL,NULL,'+959444416781','Nutrition','123456','2026-02-28 13:10:49.079243','2026-03-28 02:51:14.000000',NULL,'free'),(16,'wah@gmail.com','$2b$10$3OG8TNPpW268ngBST.enRO9TrSSOfjWd9c.1bYXrGHEhSu3Si.WG2','Daw Wah Wah','parent',40,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-07 03:49:27.569979','2026-03-07 03:49:27.569979',NULL,'free'),(17,'wah123@gmail.com','$2b$10$RbDzmf0L5Fwy5GE2pcFlr.3U1c1GinzJ1FoPuI2TkQLQkqxbmXSwC','Daw Wah Wah','parent',40,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-07 03:53:07.022136','2026-03-07 03:53:07.022136',NULL,'free'),(18,'thandar@gmail.com','$2b$10$CUpXitxDPtZ9Y/.ETHV3I.fvtJFdXVcXe0heZ.rO6HwNHTH77t1fq','Thandar Myint','parent',38,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-09 10:32:34.456907','2026-03-09 10:32:34.456907',NULL,'free'),(19,'thandar38@gmail.com','$2b$10$WKWJqetIESc7KKgtMXXade/TrzzoE7B6EfFUWC3Gs6KhF9/Ban.w6','Thandar','parent',38,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-10 15:29:23.185026','2026-03-28 06:10:20.000000','3970a5c7a26166599cd36f04e50fc7dbf1879fc3fe1559cc5c7a3ab3db0d399d','premium'),(21,'sarah@example.com','$2b$10$hJ6m0urMweqnOkOSX3AzKe1QFayOADkaj3xgyXIYiWLBr03QGLlyq','Sarah Johnson','parent',32,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-26 15:49:11.262951','2026-03-26 15:49:11.000000','97fe1cda49eb8b6aeaf3e13fa2287e29009882c53e567bd84a8c68723f2eedd1','free'),(22,'sarah3333@example.com','$2b$10$whcUOKTDBys.NUzllmw.S.0viQXIwkFJ.ajip3vPjn.6duO/zaLx6','Sarah Johnson','parent',32,'approved',NULL,NULL,NULL,'+959443452655',NULL,NULL,'2026-03-26 16:16:37.175967','2026-03-26 16:16:37.000000','bb7590d974b34788603980cf28990437b1593926a8ff0ad8934018ddb812b799','free'),(23,'parentone@gmail.com','$2b$10$678rJDj/ewFw5ZMQEsNpFe1cyHRhm2nBCRP2XuBoxKwu90X2NDGdO','Parent One','parent',30,'approved',NULL,NULL,NULL,'+959443452653',NULL,NULL,'2026-03-26 16:18:01.537148','2026-03-26 16:18:01.000000','2eaa4eeb49c7d859b523ad94c837fbc31899a98e0588c4736e4ccf330041929c','free'),(24,'parenttwo@gmail.com','$2b$10$PkCHdeDyiZ/2vBQzRAaK0eGFyKzY0naIsqbB46glOSB7a5ZLZXOMO','Parent Two','parent',30,'approved',NULL,NULL,NULL,'+959443452651',NULL,NULL,'2026-03-26 16:30:02.673319','2026-03-28 02:24:16.000000','5f54c33bec790e7c8c825c47ae7bb1ffb3e100e9429c092797d69e43d2e175ba','premium'),(25,'myatnoe22@gmail.com','$2b$10$77KjMJsXM7gp6GUNbuGP9eKk315FitheEBSRE8uUfSzARsECXhjsu','Myat Noe','parent',30,'approved',NULL,NULL,NULL,'+959444416781',NULL,NULL,'2026-03-27 10:16:04.767027','2026-04-24 04:32:40.000000','c88127f9a0a3587b5725536d8cb69b9ebeccc834baecc97a4b57c78e7a630485','free'),(26,'hnin21@gmail.com','$2b$10$qUMJLzJ5dMM/ckqgRcN5rOA0lYhH6Ka5ctMedY/HmnWOeFqMmmXaC','Dr. Hnin','advisor',NULL,'approved',3,NULL,NULL,'09444416782','Child Nutrition','1234','2026-03-28 03:34:52.583429','2026-03-28 05:53:55.000000','1c2da9618d0ce25c1debfb78e91128c3127cf1759ae77532b9aae342a02d7756','free'),(27,'whninphuu@gmail.com','$2b$10$77KjMJsXM7gp6GUNbuGP9eKk315FitheEBSRE8uUfSzARsECXhjsu','Hnin Phuu Wai','parent',30,'approved',NULL,NULL,NULL,'+959444416781',NULL,NULL,'2026-04-24 04:14:56.564237','2026-04-24 04:22:34.000000','7074b0e2e9a69374bf09e54af37ccceedd3a1fd26de011decdacfc27ca40dcba','free');
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

-- Dump completed on 2026-04-24 13:49:51
