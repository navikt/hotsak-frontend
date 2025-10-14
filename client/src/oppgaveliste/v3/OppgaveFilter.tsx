import { HStack, Search } from '@navikt/ds-react'
import { type FormEventHandler } from 'react'

import { FilterChips } from '../../felleskomponenter/filter/FilterChips.tsx'
import { Oppgaveprioritet, OppgaveprioritetLabel, Oppgavetype, OppgavetypeLabel } from '../../oppgave/oppgaveTypes.ts'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'

export interface OppgaveFilterProps {
  oppgavetyper?: Oppgavetype[]
  gjelder?: string[]
  oppgaveprioritet?: Oppgaveprioritet[]
  onSøk?: FormEventHandler
}

export function OppgaveFilter(props: OppgaveFilterProps) {
  const {
    oppgavetypeFilter,
    gjelderFilter,
    oppgaveprioritetFilter,
    setOppgavetypeFilter,
    setGjelderFilter,
    setOppgaveprioritetFilter,
  } = useOppgaveFilterContext()
  const { oppgavetyper = [], gjelder = [], oppgaveprioritet = [], onSøk } = props
  return (
    <>
      {onSøk && (
        <HStack as="form" role="search" gap="2" align="center" marginBlock="5" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Search label="Søk" size="small" variant="secondary" name="søkeord" />
          </div>
        </HStack>
      )}
      <HStack gap="5">
        <div>
          <FilterChips
            options={oppgavetyper}
            labels={OppgavetypeLabel}
            selected={oppgavetypeFilter}
            handleChange={setOppgavetypeFilter}
            size="small"
            checkmark
            multiple
          />
        </div>
        <div>
          <FilterChips
            options={gjelder}
            selected={gjelderFilter}
            handleChange={setGjelderFilter}
            size="small"
            checkmark
            multiple
          />
        </div>
        <div>
          <FilterChips
            options={oppgaveprioritet}
            labels={OppgaveprioritetLabel}
            selected={oppgaveprioritetFilter}
            handleChange={setOppgaveprioritetFilter}
            size="small"
            checkmark
            multiple
          />
        </div>
      </HStack>
    </>
  )
}
