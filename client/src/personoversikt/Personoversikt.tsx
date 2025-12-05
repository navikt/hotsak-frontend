import { Box } from '@navikt/ds-react'
import { Suspense, useMemo } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Route } from 'react-router'
import { Routes } from 'react-router-dom'

import { AlertError } from '../feilsider/AlertError'
import { Feilmelding } from '../felleskomponenter/feil/Feilmelding'
import { PersonFeilmelding } from '../felleskomponenter/feil/PersonFeilmelding'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import { useHjelpemiddeloversikt } from '../saksbilde/høyrekolonne/hjelpemiddeloversikt/useHjelpemiddeloversikt'
import { LasterPersonlinje, Personlinje } from '../saksbilde/Personlinje'
import { naturalBy } from '../utils/array.ts'
import { sorterKronologiskStigende } from '../utils/dato.ts'
import { select } from '../utils/select.ts'
import { HjelpemiddeloversiktTable } from './HjelpemiddeloversiktTable.tsx'
import { usePersonContext } from './PersonContext'
import { Saksoversikt } from './Saksoversikt'
import { SaksoversiktLinje } from './SaksoversiktLinje'
import { usePerson } from './usePerson'
import { useSaksoversikt } from './useSaksoversikt.ts'

function PersonoversiktContent() {
  const { fodselsnummer } = usePersonContext()
  const { personInfo, error: personInfoError, isLoading: personInfoLoading } = usePerson(fodselsnummer)
  const { saksoversikt, error, isLoading } = useSaksoversikt(fodselsnummer)
  const {
    hjelpemiddelArtikler,
    error: hjelpemiddeloversiktError,
    isLoading: hjelpemiddeloversiktLoading,
  } = useHjelpemiddeloversikt(fodselsnummer)

  const sakerOgBarnebrillekrav = useMemo(() => {
    if (!saksoversikt) return []
    return [...saksoversikt.saker, ...saksoversikt.barnebrillekrav].sort(naturalBy(select('mottattTidspunkt')))
  }, [saksoversikt])

  if (personInfoError) {
    return <PersonFeilmelding personError={personInfoError} />
  }

  const hjelpemidler =
    hjelpemiddelArtikler?.sort((a, b) => sorterKronologiskStigende(a.datoUtsendelse, b.datoUtsendelse)) || []
  const antallUtlånteHjelpemidler = hjelpemidler?.reduce((antall, artikkel) => {
    return (antall += artikkel.antall)
  }, 0)

  return (
    <>
      <title>{`Hotsak - Personoversikt`}</title>
      <Skjermlesertittel>Personoversikt</Skjermlesertittel>
      {personInfoLoading ? (
        <LasterPersonoversikt />
      ) : (
        <>
          <Personlinje loading={personInfoLoading} person={personInfo} />
          <SaksoversiktLinje sakerCount={sakerOgBarnebrillekrav.length} hjelpemidlerCount={antallUtlånteHjelpemidler} />
          <Box paddingBlock="4" paddingInline="8">
            <Routes>
              <Route
                path="/saker"
                element={
                  error ? (
                    <Feilmelding>Teknisk feil ved henting av saksoversikt</Feilmelding>
                  ) : (
                    <Saksoversikt
                      sakerOgBarnebrillekrav={sakerOgBarnebrillekrav}
                      barnebrillekravHentet={saksoversikt?.barnebrillekravHentet}
                      loading={isLoading}
                    />
                  )
                }
              />
              <Route
                path="/hjelpemidler"
                element={
                  hjelpemiddeloversiktError ? (
                    <Feilmelding>Teknisk feil ved henting av utlånsoversikt</Feilmelding>
                  ) : (
                    <HjelpemiddeloversiktTable artikler={hjelpemidler} loading={hjelpemiddeloversiktLoading} />
                  )
                }
              />
            </Routes>
          </Box>
        </>
      )}
    </>
  )
}

function LasterPersonoversikt() {
  return <LasterPersonlinje />
}

export default function Personoversikt() {
  return (
    <ErrorBoundary FallbackComponent={AlertError}>
      <Suspense fallback={<LasterPersonlinje />}>
        <PersonoversiktContent />
      </Suspense>
    </ErrorBoundary>
  )
}
