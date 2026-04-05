# Starti Backend Trainee Test

API REST construída com **NestJS + Prisma + PostgreSQL** que simula uma plataforma de blog simples, com gerenciamento de usuários, posts e comentários.

---

## Pré-requisitos

- Node.js 20+
- pnpm
- Docker e Docker Compose

---

## Como começar

```bash
git clone https://github.com/seu-usuario/seu-repo.git
cd seu-repo
```

---

## Configuração do ambiente

1. Copie o arquivo de ambiente e instale as dependências:

```bash
cp .env.example .env
pnpm install
```

2. Preencha as variáveis no `.env`:

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=starti_db
PORT=3000
NODE_ENV=development
```

3. Configure o `DATABASE_URL` de acordo com o modo de execução:

- **App em Docker:**
```env
DATABASE_URL="postgresql://postgres:postgres@database:5432/starti_db"
```

- **App local (com DB no Docker):**
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/starti_db"
```

> **Atenção:** os valores de `DATABASE_URL` devem ser equivalentes aos campos preenchidos anteriormente (`DB_USER`, `DB_PASSWORD`, `DB_NAME`).

---

## Como rodar

### Opção 1 — Aplicação + DB em Docker

```bash
docker compose up -d --build
```

> **Primeira execução (banco vazio):** é obrigatório rodar as migrations antes de usar a aplicação. Execute os comandos abaixo e depois reinicie o container:

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/starti_db" \
pnpm prisma migrate deploy

docker compose restart application
```

---

### Opção 2 — Aplicação local + DB em Docker

```bash
docker compose up -d database
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm start:dev
```

---

## Swagger

A documentação interativa da API está disponível em:

```
http://localhost:3000/api
```

> Disponível apenas quando `NODE_ENV !== 'production'`.

---

## Endpoints

Base URL:

```
http://localhost:3000
```

#### Exemplos
```
POST    /users                  Cria um novo usuário
GET     /users/{id}             Busca um usuário pelo ID
PUT     /users/{id}             Atualiza os dados de um usuário pelo ID
DELETE  /users/{id}             Remove um usuário pelo ID
GET     /users/{id}/posts       Lista todos os posts de um usuário
GET     /users/{id}/comments    Lista todos os comentários de um usuário

POST    /posts                  Cria um novo post
GET     /posts/{id}             Busca um post pelo ID
PUT     /posts/{id}             Atualiza um post pelo ID
DELETE  /posts/{id}             Remove um post pelo ID
PATCH   /posts/{id}/archive     Arquiva um post pelo ID (sem deletar, apenas muda o status)
GET     /posts/{id}/comments    Lista todos os comentários de um post

POST    /comments               Cria um novo comentário
PATCH   /comments/{id}          Atualiza um comentário pelo ID
DELETE  /comments/{id}          Remove um comentário pelo ID
```

### Users

![Users endpoints](https://github.com/user-attachments/assets/e3c77372-a435-4ea2-b05b-81b91afabe6e)

### Posts

![Posts endpoints](https://github.com/user-attachments/assets/31c1ee08-4b0c-4ee7-9cdb-11ae6fe5c8aa)

### Comments

![Comments endpoints](https://github.com/user-attachments/assets/62bcaa95-07c6-44ac-b7be-899da4ad3489)

---

## Testes

O projeto conta com testes unitários para os principais serviços. Para executá-los:

```bash
pnpm test
```
