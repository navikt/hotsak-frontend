import { TrashIcon } from '@navikt/aksel-icons'
import { Box, Button, HGrid, HStack, Tabs } from '@navikt/ds-react'

import {
  useDataGridFilterResetAllHandler,
  useIsDataGridFiltered,
} from '../felleskomponenter/data/DataGridFilterContext.ts'
import { OppgaveColumnMenu } from './OppgaveColumnMenu.tsx'
import { OppgaveToolbarTab, useOppgavelisteContext, useOppgavelisteTabChangeHandler } from './OppgavelisteContext.tsx'
import classes from './OppgaveToolbar.module.css'
import { useOppgavelisteHotkeys } from './useOppgavelisteHotkeys.ts'

export interface OppgaveToolbarProps {
  antallOppgaver: number
  antallHastesaker: number
  antallPåVent: number
  antallFerdigstilte?: number
  ferdigstilte?: boolean
  loading?: boolean
}

export function OppgaveToolbar(props: OppgaveToolbarProps) {
  const { antallOppgaver, antallHastesaker, antallPåVent, antallFerdigstilte, ferdigstilte, loading } = props
  const { currentTab } = useOppgavelisteContext()
  const handleTabChanged = useOppgavelisteTabChangeHandler()
  const isDataGridFiltered = useIsDataGridFiltered(currentTab)
  const handleFilterResetAll = useDataGridFilterResetAllHandler(currentTab)
  useOppgavelisteHotkeys()
  return (
    <Box borderColor="neutral-subtleA" borderWidth="0 0 2 0" className={classes.root} padding="space-8">
      <HGrid columns="1fr 1fr" align="center" className={classes.grid}>
        <div />
        <HStack gap="space-32" align="center" justify="end" wrap={false}>
          {!loading && (
            <Tabs value={currentTab} size="small" onChange={handleTabChanged}>
              <Tabs.List>
                <Tabs.Tab value={OppgaveToolbarTab.ALLE} label={`Alle (${antallOppgaver})`} />
                <Tabs.Tab value={OppgaveToolbarTab.HASTESAKER} label={`Hastesaker (${antallHastesaker})`} />
                <Tabs.Tab value={OppgaveToolbarTab.PÅ_VENT} label={`På vent (${antallPåVent})`} />
                {ferdigstilte && (
                  <Tabs.Tab value={OppgaveToolbarTab.FERDIGSTILTE} label={`Ferdigstilte (${antallFerdigstilte})`} />
                )}
              </Tabs.List>
            </Tabs>
          )}
          <HStack gap="space-8" align="center" justify="end" wrap={false}>
            <Button
              data-color="danger"
              type="button"
              size="xsmall"
              variant="tertiary"
              icon={<TrashIcon />}
              onClick={handleFilterResetAll}
              disabled={!isDataGridFiltered}
              title={isDataGridFiltered ? undefined : 'Ingen filtre valgt'}
            >
              Fjern alle filtre
            </Button>
            <OppgaveColumnMenu />
          </HStack>
        </HStack>
      </HGrid>
    </Box>
  )
}
