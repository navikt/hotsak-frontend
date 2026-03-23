import { useCallback, useState } from 'react'

import { type Oppgave, Oppgavetype } from '../oppgave/oppgaveTypes.ts'
import { TaOppgaveButton } from '../oppgave/TaOppgaveButton.tsx'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { ÅpneOppgave } from './ÅpneOppgave.tsx'

export interface TaEllerÅpneOppgaveProps {
  oppgave: Oppgave
}

export function TaEllerÅpneOppgave(props: TaEllerÅpneOppgaveProps) {
  const { oppgave } = props
  const { id: saksbehandlerId } = useInnloggetAnsatt()
  const [tildelt, setTildelt] = useState(false)
  const handleOppgavetildeling = useCallback(() => {
    setTildelt(true)
  }, [])
  if (tildelt) {
    return <ÅpneOppgave oppgave={oppgave} />
  }
  const { kategorisering, totrinnskontroll } = oppgave
  // kan ikke godkjenne egen sak
  if (
    kategorisering.oppgavetype === Oppgavetype.GODKJENNE_VEDTAK &&
    totrinnskontroll?.saksbehandlerId === saksbehandlerId
  ) {
    return <>-</>
  }

  const tildeltSaksbehandlerId = oppgave.tildeltSaksbehandler?.id
  return (
    <TaOppgaveButton oppgave={oppgave} variant="tertiary" size="xsmall" onOppgavetildeling={handleOppgavetildeling}>
      {tildeltSaksbehandlerId != null && tildeltSaksbehandlerId !== saksbehandlerId ? 'Overta' : 'Ta oppgaven'}
    </TaOppgaveButton>
  )
}
