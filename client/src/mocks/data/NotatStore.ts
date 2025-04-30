import Dexie, { Table } from 'dexie'

import {
  FerdigstillNotatRequest,
  MålformType,
  Notat,
  NotatType,
  NotatUtkast,
  Saksbehandler,
} from '../../types/types.internal'
import { SaksbehandlerStore } from './SaksbehandlerStore'
import { IdGenerator } from './IdGenerator'
import { SakStore } from './SakStore'

function lagNotat(
  id: number,
  { sakId, type, saksbehandler }: { sakId: string; type: NotatType; saksbehandler: Saksbehandler }
): Notat {
  return {
    id: id.toString(),
    sakId,
    saksbehandler,
    type,
    journalpostId: '123',
    dokumentId: '456',
    tittel: 'Tittel på notat',
    målform: MålformType.BOKMÅL,
    tekst: 'Innhold i notat. Masse tekst og greier her.',
    opprettet: new Date().toISOString(),
    ferdigstilt: new Date().toISOString(),
  }
}

export class NotatStore extends Dexie {
  private readonly notater!: Table<Omit<Notat, 'id'>, number>

  constructor(
    private readonly idGenerator: IdGenerator,
    private readonly saksbehandlerStore: SaksbehandlerStore,
    private readonly sakStore: SakStore
  ) {
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

    const lagNotatMedId = (sakId: string, type: NotatType) =>
      lagNotat(this.idGenerator.nesteId(), { sakId, saksbehandler, type })

    const saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    const alleSaker = (await this.sakStore.alle()).map((sak) => sak.sakId)
    const notater = alleSaker.map((sakId) => lagNotatMedId(sakId, NotatType.JOURNALFØRT))

    this.notater.bulkAdd(notater, { allKeys: true })
  }

  async alle() {
    return this.notater.toArray()
  }

  async lagreUtkast(sakId: string, utkast: NotatUtkast) {
    const saksbehandler = await this.saksbehandlerStore.innloggetSaksbehandler()
    return this.notater.add({
      sakId,
      saksbehandler,
      type: utkast.type,
      tittel: utkast.tittel || '',
      målform: MålformType.BOKMÅL,
      tekst: utkast.tekst || '',
      opprettet: new Date().toISOString(),
    })
  }

  async ferdigstillNotat(notatId: number, payload: FerdigstillNotatRequest) {
    const notat = await this.notater.get(notatId)
    if (!notat) {
      throw new Error(`Notat med id ${notatId} finnes ikke`)
    }

    this.notater.update(notatId, {
      ...notat,
      type: payload.type,
      tittel: payload.tittel,
      tekst: payload.tekst,
      ferdigstilt: new Date().toISOString(),
    })

    if (payload.type === NotatType.JOURNALFØRT) {
      setTimeout(() => {
        console.log('Later som vi har fått melding fra joark om at notatet er journalført')
        this.notater.update(notatId, {
          ...notat,
          journalpostId: '123',
          dokumentId: '456',
        })
      }, 5000)
    }
  }

  async oppdaterUtkast(sakId: string, notatId: number, utkast: NotatUtkast) {
    const notat = await this.notater.where({ sakId, id: notatId }).first()
    this.notater.update(notatId, { ...notat, tittel: utkast.tittel, tekst: utkast.tekst })
  }

  async slettNotat(notatId: number) {
    return this.notater.delete(notatId)
  }

  async hentNotater(sakId: string) {
    return (await this.notater.where('sakId').equals(sakId).sortBy('opprettet')).reverse() || []
  }
}
