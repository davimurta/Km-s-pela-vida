# KM's Pela Vida

Site empresarial para o projeto "KM's Pela Vida" - um movimento que promove qualidade de vida através do esporte.

## 🚀 Tecnologias

### Client
- **React 18** - Biblioteca UI
- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utility-first
- **React Router DOM** - Roteamento
- **Firebase Web SDK** - Autenticação e Firestore

### Server
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **CORS** - Cross-Origin Resource Sharing

## 📁 Estrutura do Projeto

```
Km-s-pela-vida/
├── client/                 # Aplicação React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   │   ├── admin/     # Componentes do dashboard admin
│   │   │   ├── AdminRoute.tsx
│   │   │   ├── Layout.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── contexts/      # Context API
│   │   │   └── AuthContext.tsx
│   │   ├── pages/         # Páginas da aplicação
│   │   │   ├── Admin.tsx
│   │   │   ├── Blog.tsx
│   │   │   ├── BlogPost.tsx
│   │   │   ├── Home.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── services/      # Serviços (Firebase, API)
│   │   │   └── firebase.ts
│   │   ├── types/         # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
└── server/                # Servidor Node/Express
    ├── src/
    │   └── index.js
    ├── package.json
    └── .env.example

```

## 🎨 Tema de Cores

O tema foi extraído da logo do projeto:

- **Primária**: `#3d8bff` (Azul)
- **Secundária**: `#ffff00` (Amarelo)
- **Background**: Branco e cinza claro

## 🔐 Funcionalidades de Autenticação

- ✅ Login com Google
- ✅ Login com e-mail e senha
- ✅ Registro com e-mail e senha
- ✅ Rotas públicas (Home, Blog)
- ✅ Rotas privadas (requer autenticação)
- ✅ Rotas admin (requer isAdmin = true)

## 📝 Sistema de Blog

### Funcionalidades Públicas
- Listagem de posts publicados
- Visualização de post individual
- Filtro por tags

### Funcionalidades Admin
- Criar, editar e excluir posts
- Publicar ou deixar como rascunho
- Adicionar imagens e tags
- Gerenciar autores (atribuir permissão de autor a usuários)

## 👥 Gestão de Usuários (Admin)

O dashboard admin permite:
- Listar todos os usuários
- Atribuir/remover permissão de **autor** (pode criar posts)
- Atribuir/remover permissão de **admin** (acesso total)

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Firebase configurada

### 1. Clone o repositório

```bash
git clone <repository-url>
cd Km-s-pela-vida
```

### 2. Configurar o Client

```bash
cd client
npm install
```

O Firebase já está configurado no arquivo `client/src/services/firebase.ts`.

### 3. Configurar Firestore

No Firebase Console:

1. Acesse **Firestore Database**
2. Crie o banco de dados (comece no modo de teste)
3. Crie os índices necessários:

#### Índice para Posts
- Coleção: `posts`
- Campos:
  - `published` (Ascending)
  - `createdAt` (Descending)

4. Configure as regras de segurança do Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Regras para usuários
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null &&
                       get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Regras para posts
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null &&
                       (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAuthor == true ||
                        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
      allow update, delete: if request.auth != null &&
                               (resource.data.authorId == request.auth.uid ||
                                get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }
  }
}
```

### 4. Configurar Authentication no Firebase

1. Acesse **Authentication** no Firebase Console
2. Ative os provedores:
   - **Email/Password**
   - **Google**

### 5. Criar Primeiro Admin

Após criar sua conta no site, você precisa manualmente definir o primeiro admin no Firestore:

1. Acesse o Firestore Database
2. Vá para a coleção `users`
3. Encontre seu documento de usuário
4. Edite e adicione/modifique os campos:
   ```json
   {
     "isAdmin": true,
     "isAuthor": true
   }
   ```

### 6. Configurar o Server (opcional)

```bash
cd server
npm install
cp .env.example .env
```

Edite o `.env` se necessário.

### 7. Executar o Projeto

#### Client (porta 3000)
```bash
cd client
npm run dev
```

#### Server (porta 3001) - opcional
```bash
cd server
npm run dev
```

## 🌐 Acesso

- **Client**: http://localhost:3000
- **Server**: http://localhost:3001

## 📚 Estrutura de Dados

### User (Firestore: `users/{uid}`)
```typescript
{
  email: string
  displayName: string
  photoURL: string | null
  isAdmin: boolean
  isAuthor: boolean
  createdAt: Date
}
```

### BlogPost (Firestore: `posts/{postId}`)
```typescript
{
  title: string
  content: string
  excerpt: string
  imageUrl: string | null
  authorId: string
  authorName: string
  authorPhotoURL: string | null
  createdAt: Date
  updatedAt: Date
  published: boolean
  tags: string[]
}
```

## 🛡️ Permissões

### Usuário Normal
- Visualizar conteúdo público
- Editar próprio perfil

### Autor (isAuthor: true)
- Criar posts
- Editar próprios posts
- Publicar/despublicar próprios posts

### Admin (isAdmin: true)
- Acesso total ao dashboard
- Gerenciar todos os usuários
- Gerenciar todos os posts
- Atribuir permissões de autor/admin

## 📦 Build para Produção

### Client
```bash
cd client
npm run build
```

Os arquivos serão gerados em `client/dist/`

### Server
O servidor já está pronto para produção. Configure as variáveis de ambiente apropriadas.

## 🔒 Segurança

- ✅ Nunca exponha credenciais do Firebase Admin SDK no client
- ✅ Use Firebase Security Rules para proteger dados
- ✅ Validação de permissões no client e no Firestore
- ✅ Autenticação obrigatória para rotas privadas
- ✅ Verificação de roles (author/admin) para operações sensíveis

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é privado e pertence ao movimento KM's Pela Vida.

## 📞 Contato

Para mais informações sobre o projeto KM's Pela Vida, entre em contato através do site.

---

**Desenvolvido com ❤️ para o movimento KM's Pela Vida**
