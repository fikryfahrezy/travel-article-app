FROM node:22.17.1-bookworm AS base

RUN npm install -g corepack@latest
RUN corepack enable
RUN corepack prepare pnpm --activate

FROM base AS builder
WORKDIR /app
 
COPY pnpm-workspace.yaml ./
COPY package*json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY ./apps/back-end/package*json ./apps/back-end/

RUN pnpm install --frozen-lockfile

COPY ./apps/back-end/ ./apps/back-end/
RUN npm run be:build

FROM base AS installer
WORKDIR /app
 
COPY pnpm-workspace.yaml ./
COPY package*json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY ./apps/back-end/package*json ./apps/back-end/

RUN pnpm install --frozen-lockfile --prod

FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=installer --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=installer --chown=nestjs:nodejs /app/apps/back-end/node_modules ./apps/back-end/node_modules
COPY --from=builder --chown=nestjs:nodejs /app/apps/back-end/dist/src ./apps/back-end/dist

USER nestjs

ENV PORT=8080
EXPOSE 8080

CMD ["node", "apps/back-end/dist/main"]