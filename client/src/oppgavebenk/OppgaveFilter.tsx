import { Box, Button, HStack, ToggleGroup } from '@navikt/ds-react'
import { FilterDropdown } from '../oppgaveliste/filter/filter'
import { OppgaveGjelderFilter, TildeltFilter } from '../types/experimentalTypes'
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
        <ToggleGroup
          label="Oppgaver"
          value={tildeltFilter}
          size="small"
          onChange={(filterValue) => {
            handleFilter(setTildeltFilter, filterValue)
          }}
          style={{ background: 'var(--a-bg-default)' }}
        >
          {Object.entries(TildeltFilter).map(([key, value]) => {
            return <ToggleGroup.Item key={key} value={value} label={SakerFilterLabel.get(value)} />
          })}
        </ToggleGroup>
        <FilterDropdown
          handleChange={(filterValue: OppgaveGjelderFilter) => {
            handleFilter(setGjelderFilter, filterValue)
          }}
          label="Gjelder"
          value={gjelderFilter}
          options={OppgavetemaLabel}
        />
        {/*<CheckboxFilter selected={['Digital søknad']} options={[...OppgavetemaLabel.keys()]} />*/}
        <Button variant="tertiary-neutral" size="small" onClick={() => clearFilters()}>
          Tilbakestill filtre
        </Button>
      </HStack>
    </Box>
  )
}

const SakerFilterLabel = new Map<string, string>([
  [TildeltFilter.ALLE, 'Enhetens oppgaver'],
  [TildeltFilter.MEG, 'Mine oppgaver'],
  [TildeltFilter.INGEN, 'Ufordelte'],
])

const OppgavetemaLabel = new Map<string, string>([
  [OppgaveGjelderFilter.ALLE, 'Alle'],
  [OppgaveGjelderFilter.BESTILLING, 'Bestilling'],
  [OppgaveGjelderFilter.DIGITAL_SØKNAD, 'Søknad'],
  [OppgaveGjelderFilter.HASTESØKNAD, 'Hastesøknad'],
])
