import React from 'react'

import { Search } from '@navikt/ds-react'

import { amplitude_taxonomy, logAmplitudeEvent } from '../utils/amplitude'

export const Søk: React.FC<{ onSearch: (...args: any[]) => any }> = ({ onSearch }) => {
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
        onSubmit={() => {
          logAmplitudeEvent(amplitude_taxonomy.PERSONSØK)
          onSearch(søketekst)
        }}
      />
    </form>
  )
}
