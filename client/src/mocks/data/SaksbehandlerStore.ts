import Dexie, { Table } from 'dexie'

import { Gruppe, InnloggetSaksbehandler } from '../../state/authentication'
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
    ...saksbehandler,
  }
}

export class SaksbehandlerStore extends Dexie {
  private readonly saksbehandlere!: Table<InnloggetSaksbehandler, string>

  constructor() {
    super('SaksbehandlerStore')
    this.version(1).stores({
      saksbehandlere: 'id',
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

  async hent(id: string) {
    return this.saksbehandlere.get(id)
  }

  async alle() {
    return this.saksbehandlere.toArray()
  }

  async innloggetSaksbehandler(): Promise<InnloggetSaksbehandler> {
    const innloggetSaksbehandler = await this.saksbehandlere.filter(({ erInnlogget }) => erInnlogget === true).first()
    if (!innloggetSaksbehandler) {
      throw new Error('Fant ingen saksbehandler med erInnlogget = true')
    }
    return innloggetSaksbehandler
  }

  async byttInnloggetSaksbehandler(id: string) {
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
