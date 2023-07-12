import React, { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import useSwr, { useSWRConfig } from 'swr'

import { Alert, Button, Detail, Heading, Loader, Panel, Select, Skeleton, Textarea } from '@navikt/ds-react'

import { postBrevutkast, postBrevutsending } from '../../../io/http'

import { Avstand } from '../../../felleskomponenter/Avstand'
import { Knappepanel } from '../../../felleskomponenter/Button'
import { BrevTekst, Brevmal } from '../../../types/types.internal'
import { ForhåndsvisningsModal } from './ForhåndsvisningModal'
import { SendBrevModal } from './SendBrevModal'
import { UtgåendeBrev } from './UtgåendeBrev'

export interface SendBrevProps {
  sakId: string
  lesevisning: boolean
}

export const SendBrevPanel = React.memo((props: SendBrevProps) => {
  const { sakId, lesevisning } = props
  const { data, isLoading } = useBrevtekst(sakId)
  const brevtekst = data?.data.brevtekst
  const { register, handleSubmit, reset } = useForm<{ innhold: string }>()
  const [lagrer, setLagrer] = useState(false)
  const [senderBrev, setSenderBrev] = useState(false)
  const [visSendBrevModal, setVisSendBrevModal] = useState(false)
  const [visForhåndsvisningsModal, setVisForhåndsvisningsModal] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const [fritekst, setFritekst] = useState(brevtekst || '')
  const debounceVentetid = 1000
  const { mutate } = useSWRConfig()

  useEffect(() => {
    if (brevtekst) {
      setFritekst(brevtekst)
    }
  }, [brevtekst])

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

  //Kun sende brev hvis tatt saken og i under behandling status

  function byggBrevPayload(tekst?: string): BrevTekst {
    return {
      sakId: sakId,
      brevmal: Brevmal.INNHENTE_OPPLYSNINGER,
      data: {
        brevtekst: tekst ? tekst : fritekst,
      },
    }
  }

  const sendBrev = async () => {
    setSenderBrev(true)
    await postBrevutsending(byggBrevPayload())

    mutate(`/api/sak/${sakId}`)
    mutate(`/api/sak/${sakId}/dokumenter?type=UTGÅENDE`)

    setSenderBrev(false)
    setVisSendBrevModal(false)
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
            <Alert variant="info" size="small">
              Saken må være under behandling og du må være tildelt saken for å kunne send brev.
            </Alert>
          ) : (
            <form onSubmit={(e) => e.preventDefault()}>
              <Select size="small" label="Velg brevmal">
                <option value={Brevmal.INNHENTE_OPPLYSNINGER}>Innhente opplysninger</option>
              </Select>
              <Avstand paddingTop={6} />
              <Textarea
                minRows={5}
                maxRows={20}
                label="Fritekst"
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
                <Button type="submit" size="small" variant="primary" onClick={() => setVisSendBrevModal(true)}>
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
        //loading={loading}
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

function useBrevtekst(sakId: string) {
  const { data, isLoading } = useSwr<BrevTekst>(`/api/sak/${sakId}/brevutkast`)

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
