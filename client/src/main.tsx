import { FlagProvider } from '@unleash/proxy-client-react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { SWRConfig, type SWRConfiguration } from 'swr'

import '@navikt/ds-css'

import { App } from './App'
import { http } from './io/HttpClient.ts'
import { type HttpError } from './io/HttpError.ts'
import { initMsw } from './mocks'
import { initUmami } from './sporing/umami'
import { cleanupStorage, migrerLocalStorage } from './state/storage.ts'
import './styles/global.css'
import './styles/variables.css'
import { unleashConfig, unleashEnabled, unleashToolbarAktivert } from './unleash/unleashConfig.ts'
import { initFaro } from './utils/faro'

async function main(): Promise<void> {
  await initMsw()
  await initFaro()
  await initUmami()

  cleanupStorage()
  migrerLocalStorage()

  const container = document.getElementById('root')!
  const app = (
    <BrowserRouter>
      <SWRConfig value={swrConfig}>
        <App />
      </SWRConfig>
    </BrowserRouter>
  )

  if (unleashToolbarAktivert) {
    // Lastes kun i lokal utvikling og labs: se unleashToolbarAktivert i unleashConfig.ts.
    // Dynamisk import holder toolbaren utenfor bundlen som leveres til ekte brukere.
    const [{ UnleashToolbarProvider }] = await Promise.all([
      import('@unleash/toolbar/react'),
      import('@unleash/toolbar/toolbar.css'),
    ])
    createRoot(container).render(
      <StrictMode>
        <UnleashToolbarProvider
          config={unleashConfig}
          toolbarOptions={{ storageMode: 'local', position: 'bottom-right' }}
        >
          {app}
        </UnleashToolbarProvider>
      </StrictMode>
    )
    return
  }

  createRoot(container).render(
    <StrictMode>
      <FlagProvider config={unleashConfig} startClient={unleashEnabled}>
        {app}
      </FlagProvider>
    </StrictMode>
  )
}

const swrConfig: SWRConfiguration<unknown, HttpError> = {
  async fetcher(...args) {
    return http.get(args[0])
  },
}

main().catch((err) => console.error(err))
