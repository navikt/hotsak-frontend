import { Button, ButtonProps } from '@navikt/ds-react'
import { MouseEventHandler } from 'react'

import { Oppgave, OppgaveId } from './oppgaveTypes.ts'
import classes from './TaOppgaveButton.module.css'
import { useOppgaveActions } from './useOppgaveActions.ts'

export interface TaOppgaveButtonProps {
  oppgave: Oppgave
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
  children?: string
  onOppgavetildeling?(oppgaveId: OppgaveId): void | Promise<void>
}

export function TaOppgaveButton(props: TaOppgaveButtonProps) {
  const { oppgave, variant = 'secondary', size = 'small', children = 'Ta oppgave', onOppgavetildeling } = props
  const { endreOppgavetildeling } = useOppgaveActions(oppgave, false)

  const onClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation()
    await endreOppgavetildeling.trigger({})
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
      disabled={endreOppgavetildeling.isMutating}
      loading={endreOppgavetildeling.isMutating}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
