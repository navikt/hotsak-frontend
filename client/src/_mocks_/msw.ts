import { worker } from './browser'

export const initMSW = async () => {
  if (window.appSettings.USE_MSW === true) {
    const { worker } = await import('./browser')
    worker.printHandlers()
    return worker.start({
      onUnhandledRequest: 'bypass',
    })
  }
}
