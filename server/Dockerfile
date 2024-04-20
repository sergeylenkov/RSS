# syntax=docker/dockerfile:1
FROM node:21.1.0

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 9000

CMD ["node", "index.js", "--p=9000", "--db=db/database.sqlite"]
