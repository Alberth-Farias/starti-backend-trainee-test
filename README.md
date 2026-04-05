# Starti Backend Trainee Test

API REST com NestJS + Prisma + PostgreSQL.

## Pré-requisitos

- Node.js 20+
- pnpm
- Docker e Docker Compose

## Configuração rápida

1. Copie o arquivo de ambiente:

```bash
cp .env.example .env
```

2. Preencha:

```env
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=starti_db
PORT=3000
NODE_ENV=development
```

ATENÇÃO: Deixe as informações do `DATABASE_URL` equivalentes a dos campos preenchidos anteriormente no env.


3. Use o `DATABASE_URL` conforme o modo de execução:

- app em Docker:

```env
DATABASE_URL="postgresql://postgres:postgres@database:5432/starti_db"
```

- app local (com DB Docker):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/starti_db"
```

## Como rodar

### 1) Aplicação + DB em Docker

```bash
docker compose up -d --build
```

Na primeira execução (banco vazio):

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/starti_db"
pnpm prisma migrate deploy
docker compose restart application
```

### 2) Aplicação local + DB em Docker

```bash
docker compose up -d database
pnpm install
pnpm prisma generate
pnpm prisma migrate deploy
pnpm start:dev
```

## Swagger

- URL: `http://localhost:3000/api`
- Disponível quando `NODE_ENV !== 'production'`.

## Exemplos de endpoints (validados)

Base URL:

```bash
BASE_URL="http://localhost:3000"
```

### Users

```bash
curl -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "ReginaldoRossi",
    "name": "Reginaldo Rossi",
    "email": "reginaldo@example.com",
    "password": "Reginaldo@123",
    "biography": "Most famous singer in the world"
  }'

curl -X GET "$BASE_URL/users/1"

curl -X PUT "$BASE_URL/users/1" \
  -H "Content-Type: application/json" \
  -d '{"biography": "Biografia atualizada"}'

curl -X GET "$BASE_URL/users/1/posts"
curl -X GET "$BASE_URL/users/1/comments"
curl -X DELETE "$BASE_URL/users/1"
```

### Posts

```bash
curl -X POST "$BASE_URL/posts" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "text": "The show was full and the crowd was incredible.",
    "archived": false
  }'

curl -X GET "$BASE_URL/posts/1"

curl -X PUT "$BASE_URL/posts/1" \
  -H "Content-Type: application/json" \
  -d '{"text": "Updated post text"}'

curl -X PATCH "$BASE_URL/posts/1/archive"
curl -X GET "$BASE_URL/posts/1/comments"
curl -X DELETE "$BASE_URL/posts/1"
```

### Comments

```bash
curl -X POST "$BASE_URL/comments" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "postId": 1,
    "message": "Amazing performance!"
  }'

curl -X PATCH "$BASE_URL/comments/1" \
  -H "Content-Type: application/json" \
  -d '{"message": "Updated comment text"}'

curl -X DELETE "$BASE_URL/comments/1"
```

## Testes

```bash
pnpm test
```
