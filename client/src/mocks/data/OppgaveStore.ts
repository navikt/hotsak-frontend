import { addBusinessDays, parseISO } from 'date-fns'
import Dexie, { Table } from 'dexie'

import { GjelderAlternativerResponse, OppgaveId, Oppgaveprioritet, Oppgavestatus, Oppgavetype, OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { Sakstype } from '../../types/types.internal'
import { enheter } from './enheter'
import { JournalpostStore } from './JournalpostStore'
import { LagretHjelpemiddelsak } from './lagSak.ts'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { SakStore } from './SakStore'
import { lagTilfeldigInteger } from './felles.ts'
import { hentMappe } from './mappe.ts'
import { hentBehandlingstemaKode, hentRandomBehandlingstema, hentRandomBehandlingstype } from './oppgaveGjelder.ts'

type LagretOppgave = OppgaveV2
type InsertOppgave = LagretOppgave

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
      const mappeId = lagTilfeldigInteger(0, 12).toString();
      const sakId = sak.sakId
      return {
        oppgaveId: `E-${sakId}`,
        oppgavetype: Oppgavetype.BEHANDLE_SAK,
        oppgavestatus: Oppgavestatus.OPPRETTET,
        tema: 'HJE',
        gjelder: sak.sakstype === Sakstype.SØKNAD ? 'Digital søknad' : 'Bestilling',
        beskrivelse:
          '--- 25.11.2024 13:13 (azure-token-generator) ---\nNok en test!\n\n--- 22.11.2024 13:27  (Z994377, 2970) ---\nTest.\nOppgaven er flyttet fra saksbehandler Z994377 til <ingen>\n\nSøknad om: terskeleliminator',
        prioritet: (sak as LagretHjelpemiddelsak)?.hast ? Oppgaveprioritet.HØY : Oppgaveprioritet.NORMAL,
        tildeltEnhet: sak.enhet,
        tildeltSaksbehandler: sak.saksbehandler,
        sakId: sakId,
        aktivDato: sak.opprettet,
        behandlesAvApplikasjon: 'HOTSAK',
        fristFerdigstillelse: addBusinessDays(parseISO(sak.opprettet), 14).toISOString(),
        opprettetTidspunkt: sak.opprettet,
        endretTidspunkt: sak.opprettet,
        fnr: sak.bruker.fnr,
        bruker: { fnr: sak.bruker.fnr, navn: sak.bruker.navn },
        versjon: 1,
        mappeId: mappeId,
        mappenavn: hentMappe(mappeId),
        behandlingstema: hentRandomBehandlingstema(),
        behandlingstype: hentRandomBehandlingstype(),
      }
    })

    const oppgaverFraJournalføringer: InsertOppgave[] = journalføringer.map((journalføring) => {
      const mappeId = lagTilfeldigInteger(0, 12).toString();
      const journalpostId = journalføring.journalpostId
      return {
        oppgaveId: `I-${journalpostId}`,
        oppgavetype: Oppgavetype.JOURNALFØRING,
        oppgavestatus: Oppgavestatus.OPPRETTET,
        tema: 'HJE',
        gjelder: 'Briller til barn',
        beskrivelse: journalføring.tittel,
        prioritet: Oppgaveprioritet.NORMAL,
        tildeltEnhet: enheter.agder,
        // tildeltSaksbehandler: journalføring.saksbehandler,
        aktivDato: journalføring.journalpostOpprettetTid,
        opprettetAv: 'hm-saksbehandling',
        opprettetAvEnhet: enheter.agder,
        journalpostId: journalpostId,
        fristFerdigstillelse: addBusinessDays(parseISO(journalføring.journalpostOpprettetTid), 14).toISOString(),
        opprettetTidspunkt: journalføring.journalpostOpprettetTid,
        endretTidspunkt: journalføring.journalpostOpprettetTid,
        fnr: journalføring.bruker!.fnr,
        bruker: { fnr: journalføring.bruker!.fnr, navn: journalføring.bruker!.navn! },
        versjon: 1,
        mappeId: mappeId,
        mappenavn: hentMappe(mappeId),
        behandlingstema: hentRandomBehandlingstema(),
        behandlingstype: hentRandomBehandlingstype(),
      }
    })

    return this.lagreAlle([...oppgaverFraSak, ...oppgaverFraJournalføringer])
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

  async hentGjelderInfo(oppgaveId: OppgaveId): Promise<{ behandlingstema: string, behandlingstype: string, alternativer: GjelderAlternativerResponse } | undefined> {
    console.log(`Henter gjelder-info for oppgaveId: ${oppgaveId}`)
    const oppgave = await this.oppgaver.get(oppgaveId)
    if (!oppgave) {
      return
    }
    return {
      behandlingstema: oppgave.behandlingstema || "",
      behandlingstype: oppgave.behandlingstype || "",
      alternativer: {
        behandlingstemaKode: hentBehandlingstemaKode(oppgave.behandlingstema || ""),
        behandlingstemaTerm: oppgave.behandlingstema || "",
        alternativer: [
          {
            behandlingstemaKode: "ab0013",
            behandlingstemaTerm: "Ortopediske hjelpemidler"
          },
          {
            behandlingstemaKode: "ab0253",
            behandlingstemaTerm: "Tinnitusmaskerer"
          },
          {
            behandlingstemaKode: "ab0315",
            behandlingstemaTerm: "Arbeids- og utdanningsreiser"
          },
          {
            behandlingstemaKode: "ab0332",
            behandlingstemaTerm: "Servicehund",
          },
          {
            behandlingstemaKode: "ab0369",
            behandlingstemaTerm: "Aktivitetshjelpemidler"
          }
        ]
      }
    }
  }

  async alle() {
    return this.oppgaver.toArray()
  }
}
