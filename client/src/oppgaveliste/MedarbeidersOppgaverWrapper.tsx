import { MedarbeidersOppgaver } from './MedarbeidersOppgaver.tsx'
import { type DefaultOppgaveColumns } from './oppgaveColumns.tsx'
import { OppgavelisteProvider } from './OppgavelisteProvider.tsx'
import { Sidetittel } from '../felleskomponenter/Sidetittel.tsx'

export default function MineOppgaverWrapper() {
  return (
    <>
      <Sidetittel tittel="Medarbeiders oppgaver" />
      <OppgavelisteProvider suffix="Medarbeiders" defaultColumns={defaultColumns}>
        <MedarbeidersOppgaver />
      </OppgavelisteProvider>
    </>
  )
}

const defaultColumns: DefaultOppgaveColumns = [
  'overtaOppgave',
  'oppgaveId',
  'sakId',
  'saksbehandler',
  'oppgavetype',
  'behandlingstema',
  'behandlingstype',
  'beskrivelse',
  'mappenavn',
  'prioritet',
  'innsenderNavn',
  'brukerFødselsdato',
  'brukerAlder',
  'kommune',
  ['saksstatus', false],
  'opprettetTidspunkt',
  'fristFerdigstillelse',
]
