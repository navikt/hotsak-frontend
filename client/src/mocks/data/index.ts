import type { RequestHandler } from 'msw'

export async function setupStore() {
  const { BarnebrillesakStore } = await import('./BarnebrillesakStore')
  const { JournalpostStore } = await import('./JournalpostStore')
  const { SaksbehandlerStore } = await import('./SaksbehandlerStore')
  const saksbehandlerStore = new SaksbehandlerStore()
  const journalpostStore = new JournalpostStore(saksbehandlerStore)
  const barnebrillesakStore = new BarnebrillesakStore(saksbehandlerStore, journalpostStore)
  return {
    saksbehandlerStore,
    journalpostStore,
    barnebrillesakStore,
  }
}

export type Store = Awaited<ReturnType<typeof setupStore>>

export interface StoreHandlersFactory {
  (store: Store): RequestHandler[]
}
