import { memo } from 'react'
import { EllipsisCell, TekstCell } from '../../felleskomponenter/table/Celle'
import { Oppgave, Sakstype } from '../../types/types.internal'
import { IkkeTildelt } from './IkkeTildelt'

interface TildelingProps {
  oppgave: Oppgave
  setKonfliktModalOpen: (val: string | undefined) => void
  onMutate: ((...args: any[]) => any) | null
}

export const Tildeling = memo(({ oppgave, setKonfliktModalOpen, onMutate }: TildelingProps) => {
  if (oppgave.saksbehandler || oppgave.kanTildeles) {
    return (
      <>
        {oppgave.saksbehandler && <EllipsisCell minLength={15} value={oppgave.saksbehandler.navn} />}
        {!oppgave.saksbehandler && oppgave.kanTildeles && (
          <IkkeTildelt
            oppgavereferanse={oppgave.sakId}
            gåTilSak={true}
            onTildelingKonflikt={() => {
              setKonfliktModalOpen(
                oppgave.sakstype !== Sakstype.TILSKUDD ? `/sak/${oppgave.sakId}/hjelpemidler` : `/sak/${oppgave.sakId}`
              )
              if (onMutate) onMutate()
            }}
          />
        )}
      </>
    )
  }
  return <TekstCell value="-" />
})
