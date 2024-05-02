import App from './App'
import { createRoot } from 'react-dom/client'
import { AppRoot } from './GlobalStyles'
import { initMsw } from './mocks'
import { initAmplitude } from './utils/amplitude'
import { initFaro } from './utils/faro'
import 'reset-css'
import '@navikt/ds-css'

async function main(): Promise<void> {
  await initMsw()
  await initAmplitude()
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
