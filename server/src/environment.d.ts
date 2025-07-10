declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NAIS_CLUSTER_NAME: 'test' | 'local' | 'dev-gcp' | 'prod-gcp'

      API_URL: string
      BRILLEKALKULATOR_API_URL: string
      FINN_ALTERNATIV_PRODUKT_API_URL: string
      FARO_URL: string
      FINN_HJELPEMIDDEL_API_URL: string

      CLIENT_ID_HOTSAK_API: string

      NODE_ENV: 'development' | 'test' | 'production'
      PORT?: string

      USE_MSW?: 'true' | 'false'
    }
  }
}

export {}
