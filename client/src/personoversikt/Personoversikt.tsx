import { Box } from '@navikt/ds-react'
import { useMemo } from 'react'
import { Route, Routes } from 'react-router'

import { AsyncBoundary } from '../felleskomponenter/AsyncBoundary.tsx'
import { DataGridFilterProvider } from '../felleskomponenter/data/DataGridFilterProvider.tsx'
import { FeilmeldingAlert } from '../felleskomponenter/feil/FeilmeldingAlert.tsx'
import { PersonFeilmelding } from '../felleskomponenter/feil/PersonFeilmelding'
import { LasterPersonlinje, Personlinje } from '../felleskomponenter/personlinje/Personlinje.tsx'
import { Sidetittel } from '../felleskomponenter/Sidetittel.tsx'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import { useUtlånoversikt } from '../saksbilde/høyrekolonne/hjelpemiddeloversikt/useUtlånoversikt'
import { naturalBy } from '../utils/array.ts'
import { sorterKronologiskStigende } from '../utils/dato.ts'
import { select } from '../utils/select.ts'
import { DokumentoversiktPerson } from './DokumentoversiktPerson.tsx'
import { HjelpemiddeloversiktTable } from './HjelpemiddeloversiktTable.tsx'
import { OppgaveoversiktPerson } from './OppgaveoversiktPerson.tsx'
import { usePersonContext } from './PersonContext'
import { PersonoversiktTabs } from './PersonoversiktTabs.tsx'
import { Saksoversikt } from './Saksoversikt'
import { usePerson } from './usePerson'
import { useSaksoversikt } from './useSaksoversikt.ts'
import { DataGridProvider } from '../felleskomponenter/data/DataGridProvider.tsx'

function PersonoversiktContent() {
  const { fodselsnummer } = usePersonContext()
  const { personInfo, error: personInfoError, isLoading: personInfoLoading } = usePerson(fodselsnummer)
  const { saksoversikt, error, isLoading } = useSaksoversikt(fodselsnummer)
  const {
    hjelpemiddelArtikler,
    antallUtlånteHjelpemidler,
    error: hjelpemiddeloversiktError,
    isLoading: hjelpemiddeloversiktLoading,
  } = useUtlånoversikt(fodselsnummer)

  const sakerOgBarnebrillekrav = useMemo(() => {
    if (!saksoversikt) return []
    return [...saksoversikt.saker, ...saksoversikt.barnebrillekrav].sort(naturalBy(select('mottattTidspunkt')))
  }, [saksoversikt])

  if (personInfoError) {
    return <PersonFeilmelding personError={personInfoError} />
  }

  const hjelpemidler =
    hjelpemiddelArtikler?.sort((a, b) => sorterKronologiskStigende(a.datoUtsendelse, b.datoUtsendelse)) || []

  return (
    <>
      <Sidetittel tittel="Personoversikt" />
      <Skjermlesertittel>Personoversikt</Skjermlesertittel>
      {personInfoLoading ? (
        <LasterPersonlinje />
      ) : (
        <>
          <Personlinje loading={personInfoLoading} person={personInfo} />
          <PersonoversiktTabs
            sakerCount={sakerOgBarnebrillekrav.length}
            hjelpemidlerCount={antallUtlånteHjelpemidler}
          />
          <Box paddingBlock="space-16" paddingInline="space-32">
            <Routes>
              <Route
                path="/oppgaver"
                element={
                  <DataGridProvider orderBy="" direction="none" key="oppgaver">
                    <DataGridFilterProvider suffix="PersonoversiktOppgaver">
                      <OppgaveoversiktPerson fnr={fodselsnummer} />
                    </DataGridFilterProvider>
                  </DataGridProvider>
                }
              />
              <Route
                path="/dokumenter"
                element={
                  <DataGridProvider orderBy="" direction="none" key="dokumenter">
                    <DataGridFilterProvider suffix="PersonoversiktDokumenter">
                      <DokumentoversiktPerson fnr={fodselsnummer} />
                    </DataGridFilterProvider>
                  </DataGridProvider>
                }
              />
              <Route
                path="/saker"
                element={
                  error ? (
                    <FeilmeldingAlert>Teknisk feil ved henting av saksoversikt</FeilmeldingAlert>
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
                    <FeilmeldingAlert>Teknisk feil ved henting av utlånsoversikt</FeilmeldingAlert>
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

export default function Personoversikt() {
  return (
    <AsyncBoundary suspenseFallback={<LasterPersonlinje />}>
      <PersonoversiktContent />
    </AsyncBoundary>
  )
}
