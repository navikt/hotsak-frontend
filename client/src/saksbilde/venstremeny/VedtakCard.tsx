import React, { useState } from 'react'
import styled from 'styled-components'
import { useSWRConfig } from 'swr'

import { Button, Tag } from '@navikt/ds-react'

import { postTildeling, putSendTilGosys, putVedtak } from '../../io/http'
import { IkkeTildelt } from '../../oppgaveliste/kolonner/IkkeTildelt'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { norskTimestamp } from '../../utils/date'
import { capitalizeName } from '../../utils/stringFormating'

import { Knappepanel } from '../../felleskomponenter/Button'
import { Tekst } from '../../felleskomponenter/typografi'
import useLogNesteNavigasjon from '../../hooks/useLogNesteNavigasjon'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import {
  HjelpemiddelArtikkel,
  OppgaveStatusType,
  OverforGosysTilbakemelding,
  Sak,
  vedtaksgrunnlagUtlaanshistorikk,
  VedtakStatusType,
} from '../../types/types.internal'
import { BekreftVedtakModal } from '../BekreftVedtakModal'
import { OverførGosysModal } from '../OverførGosysModal'
import { OvertaSakModal } from '../OvertaSakModal'
import { Card } from './Card'
import { CardTitle } from './CardTitle'

interface VedtakCardProps {
  sak: Sak
  hjelpemiddelArtikler: HjelpemiddelArtikkel[] | undefined
}

export const TagGrid = styled.div`
  display: grid;
  grid-template-columns: 4.3rem auto;
  grid-column-gap: 0.75rem;
  grid-row-gap: 0.125rem;
`

const StatusTekst = styled.div`
  padding-top: 0.5rem;
`

const Knapp = styled(Button)`
  min-height: 0;
  margin: 2px;
  height: 1.8rem;
  padding: 0 0.75rem;
  box-sizing: border-box;
`

export const VedtakCard: React.FC<VedtakCardProps> = ({ sak, hjelpemiddelArtikler }) => {
  const { saksid } = sak
  const saksbehandler = useInnloggetSaksbehandler()
  const [loading, setLoading] = useState(false)
  const [visVedtakModal, setVisVedtakModal] = useState(false)
  const [visGosysModal, setVisGosysModal] = useState(false)
  const [visOvertaSakModal, setVisOvertaSakModal] = useState(false)
  const { mutate } = useSWRConfig()
  const [logNesteNavigasjon] = useLogNesteNavigasjon()

  const opprettVedtak = () => {
    setLoading(true)
    putVedtak(
      saksid,
      VedtakStatusType.INNVILGET,
      hjelpemiddelArtikler ? [vedtaksgrunnlagUtlaanshistorikk(hjelpemiddelArtikler)] : []
    )
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisVedtakModal(false)
        mutate(`api/sak/${saksid}`)
        mutate(`api/sak/${saksid}/historikk`)
      })
  }

  const overtaSak = () => {
    setLoading(true)
    postTildeling(saksid)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisOvertaSakModal(false)
        mutate(`api/sak/${saksid}`)
        mutate(`api/sak/${saksid}/historikk`)
        logAmplitudeEvent(amplitude_taxonomy.SAK_OVERTATT)
      })
  }

  const sendTilGosys = (tilbakemelding: OverforGosysTilbakemelding) => {
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

  if (sak.vedtak && sak.vedtak.status === VedtakStatusType.INNVILGET) {
    return (
      <>
        <Card>
          <CardTitle>VEDTAK</CardTitle>
          <Tag data-cy="tag-soknad-status" variant="success" size="small">
            Innvilget
          </Tag>
          <StatusTekst>
            <Tekst>{`${norskTimestamp(sak.vedtak.vedtaksdato)}`}</Tekst>
            <Tekst>{`av ${sak.vedtak.saksbehandlerNavn}.`}</Tekst>
          </StatusTekst>
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
        <StatusTekst>
          <Tekst>{`${norskTimestamp(sak.statusEndret)}`}</Tekst>
          <Tekst>{`av ${sak.saksbehandler.navn}.`}</Tekst>
          <Tekst>Saken er overført Gosys og behandles videre der. </Tekst>
        </StatusTekst>
      </Card>
    )
  }

  if (sak.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER) {
    return (
      <Card>
        <CardTitle>SAK IKKE STARTET</CardTitle>
        <Tekst>Saken er ikke tildelt en saksbehandler enda</Tekst>
        <Knappepanel>
          <IkkeTildelt oppgavereferanse={saksid} gåTilSak={false}></IkkeTildelt>
        </Knappepanel>
      </Card>
    )
  }

  if (sak.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER && sak.saksbehandler.objectId !== saksbehandler.objectId) {
    return (
      <Card>
        <CardTitle>SAKSBEHANDLER</CardTitle>
        <Tekst>Saken er tildelt saksbehandler {capitalizeName(sak.saksbehandler.navn)}</Tekst>
        <Knappepanel>
          <Knapp
            variant="primary"
            size="small"
            onClick={() => setVisOvertaSakModal(true)}
            data-cy="btn-vis-overta-sak-modal"
          >
            Overta saken
          </Knapp>
        </Knappepanel>
        <OvertaSakModal
          open={visOvertaSakModal}
          saksbehandler={saksbehandler.navn}
          onBekreft={() => {
            overtaSak()
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
        <Knappepanel gap="0rem">
          <Knapp variant="primary" size="small" onClick={() => setVisVedtakModal(true)} data-cy="btn-vis-vedtak-modal">
            <span>Innvilg søknaden</span>
          </Knapp>
          <Knapp variant="secondary" size="small" onClick={() => setVisGosysModal(true)} data-cy="btn-vis-gosys-modal">
            Overfør til Gosys
          </Knapp>
        </Knappepanel>
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
          onBekreft={(tilbakemelding) => {
            sendTilGosys(tilbakemelding)
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
