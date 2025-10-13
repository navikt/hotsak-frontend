import { HourglassBottomFilledIcon, MenuElipsisVerticalIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, HStack, Label, Table, Tag, VStack } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { useNavigate } from 'react-router'

import { FormatertDato } from '../../felleskomponenter/format/FormatertDato.tsx'
import { type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { OppgavetypeTag } from './OppgavetypeTag.tsx'
import { isBefore } from 'date-fns'

export interface OppgaveTableProps {
  oppgaver: OppgaveV2[]
  mine?: boolean
}

export function OppgaveTable(props: OppgaveTableProps) {
  const { oppgaver, mine } = props
  const navigate = useNavigate()
  return (
    <Table size="medium" zebraStripes>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell colSpan={3} />
          <Table.ColumnHeader sortKey="opprettetTidspunkt" sortable>
            Opprettet
          </Table.ColumnHeader>
          <Table.ColumnHeader sortKey="fristFerdigstillelse" sortable>
            Frist
          </Table.ColumnHeader>
          <Table.ColumnHeader sortKey="fnr" sortable>
            Bruker
          </Table.ColumnHeader>
          <Table.HeaderCell />
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {oppgaver.map((oppgave) => (
          <Table.ExpandableRow key={oppgave.oppgaveId} content={<OppgaveDetails oppgave={oppgave} />}>
            <Table.DataCell width={100}>
              {mine ? (
                <Button size="xsmall" type="button" onClick={() => navigate(`/oppgave/${oppgave.oppgaveId}`)}>
                  Behandle
                </Button>
              ) : (
                <Button size="xsmall" type="button" onClick={() => navigate(`/oppgave/${oppgave.oppgaveId}`)}>
                  Velg
                </Button>
              )}
            </Table.DataCell>
            <Table.DataCell>
              <HStack gap="2">
                <OppgavetypeTag oppgavetype={oppgave.oppgavetype} />
                <Tag size="small" variant="neutral">
                  {oppgave.gjelder}
                </Tag>
              </HStack>
            </Table.DataCell>
            <Table.DataCell width={150}>
              <FormatertDato dato={oppgave.opprettetTidspunkt} />
            </Table.DataCell>
            <Table.DataCell width={150}>
              <HStack align="center" gap="2">
                <FormatertDato dato={oppgave.fristFerdigstillelse} />
                {oppgave.fristFerdigstillelse && isBefore(oppgave.fristFerdigstillelse, Date.now()) && (
                  <HourglassBottomFilledIcon color="var(--ax-text-danger-decoration)" />
                )}
              </HStack>
            </Table.DataCell>
            <Table.DataCell width={150}>{oppgave.fnr}</Table.DataCell>
            <Table.DataCell width={25}>
              <div>
                <MenuElipsisVerticalIcon />
              </div>
            </Table.DataCell>
          </Table.ExpandableRow>
        ))}
      </Table.Body>
    </Table>
  )
}

function OppgaveDetails({ oppgave }: { oppgave: OppgaveV2 }) {
  return (
    <VStack gap="2">
      <OppgaveDetailsItem label="JournalpostID:" value={oppgave.journalpostId} />
      <OppgaveDetailsItem label="Saksnummer:" value={oppgave.sakId} />
      <OppgaveDetailsItem label="Beskrivelse:" value={oppgave.beskrivelse} />
    </VStack>
  )
}

function OppgaveDetailsItem({ label, value }: { label: string; value?: ReactNode }) {
  if (!value) return null
  return (
    <HStack align="center" gap="2">
      <Label size="small">{label}</Label>
      <BodyShort>{value}</BodyShort>
    </HStack>
  )
}
