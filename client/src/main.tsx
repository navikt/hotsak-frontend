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
  if (window.appSettings.USE_MSW === true) {
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
