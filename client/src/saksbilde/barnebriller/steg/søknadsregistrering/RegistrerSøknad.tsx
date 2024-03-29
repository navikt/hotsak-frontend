import React, { useEffect } from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'

import { useDokumentContext } from '../../../../oppgaveliste/dokumenter/DokumentContext'
import { DokumentPanel } from '../../../../oppgaveliste/manuellJournalføring/DokumentPanel'

import { hotsakRegistrerSøknadKolonne } from '../../../../GlobalStyles'
import { AlertError } from '../../../../feilsider/AlertError'
import { Flex } from '../../../../felleskomponenter/Flex'
import { TreKolonner } from '../../../../felleskomponenter/Kolonner'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { Sakstype } from '../../../../types/types.internal'
import { LasterPersonlinje } from '../../../Personlinje'
import { useJournalposter } from '../../../journalpostHook'
import { useBrillesak } from '../../../sakHook'
import { VenstreMeny } from '../../../venstremeny/Venstremeny'
import { RegistrerSøknadLesevisning } from './RegistrerSøknadLesevisning'
import { RegistrerSøknadSkjema } from './RegistrerSøknadSkjema'

const RegistrerSøknadContent: React.FC = React.memo(() => {
  const { sak, isLoading, isError } = useBrillesak()
  const { dokumenter } = useJournalposter()
  const { setValgtDokument } = useDokumentContext()
  const { showBoundary } = useErrorBoundary()
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak(sak?.data)

  const journalpostID = dokumenter[0]?.journalpostID
  const dokumentID = dokumenter[0]?.dokumentID

  useEffect(() => {
    if (dokumenter && dokumenter.length > 0) {
      setValgtDokument({ journalpostID, dokumentID })
    }
  }, [journalpostID, dokumentID])

  if (isLoading) return <LasterRegistrerSøknadBilde />

  if (isError) {
    showBoundary(isError)
  }

  if (sak?.data.sakstype !== Sakstype.BARNEBRILLER) {
    throw new Error(
      `Feil ved visning av sak. Forventer at sak skal være av type BARNEBRILLER, men var ${sak?.data.sakstype} `
    )
  }

  if (!sak) return <div>Fant ikke saken</div>

  return (
    <Container>
      <AutoFlexContainer>
        <TreKolonner>
          <VenstreMeny width={`${hotsakRegistrerSøknadKolonne}`}>
            {saksbehandlerKanRedigereBarnebrillesak ? <RegistrerSøknadSkjema /> : <RegistrerSøknadLesevisning />}
          </VenstreMeny>
          <DokumentPanel />
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
