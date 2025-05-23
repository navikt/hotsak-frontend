import type { RequestHandler } from 'msw'
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
      const databases = await indexedDB.databases()
      return await Promise.all(
        databases.map((database) => {
          if (database.name) {
            console.log(`Sletter database: ${database.name}`)
            return new Promise((resolve, reject) => {
              const request = indexedDB.deleteDatabase(database.name!)
              request.onsuccess = () => resolve(undefined)
              request.onerror = () => reject(request.error)
              request.onblocked = () => {
                console.warn(`Sletting blokkert for: ${database.name}`)
              }
            })
          }
        })
      )
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
