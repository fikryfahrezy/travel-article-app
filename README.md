# Travel Article App

- Web: https://travel-article-app-fe.fahrezy.work
- API: https://travel-article-app-be.fahrezy.work
- Swagger: https://travel-article-app-be.fahrezy.work/docs

## Setup Development

### Create .env file

#### For the frontend

```bash
# cd apps/front-end
cp .env.example .env
```

```bash
VITE_API_BASE_URL=http://localhost:3000  # The Backend API base url
```

#### For the backend

```bash
# cd apps/backend-end
cp .env.example .env
```

```bash
DATABASE_HOST=127.0.0.1                                                     # The PostgreSQL database server host
DATABASE_PORT=5432                                                          # The PostgreSQL database server port
DATABASE_USERNAME=postgres                                                  # The username for connecting to the database
DATABASE_PASSWORD=postgres                                                  # The password of the username
DATABASE_DBNAME=postgres                                                    # The database name to use
JWT_SECRET="openssl rand -base64 32"                                        # Used to sign and verify JWT token, random string
JWT_ISSUER=https://localhost                                                # Used for `iss` claim in the JWT
TOKEN_COOKIE_DOMAIN=.domain.com                                             # The domain where the cookie for access_token and refresh_token are set
CORS_ORIGINS=http://localhost:5173,https://domain.com,https://domain.co     # The origin for the `Access-Control-Allow-Origin` header
```

### Install dependencies

```bash
# in project root
pnpm install
```

### Run database migration

```bash
# cd apps/backend-end
npm run migrate:up:env
```

### Run the apps

```bash
# in project root
npm run fe:dev
npm run be:dev

# or `cd apps/front-end`
npm run dev

# or `cd apps/backend-end`
npm run dev
```

## Run using Docker

### Run the backend

From the root of the project, first create `.env` file that is similar to the above, and then run:

#### Without

Run:

```bash
docker compose --progress ./be.docker-compose.yaml up  --build
```

#### With database

When using with a database version, add these key pairs. Make sure the value is equal to the `DATABASE_DBNAME`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD`, respectively

```bash
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
```

Change this key's value to the service name for the database in the `be-with-db.docker-compose.yaml`

```bash
DATABASE_HOST=db
```

Adjust this key's value if the database service in the `be-with-db.docker-compose.yaml` use different port

```bash
DATABASE_PORT=5432
```

Run:

```bash
docker compose --progress ./be-with-db.docker-compose.yaml up --build
```

### Run the frontend

From the root of the project, first create `.env` file that is similar to the above, and then run:

```bash
docker compose --progress ./fe.docker-compose.yaml up  --build
```
