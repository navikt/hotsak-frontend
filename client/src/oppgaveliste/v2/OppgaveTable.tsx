import { HourglassBottomFilledIcon } from '@navikt/aksel-icons'
import { BodyShort, Button, HStack, Label, Table, Tag, VStack } from '@navikt/ds-react'
import { isBefore } from 'date-fns'
import { ReactNode, useState } from 'react'
import { useNavigate } from 'react-router'

import { FormatertDato } from '../../felleskomponenter/format/FormatertDato.tsx'
import { type OppgaveId, type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { TaOppgaveButton } from '../../oppgave/TaOppgaveButton.tsx'
import { MappeTag } from './MappeTag.tsx'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
import { OppgavetypeTag } from './OppgavetypeTag.tsx'

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
          <Table.HeaderCell colSpan={3} />
          <Table.ColumnHeader style={{ width: 150 }} sortKey="opprettetTidspunkt" sortable>
            Opprettet
          </Table.ColumnHeader>
          <Table.ColumnHeader style={{ width: 150 }} sortKey="fristFerdigstillelse" sortable>
            Frist
          </Table.ColumnHeader>
          <Table.ColumnHeader style={{ width: 150 }} sortKey="fnr" sortable>
            Bruker
          </Table.ColumnHeader>
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
                <>
                  {valgte[oppgave.oppgaveId] ? (
                    <Button size="xsmall" type="button" onClick={() => navigate(`/oppgave/${oppgave.oppgaveId}`)}>
                      Behandle
                    </Button>
                  ) : (
                    <TaOppgaveButton
                      size="xsmall"
                      oppgave={oppgave}
                      onOppgavetildeling={(id) => {
                        setValgte({ ...valgte, [id]: true })
                      }}
                    >
                      Velg
                    </TaOppgaveButton>
                  )}
                </>
              )}
            </Table.DataCell>
            <Table.DataCell>
              <HStack gap="2">
                <OppgavetypeTag oppgavetype={oppgave.oppgavetype} />
                {oppgave.gjelder && (
                  <Tag size="small" variant="neutral">
                    {oppgave.gjelder}
                  </Tag>
                )}
                {oppgave.mappenavn && <MappeTag mappenavn={oppgave.mappenavn} />}
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
          </Table.ExpandableRow>
        ))}
      </Table.Body>
    </Table>
  )
}

function OppgaveDetails({ oppgave }: { oppgave: OppgaveV2 }) {
  return (
    <VStack gap="2">
      <OppgaveDetailsItem label="OppgaveID:" value={oppgave.oppgaveId} />
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
