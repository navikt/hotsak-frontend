import Dexie, { Table } from 'dexie'

import { Gruppe, InnloggetSaksbehandler, NavIdent } from '../../state/authentication'

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
          id: 'S112233',
          navn: 'Silje Saksbehandler',
          epost: 'silje.saksbehandler@nav.no',
        }),
        lagSaksbehandler({
          id: 'V998877',
          navn: 'Vurderer Vilkårsen',
          epost: 'vurderer.vilkårsen@nav.no',
        }),
        lagSaksbehandler({
          id: 'J123456',
          navn: 'Journalfører Journalposten',
          epost: 'journalfører.journalposten@nav.no',
        }),
        lagSaksbehandler({
          id: 'V123456',
          navn: 'Les Visningrud',
          epost: 'les.visningrud@nav.no',
          grupper: [Gruppe.HOTSAK_BRUKERE, Gruppe.HOTSAK_NASJONAL],
        }),
      ])
    }
    if (!this.getInnloggetSaksbehandlerId()) {
      const saksbehandlere = await this.saksbehandlere.toArray()

      const [initiellSaksbehandler] = await saksbehandlere.filter((s) => s.navn === 'Silje Saksbehandler')

      console.log('populer', initiellSaksbehandler, this.saksbehandlere.toArray())

      this.setInnloggetSaksbehandlerId(initiellSaksbehandler.id)
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

function lagSaksbehandler(saksbehandler: Partial<InnloggetSaksbehandler> & { id: NavIdent }): InnloggetSaksbehandler {
  return {
    navn: '',
    epost: '',
    grupper: [Gruppe.HOTSAK_BRUKERE, Gruppe.BRILLEADMIN_BRUKERE, Gruppe.HOTSAK_SAKSBEHANDLER],
    enhetsnumre: ['2970', '4710', '4711'],
    erInnlogget: true,
    ...saksbehandler,
  }
}
