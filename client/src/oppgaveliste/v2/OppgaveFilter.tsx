import { HStack } from '@navikt/ds-react'
import { type FormEventHandler, useMemo } from 'react'

import { FilterChips } from '../../felleskomponenter/filter/FilterChips.tsx'
import { OppgaveprioritetLabel, OppgavetypeLabel } from '../../oppgave/oppgaveTypes.ts'
import { type OppgaveFilter, useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
import { OppgaveFilterMenu } from './OppgaveFilterMenu.tsx'
import { OppgaveTableColumnMenu } from './OppgaveTableColumnMenu.tsx'
import { type UniqueOppgaveValues } from './useUniqueOppgaveValues.ts'

export interface OppgaveFilterProps extends UniqueOppgaveValues {
  onSøk?: FormEventHandler
}

export function OppgaveFilter(props: OppgaveFilterProps) {
  const { onSøk, ...rest } = props
  const { filters } = useOppgaveFilterContext()
  const allFilters = useMemo(
    () =>
      Object.entries(filters)
        .filter(([, value]) => (value as OppgaveFilter).displayName != null)
        .map(([, value]) => {
          return value as OppgaveFilter
        }),
    [filters]
  )
  const oppgaveTableColumnMenuEnabled = false
  return (
    <>
      {onSøk && (
        <HStack as="form" role="search" gap="5" align="center" onSubmit={(e) => e.preventDefault()}>
          <div>
            <OppgaveFilterMenu filters={allFilters} />
          </div>
          {oppgaveTableColumnMenuEnabled && (
            <div>
              <OppgaveTableColumnMenu columns={[]} />
            </div>
          )}
        </HStack>
      )}
      <HStack gap="5">
        {allFilters
          .filter((filter) => filter.enabled)
          .map((filter) => (
            <div key={filter.key}>
              <FilterChips
                labels={labels[filter.key]}
                options={rest[filter.key] ?? noOptions}
                selected={filter.values}
                handleChange={filter.setValues}
                size="small"
                checkmark
                multiple
              />
            </div>
          ))}
      </HStack>
    </>
  )
}

const noOptions: string[] = []

const labels: Partial<Record<keyof UniqueOppgaveValues, Record<string, string>>> = {
  oppgavetyper: OppgavetypeLabel,
  prioriteter: OppgaveprioritetLabel,
}
