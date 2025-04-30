import Dexie, { Table } from 'dexie'

import { Ansatt, Gruppe, InnloggetSaksbehandler, NavIdent } from '../../state/authentication'

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
    const saksbehandler = await this.saksbehandlere.get(id)
    if (!saksbehandler) {
      throw new Error('Ingen saksbehandler innlogget')
    }
    return saksbehandler
  }

  async ikkeInnloggetSaksbehandler(): Promise<Ansatt> {
    const id = this.getInnloggetSaksbehandlerId() || ''
    const arr = await this.saksbehandlere.toArray()
    const saksbehandler = arr.find((a) => a.id != id)
    if (!saksbehandler) {
      throw new Error('Ingen saksbehandler funnet')
    }
    return saksbehandler
  }

  async hentAnsatt(id: NavIdent): Promise<Ansatt> {
    const arr = await this.saksbehandlere.toArray()
    const saksbehandler = arr.find((a) => a.id != id)
    if (!saksbehandler) {
      throw new Error('Ingen saksbehandler funnet')
    }
    return saksbehandler
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
  const enheter = [
    { id: 'f62f3d31-84ca-4406-8a1e-e61a45141a4a', nummer: '2970', navn: 'IT-avdelingen', gjeldende: true },
    {
      id: '24cdeaa6-0929-4307-bde8-bc513d8d603a',
      nummer: '4710',
      navn: 'Nav hjelpemiddelsentral Agder',
      gjeldende: false,
    },
    {
      id: '82465442-7f35-41ed-beeb-c7742c8a0015',
      nummer: '4711',
      navn: 'Nav hjelpemiddelsentral Rogaland',
      gjeldende: false,
    },
  ]
  return {
    navn: '',
    epost: '',
    grupper: [Gruppe.HOTSAK_BRUKERE, Gruppe.HOTSAK_SAKSBEHANDLER, Gruppe.BRILLEADMIN_BRUKERE],
    enheter,
    gradering: [],
    enhetsnumre: enheter.map((enhet) => enhet.nummer),
    erInnlogget: true,
    ...saksbehandler,
  }
}
