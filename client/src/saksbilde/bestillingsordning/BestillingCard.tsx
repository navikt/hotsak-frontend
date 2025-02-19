import { Button, Tag } from '@navikt/ds-react'
import { useState } from 'react'
import styled from 'styled-components'

import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Tekst } from '../../felleskomponenter/typografi'
import { useLogNesteNavigasjon } from '../../hooks/useLogNesteNavigasjon'
import { postTildeling, putAvvisBestilling, putFerdigstillBestilling } from '../../io/http'
import { IkkeTildelt } from '../../oppgaveliste/kolonner/IkkeTildelt'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import { OppgaveApiOppgave } from '../../types/experimentalTypes.ts'
import {
  AvvisBestilling,
  HjelpemiddelArtikkel,
  OppgaveStatusType,
  OppgaveVersjon,
  Sak,
} from '../../types/types.internal'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { formaterTidsstempel } from '../../utils/dato'
import { formaterNavn } from '../../utils/formater'
import { mutateSak } from '../mutateSak.ts'
import { OvertaSakModal } from '../OvertaSakModal'
import { useBehovsmelding } from '../useBehovsmelding.ts'
import { VenstremenyCard } from '../venstremeny/VenstremenyCard'
import { AvvisBestillingModal } from './AvvisBestillingModal'
import { BekreftAutomatiskOrdre } from './Modal'
import { useSaksregler } from '../../saksregler/useSaksregler.ts'

export interface BestillingCardProps {
  bestilling: Sak
  hjelpemiddelArtikler: HjelpemiddelArtikkel[] | undefined
  oppgave?: OppgaveApiOppgave
}

export function BestillingCard({ bestilling, oppgave }: BestillingCardProps) {
  const { sakId } = bestilling
  const saksbehandler = useInnloggetSaksbehandler()
  const { behovsmelding } = useBehovsmelding()
  const { harSkrivetilgang } = useSaksregler()
  const [loading, setLoading] = useState(false)
  const [utleveringMerknad, setUtleveringMerknad] = useState(behovsmelding?.levering.utleveringMerknad)
  const [harLagretBeskjed, setHarLagretBeskjed] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [visOpprettOrdreModal, setVisOpprettOrdreModal] = useState(false)
  const [visOvertaSakModal, setVisOvertaSakModal] = useState(false)
  const [visAvvisModal, setVisAvvisModal] = useState(false)
  const [logNesteNavigasjon] = useLogNesteNavigasjon()

  const oppgaveVersjon: OppgaveVersjon = oppgave
    ? {
        oppgaveId: oppgave.oppgaveId,
        versjon: oppgave.versjon,
      }
    : {}

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
    await putFerdigstillBestilling(sakId, oppgaveVersjon, utleveringMerknad).catch(() => setLoading(false))
    setLoading(false)
    setVisOpprettOrdreModal(false)
    logAmplitudeEvent(amplitude_taxonomy.BESTILLING_FERDIGSTILT)
    logNesteNavigasjon(amplitude_taxonomy.BESTILLING_FERDIGSTILT)
    return mutateSak(sakId)
  }

  const overtaBestilling = async () => {
    setLoading(true)
    await postTildeling(sakId, oppgaveVersjon, true).catch(() => setLoading(false))
    setLoading(false)
    setVisOvertaSakModal(false)
    logAmplitudeEvent(amplitude_taxonomy.BESTILLING_OVERTATT)
    return mutateSak(sakId)
  }

  const avvisBestilling = async (tilbakemelding: AvvisBestilling) => {
    setLoading(true)
    await putAvvisBestilling(sakId, oppgaveVersjon, tilbakemelding).catch(() => setLoading(false))
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
        {harSkrivetilgang && (
          <Knappepanel>
            <IkkeTildelt sakId={sakId} oppgaveVersjon={oppgaveVersjon} gåTilSak={false}></IkkeTildelt>
          </Knappepanel>
        )}
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
        {harSkrivetilgang && (
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

  if (!harSkrivetilgang) {
    return null
  }

  return (
    <VenstremenyCard>
      <Knappepanel>
        <Button variant="primary" size="small" onClick={() => setVisOpprettOrdreModal(true)}>
          Godkjenn
        </Button>
        <Button variant="secondary" size="small" onClick={() => setVisAvvisModal(true)}>
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
