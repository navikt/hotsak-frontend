import { memo, Suspense } from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'

import { DokumentProvider } from '../dokument/DokumentContext'
import { AlertError } from '../feilsider/AlertError'
import { PersonFeilmelding } from '../felleskomponenter/feil/PersonFeilmelding'
import { Sidetittel } from '../felleskomponenter/Sidetittel.tsx'
import { usePerson } from '../personoversikt/usePerson'
import { useBehandling } from '../sak/v2/behandling/useBehandling.ts'
import { SakbrukerinnstillingerProvider } from '../sak/v2/SakbrukerinnstillingerProvider'
import { SakProvider } from '../sak/v2/SakProvider'
import { SakV2 } from '../sak/v2/SakV2'
import { useNyttSaksbilde } from '../sak/v2/useNyttSaksbilde'
import { type SakBase, Sakstype } from '../types/types.internal'
import { Barnebrillesaksbilde } from './barnebriller/Barnebrillesaksbilde'
import { Personlinje } from './Personlinje'
import { SakLoader } from './SakLoader'
import { Søknadsbilde } from './Søknadsbilde'
import { useBehovsmelding } from './useBehovsmelding'
import { useSak } from './useSak'

const SaksbildeContent = memo(() => {
  const [nyttSaksbilde] = useNyttSaksbilde()
  const { sak, isLoading: isSakLoading, error: sakError } = useSak()
  const { gjeldendeBehandling } = useBehandling()
  const { error: behovsmeldingError, isLoading: isBehovsmeldingLoading } = useBehovsmelding()
  const { showBoundary } = useErrorBoundary()
  const { personInfo, error: personInfoError, isLoading: isPersonLoading } = usePerson(sak?.data.bruker.fnr)

  if (isSakLoading || isPersonLoading || isBehovsmeldingLoading) return <SakLoader />

  if (personInfoError) {
    return <PersonFeilmelding personError={personInfoError} />
  }

  if (sakError) {
    showBoundary(sakError)
  }
  if (behovsmeldingError) {
    showBoundary(behovsmeldingError)
  }

  if (!sak) return <div>Fant ikke sak</div>

  if (nyttSaksbilde && sak.data.sakstype === Sakstype.SØKNAD) {
    return (
      <>
        <Sidetittel tittel={`Sak ${sak.data.sakId}`} />
        <SakProvider>
          <SakbrukerinnstillingerProvider>
            <SakV2 />
          </SakbrukerinnstillingerProvider>
        </SakProvider>
      </>
    )
  }

  if (gjeldendeBehandling != null && gjeldendeBehandling.behandlingId.toString() !== '0') {
    return (
      <>
        <Sidetittel tittel={`Sak ${sak.data.sakId}`} />
        <p>Denne saken er påbegynt i Hotsak 1.5 og må behandles videre der.</p>
      </>
    )
  }

  return (
    <>
      <Sidetittel tittel={`Sak ${sak.data.sakId}`} />
      <Personlinje loading={isPersonLoading} person={personInfo} skjulTelefonnummer />
      <SakstypeSwitch sak={sak.data} />
    </>
  )
})

function SakstypeSwitch({ sak }: { sak: SakBase }) {
  switch (sak.sakstype) {
    case Sakstype.BARNEBRILLER:
      return (
        <DokumentProvider>
          <Barnebrillesaksbilde />
        </DokumentProvider>
      )
    case Sakstype.BESTILLING:
    default:
      return (
        <DokumentProvider>
          <Søknadsbilde />
        </DokumentProvider>
      )
  }
}

export default function Saksbilde() {
  return (
    <ErrorBoundary FallbackComponent={AlertError}>
      <Suspense fallback={<SakLoader />}>
        <SaksbildeContent />
      </Suspense>
    </ErrorBoundary>
  )
}
