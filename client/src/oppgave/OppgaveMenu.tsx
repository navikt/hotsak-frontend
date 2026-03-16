import { ActionMenu } from '@navikt/ds-react'
import { type ReactNode } from 'react'

import { Oppgave, Oppgavetype } from './oppgaveTypes.ts'
import { useOppgaveActions } from './useOppgaveActions.ts'
import { useOppgaveregler } from './useOppgaveregler.ts'
import { OppgaveModalType, useOppgaveÅpneModalHandler } from './OppgaveContext.ts'
import { Eksperiment } from '../felleskomponenter/Eksperiment.tsx'
import { useSakActions } from '../saksbilde/useSakActions.ts'

export interface OppgaveMenuProps {
  oppgave?: Oppgave
  onAction?(): unknown | Promise<unknown>
}

export function OppgaveMenu(props: OppgaveMenuProps) {
  const { oppgave, onAction } = props
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt, oppgaveErPåVent, gjeldendeEnhet } = useOppgaveregler(oppgave)
  const { fjernOppgavetildeling } = useOppgaveActions(oppgave)
  const { fortsettBehandling } = useSakActions()

  if (!(oppgave && oppgaveErUnderBehandlingAvInnloggetAnsatt)) {
    return null
  }

  const isJournalføring = oppgave.kategorisering.oppgavetype === Oppgavetype.JOURNALFØRING
  return (
    <ActionMenu.Group label="Oppgave">
      {!isJournalføring && oppgaveErUnderBehandlingAvInnloggetAnsatt && oppgaveErPåVent && (
        <ActionMenu.Item
          onSelect={async (event) => {
            event.stopPropagation()
            await fortsettBehandling()
            if (onAction) return onAction()
          }}
        >
          Fortsett behandling
        </ActionMenu.Item>
      )}
      <Eksperiment>
        {oppgaveErPåVent ? (
          <OppgaveModalActionMenuItem modal={OppgaveModalType.FORTSETT_BEHANDLING}>
            Fortsett behandling (ny)
          </OppgaveModalActionMenuItem>
        ) : (
          <OppgaveModalActionMenuItem modal={OppgaveModalType.SETT_PÅ_VENT}>
            Sett oppgaven på vent
          </OppgaveModalActionMenuItem>
        )}
      </Eksperiment>
      {!isJournalføring && (
        <OppgaveModalActionMenuItem modal={OppgaveModalType.ENDRE_BEHANDLINGSTEMA}>
          Endre behandlingstema
        </OppgaveModalActionMenuItem>
      )}
      <OppgaveModalActionMenuItem modal={OppgaveModalType.OVERFØR_TIL_MEDARBEIDER}>
        Overfør til medarbeider
      </OppgaveModalActionMenuItem>
      <ActionMenu.Item
        onSelect={async (event) => {
          event.stopPropagation()
          await fjernOppgavetildeling()
          if (onAction) return onAction()
        }}
      >
        {`Legg tilbake til ${gjeldendeEnhet?.navn}`}
      </ActionMenu.Item>
    </ActionMenu.Group>
  )
}

function OppgaveModalActionMenuItem({ modal, children }: { modal: OppgaveModalType; children: ReactNode }) {
  const åpneModal = useOppgaveÅpneModalHandler()
  const handleSelect = () => åpneModal(modal)
  return <ActionMenu.Item onSelect={handleSelect}>{children}</ActionMenu.Item>
}
