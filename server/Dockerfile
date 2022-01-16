# syntax=docker/dockerfile:1
FROM node:16.13.1

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 9000

CMD ["node", "index.js", "-p 9000"]
