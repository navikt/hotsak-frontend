import React from 'react'
import styled from 'styled-components/macro'

import { Body } from '../felleskomponenter/table/Body'
import { ButtonCell, Cell } from '../felleskomponenter/table/Cell'
import { Header } from '../felleskomponenter/table/Header'
import { LinkRow } from '../felleskomponenter/table/LinkRow'
import { Table } from '../felleskomponenter/table/Table'
import { capitalize } from '../utils/stringFormating'
import { Oppgave, OppgaveStatusLabel, SortOrder } from '../types/types.internal'
import { Bosted } from './kolonner/Bosted'
import { Funksjonsnedsettelse } from './kolonner/Funksjonsnedsettelse'
import { Fødselsnummer } from './kolonner/Fødselsnummer'
import { Gjelder } from './kolonner/Gjelder'
import { Hjelpemiddelbruker } from './kolonner/Hjelpemiddelbruker'
import { Motatt } from './kolonner/Motatt'
import { Status } from './kolonner/Status'
import { Tildeling } from './kolonner/Tildeling'
import { FormidlerCelle } from './kolonner/Formidler'
import { SortButton } from './sorting/SortButton'
import { MenyKnapp } from './kolonner/MenyKnapp'

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
  onMutate: Function
}

export const OppgaverTable = React.memo(({ oppgaver, sortBy, onSort, onMutate }: OppgaverTableProps) => {
  return (
    <Container>
      <ScrollableX>
        <Table aria-label={'Saker'}>
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
                  active={sortBy.label === Kolonne.FØDSELSNUMMER}
                  column={Kolonne.FØDSELSNUMMER}
                  sortOrder={sortBy.sortOrder}
                  onClick={onSort}
                >
                  Fødselsnr.
                </SortButton>
              </Header>
              <Header scope="col" colSpan={1}>
                <SortButton
                  active={sortBy.label === Kolonne.BOSTED}
                  column={Kolonne.BOSTED}
                  sortOrder={sortBy.sortOrder}
                  onClick={onSort}
                >
                  Kommune / Bydel
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
                  active={sortBy.label === Kolonne.MOTTATT}
                  column={Kolonne.MOTTATT}
                  sortOrder={sortBy.sortOrder}
                  onClick={onSort}
                >
                  Mottatt dato
                </SortButton>
              </Header>
              <Header scope="col" colSpan={1} />
            </tr>
          </thead>
          <Body>
            {oppgaver.map((oppgave) => (
              <LinkRow key={oppgave.saksid} saksnummer={oppgave.saksid}>
                {oppgave.saksbehandler ? (
                  <Cell>
                    <Tildeling oppgave={oppgave} />
                  </Cell>
                ) : (
                  <ButtonCell>
                    <Tildeling oppgave={oppgave} />
                  </ButtonCell>
                )}
                <Cell>
                  <Status status={OppgaveStatusLabel.get(oppgave.status)!} saksID={oppgave.saksid} />
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
                  <Hjelpemiddelbruker person={oppgave.personinformasjon} saksID={oppgave.saksid} />
                </Cell>
                <Cell>
                  <Fødselsnummer fødselsnummer={oppgave.personinformasjon.fnr} />
                </Cell>
                <Cell>
                  <Bosted bosted={oppgave.personinformasjon.bosted} saksID={oppgave.saksid} />
                </Cell>
                <Cell>
                  <FormidlerCelle saksID={oppgave.saksid} formidlerNavn={oppgave.formidlerNavn}></FormidlerCelle>
                </Cell>
                <Cell>
                  <Motatt dato={oppgave.mottattDato} />
                </Cell>
                <Cell>
                  <MenyKnapp oppgave={oppgave} onMutate={onMutate} />
                </Cell>
              </LinkRow>
            ))}
          </Body>
        </Table>
      </ScrollableX>
    </Container>
  )
})
