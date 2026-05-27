import { ClockDashedIcon } from '@navikt/aksel-icons'
import { Button, VStack } from '@navikt/ds-react'

import { type Saksbehandlingsoppgave } from '../../../oppgave/oppgaveTypes'
import { useSak } from '../../../saksbilde/useSak'
import { NotaterIcon } from '../../notat/NotaterIcon'
import { UtlånsoversiktIcon } from '../../notat/UtlånsoversiktIcon'
import { SidebarValg } from '../SakPanelTabTypes'
import { useSakContext } from '../SakV2ContextType'

export interface SidebarProps {
  oppgave?: Saksbehandlingsoppgave
}

export function VertikalIkonBar({ oppgave }: SidebarProps) {
  const { sak } = useSak()
  const { aktivSidebar, setAktivSidebar } = useSakContext()

  return (
    <VStack align="center" gap="space-12" paddingInline="space-4">
      <Button
        onClick={() => setAktivSidebar(SidebarValg.SAKSOVERSIKT)}
        size="small"
        style={aktivSidebar === SidebarValg.SAKSOVERSIKT ? { outline: '2px solid var(--ax-border-accent)' } : {}}
        icon={<ClockDashedIcon title="Sakshistorikk" />}
        variant="tertiary"
        data-color="neutral"
      />
      <Button
        size="small"
        variant="tertiary"
        data-color="neutral"
        style={
          aktivSidebar === SidebarValg.HJELPEMIDDELOVERSIKT ? { outline: '2px solid var(--ax-border-accent)' } : {}
        }
        onClick={() => setAktivSidebar(SidebarValg.HJELPEMIDDELOVERSIKT)}
        icon={<UtlånsoversiktIcon />}
      />
      <Button
        size="small"
        variant="tertiary"
        data-color="neutral"
        style={aktivSidebar === SidebarValg.NOTATER ? { outline: '2px solid var(--ax-border-accent)' } : {}}
        onClick={() => setAktivSidebar(SidebarValg.NOTATER)}
        icon={<NotaterIcon oppgaveId={oppgave?.oppgaveId} sakId={sak?.data.sakId} />}
      />
    </VStack>
  )
}
