import { InnloggetSaksbehandler } from './state/authentication'

declare global {
  interface Window {
    msw: any
    appSettings: {
      USE_MSW?: boolean
      MILJO?: 'local' | 'dev-gcp' | 'prod-gcp' | string
    }
    store: {
      saksbehandlere(): Promise<InnloggetSaksbehandler[]>
      byttInnloggetSaksbehandler(id: string): Promise<any>
      delete(): Promise<any>
    }
  }
}