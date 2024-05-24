import { useState } from 'react'
import styled from 'styled-components'
import { useSWRConfig } from 'swr'

import { Button, Tag } from '@navikt/ds-react'

import { postTildeling, putAvvisBestilling, putFerdigstillBestilling } from '../../io/http'
import { IkkeTildelt } from '../../oppgaveliste/kolonner/IkkeTildelt'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { formaterTidsstempel } from '../../utils/dato'
import { formaterNavn } from '../../utils/formater'

import { Avstand } from '../../felleskomponenter/Avstand'
import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Brødtekst, Tekst } from '../../felleskomponenter/typografi'
import { useLogNesteNavigasjon } from '../../hooks/useLogNesteNavigasjon'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import { AvvisBestilling, HjelpemiddelArtikkel, OppgaveStatusType, Sak } from '../../types/types.internal'
import { OvertaSakModal } from '../OvertaSakModal'
import { BekreftelseModal } from '../komponenter/BekreftelseModal'
import { Card } from '../venstremeny/Card'
import { CardTitle } from '../venstremeny/CardTitle'
import { AvvisBestillingModal } from './AvvisBestillingModal'

interface BestillingCardProps {
  bestilling: Sak
  hjelpemiddelArtikler: HjelpemiddelArtikkel[] | undefined
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

export function BestillingCard({ bestilling }: BestillingCardProps) {
  const { sakId } = bestilling
  const saksbehandler = useInnloggetSaksbehandler()
  const [loading, setLoading] = useState(false)
  const [visOpprettOrdeModal, setVisOpprettOrdreModal] = useState(false)
  const [visOvertaSakModal, setVisOvertaSakModal] = useState(false)
  const [visAvvisModal, setVisAvvisModal] = useState(false)
  const { mutate } = useSWRConfig()
  const [logNesteNavigasjon] = useLogNesteNavigasjon()

  const ferdigstillBestilling = () => {
    setLoading(true)
    putFerdigstillBestilling(sakId, OppgaveStatusType.FERDIGSTILT)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisOpprettOrdreModal(false)
        mutate(`api/sak/${sakId}`)
        mutate(`api/sak/${sakId}/historikk`)
      })
  }

  const overtaBestilling = () => {
    setLoading(true)
    postTildeling(sakId)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisOvertaSakModal(false)
        mutate(`api/sak/${sakId}`)
        mutate(`api/sak/${sakId}/historikk`)
        logAmplitudeEvent(amplitude_taxonomy.BESTILLING_OVERTATT)
      })
  }

  const avvvisBestilling = (tilbakemelding: AvvisBestilling) => {
    setLoading(true)
    putAvvisBestilling(sakId, tilbakemelding)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisAvvisModal(false)
        mutate(`api/sak/${sakId}`)
        mutate(`api/sak/${sakId}/historikk`)
      })
  }

  if (bestilling.status === OppgaveStatusType.FERDIGSTILT) {
    return (
      <>
        <Card>
          <Tag data-cy="tag-soknad-status" variant="success" size="small">
            Ferdigstilt
          </Tag>
          <StatusTekst>
            <Tekst>{`${formaterTidsstempel(bestilling.statusEndret)}`}</Tekst>
            <Tekst>{`av ${bestilling.saksbehandler?.navn}.`}</Tekst>
            <Tekst>Ordre er klargjort og sendt til lager.</Tekst>
          </StatusTekst>
        </Card>
      </>
    )
  }

  if (bestilling.status === OppgaveStatusType.AVVIST) {
    return (
      <Card>
        <Tag data-cy="tag-soknad-status" variant="error" size="small">
          Avvist
        </Tag>
        <StatusTekst>
          <Tekst>{`${formaterTidsstempel(bestilling.statusEndret)}`}</Tekst>
          <Tekst>{`av ${bestilling.saksbehandler?.navn}.`}</Tekst>
        </StatusTekst>
      </Card>
    )
  }

  if (bestilling.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER) {
    return (
      <Card>
        <CardTitle level="1" size="medium">
          BESTILLING IKKE STARTET
        </CardTitle>
        <Tekst>Bestillingen er ikke tildelt en saksbehandler enda</Tekst>
        <Knappepanel>
          <IkkeTildelt oppgavereferanse={sakId} gåTilSak={false}></IkkeTildelt>
        </Knappepanel>
      </Card>
    )
  }

  if (
    bestilling.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER &&
    bestilling.saksbehandler?.id !== saksbehandler.id
  ) {
    return (
      <Card>
        <CardTitle level="1" size="medium">
          Saksbehandler
        </CardTitle>
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
          onBekreft={() => {
            overtaBestilling()
            logAmplitudeEvent(amplitude_taxonomy.SAK_OVERTATT)
          }}
          loading={loading}
          onClose={() => setVisOvertaSakModal(false)}
        />
      </Card>
    )
  } else {
    return (
      <Card>
        <Knappepanel>
          <Knapp variant="primary" size="small" onClick={() => setVisOpprettOrdreModal(true)}>
            <span>Godkjenn</span>
          </Knapp>
          <Knapp variant="secondary" size="small" onClick={() => setVisAvvisModal(true)}>
            Avvis
          </Knapp>
        </Knappepanel>
        <BekreftelseModal
          width={'600px'}
          open={visOpprettOrdeModal}
          heading="Vil du godkjenne bestillingen?"
          buttonLabel="Godkjenn"
          onBekreft={() => {
            ferdigstillBestilling()
            logAmplitudeEvent(amplitude_taxonomy.BESTILLING_FERDIGSTILT)
            logNesteNavigasjon(amplitude_taxonomy.BESTILLING_FERDIGSTILT)
          }}
          loading={loading}
          onClose={() => setVisOpprettOrdreModal(false)}
        >
          <Brødtekst>
            Når du godkjenner bestillingen blir det automatisk opprettet og klargjort en ordre i OEBS. Alle hjelpemidler
            og tilbehør i bestillingen vil legges inn som ordrelinjer.
          </Brødtekst>
          <Avstand paddingTop={3}></Avstand>
          <Brødtekst>
            Merk at det kan gå noen minutter før ordren er klargjort. Du trenger ikke gjøre noe mer med saken.
          </Brødtekst>
        </BekreftelseModal>
        <AvvisBestillingModal
          open={visAvvisModal}
          onBekreft={(tilbakemelding) => {
            avvvisBestilling(tilbakemelding)
            logAmplitudeEvent(amplitude_taxonomy.BESTILLING_AVVIST)
            logNesteNavigasjon(amplitude_taxonomy.BESTILLING_AVVIST)
          }}
          loading={loading}
          onClose={() => setVisAvvisModal(false)}
        />
      </Card>
    )
  }
}
