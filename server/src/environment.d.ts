declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NAIS_CLUSTER_NAME: 'test' | 'local' | 'dev-gcp' | 'prod-gcp'
      NODE_ENV: 'development' | 'test' | 'production'
      FARO_URL: string

      HOTSAK_API_URL: string
      HOTSAK_API_CLIENT_ID: string

      GRUNNDATA_API_URL: string
      ALTERNATIVPRODUKTER_API_URL: string
      BRILLE_API_URL: string

      PORT?: string

      USE_MSW?: 'true' | 'false'
    }
  }
}

export {}
