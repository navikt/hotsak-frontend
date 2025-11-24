import { HStack, Search } from '@navikt/ds-react'
import { type FormEventHandler } from 'react'

import { FilterChips } from '../../felleskomponenter/filter/FilterChips.tsx'
import {
  OppgaveGjelderFilterLabel,
  Oppgaveprioritet,
  OppgaveprioritetLabel,
  Oppgavetype,
  OppgavetypeLabel,
} from '../../oppgave/oppgaveTypes.ts'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
import { OppgaveFilterMenu } from './OppgaveFilterMenu.tsx'
import { OppgaveTableColumnMenu } from './OppgaveTableColumnMenu.tsx'

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
        <HStack as="form" role="search" gap="5" align="center" onSubmit={(e) => e.preventDefault()}>
          <div>
            <Search label="Søk" size="small" variant="secondary" name="søkeord" />
          </div>
          <div>
            <OppgaveFilterMenu filters={[]} />
          </div>
          <div>
            <OppgaveTableColumnMenu columns={[]} />
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
            labels={OppgaveGjelderFilterLabel}
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
