import { Gruppe, InnloggetSaksbehandler } from '../../state/authentication'

type ObjectId = string

export const saksbehandler1: ObjectId = '3fd4105e-09b8-4d9d-b61c-8ad46c63f819'
export const saksbehandler2: ObjectId = '09489277-985b-4503-902e-30decbbe9364'

export const innloggetSaksbehandler: Record<ObjectId, InnloggetSaksbehandler> = {
  s1: {
    id: saksbehandler1,
    objectId: saksbehandler1,
    navn: 'Silje Saksbehandler',
    epost: 'silje.saksbehandler@nav.no',
    navIdent: 'S112233',
    grupper: [Gruppe.HOTSAK_BRUKERE, Gruppe.BRILLEADMIN_BRUKERE],
    enheter: ['2970', '4710', '4711'],
  },
  s2: {
    id: saksbehandler2,
    objectId: saksbehandler2,
    navn: 'Behandler Vilkårsen',
    epost: 'behandler.vilkårsen@nav.no',
    navIdent: 'V998877',
    grupper: [Gruppe.HOTSAK_BRUKERE, Gruppe.BRILLEADMIN_BRUKERE],
    enheter: ['2970', '4710', '4711'],
  },
}
