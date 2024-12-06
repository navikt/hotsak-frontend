import { Box, Link, Table } from '@navikt/ds-react'
import styled from 'styled-components'

import { DataCell, KolonneHeader } from '../felleskomponenter/table/KolonneHeader'
import { formaterFødselsnummer, formaterNavn, storForbokstavIAlleOrd, storForbokstavIOrd } from '../utils/formater'
import { isError } from '../utils/type'

import { IngentingFunnet } from '../felleskomponenter/IngenOppgaver'
import { Toast } from '../felleskomponenter/Toast'
import { EllipsisCell, TekstCell } from '../felleskomponenter/table/Celle'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import { OppgaveApiOppgave, OppgaveGjelderFilter, OppgavetemaLabel } from '../types/experimentalTypes'
import { formaterDato, formaterTidsstempel } from '../utils/dato'
import { useOppgavelisteV2 } from './useOppgavelisteV2'
import { Oppgavetildeling } from './Oppgavetildeling'
import { OppgavelisteTabs } from '../oppgaveliste/OppgavelisteTabs'
import { Oppgavetype } from '../types/types.internal'
import { useLocalStorageState } from '../oppgaveliste/useLocalStorageState'
import { FilterCombobox, FilterDropdown, Filters } from '../oppgaveliste/filter'

export function Oppgavebenk() {
  //const [sakerFilter, setSakerFilter] = useLocalStorageState('sakerFilter', SakerFilter.UFORDELTE)
  const [gjelderFilter, setGjelderFilter] = useLocalStorageState('oppgavebenkGjelderFilter', OppgaveGjelderFilter.ALLE)
  //const [områdeFilter, setOmrådeFilter] = useLocalStorageState('områdeFilter', OmrådeFilter.ALLE)
  //const [sakstypeFilter, setSakstypeFilter] = useLocalStorageState('sakstypeFilter', SakstypeFilter.ALLE)
  //const [currentPage, setCurrentPage] = useLocalStorageState('currentPage', 1)
  //const [sort, setSort] = useLocalStorageState<SortState>('oppgavebenkSortState', { orderBy: 'MOTTATT', direction: 'ascending' })

  const { oppgaver, isLoading, error } = useOppgavelisteV2(
    1,
    { gjelderFilter }
    /*
      currentPage, sort, {
      sakerFilter,
      statusFilter,
      sakstypeFilter,
      områdeFilter,
    }
    */
  )

  const handleFilter = (handler: (...args: any[]) => any, value: OppgaveGjelderFilter) => {
    handler(value)
    //setCurrentPage(1)
  }

  const clearFilters = () => {
    setGjelderFilter(OppgaveGjelderFilter.ALLE)
    //setCurrentPage(1)
  }

  const kolonner = [
    {
      key: 'EIER',
      name: 'Eier',
      width: 155,
      render(oppgave: OppgaveApiOppgave) {
        return <Oppgavetildeling oppgave={oppgave} />
      },
    },
    {
      key: 'REGISTRERT',
      name: 'Registrert',
      width: 122,
      render: (oppgave: OppgaveApiOppgave) => <TekstCell value={formaterTidsstempel(oppgave.opprettetTidspunkt)} />,
    },
    {
      key: 'ENDRET',
      name: 'Endret',
      width: 122,
      render: (oppgave: OppgaveApiOppgave) => <TekstCell value={formaterTidsstempel(oppgave.endretTidspunkt)} />,
    },
    {
      key: 'GJELDER',
      name: 'Gjelder',
      sortable: true,
      width: 140,
      render: (oppgave: OppgaveApiOppgave) => (
        <TekstCell
          value={`${storForbokstavIAlleOrd([oppgave.behandlingstema, oppgave.behandlingstype].filter(Boolean).join('| '))}`}
        />
      ),
    },
    {
      /* Workaround for at beskrivelsen fra gosys enn så lenge 
        er en lang streng med alle hendelser og kommentarer skilt med \n
        dette filtreres vekk under for å gjøre beskrivelsen mer leslig i oppgavelista 
        forhåpentligvis blir dette bedre i neste versjon av Gosys apiet */
      key: 'BESKRIVELSE',
      name: 'Beskrivelse',
      width: 175,
      render: (oppgave: OppgaveApiOppgave) => (
        <EllipsisCell
          minLength={18}
          value={storForbokstavIOrd(
            oppgave.beskrivelse
              ?.toLocaleLowerCase()
              .split('\n')
              .reverse()[0]
              .replace('søknad om: ', '')
              .replace('bestilling av: ', '')
          )}
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
    {
      key: 'GOSYS',
      name: 'Gosys',
      width: 96,
      render: (oppgave: OppgaveApiOppgave) => (
        <Link
          variant="neutral"
          target="_blank"
          href={`https://gosys-q2.dev.intern.nav.no/gosys/oppgavebehandling/oppgave/${oppgave.oppgaveId}`}
        >
          {oppgave.oppgaveId}
        </Link>
      ),
    },
    {
      key: 'HANDLING',
      name: 'Handling',
      width: 96,
      render: (oppgave: OppgaveApiOppgave) => (
        <Link
          variant="neutral"
          href={
            oppgave.oppgavetype === Oppgavetype.JOURNALFØRING
              ? `/oppgaveliste/dokumenter/${oppgave.journalpostId}`
              : `/sak/${oppgave.sakId}/hjelpemidler`
          }
        >
          Gå til
        </Link>
      ),
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
      <OppgavelisteTabs />
      <Filters onClear={clearFilters}>
        <FilterDropdown
          handleChange={(filterValue: OppgavetemaFilter) => {
            handleFilter(setGjelderFilter, filterValue)
          }}
          label="Gjelder"
          value={gjelderFilter}
          options={OppgavetemaLabel}
        />
      </Filters>

      {isLoading ? (
        <Toast>Henter oppgaver </Toast>
      ) : (
        <Container>
          <Box padding={{ sm: '2', md: '10' }}>
            {hasData ? (
              <ScrollWrapper>
                <Table
                  //style={{ width: 'initial' }}
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
                      <Table.Row
                        key={oppgave.oppgaveId}
                        /*path={
                          oppgave.oppgavetype !== Oppgavetype.JOURNALFØRING
                            ? `/dokument/${oppgave.journalpostId}`
                            : `/sak/${oppgave.sakId}`
                        }*/
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
                      </Table.Row>
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
          </Box>
        </Container>
      )}
    </>
  )
}

export default Oppgavebenk

const Container = styled.div`
  min-height: 300px;
  height: calc(100% - 50px);
  width: 100%;
`

const ScrollWrapper = styled.div`
  overflow: auto;
`
