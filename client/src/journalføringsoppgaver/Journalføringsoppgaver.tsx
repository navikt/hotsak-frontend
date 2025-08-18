import { Box, Table } from '@navikt/ds-react'
import styled from 'styled-components'

import { IngentingFunnet } from '../felleskomponenter/IngentingFunnet.tsx'
import { TekstCell } from '../felleskomponenter/table/Celle.tsx'
import { DataCell, KolonneHeader } from '../felleskomponenter/table/KolonneHeader.tsx'
import { LinkRow } from '../felleskomponenter/table/LinkRow.tsx'
import type { Tabellkolonne } from '../felleskomponenter/table/Tabellkolonne.ts'
import { useSortedElements } from '../felleskomponenter/table/useSortedElements.ts'
import { Toast } from '../felleskomponenter/Toast.tsx'
import { TooltipWrapper } from '../felleskomponenter/TooltipWrapper.tsx'
import { Skjermlesertittel, TekstMedEllipsis } from '../felleskomponenter/typografi.tsx'
import { OppgavestatusLabel, OppgaveV2 } from '../oppgave/oppgaveTypes.ts'
import { OppgavelisteTabs } from '../oppgaveliste/OppgavelisteTabs.tsx'
import { TaOppgaveIOppgavelisteButton } from '../oppgaveliste/TaOppgaveIOppgavelisteButton.tsx'
import { formaterTidsstempel } from '../utils/dato.ts'
import { formaterFødselsnummer, formaterNavn } from '../utils/formater.ts'
import { isError } from '../utils/type.ts'
import { useJournalføringsoppgaver } from './useJournalføringsoppgaver.ts'

export default function Journalføringsoppgaver() {
  const { data, isLoading, error } = useJournalføringsoppgaver()
  const oppgaver = data?.oppgaver ?? []

  const kolonner: Tabellkolonne<OppgaveV2>[] = [
    {
      key: 'saksbehandler',
      name: 'Eier',
      width: 160,
      render(oppgave: OppgaveV2) {
        return <TaOppgaveIOppgavelisteButton oppgave={oppgave} />
      },
      accessor(verdi: OppgaveV2): string {
        return formaterNavn(verdi.tildeltSaksbehandler?.navn || '')
      },
    },
    {
      key: 'beskrivelse',
      name: 'Beskrivelse',
      width: 400,
      render(oppgave: OppgaveV2) {
        const oppgaveBeskrivelse = oppgave.beskrivelse || 'Uten tittel'
        return (
          <TooltipWrapper visTooltip={oppgaveBeskrivelse.length > 40} content={oppgaveBeskrivelse}>
            <TekstMedEllipsis>{oppgave.beskrivelse}</TekstMedEllipsis>
          </TooltipWrapper>
        )
      },
    },
    {
      key: 'oppgavestatus',
      name: 'Status',
      width: 150,
      render(oppgave: OppgaveV2) {
        return <TekstCell value={OppgavestatusLabel.get(oppgave.oppgavestatus)!} />
      },
    },
    {
      key: 'bruker',
      name: 'Bruker',
      width: 135,
      render(oppgave: OppgaveV2) {
        const fulltNavn = formaterNavn(oppgave.bruker?.navn || '-')
        return (
          <TooltipWrapper visTooltip={fulltNavn.length > 20} content={fulltNavn}>
            <TekstMedEllipsis>{fulltNavn}</TekstMedEllipsis>
          </TooltipWrapper>
        )
      },
      accessor(verdi: OppgaveV2): string {
        return formaterNavn(verdi.bruker?.navn || '')
      },
    },
    {
      key: 'fnr',
      name: 'Fødselsnr.',
      width: 135,
      render(oppgave: OppgaveV2) {
        return <TekstCell value={formaterFødselsnummer(oppgave?.fnr || '-')} />
      },
    },
    {
      key: 'opprettet',
      name: 'Mottatt dato',
      width: 152,
      render(oppgave: OppgaveV2) {
        return <TekstCell value={formaterTidsstempel(oppgave.opprettetTidspunkt)} />
      },
    },
  ]

  const {
    sort,
    sortedElements: sorterteDokumenter,
    onSortChange,
  } = useSortedElements<OppgaveV2>(oppgaver, kolonner, {
    orderBy: 'opprettetTidspunkt',
    direction: 'descending',
  })

  if (error) {
    if (isError(error)) {
      throw Error('Feil med henting av journalposter', { cause: error })
    } else {
      throw Error('Feil med henting av journalposter')
    }
  }

  const hasData = sorterteDokumenter && sorterteDokumenter.length > 0

  return (
    <>
      <Skjermlesertittel>Mottatte dokumenter</Skjermlesertittel>
      <OppgavelisteTabs />
      {isLoading ? (
        <Toast>Henter dokumenter </Toast>
      ) : (
        <Container>
          <Box padding="4">
            {hasData ? (
              <>
                <Table style={{ width: 'initial' }} zebraStripes size="small" sort={sort} onSortChange={onSortChange}>
                  <caption className="sr-only">Mottatt dokumenter</caption>
                  <Table.Header>
                    <Table.Row>
                      {kolonner.map(({ key, name, width }) => (
                        <KolonneHeader key={key} sortKey={key} width={width} sortable>
                          {name}
                        </KolonneHeader>
                      ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {sorterteDokumenter.map((oppgave) => (
                      <LinkRow key={oppgave.journalpostId} path={`/oppgave/${oppgave.oppgaveId}`}>
                        {kolonner.map(({ render, width, key }) => {
                          return (
                            <DataCell
                              key={key}
                              width={width}
                              style={{
                                padding: 'var(--a-spacing-1) 0rem var(--a-spacing-1) var(--a-spacing-3)',
                              }}
                            >
                              {render(oppgave)}
                            </DataCell>
                          )
                        })}
                      </LinkRow>
                    ))}
                  </Table.Body>
                </Table>
              </>
            ) : (
              <IngentingFunnet>Ingen journalføringsoppgaver funnet.</IngentingFunnet>
            )}
          </Box>
        </Container>
      )}
    </>
  )
}

const Container = styled.div`
  min-height: 300px;
  height: calc(100% - 50px);
  width: 100%;
  overflow: auto;
`
