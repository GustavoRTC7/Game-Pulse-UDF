# GamePulse MySQL Database Setup

Este diretório contém todos os arquivos SQL necessários para configurar o banco de dados MySQL da plataforma GamePulse no XAMPP.

## Estrutura dos Arquivos

1. **01_create_database.sql** - Cria o banco de dados principal
2. **02_create_tables.sql** - Cria todas as tabelas necessárias
3. **03_insert_sample_data.sql** - Insere dados de exemplo para teste
4. **04_create_triggers.sql** - Cria triggers para automação
5. **05_create_views.sql** - Cria views para consultas otimizadas

## Como Usar no XAMPP

### Passo 1: Iniciar o XAMPP
1. Abra o painel de controle do XAMPP
2. Inicie o Apache e MySQL

### Passo 2: Acessar o phpMyAdmin
1. Abra o navegador e vá para `http://localhost/phpmyadmin`
2. Faça login (usuário padrão: `root`, senha: vazia)

### Passo 3: Executar os Scripts SQL
Execute os arquivos na seguinte ordem:

1. **Criar o banco de dados:**
   - Clique em "SQL" no phpMyAdmin
   - Copie e cole o conteúdo de `01_create_database.sql`
   - Clique em "Executar"

2. **Criar as tabelas:**
   - Selecione o banco `gamepulse` na lista à esquerda
   - Clique em "SQL"
   - Copie e cole o conteúdo de `02_create_tables.sql`
   - Clique em "Executar"

3. **Inserir dados de exemplo:**
   - Copie e cole o conteúdo de `03_insert_sample_data.sql`
   - Clique em "Executar"

4. **Criar triggers:**
   - Copie e cole o conteúdo de `04_create_triggers.sql`
   - Clique em "Executar"

5. **Criar views:**
   - Copie e cole o conteúdo de `05_create_views.sql`
   - Clique em "Executar"

## Estrutura do Banco de Dados

### Tabelas Principais

- **users** - Informações básicas dos usuários
- **profiles** - Informações adicionais do perfil
- **friends** - Relacionamentos de amizade
- **games** - Catálogo de jogos disponíveis
- **game_scores** - Pontuações dos jogos
- **player_stats** - Estatísticas dos jogadores
- **game_sessions** - Sessões de jogo multiplayer
- **game_session_players** - Jogadores em cada sessão
- **chat_messages** - Mensagens do chat
- **user_settings** - Configurações do usuário

### Views Disponíveis

- **leaderboard_view** - Ranking dos jogadores
- **user_friends_view** - Lista de amigos com status
- **game_statistics_view** - Estatísticas dos jogos
- **active_sessions_view** - Sessões ativas

## Configuração da Aplicação

Após configurar o banco, você precisará atualizar a configuração da aplicação para usar MySQL em vez do Supabase:

1. Instale o driver MySQL para Node.js:
   ```bash
   npm install mysql2
   ```

2. Crie um arquivo de configuração para o banco:
   ```javascript
   // config/database.js
   const mysql = require('mysql2/promise');
   
   const dbConfig = {
     host: 'localhost',
     user: 'root',
     password: '',
     database: 'gamepulse',
     charset: 'utf8mb4'
   };
   
   module.exports = mysql.createConnection(dbConfig);
   ```

## Dados de Teste

O arquivo `03_insert_sample_data.sql` inclui:
- 5 usuários de exemplo
- Relacionamentos de amizade
- 3 jogos (Snake, Hangman, Chess)
- Pontuações de exemplo
- Estatísticas dos jogadores
- Configurações padrão

## Manutenção

### Backup do Banco
Para fazer backup do banco de dados:
1. No phpMyAdmin, selecione o banco `gamepulse`
2. Clique em "Exportar"
3. Escolha "Exportação rápida" e formato "SQL"
4. Clique em "Executar"

### Limpeza de Dados
Para limpar dados de teste e começar com banco limpo:
```sql
-- Limpar todas as tabelas (cuidado!)
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE chat_messages;
TRUNCATE TABLE game_session_players;
TRUNCATE TABLE game_sessions;
TRUNCATE TABLE game_scores;
TRUNCATE TABLE player_stats;
TRUNCATE TABLE friends;
TRUNCATE TABLE user_settings;
TRUNCATE TABLE profiles;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;
```

## Troubleshooting

### Erro de Permissões
Se encontrar erros de permissão, certifique-se de que o usuário MySQL tem privilégios suficientes:
```sql
GRANT ALL PRIVILEGES ON gamepulse.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Erro de Charset
Se tiver problemas com caracteres especiais, verifique se o charset está correto:
```sql
ALTER DATABASE gamepulse CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```