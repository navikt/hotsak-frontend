import { setupWorker } from 'msw'

import { setupStore } from './data'
import { setupHandlers } from './handlers'

export async function setupMsw() {
  if (!window.appSettings.USE_MSW) {
    return
  }

  const store = await setupStore()
  const { saksbehandlerStore, personStore, hjelpemiddelStore, journalpostStore, sakStore, barnebrillesakStore } = store

  try {
    await saksbehandlerStore.populer()
    await personStore.populer()
    await hjelpemiddelStore.populer()
    await journalpostStore.populer()
    await sakStore.populer()
    await barnebrillesakStore.populer()
  } catch (e) {
    console.warn(e)
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
        barnebrillesakStore.delete(),
        sakStore.delete(),
        journalpostStore.delete(),
        hjelpemiddelStore.delete(),
        personStore.delete(),
        saksbehandlerStore.delete(),
      ]).catch(console.warn)
    },
  }

  const worker = setupWorker(...setupHandlers(store))
  worker.printHandlers()
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}
