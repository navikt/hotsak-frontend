import {
  ConsoleInstrumentation,
  ErrorsInstrumentation,
  LogLevel,
  SessionInstrumentation,
  faro,
  getWebInstrumentations,
  initializeFaro,
} from '@grafana/faro-web-sdk'

export const initFaro = () => {
  console.log(`Setting up Faro  with url ${window.appSettings.FARO_URL}`)

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
