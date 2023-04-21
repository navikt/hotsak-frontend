export const initMSW = async () => {
  if (window.appSettings.USE_MSW === true) {
    const { barnebrillesakStore } = await import('./mockdata/BarnebrillesakStore')
    const { journalpostStore } = await import('./mockdata/JournalpostStore')
    const { saksbehandlerStore } = await import('./mockdata/SaksbehandlerStore')

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
