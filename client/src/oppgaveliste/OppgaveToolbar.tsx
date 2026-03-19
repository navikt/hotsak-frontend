import { TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, HGrid, HStack, Switch } from '@navikt/ds-react'
import { type ReactNode } from 'react'

import {
  useDataGridFilterContext,
  useDataGridFilterDispatch,
  useDataGridFilterResetAllHandler,
  useIsDataGridFiltered,
} from '../felleskomponenter/data/DataGridFilterContext.ts'
import { OppgaveColumnMenu } from './OppgaveColumnMenu.tsx'
import classes from './OppgaveToolbar.module.css'
import type { OppgaveColumnField } from './oppgaveColumns.tsx'
import { hasAny } from '../utils/array.ts'
import { emptyDataGridFilterValues } from '../felleskomponenter/data/DataGridFilter.ts'

export interface OppgaveToolbarProps {
  text: string
  antallHastesaker?: number
  children?: ReactNode
}

export function OppgaveToolbar(props: OppgaveToolbarProps) {
  const { text, antallHastesaker = 0, children } = props
  const { prioritet: prioritetFilterState = emptyDataGridFilterValues } = useDataGridFilterContext<OppgaveColumnField>()
  const dispatch = useDataGridFilterDispatch<OppgaveColumnField>()
  const isDataGridFiltered = useIsDataGridFiltered()
  const handleFilterResetAll = useDataGridFilterResetAllHandler()
  return (
    <Box borderColor="neutral-subtleA" borderWidth="0 0 2 0" className={classes.root} padding="space-8">
      <HGrid columns="1fr 1fr" align="center" className={classes.grid}>
        <BodyShort size="small">{text}</BodyShort>
        <HStack gap="space-12" justify="end" align="center">
          {antallHastesaker > 0 && (
            <Switch
              data-color="warning"
              size="small"
              checked={hasAny(prioritetFilterState.values, hastesakValues)}
              onChange={(event) => {
                dispatch({
                  type: 'singleField',
                  field: 'prioritet',
                  values: event.target.checked ? hastesakValues : [],
                })
              }}
            >{`Vis hastesaker (${antallHastesaker})`}</Switch>
          )}
          {children}
          <Button
            data-color="neutral"
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
      </HGrid>
    </Box>
  )
}

const hastesakValues = ['HØY']
