import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      NAIS_CLUSTER_NAME: 'test',
      API_URL: 'http://hm-saksbehandling.test',
      BRILLEKALKULATOR_API_URL: 'http://hm-brille-api.test',
      FARO_URL: 'http://faro.test',
      FINN_HJELPEMIDDEL_API_URL: 'http://hm-grunndata-search.test',
      FINN_ALTERNATIV_PRODUKT_API_URL: 'http://finnalternativprodukt.test',
      CLIENT_ID_HOTSAK_API: 'test',
      USE_MSW: 'false',

      AZURE_APP_CLIENT_ID: 'test',
      AZURE_APP_JWK: '',
      AZURE_OPENID_CONFIG_ISSUER: 'test',
      AZURE_OPENID_CONFIG_JWKS_URI: 'http://azure.test/keys',
      AZURE_OPENID_CONFIG_TOKEN_ENDPOINT: 'http://azure.test/token',
    },
  },
})
