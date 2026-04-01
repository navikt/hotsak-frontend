import { TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Chips, HGrid, HStack } from '@navikt/ds-react'
import { type ReactNode } from 'react'

import {
  useDataGridFilterDispatch,
  useDataGridFilterResetAllHandler,
  useIsDataGridFiltered,
  useIsDataGridOnlyFilteredBy,
} from '../felleskomponenter/data/DataGridFilterContext.ts'
import { OppgaveColumnMenu } from './OppgaveColumnMenu.tsx'
import classes from './OppgaveToolbar.module.css'
import { OppgaveColumnFilter } from './oppgaveColumns.tsx'
import { Oppgaveprioritet } from '../oppgave/oppgaveTypes.ts'
import { ChipsToggle } from '@navikt/ds-react/Chips'
import { emptyDataGridFilterValues } from '../felleskomponenter/data/DataGridFilter.ts'

export interface OppgaveToolbarProps {
  antallOppgaver: string
  antallHastesaker?: number
  antallPåVent?: number
  loading?: boolean
  children?: ReactNode
}

export function OppgaveToolbar(props: OppgaveToolbarProps) {
  const { antallOppgaver, antallHastesaker = 0, antallPåVent = 0, loading, children } = props
  const isDataGridFiltered = useIsDataGridFiltered()
  const handleFilterResetAll = useDataGridFilterResetAllHandler()
  return (
    <Box borderColor="neutral-subtleA" borderWidth="0 0 2 0" className={classes.root} padding="space-8">
      <HGrid columns="1fr 1fr" align="center" className={classes.grid}>
        <HStack gap="space-12" align="center" justify="start" wrap={false}>
          <BodyShort size="small">{antallOppgaver}</BodyShort>
        </HStack>
        <HStack gap="space-32" align="center" justify="end" wrap={false}>
          <Chips size="small">
            {!loading && <HastesakerToggle antallHastesaker={antallHastesaker} />}
            {!loading && <PåVentToggle antallPåVent={antallPåVent} />}
            {children}
          </Chips>
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

function HastesakerToggle({ antallHastesaker = 0 }: { antallHastesaker?: number }) {
  const dispatch = useDataGridFilterDispatch<OppgaveColumnFilter>()
  const selected = useIsDataGridOnlyFilteredBy<OppgaveColumnFilter>('prioritet', hastesakValues)
  if (antallHastesaker > 0) {
    return (
      <ChipsToggle
        title="Vis alle oppgaver med høy eller kritisk prioritet"
        selected={selected}
        data-color="warning"
        onClick={() => {
          const values = selected ? emptyDataGridFilterValues.values : hastesakValues
          dispatch({
            type: 'setFieldValues',
            field: 'prioritet',
            values,
            resetOthers: true,
          })
        }}
      >{`Hastesaker (${antallHastesaker})`}</ChipsToggle>
    )
  }

  return (
    <ChipsToggle as="div" data-color="success" checkmark={false} style={{ cursor: 'default' }} disabled>
      Ingen hastesaker.
    </ChipsToggle>
  )
}

const hastesakValues = new Set([Oppgaveprioritet.HØY, Oppgaveprioritet.KRITISK])

function PåVentToggle({ antallPåVent = 0 }: { antallPåVent?: number }) {
  const dispatch = useDataGridFilterDispatch<OppgaveColumnFilter>()
  const selected = useIsDataGridOnlyFilteredBy<OppgaveColumnFilter>('isPåVent', isPåVentValues)
  return (
    <ChipsToggle
      title="Vi alle oppgaver som er satt på vent"
      selected={selected}
      onClick={() => {
        const values = selected ? emptyDataGridFilterValues.values : isPåVentValues
        dispatch({
          type: 'setFieldValues',
          field: 'isPåVent',
          values,
          resetOthers: true,
        })
      }}
    >
      {`På vent (${antallPåVent})`}
    </ChipsToggle>
  )
}

const isPåVentValues = new Set([true])
