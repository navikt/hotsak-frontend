import dayjs from 'dayjs'
import Dexie, { Table } from 'dexie'

import { OppgaveV2, Oppgavestatus, Oppgavetype } from '../../types/types.internal'
import { BarnebrillesakStore } from './BarnebrillesakStore'
import { IdGenerator } from './IdGenerator'
import { JournalpostStore } from './JournalpostStore'
import { SakStore } from './SakStore'

type LagretOppgave = OppgaveV2

export class OppgaveStore extends Dexie {
  private readonly oppgaver!: Table<LagretOppgave, string>

  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly sakStore: SakStore,
    private readonly barnebrilleSakStore: BarnebrillesakStore,
    private readonly journalpostStore: JournalpostStore
  ) {
    super('OppgaveStore')
    this.version(1).stores({
      oppgaver: 'oppgaveId',
      hendelser: '++id,oppgaveId',
    })
  }

  async populer() {
    console.log('PO', this.oppgaver)

    const count = await this.oppgaver.count()
    if (count !== 0) {
      return []
    }

    const saker = await this.sakStore.alle()
    const barnebrilleSaker = await this.barnebrilleSakStore.alle()
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
        frist: dayjs(sak.mottattDato).add(14, 'days').toISOString(),
        opprettet: sak.mottattDato,
        endret: sak.mottattDato,
        bruker: sak.bruker,
        innsender: sak.innsender,
      }
    })

    const oppgaverFraBarnebrillesak: OppgaveV2[] = barnebrilleSaker.map((brillesak) => {
      const opprettet = dayjs()
      return {
        id: this.idGenerator.nesteId().toString(),
        oppgavetype: Oppgavetype.BEHANDLE_SAK,
        oppgavestatus: Oppgavestatus.OPPRETTET,
        beskrivelse: brillesak.søknadGjelder,
        område: ['syn'],
        enhet: brillesak.enhet,
        kommune: brillesak.bruker.kommune,
        bydel: brillesak.bruker.bydel,
        saksbehandler: brillesak.saksbehandler,
        sakId: brillesak.sakId,
        frist: opprettet.add(14, 'days').toISOString(),
        opprettet: opprettet.toISOString(),
        endret: opprettet.toISOString(),
        bruker: brillesak.bruker,
        innsender: brillesak.innsender,
      }
    })

    const oppgaverFraJournalforinger: OppgaveV2[] = journalføringer.map((journalføring) => {
      return {
        id: this.idGenerator.nesteId().toString(),
        oppgavetype: Oppgavetype.JOURNALFØRING,
        oppgavestatus: Oppgavestatus.OPPRETTET,
        beskrivelse: journalføring.tittel,
        område: ['syn'],
        enhet: journalføring.enhet!,
        saksbehandler: journalføring.saksbehandler,
        journalpostId: journalføring.journalpostID,
        frist: dayjs(journalføring.journalpostOpprettetTid).add(14, 'days').toISOString(),
        opprettet: journalføring.journalpostOpprettetTid,
        endret: journalføring.journalpostOpprettetTid,
        bruker: { fnr: journalføring.bruker!.fnr, fulltNavn: journalføring.bruker!.fulltNavn },
        innsender: journalføring.innsender,
      }
    })

    return this.lagreAlle([...oppgaverFraSak, ...oppgaverFraBarnebrillesak, ...oppgaverFraJournalforinger])
  }

  async lagreAlle(oppgaver: LagretOppgave[]) {
    return this.oppgaver.bulkAdd(oppgaver, { allKeys: true })
  }

  async alle() {
    return this.oppgaver.toArray()
  }
}
