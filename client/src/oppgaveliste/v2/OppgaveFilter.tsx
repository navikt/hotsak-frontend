import { HStack, UNSAFE_Combobox } from '@navikt/ds-react'
import { type FormEventHandler, useMemo } from 'react'

import { type OppgaveFilter, useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
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
  return (
    <HStack gap="3">
      {allFilters.map((filter) => (
        <div key={filter.key} style={{ width: 225 }}>
          <OppgaveFilterCombobox filter={filter} options={rest[filter.key] ?? noOptions} />
        </div>
      ))}
    </HStack>
  )
}

function OppgaveFilterCombobox({ filter, ...rest }: { filter: OppgaveFilter; options: string[] }) {
  const options = useMemo(() => {
    return rest.options.map(toOptionFor(filter.key))
  }, [filter.key, rest.options])
  const selectedOptions = useMemo(() => {
    return filter.values.map(toOptionFor(filter.key))
  }, [filter.key, filter.values])
  return (
    <UNSAFE_Combobox
      label={filter.displayName}
      options={options}
      selectedOptions={selectedOptions}
      onToggleSelected={(option, isSelected) => {
        if (isSelected) {
          filter.setValues([option, ...filter.values])
        } else {
          filter.setValues(filter.values.filter((value) => value !== option))
        }
      }}
      size="small"
      isMultiSelect
    />
  )
}

const noOptions: string[] = []

const labels: Partial<Record<keyof UniqueOppgaveValues, Record<string, string>>> = {
  // oppgavetyper: OppgavetypeLabel,
  // prioriteter: OppgaveprioritetLabel,
}

function toOptionFor(key: keyof UniqueOppgaveValues): (value: string) => { label: string; value: string } {
  const labelByValue = labels[key]
  if (labelByValue) {
    return (value) => ({ label: labelByValue[value], value })
  }
  return (value) => ({ label: value, value })
}
