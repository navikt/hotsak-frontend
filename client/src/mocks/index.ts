import type { RequestHandler } from 'msw'
import { logDebug } from '../utvikling/logDebug'
import { oppgaveIdUtenPrefix } from '../oppgave/oppgaveTypes.ts'

export async function initMsw(): Promise<unknown> {
  const { USE_MSW, USE_MSW_GRUNNDATA, USE_MSW_ALTERNATIVPRODUKTER } = window.appSettings
  if (!(USE_MSW || USE_MSW_GRUNNDATA || USE_MSW_ALTERNATIVPRODUKTER)) {
    return
  }

  localStorage.debug = 'hotsak-frontend'

  const { setupWorker } = await import('msw/browser')
  const { setupStore } = await import('./data')
  const { setupHotsakApiHandlers, setupGrunndataHandlers, setupAlternativprodukterHandlers } = await import(
    './handlers'
  )

  const store = await setupStore()
  const {
    saksbehandlerStore,
    personStore,
    hjelpemiddelStore,
    sakStore,
    oppgaveStore,
    notatStore,
    endreHjelpemiddelStore,
  } = store

  try {
    await saksbehandlerStore.populer()
    await personStore.populer()
    await hjelpemiddelStore.populer()
    // await journalpostStore.populer()
    await sakStore.populer()
    await oppgaveStore.populer()
    await notatStore.populer()
    await endreHjelpemiddelStore.populer()

    const oppgr = await oppgaveStore.alle()
    oppgaveStore.tildel(oppgr[0].oppgaveId)
    await sakStore.tildel(oppgaveIdUtenPrefix(oppgr[0].oppgaveId))
    oppgaveStore.tildel(oppgr[1].oppgaveId)
    await sakStore.tildel(oppgaveIdUtenPrefix(oppgr[1].oppgaveId))
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

  const handlers = [
    ...(USE_MSW ? setupHotsakApiHandlers(store) : []),
    ...(USE_MSW_GRUNNDATA ? setupGrunndataHandlers(store) : []),
    ...(USE_MSW_ALTERNATIVPRODUKTER ? setupAlternativprodukterHandlers(store) : []),
  ]
  const worker = setupWorker(...handlers)
  worker.listHandlers().forEach((handler) => {
    if ((handler as RequestHandler).info) {
      logDebug((handler as RequestHandler).info.header)
    }
  })
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}
