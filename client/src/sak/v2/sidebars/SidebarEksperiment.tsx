import { ChevronRightIcon, NotePencilIcon } from '@navikt/aksel-icons'
import { Box, Button } from '@navikt/ds-react'

import { ScrollablePanel } from '../../../felleskomponenter/ScrollablePanel'
import { type Saksbehandlingsoppgave } from '../../../oppgave/oppgaveTypes'
import { Historikk } from '../../../saksbilde/høyrekolonne/historikk/Historikk'
import { useUtlånoversikt } from '../../../saksbilde/høyrekolonne/hjelpemiddeloversikt/useUtlånoversikt'
import { useSak } from '../../../saksbilde/useSak'
import { Notater } from '../../notat/Notater'
import { useClosePanel } from '../paneler/usePanelHooks'
import { SidebarValg } from '../SakPanelTabTypes'
import { useSakContext } from '../SakV2ContextType'
import classes from './Sidebar.module.css'
import { SidebarPanel } from './SidebarPanel'
import { UtlånsoversiktV2 } from './UtlånsoversiktV2'
import { Mellomtittel } from '../../../felleskomponenter/typografi'
import { useMiljø } from '../../../utils/useMiljø'

export interface SidebarProps {
  oppgave?: Saksbehandlingsoppgave
}

export function SidebarEksperiment({ oppgave }: SidebarProps) {
  const { aktivSidebar } = useSakContext()
  const { sak } = useSak()
  useUtlånoversikt(sak?.data.bruker.fnr, sak?.data.vedtak?.vedtaksgrunnlag)
  const closePanel = useClosePanel('sidebarpanel')
  const { erProd } = useMiljø()

  function renderActivePanel() {
    switch (aktivSidebar) {
      case SidebarValg.SAKSHISTORIKK:
        return <Historikk />
      case SidebarValg.HJELPEMIDDELOVERSIKT:
        return <UtlånsoversiktV2 />
      case SidebarValg.NOTATER:
        return (
          <SidebarPanel
            tittel={erProd ? <Mellomtittel>Notater</Mellomtittel> : 'Notater'}
            icon={<NotePencilIcon title="Notater" />}
          >
            <Notater oppgave={oppgave} />
          </SidebarPanel>
        )
      default:
        return null
    }
  }

  return (
    <Box background="default" height="100%" position="relative" paddingBlock="space-0 space-36">
      <Button
        data-color="neutral"
        variant="tertiary"
        size="small"
        icon={<ChevronRightIcon title={`Skjul sidepanel`} fontSize="20px" />}
        onClick={closePanel}
        className={classes.closeButton}
      />
      <ScrollablePanel>{renderActivePanel()}</ScrollablePanel>
    </Box>
  )
}
