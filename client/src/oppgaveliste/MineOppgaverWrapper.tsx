import { Sidetittel } from '../felleskomponenter/Sidetittel.tsx'
import { useOppgavehendelserForEnhet } from '../oppgave/useOppgavehendelser.ts'
import { MineOppgaver } from './MineOppgaver.tsx'
import { type DefaultOppgaveColumns } from './oppgaveColumns.tsx'
import { OppgavelisteProvider } from './OppgavelisteProvider.tsx'

export default function MineOppgaverWrapper() {
  useOppgavehendelserForEnhet()
  return (
    <>
      <Sidetittel tittel="Mine oppgaver" />
      <OppgavelisteProvider suffix="Mine" defaultColumns={defaultColumns}>
        <MineOppgaver />
      </OppgavelisteProvider>
    </>
  )
}

const defaultColumns: DefaultOppgaveColumns = [
  'åpneOppgave',
  ['oppgaveId', false],
  ['sakId', false],
  'oppgavetype',
  'behandlingstema',
  'behandlingstype',
  'beskrivelse',
  'mappenavn',
  'prioritet',
  'innsenderNavn',
  ['brukerFnr', false],
  ['brukerNavn', false],
  ['brukerFødselsdato', false],
  'brukerAlder',
  'kommune',
  ['saksstatus', false],
  'opprettetTidspunkt',
  'fristFerdigstillelse',
  ['ferdigstiltTidspunkt', false],
  'mineOppgaverMenu',
]
