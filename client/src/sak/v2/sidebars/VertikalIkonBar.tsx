import { ClockDashedIcon, PersonEnvelopeIcon } from '@navikt/aksel-icons'
import { Box, Button, Tooltip, VStack } from '@navikt/ds-react'
import { useEffect, useRef } from 'react'

import { type Saksbehandlingsoppgave } from '../../../oppgave/oppgaveTypes'
import { useSak } from '../../../saksbilde/useSak'
import { NotaterIcon } from '../../notat/NotaterIcon'
import { UtlånsoversiktIcon } from '../../notat/UtlånsoversiktIcon'
import { useNotater } from '../../notat/useNotater'
import { SidebarValg } from '../SakPanelTabTypes'
import { useSakContext } from '../SakV2ContextType'

export interface VertikalIkonBarProps {
  oppgave?: Saksbehandlingsoppgave
}

export function VertikalIkonBar({ oppgave }: VertikalIkonBarProps) {
  const { sak } = useSak()
  const { aktivSidebar, setAktivSidebar, panelState } = useSakContext()
  const sidePanel = panelState.panels.sidebarpanel
  const { antallNotater, isLoading: notaterIsLoading } = useNotater(sak?.data.sakId)
  const sidebarErInitialisert = useRef(false)

  useEffect(() => {
    if (notaterIsLoading || sidebarErInitialisert.current) return

    sidebarErInitialisert.current = true
    if (antallNotater > 0) {
      setAktivSidebar(SidebarValg.NOTATER)
    }
  }, [antallNotater, notaterIsLoading, setAktivSidebar])

  function velgSidebar(sidebar: SidebarValg) {
    sidebarErInitialisert.current = true
    setAktivSidebar(sidebar)
  }

  return (
    <Box
      background="default"
      paddingBlock="space-12 space-0"
      borderRadius="0 12 0 0"
      height="100%"
      borderColor="neutral-subtle"
      borderWidth="1 1 0 1"
    >
      <VStack align="center" gap="space-12" paddingInline="space-4">
        <Tooltip content="Sakshistorikk" placement="left">
          <Button
            onClick={() => velgSidebar(SidebarValg.SAKSHISTORIKK)}
            size="small"
            style={
              sidePanel.visible && aktivSidebar === SidebarValg.SAKSHISTORIKK
                ? { outline: '2px solid var(--ax-border-accent)', background: 'var(--ax-bg-accent-soft)' }
                : {}
            }
            icon={<ClockDashedIcon title="Sakshistorikk" />}
            variant="tertiary"
            data-color="neutral"
          />
        </Tooltip>
        <Tooltip content="Utlånsoversikt" placement="left">
          <Button
            size="small"
            variant="tertiary"
            data-color="neutral"
            style={
              sidePanel.visible && aktivSidebar === SidebarValg.HJELPEMIDDELOVERSIKT
                ? { outline: '2px solid var(--ax-border-accent)', background: 'var(--ax-bg-accent-soft)' }
                : {}
            }
            onClick={() => velgSidebar(SidebarValg.HJELPEMIDDELOVERSIKT)}
            icon={<UtlånsoversiktIcon />}
          />
        </Tooltip>
        <Tooltip content="Notater" placement="left">
          <Button
            size="small"
            variant="tertiary"
            data-color="neutral"
            style={
              sidePanel.visible && aktivSidebar === SidebarValg.NOTATER
                ? { outline: '2px solid var(--ax-border-accent)', background: 'var(--ax-bg-accent-soft)' }
                : {}
            }
            onClick={() => velgSidebar(SidebarValg.NOTATER)}
            icon={<NotaterIcon oppgaveId={oppgave?.oppgaveId} sakId={sak?.data.sakId} />}
          />
        </Tooltip>
        <Tooltip content="Oppgaver og dokumenter på bruker" placement="left">
          <Button
            size="small"
            variant="tertiary"
            data-color="neutral"
            style={
              sidePanel.visible && aktivSidebar === SidebarValg.OPPGAVER_OG_DOKUMENTER
                ? { outline: '2px solid var(--ax-border-accent)', background: 'var(--ax-bg-accent-soft)' }
                : {}
            }
            onClick={() => velgSidebar(SidebarValg.OPPGAVER_OG_DOKUMENTER)}
            icon={<PersonEnvelopeIcon />}
          />
        </Tooltip>
      </VStack>
    </Box>
  )
}
