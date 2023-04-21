import Dexie, { Table } from 'dexie'

import { Gruppe, InnloggetSaksbehandler } from '../../state/authentication'
import { UUID } from '../../types/types.internal'
import { lagUUID } from './felles'

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
    const s1 = lagUUID()
    const s2 = lagUUID()
    const s3 = lagUUID()
    return Promise.all([
      this.lagre({
        id: s1,
        objectId: s1,
        navn: 'Silje Saksbehandler',
        epost: 'silje.saksbehandler@nav.no',
        navIdent: 'S112233',
        grupper: [Gruppe.HOTSAK_BRUKERE, Gruppe.BRILLEADMIN_BRUKERE],
        enheter: ['2970', '4710', '4711'],
        erInnlogget: true,
      }),
      this.lagre({
        id: s2,
        objectId: s2,
        navn: 'Vurderer Vilkårsen',
        epost: 'vurderer.vilkårsen@nav.no',
        navIdent: 'V998877',
        grupper: [Gruppe.HOTSAK_BRUKERE, Gruppe.BRILLEADMIN_BRUKERE],
        enheter: ['2970', '4710', '4711'],
        erInnlogget: false,
      }),
      this.lagre({
        id: s3,
        objectId: s3,
        navn: 'Journalfører Journalposten',
        epost: 'journalfører.journalposten@nav.no',
        navIdent: 'J123456',
        grupper: [Gruppe.HOTSAK_BRUKERE, Gruppe.BRILLEADMIN_BRUKERE],
        enheter: ['2970', '4710', '4711'],
        erInnlogget: false,
      }),
    ])
  }

  async lagre(saksbehandler: InnloggetSaksbehandler) {
    return this.saksbehandlere.add(saksbehandler, saksbehandler.id)
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
