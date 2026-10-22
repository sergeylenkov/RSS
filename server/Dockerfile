# syntax=docker/dockerfile:1

# The sources are TypeScript, so they are compiled in a build stage that has the
# full toolchain installed. The runtime stage only carries `dist/` and the
# production dependencies.
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

# `npm ci --omit=dev` keeps typescript/tsx/mocha out of the image.
RUN npm ci --omit=dev

COPY --from=build /app/dist ./dist

EXPOSE 9000

CMD ["node", "dist/index.js", "--p=9000", "--db=db/database.sqlite"]
