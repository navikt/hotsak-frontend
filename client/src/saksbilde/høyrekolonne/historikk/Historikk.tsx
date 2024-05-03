import React from 'react'

import { sorterKronologisk } from '../../../utils/dato'

import { KolonneOppsett, KolonneTittel } from '../Høyrekolonne'
import { HistorikkHendelse } from './HistorikkHendelse'
import { useHistorikk } from './useHistorikk'

export const Historikk: React.FC = () => {
  const { hendelser, isError, isLoading } = useHistorikk()

  if (isError) {
    return <div>Feil ved henting av historikk</div>
  }

  if (isLoading) {
    return <div>Henter historikk</div>
  }

  if (!hendelser) {
    return (
      <KolonneOppsett>
        <KolonneTittel>HISTORIKK</KolonneTittel>
        <div>Ingen hendelser</div>
      </KolonneOppsett>
    )
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
