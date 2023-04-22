import dayjs from 'dayjs'
import Dexie, { Table } from 'dexie'

import {
  DokumentFormat,
  DokumentOppgaveStatusType,
  ID,
  Journalpost,
  JournalpostStatusType,
} from '../../types/types.internal'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { enheter } from './enheter'
import { lagTilfeldigInteger, nextId } from './felles'
import { lagTilfeldigFødselsnummer } from './fødselsnumre'

const nå = dayjs()

function lagJournalpost(journalpostId: string = nextId().toString()): Journalpost {
  return {
    journalpostID: journalpostId,
    journalstatus: JournalpostStatusType.MOTTATT,
    status: DokumentOppgaveStatusType.JOURNALFØRT,
    journalpostOpprettetTid: nå.toISOString(),
    fnrInnsender: lagTilfeldigFødselsnummer(lagTilfeldigInteger(30, 50)),
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

export class JournalpostStore extends Dexie {
  private readonly journalposter!: Table<Journalpost, string>

  constructor(private readonly saksbehandlerStore: SaksbehandlerStore) {
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
    return this.lagreAlle([lagJournalpost(), lagJournalpost(), lagJournalpost(), lagJournalpost(), lagJournalpost()])
  }

  async lagreAlle(journalposter: Journalpost[]) {
    return this.journalposter.bulkAdd(journalposter, { allKeys: true })
  }

  async hent(journalpostId: string) {
    return this.journalposter.get(journalpostId)
  }

  async alle() {
    return this.journalposter.toArray()
  }

  async tildel(sakId: ID | number) {
    const saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
  }

  async frigi(sakId: ID | number) {
    // todo
  }
}
