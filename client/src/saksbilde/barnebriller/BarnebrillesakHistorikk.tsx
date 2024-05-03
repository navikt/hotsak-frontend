import React from 'react'

import { sorterKronologisk } from '../../utils/dato'
import { HistorikkHendelse } from '../høyrekolonne/historikk/HistorikkHendelse'
import { useHistorikk } from '../høyrekolonne/historikk/useHistorikk'
import { Mellomtittel } from '../../felleskomponenter/typografi'
import { BodyShort, Panel } from '@navikt/ds-react'

export function BarnebrillesakHistorikk() {
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
