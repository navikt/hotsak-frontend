import React from 'react'

import { sorterKronologisk } from '../../../utils/date'

import { KolonneOppsett, KolonneTittel } from '../Høyrekolonne'
import { HistorikkHendelse } from './HistorikkHendelse'
import { useHistorikk } from './historikkHook'

export const Historikk: React.VFC = () => {
  const { hendelser, isError, isLoading } = useHistorikk()

  if (isError) {
    return <div>Feil ved henting av historikk</div>
  }

  if (isLoading) {
    return <div>Henter sakshistorikk</div>
  }

  if (!hendelser) {
    return <div>Ingen hendelser</div>
  }

  return (
    <KolonneOppsett>
      <KolonneTittel>HISTORIKK</KolonneTittel>
      {hendelser
        .sort((a, b) => sorterKronologisk(a.opprettet, b.opprettet))
        .map((it) => (
          <HistorikkHendelse key={it.id} {...it} />
        ))}
    </KolonneOppsett>
  )
}
