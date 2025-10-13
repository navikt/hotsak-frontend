import { Chips, HStack, Search } from '@navikt/ds-react'
import { FormEventHandler } from 'react'

export interface OppgaveFilterProps {
  søk?: boolean
}

export function OppgaveFilter(props: OppgaveFilterProps) {
  const { søk } = props
  const sok: FormEventHandler = (e) => e.preventDefault()
  return (
    <>
      {søk && (
        <HStack as="form" role="search" gap="2" align="center" onSubmit={sok} marginBlock="5">
          <div>
            <Search label="Søk" size="small" variant="secondary" />
          </div>
        </HStack>
      )}
      <HStack gap="5">
        <div>
          <Chips size="small">
            <Chips.Toggle>Journalføring</Chips.Toggle>
            <Chips.Toggle>Behandle sak</Chips.Toggle>
            <Chips.Toggle>Godkjenne vedtak</Chips.Toggle>
          </Chips>
        </div>
        <div>
          <Chips size="small">
            <Chips.Toggle>Bestilling</Chips.Toggle>
            <Chips.Toggle>Digital søknad</Chips.Toggle>
          </Chips>
        </div>
        <div>
          <Chips size="small">
            <Chips.Toggle>Lav</Chips.Toggle>
            <Chips.Toggle>Normal</Chips.Toggle>
            <Chips.Toggle>Høy</Chips.Toggle>
          </Chips>
        </div>
      </HStack>
    </>
  )
}
