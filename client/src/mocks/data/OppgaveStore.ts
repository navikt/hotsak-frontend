import Dexie, { Table } from 'dexie'

import { isFuture } from 'date-fns'
import { calculateOffset, calculateTotalPages } from '../../felleskomponenter/Page.ts'
import type { Oppgavekommentar } from '../../oppgave/kommentar/useOppgavekommentarer.ts'
import {
  type FinnOppgaverRequest,
  type FinnOppgaverResponse,
  type Oppgave,
  type OppgaveId,
  type OppgaveKodeverk,
  Oppgavestatus,
  OppgaveTildelt,
  Oppgavetype,
  Statuskategori,
} from '../../oppgave/oppgaveTypes.ts'
import { type EndreOppgaveRequest } from '../../oppgave/useOppgaveActions.ts'
import { Sakstype } from '../../types/types.internal.ts'
import { compareBy } from '../../utils/array.ts'
import { select } from '../../utils/select.ts'
import { BehovsmeldingStore } from './BehovsmeldingStore.ts'
import { JournalpostStore } from './JournalpostStore.ts'
import { KodeverkStore } from './KodeverkStore.ts'
import { type InsertOppgave, lagJournalføringsoppgave, lagOppgave, type LagretOppgave } from './lagOppgave.ts'
import { Saksbehandlere } from './Saksbehandlere.ts'
import { SakStore } from './SakStore'

interface LagretOppgavekommentar extends Oppgavekommentar {
  id: number
}

type InsertOppgavekommentar = Omit<LagretOppgavekommentar, 'id'>

export class OppgaveStore extends Dexie {
  private readonly oppgaver!: Table<LagretOppgave, OppgaveId, InsertOppgave>
  private readonly kommentarer!: Table<LagretOppgavekommentar, number, InsertOppgavekommentar>

  constructor(
    private readonly kodeverkStore: KodeverkStore,
    private readonly behovsmeldingStore: BehovsmeldingStore,
    private readonly journalpostStore: JournalpostStore,
    private readonly sakStore: SakStore
  ) {
    super('OppgaveStore')
    this.version(1).stores({
      oppgaver: 'oppgaveId,sakId',
      kommentarer: '++id,oppgaveId',
    })
  }

  async populer() {
    const count = await this.oppgaver.count()
    if (count !== 0) {
      return []
    }

    const isokategoriseringByKode: Record<string, { behandlingstema_kode: string; behandlingstema_term: string }> = (
      await import('./isokategorisering.json')
    ).default

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

  async hent(oppgaveId: OppgaveId): Promise<Oppgave | undefined> {
    const oppgave = await this.oppgaver.get(oppgaveId)
    if (!oppgave) {
      return
    }
    return oppgave
  }

  async ferdigstillOppgave(oppgaveId: OppgaveId) {
    console.log(`Ferdigstiller oppgaveId: ${oppgaveId}`)

    return this.oppgaver.update(oppgaveId, {
      statuskategori: Statuskategori.AVSLUTTET,
      oppgavestatus: Oppgavestatus.FERDIGSTILT,
    })
  }

  async tildel(oppgaveId: OppgaveId) {
    const saksbehandler = Saksbehandlere.innlogget()
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

  async endre(oppgaveId: OppgaveId, request: EndreOppgaveRequest) {
    console.log(`Endrer oppgave med oppgaveId: ${oppgaveId}`, request)
    const oppgave = await this.oppgaver.get(oppgaveId)
    if (!oppgave) {
      return
    }
    const changes: Partial<Oppgave> = {}
    if (request.behandlingstema) {
      const [gjelder] = this.kodeverkStore.finnBehandlingstema(request.behandlingstema)
      changes.kategorisering = {
        ...oppgave.kategorisering,
        behandlingstema: gjelder.behandlingstema,
      }
    }
    if (request.aktivDato) {
      changes.aktivDato = request.aktivDato
      changes.isPåVent = isFuture(request.aktivDato)
    }
    if (request.fristFerdigstillelse) {
      changes.fristFerdigstillelse = request.fristFerdigstillelse
    }
    return this.oppgaver.update(oppgaveId, changes)
  }

  async merkSomLest(oppgaveId: OppgaveId) {
    // const meg = await this.saksbehandlerStore.innloggetSaksbehandler() todo -> støtt flere saksbehandlere
    return this.oppgaver.update(oppgaveId, { sistLest: new Date().toISOString(), isUlest: false })
  }

  async alle() {
    return this.oppgaver.toArray()
  }

  async finn(request: FinnOppgaverRequest): Promise<FinnOppgaverResponse> {
    const meg = Saksbehandlere.innlogget()
    const alleOppgaver = await this.alle()
    const filtrerteOppgaver = alleOppgaver
      .filter(({ oppgavestatus }) => {
        if (request.statuskategori === Statuskategori.AVSLUTTET) {
          return oppgavestatus === Oppgavestatus.FERDIGSTILT
        } else {
          return oppgavestatus !== Oppgavestatus.FERDIGSTILT
        }
      })
      .filter(({ kategorisering }) => {
        const oppgavetype = request.oppgavetype ?? []
        if (oppgavetype.length === 0) return true
        return oppgavetype.includes(kategorisering.oppgavetype)
      })
      .filter(({ tildeltSaksbehandler }) => {
        switch (request.tildelt) {
          case OppgaveTildelt.MEG:
            return tildeltSaksbehandler?.id === meg.id
          case OppgaveTildelt.INGEN:
            return tildeltSaksbehandler == null
          case OppgaveTildelt.MEDARBEIDER:
            return tildeltSaksbehandler?.id !== meg.id && tildeltSaksbehandler != null
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
        const comparator = compareBy<Oppgave>(direction, select(key))
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

  async finnOppgaverForSak(sakId?: ID) {
    if (!sakId) return []
    return this.oppgaver.where({ sakId }).toArray()
  }

  async finnKommentarer(oppgaveId: OppgaveId): Promise<Oppgavekommentar[]> {
    return this.kommentarer.where({ oppgaveId }).toArray()
  }

  async finnKommentarerForSak(sakId?: ID): Promise<Oppgavekommentar[]> {
    if (!sakId) return []
    const oppgaver = await this.finnOppgaverForSak(sakId)
    const oppgaveIder = oppgaver.map((oppgave) => oppgave.oppgaveId)
    return this.kommentarer.where('oppgaveId').anyOf(oppgaveIder).toArray()
  }

  async lagreKommentar(oppgaveId: OppgaveId, kommentar: InsertOppgavekommentar) {
    await this.kommentarer.add({ ...kommentar, oppgaveId })
  }
}
