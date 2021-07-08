import styled from 'styled-components/macro' 
import React from 'react'

import { useTabContext } from '../oppgaveliste/Oppgaveliste'
import { useOppgaveliste } from '../oppgaveliste/oppgavelisteHook'

import {
  TabType,
  /*, useAktivTab*/
} from '../tabs'
import { Oppgave, StatusType } from '../types/types.internal'
import { Body } from './Body'
import { Cell } from './Cell'
//import { FilterButton } from './FilterButton';
import { Header } from './Header'
import { LinkRow } from './LinkRow'
//import { Pagination } from './Pagination';
//import { SortButton } from './SortButton';
import { Table } from './Table'
//import { Bosted } from './rader/Bosted';
//import { Inntektskilde } from './rader/Inntektskilde';
import { Opprettet } from './rader/Opprettet'
//import { Sakstype } from './rader/Sakstype';
import { Status } from './rader/Status'
//import { Søker } from './rader/Søker';
import { Tildeling } from './rader/Tildeling'

//import { OptionsButton } from './rader/kjøttbolle/OptionsButton';

const Container = styled.div`
  min-height: 300px;
`

const ScrollableX = styled.div`
  overflow: auto hidden;
  margin: 0;
  padding: 0;
  height: calc(100% - 50px);
  width: 100%;
`

/*const groupFiltersByColumn = (filters: Filter<Oppgave>[]): Filter<Oppgave>[][] => {
    const groups = filters.reduce((groups: { [key: string]: Filter<Oppgave>[] }, filter: Filter<Oppgave>) => {
        const key = `${filter.column}`;
        return groups[key] ? { ...groups, [key]: [...groups[key], filter] } : { ...groups, [key]: [filter] };
    }, {});

    return Object.values(groups);
};*/

export const OppgaverTable = () => {
  const { aktivTab } = useTabContext()
  const { oppgaver } = useOppgaveliste()

  const filtrerteOppgaver = oppgaver.filter((oppgave) => {
    switch (aktivTab) {
      case TabType.Ufordelte:
        return !oppgave.saksbehandler && oppgave.status !== StatusType.OVERFØRT_GOSYS
      case TabType.OverførtGosys:
        return oppgave.status === StatusType.OVERFØRT_GOSYS
      case TabType.Mine:
        // TODO
        return true
      default:
        return true
    }
  })

  //const paginatedRows: any[] = []
  //const visibleRows = []
  /*const paginatedRows = pagination
        ? sortedRows.slice(pagination.firstVisibleEntry, pagination.lastVisibleEntry + 1)
        : sortedRows;*/

  //const onNavigate = () => removeVarsler();

  return (
    <Container>
      <ScrollableX>
        <Table
          aria-label={
            aktivTab === TabType.Alle
              ? 'Alle saker fordelt til min enhet'
              : aktivTab === TabType.Mine
              ? 'Saker som er tildelt meg'
              : aktivTab === TabType.OverførtGosys
              ? 'Saker som er overført Gosys'
              : 'Saker som ikke er tildelt en saksbehandler enda'
          }
        >
          <thead>
            <tr>
              <Header scope="col" colSpan={1}>
                Eier
              </Header>
              <Header scope="col" colSpan={1}>
                Funksjonsnedsettelse
              </Header>
              <Header scope="col" colSpan={1}>
                Søknad om
              </Header>
              <Header scope="col" colSpan={1}>
                Hjelpemiddelbruker
              </Header>
              <Header scope="col" colSpan={1}>
                Fødselsnummer
              </Header>
              <Header scope="col" colSpan={1}>
                Fødselsdato
              </Header>
              <Header scope="col" colSpan={1}>
                Bosted
              </Header>
              <Header scope="col" colSpan={1}>
                Status
              </Header>
              <Header scope="col" colSpan={1}>
                Mottatt
              </Header>
              <Header scope="col" colSpan={1} />
            </tr>
          </thead>
          <Body>
            {filtrerteOppgaver.map((oppgave) => (
              <LinkRow /*onNavigate={onNavigate>}*/ key={oppgave.saksid}>
                <Cell>
                  <Tildeling oppgave={oppgave} />
                </Cell>
                <Cell>
                  Funksjonsnedsettelse
                  {/*Sakstype/*<Sakstype type={it.periodetype} />*/}
                </Cell>
                <Cell>
                  Søknad om
                  {/*<Bosted stedsnavn={it.boenhet.navn} oppgavereferanse={it.oppgavereferanse} />*/}
                </Cell>
                <Cell>
                  Hjelpemiddelbruker
                  {/*<Inntektskilde type={it.inntektskilde} />*/}
                </Cell>
                <Cell>
                  Fødselsnummer
                  {/*<Status numberOfWarnings={oppgave.antallVarsler} />*/}
                </Cell>
                <Cell>
                  Fødselsdato
                  {/*<Søker personinfo={it.personinfo} oppgavereferanse={it.oppgavereferanse} />*/}
                </Cell>
                <Cell>Bosted</Cell>
                <Cell>Status</Cell>
                <Cell>
                  Mottatt
                  {/*<Opprettet date={oppgave.opprettet} />*/}
                </Cell>
                <Cell style={{ width: '100%' }}>
                  OptionsButton her
                  {/*<OptionsButton oppgave={it} />*/}
                </Cell>
              </LinkRow>
            ))}
          </Body>
        </Table>
      </ScrollableX>
    </Container>
  )
}
