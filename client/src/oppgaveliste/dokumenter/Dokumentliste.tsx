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
import { TekstMedEllipsis } from '../../felleskomponenter/TekstMedEllipsis'
import { Toast } from '../../felleskomponenter/Toast'
import { TooltipWrapper } from '../../felleskomponenter/TooltipWrapper'
import { Skjermlesertittel } from '../../felleskomponenter/typografi'
import { DokumentStatusLabel, Journalpost } from '../../types/types.internal'
import { OppgavelisteTabs } from '../OppgavelisteTabs'
import { DokumentTildeling } from './DokumentTildeling'
// Flytte til felles
import { useDokumentliste } from './dokumentHook'

const Container = styled.div`
  min-height: 300px;
  height: calc(100% - 50px);
  width: 100%;
`

const ScrollWrapper = styled.div`
  overflow: auto;
`

export const Dokumentliste: React.FC = () => {
  const { dokumenter, isLoading, error } = useDokumentliste()

  const kolonner: Column<Journalpost>[] = [
    {
      key: 'saksbehandler',
      name: 'Eier',
      width: 160,
      render: (journalpost: Journalpost) => <DokumentTildeling dokumentOppgave={journalpost} />,
      accessor(verdi: Journalpost): string {
        return verdi.saksbehandler?.navn || ''
      },
    },
    {
      key: 'tittel',
      name: 'Beskrivelse',
      width: 400,
      render: (journalpost: Journalpost) => {
        const journalpostTittel = journalpost.tittel || 'Uten tittel'
        return (
          <TooltipWrapper visTooltip={journalpostTittel.length > 40} content={journalpostTittel}>
            <TekstMedEllipsis>{journalpost.tittel}</TekstMedEllipsis>
          </TooltipWrapper>
        )
      },
    },
    {
      key: 'status',
      name: 'Status',
      width: 150,
      render: (journalpost: Journalpost) => <TekstCell value={DokumentStatusLabel.get(journalpost.status)!} />,
    },
    {
      key: 'innsender',
      name: 'Innsender',
      width: 135,
      render: (journalpost: Journalpost) => {
        const formatertNavn = journalpost.innsender?.navn || ''
        return (
          <TooltipWrapper visTooltip={formatertNavn.length > 20} content={formatertNavn}>
            <TekstMedEllipsis>{formatertNavn}</TekstMedEllipsis>
          </TooltipWrapper>
        )
      },
      accessor(verdi: Journalpost): string {
        return verdi.innsender?.navn || ''
      },
    },
    {
      key: 'fnrInnsender',
      name: 'Fødselsnr.',
      width: 135,
      render: (journalpost: Journalpost) => <TekstCell value={formaterFødselsnummer(journalpost.fnrInnsender)} />,
    },
    {
      key: 'journalpostOpprettetTid',
      name: 'Mottatt dato',
      width: 152,
      render: (journalpost: Journalpost) => <TekstCell value={norskTimestamp(journalpost.journalpostOpprettetTid)} />,
    },
  ]

  const {
    sort,
    sortedElements: sorterteDokumenter,
    onSortChange,
  } = useSortedElements<Journalpost>(dokumenter, kolonner, {
    orderBy: 'journalpostOpprettetTid',
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
                    {sorterteDokumenter.map((dokument) => (
                      <LinkRow key={dokument.journalpostID} path={`/oppgaveliste/dokumenter/${dokument.journalpostID}`}>
                        {kolonner.map(({ render, width, key }) => (
                          <DataCell
                            key={key}
                            width={width}
                            style={{
                              padding: 'var(--a-spacing-1) 0rem var(--a-spacing-1) var(--a-spacing-3)',
                            }}
                          >
                            {render(dokument)}
                          </DataCell>
                        ))}
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
