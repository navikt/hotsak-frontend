import { worker } from './browser'
import { barnebrillesakStore } from './mockdata/BarnebrillesakStore'
import { journalpostStore } from './mockdata/JournalpostStore'
import { saksbehandlerStore } from './mockdata/SaksbehandlerStore'

export const initMSW = async () => {
  if (window.appSettings.USE_MSW === true) {
    await saksbehandlerStore.populer()
    await journalpostStore.populer()
    await barnebrillesakStore.populer()

    const { worker } = await import('./browser')
    worker.printHandlers()
    return worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}
