import Dexie, { Table } from 'dexie'

import {
  type FerdigstillNotatRequest,
  type Notat,
  NotatKlassifisering,
  NotatType,
  type OppdaterNotatRequest,
  type OpprettNotatRequest,
} from '../../sak/notat/notatTyper'
import { MålformType, Saksbehandler } from '../../types/types.internal.ts'
import { nåIso } from './felles.ts'
import { Saksbehandlere } from './Saksbehandlere.ts'
import { SakStore } from './SakStore'

type LagretNotat = Notat
type InsertNotat = Omit<LagretNotat, 'id'>

export class NotatStore extends Dexie {
  private readonly notater!: Table<LagretNotat, number, InsertNotat>

  constructor(private readonly sakStore: SakStore) {
    super('NotatStore')
    this.version(1).stores({
      notater: '++id,sakId',
    })
  }

  async populer() {
    const count = await this.notater.count()
    if (count !== 0) {
      return []
    }

    const saksbehandler = Saksbehandlere.innlogget()
    const alleSaker = await this.sakStore.alle()
    const notater = alleSaker.map(({ sakId }) => this.lagNotat(sakId, saksbehandler, NotatType.JOURNALFØRT))

    return this.notater.bulkAdd(notater, { allKeys: true })
  }

  async alle() {
    return this.notater.toArray()
  }

  async lagreUtkast(sakId: string, request: OpprettNotatRequest) {
    const saksbehandler = Saksbehandlere.innlogget()
    try {
      return await this.notater.add({
        sakId,
        saksbehandler,
        type: request.type,
        tittel: request.tittel || '',
        klassifisering: request.klassifisering,
        målform: MålformType.BOKMÅL,
        tekst: request.tekst || '',
        opprettet: nåIso(),
        oppdatert: nåIso(),
      })
    } catch (error) {
      console.error('Feil ved lagring av utkast:', error)
      throw error
    }
  }

  async ferdigstillNotat(notatId: ID, request: FerdigstillNotatRequest) {
    notatId = Number(notatId)
    this.notater.update(notatId, {
      ...request,
      ferdigstilt: nåIso(),
    })
    const notat = await this.hentNotat(notatId)
    if (notat.type === NotatType.JOURNALFØRT) {
      setTimeout(() => {
        console.log('Later som vi har fått melding fra Joark om at notatet er journalført')
        this.notater.update(notatId, {
          ...notat,
          journalpostId: '123456789',
          dokumentId: '987654321',
        })
      }, 5000)
    }
  }

  async oppdaterUtkast(notatId: ID, request: OppdaterNotatRequest) {
    notatId = Number(notatId)
    this.notater.update(notatId, {
      ...request,
      oppdatert: nåIso(),
    })
  }

  async slettNotat(notatId: ID) {
    notatId = Number(notatId)
    return this.notater.delete(notatId)
  }

  async hentNotat(notatId: ID) {
    notatId = Number(notatId)
    const notat = await this.notater.get(notatId)
    if (!notat) {
      throw new Error(`Fant ikke notat med notatId: ${notatId}`)
    }
    return notat
  }

  async hentNotater(sakId: string) {
    const notater = await this.notater.where('sakId').equals(sakId).sortBy('opprettet')
    return notater.reverse()
  }

  private lagNotat(sakId: string, saksbehandler: Saksbehandler, type: NotatType = NotatType.JOURNALFØRT): InsertNotat {
    return {
      sakId,
      saksbehandler,
      type,
      tittel: 'Tittel på notat',
      tekst: 'Innhold i notat. Masse tekst og greier her.',
      klassifisering: NotatKlassifisering.EKSTERNE_SAKSOPPLYSNINGER,
      opprettet: nåIso(),
      oppdatert: nåIso(),
      ferdigstilt: nåIso(),
      journalpostId: '123',
      dokumentId: '456',
      målform: MålformType.BOKMÅL,
    }
  }
}
