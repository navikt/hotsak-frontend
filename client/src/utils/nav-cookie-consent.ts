interface CookieConsent {
  userActionTaken: boolean
  consent: {
    analytics: boolean
    surveys: boolean
  }
  meta?: {
    createdAt: string
    updatedAt: string
    version: number
  }
}

const parseConsentCookie = (cookie: string): CookieConsent => {
  const consentCookie = cookie.split(';').filter((c) => /navno-consent=/.test(c))[0]
  const consentMatch = consentCookie?.match(/navno-consent=(.*)($)/)
  if (consentMatch) {
    return JSON.parse(decodeURIComponent(consentMatch[1]))
  } else {
    return {
      userActionTaken: false,
      consent: {
        analytics: false,
        surveys: false,
      },
    }
  }
}

export const getCurrentConsent = () => {
  return parseConsentCookie(document.cookie)
}

export const isConsentingToAnalytics = () => {
  const consent = getCurrentConsent()
  return consent.consent.analytics
}

export const isConsentingToSurveys = () => {
  const consent = getCurrentConsent()
  return consent.consent.surveys
}
