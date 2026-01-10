-- =======================================================
-- Initial Database Setup Script
-- =======================================================


CREATE DATABASE IF NOT EXISTS MiCampo;
USE MiCampo;

-- ########### MODULE: AGRICULTURE MANAGEMENT ###########

-- Create Countries Table
CREATE TABLE IF NOT EXISTS Countries (
    code CHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Users Table
CREATE TABLE IF NOT EXISTS Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    country_code CHAR(2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (country_code) REFERENCES Countries(code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Fields Table
CREATE TABLE IF NOT EXISTS Fields (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    description TEXT,
    lat DECIMAL(10, 8) NOT NULL,
    lng DECIMAL(10, 8) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Plots Table
CREATE TABLE IF NOT EXISTS Plots (
    id INT PRIMARY KEY AUTO_INCREMENT,
    field_id INT NOT NULL,
    plot_name VARCHAR(100) NOT NULL,
    area_ha DECIMAL(10, 2) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (field_id) REFERENCES Fields(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Field_Geometry Table
CREATE TABLE IF NOT EXISTS Field_Geometry (
    id INT PRIMARY KEY AUTO_INCREMENT,
    field_id INT NOT NULL,
    type VARCHAR(50) DEFAULT 'Polygon',
    geojson JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Plot_Geometry Table
CREATE TABLE IF NOT EXISTS Plot_Geometry (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plot_id INT NOT NULL,
    type VARCHAR(50) DEFAULT 'Polygon',
    geojson JSON NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Campaigns Table
CREATE TABLE IF NOT EXISTS Campaigns (
    id INT PRIMARY KEY AUTO_INCREMENT,
    plot_id INT NOT NULL,
    campaign_name VARCHAR(100) NOT NULL,
    start_date DATE DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (plot_id) REFERENCES Plots(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Sowings Table
CREATE TABLE IF NOT EXISTS Sowings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    crop_type VARCHAR(100) NOT NULL,
    variety VARCHAR(100),
    sowing_date DATE DEFAULT CURRENT_DATE,
    density INT,
    row_spacing DECIMAL(5, 2),
    method VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES Campaigns(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Fertilizations Table
CREATE TABLE IF NOT EXISTS Fertilizations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    dose DECIMAL(10, 2) NOT NULL,
    date_applied DATE DEFAULT CURRENT_DATE,
    method VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES Campaigns(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Create Irrigations Table
CREATE TABLE IF NOT EXISTS Irrigations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    dose DECIMAL(10, 2) NOT NULL,
    date_applied DATE DEFAULT CURRENT_DATE,
    target VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES Campaigns(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Create Harvests Table
CREATE TABLE IF NOT EXISTS Harvests (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    harvest_date DATE DEFAULT CURRENT_DATE,
    total_yield_kg DECIMAL(10, 2) NOT NULL,
    moisture_percentage DECIMAL(5, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES Campaigns(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- Create Observations Table
CREATE TABLE IF NOT EXISTS Observations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    campaign_id INT NOT NULL,
    observation_date DATE DEFAULT CURRENT_DATE,
    note TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (campaign_id) REFERENCES Campaigns(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;




-- ########### MODULE: Cattle raising ###########