FROM navikt/node-express:16

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
ENV TZ="Europe/Oslo"

WORKDIR /app

COPY client/dist client/dist
COPY server/node_modules server/node_modules
COPY server/dist server/dist

EXPOSE 3000

ENTRYPOINT [ "/entrypoint.sh", "node --max-http-header-size=16000 /app/server/dist/server.js" ]
