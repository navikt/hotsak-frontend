# build server
FROM golang:1.25.1-alpine AS server-builder
WORKDIR /app
COPY server ./
RUN go test -v ./... && go build .

# build client
FROM node:lts-alpine AS client-builder
ENV HUSKY=0
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.24.0 --activate
RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
    pnpm config set //npm.pkg.github.com/:_authToken=$(cat /run/secrets/NODE_AUTH_TOKEN)
RUN pnpm config set @navikt:registry=https://npm.pkg.github.com
WORKDIR /app
COPY client/package.json client/pnpm-lock.yaml ./
RUN pnpm ci
COPY client .
RUN pnpm run test:ci && pnpm run build

# runtime
FROM gcr.io/distroless/static-debian12 AS runtime
WORKDIR /app

ENV TZ="Europe/Oslo"
EXPOSE 3000

COPY --from=client-builder /app/dist ./dist
COPY --from=server-builder /app/hotsak-frontend-server .

CMD [ "./hotsak-frontend-server" ]
