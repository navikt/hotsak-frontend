import React from 'react'
import styled from 'styled-components'

import { Panel, Table } from '@navikt/ds-react'

import { TekstCell } from '../../felleskomponenter/table/Celle'
import { DataCell, KolonneHeader } from '../../felleskomponenter/table/KolonneHeader'
import { LinkRow } from '../../felleskomponenter/table/LinkRow'
import { norskTimestamp } from '../../utils/date'
import { formaterFødselsnummer } from '../../utils/stringFormating'
import { isError } from '../../utils/type'

import { IngentingFunnet } from '../../felleskomponenter/IngenOppgaver'
import { Toast } from '../../felleskomponenter/Toast'
import { Skjermlesertittel, Tekst } from '../../felleskomponenter/typografi'
import { DokumentOppgave, DokumentStatusLabel } from '../../types/types.internal'
import { OppgavelisteTabs } from '../OppgavelisteTabs'
import { DokumentTildeling } from './DokumentTildeling'
// Flytte til felles
import { useDokumentListe } from './dokumentlisteHook'

const Container = styled.div`
  min-height: 300px;
  height: calc(100% - 50px);
  width: 100%;
`

const ScrollWrapper = styled.div`
  overflow: auto;
`

export const Dokumentliste: React.FC = () => {
  const { dokumenter, isLoading, error } = useDokumentListe()

  const kolonner = [
    {
      key: 'EIER',
      name: 'Eier',
      width: 160,
      render: (dokument: DokumentOppgave) => <DokumentTildeling dokumentOppgave={dokument} />,
    },
    {
      key: 'BESKRIVELSE',
      name: 'Beskrivelse',
      width: 300,
      render: (dokument: DokumentOppgave) => <TekstCell value={dokument.tittel} />,
    },
    {
      key: 'STATUS',
      name: 'Status',
      width: 140,
      render: (dokument: DokumentOppgave) => <TekstCell value={DokumentStatusLabel.get(dokument.status)!} />,
    },
    {
      key: 'INNSENDER',
      name: 'Innsender',
      width: 135,
      render: (dokument: DokumentOppgave) => <TekstCell value={formaterFødselsnummer(dokument.fnr)} />,
    },
    {
      key: 'MOTTATT_DATO',
      name: 'Mottatt dato',
      width: 152,
      render: (dokument: DokumentOppgave) => <TekstCell value={norskTimestamp(dokument.journalpostOpprettetDato)} />,
    },
  ]

  if (error) {
    if (isError(error)) {
      throw Error('Feil med henting av dokumentoppgaver', { cause: error })
    } else {
      throw Error('Feil med henting av dokumentoppgaver')
    }
  }

  //useLoadingToast({ isLoading: oppgaver.state === 'loading', message: 'Henter oppgaver' });
  const hasData = dokumenter && dokumenter.length > 0
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
                <Table
                  style={{ width: 'initial' }}
                  zebraStripes
                  size="small"
                  sort={{ orderBy: 'MOTTATT_DATO', direction: 'ascending' }}
                >
                  <caption className="sr-only">Mottatt dokumenter</caption>
                  <Table.Header>
                    <Table.Row>
                      {kolonner.map(({ key, name, width }) => (
                        <KolonneHeader key={key} sortKey={key} width={width}>
                          {name}
                        </KolonneHeader>
                      ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {dokumenter.map((dokument) => (
                      <LinkRow key={dokument.journalpostID} path={`/dokument/dokument.dokumentid`}>
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
