import { memo, useState } from 'react'

import { EllipsisCell, TekstCell } from '../../felleskomponenter/table/Celle'
import { Oppgave, Sakstype } from '../../types/types.internal'
import { IkkeTildelt } from './IkkeTildelt'
import { TaSakKonfliktModal } from '../../saksbilde/TaSakKonfliktModal.tsx'
import { useNavigate } from 'react-router-dom'

interface TildelingProps {
  oppgave: Oppgave
  onMutate: ((...args: any[]) => any) | null
}

export const Tildeling = memo(({ oppgave, onMutate }: TildelingProps) => {
  const [konfliktModalOpen, setKonfliktModalOpen] = useState(false)
  const navigate = useNavigate()
  const onÅpneSak = () => {
    const path = oppgave.sakstype !== Sakstype.TILSKUDD ? `/sak/${oppgave.sakId}/hjelpemidler` : `/sak/${oppgave.sakId}`
    navigate(path)
  }
  if (oppgave.saksbehandler || oppgave.kanTildeles) {
    return (
      <>
        {oppgave.saksbehandler && <EllipsisCell minLength={15} value={oppgave.saksbehandler.navn} />}
        {!oppgave.saksbehandler && oppgave.kanTildeles && (
          <IkkeTildelt
            oppgavereferanse={oppgave.sakId}
            gåTilSak={true}
            onTildelingKonflikt={() => {
              setKonfliktModalOpen(true)
              if (onMutate) onMutate()
            }}
          />
        )}
        <TaSakKonfliktModal
          open={konfliktModalOpen}
          onÅpneSak={onÅpneSak}
          onClose={() => setKonfliktModalOpen(false)}
          saksbehandler={oppgave.saksbehandler}
        />
      </>
    )
  }
  return <TekstCell value="-" />
})
