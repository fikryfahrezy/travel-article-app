FROM node:22.17.1-bookworm AS base

RUN npm install -g corepack@latest
RUN corepack enable
RUN corepack prepare pnpm --activate

FROM base AS builder
WORKDIR /app
 
COPY package*json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN npm run build

FROM base AS installer
WORKDIR /app
 
COPY package*json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile --prod

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist/ ./dist

USER nestjs

ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/main"]