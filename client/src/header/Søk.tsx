import React from 'react'

import { Search } from '@navikt/ds-react'

export const Søk = ({ onSearch }: { onSearch: Function }) => {
  const [søketekst, setSøketekst] = React.useState<string>('')

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
        onSearch={() => {
          onSearch(søketekst)
        }}
      />
    </form>
  )
}
