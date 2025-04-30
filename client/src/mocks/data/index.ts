import type { RequestHandler } from 'msw'

import { HjelpemiddelStore } from './HjelpemiddelStore'
import { IdGenerator } from './IdGenerator'
import { JournalpostStore } from './JournalpostStore'
import { PersonStore } from './PersonStore'
import { SakStore } from './SakStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { SaksoversiktStore } from './SaksoversiktStore'
import { OppgaveStore } from './OppgaveStore'
import { EndreHjelpemiddelStore } from './EndreHjelpemiddelStore'
import { NotatStore } from './NotatStore'

export async function setupStore() {
  const idGenerator = new IdGenerator(999)
  const saksbehandlerStore = new SaksbehandlerStore()
  const personStore = new PersonStore()
  const hjelpemiddelStore = new HjelpemiddelStore()
  const journalpostStore = new JournalpostStore(idGenerator, saksbehandlerStore, personStore)
  const sakStore = new SakStore(idGenerator, saksbehandlerStore, personStore, journalpostStore)
  const endreHjelpemiddelStore = new EndreHjelpemiddelStore(sakStore)
  const saksoversiktStore = new SaksoversiktStore()
  const notatStore = new NotatStore(idGenerator, saksbehandlerStore, sakStore)
  const oppgaveStore = new OppgaveStore(idGenerator, sakStore, journalpostStore, saksbehandlerStore)

  return {
    saksbehandlerStore,
    personStore,
    hjelpemiddelStore,
    journalpostStore,
    sakStore,
    saksoversiktStore,
    oppgaveStore,
    endreHjelpemiddelStore,
    notatStore,
  }
}

export type Store = Awaited<ReturnType<typeof setupStore>>

export interface StoreHandlersFactory {
  (store: Store): RequestHandler[]
}
