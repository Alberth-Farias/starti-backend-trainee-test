# Starti Backend Trainee Test

API REST com NestJS + Prisma + PostgreSQL.

## Pré-requisitos

- Node.js 20+
- pnpm
- Docker e Docker Compose

## Configuração rápida

1. Copie o arquivo de ambiente e instale as dependências:

```bash
cp .env.example .env
pnpm install
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

<img width="1393" height="583" alt="image" src="https://github.com/user-attachments/assets/e3c77372-a435-4ea2-b05b-81b91afabe6e" />


### Posts

<img width="1393" height="479" alt="image" src="https://github.com/user-attachments/assets/31c1ee08-4b0c-4ee7-9cdb-11ae6fe5c8aa" />


### Comments

<img width="1393" height="519" alt="image" src="https://github.com/user-attachments/assets/62bcaa95-07c6-44ac-b7be-899da4ad3489" />


## Testes

```bash
pnpm test
```
