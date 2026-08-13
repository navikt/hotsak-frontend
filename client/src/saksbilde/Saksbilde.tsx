import { lazy, memo } from 'react'
import { useErrorBoundary } from 'react-error-boundary'
import { OverførtGosysVisning } from './OverførtGosysVisning'
import { Personlinje } from './Personlinje'
import { DokumentProvider } from '../dokument/DokumentContext'
import { AsyncBoundary } from '../felleskomponenter/AsyncBoundary.tsx'
import { PersonFeilmelding } from '../felleskomponenter/feil/PersonFeilmelding'
import { Sidetittel } from '../felleskomponenter/Sidetittel.tsx'
import { type Saksbehandlingsoppgave } from '../oppgave/oppgaveTypes.ts'
import { usePerson } from '../personoversikt/usePerson'
import { Behandlingsutfall, isBehandlingsutfallOverføring } from '../sak/v2/behandling/behandlingTyper.ts'
import { useBehandling } from '../sak/v2/behandling/useBehandling.ts'
import { SakbrukerinnstillingerProvider } from '../sak/v2/SakbrukerinnstillingerProvider'
import { SakProvider } from '../sak/v2/SakProvider'
import { useSaksregler } from '../saksregler/useSaksregler.ts'
import { OppgaveStatusType, type SakBase } from '../types/types.internal'
import { useMiljø } from '../utils/useMiljø.ts'
import { SakLoader } from './SakLoader'
import classes from './Saksbilde.module.css'
import { useBehovsmelding } from './useBehovsmelding'
import { useSak } from './useSak'

const Barnebrillesaksbilde = lazy(() => import('./barnebriller/Barnebrillesaksbilde'))
const SakV2 = lazy(() => import('../sak/v2/SakV2'))

const SaksbildeContent = memo(({ oppgave }: { oppgave?: Saksbehandlingsoppgave }) => {
  const { sak, isLoading: isSakLoading, error: sakError } = useSak()
  const { erBarnebrillesak } = useSaksregler()
  const { behovsmelding, isLoading: isBehovsmeldingLoading, error: behovsmeldingError } = useBehovsmelding()
  const { showBoundary } = useErrorBoundary()
  const { personInfo, error: personInfoError, isLoading: isPersonLoading } = usePerson(sak?.data.bruker.fnr)
  const { erProd } = useMiljø()
  const { gjeldendeBehandling } = useBehandling()

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

  if (erFerdigstiltOppgaveOgOverførtTilGosys(oppgave, sakData, erProd, gjeldendeBehandling?.utfall)) {
    return <OverførtGosysVisning />
  }

  if (erBarnebrillesak) {
    return (
      <div className={classes.wrapper}>
        <Sidetittel tittel={`Sak ${sakData.sakId}`} />
        <Personlinje loading={isPersonLoading} person={personInfo} skjulTelefonnummer />
        <DokumentProvider>
          <Barnebrillesaksbilde oppgave={oppgave} />
        </DokumentProvider>
      </div>
    )
  }

  return (
    <div className={classes.wrapper}>
      <Sidetittel tittel={`Sak ${sakData.sakId}`} />
      <SakProvider sakstype={sakData.sakstype}>
        <SakbrukerinnstillingerProvider>
          <DokumentProvider>
            <SakV2 oppgave={oppgave} sak={sakData} behovsmelding={behovsmelding} />
          </DokumentProvider>
        </SakbrukerinnstillingerProvider>
      </SakProvider>
    </div>
  )
})

export default function Saksbilde({ oppgave }: { oppgave?: Saksbehandlingsoppgave }) {
  return (
    <AsyncBoundary name="Saksbilde" suspenseFallback={<SakLoader />}>
      <SaksbildeContent oppgave={oppgave} />
    </AsyncBoundary>
  )
}

function erFerdigstiltOppgaveOgOverførtTilGosys(
  oppgave?: Saksbehandlingsoppgave,
  sak?: SakBase,
  erProd?: boolean,
  utfall?: Behandlingsutfall
) {
  if (!sak || erProd) return false

  if (!oppgave && sak.saksstatus == OppgaveStatusType.SENDT_GOSYS) return true

  if (!oppgave) return false

  return (
    (oppgave.oppgavestatus === 'FERDIGSTILT' || oppgave.oppgavestatus === 'FEILREGISTRERT') &&
    isBehandlingsutfallOverføring(utfall)
  )
}
