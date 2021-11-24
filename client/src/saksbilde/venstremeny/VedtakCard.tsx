import React, { useState } from 'react'
import styled from 'styled-components/macro'
// @ts-ignore
import { useSWRConfig } from 'swr'

import { Button, Tag } from '@navikt/ds-react'

import { putVedtak, putSendTilGosys } from '../../io/http'
import { IkkeTildelt } from '../../oppgaveliste/kolonner/IkkeTildelt'
import { formaterDato } from '../../utils/date'
import { capitalizeName } from '../../utils/stringFormating'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import useLogNesteNavigasjon from '../../hooks/useLogNesteNavigasjon'

import { Tekst } from '../../felleskomponenter/typografi'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import { OppgaveStatusType, Sak, VedtakStatusType } from '../../types/types.internal'
import { BekreftVedtakModal } from '../BekreftVedtakModal'
import { OverførGosysModal } from '../OverførGosysModal'
import { Card } from './Card'
import { CardTitle } from './CardTitle'

interface VedtakCardProps {
  sak: Sak
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
  font-size: var(--navds-font-size-m);
`

export const VedtakCard = ({ sak }: VedtakCardProps) => {
  const { saksid } = sak
  const [dokumentbeskrivelse, setDokumentbeskrivelse] = useState(sak.søknadGjelder)
  const saksbehandler = useInnloggetSaksbehandler()
  const [loading, setLoading] = useState(false)
  const [visVedtakModal, setVisVedtakModal] = useState(false)
  const [visGosysModal, setVisGosysModal] = useState(false)
  const { mutate } = useSWRConfig()
  const [logNesteNavigasjon] = useLogNesteNavigasjon()

  const opprettVedtak = () => {
    setLoading(true)
    putVedtak(saksid, dokumentbeskrivelse, VedtakStatusType.INNVILGET)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisVedtakModal(false)
        mutate(`api/sak/${saksid}`)
        mutate(`api/sak/${saksid}/historikk`)
      })
  }

  const sendTilGosys = () => {
    setLoading(true)
    putSendTilGosys(saksid, dokumentbeskrivelse)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisGosysModal(false)
        mutate(`api/sak/${saksid}`)
        mutate(`api/sak/${saksid}/historikk`)
      })
  }

  if (sak.vedtak && sak.vedtak.status === VedtakStatusType.INNVILGET) {
    return (
      <>
        <Card>
          <CardTitle>VEDTAK</CardTitle>
          <TagGrid>
            <Tag data-cy="tag-soknad-status" variant="success" size="small">
              Innvilget
            </Tag>
            <Tekst>{formaterDato(sak.vedtak.vedtaksDato)}</Tekst>
          </TagGrid>
        </Card>
      </>
    )
  }

  if (sak.status === OppgaveStatusType.SENDT_GOSYS) {
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

  if (sak.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER) {
    return (
      <Card>
        <CardTitle>SAK IKKE STARTET</CardTitle>
        <Tekst>Saken er ikke tildelt en saksbehandler enda</Tekst>
        <ButtonContainer>
          <IkkeTildelt oppgavereferanse={saksid} gåTilSak={false}></IkkeTildelt>
        </ButtonContainer>
      </Card>
    )
  }

  if (sak.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER && sak.saksbehandler.objectId !== saksbehandler.objectId) {
    return (
      <Card>
        <CardTitle>SAKSBEHANDLER</CardTitle>
        <Tekst>Saken er tildelt saksbehandler {capitalizeName(sak.saksbehandler.navn)}</Tekst>
        <ButtonContainer>
          <Knapp variant='primary' size='s' onClick={() => alert('Tildeler sak til innlogget saksbehandler')}>
            Overta saken
          </Knapp>
        </ButtonContainer>
      </Card>
    )
  } else {
    return (
      <Card>
        <ButtonContainer>
          <Knapp variant='primary' size='small' onClick={() => setVisVedtakModal(true)} data-cy="btn-vis-vedtak-modal">
            <span>Innvilg søknaden</span>
          </Knapp>
          <Knapp variant='secondary' size='small' onClick={() => setVisGosysModal(true)} data-cy="btn-vis-gosys-modal">
            Overfør til Gosys
          </Knapp>
        </ButtonContainer>
        <BekreftVedtakModal
          open={visVedtakModal}
          onBekreft={() => {
            opprettVedtak()
            logAmplitudeEvent(amplitude_taxonomy.SOKNAD_INNVILGET)
            logNesteNavigasjon(amplitude_taxonomy.SOKNAD_INNVILGET)
          }}
          loading={loading}
          onClose={() => setVisVedtakModal(false)}
        />
        <OverførGosysModal
          open={visGosysModal}
          onBekreft={() => {
            sendTilGosys()
            logAmplitudeEvent(amplitude_taxonomy.SOKNAD_OVERFORT_TIL_GOSYS)
            logNesteNavigasjon(amplitude_taxonomy.SOKNAD_OVERFORT_TIL_GOSYS)
          }}
          loading={loading}
          onClose={() => setVisGosysModal(false)}
        />
      </Card>
    )
  }
}
