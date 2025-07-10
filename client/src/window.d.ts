import type { InnloggetAnsatt } from './tilgang/Ansatt.ts'

declare global {
  interface Window {
    msw: any
    appSettings: {
      USE_MSW?: boolean
      GIT_COMMIT?: string
      MILJO?: 'local' | 'dev-gcp' | 'prod-gcp' | string
      FARO_URL?: string
      IMAGE_PROXY_URL: string
    }
    store: {
      saksbehandlere(): Promise<InnloggetAnsatt[]>
      byttInnloggetSaksbehandler(id: string): void
      delete(): Promise<any>
    }
  }
}
