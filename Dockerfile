# syntax=docker/dockerfile:1

# ---- Stage 1: dependencies ----
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ---- Stage 2: build ----
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time env (must be provided at build; Next.js evaluates these during build)
ARG BACKEND_URL=http://localhost:8080
ARG API_PREFIX=/api/v1
ARG NEXT_PUBLIC_SITE_URL=http://localhost:3000
ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:8080
ENV BACKEND_URL=$BACKEND_URL
ENV API_PREFIX=$API_PREFIX
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_BACKEND_URL=$NEXT_PUBLIC_BACKEND_URL
ENV NODE_ENV=production
RUN pnpm build

# ---- Stage 3: runtime ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
