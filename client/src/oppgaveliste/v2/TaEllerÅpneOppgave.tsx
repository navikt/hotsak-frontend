import { useCallback, useState } from 'react'

import { Oppgavetype, type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { TaOppgaveButton } from '../../oppgave/TaOppgaveButton.tsx'
import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'
import { ÅpneOppgave } from './ÅpneOppgave.tsx'

export interface TaEllerÅpneOppgaveProps {
  oppgave: OppgaveV2
  overta?: boolean
}

export function TaEllerÅpneOppgave(props: TaEllerÅpneOppgaveProps) {
  const { oppgave, overta } = props
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
  return (
    <TaOppgaveButton
      oppgave={oppgave}
      variant="tertiary"
      size="xsmall"
      overta={overta}
      onOppgavetildeling={handleOppgavetildeling}
    >
      {overta ? 'Overta oppgave' : 'Ta oppgave'}
    </TaOppgaveButton>
  )
}
