import React from 'react'
import styled from 'styled-components'

import { sorterKronologisk } from '../../utils/date'

import { KolonneTittel } from '../høyrekolonne/Høyrekolonne'
import { HistorikkHendelse } from '../høyrekolonne/historikk/HistorikkHendelse'
import { useHistorikk } from '../høyrekolonne/historikk/historikkHook'

export const BrilleHistorikk: React.FC = () => {
  const { hendelser, isError, isLoading } = useHistorikk()

  if (isError) {
    return <div>Feil ved henting av historikk</div>
  }

  if (isLoading) {
    return <div>Henter historikk</div>
  }

  if (!hendelser) {
    return (
      <Oppsett>
        <KolonneTittel>HISTORIKK</KolonneTittel>
        <div>Ingen hendelser</div>
      </Oppsett>
    )
  }

  return (
    <Oppsett>
      <KolonneTittel>HISTORIKK</KolonneTittel>
      {hendelser
        .sort((a, b) => sorterKronologisk(a.opprettet, b.opprettet))
        .map((it) => (
          <HistorikkHendelse key={it.id} {...it} />
        ))}
    </Oppsett>
  )
}

export const Oppsett = styled.ul`
  padding: 0 24px;
`
