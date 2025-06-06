-- Use the GamePulse database
USE gamepulse;

-- Create users table (equivalent to auth.users in Supabase)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar TEXT,
    bio TEXT,
    level INT DEFAULT 1,
    rank_title VARCHAR(50) DEFAULT 'Bronze',
    total_matches INT DEFAULT 0,
    wins INT DEFAULT 0,
    losses INT DEFAULT 0,
    win_rate DECIMAL(5,2) DEFAULT 0.00,
    status ENUM('online', 'offline', 'in-game') DEFAULT 'offline',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create profiles table (additional user information)
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) UNIQUE NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    date_of_birth DATE,
    country VARCHAR(100),
    timezone VARCHAR(50),
    language VARCHAR(10) DEFAULT 'en-US',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create friends table
CREATE TABLE IF NOT EXISTS friends (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    friend_id VARCHAR(36) NOT NULL,
    status ENUM('pending', 'accepted', 'blocked') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (friend_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_friendship (user_id, friend_id)
);

-- Create games table
CREATE TABLE IF NOT EXISTS games (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    thumbnail TEXT,
    max_players INT DEFAULT 2,
    game_type ENUM('single', 'multiplayer', 'bot') DEFAULT 'single',
    skill_level ENUM('beginner', 'intermediate', 'advanced', 'pro') DEFAULT 'beginner',
    bot_available BOOLEAN DEFAULT FALSE,
    bot_difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create game_scores table
CREATE TABLE IF NOT EXISTS game_scores (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    game_id VARCHAR(50) NOT NULL,
    score INT NOT NULL,
    game_mode ENUM('single', 'multiplayer', 'bot') DEFAULT 'single',
    difficulty ENUM('easy', 'medium', 'hard'),
    duration_seconds INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_game (user_id, game_id),
    INDEX idx_score (score DESC),
    INDEX idx_created_at (created_at DESC)
);

-- Create player_stats table
CREATE TABLE IF NOT EXISTS player_stats (
    user_id VARCHAR(36) PRIMARY KEY,
    total_score BIGINT DEFAULT 0,
    games_played INT DEFAULT 0,
    best_game VARCHAR(50),
    best_score INT DEFAULT 0,
    average_score DECIMAL(10,2) DEFAULT 0.00,
    total_playtime_minutes INT DEFAULT 0,
    achievements JSON,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    host_user_id VARCHAR(36) NOT NULL,
    game_id VARCHAR(50) NOT NULL,
    session_code VARCHAR(10) UNIQUE,
    max_players INT DEFAULT 2,
    current_players INT DEFAULT 1,
    status ENUM('waiting', 'playing', 'finished') DEFAULT 'waiting',
    settings JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP NULL,
    finished_at TIMESTAMP NULL,
    FOREIGN KEY (host_user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_session_code (session_code)
);

-- Create game_session_players table
CREATE TABLE IF NOT EXISTS game_session_players (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    team ENUM('home', 'away', 'spectator') DEFAULT 'home',
    is_ready BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP NULL,
    FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_session_user (session_id, user_id)
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    session_id VARCHAR(36),
    user_id VARCHAR(36) NOT NULL,
    message TEXT NOT NULL,
    message_type ENUM('text', 'system', 'game_event') DEFAULT 'text',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_session_created (session_id, created_at)
);

-- Create user_settings table
CREATE TABLE IF NOT EXISTS user_settings (
    user_id VARCHAR(36) PRIMARY KEY,
    language VARCHAR(10) DEFAULT 'en-US',
    theme ENUM('light', 'dark') DEFAULT 'dark',
    sound_enabled BOOLEAN DEFAULT TRUE,
    master_volume INT DEFAULT 80,
    music_volume INT DEFAULT 70,
    effects_volume INT DEFAULT 90,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    game_invites_enabled BOOLEAN DEFAULT TRUE,
    friend_requests_enabled BOOLEAN DEFAULT TRUE,
    system_messages_enabled BOOLEAN DEFAULT TRUE,
    high_contrast BOOLEAN DEFAULT FALSE,
    animations_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);