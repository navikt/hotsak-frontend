import dayjs from 'dayjs'
import Dexie, { Table } from 'dexie'

import {
  Dokument,
  DokumentFormat,
  DokumentOppgaveStatusType,
  Hendelse,
  Journalpost,
  JournalpostStatusType,
  OmrådeFilter,
  Oppgavestatus,
  Oppgavetype,
} from '../../types/types.internal'
import { IdGenerator } from './IdGenerator'
import { PersonStore, lagPerson } from './PersonStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { enheter } from './enheter'
import { lagTilfeldigInteger } from './felles'
import { lagTilfeldigFødselsnummer } from './fødselsnummer'
import { lagTilfeldigNavn } from './navn'

type LagretJournalpost = Omit<Journalpost, 'dokumenter'>

interface LagretDokument extends Dokument {
  journalpostID: string
}

interface LagretHendelse extends Hendelse {
  journalpostId: string
}

function lagJournalpost(journalpostId: number): LagretJournalpost {
  const fnrInnsender = lagTilfeldigFødselsnummer(lagTilfeldigInteger(30, 50))
  return {
    journalpostID: journalpostId.toString(),
    journalstatus: JournalpostStatusType.MOTTATT,
    status: DokumentOppgaveStatusType.MOTTATT,
    journalpostOpprettetTid: dayjs().toISOString(),
    fnrInnsender,
    tittel: 'Tilskudd ved kjøp av briller til barn',
    enhet: enheter.agder,
    innsender: {
      fnr: fnrInnsender,
      navn: lagTilfeldigNavn().fulltNavn,
    },
    oppgave: {
      id: journalpostId.toString(),
      oppgavetype: Oppgavetype.JOURNALFØRING,
      oppgavestatus: Oppgavestatus.OPPRETTET,
      beskrivelse: '',
      område: OmrådeFilter.SYN,
      enhet: enheter.agder,
      frist: dayjs().toISOString(),
      opprettet: dayjs().toISOString(),
      bruker: {
        fnr: fnrInnsender,
        fulltNavn: lagTilfeldigNavn().fulltNavn,
      },
      innsender: {
        fnr: fnrInnsender,
        fulltNavn: lagTilfeldigNavn().fulltNavn,
      },
    },
  }
}

function lagDokumenter(journalpostID: string): Array<Omit<LagretDokument, 'dokumentID'>> {
  return [
    {
      journalpostID,

      tittel: 'NAV 10-07.34: Tilskudd ved kjøp av briller til barn',
      brevkode: 'NAV 10-07.34',
      vedlegg: [],
      varianter: [{ format: DokumentFormat.ORIGINAL }, { format: DokumentFormat.ARKIV }],
    },
    /*{
      journalpostID,

      tittel: 'Ettersendelse: Skikkelig lang tittel som en ganske lang og ikke så veldig kort kan du på en måte si',
      brevkode: 'NAV 10-07.34',
      vedlegg: [],
      varianter: [{ format: DokumentFormat.ORIGINAL }, { format: DokumentFormat.ARKIV }],
    },
    {
      journalpostID,

      tittel: 'Ettersendelse: Brilleseddel',
      brevkode: 'NAV 10-07.34',
      vedlegg: [],
      varianter: [{ format: DokumentFormat.ORIGINAL }, { format: DokumentFormat.ARKIV }],
    },*/
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
      dokumenter: '++dokumentID,journalpostID',
      hendelser: '++id,journalpostID',
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
    const dokumenter = await this.dokumenter.where('journalpostID').equals(journalpostId).toArray()
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

  async journalfør(journalpostId: string, tittel: string) {
    const dokument = await this.dokumenter.where('journalpostID').equals(journalpostId).first()
    const dokumentId = Number(dokument?.dokumentID)

    
    await this.dokumenter.update(dokumentId, { ...dokument, tittel })

    return this.journalposter.update(journalpostId, {
      status: DokumentOppgaveStatusType.JOURNALFØRT,
      tittel,
      dokumenter: [{ ...dokument, tittel }],
      oppgave: {
        
      }
      
    })
  }
}
