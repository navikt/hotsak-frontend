import { createRoot } from 'react-dom/client'
import 'reset-css'

import '@navikt/ds-css'

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
  .then(async () => {
    if (import.meta.env.PROD) {
      const { setupAmplitude } = await import('./utils/amplitude')
      const { initSentry } = await import('./utils/sentry')
      setupAmplitude()
      initSentry()
    }
  })
  .catch((err) => console.error(err))
