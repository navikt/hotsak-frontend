export async function initUmami(): Promise<void> {
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
  script.src = 'https://cdn.nav.no/team-researchops/sporing/sporing.js'
  script.setAttribute('data-host-url', 'https://umami.nav.no')

  script.setAttribute('data-website-id', window.appSettings.UMAMI_WEBSITE_ID)

  document.head.appendChild(script)

  console.debug('Umami er initialisert med website ID:', window.appSettings.UMAMI_WEBSITE_ID)
}

export async function setIdentifier(ident: string): Promise<void> {
  if (typeof window !== 'undefined' && window.umami) {
    await window.umami.identify(ident)
  }
}
