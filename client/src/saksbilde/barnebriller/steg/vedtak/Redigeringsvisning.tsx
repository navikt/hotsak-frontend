import { useEffect, useState } from 'react'
import styled from 'styled-components'

import { Button, Detail } from '@navikt/ds-react'

import { post, postBrevutkast } from '../../../../io/http'

import { Avstand } from '../../../../felleskomponenter/Avstand'
import { Knappepanel } from '../../../../felleskomponenter/Knappepanel'
import { SkjemaAlert } from '../../../../felleskomponenter/SkjemaAlert'
import { Fritekst } from '../../../../felleskomponenter/brev/Fritekst'
import { Etikett } from '../../../../felleskomponenter/typografi'
import {
  Barnebrillesak,
  BrevTekst,
  Brevkode,
  Brevtype,
  MålformType,
  OppgaveStatusType,
  StepType,
  VilkårsResultat,
} from '../../../../types/types.internal'
import { useManuellSaksbehandlingContext } from '../../ManuellSaksbehandlingTabContext'
import { useBrevtekst } from '../../brevutkast/useBrevtekst'
import { useSaksdokumenter } from '../../useSaksdokumenter'
import { useSamletVurdering } from '../../useSamletVurdering'
import { useBrev } from './brev/brevHook'

interface RedigeringsvisningProps {
  sak: Barnebrillesak
  mutate: (...args: any[]) => any
}

export const Redigeringsvisning: React.FC<RedigeringsvisningProps> = (props) => {
  const { sak, mutate } = props
  const { setStep } = useManuellSaksbehandlingContext()
  const [loading, setLoading] = useState(false)
  const samletVurdering = useSamletVurdering(sak)
  const [valideringsFeil, setValideringsfeil] = useState<string | undefined>(undefined)
  const { data } = useBrevtekst(sak.sakId, Brevtype.BARNEBRILLER_VEDTAK)
  const { data: utkastTilInnhenteOpplysningerBrev } = useBrevtekst(
    sak.sakId,
    Brevtype.BARNEBRILLER_INNHENTE_OPPLYSNINGER
  )
  const [lagrer, setLagrer] = useState(false)
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const brevtekst = data?.data.brevtekst
  const [fritekst, setFritekst] = useState(brevtekst || '')
  const { hentForhåndsvisning } = useBrev()

  const { data: saksdokumenter } = useSaksdokumenter(
    sak.sakId,
    samletVurdering === VilkårsResultat.OPPLYSNINGER_MANGLER
  )

  const usendtUtkastTilInnhenteOpplysningerBrev =
    utkastTilInnhenteOpplysningerBrev?.data.brevtekst && utkastTilInnhenteOpplysningerBrev?.data.brevtekst !== ''
  const etterspørreOpplysningerBrev = saksdokumenter?.find(
    (saksokument) => saksokument.brevkode === Brevkode.INNHENTE_OPPLYSNINGER_BARNEBRILLER
  )

  const etterspørreOpplysningerBrevFinnes = etterspørreOpplysningerBrev !== undefined

  const manglerPåkrevdEtterspørreOpplysningerBrev =
    samletVurdering === VilkårsResultat.OPPLYSNINGER_MANGLER &&
    !etterspørreOpplysningerBrevFinnes &&
    sak.status === OppgaveStatusType.TILDELT_SAKSBEHANDLER

  const visFritekstFelt =
    samletVurdering === VilkårsResultat.OPPLYSNINGER_MANGLER && !manglerPåkrevdEtterspørreOpplysningerBrev

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
      .catch(() => {
        setLoading(false)

        // TODO Håndtere feil her
      })
      .then(() => {
        setLoading(false)
        mutate()
      })
  }

  return (
    <>
      {visFritekstFelt && (
        <>
          <Avstand paddingTop={6} />
          <Fritekst
            label="Beskriv hvilke opplysninger som mangler"
            beskrivelse="Vises i brevet som en del av begrunnelsen for avslaget"
            valideringsfeil={valideringsFeil}
            fritekst={fritekst}
            onLagre={lagreUtkast}
            lagrer={lagrer}
            onTextChange={setFritekst}
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

      {usendtUtkastTilInnhenteOpplysningerBrev && (
        <SkjemaAlert variant="warning">
          <Detail>
            Det er laget et brev i saken som ikke er sendt ut. Gå til brev-fanen for å sende eller slette brevet.
          </Detail>
        </SkjemaAlert>
      )}

      <Avstand paddingBottom={6} />
      <Knappepanel>
        <Button variant="secondary" size="small" onClick={() => setStep(StepType.VILKÅR)}>
          Forrige
        </Button>
        {!manglerPåkrevdEtterspørreOpplysningerBrev && (
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
        )}
      </Knappepanel>
    </>
  )
}

const Container = styled.div`
  display: flex;
  padding-top: 0.5rem;
`
