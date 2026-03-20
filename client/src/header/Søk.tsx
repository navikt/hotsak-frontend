import { useState } from 'react'
import { Search } from '@navikt/ds-react'

import classes from './Søk.module.css'

export function Søk({ onSearch }: { onSearch: (value: string) => void }) {
  const [søketekst, setSøketekst] = useState<string>('')

  return (
    <form
      role="search"
      className={classes.root}
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
          onSearch(søketekst)
        }}
      />
    </form>
  )
}
