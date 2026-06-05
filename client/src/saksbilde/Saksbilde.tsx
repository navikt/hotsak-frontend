import { lazy, memo } from 'react'
import { useErrorBoundary } from 'react-error-boundary'

import { DokumentProvider } from '../dokument/DokumentContext'
import { AsyncBoundary } from '../felleskomponenter/AsyncBoundary.tsx'
import { PersonFeilmelding } from '../felleskomponenter/feil/PersonFeilmelding'
import { Sidetittel } from '../felleskomponenter/Sidetittel.tsx'
import { type Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import { usePerson } from '../personoversikt/usePerson'
import { SakbrukerinnstillingerProvider } from '../sak/v2/SakbrukerinnstillingerProvider'
import { SakProvider } from '../sak/v2/SakProvider'
import { type SakBase, Sakstype } from '../types/types.internal'
import { Personlinje } from './Personlinje'
import { SakLoader } from './SakLoader'
import classes from './Saksbilde.module.css'
import { useBehovsmelding } from './useBehovsmelding'
import { useSak } from './useSak'
import { useMiljø } from '../utils/useMiljø.ts'
import { useSaksregler } from '../saksregler/useSaksregler.ts'

const Barnebrillesaksbilde = lazy(() => import('./barnebriller/Barnebrillesaksbilde'))
const SakV2 = lazy(() => import('../sak/v2/SakV2'))
const Søknadsbilde = lazy(() => import('./Søknadsbilde'))

const SaksbildeContent = memo(({ oppgave }: { oppgave?: Saksbehandlingsoppgave }) => {
  const { sak, isLoading: isSakLoading, error: sakError } = useSak()
  const { erBestilling } = useSaksregler()
  const { behovsmelding, isLoading: isBehovsmeldingLoading, error: behovsmeldingError } = useBehovsmelding()
  const { showBoundary } = useErrorBoundary()
  const { personInfo, error: personInfoError, isLoading: isPersonLoading } = usePerson(sak?.data.bruker.fnr)
  const { erLocal } = useMiljø()

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

  // TODO: Bedre og finere feilmelding her
  if (!sak || !behovsmelding) return <div>Fant ikke sak eller behovsmelding</div>

  const sakData = sak.data

  if (sakData.sakstype === Sakstype.SØKNAD || (erLocal && erBestilling)) {
    return (
      <div className={classes.wrapper}>
        <Sidetittel tittel={`Sak ${sakData.sakId}`} />
        <SakProvider sakstype={sakData.sakstype}>
          <SakbrukerinnstillingerProvider>
            <SakV2 oppgave={oppgave} sak={sakData} behovsmelding={behovsmelding} />
          </SakbrukerinnstillingerProvider>
        </SakProvider>
      </div>
    )
  }

  return (
    <div className={classes.wrapper}>
      <Sidetittel tittel={`Sak ${sakData.sakId}`} />
      <Personlinje loading={isPersonLoading} person={personInfo} skjulTelefonnummer />
      <SakstypeSwitch oppgave={oppgave} sak={sakData} />
    </div>
  )
})

function SakstypeSwitch({ oppgave, sak }: { oppgave?: Saksbehandlingsoppgave; sak: SakBase }) {
  switch (sak.sakstype) {
    case Sakstype.BARNEBRILLER:
      return (
        <DokumentProvider>
          <Barnebrillesaksbilde oppgave={oppgave} />
        </DokumentProvider>
      )
    case Sakstype.BESTILLING:
      return (
        <DokumentProvider>
          <Søknadsbilde oppgave={oppgave} />
        </DokumentProvider>
      )
  }
}

export default function Saksbilde({ oppgave }: { oppgave?: Saksbehandlingsoppgave }) {
  return (
    <AsyncBoundary name="Saksbilde" suspenseFallback={<SakLoader />}>
      <SaksbildeContent oppgave={oppgave} />
    </AsyncBoundary>
  )
}
