-- Use the GamePulse database
USE gamepulse;

-- Create view for leaderboard
CREATE OR REPLACE VIEW leaderboard_view AS
SELECT 
    u.id as user_id,
    u.username,
    u.avatar,
    u.level,
    u.rank_title as rank_name,
    u.wins,
    u.losses,
    u.win_rate,
    ps.total_score,
    ps.games_played,
    ps.best_game,
    ps.best_score,
    ps.average_score,
    DATE_FORMAT(MAX(gs.created_at), '%Y-%m-%d') as last_played,
    ROW_NUMBER() OVER (ORDER BY u.win_rate DESC, u.level DESC, ps.total_score DESC) as rank_position
FROM users u
LEFT JOIN player_stats ps ON u.id = ps.user_id
LEFT JOIN game_scores gs ON u.id = gs.user_id
GROUP BY u.id, u.username, u.avatar, u.level, u.rank_title, u.wins, u.losses, u.win_rate, 
         ps.total_score, ps.games_played, ps.best_game, ps.best_score, ps.average_score
ORDER BY rank_position;

-- Create view for user friends with status
CREATE OR REPLACE VIEW user_friends_view AS
SELECT 
    f.user_id,
    f.friend_id,
    u.username as friend_username,
    u.avatar as friend_avatar,
    u.level as friend_level,
    u.rank_title as friend_rank,
    u.status as friend_status,
    f.status as friendship_status,
    f.created_at as friendship_created
FROM friends f
JOIN users u ON f.friend_id = u.id
WHERE f.status = 'accepted';

-- Create view for game statistics
CREATE OR REPLACE VIEW game_statistics_view AS
SELECT 
    g.id as game_id,
    g.title as game_title,
    COUNT(DISTINCT gs.user_id) as total_players,
    COUNT(gs.id) as total_games_played,
    AVG(gs.score) as average_score,
    MAX(gs.score) as highest_score,
    MIN(gs.score) as lowest_score,
    AVG(gs.duration_seconds) as average_duration
FROM games g
LEFT JOIN game_scores gs ON g.id = gs.game_id
GROUP BY g.id, g.title;

-- Create view for active game sessions
CREATE OR REPLACE VIEW active_sessions_view AS
SELECT 
    gs.id as session_id,
    gs.session_code,
    gs.game_id,
    g.title as game_title,
    u.username as host_username,
    gs.current_players,
    gs.max_players,
    gs.status,
    gs.created_at,
    GROUP_CONCAT(
        CONCAT(pu.username, ':', gsp.team, ':', gsp.is_ready) 
        SEPARATOR ';'
    ) as players_info
FROM game_sessions gs
JOIN games g ON gs.game_id = g.id
JOIN users u ON gs.host_user_id = u.id
LEFT JOIN game_session_players gsp ON gs.id = gsp.session_id
LEFT JOIN users pu ON gsp.user_id = pu.id
WHERE gs.status IN ('waiting', 'playing')
GROUP BY gs.id, gs.session_code, gs.game_id, g.title, u.username, 
         gs.current_players, gs.max_players, gs.status, gs.created_at;