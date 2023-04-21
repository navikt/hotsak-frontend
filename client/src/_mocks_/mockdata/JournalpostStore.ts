import dayjs from 'dayjs'
import Dexie, { Table } from 'dexie'

import type { Journalpost } from '../../types/types.internal'
import { DokumentFormat, DokumentOppgaveStatusType, JournalpostStatusType } from '../../types/types.internal'
import { enheter } from './enheter'
import { nextId } from './felles'

const nå = dayjs()

function lagJournalpost(journalpostId: string = nextId().toString()): Journalpost {
  return {
    journalpostID: journalpostId,
    journalstatus: JournalpostStatusType.MOTTATT,
    status: DokumentOppgaveStatusType.JOURNALFØRT,
    journalpostOpprettetTid: nå.toISOString(),
    fnrInnsender: '15084300133',
    tittel: 'Tilskudd ved kjøp av briller til barn',
    enhet: enheter.agder,
    dokumenter: [
      {
        dokumentID: nextId().toString(),
        tittel: 'Tilskudd ved kjøp av briller til barn',
        brevkode: 'NAV 10-07.34',
        vedlegg: [],
        varianter: [{ format: DokumentFormat.ORIGINAL }, { format: DokumentFormat.ARKIV }],
      },
      {
        dokumentID: nextId().toString(),
        tittel: 'Originalkvittering',
        brevkode: 'X5',
        vedlegg: [],
        varianter: [{ format: DokumentFormat.ARKIV }],
      },
      {
        dokumentID: nextId().toString(),
        tittel: 'Kvitteringsside for dokumentinnsending',
        brevkode: 'L7',
        vedlegg: [],
        varianter: [{ format: DokumentFormat.ARKIV }],
      },
    ],
  }
}

class JournalpostStore extends Dexie {
  private readonly journalposter!: Table<Journalpost, string>

  constructor() {
    super('JournalpostStore')
    if (!window.appSettings.USE_MSW) {
      return
    }
    this.version(1).stores({
      journalposter: '++journalpostID',
    })
  }

  async populer() {
    const count = await this.journalposter.count()
    if (count !== 0) {
      return []
    }
    return Promise.all([
      this.lagre(lagJournalpost()),
      this.lagre(lagJournalpost()),
      this.lagre(lagJournalpost()),
      this.lagre(lagJournalpost()),
      this.lagre(lagJournalpost()),
    ])
  }

  async lagre(journalpost: Journalpost) {
    return this.journalposter.add(journalpost, journalpost.journalpostID)
  }

  async hent(journalpostId: string) {
    return this.journalposter.get(journalpostId)
  }

  async alle() {
    return this.journalposter.toArray()
  }
}

export const journalpostStore = new JournalpostStore()
