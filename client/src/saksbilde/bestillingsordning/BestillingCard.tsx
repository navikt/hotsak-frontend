import React, { useState } from 'react'
import styled from 'styled-components/macro'
import { useSWRConfig } from 'swr'

import { Button, Tag } from '@navikt/ds-react'

import { putFerdigstillBestilling, putSendTilGosys } from '../../io/http'
import { IkkeTildelt } from '../../oppgaveliste/kolonner/IkkeTildelt'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { formaterDato } from '../../utils/date'
import { capitalizeName } from '../../utils/stringFormating'

import { Tekst } from '../../felleskomponenter/typografi'
import useLogNesteNavigasjon from '../../hooks/useLogNesteNavigasjon'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import { OppgaveStatusType, OverforGosysTilbakemelding, HjelpemiddelArtikkel, Sak } from '../../types/types.internal'
import { OverførGosysModal } from '../OverførGosysModal'
import { Card } from '../venstremeny/Card'
import { CardTitle } from '../venstremeny/CardTitle'
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

export const BestillingCard: React.VFC<BestillingCardProps> = ({ bestilling, hjelpemiddelArtikler }) => {
  const { saksid } = bestilling
  const saksbehandler = useInnloggetSaksbehandler()
  const [loading, setLoading] = useState(false)
  const [visOpprettOrdeModal, setVisOpprettOrdreModal] = useState(false)
  const [visGosysModal, setVisGosysModal] = useState(false)
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

  const sendBestillingTilGosys = (tilbakemelding: OverforGosysTilbakemelding) => {
    setLoading(true)
    putSendTilGosys(saksid, tilbakemelding)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisGosysModal(false)
        mutate(`api/sak/${saksid}`)
        mutate(`api/sak/${saksid}/historikk`)
      })
  }

  if (bestilling.status === OppgaveStatusType.FERDIGSTILT) {
    return (
      <>
        <Card>
          <TagGrid>
            <Tag data-cy="tag-soknad-status" variant="success" size="small">
              Ferdigstilt
            </Tag>
            <Tekst>{formaterDato(bestilling.statusEndret)}</Tekst>
          </TagGrid>
        </Card>
      </>
    )
  }

  if (bestilling.status === OppgaveStatusType.SENDT_GOSYS) {
    return (
      <Card>
        <CardTitle>OVERFØRT</CardTitle>
        <Tag data-cy="tag-soknad-status" variant="info" size="small">
          Overført til Gosys
        </Tag>
        <Tekst>Saken er overført Gosys og behandles videre der. </Tekst>
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
            <span>Opprett ordre</span>
          </Knapp>
          <Knapp variant="secondary" size="small" onClick={() => setVisGosysModal(true)} data-cy="btn-vis-gosys-modal">
            Overfør til Gosys
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
        <OverførGosysModal
          open={visGosysModal}
          onBekreft={(tilbakemelding) => {
            sendBestillingTilGosys(tilbakemelding)
            logAmplitudeEvent(amplitude_taxonomy.BESTILLING_OVERFORT_TIL_GOSYS)
            logNesteNavigasjon(amplitude_taxonomy.BESTILLING_OVERFORT_TIL_GOSYS)
          }}
          loading={loading}
          onClose={() => setVisGosysModal(false)}
        />
      </Card>
    )
  }
}
