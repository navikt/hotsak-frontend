import { AnsattGruppe, type InnloggetAnsatt, type NavIdent } from '../../tilgang/Ansatt.ts'

export class Saksbehandlere {
  private static readonly innloggetAnsattKey = 'innloggetAnsatt'
  private static readonly valgtEnhetKey = 'valgtEnhet'

  static readonly default: InnloggetAnsatt = lagSaksbehandler({
    id: 'S112233',
    navn: 'Silje Saksbehandler',
    epost: 'silje.saksbehandler@nav.no',
  })
  static readonly byNavIdent: Readonly<Record<NavIdent, InnloggetAnsatt>> = {
    S112233: Saksbehandlere.default,
    V998877: lagSaksbehandler({
      id: 'V998877',
      navn: 'Vurderer Vilkårsen',
      epost: 'vurderer.vilkårsen@nav.no',
    }),
    J123456: lagSaksbehandler({
      id: 'J123456',
      navn: 'Journalfører Journalposten',
      epost: 'journalfører.journalposten@nav.no',
    }),
    V123456: lagSaksbehandler({
      id: 'V123456',
      navn: 'Lese Visningsrud',
      epost: 'lese.visningsrud@nav.no',
      grupper: [AnsattGruppe.HOTSAK_BRUKERE, AnsattGruppe.HOTSAK_NASJONAL],
    }),
  }

  static alle(): ReadonlyArray<Readonly<InnloggetAnsatt>> {
    return Object.values(Saksbehandlere.byNavIdent)
  }

  static innlogget(): Readonly<InnloggetAnsatt> {
    const fallback = () => Saksbehandlere.medGjeldendeEnhet(Saksbehandlere.default)
    const id = Saksbehandlere.getInnloggetId()
    if (!id) {
      return fallback()
    }
    const ansatt = Saksbehandlere.byNavIdent[id]
    if (ansatt) {
      return Saksbehandlere.medGjeldendeEnhet(ansatt)
    }
    return fallback()
  }

  static hent(id: NavIdent): Readonly<InnloggetAnsatt> {
    const ansatt = Saksbehandlere.byNavIdent[id]
    if (!ansatt) {
      throw Error(`Fant ikke ansatt med id: ${id}`)
    }
    return Saksbehandlere.medGjeldendeEnhet(ansatt)
  }

  private static medGjeldendeEnhet(ansatt: Readonly<InnloggetAnsatt>): Readonly<InnloggetAnsatt> {
    const valgtEnhet = Saksbehandlere.getValgtEnhet()
    if (!valgtEnhet) {
      return ansatt
    }
    const gjeldendeEnhet = ansatt.enheter.find((enhet) => enhet.nummer === valgtEnhet)
    if (!gjeldendeEnhet) {
      return ansatt
    }
    return {
      ...ansatt,
      gjeldendeEnhet,
    }
  }

  static getInnloggetId(): NavIdent | null {
    if (!window.sessionStorage) {
      return null
    }
    return sessionStorage.getItem(Saksbehandlere.innloggetAnsattKey)
  }

  static setInnloggetId(id: NavIdent): void {
    if (!window.sessionStorage) {
      return
    }
    sessionStorage.setItem(Saksbehandlere.innloggetAnsattKey, id)
  }

  static getValgtEnhet(): string | null {
    if (!window.sessionStorage) {
      return null
    }
    return sessionStorage.getItem(Saksbehandlere.valgtEnhetKey)
  }

  static setValgtEnhet(nummer: string) {
    if (!window.sessionStorage) {
      return
    }
    sessionStorage.setItem(Saksbehandlere.valgtEnhetKey, nummer)
  }
}

function lagSaksbehandler(saksbehandler: Partial<InnloggetAnsatt> & { id: NavIdent }): Readonly<InnloggetAnsatt> {
  const enheter = [
    { nummer: '2970', navn: 'IT-avdelingen' },
    {
      nummer: '4710',
      navn: 'Nav hjelpemiddelsentral Agder',
    },
    {
      nummer: '4711',
      navn: 'Nav hjelpemiddelsentral Rogaland',
    },
    {
      nummer: '4715',
      navn: 'Nav hjelpemiddelsentral Møre og Romsdal',
    },
    {
      nummer: '4716',
      navn: 'Nav hjelpemiddelsentral Trøndelag',
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
