import { ChangeEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import useSWR from 'swr'

import { Button, Detail, Loader, Textarea } from '@navikt/ds-react'

import { post, postBrevutkast } from '../../../../io/http'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Knappepanel } from '../../../../felleskomponenter/Button'
import { SkjemaAlert } from '../../../../felleskomponenter/SkjemaAlert'
import { Bakgrunnslagring } from '../../../../felleskomponenter/brev/Bakgrunnslagring'
import { Etikett } from '../../../../felleskomponenter/typografi'
import {
  Barnebrillesak,
  BrevTekst,
  Brevkode,
  Brevtype,
  MålformType,
  OppgaveStatusType,
  StegType,
  VilkårsResultat,
} from '../../../../types/types.internal'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { useSaksdokumenter } from '../../useSaksdokumenter'
import { useSamletVurdering } from '../../useSamletVurdering'
import { useBrev } from './brev/brevHook'

interface RedigeringsvisningProps {
  sak: Barnebrillesak
  mutate: (...args: any[]) => any
}

export const Redigeringsvisning: React.FC<RedigeringsvisningProps> = (props) => {
  const { sak, mutate } = props
  const { setValgtTab } = useManuellSaksbehandlingContext()
  const [loading, setLoading] = useState(false)
  const samletVurdering = useSamletVurdering(sak)
  const [valideringsFeil, setValideringsfeil] = useState<string | undefined>(undefined)
  const { data } = useBrevtekst(sak.sakId)
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const [lagrer, setLagrer] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const brevtekst = data?.data.brevtekst
  const [fritekst, setFritekst] = useState(brevtekst || '')
  const { hentForhåndsvisning } = useBrev()

  const debounceVentetid = 1000

  const { data: saksdokumenter, isLoading: henterSaksdokumenter } = useSaksdokumenter(
    sak.sakId,
    samletVurdering === VilkårsResultat.OPPLYSNINGER_MANGLER
  )

  const etterspørreOpplysningerBrev = saksdokumenter?.find(
    (saksokument) => saksokument.brevkode === Brevkode.INNHENTE_OPPLYSNINGER_BARNEBRILLER
  )

  const etterspørreOpplysningerBrevFinnes = etterspørreOpplysningerBrev !== undefined

  const manglerPåkrevdEtterspørreOpplysningerBrev =
    samletVurdering === VilkårsResultat.OPPLYSNINGER_MANGLER &&
    !etterspørreOpplysningerBrevFinnes &&
    sak.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER

  const visFritekstFelt =
    samletVurdering === VilkårsResultat.OPPLYSNINGER_MANGLER &&
    //visSendTilGodkjenning &&
    !manglerPåkrevdEtterspørreOpplysningerBrev //&&
  //sak.data.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER

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

  const lagreUtkast = async (tekst: string) => {
    setLagrer(true)
    await postBrevutkast(byggBrevPayload(tekst))
    setLagrer(false)
  }

  function byggBrevPayload(tekst?: string): BrevTekst {
    return {
      sakId: sak.sakId,
      målform: sak?.vilkårsgrunnlag?.målform || MålformType.BOKMÅL,
      brevtype: Brevtype.BARNEBRILLER_VEDTAK,
      data: {
        brevtekst: tekst ? tekst : fritekst,
      },
    }
  }

  const valider = () => {
    if (fritekst === '') {
      setValideringsfeil('Du kan ikke sende brevet uten å ha lagt til tekst')
      return false
    } else {
      setValideringsfeil(undefined)
      return true
    }
  }

  const sendTilGodkjenning = () => {
    setLoading(true)
    post(`/api/sak/${sak.sakId}/kontroll`, {})
      .catch((e) => {
        setLoading(false)

        // TODO Håndtere feil her
      })
      .then(() => {
        setLoading(false)
        mutate()
      })
  }

  const onTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFritekst(event.target.value)
    clearTimeout(timer)

    const newTimer = setTimeout(() => {
      lagreUtkast(event.target.value)
    }, debounceVentetid)

    setTimer(newTimer)
  }
  return (
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
                hentForhåndsvisning(sak.sakId, Brevtype.BARNEBRILLER_VEDTAK)
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
      {manglerPåkrevdEtterspørreOpplysningerBrev && (
        <SkjemaAlert variant="warning">
          <Etikett>Mangler innhente opplysninger brev</Etikett>
          <Detail>
            Det er ikke sendt ut brev for å innhente manglende opplysninger i denne saken. Du kan ikke avslå en sak på
            grunn av manglende opplysninger før det er sendt brev til bruker for å innhenter manglende opplysninger og
            bruker ikke har sendt inn dette før fristen på 3 uker.
          </Detail>
        </SkjemaAlert>
      )}
      <Avstand paddingBottom={6} />
      {/*visAlertGodkjenning && (
            <Alert variant="info" size="small">
              {`Sendt til godkjenning ${formaterDato(sak.data.totrinnskontroll?.opprettet)}.`}
            </Alert>
          )*/}
      {
        /*visSendTilGodkjenning && */ !manglerPåkrevdEtterspørreOpplysningerBrev && (
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
                if (!visFritekstFelt || valider()) {
                  sendTilGodkjenning()
                }
              }}
            >
              Send til godkjenning
            </Button>
          </Knappepanel>
        )
      }
    </>
  )
}

const Container = styled.div`
  display: flex;
  padding-top: 0.5rem;
`

// Todo fix nullable når flytter til egen komponent
function useBrevtekst(sakId?: string, brevtype = Brevtype.BARNEBRILLER_VEDTAK) {
  const { data, isLoading } = useSWR<BrevTekst>(sakId ? `/api/sak/${sakId}/brevutkast/${brevtype}` : null)

  return {
    data,
    isLoading,
  }
}
