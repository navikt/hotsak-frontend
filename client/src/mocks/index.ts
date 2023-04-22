import { setupWorker } from 'msw'

import { setupStore } from './data'
import { setupHandlers } from './handlers'

export async function setupMsw() {
  if (!window.appSettings.USE_MSW) {
    return
  }

  const store = await setupStore()
  const { saksbehandlerStore, journalpostStore, barnebrillesakStore } = store

  await saksbehandlerStore.populer()
  await journalpostStore.populer()
  await barnebrillesakStore.populer()

  const worker = setupWorker(...setupHandlers(store))
  worker.printHandlers()
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}
