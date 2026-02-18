import { Button, ButtonProps } from '@navikt/ds-react'
import { MouseEventHandler } from 'react'

import { Oppgave, OppgaveId } from './oppgaveTypes.ts'
import classes from './TaOppgaveButton.module.css'
import { useOppgaveActions } from './useOppgaveActions.ts'

export interface TaOppgaveButtonProps {
  oppgave: Oppgave
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  overta?: boolean
  children?: string
  onOppgavetildeling?(oppgaveId: OppgaveId): void | Promise<void>
}

export function TaOppgaveButton(props: TaOppgaveButtonProps) {
  const { oppgave, variant = 'secondary', size = 'small', overta, children = 'Ta oppgave', onOppgavetildeling } = props
  const { endreOppgavetildeling, state } = useOppgaveActions(oppgave)

  const onClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation()
    await endreOppgavetildeling({ overtaHvisTildelt: overta })
    if (onOppgavetildeling) {
      return onOppgavetildeling(oppgave.oppgaveId)
    }
  }

  return (
    <Button
      className={classes.root}
      type="button"
      name={children}
      variant={variant}
      size={size}
      disabled={state.loading}
      loading={state.loading}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
