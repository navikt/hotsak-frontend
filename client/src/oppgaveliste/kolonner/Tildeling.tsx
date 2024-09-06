import { memo } from 'react'

import { EllipsisCell, TekstCell } from '../../felleskomponenter/table/Celle'
import { Oppgave } from '../../types/types.internal'
import { IkkeTildelt } from './IkkeTildelt'

interface TildelingProps {
  oppgave: Oppgave
  onMutate: ((...args: any[]) => any) | null
}

export const Tildeling = memo(({ oppgave, onMutate }: TildelingProps) => {
  if (oppgave.saksbehandler) {
    return <EllipsisCell minLength={15} value={oppgave.saksbehandler.navn} />
  }
  if (oppgave.kanTildeles) {
    return <IkkeTildelt oppgavereferanse={oppgave.sakId} gåTilSak={true} onMutate={onMutate} />
  }
  return <TekstCell value="-" />
})
