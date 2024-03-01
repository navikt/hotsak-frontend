import React, { useState } from 'react'
import styled from 'styled-components'
import { useSWRConfig } from 'swr'

import { Button, Tag } from '@navikt/ds-react'

import { postTildeling, putVedtak } from '../../io/http'
import { IkkeTildelt } from '../../oppgaveliste/kolonner/IkkeTildelt'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { formaterDato, norskTimestamp } from '../../utils/date'
import { capitalizeName } from '../../utils/stringFormating'

import { Eksperiment } from '../../felleskomponenter/Eksperiment'
import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Brødtekst, Tekst } from '../../felleskomponenter/typografi'
import { HeitKrukka } from '../../heitKrukka/HeitKrukka'
import { useHeitKrukka } from '../../heitKrukka/heitKrukkaHook'
import useLogNesteNavigasjon from '../../hooks/useLogNesteNavigasjon'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import {
    HjelpemiddelArtikkel,
    OppgaveStatusType,
    Sak,
    VedtakStatusType,
    vedtaksgrunnlagUtlaanshistorikk,
} from '../../types/types.internal'
import { OverførGosysModal, useOverførGosys } from '../OverførGosysModal'
import { OvertaSakModal } from '../OvertaSakModal'
import { BekreftelsesModal } from '../komponenter/BekreftelsesModal'
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
  const { sakId } = sak
  const saksbehandler = useInnloggetSaksbehandler()
  const [loading, setLoading] = useState(false)
  const [visVedtakModal, setVisVedtakModal] = useState(false)
  const [visOvertaSakModal, setVisOvertaSakModal] = useState(false)
  const { onOpen: visOverførGosys, ...overførGosys } = useOverførGosys(sakId, overførGosysÅrsaker)
  const { mutate } = useSWRConfig()
  const [logNesteNavigasjon] = useLogNesteNavigasjon()
  const { hentSpørreskjema, spørreskjema, spørreskjemaOpen, setSpørreskjemaOpen } = useHeitKrukka()

  const opprettVedtak = () => {
    setLoading(true)
    putVedtak(
      sakId,
      VedtakStatusType.INNVILGET,
      hjelpemiddelArtikler ? [vedtaksgrunnlagUtlaanshistorikk(hjelpemiddelArtikler)] : []
    )
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisVedtakModal(false)
        if (window.appSettings.MILJO !== 'prod-gcp') {
            
          hentSpørreskjema('sporreskjemaSaksbehandlerA_v1', sak.enhet)
        }
        mutate(`api/sak/${sakId}`)
        mutate(`api/sak/${sakId}/historikk`)
      })
  }

  const overtaSak = () => {
    setLoading(true)
    postTildeling(sakId)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisOvertaSakModal(false)
        mutate(`api/sak/${sakId}`)
        mutate(`api/sak/${sakId}/historikk`)
        logAmplitudeEvent(amplitude_taxonomy.SAK_OVERTATT)
      })
  }

  if (sak.vedtak && sak.vedtak.status === VedtakStatusType.INNVILGET) {
    return (
      <>
        <Card>
          <CardTitle level="1" size="medium">
            VEDTAK
          </CardTitle>
          <Tag data-cy="tag-soknad-status" variant="success" size="small">
            Innvilget
          </Tag>
          <StatusTekst>
            <Tekst>{`${formaterDato(sak.vedtak.vedtaksdato)}`}</Tekst>
            <Tekst>{`av ${sak.vedtak.saksbehandlerNavn}.`}</Tekst>
          </StatusTekst>
        </Card>
      </>
    )
  }

  if (sak.status === OppgaveStatusType.SENDT_GOSYS) {
    return (
      <Card>
        <CardTitle level="1" size="medium">
          OVERFØRT
        </CardTitle>
        <Tag data-cy="tag-soknad-status" variant="info" size="small">
          Overført til Gosys
        </Tag>
        <StatusTekst>
          <Tekst>{`${norskTimestamp(sak.statusEndret)}`}</Tekst>
          <Tekst>{`av ${sak.saksbehandler?.navn}.`}</Tekst>
          <Tekst>Saken er overført Gosys og behandles videre der. </Tekst>
        </StatusTekst>
      </Card>
    )
  }

  if (sak.status === OppgaveStatusType.AVVENTER_SAKSBEHANDLER) {
    return (
      <Card>
        <CardTitle level="1" size="medium">
          SAK IKKE STARTET
        </CardTitle>
        <Tekst>Saken er ikke tildelt en saksbehandler enda</Tekst>
        <Knappepanel>
          <IkkeTildelt oppgavereferanse={sakId} gåTilSak={false}></IkkeTildelt>
        </Knappepanel>
      </Card>
    )
  }

  if (sak.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER && sak.saksbehandler?.id !== saksbehandler.id) {
    return (
      <Card>
        <CardTitle level="1" size="medium">
          SAKSBEHANDLER
        </CardTitle>
        <Tekst>Saken er tildelt saksbehandler {capitalizeName(sak.saksbehandler?.navn || '')}</Tekst>
        <Knappepanel>
          <Knapp variant="primary" size="small" onClick={() => setVisOvertaSakModal(true)}>
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
      <>
        <Card>
          <Knappepanel gap="0rem">
            <Knapp variant="primary" size="small" onClick={() => setVisVedtakModal(true)}>
              <span>Innvilg søknaden</span>
            </Knapp>
            <Knapp variant="secondary" size="small" onClick={visOverførGosys}>
              Overfør til Gosys
            </Knapp>
          </Knappepanel>
          <BekreftelsesModal
            heading="Vil du innvilge søknaden?"
            open={visVedtakModal}
            width="600px"
            buttonLabel="Innvilg søknaden"
            onBekreft={() => {
              opprettVedtak()
              logAmplitudeEvent(amplitude_taxonomy.SOKNAD_INNVILGET)
              logNesteNavigasjon(amplitude_taxonomy.SOKNAD_INNVILGET)
            }}
            loading={loading}
            onClose={() => setVisVedtakModal(false)}
          >
            <Brødtekst>
              Ved å innvilge søknaden blir det fattet et vedtak i saken og opprettet en serviceforespørsel i OEBS.
            </Brødtekst>
            <Brødtekst>Innbygger vil få beskjed om vedtaket på Ditt NAV.</Brødtekst>
            {/*<Avstand paddingTop={6} />
          <TextField label="Problemsammendrag til SF i OEBS" size="small" value="Personløfter, seng, terskeleliminator" />*/}
          </BekreftelsesModal>
          <OverførGosysModal
            {...overførGosys}
            onBekreft={async (tilbakemelding) => {
              await overførGosys.onBekreft(tilbakemelding)
              logAmplitudeEvent(amplitude_taxonomy.SOKNAD_OVERFORT_TIL_GOSYS)
              logNesteNavigasjon(amplitude_taxonomy.SOKNAD_OVERFORT_TIL_GOSYS)
            }}
          />
        </Card>

        <Eksperiment>
          <HeitKrukka
            open={spørreskjema !== undefined}
            onClose={() => setSpørreskjemaOpen(false)}
            skjemaUrl={spørreskjema}
          />
        </Eksperiment>
      </>
    )
  }
}

const overførGosysÅrsaker: ReadonlyArray<string> = [
  'Mulighet for å legge inn mer informasjon i saken',
  'Mulighet for å gjøre skriftlige vedtak i Hotsak',
  'Personen som skal jobbe videre med saken jobber ikke i Hotsak i dag',
  'Annet',
]
