FROM node:21.1.0 AS build

WORKDIR /app

COPY . .

# Relative API URL: nginx serves the client and proxies /feeds and /entries to
# the server container (see nginx.conf).
ENV API_URL=/

RUN npm install
RUN npm run build:prod

FROM nginx:1.21.5

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build/ /usr/share/nginx/html

