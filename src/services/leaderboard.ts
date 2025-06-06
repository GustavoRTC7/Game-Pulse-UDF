import { supabase } from '../config/supabase';

export const saveGameScore = async (gameId: string, score: number) => {
  try {
    const { data, error } = await supabase
      .from('game_scores')
      .insert([
        { game_id: gameId, score }
      ]);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving score:', error);
    throw error;
  }
};

export const getLeaderboard = async (gameId?: string) => {
  try {
    let query = supabase
      .from('player_stats')
      .select(`
        *,
        user:user_id (
          username,
          avatar
        )
      `)
      .order('total_score', { ascending: false });

    if (gameId) {
      query = supabase
        .from('game_scores')
        .select(`
          *,
          user:user_id (
            username,
            avatar
          )
        `)
        .eq('game_id', gameId)
        .order('score', { ascending: false });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    throw error;
  }
};