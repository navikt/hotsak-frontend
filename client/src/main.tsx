import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { SWRConfig, type SWRConfiguration } from 'swr'

import '@navikt/ds-css'

import { App } from './App'
import { http } from './io/HttpClient.ts'
import { HttpError } from './io/HttpError.ts'
import { initMsw } from './mocks'
import { initUmami } from './sporing/umami'
import { cleanupStorage, migrerLocalStorage } from './state/storage.ts'
import { initFaro } from './utils/faro'
import './styles/global.css'

async function main(): Promise<void> {
  await initMsw()
  await initFaro()
  await initUmami()

  cleanupStorage()
  migrerLocalStorage()

  const container = document.getElementById('root')!
  createRoot(container).render(
    <StrictMode>
      <BrowserRouter>
        <SWRConfig value={swrConfig}>
          <App />
        </SWRConfig>
      </BrowserRouter>
    </StrictMode>
  )
}

const swrConfig: SWRConfiguration = {
  async fetcher(...args) {
    return http.get(args[0])
  },
  onError(err: unknown) {
    if (HttpError.isHttpError(err)) {
      console.warn(err.message)
      if (err.status === 401) {
        window.location.href = '/uautorisert'
      }
    }
  },
}

main().catch((err) => console.error(err))
