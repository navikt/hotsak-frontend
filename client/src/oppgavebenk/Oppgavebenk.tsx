import { Panel, Table } from '@navikt/ds-react'
import React from 'react'
import styled from 'styled-components'

import { DataCell, KolonneHeader } from '../felleskomponenter/table/KolonneHeader'
import { LinkRow } from '../felleskomponenter/table/LinkRow'
import { capitalize, capitalizeName, formaterFødselsnummer } from '../utils/stringFormating'
import { isError } from '../utils/type'

import { IngentingFunnet } from '../felleskomponenter/IngenOppgaver'
import { Toast } from '../felleskomponenter/Toast'
import { EllipsisCell, TekstCell } from '../felleskomponenter/table/Celle'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import { OppgaveV2, OppgavestatusLabel, Oppgavetype } from '../types/types.internal'
import { formaterDato, formaterTidsstempel } from '../utils/dato'
import { Oppgavetildeling } from './Oppgavetildeling'
import { useOppgavelisteV2 } from './useOppgavelisteV2'

export function Oppgavebenk() {
  //const [sakerFilter, setSakerFilter] = useLocalStorageState('sakerFilter', SakerFilter.UFORDELTE)
  //const [statusFilter, setStatusFilter] = useLocalStorageState('statusFilter', OppgaveStatusType.ALLE)
  //const [områdeFilter, setOmrådeFilter] = useLocalStorageState('områdeFilter', OmrådeFilter.ALLE)
  //const [sakstypeFilter, setSakstypeFilter] = useLocalStorageState('sakstypeFilter', SakstypeFilter.ALLE)
  //const [currentPage, setCurrentPage] = useLocalStorageState('currentPage', 1)
  //const [sort, setSort] = useLocalStorageState<SortState>('sortState', { orderBy: 'MOTTATT', direction: 'ascending' })

  const { oppgaver, isLoading, error } = useOppgavelisteV2(
    1
    /*
      currentPage, sort, {
      sakerFilter,
      statusFilter,
      sakstypeFilter,
      områdeFilter,
    }
    */
  )

  /*
  const handleFilter = (handler: (...args: any[]) => any, value: SakerFilter | OppgaveStatusType | OmrådeFilter) => {
    handler(value)
    setCurrentPage(1)
  }
  */

  /*
  const clearFilters = () => {
    setSakerFilter(SakerFilter.UFORDELTE)
    setStatusFilter(OppgaveStatusType.ALLE)
    setSakstypeFilter(SakstypeFilter.ALLE)
    setOmrådeFilter(OmrådeFilter.ALLE)
    setCurrentPage(1)
  }
  */

  /*
  frist 
  */

  const kolonner = [
    { key: 'EIER', name: 'Eier', width: 152, render: (oppgave: OppgaveV2) => <Oppgavetildeling oppgave={oppgave} /> },
    {
      key: 'STATUS',
      name: 'Status',
      width: 124,
      render: (oppgave: OppgaveV2) => <TekstCell value={OppgavestatusLabel.get(oppgave.oppgavestatus) ?? ''} />,
    },
    {
      key: 'TYPE',
      name: 'Type',
      width: 134,
      render: (oppgave: OppgaveV2) => <TekstCell value={capitalize(oppgave.oppgavetype)} />,
    },
    {
      key: 'FUNKSJONSNEDSETTELSE',
      name: 'Område',
      width: 152,
      render: (oppgave: OppgaveV2) => <EllipsisCell minLength={18} value={capitalize(oppgave.område.join(', '))} />,
    },
    {
      key: 'SØKNAD_OM',
      name: 'Beskrivelse',
      width: 192,
      render: (oppgave: OppgaveV2) => (
        <EllipsisCell
          minLength={20}
          value={capitalize(oppgave.beskrivelse.replace('Søknad om:', '').replace('Bestilling av:', '').trim())}
        />
      ),
    },
    {
      key: 'BRUKER',
      name: 'Bruker',
      width: 188,
      render: (oppgave: OppgaveV2) => (
        <EllipsisCell minLength={20} value={capitalizeName(oppgave.bruker.fulltNavn || '-')} />
      ),
    },
    {
      key: 'FØDSELSNUMMER',
      name: 'Fødselsnr.',
      width: 124,
      render: (oppgave: OppgaveV2) => <TekstCell value={formaterFødselsnummer(oppgave.bruker.fnr)} />,
    },
    {
      key: 'BOSTED',
      name: 'Kommune / bydel',
      width: 165,
      render: (oppgave: OppgaveV2) => (
        <EllipsisCell minLength={18} value={oppgave.bydel ? oppgave.bydel.navn : oppgave?.kommune?.navn || '-'} />
      ),
    },
    {
      key: 'FORMIDLER',
      name: 'Innsender',
      width: 164,
      render: (oppgave: OppgaveV2) => <EllipsisCell minLength={19} value={oppgave?.innsender?.fulltNavn || '-'} />,
    },
    {
      key: 'MOTTATT',
      name: 'Mottatt dato',
      width: 140,
      render: (oppgave: OppgaveV2) => <TekstCell value={formaterTidsstempel(oppgave.opprettet)} />,
    },
    /*{
      key: 'ENHET',
      name: 'Enhet',
      width: 140,
      render: (oppgave: OppgaveV2) => <TekstCell value={oppgave.enhet.enhetsnavn} />,
    },*/
    {
      key: 'FRIST',
      name: 'Frist',
      width: 140,
      render: (oppgave: OppgaveV2) => <TekstCell value={formaterDato(oppgave.frist)} />,
    },
    /*{
      key: 'MENU',
      sortable: false,
      render: (oppgave: OppgaveV2) => (
        <MenyKnapp
          sakId={oppgave.sakId}
          status={oppgave.oppgavestatus}
          tildeltSaksbehandler={oppgave.saksbehandler}
          kanTildeles={oppgave.ka}
          onMutate={mutate}
        />
      ),
    }*/
  ]

  if (error) {
    if (isError(error)) {
      throw Error('Feil med henting av oppgaver', { cause: error })
    } else {
      throw Error('Feil med henting av oppgaver')
    }
  }

  const hasData = oppgaver && oppgaver.length > 0

  return (
    <>
      <Skjermlesertittel>Oppgaveliste</Skjermlesertittel>
      {/*<Filters onClear={clearFilters}>
        <FilterDropdown
          handleChange={(filterValue: SakerFilter) => {
            handleFilter(setSakerFilter, filterValue)
          }}
          label="Saker"
          value={sakerFilter}
          options={SakerFilterLabel}
        />
        <FilterDropdown
          handleChange={(filterValue: SakerFilter) => {
            handleFilter(setStatusFilter, filterValue)
          }}
          label="Status"
          value={statusFilter}
          options={OppgaveStatusLabel}
        />
        {
          <FilterDropdown
            handleChange={(filterValue: SakerFilter) => {
              handleFilter(setSakstypeFilter, filterValue)
            }}
            label="Sakstype"
            value={sakstypeFilter}
            options={SakstypeFilterLabel}
          />
        }
        <FilterDropdown
          handleChange={(filterValue: SakerFilter) => {
            handleFilter(setOmrådeFilter, filterValue)
          }}
          label="Område"
          value={områdeFilter}
          options={OmrådeFilterLabel}
        />
        </Filters>*/}

      {isLoading ? (
        <Toast>Henter oppgaver </Toast>
      ) : (
        <Container>
          <Panel>
            {hasData ? (
              <ScrollWrapper>
                <Table
                  style={{ width: 'initial' }}
                  zebraStripes
                  size="small"
                  //sort={sort}
                  /*onSortChange={(sortKey) => {
                    setSort({
                      orderBy: sortKey || 'MOTTATT',
                      direction: sort?.direction === 'ascending' ? 'descending' : 'ascending',
                    })
                  }}*/
                >
                  <caption className="sr-only">Oppgaveliste</caption>
                  <Table.Header>
                    <Table.Row>
                      {kolonner.map(({ key, name, /*sortable = true,*/ width }) => (
                        <KolonneHeader key={key} /*sortable={sortable} */ sortKey={key} width={width}>
                          {name}
                        </KolonneHeader>
                      ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {oppgaver.map((oppgave: OppgaveV2) => (
                      <LinkRow
                        key={oppgave.id}
                        path={
                          oppgave.oppgavetype !== Oppgavetype.JOURNALFØRING
                            ? `/dokument/${oppgave.journalpostId}`
                            : `/sak/${oppgave.sakId}`
                        }
                      >
                        {kolonner.map(({ render, width, key }) => (
                          <DataCell
                            key={key}
                            width={width}
                            style={{
                              padding: 'var(--a-spacing-1) 0rem var(--a-spacing-1) var(--a-spacing-3)',
                            }}
                          >
                            {render(oppgave)}
                          </DataCell>
                        ))}
                      </LinkRow>
                    ))}
                  </Table.Body>
                </Table>

                {/*<Paging
                  totalCount={totalCount}
                  currentPage={currentPage}
                  onPageChange={(page: number) => setCurrentPage(page)}
                        />*/}
              </ScrollWrapper>
            ) : (
              <IngentingFunnet>Ingen oppgaver funnet</IngentingFunnet>
            )}
          </Panel>
        </Container>
      )}
    </>
  )
}

const Container = styled.div`
  min-height: 300px;
  height: calc(100% - 50px);
  width: 100%;
`

const ScrollWrapper = styled.div`
  overflow: auto;
`
