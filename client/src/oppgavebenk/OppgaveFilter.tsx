import { Box, Button, HStack } from '@navikt/ds-react'
import { FilterChips, FilterToggleGroup } from '../oppgaveliste/filter/filter'
import { OppgaveFilterType, OppgaveGjelderFilter, TildeltFilter } from '../types/experimentalTypes'
import { useFilterContext } from './FilterContext'

export function Oppgavefilter() {
  const { setCurrentPage, gjelderFilter, setGjelderFilter, tildeltFilter, setTildeltFilter, clearFilters } =
    useFilterContext()

  const handleFilter = (handler: (...args: any[]) => any, value: OppgaveGjelderFilter | string) => {
    handler(value)
    setCurrentPage(1)
  }

  return (
    <Box
      marginInline="4"
      marginBlock="4"
      padding="4"
      background="surface-subtle"
      borderWidth="1"
      borderColor="border-subtle"
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
    </Box>
  )
}

const tildeltFilterOptions = [
  { key: TildeltFilter.ALLE, label: 'Enhetens oppgaver' },
  { key: TildeltFilter.MEG, label: 'Mine oppgaver' },
  { key: TildeltFilter.INGEN, label: 'Ufordelte' },
]

const oppgavetema: OppgaveFilterType[] = [
  { key: OppgaveGjelderFilter.BESTILLING, label: 'Bestilling' },
  { key: OppgaveGjelderFilter.DIGITAL_SØKNAD, label: 'Søknad' },
  { key: OppgaveGjelderFilter.HASTESØKNAD, label: 'Hastesøknad' },
]
