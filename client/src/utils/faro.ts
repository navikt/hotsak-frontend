export async function initFaro(): Promise<void> {
  if (!import.meta.env.PROD || window.appSettings.USE_MSW) {
    return
  }

  const {
    ConsoleInstrumentation,
    ErrorsInstrumentation,
    getWebInstrumentations,
    initializeFaro,
    LogLevel,
    SessionInstrumentation,
  } = await import('@grafana/faro-web-sdk')

  initializeFaro({
    url: window.appSettings.FARO_URL,
    app: {
      name: 'hotsak-frontend',
    },
    instrumentations: [
      new ErrorsInstrumentation(),
      ...getWebInstrumentations({ captureConsole: true }),
      new ConsoleInstrumentation({
        disabledLevels: [LogLevel.TRACE], // console.log will be captured
      }),
      new SessionInstrumentation(),
    ],
  })
}
