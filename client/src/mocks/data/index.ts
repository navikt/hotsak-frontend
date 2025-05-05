import type { RequestHandler } from 'msw'

import { HjelpemiddelStore } from './HjelpemiddelStore'
import { idGenerator } from './IdGenerator'
import { JournalpostStore } from './JournalpostStore'
import { PersonStore } from './PersonStore'
import { SakStore } from './SakStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { SaksoversiktStore } from './SaksoversiktStore'
import { OppgaveStore } from './OppgaveStore'
import { EndreHjelpemiddelStore } from './EndreHjelpemiddelStore'
import { NotatStore } from './NotatStore'

export async function setupStore() {
  const hjelpemiddelStore = new HjelpemiddelStore()
  const saksoversiktStore = new SaksoversiktStore()
  const saksbehandlerStore = new SaksbehandlerStore()
  const personStore = new PersonStore()
  const journalpostStore = new JournalpostStore(saksbehandlerStore, personStore).use(idGenerator)
  const sakStore = new SakStore(saksbehandlerStore, personStore, journalpostStore).use(idGenerator)
  const oppgaveStore = new OppgaveStore(saksbehandlerStore, sakStore, journalpostStore).use(idGenerator)
  const notatStore = new NotatStore(saksbehandlerStore, sakStore).use(idGenerator)
  const endreHjelpemiddelStore = new EndreHjelpemiddelStore(sakStore)

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
