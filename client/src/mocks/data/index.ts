import type { RequestHandler } from 'msw'

import { BehovsmeldingStore } from './BehovsmeldingStore.ts'
import { EndreHjelpemiddelStore } from './EndreHjelpemiddelStore'
import { HjelpemiddelStore } from './HjelpemiddelStore'
import { JournalpostStore } from './JournalpostStore'
import { NotatStore } from './NotatStore'
import { OppgaveStore } from './OppgaveStore'
import { PersonStore } from './PersonStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { SakStore } from './SakStore'

export async function setupStore() {
  const behovsmeldingStore = new BehovsmeldingStore()
  const hjelpemiddelStore = new HjelpemiddelStore()
  const personStore = new PersonStore()
  const saksbehandlerStore = new SaksbehandlerStore()
  const journalpostStore = new JournalpostStore(saksbehandlerStore, personStore)
  const sakStore = new SakStore(behovsmeldingStore, saksbehandlerStore, personStore, journalpostStore)
  const oppgaveStore = new OppgaveStore(behovsmeldingStore, saksbehandlerStore, sakStore, journalpostStore)
  const notatStore = new NotatStore(saksbehandlerStore, sakStore)
  const endreHjelpemiddelStore = new EndreHjelpemiddelStore(sakStore)

  return {
    behovsmeldingStore,
    endreHjelpemiddelStore,
    hjelpemiddelStore,
    journalpostStore,
    notatStore,
    oppgaveStore,
    personStore,
    sakStore,
    saksbehandlerStore,
  }
}

export type Store = Awaited<ReturnType<typeof setupStore>>

export interface StoreHandlersFactory {
  (store: Store): RequestHandler[]
}
