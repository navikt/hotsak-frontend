import dayjs from 'dayjs'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styled from 'styled-components'
import useSwr from 'swr'

import { FloppydiskIcon, TrashIcon } from '@navikt/aksel-icons'
import { BodyLong, Button, Heading, Label, Panel, Textarea } from '@navikt/ds-react'

import { postSaksnotat, slettSaksnotat } from '../../../io/http'
import { norskTimestamp } from '../../../utils/date'

import { Knappepanel } from '../../../felleskomponenter/Button'
import { useInnloggetSaksbehandler } from '../../../state/authentication'
import { Notat } from '../../../types/types.internal'

export interface SaksnotaterProps {
  sakId?: string
  lesemodus: boolean
}

export function Saksnotater(props: SaksnotaterProps) {
  const saksbehandler = useInnloggetSaksbehandler()
  const { sakId, lesemodus } = props
  const { notater, mutate, isLoading } = useSaksnotater(sakId)
  const { register, handleSubmit, reset } = useForm<{ innhold: string }>()
  const [lagrer, setLagrer] = useState(false)
  const [sletter, setSletter] = useState(NaN)

  if (!sakId || isLoading) {
    return null
  }

  const slettNotat = async (notatId: number) => {
    if (confirm('Er du sikker på at du vil slette notatet?')) {
      setSletter(notatId)
      await slettSaksnotat(sakId, notatId)
      await mutate()
      setSletter(NaN)
    }
  }

  const lagreNotat = handleSubmit(async ({ innhold }) => {
    const nyttNotat: Notat = {
      id: Math.random(),
      sakId,
      saksbehandler,
      type: 'INTERNT',
      innhold,
      opprettet: dayjs().toISOString(),
    }
    setLagrer(true)
    await postSaksnotat(nyttNotat.sakId, nyttNotat.type, nyttNotat.innhold)
    await mutate()
    reset({ innhold: '' })
    setLagrer(false)
  })

  return (
    <Panel as="aside">
      <Heading level="2" size="xsmall">
        Notater
      </Heading>
      {notater.length ? (
        <ul>
          {notater.map((notat) => (
            <li key={notat.id || notat.opprettet}>
              <NotatPanel border>
                <NotatHeader>
                  <div>
                    <Label as="div" size="small">
                      {notat.saksbehandler.navn}
                    </Label>
                    <div>{norskTimestamp(notat.opprettet)}</div>
                  </div>
                  {!lesemodus && saksbehandler.id === notat.saksbehandler.id && (
                    <Button
                      type="button"
                      size="small"
                      icon={<TrashIcon aria-label="Slett notat" />}
                      variant="tertiary-neutral"
                      onClick={() => slettNotat(notat.id)}
                      loading={notat.id === sletter}
                    />
                  )}
                </NotatHeader>
                <BodyLong>{notat.innhold}</BodyLong>
              </NotatPanel>
            </li>
          ))}
        </ul>
      ) : (
        <BodyLong spacing>Ingen</BodyLong>
      )}
      {!lesemodus && (
        <form onSubmit={lagreNotat}>
          <Textarea label="Nytt notat" defaultValue="" {...register('innhold', { required: true })} />
          <Knappepanel>
            <Button type="submit" size="small" variant="secondary-neutral" loading={lagrer} icon={<FloppydiskIcon />}>
              Lagre
            </Button>
          </Knappepanel>
        </form>
      )}
    </Panel>
  )
}

function useSaksnotater(sakId?: string) {
  const { data: notater = [], mutate, isLoading } = useSwr<Notat[]>(sakId ? `/api/sak/${sakId}/notater` : null)
  return {
    notater,
    mutate,
    isLoading,
  }
}

const NotatPanel = styled(Panel)`
  margin: var(--a-spacing-3) 0;
  background-color: var(--a-orange-50);
  border-color: var(--a-orange-100);
`

const NotatHeader = styled.header`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--a-spacing-3);
`
