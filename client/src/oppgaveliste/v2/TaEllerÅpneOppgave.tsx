import { useCallback, useState } from 'react'

import { TaOppgaveButton } from '../../oppgave/TaOppgaveButton.tsx'
import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { ÅpneOppgave } from './ÅpneOppgave.tsx'

export interface TaEllerÅpneOppgaveProps {
  oppgave: OppgaveV2
  overta?: boolean
}

export function TaEllerÅpneOppgave(props: TaEllerÅpneOppgaveProps) {
  const { oppgave, overta } = props
  const [tildelt, setTildelt] = useState(false)
  const handleOppgavetildeling = useCallback(() => {
    setTildelt(true)
  }, [])
  if (tildelt) {
    return <ÅpneOppgave oppgave={oppgave} />
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
