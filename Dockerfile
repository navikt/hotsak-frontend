# build client
FROM node:18.14.0-alpine as client-builder
WORKDIR /app
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client .
RUN npm run test:ci && npm run build

# build server
FROM node:18.14.0-alpine as server-builder
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server .
RUN npm run build

# install server dependencies
FROM node:18.14.0-alpine as server-dependencies
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit dev

# runtime
FROM gcr.io/distroless/nodejs:18 as runtime
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV TZ="Europe/Oslo"
EXPOSE 3000

COPY --from=client-builder /app/dist ./client/dist
COPY --from=server-builder /app/dist ./server/dist

WORKDIR /app/server

COPY --from=server-dependencies /app/node_modules ./node_modules

CMD [ "-r", "source-map-support/register", "-r", "dotenv/config", "dist/server.js" ]
