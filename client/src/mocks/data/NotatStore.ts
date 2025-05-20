import Dexie, { Table } from 'dexie'

import {
  FerdigstillNotatRequest,
  MålformType,
  Notat,
  NotatKlassifisering,
  NotatType,
  NotatUtkast,
  Saksbehandler,
} from '../../types/types.internal'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { SakStore } from './SakStore'
import { nåIso } from './felles.ts'

type LagretNotat = Notat
type InsertNotat = Omit<LagretNotat, 'id'>

export class NotatStore extends Dexie {
  private readonly notater!: Table<LagretNotat, string, InsertNotat>

  constructor(
    private readonly saksbehandlerStore: SaksbehandlerStore,
    private readonly sakStore: SakStore
  ) {
    super('NotatStore')
    this.version(1).stores({
      notater: 'id,sakId',
    })
  }

  async populer() {
    const count = await this.notater.count()
    if (count !== 0) {
      return []
    }

    const saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    const alleSaker = await this.sakStore.alle()
    const notater = alleSaker.map(({ sakId }) => this.lagNotat(sakId, saksbehandler, NotatType.JOURNALFØRT))

    return this.notater.bulkAdd(notater, { allKeys: true })
  }

  async alle() {
    return this.notater.toArray()
  }

  async lagreUtkast(sakId: string, utkast: NotatUtkast) {
    const saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    try {
      return await this.notater.add({
        sakId,
        saksbehandler,
        type: utkast.type,
        tittel: utkast.tittel || '',
        klassifisering: utkast.klassifisering,
        målform: MålformType.BOKMÅL,
        tekst: utkast.tekst || '',
        opprettet: nåIso(),
        oppdatert: nåIso(),
      })
    } catch (error) {
      console.error('Feil ved lagring av utkast:', error)
      throw error
    }
  }

  async ferdigstillNotat(notatId: string, payload: FerdigstillNotatRequest) {
    const notat = await this.notater.get(notatId)
    if (!notat) {
      throw new Error(`Notat med id: ${notatId} finnes ikke`)
    }

    this.notater.update(notatId, {
      ...notat,
      type: payload.type,
      tittel: payload.tittel,
      tekst: payload.tekst,
      klassifisering: payload.klassifisering,

      ferdigstilt: nåIso(),
    })

    if (payload.type === NotatType.JOURNALFØRT) {
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

  async oppdaterUtkast(sakId: string, notatId: string, utkast: NotatUtkast) {
    const notat = await this.notater.where({ sakId, id: notatId }).first()
    this.notater.update(notatId, {
      ...notat,
      tittel: utkast.tittel,
      tekst: utkast.tekst,
      klassifisering: utkast.klassifisering,
      oppdatert: nåIso(),
    })
  }

  async slettNotat(notatId: string) {
    return this.notater.delete(notatId)
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
