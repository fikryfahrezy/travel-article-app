FROM node:22.17.1-bookworm AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY pnpm-workspace.yaml ./
COPY package*json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY ./apps/front-end-with-query/package*json ./apps/front-end-with-query/

RUN pnpm install --frozen-lockfile

COPY ./apps/front-end-with-query/ ./apps/front-end-with-query/
RUN npm run fe:query:build

FROM nginx:1.29.0-bookworm AS runner
WORKDIR /app

COPY ./fe.nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/front-end-with-query/dist/ /var/www/out/