import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      NAIS_CLUSTER_NAME: 'test',
      FARO_URL: 'http://faro.test',

      HOTSAK_API_URL: 'http://hm-saksbehandling.test',
      HOTSAK_API_CLIENT_ID: 'test',

      GRUNNDATA_API_URL: 'http://hm-grunndata-search.test',
      ALTERNATIVPRODUKTER_API_URL: 'http://hm-grunndata-alternativprodukter.test',
      BRILLE_API_URL: 'http://hm-brille-api.test',

      USE_MSW: 'false',

      AZURE_APP_CLIENT_ID: 'test',
      AZURE_APP_JWK: '',
      AZURE_OPENID_CONFIG_ISSUER: 'test',
      AZURE_OPENID_CONFIG_JWKS_URI: 'http://azure.test/keys',
      AZURE_OPENID_CONFIG_TOKEN_ENDPOINT: 'http://azure.test/token',
    },
  },
})
