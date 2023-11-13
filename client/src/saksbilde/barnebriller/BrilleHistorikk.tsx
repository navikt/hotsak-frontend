import React from 'react'

import { sorterKronologisk } from '../../utils/date'
import { HistorikkHendelse } from '../høyrekolonne/historikk/HistorikkHendelse'
import { useHistorikk } from '../høyrekolonne/historikk/historikkHook'
import { Mellomtittel } from '../../felleskomponenter/typografi'
import { BodyShort, Panel } from '@navikt/ds-react'

export const BrilleHistorikk: React.FC = () => {
  const { hendelser, isError, isLoading } = useHistorikk()

  if (isError) {
    return <div>Feil ved henting av historikk.</div>
  }

  if (isLoading) {
    return <div>Henter historikk...</div>
  }

  if (!hendelser) {
    return (
      <Panel as="aside">
        <Mellomtittel>Historikk</Mellomtittel>
        <BodyShort size="small">Ingen hendelser.</BodyShort>
      </Panel>
    )
  }

  return (
    <Panel as="aside">
      <Mellomtittel>Historikk</Mellomtittel>
      <ul>
        {hendelser
          .sort((a, b) => sorterKronologisk(a.opprettet, b.opprettet))
          .map((it) => (
            <HistorikkHendelse key={it.id} {...it} />
          ))}
      </ul>
    </Panel>
  )
}
