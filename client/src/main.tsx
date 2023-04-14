import { createRoot } from 'react-dom/client'
import 'reset-css'

import '@navikt/ds-css'
import '@navikt/ds-css-internal'
import { Modal } from '@navikt/ds-react'

import { initAmplitude } from './utils/amplitude'

import App from './App'
import { AppRoot } from './GlobalStyles'
import { initMSW } from './_mocks_/msw'

declare global {
  interface Window {
    msw: any
    appSettings: {
      USE_MSW?: boolean
      MILJO?: 'local' | 'dev-gcp' | 'prod-gcp' | string
    }
  }
}

initMSW()
  .then(() => {
    const container = document.getElementById('root')!
    if (Modal.setAppElement) {
      Modal.setAppElement(container)
    }
    createRoot(container).render(
      <>
        <AppRoot />
        <App />
      </>
    )
  })
  .then(() => initAmplitude())
  .catch((err) => console.error(err))
