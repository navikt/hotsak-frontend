import React from 'react'

import { Oppgave } from '../../types/types.internal'
import { IkkeTildelt } from './IkkeTildelt'
import { Tildelt } from './Tildelt'
import { EllipsisCell, TekstCell } from '../../felleskomponenter/table/Celle'

interface TildelingProps {
  oppgave: Oppgave
}

export const Tildeling = React.memo(({ oppgave }: TildelingProps) => {
  if (oppgave.saksbehandler) {
    return <EllipsisCell minLength={15} value={oppgave.saksbehandler.navn} />
  }
  if (oppgave.kanTildeles) {
    return <IkkeTildelt oppgavereferanse={oppgave.sakId} gåTilSak={true} />
  }
  return <TekstCell value="-" />
})
