import { render } from 'react-dom'
import 'reset-css'
import '@navikt/ds-tokens/dist/tokens.css'
import '@navikt/ds-css';
import '@navikt/ds-css-internal';
import { initAmplitude } from './utils/amplitude'

import App from './App'

import { initMSW } from './_mocks_/msw'
import { AppRoot } from './GlobalStyles';

declare global {
  interface Window {
    msw: any
    appSettings: {
      USE_MSW: boolean | undefined
      MILJO: string | undefined
    }
  }
}

const useMSW = process.env.REACT_APP_USE_MSW === 'true' || window.appSettings.USE_MSW === true
if (useMSW) {
  initMSW()
}

initAmplitude()

render(<><AppRoot/><App /></>, document.getElementById('root'))
