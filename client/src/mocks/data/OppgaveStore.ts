import Dexie, { Table } from 'dexie'

import { isFuture, subHours } from 'date-fns'
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
import { type EndreOppgaveRequest, type PatchOppgaveRequest } from '../../oppgave/useOppgaveActions.ts'
import { Sakstype, SøknadslinjeType } from '../../types/types.internal.ts'
import { compareBy } from '../../utils/array.ts'
import { select } from '../../utils/select.ts'
import { BehovsmeldingStore } from './BehovsmeldingStore.ts'
import { JournalpostStore } from './JournalpostStore.ts'
import { KodeverkStore } from './KodeverkStore.ts'
import { erLagretHjelpemiddelsak } from './lagSak.ts'
import { type InsertOppgave, lagJournalføringsoppgave, lagOppgave, type LagretOppgave } from './lagOppgave.ts'
import { Saksbehandlere } from './Saksbehandlere.ts'
import { SakStore } from './SakStore'

interface LagretOppgavekommentar extends Oppgavekommentar {
  id: number
}

type InsertOppgavekommentar = Omit<LagretOppgavekommentar, 'id'>

const BEHANDLINGSTEMA_TILSKUDD_SMÅHJELPEMIDLER = 'ab0559'
const BEHANDLINGSTYPE_DIGITAL_SØKNAD = 'ae0227'

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
        } else if (
          erLagretHjelpemiddelsak(sak) &&
          sak.søknadslinjer?.some((linje) => linje.type === SøknadslinjeType.TILSKUDD_RIMELIGE_HJELPEMIDLER)
        ) {
          const gjelder = this.kodeverkStore
            .finnBehandlingstema(BEHANDLINGSTEMA_TILSKUDD_SMÅHJELPEMIDLER)
            .find((it) => it.behandlingstype?.kode === BEHANDLINGSTYPE_DIGITAL_SØKNAD)
          behandlingstema = gjelder!.behandlingstema!
          behandlingstype = gjelder!.behandlingstype!
        } else {
          const behovsmeldingCase = await this.behovsmeldingStore.hentForSak(sak)
          if (behovsmeldingCase && behovsmeldingCase?.behovsmelding.hjelpemidler?.hjelpemidler?.length) {
            const isoKategoriKode = behovsmeldingCase?.behovsmelding.hjelpemidler?.hjelpemidler?.[0]?.produkt?.iso8
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

  async populerKommentarer() {
    const kommentarerPerOppgave: Record<OppgaveId, string[]> = {
      '9901': [
        'Venter på utfyllende dokumentasjon fra formidler.',
        'Dokumentasjonen er mottatt. Saken er klar for videre behandling.',
      ],
      '9902': ['Søknaden gjelder samme hjelpemiddel som i denne saken.'],
    }

    await this.transaction('rw', this.oppgaver, this.kommentarer, async () => {
      for (const [oppgaveId, tekster] of Object.entries(kommentarerPerOppgave)) {
        const oppgave = await this.hent(oppgaveId)
        if (!oppgave || (await this.kommentarer.where({ oppgaveId }).count()) > 0) continue

        for (const [indeks, tekst] of tekster.entries()) {
          const saksbehandler = Saksbehandlere.hent(indeks === 0 ? 'S112233' : 'V998877')
          await this.lagreKommentar(oppgaveId, {
            oppgaveId,
            tekst,
            registrertAv: saksbehandler,
            registrertAvEnhet: saksbehandler.gjeldendeEnhet,
            registrertAvSystem: 'HOTSAK',
            registrertTidspunkt: subHours(new Date(), tekster.length - indeks).toISOString(),
          })
        }
      }
    })
  }

  async lagreAlle(oppgaver: InsertOppgave[]) {
    return this.oppgaver.bulkAdd(oppgaver, { allKeys: true })
  }

  async lagreOppgave(oppgave: InsertOppgave): Promise<OppgaveId> {
    return this.oppgaver.add(oppgave)
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
      ferdigstiltTidspunkt: new Date().toISOString(),
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
    if (request.fristDato) {
      changes.fristDato = request.fristDato
    }
    if (request.mappeId !== undefined) {
      changes.mappeId = request.mappeId ?? undefined
    }
    return this.oppgaver.update(oppgaveId, changes)
  }

  async patch(oppgaveId: OppgaveId, request: PatchOppgaveRequest) {
    console.log(`Patcher oppgave med oppgaveId: ${oppgaveId}`, request)
    const { nøkkelord, tildeltSaksbehandler, kommentar, prioritet, behandlingstema, behandlingstype, ...rest } = request
    await this.endre(oppgaveId, rest)
    const changes: Partial<Oppgave> = {}
    if (behandlingstema !== undefined || behandlingstype !== undefined) {
      const oppgave = await this.hent(oppgaveId)
      if (oppgave) {
        changes.kategorisering = {
          ...oppgave.kategorisering,
          behandlingstema:
            behandlingstema !== undefined
              ? this.kodeverkStore.finnBehandlingstema(behandlingstema)[0]?.behandlingstema
              : oppgave.kategorisering.behandlingstema,
          behandlingstype:
            behandlingstype !== undefined
              ? this.kodeverkStore.finnBehandlingstype(behandlingstype)[0]?.behandlingstype
              : oppgave.kategorisering.behandlingstype,
        }
      }
    }
    if (prioritet !== undefined) {
      changes.prioritet = prioritet
    }
    if (nøkkelord !== undefined) {
      changes.nøkkelord = nøkkelord
    }
    if (tildeltSaksbehandler) {
      changes.tildeltSaksbehandler = Saksbehandlere.hent(tildeltSaksbehandler)
      changes.oppgavestatus = Oppgavestatus.UNDER_BEHANDLING
    } else if (tildeltSaksbehandler === null) {
      changes.tildeltSaksbehandler = undefined
      changes.oppgavestatus = Oppgavestatus.OPPRETTET
    }
    if (Object.keys(changes).length > 0) {
      await this.oppgaver.update(oppgaveId, changes)
    }
    if (kommentar) {
      const saksbehandler = Saksbehandlere.innlogget()
      await this.lagreKommentar(oppgaveId, {
        oppgaveId,
        tekst: kommentar,
        registrertAv: saksbehandler,
        registrertAvEnhet: saksbehandler.gjeldendeEnhet,
        registrertAvSystem: 'HOTSAK',
        registrertTidspunkt: new Date().toISOString(),
      })
    }
  }

  async overfør(oppgaveId: OppgaveId) {
    return this.oppgaver.update(oppgaveId, { behandlesAvApplikasjon: undefined, isBehandlesAvApplikasjonHotsak: false })
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
        if (!request.statuskategori) return true
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
      .filter(({ opprettetTidspunkt }) => {
        if (!opprettetTidspunkt) return true
        if (!request.opprettetIntervall) return true
        const [fra, til] = request.opprettetIntervall.split('/')
        return opprettetTidspunkt >= fra && opprettetTidspunkt <= til
      })
      .sort((a, b) => {
        let key: 'fristDato' | 'opprettetTidspunkt' = 'fristDato'
        switch (request.sorteringsfelt) {
          case 'FRIST':
            key = 'fristDato'
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
      isFirst: true,
      isLast: true,
      hasPrevious: false,
      hasNext: false,
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
