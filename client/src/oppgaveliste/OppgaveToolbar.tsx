import { TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, HGrid, HStack, Tag } from '@navikt/ds-react'
import { type ReactNode } from 'react'

import {
  useDataGridFilterDispatch,
  useDataGridFilterResetAllHandler,
  useIsDataGridFiltered,
} from '../felleskomponenter/data/DataGridFilterContext.ts'
import { OppgaveColumnMenu } from './OppgaveColumnMenu.tsx'
import classes from './OppgaveToolbar.module.css'
import type { OppgaveColumnField } from './oppgaveColumns.tsx'

export interface OppgaveToolbarProps {
  text: string
  antallHastesaker?: number
  children?: ReactNode
}

export function OppgaveToolbar(props: OppgaveToolbarProps) {
  const { text, antallHastesaker = 0, children } = props
  const dispatch = useDataGridFilterDispatch<OppgaveColumnField>()
  const isDataGridFiltered = useIsDataGridFiltered()
  const handleFilterResetAll = useDataGridFilterResetAllHandler()
  return (
    <Box borderColor="neutral-subtleA" borderWidth="0 0 2 0" className={classes.root} padding="space-8">
      <HGrid columns="1fr 1fr" align="center" className={classes.grid}>
        <HStack gap="space-12" align="center" justify="start" wrap={false}>
          <BodyShort size="small">{text}</BodyShort>
          {antallHastesaker > 0 ? (
            <>
              <Button
                size="xsmall"
                type="button"
                variant="primary"
                data-color="warning"
                onClick={() => {
                  dispatch({
                    type: 'singleField',
                    field: 'prioritet',
                    values: hastesakValues,
                  })
                }}
              >{`Vis hastesaker (${antallHastesaker})`}</Button>
            </>
          ) : (
            <Tag variant="success" size="small">
              Ingen hastesaker.
            </Tag>
          )}
        </HStack>
        <HStack gap="space-12" align="center" justify="end" wrap={false}>
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
