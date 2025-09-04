#!/usr/bin/env sh

export PORT=3000

# hm-mocks
export NAIS_TOKEN_ENDPOINT=http://localhost:4040/texas/api/v1/token
export NAIS_TOKEN_EXCHANGE_ENDPOINT=http://localhost:4040/texas/api/v1/token/exchange
export NAIS_TOKEN_INTROSPECTION_ENDPOINT=http://localhost:4040/texas/api/v1/introspect

export HOTSAK_API_URL=https://hotsak-api.intern.dev.nav.no
export HOTSAK_API_SCOPE=api://local.teamdigihot.hm-saksbehandling/.default

export GRUNNDATA_API_URL=https://hm-grunndata-search.intern.dev.nav.no
export ALTERNATIVPRODUKTER_API_URL=http://hm-grunndata-alternativprodukter.teamdigihot.svc.cluster.local

export BRILLE_API_URL=http://hm-brille-api.teamdigihot.svc.cluster.local

export NAIS_CLUSTER_NAME=local

export FARO_URL=
export IMAGE_PROXY_URL=

export UMAMI_ENABLED=false
export UMAMI_WEBSITE_ID=

export USE_MSW=false
export USE_MSW_GRUNNDATA=false
export USE_MSW_ALTERNATIVPRODUKTER=true

go run . -p=$PORT -d=../client/dist
