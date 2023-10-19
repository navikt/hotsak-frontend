import { ChangeEvent, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import styled from 'styled-components'
import useSWR from 'swr'

import { Alert, Button, Detail, Heading, Loader, Panel, Tag, Textarea } from '@navikt/ds-react'

import { post, postBrevutkast } from '../../../../io/http'
import { formaterDato } from '../../../../utils/date'
import { capitalizeName, formaterKontonummer } from '../../../../utils/stringFormating'

import { AlertContainer } from '../../../../felleskomponenter/AlertContainer'
import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Knappepanel } from '../../../../felleskomponenter/Button'
import { Kolonne, Rad } from '../../../../felleskomponenter/Flex'
import { TreKolonner } from '../../../../felleskomponenter/Kolonner'
import { SkjemaAlert } from '../../../../felleskomponenter/SkjemaAlert'
import { Bakgrunnslagring } from '../../../../felleskomponenter/brev/Bakgrunnslagring'
import { Etikett } from '../../../../felleskomponenter/typografi'
import { useSaksbehandlerKanRedigereBarnebrillesak } from '../../../../tilgang/useSaksbehandlerKanRedigereBarnebrillesak'
import {
  BrevTekst,
  Brevtype,
  MålformType,
  OppgaveStatusType,
  StegType,
  VilkårsResultat,
} from '../../../../types/types.internal'
import { useBrillesak } from '../../../sakHook'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { alertVariant } from '../vilkårsvurdering/oppsummertStatus'
import { BrevPanel } from './brev/BrevPanel'
import { useBrev } from './brev/brevHook'

export const Vedtak: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const { saksnummer } = useParams<{ saksnummer: string }>()
  const { setValgtTab } = useManuellSaksbehandlingContext()
  const { sak, mutate } = useBrillesak()
  const saksbehandlerKanRedigereBarnebrillesak = useSaksbehandlerKanRedigereBarnebrillesak(sak?.data)
  const { data } = useBrevtekst(saksnummer)
  const { hentForhåndsvisning } = useBrev()

  const brevtekst = data?.data.brevtekst
  const [fritekst, setFritekst] = useState(brevtekst || '')
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const [valideringsFeil, setValideringsfeil] = useState<string | undefined>(undefined)
  const [lagrer, setLagrer] = useState(false)
  const debounceVentetid = 1000

  const VENSTREKOLONNE_BREDDE = '180px'

  const sendTilGodkjenning = () => {
    setLoading(true)
    post(`/api/sak/${sak!.data.sakId}/kontroll`, {})
      .catch((e) => {
        setLoading(false)

        // TODO Håndtere feil her
      })
      .then(() => {
        setLoading(false)
        mutate()
      })
  }

  useEffect(() => {
    if (brevtekst) {
      setFritekst(brevtekst)
    }
  }, [brevtekst])

  useEffect(() => {
    if (submitAttempt) {
      valider()
    }
  }, [fritekst, submitAttempt])

  const valider = () => {
    if (fritekst === '') {
      setValideringsfeil('Du kan ikke sende brevet uten å ha lagt til tekst')
      return false
    } else {
      setValideringsfeil(undefined)
      return true
    }
  }

  const onTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFritekst(event.target.value)
    clearTimeout(timer)

    const newTimer = setTimeout(() => {
      lagreUtkast(event.target.value)
    }, debounceVentetid)

    setTimer(newTimer)
  }

  function byggBrevPayload(tekst?: string): BrevTekst {
    return {
      sakId: saksnummer!,
      målform: sak?.data.vilkårsgrunnlag?.målform || MålformType.BOKMÅL,
      brevtype: Brevtype.BARNEBRILLER_VEDTAK,
      data: {
        brevtekst: tekst ? tekst : fritekst,
      },
    }
  }

  const lagreUtkast = async (tekst: string) => {
    setLagrer(true)
    await postBrevutkast(byggBrevPayload(tekst))
    setLagrer(false)
  }

  if (!sak) return <div>Fant ikke saken</div> // TODO: Håndere dette bedre/høyrere opp i komponent treet.

  if (sak?.data.steg === StegType.INNHENTE_FAKTA) {
    return (
      <AlertContainer>
        <Alert variant="info" size="small">
          {`Denne saken har ikke fullført steget "Registrer søknad" enda. Denne siden kan ikke vises før det er fullført.`}
        </Alert>
      </AlertContainer>
    )
  }

  if (sak?.data.steg === StegType.VURDERE_VILKÅR) {
    return (
      <AlertContainer>
        <Alert variant="info" size="small">
          {`Denne saken har ikke fullført steget "Vilkårsvurdering" enda. Vedtaket kan ikke fattes før vilkårsvurdering er`}
          fullført.
        </Alert>
      </AlertContainer>
    )
  }

  const { bruker, vilkårsvurdering } = sak.data
  const status = sak?.data.vilkårsvurdering!.resultat

  const alertType = alertVariant(status)

  const vedtakFattet = sak.data.status === OppgaveStatusType.VEDTAK_FATTET
  const visAlertGodkjenning =
    sak.data.status === OppgaveStatusType.AVVENTER_GODKJENNER || sak.data.steg === StegType.GODKJENNE
  const visSendTilGodkjenning =
    saksbehandlerKanRedigereBarnebrillesak &&
    sak.data.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER &&
    (status === VilkårsResultat.NEI || sak?.data.utbetalingsmottaker?.kontonummer !== undefined)

  const opplysningspliktVilkår = sak.data.vilkårsvurdering?.vilkår.find(
    (vilkår) => vilkår.vilkårId === 'MEDLEMMETS_OPPLYSNINGSPLIKT'
  )

  // TODO fix logikk her nå som opplysningsplikt ikke finnes
  const visFritekstFelt =
    visSendTilGodkjenning &&
    opplysningspliktVilkår?.begrunnelse === VilkårsResultat.NEI &&
    sak.data.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER

  return (
    <TreKolonner>
      <Panel>
        <Heading level="1" size="small" spacing>
          {vedtakFattet ? 'Vedtak' : 'Forslag til vedtak'}
        </Heading>
        <Detail>RESULTAT</Detail>
        <Tag variant={alertType} size="small">
          {status === VilkårsResultat.JA ? 'Innvilget' : 'Avslag'}
        </Tag>
        {status === VilkårsResultat.JA && (
          <>
            <Avstand paddingBottom={6} />
            <Rad>
              <Kolonne width={VENSTREKOLONNE_BREDDE}>{`${vilkårsvurdering?.data?.sats.replace(
                'SATS_',
                'Sats '
              )}:`}</Kolonne>
              <Kolonne>
                <Etikett>{`${vilkårsvurdering?.data?.satsBeløp} kr`}</Etikett>
              </Kolonne>
            </Rad>
            <Rad>
              <Kolonne width={VENSTREKOLONNE_BREDDE}>Beløp som utbetales:</Kolonne>
              <Kolonne>
                <Etikett>{vilkårsvurdering?.data?.beløp} kr</Etikett>
              </Kolonne>
            </Rad>
            <Rad>
              <Kolonne width={VENSTREKOLONNE_BREDDE}>Utbetales til:</Kolonne>
              <Kolonne>
                <Etikett>{capitalizeName(`${sak.data.utbetalingsmottaker?.navn}`)}</Etikett>
              </Kolonne>
            </Rad>
            {sak.data.utbetalingsmottaker?.kontonummer ? (
              <Rad>
                <Kolonne width={VENSTREKOLONNE_BREDDE}>Kontonummer:</Kolonne>
                <Kolonne>
                  <Etikett>{formaterKontonummer(sak.data.utbetalingsmottaker?.kontonummer)}</Etikett>
                </Kolonne>
              </Rad>
            ) : (
              <>
                <SkjemaAlert variant="warning">
                  <Etikett>Mangler kontonummer på bruker</Etikett>
                  <Detail>
                    Personen som har søkt om tilskudd har ikke registrert et kontonummer i NAV sine systemer. Kontakt
                    vedkommende for å be dem registrere et kontonummer.
                  </Detail>
                </SkjemaAlert>
                <Avstand paddingTop={4} />
                <Button
                  variant="secondary"
                  size="small"
                  loading={loading}
                  disabled={loading}
                  onClick={(e) => {
                    e.preventDefault()
                    post('/api/utbetalingsmottaker', {
                      fnr: sak.data.utbetalingsmottaker?.fnr,
                      sakId: Number(saksnummer),
                    }).then(() => {
                      mutate()
                    })
                  }}
                >
                  Hent kontonummer på nytt
                </Button>
              </>
            )}
          </>
        )}
        {!vedtakFattet && (
          <>
            {visFritekstFelt && (
              <>
                <Avstand paddingTop={6} />
                <Textarea
                  minRows={5}
                  maxRows={20}
                  label="Beskriv hvilke opplysninger som mangler"
                  error={valideringsFeil}
                  description="Vises i brevet som en del av begrunnelsen for avslaget"
                  size="small"
                  value={fritekst}
                  onChange={(event) => onTextChange(event)}
                />
                <Container>
                  <Button
                    loading={false}
                    size="small"
                    variant="secondary"
                    onClick={() => {
                      hentForhåndsvisning(sak.data.sakId, Brevtype.BARNEBRILLER_VEDTAK)
                    }}
                  >
                    Forhåndsvis
                  </Button>
                  <Bakgrunnslagring style={{ marginLeft: 'auto' }}>
                    {lagrer && (
                      <>
                        <span>
                          <Loader size="xsmall" />
                        </span>
                        <span>
                          <Detail>Lagrer</Detail>
                        </span>
                      </>
                    )}
                  </Bakgrunnslagring>
                </Container>
              </>
            )}
            <Avstand paddingBottom={6} />
            {visAlertGodkjenning && (
              <Alert variant="info" size="small">
                {`Sendt til godkjenning ${formaterDato(sak.data.totrinnskontroll?.opprettet)}.`}
              </Alert>
            )}
            {visSendTilGodkjenning && (
              <Knappepanel>
                <Button variant="secondary" size="small" onClick={() => setValgtTab(StegType.VURDERE_VILKÅR)}>
                  Forrige
                </Button>
                <Button
                  loading={loading}
                  disabled={loading}
                  size="small"
                  variant="primary"
                  onClick={() => {
                    setSubmitAttempt(true)
                    if (valider()) {
                      sendTilGodkjenning()
                    }
                  }}
                >
                  Send til godkjenning
                </Button>
              </Knappepanel>
            )}
          </>
        )}
      </Panel>
      <VenstreKolonne>
        <BrevPanel sakId={sak.data.sakId} fullSize={true} brevtype={Brevtype.BARNEBRILLER_VEDTAK} />
      </VenstreKolonne>
    </TreKolonner>
  )
}

const Container = styled.div`
  display: flex;
  padding-top: 0.5rem;
`

const VenstreKolonne = styled(Panel)`
  border-left: 1px solid var(--a-border-default);
  padding: 0;
  margin: 0;
  height: 100%;
`

// Todo fix nullable når flytter til egen komponent
function useBrevtekst(sakId?: string, brevtype = Brevtype.BARNEBRILLER_VEDTAK) {
  const { data, isLoading } = useSWR<BrevTekst>(sakId ? `/api/sak/${sakId}/brevutkast/${brevtype}` : null)

  return {
    data,
    isLoading,
  }
}
