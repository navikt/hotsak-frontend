import dayjs from 'dayjs'
import Dexie, { Table } from 'dexie'

import {
  Dokument,
  DokumentFormat,
  DokumentOppgaveStatusType,
  Hendelse,
  Journalpost,
  JournalpostStatusType,
} from '../../types/types.internal'
import { IdGenerator } from './IdGenerator'
import { lagPerson, PersonStore } from './PersonStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { enheter } from './enheter'
import { lagTilfeldigInteger } from './felles'
import { fødselsdatoFraFødselsnummer, kjønnFraFødselsnummer, lagTilfeldigFødselsnummer } from './fødselsnummer'

type LagretJournalpost = Omit<Journalpost, 'dokumenter'>

interface LagretDokument extends Dokument {
  journalpostId: string
}

interface LagretHendelse extends Hendelse {
  journalpostId: string
}

function lagJournalpost(journalpostId: number): LagretJournalpost {
  return {
    journalpostID: journalpostId.toString(),
    journalstatus: JournalpostStatusType.MOTTATT,
    status: DokumentOppgaveStatusType.JOURNALFØRT,
    journalpostOpprettetTid: dayjs().toISOString(),
    fnrInnsender: lagTilfeldigFødselsnummer(lagTilfeldigInteger(30, 50)),
    tittel: 'Tilskudd ved kjøp av briller til barn',
    enhet: enheter.agder,
  }
}

function lagDokumenter(journalpostId: string): Array<Omit<LagretDokument, 'dokumentID'>> {
  return [
    {
      journalpostId,
      tittel: 'Tilskudd ved kjøp av briller til barn',
      brevkode: 'NAV 10-07.34',
      vedlegg: [],
      varianter: [{ format: DokumentFormat.ORIGINAL }, { format: DokumentFormat.ARKIV }],
    },
    {
      journalpostId,
      tittel: 'Originalkvittering',
      brevkode: 'X5',
      vedlegg: [],
      varianter: [{ format: DokumentFormat.ARKIV }],
    },
    {
      journalpostId,
      tittel: 'Kvitteringsside for dokumentinnsending',
      brevkode: 'L7',
      vedlegg: [],
      varianter: [{ format: DokumentFormat.ARKIV }],
    },
  ]
}

export class JournalpostStore extends Dexie {
  private readonly journalposter!: Table<LagretJournalpost, string>
  private readonly dokumenter!: Table<LagretDokument, number>
  private readonly hendelser!: Table<LagretHendelse, string>

  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly saksbehandlerStore: SaksbehandlerStore,
    private readonly personStore: PersonStore
  ) {
    super('JournalpostStore')
    this.version(1).stores({
      journalposter: 'journalpostID',
      dokumenter: '++dokumentID,journalpostId',
      hendelser: '++id,journalpostId',
    })
  }

  async populer() {
    const count = await this.journalposter.count()
    if (count !== 0) {
      return []
    }
    const lagJournalpostMedId = () => lagJournalpost(this.idGenerator.nesteId())
    return this.lagreAlle([
      lagJournalpostMedId(),
      lagJournalpostMedId(),
      lagJournalpostMedId(),
      lagJournalpostMedId(),
      lagJournalpostMedId(),
    ])
  }

  async lagreAlle(journalposter: LagretJournalpost[]) {
    const journalpostId = await this.journalposter.bulkAdd(journalposter, { allKeys: true })
    const dokumenter = journalpostId.flatMap(lagDokumenter)
    await this.dokumenter.bulkAdd(dokumenter as any, { allKeys: true }) // fixme
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
    return this.hendelser.put({
      id: this.idGenerator.nesteId().toString(),
      opprettet: dayjs().toISOString(),
      journalpostId,
      hendelse,
      detaljer,
      bruker,
    })
  }

  async hentHendelser(sakId: string) {
    return this.hendelser.where('sakId').equals(sakId).toArray()
  }

  async tildel(journalpostId: string) {
    const saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    return this.journalposter.update(journalpostId, {
      saksbehandler,
      status: DokumentOppgaveStatusType.TILDELT_SAKSBEHANDLER,
    })
  }

  async frigi(journalpostId: string) {
    return this.journalposter.update(journalpostId, {
      saksbehandler: undefined,
      status: DokumentOppgaveStatusType.MOTTATT,
    })
  }

  async journalfør(journalpostId: string) {
    return this.journalposter.update(journalpostId, {
      status: DokumentOppgaveStatusType.JOURNALFØRT,
    })
  }
}