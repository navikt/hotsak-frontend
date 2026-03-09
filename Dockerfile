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
RUN corepack enable
WORKDIR /app
RUN pnpm config set @navikt:registry=https://npm.pkg.github.com 
COPY .npmrc client/package.json client/pnpm-lock.yaml client/pnpm-workspace.yaml ./
RUN cat .npmrc && pnpm install --frozen-lockfile
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
