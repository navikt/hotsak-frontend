import { setupWorker } from 'msw'

import { setupStore } from './data'
import { setupHandlers } from './handlers'

export async function setupMsw() {
  if (!window.appSettings.USE_MSW) {
    return
  }

  const store = await setupStore()
  const { saksbehandlerStore, personStore, hjelpemiddelStore, journalpostStore, sakStore, barnebrillesakStore } = store

  await saksbehandlerStore.populer()
  await personStore.populer()
  await hjelpemiddelStore.populer()
  await journalpostStore.populer()
  await sakStore.populer()
  await barnebrillesakStore.populer()

  const worker = setupWorker(...setupHandlers(store))
  worker.printHandlers()
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}
