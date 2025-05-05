import Dexie, { Table } from 'dexie'

import { type OppgaveApiOppgave } from '../../types/experimentalTypes'
import { Journalpost } from '../../types/types.internal'
import { lagPerson, PersonStore } from './PersonStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import {
  InsertDokument,
  InsertHendelse,
  InsertJournalpost,
  lagDokumenter,
  lagJournalpost,
  LagretDokument,
  LagretHendelse,
  LagretJournalpost,
} from './lagJournalpost.ts'
import { nåIso } from './felles.ts'

export class JournalpostStore extends Dexie {
  private readonly journalposter!: Table<LagretJournalpost, string, InsertJournalpost>
  private readonly dokumenter!: Table<LagretDokument, number, InsertDokument>
  private readonly hendelser!: Table<LagretHendelse, number, InsertHendelse>

  constructor(
    private readonly saksbehandlerStore: SaksbehandlerStore,
    private readonly personStore: PersonStore
  ) {
    super('JournalpostStore')
    this.version(1).stores({
      journalposter: 'journalpostId',
      dokumenter: '++dokumentId,journalpostId',
      hendelser: '++id,journalpostId',
    })
  }

  async populer() {
    const count = await this.journalposter.count()
    if (count !== 0) {
      return []
    }
    return this.lagreAlle([lagJournalpost(), lagJournalpost(), lagJournalpost()])
  }

  async lagreAlle(journalposter: InsertJournalpost[]) {
    const journalpostId = await this.journalposter.bulkAdd(journalposter, { allKeys: true })
    const dokumenter = journalpostId.flatMap(lagDokumenter)
    await this.dokumenter.bulkAdd(dokumenter as LagretDokument[], { allKeys: true })
    await this.personStore.lagreAlle(
      journalposter.map(({ fnrInnsender: fnr }) => {
        const person = lagPerson()
        return {
          ...person,
          fnr,
        }
      })
    )
    return journalpostId
  }

  async hent(journalpostId: string): Promise<Journalpost | undefined> {
    const journalpost = await this.journalposter.get(journalpostId)

    if (!journalpost) {
      return
    }
    const dokumenter = await this.dokumenter.where('journalpostId').equals(journalpostId).toArray()
    return {
      ...journalpost,
      dokumenter,
    }
  }

  async alle() {
    return this.journalposter.toArray()
  }

  async lagreHendelse(journalpostId: string, hendelse: string, detaljer?: string) {
    const { navn: bruker } = await this.saksbehandlerStore.innloggetSaksbehandler()
    return this.hendelser.add({
      opprettet: nåIso(),
      journalpostId,
      hendelse,
      detaljer,
      bruker,
    })
  }

  async hentHendelser(sakId: string) {
    return this.hendelser.where('sakId').equals(sakId).toArray()
  }

  async journalfør(journalpostId: string, tittel: string) {
    const dokument = await this.dokumenter.where('journalpostId').equals(journalpostId).first()
    const dokumentId = Number(dokument?.dokumentId)

    await this.dokumenter.update(dokumentId, { ...dokument, tittel })

    return this.journalposter.update(journalpostId, {
      tittel,
      oppgave: {} as OppgaveApiOppgave,
    })
  }
}
