import Dexie, { Table } from 'dexie'

import { Journalpost } from '../../types/types.internal.ts'
import { nåIso } from './felles.ts'
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
import { lagPerson, PersonStore } from './PersonStore.ts'
import { Saksbehandlere } from './Saksbehandlere.ts'

export class JournalpostStore extends Dexie {
  private readonly journalposter!: Table<LagretJournalpost, string, InsertJournalpost>
  private readonly dokumenter!: Table<LagretDokument, number, InsertDokument>
  private readonly hendelser!: Table<LagretHendelse, number, InsertHendelse>

  constructor(private readonly personStore: PersonStore) {
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

    await this.lagreAlle([lagJournalpost('9001'), lagJournalpost('9002'), lagJournalpost('9003')])

    const v2Post = lagJournalpost('9004', 'Søknad om hjelpemidler')
    await this.journalposter.add(v2Post)
    await this.dokumenter.add({
      journalpostId: '9004',
      tittel: 'Søknad om hjelpemidler',
      brevkode: 'NAV 10-07.03',
    } as InsertDokument)
    await this.personStore.lagreAlle([{ ...lagPerson(), fnr: v2Post.fnrInnsender }])

    return ['9004']
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

  async søk(): Promise<Journalpost[]> {
    const journalposter = await this.journalposter.toArray()
    return Promise.all(
      journalposter.map(async (journalpost) => {
        const dokumenter = await this.dokumenter.where('journalpostId').equals(journalpost.journalpostId).toArray()
        return { ...journalpost, dokumenter }
      })
    )
  }

  async lagreHendelse(journalpostId: string, hendelse: string, detaljer?: string) {
    const { navn: bruker } = Saksbehandlere.innlogget()
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
    })
  }
}
