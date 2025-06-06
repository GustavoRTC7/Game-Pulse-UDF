-- Use the GamePulse database
USE gamepulse;

-- Insert sample users
INSERT INTO users (id, email, username, password_hash, avatar, bio, level, rank_title, total_matches, wins, losses, win_rate, status) VALUES
('user-1', 'progamer99@email.com', 'ProGamer99', '$2b$10$example_hash_1', 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150', 'Passionate gamer and strategy enthusiast', 42, 'Diamond', 248, 167, 81, 67.3, 'online'),
('user-2', 'ninja@email.com', 'NinjaWarrior', '$2b$10$example_hash_2', 'https://images.pexels.com/photos/1722198/pexels-photo-1722198.jpeg?auto=compress&cs=tinysrgb&w=150', 'Stealth master and competitive player', 56, 'Master', 345, 231, 114, 67.0, 'in-game'),
('user-3', 'pixelqueen@email.com', 'PixelQueen', '$2b$10$example_hash_3', 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=150', 'Retro gaming enthusiast', 38, 'Platinum', 198, 119, 79, 60.1, 'online'),
('user-4', 'legend@email.com', 'LegendSlayer', '$2b$10$example_hash_4', 'https://images.pexels.com/photos/775358/pexels-photo-775358.jpeg?auto=compress&cs=tinysrgb&w=150', 'Top tier competitive player', 67, 'Grandmaster', 412, 298, 114, 72.3, 'offline'),
('user-5', 'shadow@email.com', 'ShadowHunter', '$2b$10$example_hash_5', 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', 'Tactical gameplay specialist', 28, 'Gold', 142, 89, 53, 62.7, 'online');

-- Insert profiles for users
INSERT INTO profiles (id, user_id, first_name, last_name, country, language) VALUES
('profile-1', 'user-1', 'João', 'Silva', 'Brazil', 'pt-BR'),
('profile-2', 'user-2', 'Maria', 'Santos', 'Brazil', 'pt-BR'),
('profile-3', 'user-3', 'Carlos', 'Oliveira', 'Brazil', 'pt-BR'),
('profile-4', 'user-4', 'Ana', 'Costa', 'Brazil', 'pt-BR'),
('profile-5', 'user-5', 'Pedro', 'Lima', 'Brazil', 'pt-BR');

-- Insert friend relationships
INSERT INTO friends (user_id, friend_id, status) VALUES
('user-1', 'user-2', 'accepted'),
('user-1', 'user-4', 'accepted'),
('user-2', 'user-5', 'accepted'),
('user-3', 'user-5', 'accepted'),
('user-4', 'user-1', 'accepted');

-- Insert games
INSERT INTO games (id, title, description, thumbnail, max_players, game_type, skill_level, bot_available, bot_difficulty) VALUES
('snake', 'Snake Game', 'Classic snake game where you eat food and grow longer', 'https://images.pexels.com/photos/207983/pexels-photo-207983.jpeg?auto=compress&cs=tinysrgb&w=500', 1, 'single', 'beginner', TRUE, 'easy'),
('hangman', 'Hangman', 'Guess the word by choosing letters', 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=500', 1, 'single', 'beginner', TRUE, 'medium'),
('chess', 'Chess', 'Classic chess game for strategic minds', 'https://images.pexels.com/photos/411207/pexels-photo-411207.jpeg?auto=compress&cs=tinysrgb&w=500', 2, 'multiplayer', 'intermediate', TRUE, 'hard');

-- Insert sample game scores
INSERT INTO game_scores (user_id, game_id, score, game_mode, difficulty, duration_seconds) VALUES
('user-1', 'snake', 1250, 'single', 'medium', 180),
('user-1', 'hangman', 850, 'single', 'easy', 120),
('user-2', 'chess', 1500, 'multiplayer', NULL, 900),
('user-3', 'snake', 980, 'single', 'easy', 150),
('user-4', 'chess', 1800, 'bot', 'hard', 1200),
('user-5', 'hangman', 720, 'single', 'medium', 90);

-- Insert player stats
INSERT INTO player_stats (user_id, total_score, games_played, best_game, best_score, average_score, total_playtime_minutes) VALUES
('user-1', 2100, 15, 'snake', 1250, 140.00, 45),
('user-2', 1500, 8, 'chess', 1500, 187.50, 32),
('user-3', 980, 5, 'snake', 980, 196.00, 18),
('user-4', 1800, 12, 'chess', 1800, 150.00, 55),
('user-5', 720, 3, 'hangman', 720, 240.00, 12);

-- Insert user settings
INSERT INTO user_settings (user_id, language, theme, master_volume, notifications_enabled) VALUES
('user-1', 'pt-BR', 'dark', 80, TRUE),
('user-2', 'pt-BR', 'dark', 70, TRUE),
('user-3', 'en-US', 'dark', 90, FALSE),
('user-4', 'pt-BR', 'dark', 85, TRUE),
('user-5', 'en-US', 'dark', 75, TRUE);