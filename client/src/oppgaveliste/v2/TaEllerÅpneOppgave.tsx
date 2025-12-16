import { useCallback, useState } from 'react'

import { TaOppgaveButton } from '../../oppgave/TaOppgaveButton.tsx'
import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { ÅpneOppgave } from './ÅpneOppgave.tsx'

export interface TaEllerÅpneOppgaveProps {
  oppgave: OppgaveV2
}

export function TaEllerÅpneOppgave(props: TaEllerÅpneOppgaveProps) {
  const { oppgave } = props
  const [tildelt, setTildelt] = useState(false)
  const handleOppgavetildeling = useCallback(() => {
    setTildelt(true)
  }, [])
  if (tildelt) {
    return <ÅpneOppgave oppgave={oppgave} />
  }
  return (
    <TaOppgaveButton size="xsmall" variant="tertiary" oppgave={oppgave} onOppgavetildeling={handleOppgavetildeling}>
      Ta oppgave
    </TaOppgaveButton>
  )
}
