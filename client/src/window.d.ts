import { type Faro } from '@grafana/faro-web-sdk'

declare global {
  interface Window {
    msw?: unknown
    appSettings: {
      NAIS_CLUSTER_NAME?: 'local' | 'dev-gcp' | 'prod-gcp' | string

      FARO_URL?: string
      IMAGE_PROXY_URL: string

      UMAMI_ENABLED?: boolean
      UMAMI_WEBSITE_ID?: string

      USE_MSW?: boolean
      USE_MSW_GRUNNDATA?: boolean
      USE_MSW_ALTERNATIVPRODUKTER?: boolean

      GIT_COMMIT?: string

      GOSYS_OPPGAVEBEHANDLING_URL?: string
      MODIA_URL?: string
      SPORREUNDERSOKELSE_URL?: string
    }
    faro?: Faro
    store: {
      delete(): Promise<unknown>
    }
  }
}
