import React from 'react'
import styled from 'styled-components'

import { Panel, Table } from '@navikt/ds-react'

import { TekstCell } from '../../felleskomponenter/table/Celle'
import { Column } from '../../felleskomponenter/table/Column'
import { DataCell, KolonneHeader } from '../../felleskomponenter/table/KolonneHeader'
import { LinkRow } from '../../felleskomponenter/table/LinkRow'
import { useSortedElements } from '../../felleskomponenter/table/useSortedElements'
import { norskTimestamp } from '../../utils/date'
import { formaterFødselsnummer } from '../../utils/stringFormating'
import { isError } from '../../utils/type'

import { IngentingFunnet } from '../../felleskomponenter/IngenOppgaver'
import { Toast } from '../../felleskomponenter/Toast'
import { TooltipWrapper } from '../../felleskomponenter/TooltipWrapper'
import { Skjermlesertittel, TekstMedEllipsis } from '../../felleskomponenter/typografi'
import { OppgaveV2, OppgavestatusLabel } from '../../types/types.internal'
import { OppgavelisteTabs } from '../OppgavelisteTabs'
import { useOppgaveliste } from '../oppgaver/oppgaverHook'
import { OppgaveTildeling } from './DokumentTildeling'

const Container = styled.div`
  min-height: 300px;
  height: calc(100% - 50px);
  width: 100%;
`

const ScrollWrapper = styled.div`
  overflow: auto;
`

export const Dokumentliste: React.FC = () => {
  const { data, isLoading, error } = useOppgaveliste()
  const oppgaver = data?.oppgaver || []

  const kolonner: Column<OppgaveV2>[] = [
    {
      key: 'saksbehandler',
      name: 'Eier',
      width: 160,
      render: (oppgave: OppgaveV2) => <OppgaveTildeling dokumentOppgave={oppgave} />,
      accessor(verdi: OppgaveV2): string {
        return verdi.saksbehandler?.navn || ''
      },
    },
    {
      key: 'beskrivelse',
      name: 'Beskrivelse',
      width: 400,
      render: (oppgave: OppgaveV2) => {
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
      render: (oppgave: OppgaveV2) => <TekstCell value={OppgavestatusLabel.get(oppgave.oppgavestatus)!} />,
    },
    {
      key: 'bruker',
      name: 'Bruker',
      width: 135,
      render: (oppgave: OppgaveV2) => {
        const fulltNavn = oppgave.bruker?.fulltNavn || '-'
        return (
          <TooltipWrapper visTooltip={fulltNavn.length > 20} content={fulltNavn}>
            <TekstMedEllipsis>{fulltNavn}</TekstMedEllipsis>
          </TooltipWrapper>
        )
      },
      accessor(verdi: OppgaveV2): string {
        return verdi.bruker?.fulltNavn || ''
      },
    },
    {
      key: 'fnr',
      name: 'Fødselsnr.',
      width: 135,
      render: (oppgave: OppgaveV2) => <TekstCell value={formaterFødselsnummer(oppgave.bruker.fnr)} />,
    },
    {
      key: 'opprettet',
      name: 'Mottatt dato',
      width: 152,
      render: (oppgave: OppgaveV2) => <TekstCell value={norskTimestamp(oppgave.opprettet)} />,
    },
    /* {
      key: 'frist',
      name: 'Frist',
      width: 100,
      render: (oppgave: OppgaveV2) => <TekstCell value={formaterDato(oppgave.frist)} />,
    },*/
  ]

  const {
    sort,
    sortedElements: sorterteDokumenter,
    onSortChange,
  } = useSortedElements<OppgaveV2>(oppgaver, kolonner, {
    orderBy: 'opprettet',
    direction: 'descending',
  })

  if (error) {
    if (isError(error)) {
      throw Error('Feil med henting av journalposter', { cause: error })
    } else {
      throw Error('Feil med henting av journalposter')
    }
  }

  //useLoadingToast({ isLoading: oppgaver.state === 'loading', message: 'Henter oppgaver' });
  const hasData = sorterteDokumenter && sorterteDokumenter.length > 0
  return (
    <>
      <Skjermlesertittel>Mottatte dokumenter</Skjermlesertittel>
      <OppgavelisteTabs />
      {isLoading ? (
        <Toast>Henter dokumenter </Toast>
      ) : (
        <Container>
          <Panel>
            {hasData ? (
              <ScrollWrapper>
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
                      <LinkRow key={oppgave.journalpostId} path={`/oppgaveliste/dokumenter/${oppgave.journalpostId}`}>
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
              </ScrollWrapper>
            ) : (
              <IngentingFunnet>Ingen dokumenter funnet</IngentingFunnet>
            )}
          </Panel>
        </Container>
      )}
    </>
  )
}

export default Dokumentliste
