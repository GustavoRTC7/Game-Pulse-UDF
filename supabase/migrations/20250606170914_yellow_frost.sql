-- Use the GamePulse database
USE gamepulse;

-- Delimiter change for trigger creation
DELIMITER $$

-- Trigger to update player stats when a new score is inserted
CREATE TRIGGER update_player_stats_after_score_insert
AFTER INSERT ON game_scores
FOR EACH ROW
BEGIN
    -- Insert or update player stats
    INSERT INTO player_stats (
        user_id, 
        total_score, 
        games_played, 
        best_game, 
        best_score, 
        average_score,
        updated_at
    ) VALUES (
        NEW.user_id,
        NEW.score,
        1,
        NEW.game_id,
        NEW.score,
        NEW.score,
        CURRENT_TIMESTAMP
    )
    ON DUPLICATE KEY UPDATE
        total_score = total_score + NEW.score,
        games_played = games_played + 1,
        best_game = CASE 
            WHEN NEW.score > best_score THEN NEW.game_id 
            ELSE best_game 
        END,
        best_score = GREATEST(best_score, NEW.score),
        average_score = (total_score + NEW.score) / (games_played + 1),
        updated_at = CURRENT_TIMESTAMP;
END$$

-- Trigger to update user win/loss stats
CREATE TRIGGER update_user_match_stats
AFTER INSERT ON game_session_players
FOR EACH ROW
BEGIN
    DECLARE session_status VARCHAR(20);
    DECLARE user_won BOOLEAN DEFAULT FALSE;
    
    -- Get session status
    SELECT status INTO session_status 
    FROM game_sessions 
    WHERE id = NEW.session_id;
    
    -- Only update stats if session is finished
    IF session_status = 'finished' THEN
        -- Determine if user won (simplified logic - highest score wins)
        SELECT (NEW.score = (
            SELECT MAX(score) 
            FROM game_session_players 
            WHERE session_id = NEW.session_id
        )) INTO user_won;
        
        -- Update user stats
        UPDATE users 
        SET 
            total_matches = total_matches + 1,
            wins = CASE WHEN user_won THEN wins + 1 ELSE wins END,
            losses = CASE WHEN NOT user_won THEN losses + 1 ELSE losses END,
            win_rate = CASE 
                WHEN (total_matches + 1) > 0 THEN 
                    ((CASE WHEN user_won THEN wins + 1 ELSE wins END) * 100.0) / (total_matches + 1)
                ELSE 0 
            END
        WHERE id = NEW.user_id;
    END IF;
END$$

-- Trigger to automatically create user settings when a new user is created
CREATE TRIGGER create_user_settings_after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO user_settings (user_id) VALUES (NEW.id);
END$$

-- Trigger to automatically create profile when a new user is created
CREATE TRIGGER create_profile_after_user_insert
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO profiles (id, user_id) VALUES (UUID(), NEW.id);
END$$

-- Reset delimiter
DELIMITER ;