/*
  # Create leaderboard tables

  1. New Tables
    - `game_scores`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `game_id` (text)
      - `score` (integer)
      - `created_at` (timestamp)
    - `player_stats`
      - `user_id` (uuid, primary key, references auth.users)
      - `total_score` (integer)
      - `games_played` (integer)
      - `best_game` (text)
      - `best_score` (integer)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create game_scores table
CREATE TABLE IF NOT EXISTS game_scores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  game_id text NOT NULL,
  score integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create player_stats table
CREATE TABLE IF NOT EXISTS player_stats (
  user_id uuid PRIMARY KEY REFERENCES auth.users,
  total_score integer DEFAULT 0,
  games_played integer DEFAULT 0,
  best_game text,
  best_score integer DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all game scores"
  ON game_scores
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own scores"
  ON game_scores
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read all player stats"
  ON player_stats
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own stats"
  ON player_stats
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create function to update player stats
CREATE OR REPLACE FUNCTION update_player_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO player_stats (user_id, total_score, games_played, best_game, best_score)
  VALUES (
    NEW.user_id,
    NEW.score,
    1,
    NEW.game_id,
    NEW.score
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    total_score = player_stats.total_score + NEW.score,
    games_played = player_stats.games_played + 1,
    best_game = CASE 
      WHEN NEW.score > player_stats.best_score THEN NEW.game_id 
      ELSE player_stats.best_game 
    END,
    best_score = GREATEST(player_stats.best_score, NEW.score),
    updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating player stats
CREATE TRIGGER update_player_stats_trigger
AFTER INSERT ON game_scores
FOR EACH ROW
EXECUTE FUNCTION update_player_stats();