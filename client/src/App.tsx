import { Theme } from '@navikt/ds-react'

import classes from './App.module.css'
import { AppRoutes } from './AppRoutes.tsx'
import { AsyncBoundary } from './felleskomponenter/AsyncBoundary.tsx'
import { GlobalFeilside } from './felleskomponenter/feil/GlobalFeilside.tsx'
import { ToastProvider } from './felleskomponenter/toast/ToastContext.tsx'
import { Toppmeny } from './header/Toppmeny.tsx'
import { useDarkMode } from './header/useDarkMode.ts'
import { PersonProvider } from './personoversikt/PersonContext.tsx'
import { useLogBruker } from './sporing/useLogBruker.ts'
import { useLogVinduStørrelse } from './sporing/useLogVinduStørrelse.ts'
import { TilgangProvider } from './tilgang/TilgangProvider.tsx'
import { Utviklingsverktøy } from './utvikling/Utviklingsverktøy.tsx'

export function App() {
  const [darkMode] = useDarkMode()

  useLogBruker()
  useLogVinduStørrelse()

  return (
    <Theme theme={darkMode ? 'dark' : 'light'}>
      <div className={classes.root}>
        <AsyncBoundary errorComponent={GlobalFeilside} suspenseFallback={null}>
          <TilgangProvider>
            <PersonProvider>
              <ToastProvider>
                <Toppmeny />
                <Utviklingsverktøy />
                <AppRoutes />
              </ToastProvider>
            </PersonProvider>
          </TilgangProvider>
        </AsyncBoundary>
      </div>
    </Theme>
  )
}
