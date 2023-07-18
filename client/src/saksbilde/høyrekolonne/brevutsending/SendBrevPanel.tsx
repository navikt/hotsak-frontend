import React, { ChangeEvent, useEffect, useState } from 'react'
import styled from 'styled-components'
import useSwr, { useSWRConfig } from 'swr'

import { Button, Detail, Heading, Loader, Panel, Radio, RadioGroup, Select, Skeleton, Textarea } from '@navikt/ds-react'

import { postBrevutkast, postBrevutsending } from '../../../io/http'

import { Avstand } from '../../../felleskomponenter/Avstand'
import { Knappepanel } from '../../../felleskomponenter/Button'
import { Brødtekst } from '../../../felleskomponenter/typografi'
import { Brevmal, BrevTekst, MålformType } from '../../../types/types.internal'
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
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const [målform, setMålform] = useState(MålformType.BOKMÅL)
  const [fritekst, setFritekst] = useState(brevtekst || '')
  const [submitAttempt, setSubmitAttempt] = useState(false)
  const [valideringsFeil, setValideringsfeil] = useState<string | undefined>(undefined)
  const debounceVentetid = 1000
  const { mutate } = useSWRConfig()

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

  function byggBrevPayload(tekst?: string): BrevTekst {
    return {
      sakId: sakId,
      målform,
      brevmal: Brevmal.BARNEBRILLER_INNHENTE_OPPLYSNINGER,
      data: {
        brevtekst: tekst ? tekst : fritekst,
      },
    }
  }

  const sendBrev = async () => {
    setSenderBrev(true)
    await postBrevutsending(byggBrevPayload())

    mutate(`/api/sak/${sakId}`)
    mutate(`/api/sak/${sakId}/dokumenter?type=${encodeURIComponent('UTGÅENDE')}`)

    setSenderBrev(false)
    setVisSendBrevModal(false)
    setSubmitAttempt(false)
    setFritekst('')
  }

  const onTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFritekst(event.target.value)
    clearTimeout(timer)

    const newTimer = setTimeout(() => {
      lagreUtkast(event.target.value)
    }, debounceVentetid)

    setTimer(newTimer)
  }

  const lagreUtkast = async (tekst: string) => {
    setLagrer(true)
    await postBrevutkast(byggBrevPayload(tekst))
    setLagrer(false)
  }

  return (
    <>
      <Panel as="aside">
        <Heading level="2" size="xsmall">
          Send brev
        </Heading>
        <Avstand paddingTop={6}>
          {lesevisning ? (
            <Brødtekst>Saken må være under behandling og du må være tildelt saken for å kunne sende brev.</Brødtekst>
          ) : (
            <form onSubmit={(e) => e.preventDefault()}>
              <Select size="small" label="Velg brevmal">
                <option value={Brevmal.BARNEBRILLER_INNHENTE_OPPLYSNINGER}>Innhente opplysninger</option>
              </Select>
              <Avstand paddingTop={6} />
              <RadioGroup
                legend="Målform"
                size="small"
                value={målform}
                onChange={(val: MålformType) => {
                  setMålform(val)
                }}
              >
                <Radio value={MålformType.BOKMÅL}>Bokmål</Radio>
                <Radio value={MålformType.NYNORSK}>Nynorsk</Radio>
              </RadioGroup>
              <Avstand paddingTop={6} />
              <Textarea
                minRows={5}
                maxRows={20}
                label="Fritekst"
                error={valideringsFeil}
                description="Beskriv hva som mangler av dokumentasjon"
                size="small"
                value={fritekst}
                onChange={(event) => onTextChange(event)}
              />
              <Bakgrunnslagring>
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
              <Knappepanel>
                <Button type="submit" size="small" variant="tertiary" onClick={() => setVisForhåndsvisningsModal(true)}>
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
        </Avstand>
        <UtgåendeBrev sakId={sakId} />
      </Panel>

      <ForhåndsvisningsModal
        open={visForhåndsvisningsModal}
        sakId={sakId}
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
    </>
  )
})

function useBrevtekst(sakId: string, brevmal = Brevmal.BARNEBRILLER_INNHENTE_OPPLYSNINGER) {
  const { data, isLoading } = useSwr<BrevTekst>(`/api/sak/${sakId}/brevutkast/${brevmal}`)

  return {
    data,
    isLoading,
  }
}

const Bakgrunnslagring = styled.div`
  display: flex;
  justify-content: right;
  vertical-align: baseline;
  gap: 0.4rem;
  padding-top: 0.5rem;
  padding-right: 0.6rem;
  height: var(--a-spacing-4);
`
