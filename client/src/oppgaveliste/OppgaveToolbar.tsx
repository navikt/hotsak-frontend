import { TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, HGrid, HStack } from '@navikt/ds-react'
import { type ReactNode } from 'react'

import {
  useDataGridFilterResetAllHandler,
  useIsDataGridFiltered,
} from '../felleskomponenter/data/DataGridFilterContext.ts'
import { OppgaveColumnMenu } from './OppgaveColumnMenu.tsx'

import classes from './OppgaveToolbar.module.css'

export interface OppgaveToolbarProps {
  text: string
  children?: ReactNode
}

export function OppgaveToolbar(props: OppgaveToolbarProps) {
  const { text, children } = props
  const isDataGridFiltered = useIsDataGridFiltered()
  const handleFilterResetAll = useDataGridFilterResetAllHandler()
  return (
    <Box borderColor="neutral-subtleA" borderWidth="0 0 2 0" className={classes.root} padding="2">
      <HGrid columns="1fr 1fr 1fr" align="center" className={classes.grid}>
        <div />
        <BodyShort align="center" size="small">
          {text}
        </BodyShort>
        <HStack gap="2" justify="end" align="center">
          {children}
          <Button
            type="button"
            size="xsmall"
            variant="tertiary-neutral"
            icon={<TrashIcon />}
            onClick={handleFilterResetAll}
            disabled={!isDataGridFiltered}
            title={isDataGridFiltered ? undefined : 'Ingen filtre valgt'}
          >
            Fjern alle filtre
          </Button>
          <OppgaveColumnMenu />
        </HStack>
      </HGrid>
    </Box>
  )
}
