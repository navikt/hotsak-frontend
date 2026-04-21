import { Button, Tag } from '@navikt/ds-react'
import { useState } from 'react'
import styled from 'styled-components'

import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Tekst } from '../../felleskomponenter/typografi'
import { type Oppgave } from '../../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../../oppgave/useOppgaveregler.ts'
import {
  Behandling,
  Bestillingsresultat,
  isBehandlingsutfallBestilling,
  isBehandlingsutfallHenleggelse,
} from '../../sak/v2/behandling/behandlingTyper.ts'
import { AvvisBestilling } from '../../types/types.internal'
import { formaterTidsstempel } from '../../utils/dato'
import { formaterNavn } from '../../utils/formater'
import { useBehovsmelding } from '../useBehovsmelding.ts'
import { useSakActions } from '../useSakActions.ts'
import { NotatUtkastVarsel } from '../venstremeny/NotatUtkastVarsel.tsx'
import { VenstremenyCard } from '../venstremeny/VenstremenyCard'
import { AvvisBestillingModal } from './AvvisBestillingModal'
import { BekreftAutomatiskOrdre } from './Modal'

export interface BestillingCardProps {
  oppgave: Oppgave
  gjeldendeBehandling?: Behandling
  lesevisning: boolean
  harNotatUtkast?: boolean
}

export function BestillingCard(props: BestillingCardProps) {
  const { oppgave, gjeldendeBehandling, lesevisning, harNotatUtkast } = props
  const { oppgaveErKlarTilBehandling, oppgaveErUnderBehandlingAvAnnenAnsatt } = useOppgaveregler(oppgave)
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

  if (isBehandlingsutfallHenleggelse(gjeldendeBehandling?.utfall)) {
    return (
      <VenstremenyCard heading="Henlagt">
        <Tag data-color="info" data-cy="tag-soknad-status" variant="outline" size="small">
          Henlagt
        </Tag>
        <StatusTekst>
          <Tekst>{`${formaterTidsstempel(gjeldendeBehandling?.ferdigstiltTidspunkt)}`}</Tekst>
        </StatusTekst>
      </VenstremenyCard>
    )
  }

  if (isBehandlingsutfallBestilling(gjeldendeBehandling?.utfall)) {
    const godkjent = gjeldendeBehandling.utfall.utfall === Bestillingsresultat.GODKJENT
    return (
      <VenstremenyCard>
        <Tag data-color={godkjent ? 'success' : 'danger'} data-cy="tag-soknad-status" variant="outline" size="small">
          {godkjent ? 'Godkjent' : 'Avvist'}
        </Tag>
        <StatusTekst>
          <Tekst>{`${formaterTidsstempel(gjeldendeBehandling?.ferdigstiltTidspunkt)}`}</Tekst>
        </StatusTekst>
      </VenstremenyCard>
    )
  }

  if (oppgaveErKlarTilBehandling) {
    return (
      <VenstremenyCard heading="Bestilling ikke startet">
        <Tekst>Bestillingen er ikke tildelt en saksbehandler enda.</Tekst>
      </VenstremenyCard>
    )
  }

  if (oppgaveErUnderBehandlingAvAnnenAnsatt) {
    return (
      <VenstremenyCard heading="Saksbehandler">
        <Tekst>Bestillingen er tildelt saksbehandler {formaterNavn(oppgave.tildeltSaksbehandler?.navn)}.</Tekst>
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
