-- Adminer 5.4.1 MariaDB 10.4.32-MariaDB dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `campaigns`;
CREATE TABLE `campaigns` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `plot_id` int(11) NOT NULL,
  `campaign_name` varchar(100) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `description` varchar(100) NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `plot_id` (`plot_id`),
  CONSTRAINT `campaigns_ibfk_1` FOREIGN KEY (`plot_id`) REFERENCES `plots` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `campaigns` (`id`, `plot_id`, `campaign_name`, `start_date`, `end_date`, `description`, `is_active`, `created_at`) VALUES
(1,	4,	'Camapaña 1',	'0000-00-00',	'0000-00-00',	'Descripcion del lote 1',	1,	'2026-01-15 20:30:36');

DROP TABLE IF EXISTS `countries`;
CREATE TABLE `countries` (
  `code` char(2) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `countries` (`code`, `name`) VALUES
('AR',	'Argentina'),
('BO',	'Bolivia'),
('BR',	'Brazil'),
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

INSERT INTO `fertilizations` (`id`, `campaign_id`, `product_name`, `dose`, `date_applied`, `method`, `notes`, `created_at`) VALUES
(1,	1,	'Urea',	150.00,	'2026-01-20',	'Aspersión',	'Aplicada en etapa V4',	'2026-01-20 20:14:58');

DROP TABLE IF EXISTS `fields`;
CREATE TABLE `fields` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `field_name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `lat` decimal(10,8) NOT NULL,
  `lng` decimal(10,8) NOT NULL,
  `coordinates_polygon` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`coordinates_polygon`)),
  `location_name` varchar(100) NOT NULL,
  `area_ha` double NOT NULL,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `coordinates_polygon` (`coordinates_polygon`) USING HASH,
  KEY `user_id` (`user_id`),
  CONSTRAINT `fields_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `fields` (`id`, `user_id`, `field_name`, `description`, `lat`, `lng`, `coordinates_polygon`, `location_name`, `area_ha`, `is_active`, `created_at`) VALUES
(4,	5,	'Campo 1',	'Descripcion del campo 1',	-34.60370000,	-58.38160000,	'[[-59.12,-37.32],[-59.13,-37.33],[-59.11,-37.34],[-59.12,-37.32]]',	'Ubicación del campo 1',	147.48,	1,	'2026-01-13 23:03:37');

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

INSERT INTO `harvests` (`id`, `campaign_id`, `harvest_date`, `total_yield_kg`, `moisture_percentage`, `notes`, `created_at`) VALUES
(1,	1,	'2026-05-15',	4500.00,	14.50,	'Cosecha mecánica en condiciones óptimas',	'2026-01-20 20:19:52');

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

INSERT INTO `observations` (`id`, `campaign_id`, `observation_date`, `note`, `created_at`) VALUES
(1,	1,	'2026-02-10',	'Plantas con buen desarrollo, sin síntomas de plagas',	'2026-01-20 20:21:57');

DROP TABLE IF EXISTS `plots`;
CREATE TABLE `plots` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `field_id` int(11) NOT NULL,
  `plot_name` varchar(100) NOT NULL,
  `coordinates_polygon` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`coordinates_polygon`)),
  `area_ha` double NOT NULL,
  `description` text NOT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `coordinates_polygon` (`coordinates_polygon`) USING HASH,
  KEY `field_id` (`field_id`),
  CONSTRAINT `plots_ibfk_1` FOREIGN KEY (`field_id`) REFERENCES `fields` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `plots` (`id`, `field_id`, `plot_name`, `coordinates_polygon`, `area_ha`, `description`, `is_active`, `created_at`) VALUES
(4,	4,	'Lote 1',	'[[-59.12,-37.32],[-59.13,-20.41],[-59.11,-37.34],[-59.12,-37.32]]',	91122.15,	'Descripcion del lote 1',	1,	'2026-01-15 19:25:49');

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

INSERT INTO `sowings` (`id`, `campaign_id`, `crop_type`, `variety`, `sowing_date`, `density`, `row_spacing`, `method`, `notes`, `created_at`) VALUES
(1,	1,	'Maíz',	'DK 7010',	'2026-01-15',	75000,	0.75,	'Siembra directa',	'Siembra realizada en condiciones óptimas',	'2026-01-20 20:13:10');

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

INSERT INTO `sprayings` (`id`, `campaign_id`, `product_name`, `dose`, `date_applied`, `target`, `method`, `notes`, `created_at`) VALUES
(4,	1,	'Glifosato',	2.50,	'2026-01-22',	'Malezas',	'Pulverizador terrestre',	'Control de malezas de hoja ancha',	'2026-01-20 20:19:24');

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
(15,	'Enzo',	'enzosorrenti5@gmail.com',	'$2b$10$gaR4cGmhG81K9iUOI8pBX.sSIGiBKmcS3r/EK1L4sMRQmofzfZQdi',	'AR',	1,	'2026-02-03 11:04:58');

-- 2026-02-03 14:12:52 UTC