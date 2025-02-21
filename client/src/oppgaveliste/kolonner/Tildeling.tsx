import { memo } from 'react'

import { EllipsisCell, TekstCell } from '../../felleskomponenter/table/Celle'
import { Oppgave, OppgaveVersjon, Sakstype } from '../../types/types.internal'
import { IkkeTildelt } from './IkkeTildelt'

interface TildelingProps {
  oppgave: Oppgave
  lesevisning?: boolean
  oppgaveVersjon?: OppgaveVersjon
  visTildelingKonfliktModalForSak: (val: string | undefined) => void
  onMutate: ((...args: any[]) => any) | null
}

export const Tildeling = memo(
  ({ oppgave, lesevisning, oppgaveVersjon, visTildelingKonfliktModalForSak, onMutate }: TildelingProps) => {
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
          oppgaveVersjon={oppgaveVersjon}
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
  }
)
