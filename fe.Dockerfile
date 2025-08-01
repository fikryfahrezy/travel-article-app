FROM node:22.17.1-bookworm AS base

RUN npm install -g corepack@latest
RUN corepack enable
RUN corepack prepare pnpm --activate

FROM base AS builder
WORKDIR /app

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY pnpm-workspace.yaml ./
COPY package*json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY ./apps/front-end/package*json ./apps/front-end/

RUN pnpm install --frozen-lockfile

COPY ./apps/front-end/ ./apps/front-end/
RUN npm run fe:build

FROM nginx:1.29.0-bookworm AS runner
WORKDIR /app

COPY ./fe.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/front-end/dist/ /var/www/out/