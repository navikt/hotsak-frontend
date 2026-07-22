export async function initUmami(): Promise<void> {
  const erIkkeProd = window.appSettings.NAIS_CLUSTER_NAME !== 'prod-gcp'
  // Ikke last Umami i lokalt miljø eller hvis det er deaktivert
  if (!window.appSettings.UMAMI_ENABLED || !window.appSettings.UMAMI_WEBSITE_ID) {
    console.debug('Umami er deaktivert eller ikke konfigurert, laster ikke sporing.')
    return
  }

  if (document.querySelector('script[data-website-id]')) {
    return
  }

  const script = document.createElement('script')
  script.defer = true
  script.src = erIkkeProd
    ? 'https://cdn.nav.no/team-researchops/sporing/sporing-dev.js'
    : 'https://cdn.nav.no/team-researchops/sporing/sporing.js'
  const hostUrl = erIkkeProd ? 'https://reops-event-proxy.ekstern.dev.nav.no' : 'https://reops-event-proxy.nav.no'
  script.setAttribute('data-host-url', hostUrl)

  script.setAttribute('data-website-id', window.appSettings.UMAMI_WEBSITE_ID)

  document.head.appendChild(script)

  console.debug('Umami er initialisert med website ID:', window.appSettings.UMAMI_WEBSITE_ID)
}

export async function setIdentifier(ident: string): Promise<void> {
  if (typeof window !== 'undefined' && window.umami) {
    await window.umami.identify(ident)
  }
}
