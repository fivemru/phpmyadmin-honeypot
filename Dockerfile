FROM node:12.18-alpine3.12 AS base
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm install --production --no-optional

ENV NODE_ENV=production
ENV PORT=3000
ENV MOUNT_PATH=/phpmyadmin/

# build
FROM base AS build-app
RUN npm install --only=dev --no-optional
COPY . .
RUN npm run lint && pwd && ls -la

# release
FROM base AS release
COPY --from=build-app /usr/src/app/public ./public
COPY --from=build-app /usr/src/app/src ./dist

VOLUME [ "/usr/src/app/logs/" ]
EXPOSE $PORT
ENTRYPOINT [ "node", "./dist/index.js" ]