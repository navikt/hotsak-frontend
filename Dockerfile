FROM node:lts-alpine AS node
RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    npm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN)
RUN npm config set @navikt:registry=https://npm.pkg.github.com

# build client
FROM node AS client-builder
ENV HUSKY=0
WORKDIR /app
COPY client/package.json client/package-lock.json ./
RUN npm ci
COPY client .
RUN npm run test:ci && npm run build

# build server
FROM node AS server-builder
ENV HUSKY=0
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci
COPY server .
RUN npm run build

# install server dependencies
FROM node AS server-dependencies
ENV HUSKY=0
WORKDIR /app
COPY server/package.json server/package-lock.json ./
RUN npm ci --omit dev

# runtime
FROM gcr.io/distroless/nodejs22-debian12 AS runtime
WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV TZ="Europe/Oslo"
EXPOSE 3000

COPY --from=client-builder /app/dist ./client/dist
COPY --from=server-builder /app/dist ./server/dist

WORKDIR /app/server

COPY --from=server-dependencies /app/node_modules ./node_modules

CMD [ "--enable-source-maps", "dist/server.mjs" ]
