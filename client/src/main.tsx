import { render } from 'react-dom'
import 'reset-css'

import '@navikt/ds-css'
import '@navikt/ds-css-internal'
import '@navikt/ds-tokens/dist/tokens.css'

import { initAmplitude } from './utils/amplitude'

import App from './App'
import { AppRoot } from './GlobalStyles'
import { initMSW } from './_mocks_/msw'

declare global {
  interface Window {
    msw: any
    appSettings: {
      USE_MSW: boolean | undefined
      MILJO: string | undefined
    }
  }
}

;(async () => {
  const useMSW = import.meta.env.VITE_USE_MSW === 'true' || window.appSettings.USE_MSW === true
  if (useMSW) {
    await initMSW()
  }

  initAmplitude()

  render(
    <>
      <AppRoot />
      <App />
    </>,
    document.getElementById('root')
  )
})()
