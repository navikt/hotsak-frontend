import App from './App'
import { createRoot } from 'react-dom/client'
import { AppRoot } from './GlobalStyles'
import { initMsw } from './mocks'
import { initFaro } from './utils/faro'
import { initUmami } from './sporing/umami'
import '@navikt/ds-css'

async function main(): Promise<void> {
  await initMsw()
  await initFaro()
  await initUmami()

  const container = document.getElementById('root')!
  createRoot(container).render(
    <>
      <AppRoot />
      <App />
    </>
  )
}

main().catch((err) => console.error(err))
