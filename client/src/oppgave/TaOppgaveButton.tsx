import { Button, ButtonProps } from '@navikt/ds-react'
import { MouseEventHandler } from 'react'

import { OppgaveId, OppgaveV2 } from './oppgaveTypes.ts'
import { useOppgaveActions } from './useOppgaveActions.ts'

export interface TaOppgaveButtonProps {
  oppgave: OppgaveV2
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  children?: string
  onOppgavetildeling?(oppgaveId: OppgaveId): void | Promise<void>
}

export function TaOppgaveButton(props: TaOppgaveButtonProps) {
  const { oppgave, size = 'small', variant = 'secondary', children = 'Ta oppgave', onOppgavetildeling } = props
  const { endreOppgavetildeling, state } = useOppgaveActions(oppgave)

  const onClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation()
    await endreOppgavetildeling({})
    if (onOppgavetildeling) {
      return onOppgavetildeling(oppgave.oppgaveId)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      name={children}
      disabled={state.loading}
      loading={state.loading}
    >
      {children}
    </Button>
  )
}
