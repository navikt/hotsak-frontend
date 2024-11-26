import Dexie, { Table } from 'dexie'

import { addBusinessDays, parseISO } from 'date-fns'
import { OppgaveApiOppgave, OppgavePrioritet } from '../../types/experimentalTypes'
import { Oppgavestatus, Oppgavetype, Sakstype } from '../../types/types.internal'
import { BarnebrillesakStore } from './BarnebrillesakStore'
import { IdGenerator } from './IdGenerator'
//import { JournalpostStore } from './JournalpostStore'
import { SakStore } from './SakStore'

type LagretOppgave = OppgaveApiOppgave

export class OppgaveStore extends Dexie {
  private readonly oppgaver!: Table<LagretOppgave, string>

  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly sakStore: SakStore,
    private readonly barnebrillesakStore: BarnebrillesakStore
    //private readonly journalpostStore: JournalpostStore
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
    const barnebrillesaker = await this.barnebrillesakStore.alle()
    //const journalføringer = await this.journalpostStore.alle()

    const oppgaverFraSak: OppgaveApiOppgave[] = saker.map((sak) => {
      return {
        oppgaveId: this.idGenerator.nesteId().toString(),
        oppgavetype: Oppgavetype.BEHANDLE_SAK,
        oppgavestatus: Oppgavestatus.OPPRETTET,
        tema: 'HJE',
        behandlingstema: sak.sakstype === Sakstype.SØKNAD ? 'Digital søknad' : null,
        behandlingstype: sak.sakstype === Sakstype.BESTILLING ? 'Bestilling' : null,
        beskrivelse: sak.søknadGjelder,
        prioritet: sak.hast ? OppgavePrioritet.HØY : OppgavePrioritet.NORMAL,
        tildeltEnhet: sak.enhet,
        tildeltSaksbehandler: sak.saksbehandler,
        opprettetAv: 'hm-saksbehandling',
        opprettetAvEnhet: sak.enhet,
        //endretAv: null,
        //endretAvEnhet: null,
        aktivDato: sak.opprettet,
        //journalpostId: null,
        behandlesAvApplikasjon: 'Hotsak',
        //mappeId: null,
        fristFerdigstillelse: addBusinessDays(parseISO(sak.opprettet), 14).toISOString(),
        opprettetTidspunkt: sak.opprettet,
        endretTidspunkt: sak.opprettet,
        //ferdigstiltTidspunkt: null,
        fnr: sak.bruker.fnr,
        bruker: { fnr: sak.bruker.fnr, navn: sak.bruker.navn },
        versjon: 1,
      }
    })

    const oppgaverFraBarnebrillesak: OppgaveApiOppgave[] = barnebrillesaker.map((sak) => {
      const now = new Date()

      return {
        oppgaveId: this.idGenerator.nesteId().toString(),
        oppgavetype: Oppgavetype.BEHANDLE_SAK,
        oppgavestatus: Oppgavestatus.OPPRETTET,
        tema: 'HJE',
        behandlingstema: 'Briller/linser',
        //behandlingstype: null,
        beskrivelse: sak.søknadGjelder,
        prioritet: OppgavePrioritet.NORMAL,
        tildeltEnhet: sak.enhet,
        tildeltSaksbehandler: sak.saksbehandler,
        opprettetAv: 'hm-saksbehandling',
        opprettetAvEnhet: sak.enhet,
        //endretAv: null,
        //endretAvEnhet: null,
        aktivDato: sak.opprettet,
        //journalpostId: null,
        behandlesAvApplikasjon: 'Hotsak',
        //mappeId: null,
        fristFerdigstillelse: addBusinessDays(parseISO(sak.opprettet), 14).toISOString(),
        opprettetTidspunkt: now.toISOString(),
        endretTidspunkt: now.toISOString(),
        //ferdigstiltTidspunkt: null,
        fnr: sak.bruker.fnr,
        bruker: { fnr: sak.bruker.fnr, navn: sak.bruker.navn },
        versjon: 1,
      }
    })

    /*const oppgaverFraJournalføringer: OppgaveV2[] = journalføringer.map((journalføring) => {
      return {
        id: this.idGenerator.nesteId().toString(),
        oppgavetype: Oppgavetype.JOURNALFØRING,
        oppgavestatus: Oppgavestatus.OPPRETTET,
        beskrivelse: journalføring.tittel,
        område: ['syn'],
        enhet: journalføring.enhet!,
        saksbehandler: journalføring.saksbehandler,
        journalpostId: journalføring.journalpostID,
        frist: addBusinessDays(parseISO(journalføring.journalpostOpprettetTid), 14).toISOString(),
        opprettet: journalføring.journalpostOpprettetTid,
        endret: journalføring.journalpostOpprettetTid,
        bruker: { fnr: journalføring.oppgave.bruker!.fnr, fulltNavn: journalføring.oppgave.bruker!.fulltNavn },
        innsender: journalføring.innsender,
      }
    })*/

    // TODO, ta med journalføringsoppgaver også på nytt format sånn at OppgaveV2 kan fases helt ut
    return this.lagreAlle([...oppgaverFraSak, ...oppgaverFraBarnebrillesak /*, ...oppgaverFraJournalføringer*/])
  }

  async lagreAlle(oppgaver: LagretOppgave[]) {
    return this.oppgaver.bulkAdd(oppgaver, { allKeys: true })
  }

  async alle() {
    return this.oppgaver.toArray()
  }
}
