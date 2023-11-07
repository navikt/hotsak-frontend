import { createRoot } from 'react-dom/client'
import 'reset-css'

import '@navikt/ds-css'

import { setupAmplitude } from './utils/amplitude'
import { initSentry } from './utils/sentry'

import App from './App'
import { AppRoot } from './GlobalStyles'
import { setupMsw } from './mocks'

setupMsw()
  .then(() => {
    const container = document.getElementById('root')!
    createRoot(container).render(
      <>
        <AppRoot />
        <App />
      </>
    )
  })
  .then(() => setupAmplitude())
  .catch((err) => console.error(err))

initSentry()
