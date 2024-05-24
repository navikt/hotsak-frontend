import { memo, Suspense, useEffect } from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'
import styled from 'styled-components'

import { useDokumentContext } from '../../../../dokument/DokumentContext'
import { DokumentPanel } from '../../../../dokument/DokumentPanel'
import { hotsakRegistrerSøknadKolonne } from '../../../../GlobalStyles'
import { AlertError } from '../../../../feilsider/AlertError'
import { Flex } from '../../../../felleskomponenter/Flex'
import { TreKolonner } from '../../../../felleskomponenter/Kolonner'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { Sakstype } from '../../../../types/types.internal'
import { LasterPersonlinje } from '../../../Personlinje'
import { useJournalposter } from '../../../useJournalposter'
import { useBarnebrillesak } from '../../../useBarnebrillesak'
import { Venstremeny } from '../../../venstremeny/Venstremeny'
import { RegistrerSøknadLesevisning } from './RegistrerSøknadLesevisning'
import { RegistrerSøknadSkjema } from './RegistrerSøknadSkjema'

const RegistrerSøknadContent = memo(() => {
  const { sak, isLoading, isError } = useBarnebrillesak()
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
          <Venstremeny width={`${hotsakRegistrerSøknadKolonne}`}>
            {saksbehandlerKanRedigereBarnebrillesak ? <RegistrerSøknadSkjema /> : <RegistrerSøknadLesevisning />}
          </Venstremeny>
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
    <Suspense fallback={<LasterRegistrerSøknadBilde />}>
      <RegistrerSøknadContent />
    </Suspense>
  </ErrorBoundary>
)
