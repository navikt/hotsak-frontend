import Dexie, { Table } from 'dexie'

import { AnsattGruppe, InnloggetAnsatt, NavIdent } from '../../tilgang/Ansatt.ts'

export class SaksbehandlerStore extends Dexie {
  private readonly sessionKey = 'innloggetSaksbehandlerId'
  private readonly saksbehandlere!: Table<InnloggetAnsatt, string>
  private readonly defaultSaksbehandler: InnloggetAnsatt = lagSaksbehandler({
    id: 'S112233',
    navn: 'Silje Saksbehandler',
    epost: 'silje.saksbehandler@nav.no',
  })

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
        lagSaksbehandler(this.defaultSaksbehandler),
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
          grupper: [AnsattGruppe.HOTSAK_BRUKERE, AnsattGruppe.HOTSAK_NASJONAL],
        }),
      ])
    }
    if (!this.getInnloggetSaksbehandlerId()) {
      // console.log('populer', this.defaultSaksbehandler, await this.alle())
      this.setInnloggetSaksbehandlerId(this.defaultSaksbehandler.id)
    }
    return
  }

  async lagreAlle(saksbehandlere: InnloggetAnsatt[]) {
    return this.saksbehandlere.bulkAdd(saksbehandlere, { allKeys: true })
  }

  async hent(id: NavIdent): Promise<InnloggetAnsatt> {
    const ansatt = await this.saksbehandlere.get(id)
    if (!ansatt) {
      throw Error(`Fant ikke ansatt med id: ${id}`)
    }
    return ansatt
  }

  async alle(): Promise<InnloggetAnsatt[]> {
    return this.saksbehandlere.toArray()
  }

  async innloggetSaksbehandler(): Promise<InnloggetAnsatt> {
    const id = this.getInnloggetSaksbehandlerId() || ''
    const saksbehandler = await this.saksbehandlere.get(id)
    if (!saksbehandler) {
      throw new Error('Ingen saksbehandler innlogget')
    }
    return saksbehandler
  }

  byttInnloggetSaksbehandler(id: NavIdent): void {
    this.setInnloggetSaksbehandlerId(id)
  }

  private getInnloggetSaksbehandlerId(): NavIdent | null {
    return sessionStorage.getItem(this.sessionKey)
  }

  private setInnloggetSaksbehandlerId(id: NavIdent): void {
    sessionStorage.setItem(this.sessionKey, id)
  }
}

function lagSaksbehandler(saksbehandler: Partial<InnloggetAnsatt> & { id: NavIdent }): InnloggetAnsatt {
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
    grupper: [AnsattGruppe.HOTSAK_BRUKERE, AnsattGruppe.HOTSAK_SAKSBEHANDLER, AnsattGruppe.BRILLEADMIN_BRUKERE],
    enheter,
    gjeldendeEnhet: enheter[0],
    gradering: [],
    enhetsnumre: enheter.map((enhet) => enhet.nummer),
    erInnlogget: true,
    ...saksbehandler,
  }
}
