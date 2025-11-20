import Dexie, { Table } from 'dexie'

import {
  type GjelderAlternativerResponse,
  type OppgaveId,
  Oppgavestatus,
  Oppgavetype,
  type OppgaveV2,
} from '../../oppgave/oppgaveTypes.ts'
import { Sakstype } from '../../types/types.internal.ts'
import { BehovsmeldingStore } from './BehovsmeldingStore.ts'
import { JournalpostStore } from './JournalpostStore'
import { type InsertOppgave, lagJournalføringsoppgave, lagOppgave, type LagretOppgave } from './lagOppgave.ts'
import { hentBehandlingstemaKode } from './oppgaveGjelder.ts'
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
        let behandlingstema: string = ''
        let behandlingstype: string = ''
        if (sak.sakstype === Sakstype.BARNEBRILLER) {
          behandlingstema = 'Briller til barn'
          behandlingstype = 'Søknad'
        } else {
          const behovsmeldingCase = await this.behovsmeldingStore.hentForSak(sak)
          if (behovsmeldingCase && behovsmeldingCase.behovsmelding.hjelpemidler.hjelpemidler.length) {
            const isoKategoriKode = behovsmeldingCase.behovsmelding.hjelpemidler.hjelpemidler[0].produkt.iso8
            const isokategorisering = isokategoriseringByKode[isoKategoriKode]
            behandlingstema = isokategorisering?.behandlingstema_term ?? ''
          } else {
            behandlingstema = ''
          }
          behandlingstype = sak.sakstype === Sakstype.BESTILLING ? 'Bestilling' : 'Digital søknad'
        }
        return lagOppgave(sak, {
          tema: 'HJE',
          behandlingstema,
          behandlingstype,
          oppgavetype: Oppgavetype.BEHANDLE_SAK,
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
    console.log(`Oppdaterer behandlingstema for oppgaveId: ${oppgaveId}`)
    return this.oppgaver.update(oppgaveId, {
      behandlingstema,
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
    return {
      behandlingstema: oppgave.behandlingstema || '',
      behandlingstype: oppgave.behandlingstype || '',
      alternativer: {
        behandlingstemaKode: hentBehandlingstemaKode(oppgave.behandlingstema || ''),
        behandlingstemaTerm: oppgave.behandlingstema || '',
        alternativer: [],
      },
    }
  }

  async alle() {
    return this.oppgaver.toArray()
  }
}
