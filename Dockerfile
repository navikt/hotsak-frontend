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
FROM golang:1.25.1-alpine AS server-builder
WORKDIR /app
COPY server ./
RUN go test -v ./... && go build .

# runtime
FROM gcr.io/distroless/static-debian12 AS runtime
WORKDIR /app

ENV TZ="Europe/Oslo"
EXPOSE 3000

COPY --from=client-builder /app/dist ./dist
COPY --from=server-builder /app/hotsak-frontend-server .

CMD [ "./hotsak-frontend-server", "-d", "dist", "-c", "config.json" ]
