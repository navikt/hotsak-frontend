import { LogLevel, faro } from '@grafana/faro-web-sdk'

export async function initFaro(): Promise<void> {
  if (!import.meta.env.PROD || window.appSettings.USE_MSW || !window.appSettings.FARO_URL) {
    return
  }

  const {
    ConsoleInstrumentation,
    ErrorsInstrumentation,
    LogLevel,
    SessionInstrumentation,
    getWebInstrumentations,
    initializeFaro,
  } = await import('@grafana/faro-web-sdk')

  initializeFaro({
    url: window.appSettings.FARO_URL,
    app: {
      name: 'hotsak-frontend',
      version: window.appSettings.GIT_COMMIT,
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

export function pushError(err: unknown) {
  if (window.faro && err instanceof Error) {
    window.faro.api.pushError(err)
  }
}

export function pushLog(message: string, level: LogLevel = LogLevel.INFO) {
  if (window.faro) {
    window.faro.api.pushLog([message], { level })
  }
}

// Usage pushEvent('toggle-panel', 'panels', { enabled: isEnabled.toString() });
export function pushEvent(name: string, domain: string, attributes?: Record<string, string>) {
  if (window.faro) {
    window.faro.api.pushEvent(name, { ...attributes, domain }, domain, { skipDedupe: true })
  }
}
