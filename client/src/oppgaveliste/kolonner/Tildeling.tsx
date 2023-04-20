import React from 'react'

import { Oppgave } from '../../types/types.internal'
import { IkkeTildelt } from './IkkeTildelt'
import { Tildelt } from './Tildelt'

interface TildelingProps {
  oppgave: Oppgave
}

export const Tildeling = React.memo(({ oppgave }: TildelingProps) => {
  if (oppgave.saksbehandler) {
    return <Tildelt name={oppgave.saksbehandler.navn} />
  }
  if (oppgave.kanTildeles) {
    return <IkkeTildelt oppgavereferanse={oppgave.saksid} gåTilSak={true} />
  }
  return <>-</>
})
