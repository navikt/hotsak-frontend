import { Button, Tag } from '@navikt/ds-react'
import { useState } from 'react'
import styled from 'styled-components'

import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Tekst } from '../../felleskomponenter/typografi'
import { useLogNesteNavigasjon } from '../../hooks/useLogNesteNavigasjon'
import { putAvvisBestilling, putFerdigstillBestilling } from '../../io/http'
import { IkkeTildelt } from '../../oppgaveliste/kolonner/IkkeTildelt'
import { useErNotatPilot, useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'
import { AvvisBestilling, HjelpemiddelArtikkel, OppgaveStatusType, Sak } from '../../types/types.internal'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { formaterTidsstempel } from '../../utils/dato'
import { formaterNavn } from '../../utils/formater'
import { mutateSak } from '../mutateSak.ts'
import { OvertaSakModal } from '../OvertaSakModal'
import { useBehovsmelding } from '../useBehovsmelding.ts'
import { VenstremenyCard } from '../venstremeny/VenstremenyCard'
import { AvvisBestillingModal } from './AvvisBestillingModal'
import { BekreftAutomatiskOrdre } from './Modal'
import { NotatUtkastVarsel } from '../venstremeny/NotatUtkastVarsel.tsx'
import { useOppgaveService } from '../../oppgave/OppgaveService.ts'
import { useOppgaveContext } from '../../oppgave/OppgaveContext.ts'

export interface BestillingCardProps {
  bestilling: Sak
  lesevisning: boolean
  harNotatUtkast?: boolean
  hjelpemiddelArtikler: HjelpemiddelArtikkel[] | undefined
}

export function BestillingCard({ bestilling, lesevisning, harNotatUtkast }: BestillingCardProps) {
  const { sakId } = bestilling
  const innloggetAnsatt = useInnloggetAnsatt()
  const { endreOppgavetildeling } = useOppgaveService()
  const { behovsmelding } = useBehovsmelding()
  const [loading, setLoading] = useState(false)
  const [utleveringMerknad, setUtleveringMerknad] = useState(behovsmelding?.levering.utleveringMerknad)
  const [harLagretBeskjed, setHarLagretBeskjed] = useState(false)
  const [ferdigstillBestillingAttempt, setFerdigstillBestillingAttempt] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [visOpprettOrdreModal, setVisOpprettOrdreModal] = useState(false)
  const [visOvertaSakModal, setVisOvertaSakModal] = useState(false)
  const [visAvvisModal, setVisAvvisModal] = useState(false)
  const [logNesteNavigasjon] = useLogNesteNavigasjon()
  const erNotatPilot = useErNotatPilot()
  const { oppgaveId, versjon } = useOppgaveContext()

  const lagreUtleveringMerknad = (merknad: string) => {
    setSubmitAttempt(false)
    setUtleveringMerknad(merknad)
    setHarLagretBeskjed(true)
  }

  const ferdigstillBestilling = async () => {
    setSubmitAttempt(true)

    if (utleveringMerknad && !harLagretBeskjed) {
      return
    }

    setLoading(true)
    await putFerdigstillBestilling(sakId, { oppgaveId, versjon }, utleveringMerknad).catch(() => setLoading(false))
    setLoading(false)
    setVisOpprettOrdreModal(false)
    logAmplitudeEvent(amplitude_taxonomy.BESTILLING_FERDIGSTILT)
    logNesteNavigasjon(amplitude_taxonomy.BESTILLING_FERDIGSTILT)
    return mutateSak(sakId)
  }

  const overtaBestilling = async () => {
    setLoading(true)
    await endreOppgavetildeling({ overtaHvisTildelt: true }).catch(() => setLoading(false))
    setLoading(false)
    setVisOvertaSakModal(false)
    logAmplitudeEvent(amplitude_taxonomy.BESTILLING_OVERTATT)
    return mutateSak(sakId)
  }

  const avvisBestilling = async (tilbakemelding: AvvisBestilling) => {
    setLoading(true)
    await putAvvisBestilling(sakId, { oppgaveId, versjon }, tilbakemelding).catch(() => setLoading(false))
    setLoading(false)
    setVisAvvisModal(false)
    logAmplitudeEvent(amplitude_taxonomy.BESTILLING_AVVIST)
    logNesteNavigasjon(amplitude_taxonomy.BESTILLING_AVVIST)
    return mutateSak(sakId)
  }

  if (bestilling.status === OppgaveStatusType.FERDIGSTILT) {
    return (
      <VenstremenyCard>
        <Tag data-cy="tag-soknad-status" variant="success" size="small">
          Ferdigstilt
        </Tag>
        <StatusTekst>
          <Tekst>{`${formaterTidsstempel(bestilling.statusEndret)}`}</Tekst>
        </StatusTekst>
      </VenstremenyCard>
    )
  }

  if (bestilling.status === OppgaveStatusType.AVVIST) {
    return (
      <VenstremenyCard>
        <Tag data-cy="tag-soknad-status" variant="error" size="small">
          Avvist
        </Tag>
        <StatusTekst>
          <Tekst>{`${formaterTidsstempel(bestilling.statusEndret)}`}</Tekst>
        </StatusTekst>
      </VenstremenyCard>
    )
  }

  if (bestilling.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER) {
    return (
      <VenstremenyCard heading="Bestilling ikke startet">
        <Tekst>Bestillingen er ikke tildelt en saksbehandler enda</Tekst>
        {!lesevisning && (
          <Knappepanel>
            <IkkeTildelt sakId={sakId} gåTilSak={false}></IkkeTildelt>
          </Knappepanel>
        )}
      </VenstremenyCard>
    )
  }

  if (
    bestilling.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER &&
    bestilling.saksbehandler?.id !== innloggetAnsatt.id
  ) {
    return (
      <VenstremenyCard heading="Saksbehandler">
        <Tekst>Bestillingen er tildelt saksbehandler {formaterNavn(bestilling.saksbehandler?.navn || '')}</Tekst>
        {!lesevisning && (
          <Knappepanel>
            <Button variant="primary" size="small" onClick={() => setVisOvertaSakModal(true)}>
              Overta bestillingen
            </Button>
          </Knappepanel>
        )}
        <OvertaSakModal
          open={visOvertaSakModal}
          saksbehandler={bestilling?.saksbehandler?.navn || '<Ukjent>'}
          type="bestilling"
          onBekreft={() => overtaBestilling()}
          loading={loading}
          onClose={() => setVisOvertaSakModal(false)}
        />
      </VenstremenyCard>
    )
  }

  if (lesevisning) {
    return null
  }

  return (
    <VenstremenyCard>
      {ferdigstillBestillingAttempt && harNotatUtkast && <NotatUtkastVarsel />}
      <Knappepanel>
        <Button
          variant="primary"
          size="small"
          onClick={() => {
            if (erNotatPilot && harNotatUtkast) {
              setFerdigstillBestillingAttempt(true)
            } else {
              setVisOpprettOrdreModal(true)
            }
          }}
        >
          Godkjenn
        </Button>
        <Button
          variant="secondary"
          size="small"
          onClick={() => {
            if (erNotatPilot && harNotatUtkast) {
              setFerdigstillBestillingAttempt(true)
            } else {
              setVisAvvisModal(true)
            }
          }}
        >
          Avvis
        </Button>
      </Knappepanel>
      {
        /* Foreløpig kommentert ut frem til vi vet om vi skal tilby "manuelle ordre" eller ikke
        
        harVarsler ? (
        <BekreftManuellOrdre
          open={visOpprettOrdreModal}
          onBekreft={() => ferdigstillBestilling()}
          loading={loading}
          onClose={() => setVisOpprettOrdreModal(false)}
        />*/
        <BekreftAutomatiskOrdre
          open={visOpprettOrdreModal}
          onBekreft={() => ferdigstillBestilling()}
          loading={loading}
          onClose={() => setVisOpprettOrdreModal(false)}
          error={submitAttempt && !harLagretBeskjed}
          harLagretBeskjed={harLagretBeskjed}
          leveringsmerknad={utleveringMerknad}
          onLagre={lagreUtleveringMerknad}
          onEndre={() => setHarLagretBeskjed(false)}
        />
      }

      <AvvisBestillingModal
        open={visAvvisModal}
        onBekreft={(tilbakemelding) => avvisBestilling(tilbakemelding)}
        loading={loading}
        onClose={() => setVisAvvisModal(false)}
      />
    </VenstremenyCard>
  )
}

const StatusTekst = styled.div`
  padding-top: 0.5rem;
`
