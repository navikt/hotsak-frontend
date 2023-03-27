import { rest } from 'msw'

const tilgangHandlers = [
  rest.get('/api/tilgang', (req, res, ctx) => {
    return res(
      ctx.delay(250),
      ctx.status(200),
      ctx.json({
        id: '3fd4105e-09b8-4d9d-b61c-8ad46c63f819',
        objectId: '3fd4105e-09b8-4d9d-b61c-8ad46c63f819',
        navn: 'Silje Saksbehandler',
        epost: 'silje.saksbehandler@nav.no',
        navIdent: 'S112233',
        grupper: ['HOTSAK_BRUKERE', 'BRILLEADMIN_BRUKERE'],
        enheter: ['2970', '4710', '4711'],
      })
    )
  }),
]

export default tilgangHandlers
