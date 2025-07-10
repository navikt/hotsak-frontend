import App from './App'
import { createRoot } from 'react-dom/client'
import { AppRoot } from './GlobalStyles'
import { initMsw } from './mocks'
import { initFaro } from './utils/faro'
import '@navikt/ds-css'

async function main(): Promise<void> {
  await initMsw()
  await initFaro()

  const container = document.getElementById('root')!
  createRoot(container).render(
    <>
      <AppRoot />
      <App />
    </>
  )
}

main().catch((err) => console.error(err))
