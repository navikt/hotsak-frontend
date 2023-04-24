import type { RequestHandler } from 'msw'

import { BarnebrillesakStore } from './BarnebrillesakStore'
import { HjelpemiddelStore } from './HjelpemiddelStore'
import { IdGenerator } from './IdGenerator'
import { JournalpostStore } from './JournalpostStore'
import { PersonStore } from './PersonStore'
import { SakStore } from './SakStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { SaksoversiktStore } from './SaksoversiktStore'

export async function setupStore() {
  const idGenerator = new IdGenerator(999)
  const saksbehandlerStore = new SaksbehandlerStore()
  const personStore = new PersonStore()
  const hjelpemiddelStore = new HjelpemiddelStore()
  const journalpostStore = new JournalpostStore(idGenerator, saksbehandlerStore, personStore)
  const sakStore = new SakStore(idGenerator, saksbehandlerStore, personStore)
  const barnebrillesakStore = new BarnebrillesakStore(idGenerator, saksbehandlerStore, personStore, journalpostStore)
  const saksoversiktStore = new SaksoversiktStore()

  return {
    saksbehandlerStore,
    personStore,
    hjelpemiddelStore,
    journalpostStore,
    sakStore,
    barnebrillesakStore,
    saksoversiktStore,
  }
}

export type Store = Awaited<ReturnType<typeof setupStore>>

export interface StoreHandlersFactory {
  (store: Store): RequestHandler[]
}
