import { useState } from 'react'
import styled from 'styled-components'

import { TrashIcon } from '@navikt/aksel-icons'
import { BodyLong, BodyShort, Button, Detail, Label, Panel } from '@navikt/ds-react'
import { formaterTidsstempel } from '../../../utils/dato'
import { useInnloggetSaksbehandler } from '../../../state/authentication'
import { Avstand } from '../../../felleskomponenter/Avstand'
import { SlettSaksnotatModal } from './SlettSaksnotatModal'
import { LagreSaksnotatForm } from './LagreSaksnotatForm'
import { useSaksnotater } from './useSaksnotater'
import { Mellomtittel } from '../../../felleskomponenter/typografi'

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
      <Mellomtittel>Notater</Mellomtittel>
      {!lesevisning && <LagreSaksnotatForm sakId={sakId} mutate={mutate} />}
      {!lesevisning && (
        <SlettSaksnotatModal sakId={sakId} notatId={notatId} mutate={mutate} onClose={() => setNotatId(NaN)} />
      )}
      <Avstand marginTop={lesevisning ? 0 : 8}>
        {notater.length ? (
          <ul title="Notater">
            {notater.map((notat) => (
              <li key={notat.id || notat.opprettet}>
                <NotatPanel border>
                  <NotatHeader>
                    <div>
                      <Label as="h2" size="small">
                        {notat.saksbehandler.navn}
                      </Label>
                      <Detail>{formaterTidsstempel(notat.opprettet)}</Detail>
                    </div>
                    {!lesevisning && saksbehandler.id === notat.saksbehandler.id && (
                      <Button
                        type="button"
                        size="small"
                        icon={<TrashIcon title="Slett notat" />}
                        variant="tertiary-neutral"
                        onClick={() => setNotatId(notat.id)}
                      />
                    )}
                  </NotatHeader>
                  <BodyLong size="small">{notat.innhold}</BodyLong>
                </NotatPanel>
              </li>
            ))}
          </ul>
        ) : (
          <BodyShort size="small">Ingen saksnotater.</BodyShort>
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
  margin-bottom: var(--a-spacing-2);
`
