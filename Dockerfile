FROM node:22-alpine AS builder

# Пин pnpm на v10: pnpm@latest уехал на v11, где strictDepBuilds=true роняет
# install из-за пропущенных build-скриптов (ERR_PNPM_IGNORED_BUILDS).
# v10 совместим с lockfileVersion 9.0 и собирает проект как раньше.
RUN corepack enable && corepack prepare pnpm@10 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build && pnpm run build:server

RUN pnpm prune --prod

FROM node:22-alpine

WORKDIR /app

COPY --from=builder /app/build ./build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

ENV NODE_ENV=production
ENV PORT=5391

EXPOSE 5391

CMD ["node", "build/server-node/index.js"]
