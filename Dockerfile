FROM node:12.18-alpine3.12

WORKDIR /usr/src/app

ENV PORT=3000
ARG NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm install --production --no-optional
COPY . .
RUN npm run lint

EXPOSE $PORT

ENTRYPOINT [ "node", "./dist/index.js" ]