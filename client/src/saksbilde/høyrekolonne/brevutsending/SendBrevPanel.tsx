import React, { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import useSwr from 'swr'

import { Button, Detail, Heading, Loader, Panel, Select, Skeleton, Textarea } from '@navikt/ds-react'

import { postBrevutkast } from '../../../io/http'

import { Avstand } from '../../../felleskomponenter/Avstand'
import { Knappepanel } from '../../../felleskomponenter/Button'
import { BrevTekst, Brevmal } from '../../../types/types.internal'
import { ForhåndsvisningsModal } from './ForhåndsvisningModal'

export interface SendBrevProps {
  sakId: string
  lesevisning: boolean
}

export const SendBrevPanel = React.memo((props: SendBrevProps) => {
  const { sakId, lesevisning } = props
  const { data, isLoading } = useBrevtekst(sakId)
  const { register, handleSubmit, reset } = useForm<{ innhold: string }>()
  const [lagrer, setLagrer] = useState(false)
  const [senderBrev, setSenderBrev] = useState(false)
  const [lagerForhåndsvisning, setLagerForhåndsvisning] = useState(false)
  const [visForhåndsvisningsModal, setVisForhåndsvisningsModal] = useState(false)
  const [timer, setTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const [fritekst, setFritekst] = useState(data?.brevtekst || '')
  const debounceVentetid = 1000

  useEffect(() => {
    if (data?.brevtekst) {
      setFritekst(data.brevtekst)
    }
  }, [data?.brevtekst])

  if (isLoading || !sakId) {
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

  const onTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setFritekst(event.target.value)
    clearTimeout(timer)

    const newTimer = setTimeout(() => {
      lagreUtkast()
    }, debounceVentetid)

    setTimer(newTimer)
  }

  const lagreUtkast = async () => {
    const brevutkast: BrevTekst = {
      sakId: sakId,
      brevmal: Brevmal.INNHENTE_OPPLYSNINGER,
      brevtekst: fritekst,
    }

    setLagrer(true)
    await postBrevutkast(brevutkast)
    setLagrer(false)
  }

  return (
    <>
      <Panel as="aside">
        <Heading level="2" size="xsmall">
          Send brev
        </Heading>
        <Avstand paddingTop={6}>
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
              <Button type="submit" size="small" variant="primary" loading={senderBrev}>
                Send brev
              </Button>
            </Knappepanel>
          </form>
        </Avstand>
      </Panel>

      <ForhåndsvisningsModal
        open={visForhåndsvisningsModal}
        sakId={sakId}
        //loading={loading}
        onClose={() => {
          setVisForhåndsvisningsModal(false)
        }}
      />
    </>
  )
})

function useBrevtekst(sakId: string) {
  const { data, isLoading } = useSwr<BrevTekst>(`/api/sak/${sakId}/utkast`)

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
