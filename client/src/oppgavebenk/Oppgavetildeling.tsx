import React from 'react'

import { OppgaveV2, Oppgavetype } from '../types/types.internal'
import { EllipsisCell } from '../felleskomponenter/table/Celle'
import { OppgaveIkkeTildelt } from './OppgaveIkkeTildelt'

interface OppgavetildelingProps {
  oppgave: OppgaveV2
}

export const Oppgavetildeling = React.memo(({ oppgave }: OppgavetildelingProps) => {
  if (oppgave.saksbehandler) {
    return <EllipsisCell minLength={15} value={oppgave.saksbehandler.navn} />
  } /*if(oppgave.kanTildeles) TODO vurder om dette feltet skal være med i ny oppgavemodell eller om vi skal lage annen logikk for å utlede dette */ else {
    // TODO. Skal vi kanskje heller rute til oppgaveid og la et felles oppgavebilde orkestrere hvilke visning som skal vises basert på oppgavetype
    return (
      <OppgaveIkkeTildelt
        oppgavereferanse={
          (oppgave.oppgavetype === Oppgavetype.JOURNALFØRING ? oppgave.journalpostId : oppgave.sakId) || ''
        }
        gåTilSak={true}
      />
    )
  }
  //return <>-</>
})
