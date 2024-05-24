import { useState } from 'react'
import { Search } from '@navikt/ds-react'

import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'

export function Søk({ onSearch }: { onSearch: (...args: any[]) => any }) {
  const [søketekst, setSøketekst] = useState<string>('')

  return (
    <form
      role="search"
      onSubmit={(e) => {
        e.preventDefault()
        onSearch(søketekst)
      }}
    >
      <Search
        label="Finn bruker basert på fødselsnummer"
        size="small"
        variant="primary"
        hideLabel={true}
        onChange={(value) => {
          setSøketekst(value)
        }}
        onClear={() => setSøketekst('')}
        value={søketekst}
        onSubmit={() => {
          logAmplitudeEvent(amplitude_taxonomy.PERSONSØK)
          onSearch(søketekst)
        }}
      />
    </form>
  )
}
