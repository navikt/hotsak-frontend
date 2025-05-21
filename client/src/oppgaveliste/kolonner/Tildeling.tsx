import { memo } from 'react'

import { EllipsisCell, TekstCell } from '../../felleskomponenter/table/Celle.tsx'
import { Oppgave, Sakstype } from '../../types/types.internal.ts'
import { IkkeTildelt } from './IkkeTildelt.tsx'
import { lagGjeldendeOppgave } from '../../oppgave/OppgaveContext.ts'

interface TildelingProps {
  oppgave: Oppgave
  lesevisning?: boolean
  visTildelingKonfliktModalForSak: (val: string | undefined) => void
  onMutate: ((...args: any[]) => any) | null
}

export const Tildeling = memo(({ oppgave, lesevisning, visTildelingKonfliktModalForSak, onMutate }: TildelingProps) => {
  if (lesevisning) {
    return <TekstCell value="-" />
  }

  if (oppgave.saksbehandler) {
    return <EllipsisCell minLength={15} value={oppgave.saksbehandler.navn} />
  }

  if (!oppgave.saksbehandler && oppgave.kanTildeles) {
    return (
      <IkkeTildelt
        sakId={oppgave.sakId}
        gjeldendeOppgave={lagGjeldendeOppgave(oppgave.oppgaveId, oppgave.versjon, oppgave.sakId)}
        gåTilSak={true}
        onTildelingKonflikt={() => {
          visTildelingKonfliktModalForSak(
            oppgave.sakstype !== Sakstype.TILSKUDD ? `/sak/${oppgave.sakId}/hjelpemidler` : `/sak/${oppgave.sakId}`
          )
          if (onMutate) onMutate()
        }}
      />
    )
  }

  return <TekstCell value="-" />
})
