FROM node:12.18-alpine3.12 as base

WORKDIR /usr/src/app

ENV PORT=3000
ARG NODE_ENV=production

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

EXPOSE $PORT
ENTRYPOINT [ "node", "./dist/index.js" ]