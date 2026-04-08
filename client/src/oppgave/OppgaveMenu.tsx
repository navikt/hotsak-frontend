import { ActionMenu } from '@navikt/ds-react'
import { type ReactNode } from 'react'

import { type Oppgave, type OppgaveId, Oppgavetype } from './oppgaveTypes.ts'
import { useOppgaveActions } from './useOppgaveActions.ts'
import { useOppgaveregler } from './useOppgaveregler.ts'
import { OppgaveModalType, useOppgaveÅpneModalHandler } from './OppgaveContext.ts'
import { useOppgaveUrl } from './useOppgaveUrl.ts'
import { useUmami } from '../sporing/useUmami.ts'

export interface OppgaveMenuProps {
  oppgave?: Oppgave
  onAction?(): unknown | Promise<unknown>
}

export function OppgaveMenu(props: OppgaveMenuProps) {
  const { oppgave, onAction } = props
  const {
    oppgaveErKlarTilBehandling,
    oppgaveErUnderBehandlingAvAnnenAnsatt,
    oppgaveErUnderBehandlingAvInnloggetAnsatt,
    oppgaveErPåVent,
    gjeldendeEnhet,
  } = useOppgaveregler(oppgave)
  const { endreOppgavetildeling, fjernOppgavetildeling } = useOppgaveActions(oppgave)
  const { logOppgaveLagtTilbake } = useUmami()

  if (!oppgave) {
    return null
  }

  if (oppgaveErKlarTilBehandling || oppgaveErUnderBehandlingAvAnnenAnsatt) {
    return (
      <OppgaveMenuGroup>
        <ActionMenu.Item
          onSelect={async () => {
            await endreOppgavetildeling({})
            if (onAction) return onAction()
          }}
        >
          {oppgaveErKlarTilBehandling ? 'Ta oppgaven' : 'Overta oppgaven'}
        </ActionMenu.Item>
        <GosysLinkItem oppgaveId={oppgave.oppgaveId} />
      </OppgaveMenuGroup>
    )
  }

  const isJournalføring = oppgave.kategorisering.oppgavetype === Oppgavetype.JOURNALFØRING
  return (
    <ActionMenu.Group label="Oppgave">
      {oppgaveErPåVent ? (
        <OppgaveModalActionMenuItem
          modal={OppgaveModalType.FORTSETT_BEHANDLING}
          underBehandlingAvInnloggetAnsatt={oppgaveErUnderBehandlingAvInnloggetAnsatt}
        >
          Fortsett behandling
        </OppgaveModalActionMenuItem>
      ) : (
        <OppgaveModalActionMenuItem
          modal={OppgaveModalType.SETT_PÅ_VENT}
          underBehandlingAvInnloggetAnsatt={oppgaveErUnderBehandlingAvInnloggetAnsatt}
        >
          Sett oppgaven på vent
        </OppgaveModalActionMenuItem>
      )}
      {!isJournalføring && (
        <OppgaveModalActionMenuItem
          modal={OppgaveModalType.ENDRE_GJELDER}
          underBehandlingAvInnloggetAnsatt={oppgaveErUnderBehandlingAvInnloggetAnsatt}
        >
          Endre hva oppgaven gjelder
        </OppgaveModalActionMenuItem>
      )}
      <OppgaveModalActionMenuItem
        modal={OppgaveModalType.OVERFØR_TIL_MEDARBEIDER}
        underBehandlingAvInnloggetAnsatt={oppgaveErUnderBehandlingAvInnloggetAnsatt}
      >
        Overfør til medarbeider
      </OppgaveModalActionMenuItem>
      <ActionMenu.Item
        disabled={!oppgaveErUnderBehandlingAvInnloggetAnsatt}
        onSelect={async () => {
          await fjernOppgavetildeling()
          logOppgaveLagtTilbake()
          if (onAction) return onAction()
        }}
      >
        {`Legg tilbake til ${gjeldendeEnhet?.navn}`}
      </ActionMenu.Item>
      <GosysLinkItem oppgaveId={oppgave.oppgaveId} />
    </ActionMenu.Group>
  )
}

function OppgaveMenuGroup({ children }: { children: ReactNode }) {
  return <ActionMenu.Group label="Oppgave">{children}</ActionMenu.Group>
}

function OppgaveModalActionMenuItem({
  modal,
  underBehandlingAvInnloggetAnsatt,
  children,
}: {
  modal: OppgaveModalType
  underBehandlingAvInnloggetAnsatt: boolean
  children: ReactNode
}) {
  const åpneModal = useOppgaveÅpneModalHandler()
  const handleSelect = () => åpneModal(modal)
  return (
    <ActionMenu.Item disabled={!underBehandlingAvInnloggetAnsatt} onSelect={handleSelect}>
      {children}
    </ActionMenu.Item>
  )
}

function GosysLinkItem({ oppgaveId }: { oppgaveId: OppgaveId }) {
  const href = useOppgaveUrl(oppgaveId)
  const { logOppgaveÅpnetIGosys } = useUmami()
  return (
    <ActionMenu.Item as="a" href={href} target="_blank" onClick={logOppgaveÅpnetIGosys}>
      Åpne oppgaven i Gosys
    </ActionMenu.Item>
  )
}
