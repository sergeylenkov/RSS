# syntax=docker/dockerfile:1

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

# Relative API URL: nginx serves the client and proxies /feeds and /entries to
# the server container (see nginx.conf).
ENV API_URL=/

RUN npm run build:prod

FROM nginx:1.21.5

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/ /usr/share/nginx/html
