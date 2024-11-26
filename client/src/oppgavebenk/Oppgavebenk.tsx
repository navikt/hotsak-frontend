import { Panel, Table } from '@navikt/ds-react'
import styled from 'styled-components'

import { DataCell, KolonneHeader } from '../felleskomponenter/table/KolonneHeader'
import { LinkRow } from '../felleskomponenter/table/LinkRow'
import { formaterFødselsnummer, formaterNavn, storForbokstavIAlleOrd, storForbokstavIOrd } from '../utils/formater'
import { isError } from '../utils/type'

import { IngentingFunnet } from '../felleskomponenter/IngenOppgaver'
import { Toast } from '../felleskomponenter/Toast'
import { EllipsisCell, TekstCell } from '../felleskomponenter/table/Celle'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import { OppgaveApiOppgave } from '../types/experimentalTypes'
import { Oppgavetype } from '../types/types.internal'
import { formaterDato } from '../utils/dato'
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
    {
      key: 'REGISTRERT',
      name: 'Registrert',
      width: 114,
      render: (oppgave: OppgaveApiOppgave) => <TekstCell value={formaterDato(oppgave.opprettetTidspunkt)} />,
    },
    {
      key: 'ENDRET',
      name: 'Endret',
      width: 114,
      render: (oppgave: OppgaveApiOppgave) => <TekstCell value={formaterDato(oppgave.endretTidspunkt)} />,
    },
    {
      key: 'GJELDER',
      name: 'Gjelder',
      width: 140,
      render: (oppgave: OppgaveApiOppgave) => (
        <TekstCell
          value={`${storForbokstavIAlleOrd([oppgave.behandlingstema, oppgave.behandlingstype].filter(Boolean).join(', '))}`}
        />
      ),
    },
    {
      key: 'BESKRIVELSE',
      name: 'Beskrivelse',
      width: 175,
      render: (oppgave: OppgaveApiOppgave) => (
        <EllipsisCell
          minLength={18}
          value={storForbokstavIOrd(oppgave.beskrivelse?.toLocaleLowerCase().replace('søknad om: ', ''))}
        />
      ),
    },

    {
      key: 'OPPGAVETYPE',
      name: 'Oppgavetype',
      width: 152,
      render: (oppgave: OppgaveApiOppgave) => (
        <EllipsisCell minLength={18} value={storForbokstavIAlleOrd(oppgave.oppgavetype.replaceAll('_', ' '))} />
      ),
    },
    {
      key: 'PRIORITET',
      name: 'Prioritet',
      width: 120,
      render: (oppgave: OppgaveApiOppgave) => (
        <EllipsisCell minLength={20} value={storForbokstavIAlleOrd(oppgave.prioritet)} />
      ),
    },
    {
      key: 'BRUKER',
      name: 'Bruker',
      width: 188,
      render: (oppgave: OppgaveApiOppgave) => (
        <EllipsisCell minLength={20} value={formaterNavn(oppgave?.bruker?.navn) || '-'} />
      ),
    },
    {
      key: 'FØDSELSNUMMER',
      name: 'Fødselsnr.',
      width: 124,
      render: (oppgave: OppgaveApiOppgave) => <TekstCell value={formaterFødselsnummer(oppgave.fnr || '-')} />,
    },
    {
      key: 'FRIST',
      name: 'Frist',
      width: 114,
      render: (oppgave: OppgaveApiOppgave) => <TekstCell value={formaterDato(oppgave.fristFerdigstillelse)} />,
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
                    {oppgaver.map((oppgave: OppgaveApiOppgave) => (
                      <LinkRow
                        key={oppgave.oppgaveId}
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
