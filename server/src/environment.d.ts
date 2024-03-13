declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NAIS_CLUSTER_NAME: string

      API_URL: string
      BRILLEKALKULATOR_API_URL: string
      FARO_URL: string
      FINN_HJELPEMIDDEL_API_URL: string
      HEIT_KRUKKA_URL: string

      CLIENT_ID_HOTSAK_API: string
      CLIENT_ID_HEIT_KRUKKA_API: string

      NODE_ENV: 'development' | 'production'
      PORT?: string

      USE_MSW?: 'true' | 'false'
    }
  }
}

export {}
