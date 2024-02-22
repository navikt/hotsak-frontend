import { InnloggetSaksbehandler } from './state/authentication'

declare global {
  interface Window {
    msw: any
    appSettings: {
      USE_MSW?: boolean
      GIT_COMMIT?: string
      MILJO?: 'local' | 'dev-gcp' | 'prod-gcp' | string
      FARO_URL?: string
    }
    store: {
      saksbehandlere(): Promise<InnloggetSaksbehandler[]>
      byttInnloggetSaksbehandler(id: string): void
      delete(): Promise<any>
    }
  }
}
