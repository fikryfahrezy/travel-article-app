FROM node:22.17.1-bookworm AS base

RUN npm install -g corepack@latest
RUN corepack enable
RUN corepack prepare pnpm --activate

FROM base AS builder
WORKDIR /app
 
COPY package*json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY pnpm-workspace.yaml ./
COPY ./apps/front-end/package*json ./apps/front-end/

RUN pnpm install --frozen-lockfile

COPY . .
RUN npm run fe:build

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 vue

COPY --from=builder --chown=vue:nodejs /app/apps/front-end/dist/ ./dist

RUN npm install --global http-server

USER vue

# Default port from `http-server`
EXPOSE 8080

CMD ["http-server", "dist"]