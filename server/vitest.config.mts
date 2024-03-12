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
      HEIT_KRUKKA_URL: 'http://heit-krukka.test',
      CLIENT_ID_HOTSAK_API: 'foo',
      CLIENT_ID_HEIT_KRUKKA_API: 'test',
      USE_MSW: 'true',

      AZURE_APP_CLIENT_ID: 'test',
      AZURE_APP_JWK: '',
      AZURE_OPENID_CONFIG_ISSUER: 'test',
      AZURE_OPENID_CONFIG_JWKS_URI: 'http://azure.test/keys',
      AZURE_OPENID_CONFIG_TOKEN_ENDPOINT: 'http://azure.test/token',
    },
  },
})
