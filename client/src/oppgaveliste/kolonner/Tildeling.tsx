import React from 'react'

import { Oppgave } from '../../types/types.internal'
import { IkkeTildelt } from './IkkeTildelt'
import { Tildelt } from './Tildelt'

interface TildelingProps {
  oppgave: Oppgave
}

export const Tildeling = React.memo(({ oppgave }: TildelingProps) =>
  oppgave.saksbehandler ? (
    <Tildelt name={oppgave.saksbehandler.navn} saksid={oppgave.saksId} />
  ) : (
    <IkkeTildelt oppgavereferanse={oppgave.saksId} gåTilSak={true} />
  )
)
