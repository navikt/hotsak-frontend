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
    if (lesevisning || oppgave.saksbehandler?.id === null) {
      return <TekstCell value="-" />
    }

    return (
      <>
        {oppgave.saksbehandler && <EllipsisCell minLength={15} value={oppgave.saksbehandler.navn} />}
        {!oppgave.saksbehandler && oppgave.kanTildeles && (
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
        )}
      </>
    )
  }
)
