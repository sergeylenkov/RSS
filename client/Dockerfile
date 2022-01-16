FROM node:16.13.1 AS build

WORKDIR /app

COPY . .

RUN npm install
RUN npm run build:prod

FROM nginx:1.21.5

COPY --from=build /app/build/ /usr/share/nginx/html
