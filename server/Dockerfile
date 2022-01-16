# syntax=docker/dockerfile:1
FROM node:16.13.1
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 8080
CMD ["node", "index.js", "-p 8080"]
