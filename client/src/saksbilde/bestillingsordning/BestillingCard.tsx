import { Button, Tag } from '@navikt/ds-react'
import { useState } from 'react'
import styled from 'styled-components'

import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Tekst } from '../../felleskomponenter/typografi'
import { OvertaOppgaveModal } from '../../oppgave/OvertaOppgaveModal.tsx'
import { useOppgaveActions } from '../../oppgave/useOppgaveActions.ts'
import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'
import { AvvisBestilling, OppgaveStatusType, Sak } from '../../types/types.internal'
import { formaterTidsstempel } from '../../utils/dato'
import { formaterNavn } from '../../utils/formater'
import { TaOppgaveISakButton } from '../TaOppgaveISakButton.tsx'
import { useBehovsmelding } from '../useBehovsmelding.ts'
import { useSakActions } from '../useSakActions.ts'
import { NotatUtkastVarsel } from '../venstremeny/NotatUtkastVarsel.tsx'
import { VenstremenyCard } from '../venstremeny/VenstremenyCard'
import { AvvisBestillingModal } from './AvvisBestillingModal'
import { BekreftAutomatiskOrdre } from './Modal'

export interface BestillingCardProps {
  bestilling: Sak
  lesevisning: boolean
  harNotatUtkast?: boolean
}

export function BestillingCard({ bestilling, lesevisning, harNotatUtkast }: BestillingCardProps) {
  const innloggetAnsatt = useInnloggetAnsatt()
  const oppgaveActions = useOppgaveActions()
  const sakActions = useSakActions()
  const { behovsmelding } = useBehovsmelding()
  const [utleveringMerknad, setUtleveringMerknad] = useState(behovsmelding?.levering.utleveringMerknad)
  const [harLagretBeskjed, setHarLagretBeskjed] = useState(false)
  const [ferdigstillBestillingAttempt, setFerdigstillBestillingAttempt] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [visOpprettOrdreModal, setVisOpprettOrdreModal] = useState(false)
  const [visOvertaSakModal, setVisOvertaSakModal] = useState(false)
  const [visAvvisModal, setVisAvvisModal] = useState(false)

  const lagreUtleveringMerknad = (merknad: string) => {
    setSubmitAttempt(false)
    setUtleveringMerknad(merknad)
    setHarLagretBeskjed(true)
  }

  const overtaBestilling = async () => {
    await oppgaveActions.endreOppgavetildeling({ overtaHvisTildelt: true })
    setVisOvertaSakModal(false)
  }

  const godkjennBestilling = async () => {
    setSubmitAttempt(true)
    if (utleveringMerknad && !harLagretBeskjed) return
    await sakActions.godkjennBestilling(utleveringMerknad)
    setVisOpprettOrdreModal(false)
  }

  const avvisBestilling = async (tilbakemelding: AvvisBestilling) => {
    await sakActions.avvisBestilling(tilbakemelding)
    setVisAvvisModal(false)
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
            <TaOppgaveISakButton />
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
        <OvertaOppgaveModal
          open={visOvertaSakModal}
          saksbehandler={bestilling?.saksbehandler?.navn || '<Ukjent>'}
          type="bestilling"
          onBekreft={() => overtaBestilling()}
          loading={oppgaveActions.state.loading}
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
            if (harNotatUtkast) {
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
            if (harNotatUtkast) {
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
        /* Foreløpig kommentert ut frem til vi vet om vi skal tilby "manuelle ordre" eller ikke.
        harVarsler ? (
        <BekreftManuellOrdre
          open={visOpprettOrdreModal}
          onBekreft={() => ferdigstillBestilling()}
          loading={loading}
          onClose={() => setVisOpprettOrdreModal(false)}
        />
        */
        <BekreftAutomatiskOrdre
          open={visOpprettOrdreModal}
          onBekreft={() => godkjennBestilling()}
          loading={sakActions.state.loading}
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
        loading={sakActions.state.loading}
        onClose={() => setVisAvvisModal(false)}
      />
    </VenstremenyCard>
  )
}

const StatusTekst = styled.div`
  padding-top: 0.5rem;
`
