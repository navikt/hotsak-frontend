import { render } from 'react-dom'

//import ReactDOM from 'react-dom'
import '@navikt/ds-tokens/dist/tokens.css'

import App from './App'
import { initMSW } from './_mocks_/msw'
import environment from './environment'

declare global {
  interface Window {
    msw: any
    appSettings: any
  }
}

console.log('process.env:', process.env)
console.log('environment:', environment)
console.log('window.appSettings:', window.appSettings)

const useMSW = process.env.REACT_APP_USE_MSW === 'true' || window.appSettings.USE_MSW === true
if (useMSW) {
  initMSW()
}

render(<App />, document.getElementById('root'))
