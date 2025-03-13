import { RequestHandler } from 'msw'
import { logDebug } from '../utvikling/logDebug'

export async function initMsw(): Promise<unknown> {
  if (!window.appSettings.USE_MSW) {
    return
  }

  localStorage.debug = 'hotsak-frontend'

  const { setupWorker } = await import('msw/browser')
  const { setupStore } = await import('./data')
  const { setupHandlers } = await import('./handlers')

  const store = await setupStore()
  const {
    saksbehandlerStore,
    personStore,
    hjelpemiddelStore,
    journalpostStore,
    sakStore,
    barnebrillesakStore,
    oppgaveStore,
    notatStore,
    endreHjelpemiddelStore,
  } = store

  try {
    await saksbehandlerStore.populer()
    await personStore.populer()
    await hjelpemiddelStore.populer()
    await journalpostStore.populer()
    await sakStore.populer()
    await barnebrillesakStore.populer()
    await oppgaveStore.populer()
    await notatStore.populer()
    await endreHjelpemiddelStore.populer()
  } catch (err: unknown) {
    console.warn(err)
  }

  window.store = {
    async saksbehandlere() {
      return saksbehandlerStore.alle()
    },
    byttInnloggetSaksbehandler(id: string) {
      saksbehandlerStore.byttInnloggetSaksbehandler(id)
    },
    async delete() {
      return Promise.all([
        endreHjelpemiddelStore.delete(),
        barnebrillesakStore.delete(),
        sakStore.delete(),
        journalpostStore.delete(),
        hjelpemiddelStore.delete(),
        personStore.delete(),
        saksbehandlerStore.delete(),
        oppgaveStore.delete(),
        notatStore.delete(),
      ]).catch(console.warn)
    },
  }

  const worker = setupWorker(...setupHandlers(store))
  worker.listHandlers().forEach((handler) => {
    if ((handler as RequestHandler).info) {
      logDebug((handler as RequestHandler).info.header)
    }
  })
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}
