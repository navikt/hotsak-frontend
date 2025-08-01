import Dexie, { Table } from 'dexie'

import { addBusinessDays, parseISO } from 'date-fns'
import {
  OppgaveApiOppgave,
  OppgaveId,
  OppgavePrioritet,
  Oppgavestatus,
  Oppgavetype,
} from '../../oppgave/oppgaveTypes.ts'
import { Sakstype } from '../../types/types.internal'
import { enheter } from './enheter'
import { JournalpostStore } from './JournalpostStore'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { SakStore } from './SakStore'
import { LagretHjelpemiddelsak } from './lagSak.ts'

type LagretOppgave = OppgaveApiOppgave
type InsertOppgave = Omit<LagretOppgave, 'oppgaveId'>

export class OppgaveStore extends Dexie {
  private readonly oppgaver!: Table<LagretOppgave, OppgaveId, InsertOppgave>

  constructor(
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

    const saker = await this.sakStore.alle()
    const journalføringer = await this.journalpostStore.alle()

    const oppgaverFraSak: InsertOppgave[] = saker.map((sak) => {
      return {
        oppgavetype: Oppgavetype.BEHANDLE_SAK,
        oppgavestatus: Oppgavestatus.OPPRETTET,
        tema: 'HJE',
        gjelder: sak.sakstype === Sakstype.SØKNAD ? 'Digital søknad' : 'Bestilling',
        beskrivelse:
          '--- 25.11.2024 13:13 (azure-token-generator) ---\nNok en test!\n\n--- 22.11.2024 13:27  (Z994377, 2970) ---\nTest.\nOppgaven er flyttet fra saksbehandler Z994377 til <ingen>\n\nSøknad om: terskeleliminator',
        prioritet: (sak as LagretHjelpemiddelsak)?.hast ? OppgavePrioritet.HØY : OppgavePrioritet.NORMAL,
        tildeltEnhet: sak.enhet,
        tildeltSaksbehandler: sak.saksbehandler,
        opprettetAv: 'hm-saksbehandling',
        opprettetAvEnhet: sak.enhet,
        sakId: sak.sakId,
        // endretAv: null,
        // endretAvEnhet: null,
        aktivDato: sak.opprettet,
        // journalpostId: null,
        behandlesAvApplikasjon: 'Hotsak',
        // mappeId: null,
        fristFerdigstillelse: addBusinessDays(parseISO(sak.opprettet), 14).toISOString(),
        opprettetTidspunkt: sak.opprettet,
        endretTidspunkt: sak.opprettet,
        // ferdigstiltTidspunkt: null,
        fnr: sak.bruker.fnr,
        bruker: { fnr: sak.bruker.fnr, navn: sak.bruker.navn },
        versjon: 1,
      }
    })

    const oppgaverFraJournalføringer: InsertOppgave[] = journalføringer.map((journalføring) => {
      return {
        oppgavetype: Oppgavetype.JOURNALFØRING,
        oppgavestatus: Oppgavestatus.OPPRETTET,
        tema: 'HJE',
        gjelder: 'Briller/linser',
        beskrivelse: journalføring.tittel,
        prioritet: OppgavePrioritet.NORMAL,
        // område: ['syn'],
        tildeltEnhet: enheter.agder,
        // tildeltSaksbehandler: journalføring.saksbehandler,
        aktivDato: journalføring.journalpostOpprettetTid,
        opprettetAv: 'hm-saksbehandling',
        opprettetAvEnhet: enheter.agder,
        journalpostId: journalføring.journalpostId,
        fristFerdigstillelse: addBusinessDays(parseISO(journalføring.journalpostOpprettetTid), 14).toISOString(),
        opprettetTidspunkt: journalføring.journalpostOpprettetTid,
        endretTidspunkt: journalføring.journalpostOpprettetTid,
        fnr: journalføring.bruker!.fnr,
        bruker: { fnr: journalføring.bruker!.fnr, navn: journalføring.bruker!.navn! },
        versjon: 1,
      }
    })

    return this.lagreAlle([...oppgaverFraSak, ...oppgaverFraJournalføringer])
  }

  async lagreAlle(oppgaver: InsertOppgave[]) {
    return this.oppgaver.bulkAdd(oppgaver, { allKeys: true })
  }

  async hent(oppgaveId: OppgaveId): Promise<OppgaveApiOppgave | undefined> {
    const oppgave = await this.oppgaver.get(oppgaveId)
    if (!oppgave) {
      return
    }
    return oppgave
  }

  async finnOppgaveForJournalpostId(journalpostId: string): Promise<OppgaveApiOppgave | undefined> {
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

  async alle() {
    return this.oppgaver.toArray()
  }
}
