import { memo } from 'react'

import { EllipsisCell, TekstCell } from '../../felleskomponenter/table/Celle.tsx'
import { Sakstype } from '../../types/types.internal.ts'
import { IkkeTildelt } from './IkkeTildelt.tsx'
import type { Oppgave } from '../../oppgave/oppgaveTypes.ts'

export interface TildelingProps {
  oppgave: Oppgave
  lesevisning?: boolean
  visTildelingKonfliktModalForOppgave(value: string | undefined): void
  onMutate?(...args: any[]): any
}

export const Tildeling = memo((props: TildelingProps) => {
  const { oppgave, lesevisning, visTildelingKonfliktModalForOppgave, onMutate } = props
  if (lesevisning) {
    return <TekstCell value="-" />
  }

  if (oppgave.saksbehandler) {
    return <EllipsisCell minLength={15} value={oppgave.saksbehandler.navn} />
  }

  if (!oppgave.saksbehandler && oppgave.kanTildeles) {
    return (
      <IkkeTildelt
        onTildelingKonflikt={() => {
          visTildelingKonfliktModalForOppgave(
            oppgave.sakstype === Sakstype.TILSKUDD
              ? `/oppgave/${oppgave.oppgaveId}`
              : `/oppgave/${oppgave.oppgaveId}/hjelpemidler`
          )
          if (onMutate) onMutate()
        }}
      />
    )
  }

  return <TekstCell value="-" />
})
