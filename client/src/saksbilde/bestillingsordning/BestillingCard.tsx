import { Button, Tag } from '@navikt/ds-react'
import { useState } from 'react'
import styled from 'styled-components'

import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Tekst } from '../../felleskomponenter/typografi'
import { useLogNesteNavigasjon } from '../../hooks/useLogNesteNavigasjon'
import { postTildeling, putAvvisBestilling, putFerdigstillBestilling } from '../../io/http'
import { IkkeTildelt } from '../../oppgaveliste/kolonner/IkkeTildelt'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import { AvvisBestilling, HjelpemiddelArtikkel, OppgaveStatusType, Sak } from '../../types/types.internal'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { formaterTidsstempel } from '../../utils/dato'
import { formaterNavn } from '../../utils/formater'
import { mutateSak } from '../mutateSak.ts'
import { OvertaSakModal } from '../OvertaSakModal'
import { useVarsler } from '../useVarsler.tsx'
import { VenstremenyCard } from '../venstremeny/VenstremenyCard.tsx'
import { AvvisBestillingModal } from './AvvisBestillingModal'
import { BekreftAutomatiskOrdre, BekreftManuellOrdre } from './Modal.tsx'

export interface BestillingCardProps {
  bestilling: Sak
  hjelpemiddelArtikler: HjelpemiddelArtikkel[] | undefined
}

export function BestillingCard({ bestilling }: BestillingCardProps) {
  const { sakId } = bestilling
  const saksbehandler = useInnloggetSaksbehandler()
  const { varsler } = useVarsler()
  const [loading, setLoading] = useState(false)
  const [visOpprettOrdreModal, setVisOpprettOrdreModal] = useState(false)
  const [visOvertaSakModal, setVisOvertaSakModal] = useState(false)
  const [visAvvisModal, setVisAvvisModal] = useState(false)
  const [logNesteNavigasjon] = useLogNesteNavigasjon()

  const ferdigstillBestilling = async () => {
    setLoading(true)
    await putFerdigstillBestilling(sakId, OppgaveStatusType.FERDIGSTILT).catch(() => setLoading(false))
    setLoading(false)
    setVisOpprettOrdreModal(false)
    logAmplitudeEvent(amplitude_taxonomy.BESTILLING_FERDIGSTILT)
    logNesteNavigasjon(amplitude_taxonomy.BESTILLING_FERDIGSTILT)
    return mutateSak(sakId)
  }

  const overtaBestilling = async () => {
    setLoading(true)
    await postTildeling(sakId).catch(() => setLoading(false))
    setLoading(false)
    setVisOvertaSakModal(false)
    logAmplitudeEvent(amplitude_taxonomy.BESTILLING_OVERTATT)
    return mutateSak(sakId)
  }

  const avvisBestilling = async (tilbakemelding: AvvisBestilling) => {
    setLoading(true)
    await putAvvisBestilling(sakId, tilbakemelding).catch(() => setLoading(false))
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
          <Tekst>{`av ${bestilling.saksbehandler?.navn}.`}</Tekst>
          <Tekst>Ordre er klargjort og sendt til lager.</Tekst>
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
          <Tekst>{`av ${bestilling.saksbehandler?.navn}.`}</Tekst>
        </StatusTekst>
      </VenstremenyCard>
    )
  }

  if (bestilling.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER) {
    return (
      <VenstremenyCard heading="Bestilling ikke startet">
        <Tekst>Bestillingen er ikke tildelt en saksbehandler enda</Tekst>
        <Knappepanel>
          <IkkeTildelt oppgavereferanse={sakId} gåTilSak={false}></IkkeTildelt>
        </Knappepanel>
      </VenstremenyCard>
    )
  }

  if (
    bestilling.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER &&
    bestilling.saksbehandler?.id !== saksbehandler.id
  ) {
    return (
      <VenstremenyCard heading="Saksbehandler">
        <Tekst>Bestillingen er tildelt saksbehandler {formaterNavn(bestilling.saksbehandler?.navn || '')}</Tekst>
        <Knappepanel>
          <Knapp variant="primary" size="small" onClick={() => setVisOvertaSakModal(true)}>
            Overta bestillingen
          </Knapp>
        </Knappepanel>
        <OvertaSakModal
          open={visOvertaSakModal}
          saksbehandler={saksbehandler.navn}
          type="bestilling"
          onBekreft={() => overtaBestilling()}
          loading={loading}
          onClose={() => setVisOvertaSakModal(false)}
        />
      </VenstremenyCard>
    )
  }

  return (
    <VenstremenyCard>
      <Knappepanel>
        <Knapp variant="primary" size="small" onClick={() => setVisOpprettOrdreModal(true)}>
          Godkjenn
        </Knapp>
        <Knapp variant="secondary" size="small" onClick={() => setVisAvvisModal(true)}>
          Avvis
        </Knapp>
      </Knappepanel>

      {varsler && varsler.length > 0 ? (
        <BekreftManuellOrdre
          open={visOpprettOrdreModal}
          onBekreft={() => ferdigstillBestilling()}
          loading={loading}
          onClose={() => setVisOpprettOrdreModal(false)}
        />
      ) : (
        <BekreftAutomatiskOrdre
          open={visOpprettOrdreModal}
          onBekreft={() => ferdigstillBestilling()}
          loading={loading}
          onClose={() => setVisOpprettOrdreModal(false)}
        />
      )}

      <AvvisBestillingModal
        open={visAvvisModal}
        onBekreft={(tilbakemelding) => avvisBestilling(tilbakemelding)}
        loading={loading}
        onClose={() => setVisAvvisModal(false)}
      />
    </VenstremenyCard>
  )
}

const Knapp = styled(Button)`
  min-height: 0;
  margin: 2px;
  height: 1.8rem;
  padding: 0 0.75rem;
  box-sizing: border-box;
`

const StatusTekst = styled.div`
  padding-top: 0.5rem;
`
