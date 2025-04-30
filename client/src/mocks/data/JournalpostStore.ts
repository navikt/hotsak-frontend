import Dexie, { Table } from 'dexie'

import { OppgavePrioritet } from '../../types/experimentalTypes'
import {
  Dokument,
  Hendelse,
  Journalpost,
  JournalpostStatusType,
  Oppgavestatus,
  Oppgavetype,
} from '../../types/types.internal'
import { IdGenerator } from './IdGenerator'
import { lagPerson, PersonStore } from './PersonStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { enheter } from './enheter'
import { lagTilfeldigInteger } from './felles'
import { lagTilfeldigFødselsnummer } from './fødselsnummer'
import { lagTilfeldigNavn } from './navn'

type LagretJournalpost = Omit<Journalpost, 'dokumenter'>

interface LagretDokument extends Dokument {
  journalpostId: string
}

interface LagretHendelse extends Hendelse {
  journalpostId: string
}

function lagJournalpost(journalpostId: number): LagretJournalpost {
  const fnrInnsender = lagTilfeldigFødselsnummer(lagTilfeldigInteger(30, 50))
  const now = new Date()
  return {
    journalpostId: journalpostId.toString(),
    journalstatus: JournalpostStatusType.MOTTATT,
    //status: Oppga.MOTTATT,
    journalpostOpprettetTid: now.toISOString(),
    fnrInnsender,
    tittel: 'Tilskudd ved kjøp av briller til barn',
    //enhet: enheter.agder,
    bruker: {
      fnr: fnrInnsender,
      navn: lagTilfeldigNavn(),
    },
    innsender: {
      fnr: fnrInnsender,
      navn: lagTilfeldigNavn(),
    },
    oppgave: {
      tema: 'HJE',
      oppgaveId: `I-${journalpostId}`,
      oppgavetype: Oppgavetype.JOURNALFØRING,
      oppgavestatus: Oppgavestatus.OPPRETTET,
      prioritet: OppgavePrioritet.NORMAL,
      tildeltEnhet: enheter.agder,
      aktivDato: now.toISOString(),
      versjon: 1,
    },
  }
}

function lagDokumenter(journalpostId: string): Array<Omit<LagretDokument, 'dokumentId'>> {
  return [
    {
      journalpostId,
      tittel: 'NAV 10-07.34: Tilskudd ved kjøp av briller til barn',
      brevkode: 'NAV 10-07.34',
    },
    /*
    {
      journalpostId,

      tittel: 'Ettersendelse: Skikkelig lang tittel som er ganske lang og ikke så veldig kort kan du på en måte si',
      brevkode: 'NAV 10-07.34',
    },
    {
      journalpostId,

      tittel: 'Ettersendelse: Brilleseddel',
      brevkode: 'NAV 10-07.34',
    },
    */
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
      opprettet: new Date().toISOString(),
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
      dokumenter: [{ ...dokument, tittel }],
      oppgave: {},
    } as any) // fixme
  }
}
