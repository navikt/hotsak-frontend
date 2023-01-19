import React, { useEffect } from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import styled from 'styled-components'

import { useDokumentContext } from '../../../../oppgaveliste/dokumenter/DokumentContext'
import { useDokument } from '../../../../oppgaveliste/dokumenter/dokumentHook'
import { DokumentPanel } from '../../../../oppgaveliste/manuellJournalføring/DokumentPanel'

import {
  headerHøydeRem,
  hotsakRegistrerSøknadHøyreKolonne,
  hotsakRegistrerSøknadKolonne,
} from '../../../../GlobalStyles'
import { AlertError } from '../../../../feilsider/AlertError'
import { usePersonInfo } from '../../../../personoversikt/personInfoHook'
import { Oppgavetype } from '../../../../types/types.internal'
import { LasterPersonlinje, Personlinje } from '../../../Personlinje'
import { Historikk } from '../../../høyrekolonne/historikk/Historikk'
import { useBrillesak } from '../../../sakHook'
import { VenstreMeny } from '../../../venstremeny/Venstremeny'
import { Stegindikator } from './../../Stegindikator'
import { RegistrerSøknadSkjema } from './RegistrerSøknadSkjema'

const RegistrerSøknadContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 96vh;
`

const TreKolonner = styled.div`
  display: grid;
  grid-template-columns: ${hotsakRegistrerSøknadKolonne} auto ${hotsakRegistrerSøknadHøyreKolonne};
  grid-template-rows: 1fr;
  height: calc(100vh - ${headerHøydeRem}rem);
`

const RegistrerSøknadContent: React.FC = React.memo(() => {
  const { sak, isLoading, isError } = useBrillesak()
  const { setValgtDokumentID } = useDokumentContext()
  const { journalpost, /*isError,*/ isLoading: henterJournalpost } = useDokument(sak?.journalpost[0])
  const { personInfo, /*isLoading: personInfoLoading,*/ isError: personInfoError } = usePersonInfo(sak?.bruker?.fnr)
  const handleError = useErrorHandler()

  const journalpostID = sak?.journalpost[0]

  useEffect(() => {
    if (journalpost?.dokumenter && journalpost.dokumenter.length > 0) {
      console.log('Dokument settes på nytt')
      setValgtDokumentID(journalpost.dokumenter[0].dokumentID)
    }
  }, [journalpost?.journalpostID, journalpost?.dokumenter])

  if (isLoading) return <LasterRegistrerSøknadBilde />

  if (isError) {
    handleError(isError)
  }

  if (sak?.sakstype !== Oppgavetype.BARNEBRILLER) {
    throw new Error(
      `Feil ved visning av sak. Forventer at sak skal være av type BARNEBRILLER, men var ${sak?.sakstype} `
    )
  }

  //const harIngenHjelpemidlerFraFør = hjelpemiddelArtikler !== undefined && hjelpemiddelArtikler.length === 0

  if (!sak) return <div>Fant ikke saken</div>

  return (
    <RegistrerSøknadContainer>
      <Personlinje person={personInfo} />
      <Stegindikator />
      <TreKolonner>
        <VenstreMeny width={`${hotsakRegistrerSøknadKolonne}`}>
          <RegistrerSøknadSkjema />
        </VenstreMeny>
        <DokumentPanel journalpostID={journalpostID} />
        <Historikk />
      </TreKolonner>
    </RegistrerSøknadContainer>
  )
})

const LasterRegistrerSøknadBilde = () => (
  <RegistrerSøknadContainer>
    <LasterPersonlinje />
  </RegistrerSøknadContainer>
)

export const RegistrerSøknad = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <React.Suspense fallback={<LasterRegistrerSøknadBilde />}>
      <RegistrerSøknadContent />
    </React.Suspense>
  </ErrorBoundary>
)

export default RegistrerSøknad
