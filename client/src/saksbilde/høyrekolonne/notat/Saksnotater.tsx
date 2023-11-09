import { useState } from 'react'
import styled from 'styled-components'

import { TrashIcon } from '@navikt/aksel-icons'
import { BodyLong, BodyShort, Button, Heading, Label, Panel } from '@navikt/ds-react'
import { norskTimestamp } from '../../../utils/date'
import { useInnloggetSaksbehandler } from '../../../state/authentication'
import { Avstand } from '../../../felleskomponenter/Avstand'
import { SlettSaksnotatModal } from './SlettSaksnotatModal'
import { LagreSaksnotatForm } from './LagreSaksnotatForm'
import { useSaksnotater } from './useSaksnotater'

export interface SaksnotaterProps {
  sakId?: string
  lesevisning: boolean
}

export function Saksnotater(props: SaksnotaterProps) {
  const saksbehandler = useInnloggetSaksbehandler()
  const { sakId, lesevisning } = props
  const { notater, mutate, isLoading } = useSaksnotater(sakId)
  const [notatId, setNotatId] = useState(NaN)

  if (!sakId || isLoading) {
    return null
  }

  return (
    <Panel as="aside">
      <Heading level="1" size="xsmall" spacing>
        Notater
      </Heading>
      {!lesevisning && <LagreSaksnotatForm sakId={sakId} mutate={mutate} />}
      {!lesevisning && (
        <SlettSaksnotatModal sakId={sakId} notatId={notatId} mutate={mutate} onClose={() => setNotatId(NaN)} />
      )}
      <Avstand marginTop={8}>
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
                      <BodyShort size="small">{norskTimestamp(notat.opprettet)}</BodyShort>
                    </div>
                    {!lesevisning && saksbehandler.id === notat.saksbehandler.id && (
                      <Button
                        type="button"
                        size="small"
                        icon={<TrashIcon aria-label="Slett notat" />}
                        variant="tertiary-neutral"
                        onClick={() => setNotatId(notat.id)}
                      />
                    )}
                  </NotatHeader>
                  <BodyLong>{notat.innhold}</BodyLong>
                </NotatPanel>
              </li>
            ))}
          </ul>
        ) : (
          <BodyShort>Ingen notater.</BodyShort>
        )}
      </Avstand>
    </Panel>
  )
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
