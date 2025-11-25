import { HStack } from '@navikt/ds-react'
import { type FormEventHandler, useMemo } from 'react'

import { FilterChips } from '../../felleskomponenter/filter/FilterChips.tsx'
import { Oppgaveprioritet, OppgaveprioritetLabel, Oppgavetype, OppgavetypeLabel } from '../../oppgave/oppgaveTypes.ts'
import { type OppgaveFilter, useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
import { OppgaveFilterMenu } from './OppgaveFilterMenu.tsx'
import { OppgaveTableColumnMenu } from './OppgaveTableColumnMenu.tsx'

export interface OppgaveFilterProps {
  oppgavetyper?: Oppgavetype[]
  behandlingstemaer?: string[]
  behandlingstyper?: string[]
  mapper?: string[]
  prioriteter?: Oppgaveprioritet[]
  kommuner?: string[]
  onSøk?: FormEventHandler
}

export function OppgaveFilter(props: OppgaveFilterProps) {
  const { filters } = useOppgaveFilterContext()
  const {
    oppgavetypeFilter,
    behandlingstemaFilter,
    behandlingstypeFilter,
    mappeFilter,
    prioritetFilter,
    kommuneFilter,
  } = filters
  const {
    oppgavetyper = [],
    behandlingstemaer = [],
    behandlingstyper = [],
    mapper = [],
    prioriteter = [],
    kommuner = [],
    onSøk,
  } = props
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
        {oppgavetypeFilter.enabled && (
          <div>
            <FilterChips
              options={oppgavetyper}
              labels={OppgavetypeLabel}
              selected={oppgavetypeFilter.values}
              handleChange={oppgavetypeFilter.setValues}
              size="small"
              checkmark
              multiple
            />
          </div>
        )}
        {behandlingstemaFilter.enabled && (
          <div>
            <FilterChips
              options={behandlingstemaer}
              selected={behandlingstemaFilter.values}
              handleChange={behandlingstemaFilter.setValues}
              size="small"
              checkmark
              multiple
            />
          </div>
        )}
        {behandlingstypeFilter.enabled && (
          <div>
            <FilterChips
              options={behandlingstyper}
              selected={behandlingstypeFilter.values}
              handleChange={behandlingstypeFilter.setValues}
              size="small"
              checkmark
              multiple
            />
          </div>
        )}
        {mappeFilter.enabled && (
          <div>
            <FilterChips
              options={mapper}
              selected={mappeFilter.values}
              handleChange={mappeFilter.setValues}
              size="small"
              checkmark
              multiple
            />
          </div>
        )}
        {prioritetFilter.enabled && (
          <div>
            <FilterChips
              options={prioriteter}
              labels={OppgaveprioritetLabel}
              selected={prioritetFilter.values}
              handleChange={prioritetFilter.setValues}
              size="small"
              checkmark
              multiple
            />
          </div>
        )}
        {kommuneFilter.enabled && (
          <div>
            <FilterChips
              options={kommuner}
              selected={kommuneFilter.values}
              handleChange={kommuneFilter.setValues}
              size="small"
              checkmark
              multiple
            />
          </div>
        )}
      </HStack>
    </>
  )
}
