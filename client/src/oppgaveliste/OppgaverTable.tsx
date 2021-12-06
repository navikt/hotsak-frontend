import React from 'react'
import styled from 'styled-components/macro'

import { Body } from '../felleskomponenter/table/Body'
import { Cell } from '../felleskomponenter/table/Cell'
import { Header } from '../felleskomponenter/table/Header'
import { LinkRow } from '../felleskomponenter/table/LinkRow'
import { Table } from '../felleskomponenter/table/Table'
import { capitalize } from '../utils/stringFormating'

//import { OptionsButton } from '../felleskomponenter/kjøttbolle/OptionsButton'
import { Oppgave, OppgaveStatusLabel } from '../types/types.internal'
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

enum Kolonne {
  EIER = 'Eier',
  FØDSELSNUMMER = 'Fødselsnummer',
  HJELPEMIDDELBRUKER = 'Hjelpemiddelbruker',
  FUNKSJONSNEDSETTELSE = 'Funksjonsnedsettelse',
  SØKNAD_OM = 'Søknad om',
  BOSTED = 'Bosted',
  FORMIDLER = 'Formidler',
  STATUS = 'Status',
  MOTTATT = 'Mottatt',
  KJØTTBOLLE = 'Kjøttbolle',
}

const kolonnerMine = [
  Kolonne.FUNKSJONSNEDSETTELSE,
  Kolonne.SØKNAD_OM,
  Kolonne.FØDSELSNUMMER,
  Kolonne.HJELPEMIDDELBRUKER,
  Kolonne.BOSTED,
  Kolonne.FORMIDLER,
  Kolonne.STATUS,
  Kolonne.MOTTATT,
  Kolonne.KJØTTBOLLE,
]

const kolonnerUtfordelte = [
  Kolonne.EIER,
  Kolonne.FUNKSJONSNEDSETTELSE,
  Kolonne.FØDSELSNUMMER,
  Kolonne.HJELPEMIDDELBRUKER,
  Kolonne.BOSTED,
  Kolonne.FORMIDLER,
  Kolonne.MOTTATT,
]

const kolonnerAlleSaker = [
  Kolonne.EIER,
  Kolonne.FUNKSJONSNEDSETTELSE,
  Kolonne.SØKNAD_OM,
  Kolonne.FØDSELSNUMMER,
  Kolonne.HJELPEMIDDELBRUKER,
  Kolonne.BOSTED,
  Kolonne.FORMIDLER,
  Kolonne.STATUS,
  Kolonne.MOTTATT,
  Kolonne.KJØTTBOLLE,
]

interface OppgaverTableProps {
  oppgaver: Oppgave[]
}

const kolonnerOverførstGosys = kolonnerAlleSaker

export const OppgaverTable = React.memo(({ oppgaver }: OppgaverTableProps) => {
  const { aktivTab } = useTabContext()

  let tab: { label: string; kolonner: Kolonne[] }
  switch (aktivTab) {
    case TabType.Alle:
      tab = { label: 'Alle saker fordelt til min enhet', kolonner: kolonnerAlleSaker }
      break
    case TabType.Mine:
      tab = { label: 'Saker som er tildelt meg', kolonner: kolonnerMine }
      break
    case TabType.Ferdigstilte:
      tab = { label: 'Alle innvilgede saker fordelt til min enhet', kolonner: kolonnerAlleSaker }
      break
    case TabType.OverførtGosys:
      tab = { label: 'Saker som er overført Gosys', kolonner: kolonnerOverførstGosys }
      break
    case TabType.Ufordelte:
      tab = { label: 'Saker som ikke er tildelt en saksbehandler enda', kolonner: kolonnerUtfordelte }
      break
  }

  return (
    <Container>
      <ScrollableX>
        <Table aria-label={tab.label}>
          <thead>
              <tr></tr>
            <tr>
              {tab.kolonner.includes(Kolonne.EIER) && (
                <Header scope="col" colSpan={1}>
                  Eier
                </Header>
              )}
              {tab.kolonner.includes(Kolonne.FØDSELSNUMMER) && (
                <Header scope="col" colSpan={1}>
                  Fødselsnummer
                </Header>
              )}
              {tab.kolonner.includes(Kolonne.HJELPEMIDDELBRUKER) && (
                <Header scope="col" colSpan={1}>
                  Hjelpemiddelbruker
                </Header>
              )}
              {tab.kolonner.includes(Kolonne.FUNKSJONSNEDSETTELSE) && (
                <Header scope="col" colSpan={1}>
                  Funksjonsnedsettelse
                </Header>
              )}
              {tab.kolonner.includes(Kolonne.SØKNAD_OM) && (
                <Header scope="col" colSpan={1}>
                  Søknad om
                </Header>
              )}
              {tab.kolonner.includes(Kolonne.BOSTED) && (
                <Header scope="col" colSpan={1}>
                  Bosted
                </Header>
              )}
              {tab.kolonner.includes(Kolonne.FORMIDLER) && (
                <Header scope="col" colSpan={1}>
                  Formidler
                </Header>
              )}
              {tab.kolonner.includes(Kolonne.STATUS) && (
                <Header scope="col" colSpan={1}>
                  Status
                </Header>
              )}
              {tab.kolonner.includes(Kolonne.MOTTATT) && (
                <Header scope="col" colSpan={1}>
                  Mottatt
                </Header>
              )}
              {/*tab.kolonner.includes(Kolonne.KJØTTBOLLE) && <Header scope="col" colSpan={1} />*/}
            </tr>
          </thead>
          <Body>
            {oppgaver.map((oppgave) => (
              <LinkRow key={oppgave.saksid} saksnummer={oppgave.saksid}>
                {tab.kolonner.includes(Kolonne.EIER) && (
                  <Cell>
                    <Tildeling oppgave={oppgave} />
                  </Cell>
                )}
                {tab.kolonner.includes(Kolonne.FØDSELSNUMMER) && (
                  <Cell>
                    <Fødselsnummer fødselsnummer={oppgave.personinformasjon.fnr} />
                  </Cell>
                )}
                {tab.kolonner.includes(Kolonne.HJELPEMIDDELBRUKER) && (
                  <Cell>
                    <Hjelpemiddelbruker person={oppgave.personinformasjon} saksID={oppgave.saksid} />
                  </Cell>
                )}
                {tab.kolonner.includes(Kolonne.FUNKSJONSNEDSETTELSE) && (
                  <Cell>
                    <Funksjonsnedsettelse
                      funksjonsnedsettelser={oppgave.personinformasjon.funksjonsnedsettelse}
                      saksID={oppgave.saksid}
                    />
                  </Cell>
                )}
                {tab.kolonner.includes(Kolonne.SØKNAD_OM) && (
                  <Cell>
                    <Gjelder søknadOm={capitalize(oppgave.søknadOm)} saksID={oppgave.saksid} />
                  </Cell>
                )}
                {tab.kolonner.includes(Kolonne.BOSTED) && (
                  <Cell>
                    <Bosted bosted={oppgave.personinformasjon.poststed} saksID={oppgave.saksid} />
                  </Cell>
                )}
                {tab.kolonner.includes(Kolonne.FORMIDLER) && (
                  <Cell>
                    <FormidlerCelle saksID={oppgave.saksid} formidlerNavn={oppgave.formidlerNavn}></FormidlerCelle>
                  </Cell>
                )}
                {tab.kolonner.includes(Kolonne.STATUS) && (
                  <Cell>
                    <Status status={OppgaveStatusLabel.get(oppgave.status)!} saksID={oppgave.saksid} />
                  </Cell>
                )}
                {tab.kolonner.includes(Kolonne.MOTTATT) && (
                  <Cell>
                    <Motatt dato={oppgave.mottattDato} />
                  </Cell>
                )}
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
