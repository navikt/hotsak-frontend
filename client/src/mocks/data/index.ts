import type { RequestHandler } from 'msw'

import { BehovsmeldingStore } from './BehovsmeldingStore.ts'
import { EndreHjelpemiddelStore } from './EndreHjelpemiddelStore'
import { HjelpemiddelStore } from './HjelpemiddelStore'
import { JournalpostStore } from './JournalpostStore'
import { KodeverkStore } from './KodeverkStore.ts'
import { NotatStore } from './NotatStore'
import { OppgaveStore } from './OppgaveStore'
import { PersonStore } from './PersonStore'
import { SakStore } from './SakStore'

export async function setupStore() {
  const kodeverkStore = new KodeverkStore()
  const behovsmeldingStore = new BehovsmeldingStore()
  const hjelpemiddelStore = new HjelpemiddelStore()
  const personStore = new PersonStore()
  const journalpostStore = new JournalpostStore(personStore)
  const sakStore = new SakStore(behovsmeldingStore, personStore, journalpostStore)
  const oppgaveStore = new OppgaveStore(kodeverkStore, behovsmeldingStore, journalpostStore, sakStore)
  const notatStore = new NotatStore(sakStore)
  const endreHjelpemiddelStore = new EndreHjelpemiddelStore(sakStore)

  return {
    behovsmeldingStore,
    endreHjelpemiddelStore,
    hjelpemiddelStore,
    journalpostStore,
    kodeverkStore,
    notatStore,
    oppgaveStore,
    personStore,
    sakStore,
  }
}

export type Store = Awaited<ReturnType<typeof setupStore>>

export interface StoreHandlersFactory {
  (store: Store): RequestHandler[]
}
