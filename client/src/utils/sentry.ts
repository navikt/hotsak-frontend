import * as Sentry from '@sentry/browser'
import { Breadcrumb, Event, EventHint } from '@sentry/browser'
import { v4 as uuid } from 'uuid'

const maskeringsregler = [
  {
    regex: /[0-9]{6}\s?[0-9]{5}/g,
    erstatning: '<fnr>',
  },
]

const beforeSend = (event: Event, _hint?: EventHint): Event => {
  const url = event.request?.url ? maskerPersonopplysninger(event.request.url) : ''
  return {
    ...event,
    event_id: maskerPersonopplysninger(event.event_id),
    message: maskerPersonopplysninger(event.message),
    request: {
      ...event.request,
      url,
      headers: {
        Referer: maskerPersonopplysninger(event.request?.headers?.Referer) || '',
      },
      data: maskerPersonoppysningerIObjekt(event.request?.data),
    },
    breadcrumbs: (event.breadcrumbs || [])
      .filter((breadcrumb: Breadcrumb) => {
        return !isUrelevantUrl(breadcrumb.data?.url)
      })
      .map((breadcrumb: Breadcrumb) => ({
        ...breadcrumb,
        event_id: maskerPersonopplysninger(event.event_id),
        message: maskerPersonopplysninger(breadcrumb.message),
        data: maskerPersonoppysningerIObjekt(breadcrumb.data),
      })),
  }
}

const maskerPersonoppysningerIObjekt = <T>(data: T): T => {
  if (data === undefined) return data

  const asText = JSON.stringify(data)
  const escaped = maskerPersonopplysninger(asText)

  return escaped ? JSON.parse(escaped) : undefined
}

const maskerPersonopplysninger = (tekst?: string | undefined) => {
  if (!tekst) return undefined

  let maskert = tekst
  maskeringsregler.forEach(({ regex, erstatning }) => {
    maskert = maskert.replace(regex, erstatning)
  })

  return maskert
}

const urelevanteBreadcrumUrls = ['google-analytics.com', 'psplugin.com']

const isUrelevantUrl = (url: string | undefined): boolean => {
  return url !== undefined && urelevanteBreadcrumUrls.some((urelevant) => url.includes(urelevant))
}

const MILJO = window.appSettings?.MILJO
const GIT_COMMIT = window.appSettings?.GIT_COMMIT

export const initSentry = () => {
  Sentry.init({
    dsn: 'https://1b8cdf7f7a9e4dad9ee49a08fe71b6ae@sentry.gc.nav.no/164',
    integrations: [new Sentry.BrowserTracing()],
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
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
  Sentry.setUser({ id: uuid() })
}
