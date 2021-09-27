import { render } from 'react-dom'
//import ReactDOM from 'react-dom'

import '@navikt/ds-tokens/dist/tokens.css'

import App from './App'
import { initMSW } from './_mocks_/msw'

declare global {
  interface Window {
    msw: any
  }
}

if (process.env.REACT_APP_USE_MSW === 'true') {
  initMSW()
}

render(<App />, document.getElementById('root'))
