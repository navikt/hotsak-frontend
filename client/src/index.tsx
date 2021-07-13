import { render } from 'react-dom';
//import ReactDOM from 'react-dom'

import '@navikt/ds-tokens/dist/tokens.css'

import App from './App'
import { initMSW } from './_mocks_/msw'

declare global {
  interface Window {
    msw: any
  }
}

// TODO hent fra miljøvariabel
if (process.env.NODE_ENV !== 'production') {
  initMSW()
}

render(<App />, document.getElementById('root'));
