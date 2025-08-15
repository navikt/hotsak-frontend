import { ChevronDownIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button, HStack } from '@navikt/ds-react'

import { Oppgavemeny } from '../oppgave/Oppgavemeny.tsx'
import { OppgaveId, Oppgavestatus } from '../oppgave/oppgaveTypes.ts'
import { Saksbehandler } from '../types/types.internal.ts'

export interface JournalføringKnappProps {
  oppgaveId: OppgaveId
  status: Oppgavestatus
  tildeltSaksbehandler?: Saksbehandler

  onMutate(...args: any[]): any
}

export function JournalføringKnapp({ onMutate }: JournalføringKnappProps) {
  // const saksbehandler = useInnloggetAnsatt()

  // const kanOvertaOppgaveStatuser = [Oppgavestatus.UNDER_BEHANDLING]

  // fixme -> bruk denne
  /*
  const kanFjerneTildeling =
    tildeltSaksbehandler && tildeltSaksbehandler.id === saksbehandler.id && status === Oppgavestatus.UNDER_BEHANDLING

  // fixme -> bruk denne
  const kanOvertaOppgave =
    tildeltSaksbehandler && tildeltSaksbehandler.id !== saksbehandler.id && kanOvertaOppgaveStatuser.includes(status)
  */

  return (
    <HStack justify="end">
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button variant="secondary" size="small" icon={<ChevronDownIcon aria-hidden />} iconPosition="right">
            Meny
          </Button>
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <Oppgavemeny onAction={onMutate} />
        </ActionMenu.Content>
      </ActionMenu>
    </HStack>
  )
}
