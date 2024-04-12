import Dexie, { Table } from 'dexie'

import { Oppgavestatus, Oppgavetype, OppgaveV2 } from '../../types/types.internal'
import { BarnebrillesakStore } from './BarnebrillesakStore'
import { IdGenerator } from './IdGenerator'
import { JournalpostStore } from './JournalpostStore'
import { SakStore } from './SakStore'
import { addBusinessDays, parseISO } from 'date-fns'

type LagretOppgave = OppgaveV2

export class OppgaveStore extends Dexie {
  private readonly oppgaver!: Table<LagretOppgave, string>

  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly sakStore: SakStore,
    private readonly barnebrillesakStore: BarnebrillesakStore,
    private readonly journalpostStore: JournalpostStore
  ) {
    super('OppgaveStore')
    this.version(1).stores({
      oppgaver: 'id',
    })
  }

  async populer() {
    const count = await this.oppgaver.count()
    if (count !== 0) {
      return []
    }

    const saker = await this.sakStore.alle()
    const barnebrillesaker = await this.barnebrillesakStore.alle()
    const journalføringer = await this.journalpostStore.alle()

    const oppgaverFraSak: OppgaveV2[] = saker.map((sak) => {
      return {
        id: this.idGenerator.nesteId().toString(),
        oppgavetype: Oppgavetype.BEHANDLE_SAK,
        oppgavestatus: Oppgavestatus.OPPRETTET,
        beskrivelse: sak.søknadGjelder,
        område: sak.personinformasjon.funksjonsnedsettelser,
        enhet: sak.enhet,
        kommune: sak.bruker.kommune,
        bydel: sak.bruker.bydel,
        saksbehandler: sak.saksbehandler,
        sakId: sak.sakId,
        frist: addBusinessDays(parseISO(sak.mottattDato), 14).toISOString(),
        opprettet: sak.mottattDato,
        endret: sak.mottattDato,
        bruker: sak.bruker,
        innsender: sak.innsender,
      }
    })

    const oppgaverFraBarnebrillesak: OppgaveV2[] = barnebrillesaker.map((sak) => {
      const now = new Date()
      return {
        id: this.idGenerator.nesteId().toString(),
        oppgavetype: Oppgavetype.BEHANDLE_SAK,
        oppgavestatus: Oppgavestatus.OPPRETTET,
        beskrivelse: sak.søknadGjelder,
        område: ['syn'],
        enhet: sak.enhet,
        kommune: sak.bruker.kommune,
        bydel: sak.bruker.bydel,
        saksbehandler: sak.saksbehandler,
        sakId: sak.sakId,
        frist: addBusinessDays(now, 14).toISOString(),
        opprettet: now.toISOString(),
        endret: now.toISOString(),
        bruker: sak.bruker,
        innsender: sak.innsender,
      }
    })

    const oppgaverFraJournalføringer: OppgaveV2[] = journalføringer.map((journalføring) => {
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
    })

    return this.lagreAlle([...oppgaverFraSak, ...oppgaverFraBarnebrillesak, ...oppgaverFraJournalføringer])
  }

  async lagreAlle(oppgaver: LagretOppgave[]) {
    return this.oppgaver.bulkAdd(oppgaver, { allKeys: true })
  }

  async alle() {
    return this.oppgaver.toArray()
  }
}
