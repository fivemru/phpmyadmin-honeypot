FROM node:12.18-alpine3.12 as base

WORKDIR /usr/src/app

ENV NODE_ENV=production
ENV PORT=3000
ENV MOUNT_URL=/phpmyadmin/

COPY package.json package-lock.json ./
RUN npm install --production --no-optional

# build
FROM base as build
RUN npm install --only=dev --no-optional
COPY . .
RUN npm run lint

# release
FROM base as release
COPY --from=build /usr/src/app/dist ./dist

VOLUME [ "/usr/src/app/logs" ]

EXPOSE $PORT
ENTRYPOINT [ "node", "./dist/index.js" ]