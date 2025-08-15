import { Box, Link, Table } from '@navikt/ds-react'
import styled from 'styled-components'

import { IngentingFunnet } from '../felleskomponenter/IngenOppgaver'
import { EllipsisCell, TekstCell } from '../felleskomponenter/table/Celle'
import { DataCell, KolonneHeader } from '../felleskomponenter/table/KolonneHeader'
import { Toast } from '../felleskomponenter/Toast'
import { Skjermlesertittel } from '../felleskomponenter/typografi'
import { OppgavelisteTabs } from '../oppgaveliste/OppgavelisteTabs'
import { oppgaveIdUtenPrefix, OppgaveV2 } from '../oppgave/oppgaveTypes.ts'
import { formaterDato, formaterTidsstempel } from '../utils/dato'
import { formaterFødselsnummer, formaterNavn, storForbokstavIAlleOrd, storForbokstavIOrd } from '../utils/formater'
import { isError } from '../utils/type'
import { useFilterContext } from './FilterContext'
import { Oppgavefilter } from './OppgaveFilter'
import { Oppgavetildeling } from './Oppgavetildeling'
import { useOppgavelisteV2 } from './useOppgavelisteV2'
import { Paginering } from '../felleskomponenter/Paginering.tsx'

// TODO vise sakId i egen kolonne

export function Oppgavebenk() {
  const { tildeltFilter, gjelderFilter, currentPage, setCurrentPage, sort, setSort } = useFilterContext()

  const { oppgaver, pageNumber, pageSize, isLoading, error, totalElements } = useOppgavelisteV2(currentPage, sort, {
    tildeltFilter,
    gjelderFilter,
  })

  const kolonner = [
    {
      key: 'EIER',
      name: 'Eier',
      width: 155,
      render(oppgave: OppgaveV2) {
        return <Oppgavetildeling oppgave={oppgave} />
      },
    },
    {
      key: 'OPPRETTET_TIDSPUNKT',
      name: 'Opprettet',
      sortable: true,
      width: 122,
      render: (oppgave: OppgaveV2) => <TekstCell value={formaterTidsstempel(oppgave.opprettetTidspunkt)} />,
    },
    {
      key: 'ENDRET_TIDSPUNKT',
      name: 'Endret',
      sortable: true,
      width: 122,
      render: (oppgave: OppgaveV2) => <TekstCell value={formaterTidsstempel(oppgave.endretTidspunkt)} />,
    },
    {
      key: 'GJELDER',
      name: 'Gjelder',
      width: 140,
      render: (oppgave: OppgaveV2) => <TekstCell value={oppgave.gjelder ?? ''} />,
    },
    {
      /* Workaround for at beskrivelsen fra gosys enn så lenge 
        er en lang streng med alle hendelser og kommentarer skilt med \n
        dette filtreres vekk under for å gjøre beskrivelsen mer leslig i oppgavelista 
        forhåpentligvis blir dette bedre i neste versjon av Gosys apiet */
      key: 'BESKRIVELSE',
      name: 'Beskrivelse',
      width: 175,
      render: (oppgave: OppgaveV2) => (
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
      render: (oppgave: OppgaveV2) => (
        <EllipsisCell minLength={18} value={storForbokstavIAlleOrd(oppgave.oppgavetype.replaceAll('_', ' '))} />
      ),
    },
    {
      key: 'PRIORITET',
      name: 'Prioritet',
      width: 120,
      render: (oppgave: OppgaveV2) => <EllipsisCell minLength={20} value={storForbokstavIAlleOrd(oppgave.prioritet)} />,
    },
    {
      key: 'BRUKER',
      name: 'Bruker',
      width: 188,
      render: (oppgave: OppgaveV2) => (
        <EllipsisCell minLength={20} value={formaterNavn(oppgave?.bruker?.navn) || '-'} />
      ),
    },
    {
      key: 'FØDSELSNUMMER',
      name: 'Fødselsnr.',
      width: 124,
      render: (oppgave: OppgaveV2) => <TekstCell value={formaterFødselsnummer(oppgave.fnr || '-')} />,
    },
    {
      key: 'FRIST',
      name: 'Frist',
      sortable: true,
      width: 114,
      render: (oppgave: OppgaveV2) => <TekstCell value={formaterDato(oppgave.fristFerdigstillelse)} />,
    },
    {
      key: 'GOSYS',
      name: 'Gosys',
      width: 96,
      render: (oppgave: OppgaveV2) => {
        const oppgaveId = oppgaveIdUtenPrefix(oppgave.oppgaveId)
        return (
          <Link
            variant="neutral"
            target="_blank"
            href={`https://gosys-q2.dev.intern.nav.no/gosys/oppgavebehandling/oppgave/${oppgaveId}`}
          >
            {oppgaveId}
          </Link>
        )
      },
    },
    {
      key: 'HOTSAK',
      name: 'Hotsak',
      width: 96,
      render: (oppgave: OppgaveV2) => (
        <Link variant="neutral" href={`/oppgave/${oppgave.oppgaveId}`}>
          {oppgave.sakId}
        </Link>
      ),
    },
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
      <Oppgavefilter />
      {isLoading ? (
        <Toast>Henter oppgaver</Toast>
      ) : (
        <Container>
          <Box padding={{ sm: '2', md: '10' }}>
            {hasData ? (
              <>
                <Table
                  //style={{ width: 'initial' }}
                  size="small"
                  sort={sort}
                  onSortChange={(sortKey) => {
                    setSort({
                      orderBy: sortKey || 'MOTTATT',
                      direction: sort?.direction === 'ascending' ? 'descending' : 'ascending',
                    })
                  }}
                >
                  <caption className="sr-only">Oppgaveliste</caption>
                  <Table.Header>
                    <Table.Row>
                      {kolonner.map(({ key, name, sortable = false, width }) => (
                        <KolonneHeader key={key} sortable={sortable} sortKey={key} width={width}>
                          {name}
                        </KolonneHeader>
                      ))}
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    {oppgaver.map((oppgave: OppgaveV2) => (
                      <Table.Row key={oppgave.oppgaveId}>
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
                <Paginering
                  pageNumber={pageNumber}
                  pageSize={pageSize}
                  totalElements={totalElements}
                  tekst="oppgaver"
                  onPageChange={(page) => setCurrentPage(page)}
                />
              </>
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
`
