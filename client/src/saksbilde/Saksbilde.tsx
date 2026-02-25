import { memo, Suspense } from 'react'
import { ErrorBoundary, useErrorBoundary } from 'react-error-boundary'

import { DokumentProvider } from '../dokument/DokumentContext'
import { AlertError } from '../feilsider/AlertError'
import { PersonFeilmelding } from '../felleskomponenter/feil/PersonFeilmelding'
import { usePerson } from '../personoversikt/usePerson'
import { useBehandling } from '../sak/v2/behandling/useBehandling'
import { SakProvider } from '../sak/v2/SakProvider'
import { SakV2 } from '../sak/v2/SakV2'
import { useNyttSaksbilde } from '../sak/v2/useNyttSaksbilde'
import { OppgaveStatusType, SakBase, Sakstype } from '../types/types.internal'
import { useMiljø } from '../utils/useMiljø'
import { Barnebrillesaksbilde } from './barnebriller/Barnebrillesaksbilde'
import { Personlinje } from './Personlinje'
import { SakLoader } from './SakLoader'
import { Søknadsbilde } from './Søknadsbilde'
import { useBehovsmelding } from './useBehovsmelding'
import { useSak } from './useSak'
import { useErPilot } from '../tilgang/useTilgang'

const SaksbildeContent = memo(() => {
  const [nyttSaksbilde] = useNyttSaksbilde()
  const erPilot = useErPilot('nyttSaksbilde')
  const { erIkkeProd } = useMiljø()
  const { sak, isLoading, error } = useSak()
  const { error: behovsmeldingError, isLoading: isBehovsmeldingLoading } = useBehovsmelding()
  const { gjeldendeBehandling } = useBehandling()
  const { showBoundary } = useErrorBoundary()
  const { personInfo, error: personInfoError, isLoading: personInfoLoading } = usePerson(sak?.data.bruker.fnr)

  const sakErFerdigBehandletIHotsakClassic =
    !gjeldendeBehandling &&
    sak?.data.saksstatus &&
    [OppgaveStatusType.VEDTAK_FATTET, OppgaveStatusType.SENDT_GOSYS].includes(sak?.data.saksstatus)

  if (isLoading || personInfoLoading || isBehovsmeldingLoading) return <SakLoader />

  if (personInfoError) {
    return <PersonFeilmelding personError={personInfoError} />
  }

  if (error) {
    showBoundary(error)
  }

  if (behovsmeldingError) {
    showBoundary(behovsmeldingError)
  }

  if (!sak) return <div>Fant ikke sak</div>

  if (erIkkeProd && nyttSaksbilde && sak.data.sakstype === Sakstype.SØKNAD && !sakErFerdigBehandletIHotsakClassic) {
    return (
      <SakProvider>
        <SakV2 />
      </SakProvider>
    )
  }

  return (
    <>
      <Personlinje loading={personInfoLoading} person={personInfo} skjulTelefonnummer />
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
