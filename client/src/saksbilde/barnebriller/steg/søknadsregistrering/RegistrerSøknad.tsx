import React, { useEffect } from 'react'
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary'
import styled from 'styled-components'

import { useDokumentContext } from '../../../../oppgaveliste/dokumenter/DokumentContext'
import { useDokument } from '../../../../oppgaveliste/dokumenter/dokumentHook'
import { DokumentPanel } from '../../../../oppgaveliste/manuellJournalføring/DokumentPanel'

import { hotsakRegistrerSøknadKolonne } from '../../../../GlobalStyles'
import { AlertError } from '../../../../feilsider/AlertError'
import { Flex } from '../../../../felleskomponenter/Flex'
import { TreKolonner } from '../../../../felleskomponenter/Kolonner'
import { Oppgavetype, StegType } from '../../../../types/types.internal'
import { LasterPersonlinje } from '../../../Personlinje'
import { useBrillesak } from '../../../sakHook'
import { VenstreMeny } from '../../../venstremeny/Venstremeny'
import { RegistrerSøknadLesevisning } from './RegistrerSøknadLesevisning'
import { RegistrerSøknadSkjema } from './RegistrerSøknadSkjema'

const RegistrerSøknadContent: React.FC = React.memo(() => {
  const { sak, isLoading, isError } = useBrillesak()
  const { setValgtDokumentID } = useDokumentContext()
  const { journalpost /*, isError,*/ /*isLoading: henterJournalpost*/ } = useDokument(sak?.journalposter[0])
  const handleError = useErrorHandler()

  const journalpostID = sak?.journalposter[0]

  useEffect(() => {
    if (journalpost?.dokumenter && journalpost.dokumenter.length > 0) {
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

  if (!sak) return <div>Fant ikke saken</div>

  return (
    <Container>
      <AutoFlexContainer>
        <TreKolonner>
          <VenstreMeny width={`${hotsakRegistrerSøknadKolonne}`}>
            {sak.steg === StegType.GODKJENNE || sak.steg === StegType.FERDIG_BEHANDLET ? (
              <RegistrerSøknadLesevisning />
            ) : (
              <RegistrerSøknadSkjema />
            )}
          </VenstreMeny>
          <DokumentPanel journalpostID={journalpostID} />
          {/*<Historikk />*/}
        </TreKolonner>
      </AutoFlexContainer>
    </Container>
  )
})

const LasterRegistrerSøknadBilde = () => <LasterPersonlinje />

const Container = styled(Flex)`
  overflow: auto;
  overflow-x: hidden;
`

const AutoFlexContainer = styled.div`
  flex: auto;
`

export const RegistrerSøknad = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <React.Suspense fallback={<LasterRegistrerSøknadBilde />}>
      <RegistrerSøknadContent />
    </React.Suspense>
  </ErrorBoundary>
)

export default RegistrerSøknad
