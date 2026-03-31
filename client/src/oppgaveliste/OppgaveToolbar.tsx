import { TrashIcon } from '@navikt/aksel-icons'
import { BodyShort, Box, Button, Chips, HGrid, HStack } from '@navikt/ds-react'
import { type ReactNode } from 'react'

import {
  isDataGridFiltered,
  useDataGridFilterContext,
  useDataGridFilterDispatch,
  useDataGridFilterResetAllHandler,
  useIsDataGridFiltered,
} from '../felleskomponenter/data/DataGridFilterContext.ts'
import { OppgaveColumnMenu } from './OppgaveColumnMenu.tsx'
import classes from './OppgaveToolbar.module.css'
import type { OppgaveColumnField } from './oppgaveColumns.tsx'
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
  const { prioritet = emptyDataGridFilterValues, ...rest } = useDataGridFilterContext<OppgaveColumnField>()
  const dispatch = useDataGridFilterDispatch<OppgaveColumnField>()
  const selected = hastesakValues.symmetricDifference(prioritet.values).size === 0 && !isDataGridFiltered(rest)
  if (antallHastesaker > 0) {
    return (
      <ChipsToggle
        title="Vis alle oppgaver med høy eller kritisk prioritet."
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

function PåVentToggle({ antallPåVent = 0 }: { antallPåVent?: number }) {
  const { isPåVent = emptyDataGridFilterValues } = useDataGridFilterContext<'isPåVent'>()
  const dispatch = useDataGridFilterDispatch<'isPåVent'>()
  const selected = isPåVent.values.size > 0
  return (
    <ChipsToggle
      title="Vi alle oppgaver som er satt på vent"
      selected={selected}
      onClick={() => {
        const type = selected ? 'removeFieldValue' : 'addFieldValue'
        dispatch({
          type,
          field: 'isPåVent',
          value: true,
        })
      }}
    >
      {`På vent (${antallPåVent})`}
    </ChipsToggle>
  )
}

const hastesakValues = new Set([Oppgaveprioritet.HØY, Oppgaveprioritet.KRITISK])
