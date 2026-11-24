# syntax=docker/dockerfile:1

# The sources are TypeScript, so they are compiled in a build stage that has the
# full toolchain installed. The runtime stage only carries `dist/` and the
# production dependencies.
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

# Registry connections from inside Docker are slow and sometimes get reset
# (EIDLETIMEOUT/ECONNRESET), so every attempt is retried while the cache mount
# keeps the already downloaded tarballs for the next attempt or build.
RUN --mount=type=cache,target=/root/.npm \
    set -e; \
    for attempt in 1 2 3 4 5; do \
        npm ci --no-audit --no-fund \
            --fetch-retries=3 --fetch-retry-mintimeout=20000 \
            --fetch-retry-maxtimeout=120000 --fetch-timeout=600000 \
            --maxsockets=4 && exit 0; \
        echo "npm ci attempt $attempt failed, retrying..."; \
        sleep 5; \
    done; \
    echo "npm ci failed after 5 attempts" >&2; \
    exit 1

COPY . .

RUN npm run build

# Pruning here instead of running a second `npm ci` in the runtime stage keeps
# typescript/tsx/mocha out of the image without downloading everything again
# (sqlite3 would otherwise re-fetch its prebuilt binary from GitHub).
RUN npm prune --omit=dev

FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

EXPOSE 9000

CMD ["node", "dist/index.js", "--p=9000", "--db=db/database.sqlite"]
