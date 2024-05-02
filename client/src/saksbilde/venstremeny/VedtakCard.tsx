import React, { useState } from 'react'
import styled from 'styled-components'
import { useSWRConfig } from 'swr'

import { Bleed, Button, HelpText, HStack, Tag, TextField } from '@navikt/ds-react'

import { postTildeling, putVedtak } from '../../io/http'
import { IkkeTildelt } from '../../oppgaveliste/kolonner/IkkeTildelt'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'
import { formaterDato, norskTimestamp } from '../../utils/date'
import { capitalize, capitalizeName } from '../../utils/stringFormating'

import { Avstand } from '../../felleskomponenter/Avstand'
import { Knappepanel } from '../../felleskomponenter/Knappepanel'
import { Brødtekst, Etikett, Tekst } from '../../felleskomponenter/typografi'
import { useLogNesteNavigasjon } from '../../hooks/useLogNesteNavigasjon'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import { OppgaveStatusType, Sak, VedtakStatusType } from '../../types/types.internal'
import { OverførGosysModal } from '../OverførGosysModal'
import { OvertaSakModal } from '../OvertaSakModal'
import { BekreftelsesModal } from '../komponenter/BekreftelsesModal'
import { Card } from './Card'
import { CardTitle } from './CardTitle'
import { useOverførGosys } from '../useOverførGosys'

export interface VedtakCardProps {
  sak: Sak
}

export function VedtakCard({ sak }: VedtakCardProps) {
  const { sakId } = sak
  const saksbehandler = useInnloggetSaksbehandler()
  const [loading, setLoading] = useState(false)
  const [visVedtakModal, setVisVedtakModal] = useState(false)
  const [visOvertaSakModal, setVisOvertaSakModal] = useState(false)
  const { onOpen: visOverførGosys, ...overførGosys } = useOverførGosys(sakId, 'sak_overført_gosys_v1')
  const { mutate } = useSWRConfig()
  const [logNesteNavigasjon] = useLogNesteNavigasjon()
  const [oebsProblemsammendrag, setOebsProblemsammendrag] = useState(
    `${capitalize(sak.søknadGjelder.replace('Søknad om:', '').trim())}; ${sakId}`
  )

  const opprettVedtak = () => {
    setLoading(true)
    putVedtak(sakId, VedtakStatusType.INNVILGET, oebsProblemsammendrag)
      .catch(() => setLoading(false))
      .then(() => {
        setLoading(false)
        setVisVedtakModal(false)
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
            <Avstand marginTop={6}>
              <Brødtekst>
                Når du innvilger søknaden vil det opprettes en serviceforespørsel (SF) i OeBS. Innbygger kan se vedtaket
                på innlogget side på nav.no
              </Brødtekst>
              <Avstand paddingTop={12} />
              <TextField
                label={
                  <HStack wrap={false} gap="2" align={'center'}>
                    <Etikett>Tekst til problemsammendrag i SF i OeBS</Etikett>

                    <HelpText>
                      <Bleed marginInline="full" asChild>
                        <Brødtekst>
                          Foreslått tekst oppfyller registreringsinstruksen. Du kan redigere teksten i
                          problemsammendraget dersom det er nødvendig. Det kan du gjøre i feltet nedenfor før saken
                          innvilges eller inne på SF i OeBS som tidligere.
                        </Brødtekst>
                      </Bleed>
                    </HelpText>
                  </HStack>
                }
                onChange={(event) => setOebsProblemsammendrag(event.target.value)}
                size="small"
                value={oebsProblemsammendrag}
              />
            </Avstand>
          </BekreftelsesModal>
          <OverførGosysModal
            {...overførGosys}
            onBekreft={async (spørreundersøkelse, besvarelse, svar) => {
              await overførGosys.onBekreft(spørreundersøkelse, besvarelse, svar)
              logAmplitudeEvent(amplitude_taxonomy.SOKNAD_OVERFORT_TIL_GOSYS)
              logNesteNavigasjon(amplitude_taxonomy.SOKNAD_OVERFORT_TIL_GOSYS)
            }}
          />
        </Card>
      </>
    )
  }
}

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
