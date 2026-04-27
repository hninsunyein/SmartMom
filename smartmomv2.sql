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
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `advisor_availability`
--

LOCK TABLES `advisor_availability` WRITE;
/*!40000 ALTER TABLE `advisor_availability` DISABLE KEYS */;
INSERT INTO `advisor_availability` VALUES (2,11,'monday','09:00:00','17:00:00','2026-02-28 10:54:24.139822','2026-02-28 10:54:24.139822'),(3,11,'tuesday','09:00:00','17:00:00','2026-02-28 10:54:24.143488','2026-02-28 10:54:24.143488'),(4,15,'wednesday','14:00:00','17:00:00','2026-02-28 13:10:49.099620','2026-02-28 13:10:49.099620'),(5,15,'thursday','09:00:00','17:00:00','2026-02-28 13:10:49.107620','2026-02-28 13:10:49.107620'),(6,15,'friday','09:00:00','17:00:00','2026-02-28 13:10:49.114318','2026-02-28 13:10:49.114318'),(11,26,'monday','09:00:00','12:00:00','2026-03-28 03:34:52.593054','2026-03-28 03:34:52.593054'),(12,26,'saturday','09:00:00','12:00:00','2026-03-28 03:34:52.597075','2026-03-28 03:34:52.597075'),(13,26,'sunday','09:00:00','12:00:00','2026-03-28 03:34:52.601180','2026-03-28 03:34:52.601180'),(14,29,'monday','09:00:00','12:00:00','2026-04-24 16:56:11.002909','2026-04-24 16:56:11.002909'),(15,29,'monday','14:00:00','17:00:00','2026-04-24 16:56:11.007703','2026-04-24 16:56:11.007703'),(16,29,'tuesday','09:00:00','12:00:00','2026-04-24 16:56:11.012383','2026-04-24 16:56:11.012383'),(17,29,'tuesday','14:00:00','17:00:00','2026-04-24 16:56:11.018305','2026-04-24 16:56:11.018305');
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `appointments`
--

LOCK TABLES `appointments` WRITE;
/*!40000 ALTER TABLE `appointments` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `children`
--

LOCK TABLES `children` WRITE;
/*!40000 ALTER TABLE `children` DISABLE KEYS */;
INSERT INTO `children` VALUES (1,1,'Emma Johnson','2020-05-15','female','No known allergies',NULL,NULL,NULL,'2026-02-14 10:36:45.458868','2026-02-14 10:36:45.563826'),(9,19,'Hnin Thandar','2018-04-05','female','Peanuts','',NULL,'O+','2026-03-25 02:44:17.211312','2026-03-25 02:44:17.211312'),(17,19,'Hnin Lay','2020-02-28','male','','',NULL,'A-','2026-03-28 02:30:44.170383','2026-03-28 02:30:44.170383'),(21,28,'Baby One','2022-02-25','female','','',NULL,'B-','2026-04-25 06:50:53.917760','2026-04-25 06:50:53.917760');
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `growth_tracking`
--

LOCK TABLES `growth_tracking` WRITE;
/*!40000 ALTER TABLE `growth_tracking` DISABLE KEYS */;
INSERT INTO `growth_tracking` VALUES (7,9,'2026-03-25',120.00,16.60,11.53,NULL,NULL,'2026-03-25 08:07:00.481971'),(8,9,'2026-03-28',100.00,16.90,16.90,NULL,NULL,'2026-03-25 08:07:33.752624'),(9,17,'2026-03-28',119.80,16.50,11.50,NULL,NULL,'2026-03-28 02:30:44.190459'),(11,9,'2026-03-30',120.00,17.00,11.81,NULL,NULL,'2026-03-28 05:50:53.271875'),(14,21,'2026-04-25',110.00,16.40,13.55,NULL,NULL,'2026-04-25 06:50:53.957253');
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
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nutrition_plans`
--

LOCK TABLES `nutrition_plans` WRITE;
/*!40000 ALTER TABLE `nutrition_plans` DISABLE KEYS */;
INSERT INTO `nutrition_plans` VALUES (1,21,'2026-04-25','Full-fat milk + Cheese toast + Boiled egg + Orange juice','Rice + Fish curry + Steamed vegetables','Rice + Steamed chicken + Pumpkin soup',NULL,'Week:1,Day:1','3-5','weight_gain,height_growth','2026-04-25 07:09:32.563591','2026-04-25 07:09:32.563591'),(2,21,'2026-04-26','Yogurt + Mixed berries + Granola','Noodle soup + Chicken + Carrot','Rice + Egg omelette + Stir-fried greens',NULL,'Week:1,Day:2','3-5','weight_gain,height_growth','2026-04-25 07:09:32.568764','2026-04-25 07:09:32.568764'),(3,21,'2026-04-27','French toast + Strawberry jam + Milk','Chicken + Broccoli + Cheese + Milk','Tofu + Edamame + Brown rice + Miso soup',NULL,'Week:1,Day:3','3-5','weight_gain,height_growth','2026-04-25 07:09:32.573003','2026-04-25 07:09:32.573003'),(4,21,'2026-04-28','French toast + Strawberry jam + Milk','Sandwich + Cheese + Tomato + Apple','Rice + Tofu + Vegetable stir-fry',NULL,'Week:1,Day:4','3-5','weight_gain,height_growth','2026-04-25 07:09:32.577306','2026-04-25 07:09:32.577306'),(5,21,'2026-04-29','Cereal with milk + Sliced apple + Water','Pasta + Meat bolognese + Cheese + Garlic bread','Pasta + Minced meat sauce + Cheese',NULL,'Week:1,Day:5','3-5','weight_gain,height_growth','2026-04-25 07:09:32.581742','2026-04-25 07:09:32.581742'),(6,21,'2026-04-30','Full-fat milk + Cheese toast + Boiled egg + Orange juice','Noodle soup + Chicken + Carrot','Rice + Steamed chicken + Pumpkin soup',NULL,'Week:1,Day:6','3-5','weight_gain,height_growth','2026-04-25 07:09:32.587674','2026-04-25 07:09:32.587674'),(7,21,'2026-05-01','Yogurt + Mixed berries + Granola','Noodle soup + Chicken + Carrot','Rice + Egg omelette + Stir-fried greens',NULL,'Week:1,Day:7','3-5','weight_gain,height_growth','2026-04-25 07:09:32.593451','2026-04-25 07:09:32.593451'),(8,21,'2026-05-02','Pancake + Honey + Warm milk','Chicken + Broccoli + Cheese + Milk','Tofu + Edamame + Brown rice + Miso soup',NULL,'Week:2,Day:1','3-5','weight_gain,height_growth','2026-04-25 07:09:32.598677','2026-04-25 07:09:32.598677'),(9,21,'2026-05-03','French toast + Strawberry jam + Milk','Sandwich + Cheese + Tomato + Apple','Rice + Tofu + Vegetable stir-fry',NULL,'Week:2,Day:2','3-5','weight_gain,height_growth','2026-04-25 07:09:32.604556','2026-04-25 07:09:32.604556'),(10,21,'2026-05-04','Cereal with milk + Sliced apple + Water','Pasta + Meat bolognese + Cheese + Garlic bread','Pasta + Minced meat sauce + Cheese',NULL,'Week:2,Day:3','3-5','weight_gain,height_growth','2026-04-25 07:09:32.609557','2026-04-25 07:09:32.609557'),(11,21,'2026-05-05','Full-fat milk + Cheese toast + Boiled egg + Orange juice','Rice + Fish curry + Steamed vegetables','Rice + Steamed chicken + Pumpkin soup',NULL,'Week:2,Day:4','3-5','weight_gain,height_growth','2026-04-25 07:09:32.613817','2026-04-25 07:09:32.613817'),(12,21,'2026-05-06','Yogurt + Mixed berries + Granola','Noodle soup + Chicken + Carrot','Rice + Egg omelette + Stir-fried greens',NULL,'Week:2,Day:5','3-5','weight_gain,height_growth','2026-04-25 07:09:32.618321','2026-04-25 07:09:32.618321'),(13,21,'2026-05-07','Pancake + Honey + Warm milk','Chicken + Broccoli + Cheese + Milk','Tofu + Edamame + Brown rice + Miso soup',NULL,'Week:2,Day:6','3-5','weight_gain,height_growth','2026-04-25 07:09:32.623151','2026-04-25 07:09:32.623151'),(14,21,'2026-05-08','French toast + Strawberry jam + Milk','Sandwich + Cheese + Tomato + Apple','Rice + Tofu + Vegetable stir-fry',NULL,'Week:2,Day:7','3-5','weight_gain,height_growth','2026-04-25 07:09:32.627516','2026-04-25 07:09:32.627516'),(15,21,'2026-05-09','Cereal with milk + Sliced apple + Water','Pasta + Meat bolognese + Cheese + Garlic bread','Pasta + Minced meat sauce + Cheese',NULL,'Week:3,Day:1','3-5','weight_gain,height_growth','2026-04-25 07:09:32.631635','2026-04-25 07:09:32.631635'),(16,21,'2026-05-10','Full-fat milk + Cheese toast + Boiled egg + Orange juice','Rice + Fish curry + Steamed vegetables','Rice + Steamed chicken + Pumpkin soup',NULL,'Week:3,Day:2','3-5','weight_gain,height_growth','2026-04-25 07:09:32.636011','2026-04-25 07:09:32.636011'),(17,21,'2026-05-11','Yogurt + Mixed berries + Granola','Noodle soup + Chicken + Carrot','Rice + Egg omelette + Stir-fried greens',NULL,'Week:3,Day:3','3-5','weight_gain,height_growth','2026-04-25 07:09:32.640386','2026-04-25 07:09:32.640386'),(18,21,'2026-05-12','Pancake + Honey + Warm milk','Chicken + Broccoli + Cheese + Milk','Tofu + Edamame + Brown rice + Miso soup',NULL,'Week:3,Day:4','3-5','weight_gain,height_growth','2026-04-25 07:09:32.645315','2026-04-25 07:09:32.645315'),(19,21,'2026-05-13','French toast + Strawberry jam + Milk','Sandwich + Cheese + Tomato + Apple','Rice + Tofu + Vegetable stir-fry',NULL,'Week:3,Day:5','3-5','weight_gain,height_growth','2026-04-25 07:09:32.650527','2026-04-25 07:09:32.650527'),(20,21,'2026-05-14','Cereal with milk + Sliced apple + Water','Pasta + Meat bolognese + Cheese + Garlic bread','Pasta + Minced meat sauce + Cheese',NULL,'Week:3,Day:6','3-5','weight_gain,height_growth','2026-04-25 07:09:32.655566','2026-04-25 07:09:32.655566'),(21,21,'2026-05-15','Full-fat milk + Cheese toast + Boiled egg + Orange juice','Rice + Fish curry + Steamed vegetables','Rice + Steamed chicken + Pumpkin soup',NULL,'Week:3,Day:7','3-5','weight_gain,height_growth','2026-04-25 07:09:32.663216','2026-04-25 07:09:32.663216'),(22,21,'2026-05-16','Yogurt + Mixed berries + Granola','Noodle soup + Chicken + Carrot','Rice + Egg omelette + Stir-fried greens',NULL,'Week:4,Day:1','3-5','weight_gain,height_growth','2026-04-25 07:09:32.669487','2026-04-25 07:09:32.669487'),(23,21,'2026-05-17','Pancake + Honey + Warm milk','Chicken + Broccoli + Cheese + Milk','Tofu + Edamame + Brown rice + Miso soup',NULL,'Week:4,Day:2','3-5','weight_gain,height_growth','2026-04-25 07:09:32.675035','2026-04-25 07:09:32.675035'),(24,21,'2026-05-18','French toast + Strawberry jam + Milk','Sandwich + Cheese + Tomato + Apple','Rice + Tofu + Vegetable stir-fry',NULL,'Week:4,Day:3','3-5','weight_gain,height_growth','2026-04-25 07:09:32.680098','2026-04-25 07:09:32.680098'),(25,21,'2026-05-19','Cereal with milk + Sliced apple + Water','Pasta + Meat bolognese + Cheese + Garlic bread','Pasta + Minced meat sauce + Cheese',NULL,'Week:4,Day:4','3-5','weight_gain,height_growth','2026-04-25 07:09:32.688428','2026-04-25 07:09:32.688428'),(26,21,'2026-05-20','Full-fat milk + Cheese toast + Boiled egg + Orange juice','Rice + Fish curry + Steamed vegetables','Rice + Steamed chicken + Pumpkin soup',NULL,'Week:4,Day:5','3-5','weight_gain,height_growth','2026-04-25 07:09:32.695635','2026-04-25 07:09:32.695635'),(27,21,'2026-05-21','Yogurt + Mixed berries + Granola','Noodle soup + Chicken + Carrot','Rice + Egg omelette + Stir-fried greens',NULL,'Week:4,Day:6','3-5','weight_gain,height_growth','2026-04-25 07:09:32.703646','2026-04-25 07:09:32.703646'),(28,21,'2026-05-22','Pancake + Honey + Warm milk','Chicken + Broccoli + Cheese + Milk','Tofu + Edamame + Brown rice + Miso soup',NULL,'Week:4,Day:7','3-5','weight_gain,height_growth','2026-04-25 07:09:32.710217','2026-04-25 07:09:32.710217');
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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `parent_meal_selections`
--

LOCK TABLES `parent_meal_selections` WRITE;
/*!40000 ALTER TABLE `parent_meal_selections` DISABLE KEYS */;
INSERT INTO `parent_meal_selections` VALUES (23,28,21,'3-5','weight_gain,height_growth,immunity_boost','premium',13.55,'2026-04-25 07:00:04.799469',0),(24,28,21,'3-5','weight_gain,height_growth','premium',13.55,'2026-04-25 07:09:32.120266',1);
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
) ENGINE=InnoDB AUTO_INCREMENT=883 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `selected_meal_plan_items`
--

LOCK TABLES `selected_meal_plan_items` WRITE;
/*!40000 ALTER TABLE `selected_meal_plan_items` DISABLE KEYS */;
INSERT INTO `selected_meal_plan_items` VALUES (715,23,'Cereal with milk + Sliced apple + Water',1,1,'breakfast'),(716,23,'Rice + Stir-fried pork + Cabbage',1,1,'lunch'),(717,23,'Rice + Steamed chicken + Pumpkin soup',1,1,'dinner'),(718,23,'Smoothie (orange + mango + ginger) + Greek yogurt',1,2,'breakfast'),(719,23,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',1,2,'lunch'),(720,23,'Chicken noodle soup + Soft bread',1,2,'dinner'),(721,23,'Orange juice + Egg + Spinach omelette + Whole toast',1,3,'breakfast'),(722,23,'Lentil vegetable soup + Brown rice + Yogurt',1,3,'lunch'),(723,23,'Rice + Beef stew + Potato + Bread',1,3,'dinner'),(724,23,'Fried egg + Rice + Sliced cucumber',1,4,'breakfast'),(725,23,'Salmon + Brown rice + Spinach + Milk',1,4,'lunch'),(726,23,'Rice + Tofu + Vegetable stir-fry',1,4,'dinner'),(727,23,'Pancake + Honey + Warm milk',1,5,'breakfast'),(728,23,'Chicken congee + Sliced ginger + Green onion',1,5,'lunch'),(729,23,'Chicken soup + Cheese bread + Warm milk',1,5,'dinner'),(730,23,'Cereal with milk + Sliced apple + Water',1,6,'breakfast'),(731,23,'Rice + Stir-fried pork + Cabbage',1,6,'lunch'),(732,23,'Rice + Steamed chicken + Pumpkin soup',1,6,'dinner'),(733,23,'Smoothie (orange + mango + ginger) + Greek yogurt',1,7,'breakfast'),(734,23,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',1,7,'lunch'),(735,23,'Chicken noodle soup + Soft bread',1,7,'dinner'),(736,23,'Orange juice + Egg + Spinach omelette + Whole toast',2,1,'breakfast'),(737,23,'Lentil vegetable soup + Brown rice + Yogurt',2,1,'lunch'),(738,23,'Rice + Beef stew + Potato + Bread',2,1,'dinner'),(739,23,'Fried egg + Rice + Sliced cucumber',2,2,'breakfast'),(740,23,'Salmon + Brown rice + Spinach + Milk',2,2,'lunch'),(741,23,'Rice + Tofu + Vegetable stir-fry',2,2,'dinner'),(742,23,'Pancake + Honey + Warm milk',2,3,'breakfast'),(743,23,'Chicken congee + Sliced ginger + Green onion',2,3,'lunch'),(744,23,'Chicken soup + Cheese bread + Warm milk',2,3,'dinner'),(745,23,'Cereal with milk + Sliced apple + Water',2,4,'breakfast'),(746,23,'Rice + Stir-fried pork + Cabbage',2,4,'lunch'),(747,23,'Rice + Steamed chicken + Pumpkin soup',2,4,'dinner'),(748,23,'Smoothie (orange + mango + ginger) + Greek yogurt',2,5,'breakfast'),(749,23,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',2,5,'lunch'),(750,23,'Chicken noodle soup + Soft bread',2,5,'dinner'),(751,23,'Orange juice + Egg + Spinach omelette + Whole toast',2,6,'breakfast'),(752,23,'Lentil vegetable soup + Brown rice + Yogurt',2,6,'lunch'),(753,23,'Rice + Beef stew + Potato + Bread',2,6,'dinner'),(754,23,'Fried egg + Rice + Sliced cucumber',2,7,'breakfast'),(755,23,'Salmon + Brown rice + Spinach + Milk',2,7,'lunch'),(756,23,'Rice + Tofu + Vegetable stir-fry',2,7,'dinner'),(757,23,'Pancake + Honey + Warm milk',3,1,'breakfast'),(758,23,'Chicken congee + Sliced ginger + Green onion',3,1,'lunch'),(759,23,'Chicken soup + Cheese bread + Warm milk',3,1,'dinner'),(760,23,'Cereal with milk + Sliced apple + Water',3,2,'breakfast'),(761,23,'Rice + Stir-fried pork + Cabbage',3,2,'lunch'),(762,23,'Rice + Steamed chicken + Pumpkin soup',3,2,'dinner'),(763,23,'Smoothie (orange + mango + ginger) + Greek yogurt',3,3,'breakfast'),(764,23,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',3,3,'lunch'),(765,23,'Chicken noodle soup + Soft bread',3,3,'dinner'),(766,23,'Orange juice + Egg + Spinach omelette + Whole toast',3,4,'breakfast'),(767,23,'Lentil vegetable soup + Brown rice + Yogurt',3,4,'lunch'),(768,23,'Rice + Beef stew + Potato + Bread',3,4,'dinner'),(769,23,'Fried egg + Rice + Sliced cucumber',3,5,'breakfast'),(770,23,'Salmon + Brown rice + Spinach + Milk',3,5,'lunch'),(771,23,'Rice + Tofu + Vegetable stir-fry',3,5,'dinner'),(772,23,'Pancake + Honey + Warm milk',3,6,'breakfast'),(773,23,'Chicken congee + Sliced ginger + Green onion',3,6,'lunch'),(774,23,'Chicken soup + Cheese bread + Warm milk',3,6,'dinner'),(775,23,'Cereal with milk + Sliced apple + Water',3,7,'breakfast'),(776,23,'Rice + Stir-fried pork + Cabbage',3,7,'lunch'),(777,23,'Rice + Steamed chicken + Pumpkin soup',3,7,'dinner'),(778,23,'Smoothie (orange + mango + ginger) + Greek yogurt',4,1,'breakfast'),(779,23,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',4,1,'lunch'),(780,23,'Chicken noodle soup + Soft bread',4,1,'dinner'),(781,23,'Orange juice + Egg + Spinach omelette + Whole toast',4,2,'breakfast'),(782,23,'Lentil vegetable soup + Brown rice + Yogurt',4,2,'lunch'),(783,23,'Rice + Beef stew + Potato + Bread',4,2,'dinner'),(784,23,'Fried egg + Rice + Sliced cucumber',4,3,'breakfast'),(785,23,'Salmon + Brown rice + Spinach + Milk',4,3,'lunch'),(786,23,'Rice + Tofu + Vegetable stir-fry',4,3,'dinner'),(787,23,'Pancake + Honey + Warm milk',4,4,'breakfast'),(788,23,'Chicken congee + Sliced ginger + Green onion',4,4,'lunch'),(789,23,'Chicken soup + Cheese bread + Warm milk',4,4,'dinner'),(790,23,'Cereal with milk + Sliced apple + Water',4,5,'breakfast'),(791,23,'Rice + Stir-fried pork + Cabbage',4,5,'lunch'),(792,23,'Rice + Steamed chicken + Pumpkin soup',4,5,'dinner'),(793,23,'Smoothie (orange + mango + ginger) + Greek yogurt',4,6,'breakfast'),(794,23,'Rice x2 servings + Chicken thigh + Fried egg + Vegetables',4,6,'lunch'),(795,23,'Chicken noodle soup + Soft bread',4,6,'dinner'),(796,23,'Orange juice + Egg + Spinach omelette + Whole toast',4,7,'breakfast'),(797,23,'Lentil vegetable soup + Brown rice + Yogurt',4,7,'lunch'),(798,23,'Rice + Beef stew + Potato + Bread',4,7,'dinner'),(799,24,'Full-fat milk + Cheese toast + Boiled egg + Orange juice',1,1,'breakfast'),(800,24,'Rice + Fish curry + Steamed vegetables',1,1,'lunch'),(801,24,'Rice + Steamed chicken + Pumpkin soup',1,1,'dinner'),(802,24,'Yogurt + Mixed berries + Granola',1,2,'breakfast'),(803,24,'Noodle soup + Chicken + Carrot',1,2,'lunch'),(804,24,'Rice + Egg omelette + Stir-fried greens',1,2,'dinner'),(805,24,'French toast + Strawberry jam + Milk',1,3,'breakfast'),(806,24,'Chicken + Broccoli + Cheese + Milk',1,3,'lunch'),(807,24,'Tofu + Edamame + Brown rice + Miso soup',1,3,'dinner'),(808,24,'French toast + Strawberry jam + Milk',1,4,'breakfast'),(809,24,'Sandwich + Cheese + Tomato + Apple',1,4,'lunch'),(810,24,'Rice + Tofu + Vegetable stir-fry',1,4,'dinner'),(811,24,'Cereal with milk + Sliced apple + Water',1,5,'breakfast'),(812,24,'Pasta + Meat bolognese + Cheese + Garlic bread',1,5,'lunch'),(813,24,'Pasta + Minced meat sauce + Cheese',1,5,'dinner'),(814,24,'Full-fat milk + Cheese toast + Boiled egg + Orange juice',1,6,'breakfast'),(815,24,'Noodle soup + Chicken + Carrot',1,6,'lunch'),(816,24,'Rice + Steamed chicken + Pumpkin soup',1,6,'dinner'),(817,24,'Yogurt + Mixed berries + Granola',1,7,'breakfast'),(818,24,'Noodle soup + Chicken + Carrot',1,7,'lunch'),(819,24,'Rice + Egg omelette + Stir-fried greens',1,7,'dinner'),(820,24,'Pancake + Honey + Warm milk',2,1,'breakfast'),(821,24,'Chicken + Broccoli + Cheese + Milk',2,1,'lunch'),(822,24,'Tofu + Edamame + Brown rice + Miso soup',2,1,'dinner'),(823,24,'French toast + Strawberry jam + Milk',2,2,'breakfast'),(824,24,'Sandwich + Cheese + Tomato + Apple',2,2,'lunch'),(825,24,'Rice + Tofu + Vegetable stir-fry',2,2,'dinner'),(826,24,'Cereal with milk + Sliced apple + Water',2,3,'breakfast'),(827,24,'Pasta + Meat bolognese + Cheese + Garlic bread',2,3,'lunch'),(828,24,'Pasta + Minced meat sauce + Cheese',2,3,'dinner'),(829,24,'Full-fat milk + Cheese toast + Boiled egg + Orange juice',2,4,'breakfast'),(830,24,'Rice + Fish curry + Steamed vegetables',2,4,'lunch'),(831,24,'Rice + Steamed chicken + Pumpkin soup',2,4,'dinner'),(832,24,'Yogurt + Mixed berries + Granola',2,5,'breakfast'),(833,24,'Noodle soup + Chicken + Carrot',2,5,'lunch'),(834,24,'Rice + Egg omelette + Stir-fried greens',2,5,'dinner'),(835,24,'Pancake + Honey + Warm milk',2,6,'breakfast'),(836,24,'Chicken + Broccoli + Cheese + Milk',2,6,'lunch'),(837,24,'Tofu + Edamame + Brown rice + Miso soup',2,6,'dinner'),(838,24,'French toast + Strawberry jam + Milk',2,7,'breakfast'),(839,24,'Sandwich + Cheese + Tomato + Apple',2,7,'lunch'),(840,24,'Rice + Tofu + Vegetable stir-fry',2,7,'dinner'),(841,24,'Cereal with milk + Sliced apple + Water',3,1,'breakfast'),(842,24,'Pasta + Meat bolognese + Cheese + Garlic bread',3,1,'lunch'),(843,24,'Pasta + Minced meat sauce + Cheese',3,1,'dinner'),(844,24,'Full-fat milk + Cheese toast + Boiled egg + Orange juice',3,2,'breakfast'),(845,24,'Rice + Fish curry + Steamed vegetables',3,2,'lunch'),(846,24,'Rice + Steamed chicken + Pumpkin soup',3,2,'dinner'),(847,24,'Yogurt + Mixed berries + Granola',3,3,'breakfast'),(848,24,'Noodle soup + Chicken + Carrot',3,3,'lunch'),(849,24,'Rice + Egg omelette + Stir-fried greens',3,3,'dinner'),(850,24,'Pancake + Honey + Warm milk',3,4,'breakfast'),(851,24,'Chicken + Broccoli + Cheese + Milk',3,4,'lunch'),(852,24,'Tofu + Edamame + Brown rice + Miso soup',3,4,'dinner'),(853,24,'French toast + Strawberry jam + Milk',3,5,'breakfast'),(854,24,'Sandwich + Cheese + Tomato + Apple',3,5,'lunch'),(855,24,'Rice + Tofu + Vegetable stir-fry',3,5,'dinner'),(856,24,'Cereal with milk + Sliced apple + Water',3,6,'breakfast'),(857,24,'Pasta + Meat bolognese + Cheese + Garlic bread',3,6,'lunch'),(858,24,'Pasta + Minced meat sauce + Cheese',3,6,'dinner'),(859,24,'Full-fat milk + Cheese toast + Boiled egg + Orange juice',3,7,'breakfast'),(860,24,'Rice + Fish curry + Steamed vegetables',3,7,'lunch'),(861,24,'Rice + Steamed chicken + Pumpkin soup',3,7,'dinner'),(862,24,'Yogurt + Mixed berries + Granola',4,1,'breakfast'),(863,24,'Noodle soup + Chicken + Carrot',4,1,'lunch'),(864,24,'Rice + Egg omelette + Stir-fried greens',4,1,'dinner'),(865,24,'Pancake + Honey + Warm milk',4,2,'breakfast'),(866,24,'Chicken + Broccoli + Cheese + Milk',4,2,'lunch'),(867,24,'Tofu + Edamame + Brown rice + Miso soup',4,2,'dinner'),(868,24,'French toast + Strawberry jam + Milk',4,3,'breakfast'),(869,24,'Sandwich + Cheese + Tomato + Apple',4,3,'lunch'),(870,24,'Rice + Tofu + Vegetable stir-fry',4,3,'dinner'),(871,24,'Cereal with milk + Sliced apple + Water',4,4,'breakfast'),(872,24,'Pasta + Meat bolognese + Cheese + Garlic bread',4,4,'lunch'),(873,24,'Pasta + Minced meat sauce + Cheese',4,4,'dinner'),(874,24,'Full-fat milk + Cheese toast + Boiled egg + Orange juice',4,5,'breakfast'),(875,24,'Rice + Fish curry + Steamed vegetables',4,5,'lunch'),(876,24,'Rice + Steamed chicken + Pumpkin soup',4,5,'dinner'),(877,24,'Yogurt + Mixed berries + Granola',4,6,'breakfast'),(878,24,'Noodle soup + Chicken + Carrot',4,6,'lunch'),(879,24,'Rice + Egg omelette + Stir-fried greens',4,6,'dinner'),(880,24,'Pancake + Honey + Warm milk',4,7,'breakfast'),(881,24,'Chicken + Broccoli + Cheese + Milk',4,7,'lunch'),(882,24,'Tofu + Edamame + Brown rice + Miso soup',4,7,'dinner');
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
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'parent@smartmom.com','$2b$10$N1rejWNPGk8./zPyIPyx0eWhdVl7LyRReDbTyWFUAsEGPG1tb30Se','Sarah Johnson','parent',32,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-14 10:36:46.221395','2026-04-24 07:42:58.000000','0f4d0900503b6f2aff55c0bd988beff67b28acaa19b05772ff301bfaa8724c36','free'),(3,'hninsunyein07@gmail.com','$2b$10$aICbsW4OHujzT3HpVRzoV.S/httqpnfVZCBqaJ0tBTHNDe3uI.U.S','hninsu','parent',27,'approved',NULL,'f7da3bb2dbc7ee956b6f5d0887149fe738a719bf00a40ee6164e7aae6f34a228','2026-04-24 12:10:42',NULL,NULL,NULL,'2026-02-14 10:36:46.221395','2026-04-24 04:10:42.000000',NULL,'free'),(11,'jonanthan@gmail.com','$2b$10$uNDW7r3CIN59Xj6tDUCSTeLDj6q3qXxmDdi7fzd0TdPwhQOj4vfna','Dr.Jonanthan','advisor',NULL,'approved',2,NULL,NULL,'+959444416781','Nutrition','123456','2026-02-28 10:54:24.127419','2026-02-28 11:15:45.000000',NULL,'free'),(12,'admin@smartmom.com','$2b$10$9fSH2HZch2UmPt2zJtULkeeT18EK/8ezRWxuLsvHtUAZ780DW.5xW','System Admin','admin',NULL,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-02-28 10:59:01.184195','2026-04-24 16:57:24.000000','0e507c3b9a562cf5d8ad0c977e1bcf6d63178cc6da54d04833063d50888db66a','free'),(15,'mpale2@gmail.com','$2b$10$Kfr9LsZBU3coOm.RHNoKI.sYCzQnihpTi1n.ReQL9L.sEm8poFK/G','Dr.Mpale','advisor',NULL,'approved',6,NULL,NULL,'+959444416781','Nutrition','123456','2026-02-28 13:10:49.079243','2026-03-28 02:51:14.000000',NULL,'free'),(19,'thandar38@gmail.com','$2b$10$WKWJqetIESc7KKgtMXXade/TrzzoE7B6EfFUWC3Gs6KhF9/Ban.w6','Thandar','parent',38,'approved',NULL,NULL,NULL,NULL,NULL,NULL,'2026-03-10 15:29:23.185026','2026-03-28 06:10:20.000000','3970a5c7a26166599cd36f04e50fc7dbf1879fc3fe1559cc5c7a3ab3db0d399d','premium'),(26,'hnin21@gmail.com','$2b$10$qUMJLzJ5dMM/ckqgRcN5rOA0lYhH6Ka5ctMedY/HmnWOeFqMmmXaC','Dr. Hnin','advisor',NULL,'approved',3,NULL,NULL,'09444416782','Child Nutrition','1234','2026-03-28 03:34:52.583429','2026-03-28 05:53:55.000000','1c2da9618d0ce25c1debfb78e91128c3127cf1759ae77532b9aae342a02d7756','free'),(28,'parentv2@smartmom.com','$2b$10$DATDhvyh2mBTz1wWR/FK/uBx3stBxZprmQDeMlv.qCp7dRq9BAuie','Premium Parent','parent',30,'approved',NULL,NULL,NULL,'+959452333332',NULL,NULL,'2026-04-24 07:45:48.438867','2026-04-25 07:36:52.000000','906f3c88cac2b82c70d63f9d42e6fdbed2f283633bc6941ae6a817eaf33c86dc','premium'),(29,'advisor@smartmom.com','$2b$10$X4X3VPKvWzqB/w96GAMNKO8c3b6dHu85.OLTc7N0uWR8aFKQFrUOi','SM Advisor','advisor',NULL,'approved',3,NULL,NULL,'+959444416784','Child Nutrition','1234456','2026-04-24 16:56:10.983608','2026-04-24 16:58:05.000000','44b6e5debdb5e1508390290f4815c62ce120ea72f3b95ecf2fc35b6dec8e51e2','free');
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

-- Dump completed on 2026-04-27 13:36:54
