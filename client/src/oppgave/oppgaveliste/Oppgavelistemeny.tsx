import { MenuElipsisVerticalIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'

import { Oppgavemeny } from '../Oppgavemeny.tsx'
import { OppgaveV2 } from '../oppgaveTypes.ts'

export interface OppgavelistemenyProps {
  oppgave: OppgaveV2
}

export function Oppgavelistemeny(props: OppgavelistemenyProps) {
  const { oppgave } = props
  const onMutate = () => {}
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <Button
          variant="tertiary-neutral"
          size="xsmall"
          icon={<MenuElipsisVerticalIcon title="Oppgavemeny" />}
          onClick={(event) => {
            event.stopPropagation()
          }}
        />
      </ActionMenu.Trigger>
      <ActionMenu.Content>
        <Oppgavemeny oppgave={oppgave} onAction={onMutate} />
      </ActionMenu.Content>
    </ActionMenu>
  )
}
