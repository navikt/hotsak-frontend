import { memo, Suspense, useEffect } from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'

import { useDokumentContext } from '../../../../dokument/DokumentContext'
import { DokumentPanel } from '../../../../dokument/DokumentPanel'
import { AlertError } from '../../../../feilsider/AlertError'
import { TreKolonner } from '../../../../felleskomponenter/Kolonner'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import { Sakstype } from '../../../../types/types.internal'
import { LasterPersonlinje } from '../../../Personlinje'
import { useBarnebrillesak } from '../../../useBarnebrillesak'
import { useJournalposter } from '../../../useJournalposter'
import { Venstremeny } from '../../../venstremeny/Venstremeny'
import { RegistrerSøknadLesevisning } from './RegistrerSøknadLesevisning'
import { RegistrerSøknadSkjema } from './RegistrerSøknadSkjema'

const RegistrerSøknadContent = memo(() => {
  const { sak, isLoading, isError } = useBarnebrillesak()
  const { dokumenter } = useJournalposter()
  const { setValgtDokument } = useDokumentContext()
  const { showBoundary } = useErrorBoundary()
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak(sak)

  const journalpostId = dokumenter[0]?.journalpostId
  const dokumentId = dokumenter[0]?.dokumentId

  useEffect(() => {
    if (dokumenter && dokumenter.length > 0) {
      setValgtDokument({ journalpostId, dokumentId })
    }
  }, [journalpostId, dokumentId, dokumenter, setValgtDokument])

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
    <TreKolonner>
      <Venstremeny>
        {saksbehandlerKanRedigereBarnebrillesak ? <RegistrerSøknadSkjema /> : <RegistrerSøknadLesevisning />}
      </Venstremeny>
      <DokumentPanel />
    </TreKolonner>
  )
})

const LasterRegistrerSøknadBilde = () => <LasterPersonlinje />

export const RegistrerSøknad = () => (
  <ErrorBoundary FallbackComponent={AlertError}>
    <Suspense fallback={<LasterRegistrerSøknadBilde />}>
      <RegistrerSøknadContent />
    </Suspense>
  </ErrorBoundary>
)
