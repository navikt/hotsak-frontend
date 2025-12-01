import { ChevronDownIcon } from '@navikt/aksel-icons'
import { ActionMenu, Button } from '@navikt/ds-react'
import { useState } from 'react'
import { SpørreundersøkelseId } from '../../../../innsikt/spørreundersøkelser.ts'
import { useOppgave } from '../../../../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../../../../oppgave/useOppgaveregler.ts'
import { useOverførSakTilGosys } from '../../../../saksbilde/useOverførSakTilGosys.ts'
import { OppgaveMenu } from '../../../../oppgave/OppgaveMenu.tsx'
import { OverførOppgaveTilMedarbeiderModal } from '../../../../oppgave/OverførOppgaveTilMedarbeiderModal.tsx'
import { OverførSakTilGosysModal } from '../../../../saksbilde/OverførSakTilGosysModal.tsx'

export interface SaksbildeMenuProps {
  spørreundersøkelseId: SpørreundersøkelseId
}

export function SakMenyEksperiment({ spørreundersøkelseId }: SaksbildeMenuProps) {
  const { oppgave } = useOppgave()
  const { oppgaveErAvsluttet, oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const [visOverførMedarbeider, setVisOverførMedarbeider] = useState(false)
  const { onOpen: visOverførGosys, ...overførGosys } = useOverførSakTilGosys(spørreundersøkelseId)

  if (!oppgave || oppgaveErAvsluttet) {
    return null
  }

  return (
    <>
      <ActionMenu>
        <ActionMenu.Trigger>
          <Button
            variant="secondary-neutral"
            size="small"
            icon={<ChevronDownIcon title="Saksmeny" />}
            iconPosition="right"
            onClick={(event) => {
              event.stopPropagation()
            }}
          >
            Meny
          </Button>
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <ActionMenu.Item
            onSelect={() => {
              alert('TODO')
            }}
          >
            Sett på vent
          </ActionMenu.Item>
          <OppgaveMenu
            oppgave={oppgave}
            onSelectOverførOppgaveTilMedarbeider={() => {
              setVisOverførMedarbeider(true)
            }}
          />
          {oppgaveErUnderBehandlingAvInnloggetAnsatt && (
            <>
              <ActionMenu.Divider />
              <ActionMenu.Group aria-label="Saksmeny">
                <ActionMenu.Item
                  onSelect={() => {
                    visOverførGosys()
                  }}
                >
                  Overfør sak til Gosys
                </ActionMenu.Item>
              </ActionMenu.Group>
            </>
          )}
        </ActionMenu.Content>
      </ActionMenu>
      <OverførOppgaveTilMedarbeiderModal
        sakId={oppgave.sakId?.toString() ?? ''}
        open={visOverførMedarbeider}
        onClose={() => {
          setVisOverførMedarbeider(false)
        }}
      />
      <OverførSakTilGosysModal {...overførGosys} />
    </>
  )
}
