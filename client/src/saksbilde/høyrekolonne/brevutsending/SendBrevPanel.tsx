import React, { useEffect, useState } from 'react'
import useSwr from 'swr'

import { Button, Heading, Panel, Radio, RadioGroup, Select, Skeleton } from '@navikt/ds-react'

import { postBrevutkast, postBrevutsending } from '../../../io/http'

import { Avstand } from '../../../felleskomponenter/Avstand'
import { Knappepanel } from '../../../felleskomponenter/Button'
import { InfoToast } from '../../../felleskomponenter/Toast'
import { Fritekst } from '../../../felleskomponenter/brev/Fritekst'
import { Brødtekst, Mellomtittel } from '../../../felleskomponenter/typografi'
import { BrevTekst, Brevtype, MålformType } from '../../../types/types.internal'
import { useBrev } from '../../barnebriller/steg/vedtak/brev/brevHook'
import { useSaksdokumenter } from '../../barnebriller/useSaksdokumenter'
import { useBrillesak } from '../../sakHook'
import { ForhåndsvisningsModal } from './ForhåndsvisningModal'
import { SendBrevModal } from './SendBrevModal'
import { UtgåendeBrev } from './UtgåendeBrev'

export interface SendBrevProps {
  sakId: string
  lesevisning: boolean
}

export const SendBrevPanel = React.memo((props: SendBrevProps) => {
  const { sakId, lesevisning } = props
  const { data } = useBrevtekst(sakId)
  const brevtekst = data?.data.brevtekst
  const [lagrer, setLagrer] = useState(false)
  const [senderBrev, setSenderBrev] = useState(false)
  const [visSendBrevModal, setVisSendBrevModal] = useState(false)
  const [visForhåndsvisningsModal, setVisForhåndsvisningsModal] = useState(false)
  const [målform, setMålform] = useState(MålformType.BOKMÅL)
  const [fritekst, setFritekst] = useState(brevtekst || '')
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [visSendtBrevToast, setVisSendtBrevToast] = useState(false)
  const [valideringsFeil, setValideringsfeil] = useState<string | undefined>(undefined)
  const { mutate: hentBrillesak } = useBrillesak()
  const { mutate: hentSaksdokumenter } = useSaksdokumenter(sakId)
  const { hentForhåndsvisning } = useBrev()
  const brevtype = Brevtype.BARNEBRILLER_INNHENTE_OPPLYSNINGER

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

  if (!data) {
    return (
      <Avstand paddingTop={6} paddingLeft={4}>
        <Heading level="2" as={Skeleton} size="small" spacing>
          Placeholder
        </Heading>
        <Skeleton variant="rectangle" width="80%" height={30} />
        <Avstand paddingTop={6} />
        <Skeleton variant="rectangle" width="80%" height={90} />
      </Avstand>
    )
  }

  function byggBrevPayload(tekst?: string, valgtMålform?: MålformType): BrevTekst {
    return {
      sakId: sakId,
      målform: valgtMålform || målform,
      brevtype,
      data: {
        brevtekst: tekst ? tekst : fritekst,
      },
    }
  }

  const sendBrev = async () => {
    setSenderBrev(true)
    await postBrevutsending(byggBrevPayload())

    setSenderBrev(false)
    setVisSendBrevModal(false)
    setSubmitAttempt(false)
    setFritekst('')
    setVisSendtBrevToast(true)
    hentBrillesak()
    hentSaksdokumenter()

    setTimeout(() => {
      setVisSendtBrevToast(false)
      hentBrillesak()
      hentSaksdokumenter()
    }, 3000)
  }

  const lagreUtkast = async (tekst: string, valgtMålform?: MålformType) => {
    setLagrer(true)
    await postBrevutkast(byggBrevPayload(tekst, valgtMålform))
    setLagrer(false)
  }

  return (
    <>
      <Panel as="aside">
        <Mellomtittel>Send brev</Mellomtittel>
        {lesevisning ? (
          <Brødtekst>Saken må være under behandling og du må være tildelt saken for å kunne sende brev.</Brødtekst>
        ) : (
          <form onSubmit={(e) => e.preventDefault()}>
            <Select size="small" label="Velg brevmal">
              <option value={brevtype}>Innhente opplysninger</option>
            </Select>
            <Avstand paddingTop={6} />
            <RadioGroup
              legend="Målform"
              size="small"
              value={målform}
              onChange={(value: MålformType) => {
                setMålform(value)
                lagreUtkast(fritekst, value)
              }}
            >
              <Radio value={MålformType.BOKMÅL}>Bokmål</Radio>
              <Radio value={MålformType.NYNORSK}>Nynorsk</Radio>
            </RadioGroup>
            <Avstand paddingTop={6} />
            <Fritekst
              label="Fritekst"
              beskrivelse="Beskriv hva som mangler av dokumentasjon"
              fritekst={fritekst}
              valideringsfeil={valideringsFeil}
              onLagre={lagreUtkast}
              lagrer={lagrer}
              onTextChange={setFritekst}
            />
            <Knappepanel>
              <Button
                type="submit"
                size="small"
                variant="tertiary"
                onClick={() => {
                  hentForhåndsvisning(sakId, brevtype)
                  setVisForhåndsvisningsModal(true)
                }}
              >
                Forhåndsvis
              </Button>
              <Button
                type="submit"
                size="small"
                variant="primary"
                onClick={() => {
                  setSubmitAttempt(true)
                  if (valider()) {
                    setVisSendBrevModal(true)
                  }
                }}
              >
                Send brev
              </Button>
            </Knappepanel>
          </form>
        )}
        <UtgåendeBrev sakId={sakId} />
      </Panel>
      <ForhåndsvisningsModal
        open={visForhåndsvisningsModal}
        sakId={sakId}
        brevtype={brevtype}
        onClose={() => {
          setVisForhåndsvisningsModal(false)
        }}
      />
      <SendBrevModal
        open={visSendBrevModal}
        loading={senderBrev}
        onClose={() => setVisSendBrevModal(false)}
        onBekreft={() => {
          sendBrev()
        }}
      />
      {visSendtBrevToast && (
        <InfoToast>Brevet er sendt. Det kan ta litt tid før det dukker opp i listen over. </InfoToast>
      )}
    </>
  )
})

function useBrevtekst(sakId: string, brevtype = Brevtype.BARNEBRILLER_INNHENTE_OPPLYSNINGER) {
  const { data, isLoading } = useSwr<BrevTekst>(`/api/sak/${sakId}/brevutkast/${brevtype}`)

  return {
    data,
    isLoading,
  }
}
