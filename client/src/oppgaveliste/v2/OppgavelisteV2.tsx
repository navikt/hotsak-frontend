import { Box, Link, Table } from '@navikt/ds-react'
import styled from 'styled-components'

import { IngentingFunnet } from '../../felleskomponenter/IngentingFunnet.tsx'
import { Paginering } from '../../felleskomponenter/Paginering.tsx'
import { EllipsisCell, TekstCell } from '../../felleskomponenter/table/Celle.tsx'
import { DataCell, KolonneHeader } from '../../felleskomponenter/table/KolonneHeader.tsx'
import type { Tabellkolonne } from '../../felleskomponenter/table/Tabellkolonne.ts'
import { Toast } from '../../felleskomponenter/toast/Toast.tsx'
import { Skjermlesertittel } from '../../felleskomponenter/typografi.tsx'
import { oppgaveIdUtenPrefix, OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { formaterDato, formaterTidsstempel } from '../../utils/dato.ts'
import { formaterFødselsnummer, storForbokstavIAlleOrd, storForbokstavIOrd } from '../../utils/formater.ts'
import { isError } from '../../utils/type.ts'
import { OppgavelisteTabs } from '../OppgavelisteTabs.tsx'
import { TaOppgaveIOppgavelisteButton } from '../TaOppgaveIOppgavelisteButton.tsx'
import { useOppgaveFilterContext } from './OppgaveFilterContext.tsx'
import { Oppgavefilter } from './OppgaveFilter.tsx'
import { useOppgavelisteV2 } from './useOppgavelisteV2.ts'

export default function OppgavelisteV2() {
  const { tildeltFilter, gjelderFilter, currentPage, setCurrentPage, sort, setSort } = useOppgaveFilterContext()

  const { oppgaver, pageNumber, pageSize, isLoading, error, totalElements } = useOppgavelisteV2(
    currentPage,
    100,
    sort,
    {
      tildeltFilter,
      oppgavetypeFilter: [],
      gjelderFilter,
    }
  )

  const kolonner: ReadonlyArray<Tabellkolonne<OppgaveV2>> = [
    {
      key: 'EIER',
      name: 'Eier',
      width: 155,
      render(oppgave) {
        return <TaOppgaveIOppgavelisteButton oppgave={oppgave} kanTildeles />
      },
    },
    {
      key: 'OPPRETTET_TIDSPUNKT',
      name: 'Opprettet',
      sortable: true,
      width: 122,
      render(oppgave) {
        return <TekstCell value={formaterTidsstempel(oppgave.opprettetTidspunkt)} />
      },
    },
    {
      key: 'ENDRET_TIDSPUNKT',
      name: 'Endret',
      sortable: true,
      width: 122,
      render(oppgave) {
        return <TekstCell value={formaterTidsstempel(oppgave.endretTidspunkt)} />
      },
    },
    {
      key: 'GJELDER',
      name: 'Gjelder',
      width: 140,
      render(oppgave) {
        return <TekstCell value={oppgave.gjelder ?? ''} />
      },
    },
    {
      /* Workaround for at beskrivelsen fra Gosys enn så lenge
        er en lang streng med alle hendelser og kommentarer skilt med \n
        dette filtreres vekk under for å gjøre beskrivelsen mer leslig i oppgavelista 
        forhåpentligvis blir dette bedre i neste versjon av Gosys API-et */
      key: 'BESKRIVELSE',
      name: 'Beskrivelse',
      width: 175,
      render(oppgave) {
        return (
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
        )
      },
    },

    {
      key: 'OPPGAVETYPE',
      name: 'Oppgavetype',
      width: 152,
      render(oppgave) {
        return <EllipsisCell minLength={18} value={storForbokstavIAlleOrd(oppgave.oppgavetype.replaceAll('_', ' '))} />
      },
    },
    {
      key: 'PRIORITET',
      name: 'Prioritet',
      width: 120,
      render(oppgave) {
        return <EllipsisCell minLength={20} value={storForbokstavIAlleOrd(oppgave.prioritet)} />
      },
    },
    {
      key: 'FØDSELSNUMMER',
      name: 'Fødselsnr.',
      width: 124,
      render(oppgave) {
        return <TekstCell value={formaterFødselsnummer(oppgave.fnr || '-')} />
      },
    },
    {
      key: 'FRIST',
      name: 'Frist',
      sortable: true,
      width: 114,
      render(oppgave) {
        return <TekstCell value={formaterDato(oppgave.fristFerdigstillelse)} />
      },
    },
    {
      key: 'GOSYS',
      name: 'Gosys',
      width: 96,
      render(oppgave) {
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
      render(oppgave) {
        return (
          <Link variant="neutral" href={`/oppgave/${oppgave.oppgaveId}`}>
            {oppgave.sakId}
          </Link>
        )
      },
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
                              padding: 'var(--ax-space-4) 0rem var(--ax-space-4) var(---ax-space-12)',
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

const Container = styled.div`
  min-height: 300px;
`
