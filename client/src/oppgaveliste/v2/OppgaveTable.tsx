import { HourglassBottomFilledIcon } from '@navikt/aksel-icons'
import { Button, HStack, Table } from '@navikt/ds-react'
import { isBefore } from 'date-fns'
import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router'

import { FormatertDato } from '../../felleskomponenter/format/FormatertDato.tsx'
import { type OppgaveId, OppgaveprioritetLabel, OppgavetypeLabel, type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { TaOppgaveButton } from '../../oppgave/TaOppgaveButton.tsx'
import { OppgaveDetails } from './OppgaveDetails.tsx'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'

export interface OppgaveTableProps {
  oppgaver: OppgaveV2[]
  mine?: boolean
}

export function OppgaveTable(props: OppgaveTableProps) {
  const { oppgaver, mine } = props
  const { sort, setSort } = useOppgaveFilterContext()
  const navigate = useNavigate()
  const [valgte, setValgte] = useState<Record<OppgaveId, boolean>>({})
  return (
    <Table
      size="medium"
      sort={sort}
      onSortChange={(sortKey) => {
        setSort({
          orderBy: sortKey || 'fristFerdigstillelse',
          direction: sort?.direction === 'ascending' ? 'descending' : 'ascending',
        })
      }}
      zebraStripes
    >
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell textSize="small" colSpan={mine ? 2 : 1} />
          <Table.HeaderCell textSize="small" style={{ width: 150 }}>
            Oppgavetype
          </Table.HeaderCell>
          <Table.HeaderCell textSize="small" style={{ width: 250 }}>
            Gjelder
          </Table.HeaderCell>
          <Table.HeaderCell textSize="small" style={{ width: 250 }}>
            Behandlingstype
          </Table.HeaderCell>
          <Table.HeaderCell textSize="small">Mappe</Table.HeaderCell>
          <Table.HeaderCell textSize="small" style={{ width: 150 }}>
            Prioritet
          </Table.HeaderCell>
          <Table.ColumnHeader textSize="small" style={{ width: 150 }} sortKey="opprettetTidspunkt" sortable>
            Opprettet
          </Table.ColumnHeader>
          <Table.ColumnHeader textSize="small" style={{ width: 150 }} sortKey="fristFerdigstillelse" sortable>
            Frist
          </Table.ColumnHeader>
          <Table.ColumnHeader textSize="small" style={{ width: 150 }} sortKey="fnr" sortable>
            Bruker
          </Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {oppgaver.map((oppgave) => (
          <OppgaveRow key={oppgave.oppgaveId} oppgave={oppgave} mine={mine}>
            <Table.DataCell textSize="small" width={135}>
              {mine ? (
                <Button
                  size="xsmall"
                  type="button"
                  variant="tertiary"
                  onClick={() => navigate(`/oppgave/${oppgave.oppgaveId}`)}
                >
                  Åpne oppgave
                </Button>
              ) : (
                <>
                  {valgte[oppgave.oppgaveId] ? (
                    <Button
                      size="xsmall"
                      type="button"
                      variant="tertiary"
                      onClick={() => navigate(`/oppgave/${oppgave.oppgaveId}`)}
                    >
                      Åpne oppgave
                    </Button>
                  ) : (
                    <TaOppgaveButton
                      size="xsmall"
                      variant="tertiary"
                      oppgave={oppgave}
                      onOppgavetildeling={(id) => {
                        setValgte({ ...valgte, [id]: true })
                      }}
                    >
                      Tildel meg
                    </TaOppgaveButton>
                  )}
                </>
              )}
            </Table.DataCell>
            <Table.DataCell textSize="small" width={150}>
              {OppgavetypeLabel[oppgave.oppgavetype]}
            </Table.DataCell>
            <Table.DataCell textSize="small" width={250}>
              {oppgave.behandlingstema}
            </Table.DataCell>
            <Table.DataCell textSize="small" width={250}>
              {oppgave.behandlingstype}
            </Table.DataCell>
            <Table.DataCell textSize="small">{oppgave.mappenavn}</Table.DataCell>
            <Table.DataCell textSize="small" width={150}>
              {OppgaveprioritetLabel[oppgave.prioritet]}
            </Table.DataCell>
            <Table.DataCell textSize="small" width={150}>
              <FormatertDato dato={oppgave.opprettetTidspunkt} />
            </Table.DataCell>
            <Table.DataCell textSize="small" width={150}>
              <HStack align="center" gap="2">
                <FormatertDato dato={oppgave.fristFerdigstillelse} />
                {oppgave.fristFerdigstillelse && isBefore(oppgave.fristFerdigstillelse, Date.now()) && (
                  <HourglassBottomFilledIcon color="var(--ax-text-danger-decoration)" />
                )}
              </HStack>
            </Table.DataCell>
            <Table.DataCell textSize="small" width={150}>
              {oppgave.fnr}
            </Table.DataCell>
          </OppgaveRow>
        ))}
      </Table.Body>
    </Table>
  )
}

function OppgaveRow({ oppgave, mine, children }: { oppgave: OppgaveV2; mine?: boolean; children: ReactNode }) {
  const [visible, setVisible] = useState<boolean>(false)
  if (mine) {
    return (
      <Table.ExpandableRow
        key={oppgave.oppgaveId}
        content={<OppgaveDetails oppgave={oppgave} visible={visible} />}
        onOpenChange={setVisible}
      >
        {children}
      </Table.ExpandableRow>
    )
  }
  return <Table.Row>{children}</Table.Row>
}
