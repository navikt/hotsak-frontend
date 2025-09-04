import type { Faro } from '@grafana/faro-web-sdk'
import type { InnloggetAnsatt } from './tilgang/Ansatt.ts'

declare global {
  interface Window {
    msw?: any
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
    }
    faro?: Faro
    umami?: {
      track: (event: string, data: object) => void
    }
    store: {
      saksbehandlere(): Promise<InnloggetAnsatt[]>
      byttInnloggetSaksbehandler(id: string): void
      delete(): Promise<any>
    }
  }
}
