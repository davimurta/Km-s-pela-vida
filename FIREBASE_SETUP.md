# Configuração do Firebase

Este guia detalha como configurar o Firebase para o projeto KM's Pela Vida.

## 📋 Pré-requisitos

- Conta Google/Gmail
- Acesso ao [Firebase Console](https://console.firebase.google.com/)

## 🔥 Passo a Passo

### 1. Criar/Acessar Projeto Firebase

O projeto já foi criado: **km-s-pela-vida**

Se precisar acessar:
1. Vá para [Firebase Console](https://console.firebase.google.com/)
2. Selecione o projeto "km-s-pela-vida"

### 2. Configurar Firestore Database

#### 2.1 Criar o Database

1. No menu lateral, clique em **Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha o modo:
   - **Teste** (para desenvolvimento) - dados públicos por 30 dias
   - **Produção** (para deploy) - requer regras de segurança

4. Escolha a localização (recomendado: `southamerica-east1` - São Paulo)

#### 2.2 Criar Índices Compostos

Os índices são necessários para queries complexas.

**Para Posts:**
1. Vá em **Índices** na aba Firestore
2. Clique em **Adicionar índice**
3. Configure:
   - **Coleção**: `posts`
   - **Campos**:
     - Campo: `published`, Ordem: **Ascending**
     - Campo: `createdAt`, Ordem: **Descending**
   - **Status da consulta**: Habilitado
4. Clique em **Criar**

#### 2.3 Configurar Regras de Segurança

1. Vá em **Regras** na aba Firestore
2. Cole as seguintes regras:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Função helper para verificar se usuário é admin
    function isAdmin() {
      return request.auth != null &&
             get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }

    // Função helper para verificar se usuário é autor
    function isAuthor() {
      return request.auth != null &&
             (get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAuthor == true ||
              get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true);
    }

    // Regras para coleção de usuários
    match /users/{userId} {
      // Qualquer um pode ler perfis públicos
      allow read: if true;

      // Usuário pode criar/atualizar seu próprio documento
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update: if request.auth != null && request.auth.uid == userId
                       && !request.resource.data.diff(resource.data).affectedKeys().hasAny(['isAdmin', 'isAuthor']);

      // Apenas admins podem modificar permissões
      allow update: if isAdmin();

      // Apenas admins podem deletar usuários
      allow delete: if isAdmin();
    }

    // Regras para coleção de posts
    match /posts/{postId} {
      // Qualquer um pode ler posts
      allow read: if true;

      // Apenas autores e admins podem criar posts
      allow create: if isAuthor();

      // Autor pode editar/deletar seus próprios posts, admin pode editar/deletar qualquer post
      allow update, delete: if request.auth != null &&
                               (resource.data.authorId == request.auth.uid || isAdmin());
    }
  }
}
```

3. Clique em **Publicar**

### 3. Configurar Authentication

#### 3.1 Ativar Email/Password

1. No menu lateral, clique em **Authentication**
2. Clique em **Começar** (se primeira vez)
3. Vá na aba **Sign-in method**
4. Clique em **Email/senha**
5. Ative o switch **Habilitar**
6. Clique em **Salvar**

#### 3.2 Ativar Google Sign-In

1. Na mesma página (**Sign-in method**)
2. Clique em **Google**
3. Ative o switch **Habilitar**
4. Escolha um email de suporte (seu email)
5. Clique em **Salvar**

#### 3.3 Configurar Domínios Autorizados

1. Ainda em **Authentication**
2. Vá em **Settings** > **Authorized domains**
3. Por padrão, `localhost` já está autorizado
4. Quando fizer deploy, adicione seu domínio de produção

### 4. Criar o Primeiro Administrador

Como as permissões de admin não podem ser auto-atribuídas, você precisa criar o primeiro admin manualmente:

#### 4.1 Criar Conta no Site
1. Execute o projeto localmente
2. Acesse `http://localhost:3000/register`
3. Crie sua conta

#### 4.2 Definir como Admin no Firestore
1. Volte ao Firebase Console
2. Vá em **Firestore Database**
3. Encontre a coleção `users`
4. Clique no documento com seu UID
5. Clique em **Editar documento**
6. Adicione/modifique os campos:
   ```
   isAdmin: true
   isAuthor: true
   ```
7. Clique em **Atualizar**

#### 4.3 Recarregar a Aplicação
1. Faça logout no site
2. Faça login novamente
3. Agora você tem acesso ao dashboard admin

### 5. Configurar Storage (Opcional)

Se quiser permitir upload de imagens:

1. No menu lateral, clique em **Storage**
2. Clique em **Começar**
3. Escolha o modo (teste ou produção)
4. Escolha a localização (mesma do Firestore)

#### Regras de Storage Recomendadas:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /posts/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null &&
                      (request.resource.size < 5 * 1024 * 1024 &&
                       request.resource.contentType.matches('image/.*'));
    }
  }
}
```

### 6. Monitoramento e Quotas

#### Verificar Uso
- **Firestore**: Console > Firestore > Usage
- **Authentication**: Console > Authentication > Usage
- **Storage**: Console > Storage > Usage

#### Limites do Plano Gratuito (Spark)
- **Firestore**:
  - 50k leituras/dia
  - 20k escritas/dia
  - 20k exclusões/dia
  - 1 GB armazenado

- **Authentication**:
  - Ilimitado (na maioria dos provedores)

- **Storage**:
  - 5 GB armazenado
  - 1 GB/dia de download

### 7. Backup e Segurança

#### Exportar Dados (Manual)
1. Firestore > Importar/Exportar
2. Exporte para Google Cloud Storage

#### Habilitar App Check (Recomendado para Produção)
1. Console > App Check
2. Configure reCAPTCHA para web
3. Ative a proteção

### 8. Configuração para Produção

Quando for fazer deploy:

1. **Atualizar domínios autorizados**:
   - Authentication > Settings > Authorized domains
   - Adicione seu domínio de produção

2. **Atualizar regras do Firestore** para modo produção (já estão prontas)

3. **Configurar CORS no Storage** (se usar):
   ```json
   [
     {
       "origin": ["https://seu-dominio.com"],
       "method": ["GET"],
       "maxAgeSeconds": 3600
     }
   ]
   ```

4. **Habilitar App Check** para proteção adicional

## 🔍 Troubleshooting

### Erro: "Missing or insufficient permissions"
- Verifique se as regras do Firestore estão configuradas corretamente
- Confirme que o usuário tem as permissões necessárias (isAdmin/isAuthor)

### Erro ao fazer login com Google
- Verifique se o domínio está nos domínios autorizados
- Confirme que o Google Sign-In está habilitado

### Índices pendentes
- Aguarde alguns minutos para os índices serem criados
- Verifique o status em Firestore > Índices

### Query muito lenta
- Crie índices compostos para queries complexas
- Limite o número de documentos retornados

## 📚 Recursos Adicionais

- [Documentação do Firebase](https://firebase.google.com/docs)
- [Regras de Segurança do Firestore](https://firebase.google.com/docs/firestore/security/get-started)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

## ✅ Checklist de Configuração

- [ ] Projeto Firebase criado
- [ ] Firestore Database configurado
- [ ] Índices compostos criados
- [ ] Regras de segurança do Firestore configuradas
- [ ] Authentication com Email/Password ativado
- [ ] Authentication com Google ativado
- [ ] Primeiro admin criado manualmente
- [ ] Testado login e criação de posts
- [ ] Storage configurado (opcional)
- [ ] Domínios de produção autorizados (quando aplicável)

---

**Última atualização**: 2024
