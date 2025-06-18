# GamePulse - Online Gaming Platform

Uma plataforma de jogos online moderna construída com React, TypeScript e Tailwind CSS.

## 🎮 Características

- **Jogos Integrados**: Snake, Hangman, Chess e mais
- **Sistema de Ranking**: Leaderboards globais e estatísticas de jogadores
- **Multiplayer**: Jogue com amigos em tempo real
- **Perfis Personalizáveis**: Avatares de super-heróis da Marvel
- **Internacionalização**: Suporte para Português (BR) e Inglês
- **Design Responsivo**: Funciona perfeitamente em desktop e mobile

## 🚀 Tecnologias Utilizadas

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **3D Graphics**: Three.js, React Three Fiber
- **Jogos**: Chess.js, React Chessboard
- **Internacionalização**: i18next, react-i18next
- **Estado**: Zustand
- **Build**: Vite
- **Deploy**: GitHub Pages, Netlify

## 📦 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/gamepulse.git
cd gamepulse
```

2. Instale as dependências:
```bash
npm install
```

3. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

4. Abra [http://localhost:5173](http://localhost:5173) no seu navegador.

## 🏗️ Build e Deploy

### Build para produção:
```bash
npm run build
```

### Deploy no GitHub Pages:
```bash
npm run deploy
```

### Deploy no Netlify:
O projeto está configurado para deploy automático no Netlify através do GitHub.

## 🎯 Funcionalidades

### Jogos Disponíveis
- **Snake**: Jogo clássico da cobrinha com velocidade progressiva
- **Hangman**: Jogo da forca com categorias em português
- **Chess**: Xadrez completo com IA e modo multiplayer

### Sistema de Usuários
- Perfis personalizáveis
- Avatares de super-heróis
- Estatísticas detalhadas
- Sistema de amigos

### Configurações
- Troca de idioma (PT-BR/EN-US)
- Configurações de som
- Modo escuro/claro
- Notificações

## 🗄️ Banco de Dados

O projeto inclui scripts SQL completos para MySQL/XAMPP na pasta `database/mysql/`:

- Estrutura completa do banco
- Dados de exemplo
- Triggers automáticos
- Views otimizadas

### Configuração no XAMPP:
1. Inicie Apache e MySQL no XAMPP
2. Acesse phpMyAdmin
3. Execute os scripts na ordem numérica
4. Configure a conexão na aplicação

## 🌐 Deploy

### GitHub Pages
O projeto está configurado para deploy automático no GitHub Pages:
- Push para a branch `main` dispara o deploy
- Arquivos estáticos servidos via GitHub Pages
- URL personalizada suportada

### Netlify
Deploy contínuo configurado:
- Builds automáticos a cada push
- Preview de pull requests
- Redirects para SPA configurados

## 🔧 Configuração de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
```

## 📱 Responsividade

O projeto é totalmente responsivo com breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎨 Design System

- **Cores**: Paleta escura com acentos roxos
- **Tipografia**: Sistema de fontes nativo
- **Componentes**: Biblioteca própria de UI
- **Ícones**: Lucide React

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

