import Dexie, { Table } from 'dexie'

import { Gruppe, InnloggetSaksbehandler } from '../../state/authentication'
import { UUID } from '../../types/types.internal'
import { lagUUID } from './felles'

function lagSaksbehandler(saksbehandler: Partial<InnloggetSaksbehandler>): InnloggetSaksbehandler {
  const id = lagUUID()
  return {
    id,
    objectId: id,
    navn: '',
    epost: '',
    navIdent: '',
    grupper: [Gruppe.HOTSAK_BRUKERE, Gruppe.BRILLEADMIN_BRUKERE],
    enheter: ['2970', '4710', '4711'],
    erInnlogget: true,
    ...saksbehandler,
  }
}

class SaksbehandlerStore extends Dexie {
  private readonly saksbehandlere!: Table<InnloggetSaksbehandler, UUID>

  constructor() {
    super('SaksbehandlerStore')
    if (!window.appSettings.USE_MSW) {
      return
    }
    this.version(1).stores({
      saksbehandlere: '++id',
    })
  }

  async populer() {
    const count = await this.saksbehandlere.count()
    if (count !== 0) {
      return []
    }
    return this.lagreAlle([
      lagSaksbehandler({
        navn: 'Silje Saksbehandler',
        epost: 'silje.saksbehandler@nav.no',
        navIdent: 'S112233',
        erInnlogget: true,
      }),
      lagSaksbehandler({
        navn: 'Vurderer Vilkårsen',
        epost: 'vurderer.vilkårsen@nav.no',
        navIdent: 'V998877',
        erInnlogget: false,
      }),
      lagSaksbehandler({
        navn: 'Journalfører Journalposten',
        epost: 'journalfører.journalposten@nav.no',
        navIdent: 'J123456',
        erInnlogget: false,
      }),
    ])
  }

  async lagreAlle(saksbehandlere: InnloggetSaksbehandler[]) {
    return this.saksbehandlere.bulkAdd(saksbehandlere, { allKeys: true })
  }

  async hent(id: UUID) {
    return this.saksbehandlere.get(id)
  }

  async alle() {
    return this.saksbehandlere.toArray()
  }

  async innloggetSaksbehandler(): Promise<InnloggetSaksbehandler> {
    return this.saksbehandlere.filter(({ erInnlogget }) => erInnlogget === true).first() as any // fixme
  }

  async byttInnloggetSaksbehandler(id: UUID) {
    return this.transaction('rw', this.saksbehandlere, async () => {
      await this.saksbehandlere.toCollection().modify({
        erInnlogget: false,
      })
      return this.saksbehandlere.update(id, {
        erInnlogget: true,
      })
    })
  }
}

export const saksbehandlerStore = new SaksbehandlerStore()
