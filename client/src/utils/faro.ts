import { ConsoleInstrumentation, ErrorsInstrumentation, LogLevel, SessionInstrumentation, WebVitalsInstrumentation, initializeFaro } from '@grafana/faro-web-sdk'

export const initFaro = () => {
  console.log(`Setting up Faro  with url ${window.appSettings.FARO_URL}`)

  initializeFaro({
    url: window.appSettings.FARO_URL,
    app: {
      name: 'hotsak-frontend',
    },
    instrumentations: [
        new ErrorsInstrumentation(),
        new WebVitalsInstrumentation(),
        new ConsoleInstrumentation({
          disabledLevels: [LogLevel.TRACE, LogLevel.ERROR], // console.log will be captured
        }),
        new SessionInstrumentation(),
      ],
  })
}

/*Sentry.init({
    dsn: 'https://1b8cdf7f7a9e4dad9ee49a08fe71b6ae@sentry.gc.nav.no/164',
    integrations: [new Sentry.BrowserTracing()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
    ignoreErrors: ['ResizeObserver loop limit exceeded'],
    environment: MILJO,
    denyUrls: [
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
      // Safari extensions
      /^safari-extension:/i,
      // external scripts
      /psplugin/,
      /dekoratoren\/client/,
    ],
    beforeSend: beforeSend,
    enabled: MILJO === 'dev-gcp' || MILJO === 'prod-gcp',
    release: GIT_COMMIT,
  })
  Sentry.setUser({ id: uuid() })*/
