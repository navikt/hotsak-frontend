import Dexie, { Table } from 'dexie'

import { Gruppe, InnloggetSaksbehandler } from '../../state/authentication'
import { lagUUID } from './felles'

export class SaksbehandlerStore extends Dexie {
  private readonly sessionKey = 'innloggetSaksbehandlerId'
  private readonly saksbehandlere!: Table<InnloggetSaksbehandler, string>

  constructor() {
    super('SaksbehandlerStore')
    this.version(1).stores({
      saksbehandlere: 'id',
    })
  }

  async populer() {
    const count = await this.saksbehandlere.count()
    if (count === 0) {
      sessionStorage.removeItem(this.sessionKey)
      await this.lagreAlle([
        lagSaksbehandler({
          navn: 'Silje Saksbehandler',
          epost: 'silje.saksbehandler@nav.no',
          navIdent: 'S112233',
        }),
        lagSaksbehandler({
          navn: 'Vurderer Vilkårsen',
          epost: 'vurderer.vilkårsen@nav.no',
          navIdent: 'V998877',
        }),
        lagSaksbehandler({
          navn: 'Journalfører Journalposten',
          epost: 'journalfører.journalposten@nav.no',
          navIdent: 'J123456',
        }),
      ])
    }
    if (!this.getInnloggetSaksbehandlerId()) {
      const [saksbehandler] = await this.saksbehandlere.toArray()
      this.setInnloggetSaksbehandlerId(saksbehandler.id)
    }
    return
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
    const id = this.getInnloggetSaksbehandlerId() || ''
    return this.saksbehandlere.get(id) as any // fixme
  }

  async ikkeInnloggetSaksbehandler(): Promise<InnloggetSaksbehandler> {
    const id = this.getInnloggetSaksbehandlerId() || ''
    const arr = await this.saksbehandlere.toArray()
    return arr.find((a) => a.id != id) as any // fixme
  }

  byttInnloggetSaksbehandler(id: string) {
    this.setInnloggetSaksbehandlerId(id)
  }

  private getInnloggetSaksbehandlerId(): string | null {
    return sessionStorage.getItem(this.sessionKey)
  }

  private setInnloggetSaksbehandlerId(id: string): void {
    sessionStorage.setItem(this.sessionKey, id)
  }
}

function lagSaksbehandler(saksbehandler: Partial<InnloggetSaksbehandler>): InnloggetSaksbehandler {
  const id = lagUUID()
  return {
    id,
    navn: '',
    epost: '',
    navIdent: '',
    grupper: [Gruppe.HOTSAK_BRUKERE, Gruppe.BRILLEADMIN_BRUKERE],
    enhetsnumre: ['2970', '4710', '4711'],
    erInnlogget: true,
    ...saksbehandler,
  }
}
