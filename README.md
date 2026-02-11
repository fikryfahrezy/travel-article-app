# Travel Article App

- Web: https://travel.fahrezy.work
- API: https://travel-api.fahrezy.work
- Swagger: https://travel-api.fahrezy.work/docs

<img width="1191" height="687" alt="image" src="https://github.com/user-attachments/assets/38737baa-b635-4452-ac18-523424c13388" />


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

## API Endpoints

### Health

Request:

```bash
curl -X 'GET' \
  'https://travel-article-app-be.fahrezy.work/api/health' \
  -H 'accept: application/json'
```

Response:

```bash
{
  "status": "ok",
  "info": {
    "database": {
      "status": "up"
    }
  },
  "error": {},
  "details": {
    "database": {
      "status": "up"
    }
  }
}
```

### Auth

#### Register

Request:

```bash
curl -X 'POST' \
  'https://travel-article-app-be.fahrezy.work/api/auth/register' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "name": "name",
  "username": "username",
  "password": "password"
}'
```

Response (201):

```bash
{
  "token_type": "Bearer",
  "expires_in": 300,
  "access_token": "eyJhbGciOiJIUzI1N........",
  "refresh_token": "3cLACpKHFIzL......."
}
```

#### Login

Request:

```bash
curl -X 'POST' \
  'https://travel-article-app-be.fahrezy.work/api/auth/login' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "username": "username",
  "password": "password"
}'
```

Response (200):

```bash
{
  "token_type": "Bearer",
  "expires_in": 300,
  "access_token": "eyJhbGciOiJIUzI1N........",
  "refresh_token": "3cLACpKHFIzL......."
}
```

#### Refresh (to refresh the access_token)

Request:

```bash
curl -X 'POST' \
  'https://travel-article-app-be.fahrezy.work/api/auth/refresh' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "refresh_token": "3cLACpKHFIzL......."
}'
```

Response (200):

```bash
{
  "token_type": "Bearer",
  "expires_in": 300,
  "access_token": "eyJhbGciOiJIUzI1N........",
  "refresh_token": "3cLACpKHFIzL......."
}
```

#### Logout

Request:

```bash
curl -X 'POST' \
  'https://travel-article-app-be.fahrezy.work/api/auth/logout' \
  -H 'accept: application/json' \
  -d ''
```

Response (200):

```bash
{
  "success": true
}
```


#### Profile

Request:

```bash
curl -X 'GET' \
  'https://travel-article-app-be.fahrezy.work/api/auth/profile' \
  -H 'accept: application/json'
```

Response (200):

```bash
{
  "user_id": "fc1c9f91-af07-41cb-90ac-e088adfbdf30",
  "username": "username"
}
```

### Article

#### Create Article

Request:

```bash
curl -X 'POST' \
  'https://travel-article-app-be.fahrezy.work/api/articles' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "title": "string",
  "content": "string"
}'
```

Response (201):

```bash
{
  "id": "45a68fea-566f-4e0d-a13f-b73189718f9a"
}
```

#### Get All Articles

Request:

```bash
curl -X 'GET' \
  'https://travel-article-app-be.fahrezy.work/api/articles?page=1&limit=10' \
  -H 'accept: application/json'
```

Response (200):

```bash
{
  "page": 1,
  "limit": 10,
  "total_data": 2,
  "total_pages": 1,
  "data": [
    {
      "id": "45a68fea-566f-4e0d-a13f-b73189718f9a",
      "title": "string",
      "liked": false,
      "slug": "string-67wq5uxp1e0",
      "author_id": "fc1c9f91-af07-41cb-90ac-e088adfbdf30",
      "author_username": "username",
      "updated_at": "2025-08-02T13:30:03.322Z",
      "created_at": "2025-08-02T13:30:03.322Z"
    }
  ]
}
```

#### Get One Article

Request:

```bash
curl -X 'GET' \
  'https://travel-article-app-be.fahrezy.work/api/articles/45a68fea-566f-4e0d-a13f-b73189718f9a' \
  -H 'accept: application/json'
```

Response (200):

```bash
{
  "id": "45a68fea-566f-4e0d-a13f-b73189718f9a",
  "title": "string",
  "liked": false,
  "slug": "string-67wq5uxp1e0",
  "author_id": "fc1c9f91-af07-41cb-90ac-e088adfbdf30",
  "author_username": "username",
  "updated_at": "2025-08-02T13:30:03.322Z",
  "created_at": "2025-08-02T13:30:03.322Z",
  "content": "string"
}
```

#### Update Article

Request:

```bash
curl -X 'PATCH' \
  'https://travel-article-app-be.fahrezy.work/api/articles/45a68fea-566f-4e0d-a13f-b73189718f9a' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "title": "string",
  "content": "string"
}'
```

Response (200):

```bash
{
  "id": "45a68fea-566f-4e0d-a13f-b73189718f9a"
}
```

#### Update Article

Request:

```bash
curl -X 'PATCH' \
  'https://travel-article-app-be.fahrezy.work/api/articles/45a68fea-566f-4e0d-a13f-b73189718f9a' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "title": "string",
  "content": "string"
}'
```

Response (200):

```bash
{
  "id": "45a68fea-566f-4e0d-a13f-b73189718f9a"
}
```

#### Delete Article

Request:

```bash
curl -X 'DELETE' \
  'https://travel-article-app-be.fahrezy.work/api/articles/45a68fea-566f-4e0d-a13f-b73189718f9a' \
  -H 'accept: application/json'
```

Response (200):

```bash
{
  "id": "45a68fea-566f-4e0d-a13f-b73189718f9a"
}
```

#### Like Article

Request:

```bash
curl -X 'PUT' \
  'https://travel-article-app-be.fahrezy.work/api/articles/3c4b8d7d-e2fb-464f-bb56-5995f4fc53af/likes' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "like": true
}'
```

Response (200):

```bash
{
  "id": "88021991-cecd-4c8e-932d-f381f3961e4c"
}
```

#### Create Article Comment

Request:

```bash
curl -X 'POST' \
  'https://travel-article-app-be.fahrezy.work/api/articles/3c4b8d7d-e2fb-464f-bb56-5995f4fc53af/comments' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "content": "string"
}'
```

Response (200):

```bash
{
  "id": "6c6eb292-e487-4e95-bdbd-cb1248619151"
}
```

#### Create Article Comment

Request:

```bash
curl -X 'POST' \
  'https://travel-article-app-be.fahrezy.work/api/articles/3c4b8d7d-e2fb-464f-bb56-5995f4fc53af/comments' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "content": "string"
}'
```

Response (200):

```bash
{
  "id": "6c6eb292-e487-4e95-bdbd-cb1248619151"
}
```

#### Get All Article Comments

Request:

```bash
curl -X 'GET' \
  'https://travel-article-app-be.fahrezy.work/api/articles/3c4b8d7d-e2fb-464f-bb56-5995f4fc53af/comments?page=1&limit=10' \
  -H 'accept: application/json'
```

Response (200):

```bash
{
  "page": 1,
  "limit": 10,
  "total_data": 1,
  "total_pages": 1,
  "data": [
    {
      "id": "6c6eb292-e487-4e95-bdbd-cb1248619151",
      "content": "string",
      "article_id": "3c4b8d7d-e2fb-464f-bb56-5995f4fc53af",
      "article_title": "string",
      "article_slug": "string-xg0172cb0kk",
      "article_author_id": "fc1c9f91-af07-41cb-90ac-e088adfbdf30",
      "article_author_username": "username",
      "author_id": "fc1c9f91-af07-41cb-90ac-e088adfbdf30",
      "author_username": "username",
      "updated_at": "2025-08-02T13:40:01.961Z",
      "created_at": "2025-08-02T13:40:01.961Z"
    }
  ]
}
```

#### Get One Article Comment

Request:

```bash
curl -X 'GET' \
  'https://travel-article-app-be.fahrezy.work/api/articles/comments/6c6eb292-e487-4e95-bdbd-cb1248619151' \
  -H 'accept: application/json'
```

Response (200):

```bash
{
  "id": "6c6eb292-e487-4e95-bdbd-cb1248619151",
  "content": "string",
  "article_id": "3c4b8d7d-e2fb-464f-bb56-5995f4fc53af",
  "article_title": "string",
  "article_slug": "string-xg0172cb0kk",
  "article_author_id": "fc1c9f91-af07-41cb-90ac-e088adfbdf30",
  "article_author_username": "(fc1c9f91-af07-41cb-90ac-e088adfbdf30,username,\"$argon2id$v=19$m=19456,t=2,p=1$ZWDcFRDbsthC2evNplGShQ$LURaIQ9MxdzmpDEHkUVD4LvmCs3dQvpilG/DVPUagiQ\",\"2025-08-02 13:22:27.74138+00\",\"2025-08-02 13:22:27.74138+00\",)",
  "author_id": "fc1c9f91-af07-41cb-90ac-e088adfbdf30",
  "author_username": "username",
  "updated_at": "2025-08-02T13:40:01.961Z",
  "created_at": "2025-08-02T13:40:01.961Z"
}
```

#### Update Article Comment

Request:

```bash
curl -X 'PATCH' \
  'https://travel-article-app-be.fahrezy.work/api/articles/comments/6c6eb292-e487-4e95-bdbd-cb1248619151' \
  -H 'accept: application/json' \
  -H 'Content-Type: application/json' \
  -d '{
  "content": "string"
}'
```

Response (200):

```bash
{
  "id": "6c6eb292-e487-4e95-bdbd-cb1248619151"
}
```

#### Delete Article Comment

Request:

```bash
curl -X 'DELETE' \
  'https://travel-article-app-be.fahrezy.work/api/articles/comments/6c6eb292-e487-4e95-bdbd-cb1248619151' \
  -H 'accept: application/json'
```

Response (200):

```bash
{
  "id": "6c6eb292-e487-4e95-bdbd-cb1248619151"
}
```

## Install dependencies

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

## Project Structure

The project using [`pnpm Workspace`](https://pnpm.io/workspaces) to be able to use commit hooks for 2 project in 1 `.git`.

### apps/front-end

The folder for all front-end code

```bash
src/                            # the root of project codes
|__assets/                      # all static assets used by the web
|__components/                  # all generic shareable components
|__layouts/                     # all global layouts or shareable layouts across features or pages
|__lib/                         # utils or helper code
|__pages/                       # all pages in the web
|__stores/                      # global or shareable pinia store
|__[features]/                  # domain related codes
|____[feature-name]/            # domain name
|______components/              # domain related component
|______stores/                  # domain related pinia store
|______schemas.ts               # zod schema related to the domain
```

### apps/back-end

The folder for all back-end code

```bash
src/                            # the root of project codes
|__config/                      # codes that provide any config or env used by the project
|__core/                        # codes that bridge to any 3rd party library or dependencies
|__decorators/                  # custom Nest decorator shared across the project
|__entities/                    # all database entities in TypeORM entity
|__exceptions/                  # common exceptions across the project
|__filters/                     # global filter used by the project
|__guards/                      # shareable guards across the project
|__[domain]/                    # domain specific code
|____[domain].controller.ts     # presentation layer of the domain
|____[domain].dto.ts            # input/output contract data from and to presentation in the domain
|____[domain].exception.ts      # domain related exceptions
|____[domain].filter.ts         # spesific filter related to the domain
|____[domain].module.ts         # Nest module for the domain
|____[domain].repository.ts     # data layer related to the domain
|____[domain].service.ts        # orchastration layer between presentation and data layer
```
