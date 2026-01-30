import Dexie, { Table } from 'dexie'

import { calculateOffset, calculateTotalPages } from '../../felleskomponenter/Page.ts'
import { behandlingstemaer } from '../../oppgave/EndreOppgaveModal'

import {
  type FinnOppgaverRequest,
  type FinnOppgaverResponse,
  type GjelderAlternativerResponse,
  type OppgaveId,
  type OppgaveKodeverk,
  Oppgavestatus,
  OppgaveTildelt,
  Oppgavetype,
  type OppgaveV2,
} from '../../oppgave/oppgaveTypes.ts'
import { Sakstype } from '../../types/types.internal.ts'
import { compareBy } from '../../utils/array.ts'
import { select } from '../../utils/select.ts'
import { BehovsmeldingStore } from './BehovsmeldingStore.ts'
import { JournalpostStore } from './JournalpostStore.ts'
import { type InsertOppgave, lagJournalføringsoppgave, lagOppgave, type LagretOppgave } from './lagOppgave.ts'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { SakStore } from './SakStore'

export class OppgaveStore extends Dexie {
  private readonly oppgaver!: Table<LagretOppgave, OppgaveId, InsertOppgave>

  constructor(
    private readonly behovsmeldingStore: BehovsmeldingStore,
    private readonly saksbehandlerStore: SaksbehandlerStore,
    private readonly sakStore: SakStore,
    private readonly journalpostStore: JournalpostStore
  ) {
    super('OppgaveStore')
    this.version(1).stores({
      oppgaver: 'oppgaveId',
    })
  }

  async populer() {
    const count = await this.oppgaver.count()
    if (count !== 0) {
      return []
    }

    const isokategoriseringByKode: any = (await import('./isokategorisering.json')).default // fixme

    const saker = await this.sakStore.alle()
    const oppgaverForSaker: InsertOppgave[] = await Promise.all(
      saker.map(async (sak) => {
        let behandlingstema: OppgaveKodeverk
        let behandlingstype: OppgaveKodeverk
        if (sak.sakstype === Sakstype.BARNEBRILLER) {
          behandlingstema = { kode: '', term: 'Briller til barn' }
          behandlingstype = { kode: '', term: 'Søknad' }
        } else {
          const behovsmeldingCase = await this.behovsmeldingStore.hentForSak(sak)
          if (behovsmeldingCase && behovsmeldingCase.behovsmelding.hjelpemidler.hjelpemidler.length) {
            const isoKategoriKode = behovsmeldingCase.behovsmelding.hjelpemidler.hjelpemidler[0].produkt.iso8
            const isokategorisering = isokategoriseringByKode[isoKategoriKode]
            const { behandlingstema_kode: kode, behandlingstema_term: term } = isokategorisering ?? {
              behandlingstema_kode: '',
              behandlingstema_term: '',
            }
            behandlingstema = { kode, term }
          } else {
            behandlingstema = { kode: '', term: '' }
          }
          behandlingstype = { kode: '', term: sak.sakstype === Sakstype.BESTILLING ? 'Bestilling' : 'Digital søknad' }
        }
        return lagOppgave(sak, {
          oppgavetype: Oppgavetype.BEHANDLE_SAK,
          behandlingstema,
          behandlingstype,
          tema: 'HJE',
        })
      })
    )
    const journalposter = await this.journalpostStore.alle()
    const oppgaverForJournalposter: InsertOppgave[] = journalposter.map(lagJournalføringsoppgave)

    return this.lagreAlle([...oppgaverForSaker, ...oppgaverForJournalposter])
  }

  async lagreAlle(oppgaver: InsertOppgave[]) {
    return this.oppgaver.bulkAdd(oppgaver, { allKeys: true })
  }

  async hent(oppgaveId: OppgaveId): Promise<OppgaveV2 | undefined> {
    const oppgave = await this.oppgaver.get(oppgaveId)
    if (!oppgave) {
      return
    }
    return oppgave
  }

  async finnOppgaveForJournalpostId(journalpostId: string): Promise<OppgaveV2 | undefined> {
    return this.oppgaver.filter((oppgave) => oppgave.journalpostId === journalpostId).first()
  }

  async ferdigstillOppgave(oppgaveId: OppgaveId) {
    console.log(`Ferdigstiller oppgaveId: ${oppgaveId}`)

    return this.oppgaver.update(oppgaveId, {
      oppgavestatus: Oppgavestatus.FERDIGSTILT,
    })
  }

  async tildel(oppgaveId: OppgaveId) {
    const saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    console.log(`Tildeler oppgaveId: ${oppgaveId} til saksbehandlerId: ${saksbehandler.id}`)
    return this.oppgaver.update(oppgaveId, {
      tildeltSaksbehandler: saksbehandler,
      oppgavestatus: Oppgavestatus.UNDER_BEHANDLING,
    })
  }

  async fjernTildeling(oppgaveId: OppgaveId) {
    console.log(`Fjerner tildeling for oppgaveId: ${oppgaveId}`)
    return this.oppgaver.update(oppgaveId, {
      tildeltSaksbehandler: undefined,
      oppgavestatus: Oppgavestatus.OPPRETTET,
    })
  }

  async oppdaterKategorisering(oppgaveId: OppgaveId, behandlingstema: string) {
    console.log(`Oppdaterer behandlingstema for oppgaveId: ${oppgaveId}, behandlingstema: ${behandlingstema}`)
    const oppgave = await this.oppgaver.get(oppgaveId)
    return this.oppgaver.update(oppgaveId, {
      kategorisering: {
        oppgavetype: oppgave?.kategorisering.oppgavetype || Oppgavetype.BEHANDLE_SAK,
        tema: 'HJE',
        behandlingstema: {
          kode: behandlingstema,
          term: behandlingstemaer.find((bt) => bt.kode === behandlingstema)?.term || '',
        },
        behandlingstype: oppgave?.kategorisering.behandlingstype,
      },
    })
  }

  async hentGjelderInfo(
    oppgaveId: OppgaveId
  ): Promise<
    { behandlingstema: string; behandlingstype: string; alternativer: GjelderAlternativerResponse } | undefined
  > {
    console.log(`Henter kategorisering for oppgaveId: ${oppgaveId}`)
    const oppgave = await this.oppgaver.get(oppgaveId)
    if (!oppgave) {
      return
    }
    /*
    return {
      behandlingstema: oppgave.behandlingstema || '',
      behandlingstype: oppgave.behandlingstype || '',
      alternativer: {
        behandlingstemaKode: hentBehandlingstemaKode(oppgave.behandlingstema || ''),
        behandlingstemaTerm: oppgave.behandlingstema || '',
        alternativer: [],
      },
    }
    */
  }

  async alle() {
    return this.oppgaver.toArray()
  }

  async finn(request: FinnOppgaverRequest): Promise<FinnOppgaverResponse> {
    const meg = await this.saksbehandlerStore.innloggetSaksbehandler()
    const alleOppgaver = await this.alle()
    const filtrerteOppgaver = alleOppgaver
      .filter((oppgave) => {
        return oppgave.oppgavestatus !== Oppgavestatus.FERDIGSTILT
      })
      .filter((oppgave) => {
        const oppgavetype = request.oppgavetype?.[0]
        if (oppgavetype === Oppgavetype.JOURNALFØRING) {
          return oppgave.kategorisering.oppgavetype === Oppgavetype.JOURNALFØRING
        } else {
          return oppgave.kategorisering.oppgavetype !== Oppgavetype.JOURNALFØRING
        }
      })
      .filter((oppgave) => {
        switch (request.tildelt) {
          case OppgaveTildelt.MEG:
            return oppgave.tildeltSaksbehandler?.id === meg.id
          case OppgaveTildelt.INGEN:
            return oppgave.tildeltSaksbehandler == null
          case OppgaveTildelt.MEDARBEIDER:
            return oppgave.tildeltSaksbehandler?.id !== meg.id && oppgave.tildeltSaksbehandler != null
          default:
            return true
        }
      })
      .sort((a, b) => {
        let key: 'fristFerdigstillelse' | 'opprettetTidspunkt' = 'fristFerdigstillelse'
        switch (request.sorteringsfelt) {
          case 'FRIST':
            key = 'fristFerdigstillelse'
            break
          case 'OPPRETTET_TIDSPUNKT':
            key = 'opprettetTidspunkt'
            break
        }
        const direction = request.sorteringsrekkefølge ?? 'none'
        const comparator = compareBy<OppgaveV2>(select(key), direction)
        return comparator(a, b)
      })

    const pageNumber = request.pageNumber ?? 1
    const pageSize = request.pageSize ?? 1_000
    const offset = calculateOffset({ pageNumber, pageSize })
    const totalElements = filtrerteOppgaver.length
    return {
      oppgaver: filtrerteOppgaver.slice(offset, offset + pageSize),
      pageNumber,
      pageSize,
      totalPages: calculateTotalPages({ pageNumber, pageSize, totalElements }),
      totalElements,
    }
  }
}
