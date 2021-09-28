import { render } from 'react-dom'

//import ReactDOM from 'react-dom'
import '@navikt/ds-tokens/dist/tokens.css'

import App from './App'
import { initMSW } from './_mocks_/msw'
import environment from './environment'

declare global {
  interface Window {
    msw: any
  }
}

console.log('process.env:', process.env)
console.log('environment:', environment)
console.log('window:', window)

const useMSW = process.env.REACT_APP_USE_MSW === 'true' || environment.USE_MSW === true
if (useMSW) {
  initMSW()
}

render(<App />, document.getElementById('root'))
