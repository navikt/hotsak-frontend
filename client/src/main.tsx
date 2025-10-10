import { createRoot } from 'react-dom/client'
import { initMsw } from './mocks'
import { initFaro } from './utils/faro'
import { initUmami } from './sporing/umami'
import '@navikt/ds-css/darkside'
import './styles/global.css'
import App from './App'

async function main(): Promise<void> {
  await initMsw()
  await initFaro()
  await initUmami()

  const container = document.getElementById('root')!
  createRoot(container).render(<App />)
}

main().catch((err) => console.error(err))
