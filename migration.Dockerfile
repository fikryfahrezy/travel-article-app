FROM node:22.17.1-bookworm AS base

RUN npm install -g corepack@latest
RUN corepack enable
RUN corepack prepare pnpm --activate

FROM base AS installer
WORKDIR /app
 
COPY pnpm-workspace.yaml ./
COPY package*json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY ./apps/back-end/package*json ./apps/back-end/

RUN pnpm install --frozen-lockfile

COPY ./apps/back-end/tsconfig.json ./apps/back-end/
COPY ./apps/back-end/migration/ ./apps/back-end/migration/

CMD ["sh", "-c", "npm run migrate:up ; exit"]