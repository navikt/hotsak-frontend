import React, { useState } from 'react'
import styled from 'styled-components'
import { useSWRConfig } from 'swr'

import { Button, Tag } from '@navikt/ds-react'

import { putAvvisBestilling, putFerdigstillBestilling } from '../../io/http'
import { IkkeTildelt } from '../../oppgaveliste/kolonner/IkkeTildelt'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { norskTimestamp } from '../../utils/date'
import { capitalizeName } from '../../utils/stringFormating'

import { Tekst } from '../../felleskomponenter/typografi'
import useLogNesteNavigasjon from '../../hooks/useLogNesteNavigasjon'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import { OppgaveStatusType, HjelpemiddelArtikkel, Sak, AvvisBestilling } from '../../types/types.internal'
import { Card } from '../venstremeny/Card'
import { CardTitle } from '../venstremeny/CardTitle'
import { AvvisBestillingModal } from './AvvisBestillingModal'
import { OpprettOrdreModal } from './OpprettOrdreModal'

interface BestillingCardProps {
  bestilling: Sak
  hjelpemiddelArtikler: HjelpemiddelArtikkel[] | undefined
}

export const TagGrid = styled.div`
  display: grid;
  grid-template-columns: 4.3rem auto;
  grid-column-gap: 0.75rem;
  grid-row-gap: 0.125rem;
`

const ButtonContainer = styled.div`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  padding-top: 1rem;
  align-self: flex-end;
`

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

export const BestillingCard: React.FC<BestillingCardProps> = ({ bestilling }) => {
  const { saksid } = bestilling
  const saksbehandler = useInnloggetSaksbehandler()
  const [loading, setLoading] = useState(false)
  const [visOpprettOrdeModal, setVisOpprettOrdreModal] = useState(false)
  const [visAvvisModal, setVisAvvisModal] = useState(false)
  const { mutate } = useSWRConfig()
  const [logNesteNavigasjon] = useLogNesteNavigasjon()

  const ferdigstillBestilling = () => {
    setLoading(true)
    putFerdigstillBestilling(saksid, OppgaveStatusType.FERDIGSTILT)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisOpprettOrdreModal(false)
        mutate(`api/sak/${saksid}`)
        mutate(`api/sak/${saksid}/historikk`)
      })
  }

  const avvvisBestilling = (tilbakemelding: AvvisBestilling) => {
    setLoading(true)
    putAvvisBestilling(saksid, tilbakemelding)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisAvvisModal(false)
        mutate(`api/sak/${saksid}`)
        mutate(`api/sak/${saksid}/historikk`)
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
            <Tekst>{`${norskTimestamp(bestilling.statusEndret)}`}</Tekst>
            <Tekst>{`av ${bestilling.saksbehandler.navn}.`}</Tekst>
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
          <Tekst>{`${norskTimestamp(bestilling.statusEndret)}`}</Tekst>
          <Tekst>{`av ${bestilling.saksbehandler.navn}.`}</Tekst>
        </StatusTekst>
      </Card>
    )
  }

  if (bestilling.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER) {
    return (
      <Card>
        <CardTitle>BESTILLING IKKE STARTET</CardTitle>
        <Tekst>Bestillingen er ikke tildelt en saksbehandler enda</Tekst>
        <ButtonContainer>
          <IkkeTildelt oppgavereferanse={saksid} gåTilSak={false}></IkkeTildelt>
        </ButtonContainer>
      </Card>
    )
  }

  if (
    bestilling.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER &&
    bestilling.saksbehandler.objectId !== saksbehandler.objectId
  ) {
    return (
      <Card>
        <CardTitle>SAKSBEHANDLER</CardTitle>
        <Tekst>Bestillingen er tildelt saksbehandler {capitalizeName(bestilling.saksbehandler.navn)}</Tekst>
      </Card>
    )
  } else {
    return (
      <Card>
        <ButtonContainer>
          <Knapp
            variant="primary"
            size="small"
            onClick={() => setVisOpprettOrdreModal(true)}
            data-cy="btn-vis-opprett-ordre-modal"
          >
            <span>Godkjenn</span>
          </Knapp>
          <Knapp
            variant="secondary"
            size="small"
            onClick={() => setVisAvvisModal(true)}
            data-cy="btn-avvis-bestilling-modal"
          >
            Avvis
          </Knapp>
        </ButtonContainer>
        <OpprettOrdreModal
          open={visOpprettOrdeModal}
          onBekreft={() => {
            ferdigstillBestilling()
            logAmplitudeEvent(amplitude_taxonomy.BESTILLING_FERDIGSTILT)
            logNesteNavigasjon(amplitude_taxonomy.BESTILLING_FERDIGSTILT)
          }}
          loading={loading}
          onClose={() => setVisOpprettOrdreModal(false)}
        />
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
