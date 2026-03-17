import { Button, Tag } from '@navikt/ds-react'
import { useState } from 'react'
import styled from 'styled-components'

import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Tekst } from '../../felleskomponenter/typografi'
import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'
import { AvvisBestilling, OppgaveStatusType, Sak } from '../../types/types.internal'
import { formaterTidsstempel } from '../../utils/dato'
import { formaterNavn } from '../../utils/formater'
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
  const sakActions = useSakActions()
  const { behovsmelding } = useBehovsmelding()
  const [ferdigstillBestillingAttempt, setFerdigstillBestillingAttempt] = useState(false)
  const [visOpprettOrdreModal, setVisOpprettOrdreModal] = useState(false)
  const [visAvvisModal, setVisAvvisModal] = useState(false)

  const godkjennBestilling = async (merknad?: string) => {
    await sakActions.godkjennBestilling(merknad)
    setVisOpprettOrdreModal(false)
  }

  const avvisBestilling = async (tilbakemelding: AvvisBestilling) => {
    await sakActions.avvisBestilling(tilbakemelding)
    setVisAvvisModal(false)
  }

  if (bestilling.saksstatus === OppgaveStatusType.HENLAGT) {
    return (
      <VenstremenyCard heading="Henlagt">
        <Tag data-color="info" data-cy="tag-soknad-status" variant="outline" size="small">
          Henlagt
        </Tag>
        <StatusTekst>
          <Tekst>{`${formaterTidsstempel(bestilling.saksstatusGyldigFra)}`}</Tekst>
        </StatusTekst>
      </VenstremenyCard>
    )
  }

  if (bestilling.saksstatus === OppgaveStatusType.FERDIGSTILT) {
    return (
      <VenstremenyCard>
        <Tag data-color="success" data-cy="tag-soknad-status" variant="outline" size="small">
          Ferdigstilt
        </Tag>
        <StatusTekst>
          <Tekst>{`${formaterTidsstempel(bestilling.saksstatusGyldigFra)}`}</Tekst>
        </StatusTekst>
      </VenstremenyCard>
    )
  }

  if (bestilling.saksstatus === OppgaveStatusType.AVVIST) {
    return (
      <VenstremenyCard>
        <Tag data-color="danger" data-cy="tag-soknad-status" variant="outline" size="small">
          Avvist
        </Tag>
        <StatusTekst>
          <Tekst>{`${formaterTidsstempel(bestilling.saksstatusGyldigFra)}`}</Tekst>
        </StatusTekst>
      </VenstremenyCard>
    )
  }

  if (bestilling.saksstatus === OppgaveStatusType.AVVENTER_SAKSBEHANDLER) {
    return (
      <VenstremenyCard heading="Bestilling ikke startet">
        <Tekst>Bestillingen er ikke tildelt en saksbehandler enda.</Tekst>
      </VenstremenyCard>
    )
  }

  if (
    bestilling.saksstatus === OppgaveStatusType.TILDELT_SAKSBEHANDLER &&
    bestilling.saksbehandler?.id !== innloggetAnsatt.id
  ) {
    return (
      <VenstremenyCard heading="Saksbehandler">
        <Tekst>Bestillingen er tildelt saksbehandler {formaterNavn(bestilling.saksbehandler?.navn || '')}.</Tekst>
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
          onBekreft={(merknad) => godkjennBestilling(merknad)}
          loading={sakActions.state.loading}
          onClose={() => setVisOpprettOrdreModal(false)}
          leveringsmerknad={behovsmelding?.levering.utleveringMerknad}
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
