import { Box, Button, HStack } from '@navikt/ds-react'

import { FilterChips } from '../../felleskomponenter/filter/FilterChips.tsx'
import { FilterToggleGroup } from '../../felleskomponenter/filter/FilterToggleGroup.tsx'
import type { FilterOption } from '../../felleskomponenter/filter/filterTypes.ts'
import { OppgaveGjelderFilter, OppgaveTildeltFilter } from '../../oppgave/oppgaveTypes.ts'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'

export function Oppgavefilter() {
  const { setCurrentPage, gjelderFilter, setGjelderFilter, tildeltFilter, setTildeltFilter, clearFilters } =
    useOppgaveFilterContext()

  const handleFilter = (handler: (...args: any[]) => any, value: OppgaveGjelderFilter | string) => {
    handler(value)
    setCurrentPage(1)
  }

  return (
    <Box.New
      marginInline="4"
      marginBlock="4"
      padding="4"
      background="neutral-soft"
      borderWidth="1"
      borderColor="neutral-subtle"
    >
      <HStack gap="4" align="end">
        <FilterToggleGroup
          label="Oppgaver"
          value={tildeltFilter}
          handleChange={(filterValue) => {
            handleFilter(setTildeltFilter, filterValue)
          }}
          options={tildeltFilterOptions}
        />
        <FilterChips
          label="Gjelder"
          selected={gjelderFilter}
          options={oppgavetema}
          handleChange={(filterValue) => {
            handleFilter(setGjelderFilter, filterValue)
          }}
        />
        <Button variant="tertiary-neutral" size="small" onClick={() => clearFilters()}>
          Tilbakestill filtre
        </Button>
      </HStack>
    </Box.New>
  )
}

const tildeltFilterOptions = [
  { key: OppgaveTildeltFilter.ALLE, label: 'Enhetens oppgaver' },
  { key: OppgaveTildeltFilter.MEG, label: 'Mine oppgaver' },
  { key: OppgaveTildeltFilter.INGEN, label: 'Ufordelte' },
]

const oppgavetema: FilterOption[] = [
  { key: OppgaveGjelderFilter.BESTILLING, label: 'Bestilling' },
  { key: OppgaveGjelderFilter.DIGITAL_SØKNAD, label: 'Søknad' },
  { key: OppgaveGjelderFilter.HASTESØKNAD, label: 'Hastesøknad' },
]
