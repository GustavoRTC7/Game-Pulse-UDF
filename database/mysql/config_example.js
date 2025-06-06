// Exemplo de configuração para conectar com MySQL
// Salve como config/database.js na sua aplicação

const mysql = require('mysql2/promise');

// Configuração do banco de dados
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '', // Deixe vazio se não tiver senha no XAMPP
  database: 'gamepulse',
  charset: 'utf8mb4',
  timezone: '+00:00',
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true
};

// Criar pool de conexões para melhor performance
const pool = mysql.createPool({
  ...dbConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Função para executar queries
async function executeQuery(query, params = []) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Função para executar transações
async function executeTransaction(queries) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    
    const results = [];
    for (const { query, params } of queries) {
      const [result] = await connection.execute(query, params || []);
      results.push(result);
    }
    
    await connection.commit();
    return results;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

// Exportar funções
module.exports = {
  pool,
  executeQuery,
  executeTransaction,
  
  // Funções específicas para a aplicação
  async getUserById(userId) {
    const query = `
      SELECT u.*, p.first_name, p.last_name, p.country, p.language, s.*
      FROM users u
      LEFT JOIN profiles p ON u.id = p.user_id
      LEFT JOIN user_settings s ON u.id = s.user_id
      WHERE u.id = ?
    `;
    const results = await executeQuery(query, [userId]);
    return results[0];
  },
  
  async updateUserProfile(userId, profileData) {
    const { username, email, bio, avatar, first_name, last_name, country } = profileData;
    
    const queries = [
      {
        query: 'UPDATE users SET username = ?, email = ?, bio = ?, avatar = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        params: [username, email, bio, avatar, userId]
      },
      {
        query: 'UPDATE profiles SET first_name = ?, last_name = ?, country = ?, updated_at = CURRENT_TIMESTAMP WHERE user_id = ?',
        params: [first_name, last_name, country, userId]
      }
    ];
    
    return await executeTransaction(queries);
  },
  
  async saveGameScore(userId, gameId, score, gameMode = 'single', difficulty = null, duration = null) {
    const query = `
      INSERT INTO game_scores (user_id, game_id, score, game_mode, difficulty, duration_seconds)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    return await executeQuery(query, [userId, gameId, score, gameMode, difficulty, duration]);
  },
  
  async getLeaderboard(limit = 50) {
    const query = `
      SELECT * FROM leaderboard_view
      LIMIT ?
    `;
    return await executeQuery(query, [limit]);
  },
  
  async getUserFriends(userId) {
    const query = `
      SELECT * FROM user_friends_view
      WHERE user_id = ?
      ORDER BY friend_status DESC, friend_username ASC
    `;
    return await executeQuery(query, [userId]);
  }
};