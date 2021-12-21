import React from 'react'
import styled from 'styled-components/macro'

import { Body } from '../felleskomponenter/table/Body'
import { Cell } from '../felleskomponenter/table/Cell'
import { Header } from '../felleskomponenter/table/Header'
import { LinkRow } from '../felleskomponenter/table/LinkRow'
import { Table } from '../felleskomponenter/table/Table'
import { capitalize } from '../utils/stringFormating'

//import { OptionsButton } from '../felleskomponenter/kjøttbolle/OptionsButton'
import { Oppgave, OppgaveStatusLabel, SortOrder } from '../types/types.internal'
import { useTabContext } from './Oppgaveliste'
import { Bosted } from './kolonner/Bosted'
import { Funksjonsnedsettelse } from './kolonner/Funksjonsnedsettelse'
import { Fødselsnummer } from './kolonner/Fødselsnummer'
import { Gjelder } from './kolonner/Gjelder'
import { Hjelpemiddelbruker } from './kolonner/Hjelpemiddelbruker'
import { Motatt } from './kolonner/Motatt'
import { Status } from './kolonner/Status'
import { Tildeling } from './kolonner/Tildeling'
import { TabType } from './tabs'
import { FormidlerCelle } from './kolonner/Formidler'
import { SortButton } from './sorting/SortButton'

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

/*export const OppgaveKolonner: { [key in Kolonne]: string} = {
    EIER: "saksbehandler.navn",
    FØDSELSNUMMER: "personinfo.fnr",
    HJELPEMIDDELBRUKER: "personinfo.fornavn",
    FUNKSJONSNEDSETTELSE: "personinfo.funksjonsnedsettelser",
    SØKNAD_OM: "sak.soknadGjelder",
    BOSTED: "personinfo.poststed",
    FORMIDLER: "formidler.navn",
    STATUS: "status.status",
    MOTTATT: "sak.opprettet",
}*/   

export enum Kolonne {
  EIER = 'EIER',
  FØDSELSNUMMER = 'FØDSELSNUMMER',
  HJELPEMIDDELBRUKER = 'HJELPEMIDDELBRUKER',
  FUNKSJONSNEDSETTELSE = 'FUNKSJONSNEDSETTELSE',
  SØKNAD_OM = 'SØKNAD_OM',
  BOSTED = 'BOSTED',
  FORMIDLER = 'FORMIDLER',
  STATUS = 'STATUS',
  MOTTATT = 'MOTTATT',
}

interface OppgaverTableProps {
  oppgaver: Oppgave[]
  sortBy: {
    label: Kolonne
    sortOrder: SortOrder
  }
  onSort: Function
}


export const OppgaverTable = React.memo(({ oppgaver, sortBy, onSort }: OppgaverTableProps) => {
  const { aktivTab } = useTabContext()

  let tab: { label: string }
  switch (aktivTab) {
    case TabType.Alle:
      tab = { label: 'Alle saker fordelt til min enhet' }
      break
    case TabType.Mine:
      tab = { label: 'Saker som er tildelt meg' }
      break
    case TabType.Ferdigstilte:
      tab = { label: 'Alle innvilgede saker fordelt til min enhet' }
      break
    case TabType.OverførtGosys:
      tab = { label: 'Saker som er overført Gosys' }
      break
    case TabType.Ufordelte:
      tab = { label: 'Saker som ikke er tildelt en saksbehandler enda' }
      break
  }

  return (
    <Container>
      <ScrollableX>
        <Table aria-label={tab.label}>
          <thead>
            <tr></tr>
            <tr>
              <Header scope="col" colSpan={1}>
              <SortButton
                  active={sortBy.label === Kolonne.EIER}
                  column={Kolonne.EIER}
                  sortOrder={sortBy.sortOrder}
                  onClick={onSort}
                >
                  Eier
                </SortButton>
              </Header>
              <Header scope="col" colSpan={1}>
                <SortButton
                  active={sortBy.label === Kolonne.FØDSELSNUMMER}
                  column={Kolonne.FØDSELSNUMMER}
                  sortOrder={sortBy.sortOrder}
                  onClick={onSort}
                >
                  Fødselsnummer
                </SortButton>
              </Header>
              <Header scope="col" colSpan={1}>
                <SortButton
                  active={sortBy.label === Kolonne.HJELPEMIDDELBRUKER}
                  column={Kolonne.HJELPEMIDDELBRUKER}
                  sortOrder={sortBy.sortOrder}
                  onClick={onSort}
                >
                  Hjelpemiddelbruker
                </SortButton>
              </Header>
              <Header scope="col" colSpan={1}>
                  <SortButton
                  active={sortBy.label === Kolonne.FUNKSJONSNEDSETTELSE}
                  column={Kolonne.FUNKSJONSNEDSETTELSE}
                  sortOrder={sortBy.sortOrder}
                  onClick={onSort}
                >
                  Område
                </SortButton>
              </Header>
              <Header scope="col" colSpan={1}>
              <SortButton
                  active={sortBy.label === Kolonne.SØKNAD_OM}
                  column={Kolonne.SØKNAD_OM}
                  sortOrder={sortBy.sortOrder}
                  onClick={onSort}
                >
                  Søknad om
                </SortButton>
              </Header>
              <Header scope="col" colSpan={1}>
              <SortButton
                  active={sortBy.label === Kolonne.BOSTED}
                  column={Kolonne.BOSTED}
                  sortOrder={sortBy.sortOrder}
                  onClick={onSort}
                >
                  Bosted
                </SortButton>
              </Header>
              <Header scope="col" colSpan={1}>
              <SortButton
                  active={sortBy.label === Kolonne.FORMIDLER}
                  column={Kolonne.FORMIDLER}
                  sortOrder={sortBy.sortOrder}
                  onClick={onSort}
                >
                  Formidler
                </SortButton>
              </Header>
              <Header scope="col" colSpan={1}>
              <SortButton
                  active={sortBy.label === Kolonne.STATUS}
                  column={Kolonne.STATUS}
                  sortOrder={sortBy.sortOrder}
                  onClick={onSort}
                >
                  Status
                </SortButton>
              </Header>
              <Header scope="col" colSpan={1}>
              <SortButton
                  active={sortBy.label === Kolonne.MOTTATT}
                  column={Kolonne.MOTTATT}
                  sortOrder={sortBy.sortOrder}
                  onClick={onSort}
                >
                  Mottatt dato
                </SortButton>
              </Header>
              {/*tab.kolonner.includes(Kolonne.KJØTTBOLLE) && <Header scope="col" colSpan={1} />*/}
            </tr>
          </thead>
          <Body>
            {oppgaver.map((oppgave) => (
              <LinkRow key={oppgave.saksid} saksnummer={oppgave.saksid}>
                <Cell>
                  <Tildeling oppgave={oppgave} />
                </Cell>
                <Cell>
                  <Fødselsnummer fødselsnummer={oppgave.personinformasjon.fnr} />
                </Cell>
                <Cell>
                  <Hjelpemiddelbruker person={oppgave.personinformasjon} saksID={oppgave.saksid} />
                </Cell>
                <Cell>
                  <Funksjonsnedsettelse
                    funksjonsnedsettelser={oppgave.personinformasjon.funksjonsnedsettelse}
                    saksID={oppgave.saksid}
                  />
                </Cell>
                <Cell>
                  <Gjelder søknadOm={capitalize(oppgave.søknadOm)} saksID={oppgave.saksid} />
                </Cell>
                <Cell>
                  <Bosted bosted={oppgave.personinformasjon.poststed} saksID={oppgave.saksid} />
                </Cell>
                <Cell>
                  <FormidlerCelle saksID={oppgave.saksid} formidlerNavn={oppgave.formidlerNavn}></FormidlerCelle>
                </Cell>
                <Cell>
                  <Status status={OppgaveStatusLabel.get(oppgave.status)!} saksID={oppgave.saksid} />
                </Cell>
                <Cell>
                  <Motatt dato={oppgave.mottattDato} />
                </Cell>
                {/*tab.kolonner.includes(Kolonne.KJØTTBOLLE) && (
                  <Cell style={{ width: '100%' }}>{<OptionsButton oppgave={oppgave} />}</Cell>
                )*/}
              </LinkRow>
            ))}
          </Body>
        </Table>
      </ScrollableX>
    </Container>
  )
})
