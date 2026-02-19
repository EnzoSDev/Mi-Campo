-- Adminer 5.4.1 MariaDB 10.4.32-MariaDB dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `campaigns`;
CREATE TABLE `campaigns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lot_id` int(11) NOT NULL,
  `campaign_name` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `description` varchar(100) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `lot_id` (`lot_id`),
  CONSTRAINT `campaigns_ibfk_1` FOREIGN KEY (`lot_id`) REFERENCES `lots` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `countries`;
CREATE TABLE `countries` (
  `code` char(2) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `countries` (`code`, `name`) VALUES
('AR',	'Argentina'),
('BO',	'Bolivia'),
('BR',	'Brasil'),
('CL',	'Chile'),
('CO',	'Colombia'),
('EC',	'Ecuador'),
('PE',	'Peru'),
('PY',	'Paraguay'),
('UY',	'Uruguay'),
('VE',	'Venezuela');

DROP TABLE IF EXISTS `fertilizations`;
CREATE TABLE `fertilizations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `dose` decimal(10,2) NOT NULL,
  `date_applied` date NOT NULL DEFAULT curdate(),
  `method` varchar(100) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `campaign_id` (`campaign_id`),
  CONSTRAINT `fertilizations_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `fields`;
CREATE TABLE `fields` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `field_name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lng` decimal(10,8) NOT NULL,
  `location_name` varchar(100) NOT NULL,
  `area_ha` double NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fields_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `fields` (`id`, `user_id`, `field_name`, `description`, `lat`, `lng`, `location_name`, `area_ha`, `is_active`, `created_at`) VALUES
(24,	15,	'Campo 1',	'No pasa nada',	-5.91853135,	34.05019954,	'Mar del Plata Argentina',	178598.74127899113,	1,	'2026-02-18 12:05:14'),
(25,	15,	'Estancia ',	'Ruta 226 - \n- 15,6 km',	-37.90287529,	-57.75548964,	'Mar del Plata,  Provincia de Buenos Aires ',	0.15195613192758606,	1,	'2026-02-18 12:38:44');

DROP TABLE IF EXISTS `field_coordinates`;
CREATE TABLE `field_coordinates` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `field_id` int(11) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `point_order` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `field_id` (`field_id`),
  CONSTRAINT `field_coordinates_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `field_coordinates` (`id`, `field_id`, `latitude`, `longitude`, `point_order`) VALUES
(2,	24,	-4.05611,	31.503,	1),
(3,	24,	-7.00163,	31.9397,	2),
(4,	24,	-7.97973,	36.4195,	3),
(5,	24,	-4.63665,	36.3386,	4),
(6,	25,	-37.9008,	-57.755,	1),
(7,	25,	-37.9019,	-57.7522,	2),
(8,	25,	-37.9051,	-57.7563,	3),
(9,	25,	-37.9037,	-57.7585,	4);

DROP TABLE IF EXISTS `harvests`;
CREATE TABLE `harvests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) NOT NULL,
  `harvest_date` date NOT NULL DEFAULT curdate(),
  `total_yield_kg` decimal(10,2) NOT NULL,
  `moisture_percentage` decimal(5,2) NOT NULL,
  `notes` varchar(400) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `campaign_id` (`campaign_id`),
  CONSTRAINT `harvests_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `lots`;
CREATE TABLE `lots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `field_id` int(11) NOT NULL,
  `lot_name` varchar(100) NOT NULL,
  `area_ha` double NOT NULL,
  `description` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `field_id` (`field_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `lots` (`id`, `field_id`, `lot_name`, `area_ha`, `description`, `is_active`, `created_at`) VALUES
(20,	24,	'Bsbdbd',	8610.819676416146,	'Bdbdbd',	1,	'2026-02-19 18:37:37'),
(21,	24,	'Wsbz',	10869.12698707786,	'Bzbsbs',	1,	'2026-02-19 19:28:02'),
(22,	25,	'Lote 1',	0.03071248944690135,	'Soja',	1,	'2026-02-19 19:49:27');

DROP TABLE IF EXISTS `lot_coordinates`;
CREATE TABLE `lot_coordinates` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lot_id` int(11) NOT NULL,
  `latitude` float NOT NULL,
  `longitude` float NOT NULL,
  `point_order` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `lot_id` (`lot_id`),
  CONSTRAINT `lot_coordinates_ibfk_1` FOREIGN KEY (`lot_id`) REFERENCES `lots` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `lot_coordinates` (`id`, `lot_id`, `latitude`, `longitude`, `point_order`) VALUES
(9,	20,	-4.64557,	32.0285,	1),
(10,	20,	-5.4556,	32.078,	2),
(11,	20,	-5.48484,	32.8647,	3),
(12,	20,	-4.56794,	32.8531,	4),
(13,	21,	-4.81547,	32.5198,	1),
(14,	21,	-5.60805,	32.3995,	2),
(15,	21,	-5.6746,	33.3893,	3),
(16,	21,	-4.78881,	33.6167,	4),
(17,	22,	-37.901,	-57.755,	1),
(18,	22,	-37.9013,	-57.7542,	2),
(19,	22,	-37.9038,	-57.7573,	3),
(20,	22,	-37.9033,	-57.7578,	4);

DROP TABLE IF EXISTS `observations`;
CREATE TABLE `observations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) NOT NULL,
  `observation_date` date NOT NULL DEFAULT curdate(),
  `note` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `campaign_id` (`campaign_id`),
  CONSTRAINT `observations_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `sowings`;
CREATE TABLE `sowings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) NOT NULL,
  `crop_type` varchar(100) NOT NULL,
  `variety` varchar(100) NOT NULL,
  `sowing_date` date NOT NULL DEFAULT curdate(),
  `density` int(11) NOT NULL,
  `row_spacing` decimal(5,2) NOT NULL,
  `method` varchar(100) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `campaign_id` (`campaign_id`),
  CONSTRAINT `sowings_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `sprayings`;
CREATE TABLE `sprayings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) NOT NULL,
  `product_name` varchar(100) NOT NULL,
  `dose` decimal(10,2) NOT NULL,
  `date_applied` date NOT NULL DEFAULT curdate(),
  `target` varchar(100) NOT NULL,
  `method` varchar(100) NOT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `campaign_id` (`campaign_id`),
  CONSTRAINT `sprayings_ibfk_1` FOREIGN KEY (`campaign_id`) REFERENCES `campaigns` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hashed` varchar(255) NOT NULL,
  `country_code` char(2) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `country_code` (`country_code`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`country_code`) REFERENCES `countries` (`code`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users` (`id`, `username`, `email`, `password_hashed`, `country_code`, `is_active`, `created_at`) VALUES
(5,	'enzodev',	'enzo@mail.com',	'$2b$10$hzzZRDGcOxSQbhxS80T4S.OnPzswlRQj3COUTte4XkcUnILOjGB0y',	'AR',	1,	'2026-01-13 22:58:27'),
(15,	'Enzo',	'enzosorrenti5@gmail.com',	'$2b$10$gaR4cGmhG81K9iUOI8pBX.sSIGiBKmcS3r/EK1L4sMRQmofzfZQdi',	'AR',	1,	'2026-02-03 11:04:58'),
(16,	'Matías ',	'matisorrenti@gmail..com',	'$2b$10$3PNrxaq1YOY4teh7XpcAjOkVOs00myb8DsB15gBUU5o6dzlIMipFW',	'AR',	1,	'2026-02-04 18:30:09');

-- 2026-02-19 23:43:46 UTC