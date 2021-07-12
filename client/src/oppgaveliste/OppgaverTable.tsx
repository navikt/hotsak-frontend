import styled from 'styled-components/macro'

import { useTabContext } from './Oppgaveliste'
import { useOppgaveliste } from './oppgavelisteHook'

import { TabType } from './tabs'
import { StatusType } from '../types/types.internal'
import { Body } from '../felleskomponenter/table/Body'
import { Cell } from '../felleskomponenter/table/Cell'
import { Header } from '../felleskomponenter/table/Header'
import { LinkRow } from '../felleskomponenter/table/LinkRow'
import { Table } from '../felleskomponenter/table/Table'
import { Status } from './kolonner/Status'
import { Tildeling } from './kolonner/Tildeling'
import { Funksjonsnedsettelse } from './kolonner/Funksjonsnedsettelse'
import { Gjelder } from './kolonner/Gjelder'
import { Hjelpemiddelbruker } from './kolonner/Hjelpemiddelbruker'
import { Fødselsnummer } from './kolonner/Fødselsnummer'
import { Fødselsdato } from './kolonner/Fødselsdato'
import { Bosted } from './kolonner/Bosted'
import { Motatt } from './kolonner/Motatt'
import { OptionsButton } from '../felleskomponenter/kjøttbolle/OptionsButton'
import saksbehandler from '../saksbehandler/innloggetSaksbehandler'

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

enum kolonner {
  EIER = 'Eier',
  FØDSELSNUMMER = 'Fødselsnummer',
  HJELPEMIDDELBRUKER = 'Hjelpemiddelbruker',
  FØDSELSDATO = 'Fødselsdato',
  FUNKSJONSNEDSETTELSE = 'Funksjonsnedsettelse',
  SØKNAD_OM = 'Søknad om',
  BOSTED = 'Bosted',
  STATUS = 'Status',
  MOTTATT = 'Mottatt',
}

const kolonnerMine = [
  kolonner.FUNKSJONSNEDSETTELSE,
  kolonner.SØKNAD_OM,
  kolonner.FØDSELSNUMMER,
  kolonner.FØDSELSDATO,
  kolonner.HJELPEMIDDELBRUKER,
  kolonner.BOSTED,
  kolonner.STATUS,
  kolonner.MOTTATT,
]

const kolonnerUtfordelte = [
  kolonner.EIER,
  kolonner.FUNKSJONSNEDSETTELSE,
  kolonner.FØDSELSNUMMER,
  kolonner.FØDSELSDATO,
  kolonner.HJELPEMIDDELBRUKER,
  kolonner.BOSTED,
  kolonner.MOTTATT,
]

const kolonnerAlleSaker = [
  kolonner.EIER,
  kolonner.FUNKSJONSNEDSETTELSE,
  kolonner.SØKNAD_OM,
  kolonner.FØDSELSNUMMER,
  kolonner.FØDSELSDATO,
  kolonner.HJELPEMIDDELBRUKER,
  kolonner.BOSTED,
  kolonner.MOTTATT,
]

const kolonnerOverførstGosys = kolonnerAlleSaker

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
        return oppgave?.saksbehandler?.objectId === saksbehandler.objectId
      default:
        return true
    }
  })

  let tab : any
  switch (aktivTab) {
    case TabType.Alle:
      tab = { label: 'Alle saker fordelt til min enhet', kolonner: kolonnerAlleSaker }
      break
    case TabType.Mine:
      tab = { label: 'Saker som er tildelt meg', kolonner: kolonnerMine }
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
        <Table
          aria-label={tab.label
            
          }
        >
          <thead>
            <tr>
              {tab.kolonner.includes(kolonner.EIER) && <Header scope="col" colSpan={1}>
                Eier
              </Header>}
              {tab.kolonner.includes(kolonner.FØDSELSNUMMER) &&<Header scope="col" colSpan={1}>
                Fødselsnummer
              </Header>}
              {tab.kolonner.includes(kolonner.HJELPEMIDDELBRUKER) &&<Header scope="col" colSpan={1}>
                Hjelpemiddelbruker
              </Header>}
              {tab.kolonner.includes(kolonner.FØDSELSDATO) &&<Header scope="col" colSpan={1}>
                Fødselsdato
              </Header>}
              {tab.kolonner.includes(kolonner.FUNKSJONSNEDSETTELSE) &&<Header scope="col" colSpan={1}>
                Funksjonsnedsettelse
              </Header>}
              {tab.kolonner.includes(kolonner.SØKNAD_OM) &&<Header scope="col" colSpan={1}>
                Søknad om
              </Header>}
              {tab.kolonner.includes(kolonner.BOSTED) &&<Header scope="col" colSpan={1}>
                Bosted
              </Header>}
              {tab.kolonner.includes(kolonner.STATUS) &&<Header scope="col" colSpan={1}>
                Status
              </Header>}
              {tab.kolonner.includes(kolonner.MOTTATT) &&<Header scope="col" colSpan={1}>
                Mottatt
              </Header>}
              <Header scope="col" colSpan={1} />
            </tr>
          </thead>
          <Body>
            {filtrerteOppgaver.map((oppgave) => (
              <LinkRow /*onNavigate={onNavigate>}*/ key={oppgave.saksid}>
                {tab.kolonner.includes(kolonner.EIER) && <Cell>
                  <Tildeling oppgave={oppgave} />
                </Cell>}
                {tab.kolonner.includes(kolonner.FØDSELSNUMMER) && <Cell>
                  <Fødselsnummer fødselsnummer={oppgave.personinformasjon.fnr} />
                </Cell>}
                {tab.kolonner.includes(kolonner.HJELPEMIDDELBRUKER) && <Cell>
                  <Hjelpemiddelbruker person={oppgave.personinformasjon} saksID={oppgave.saksid} />
                </Cell>}
                {tab.kolonner.includes(kolonner.FØDSELSDATO) && <Cell>
                  <Fødselsdato fødselsdato={oppgave.personinformasjon.fødselsdato} />
                </Cell>}
                {tab.kolonner.includes(kolonner.FUNKSJONSNEDSETTELSE) && <Cell>
                  <Funksjonsnedsettelse funksjonsnedsettelser={oppgave.funksjonsnedsettelse} saksID={oppgave.saksid} />
                </Cell>}
                {tab.kolonner.includes(kolonner.SØKNAD_OM) &&  <Cell>
                  <Gjelder søknadOm={oppgave.søknadOm} saksID={oppgave.saksid} />
                </Cell>}
                {tab.kolonner.includes(kolonner.BOSTED) && <Cell>
                  <Bosted bosted={oppgave.personinformasjon.poststed} saksID={oppgave.saksid} />
                </Cell>}
                {tab.kolonner.includes(kolonner.STATUS) && <Cell>
                  <Status status={oppgave.status} saksID={oppgave.saksid} />
                </Cell>}
                {tab.kolonner.includes(kolonner.MOTTATT) && <Cell>
                  <Motatt dato={oppgave.motattDato} />
                </Cell>}
                <Cell style={{ width: '100%' }}>{<OptionsButton oppgave={oppgave} />}</Cell>
              </LinkRow>
            ))}
          </Body>
        </Table>
      </ScrollableX>
    </Container>
  )
}
