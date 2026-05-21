import { http, HttpResponse } from 'msw'

import type { InnloggetAnsatt } from '../../tilgang/Ansatt.ts'
import type { UtvidetAnsatt } from '../../tilgang/useAnsatt.ts'
import type { StoreHandlersFactory } from '../data'
import { delay, respondNoContent, respondUnauthorized } from './response.ts'

export const ansatteHandlers: StoreHandlersFactory = ({ saksbehandlerStore }) => [
  http.get<never, never, InnloggetAnsatt>('/api/ansatte/meg', async () => {
    await delay(75)
    const innloggetSaksbehandler = await saksbehandlerStore.innloggetSaksbehandler()
    if (TEST_401) {
      return respondUnauthorized()
    } else {
      return HttpResponse.json(innloggetSaksbehandler)
    }
  }),
  http.get<{ navIdent: string }, never, UtvidetAnsatt>('/api/ansatte/:navIdent', async ({ params }) => {
    await delay(75)
    const { navIdent } = params
    return HttpResponse.json({
      navIdent,
      fornavn: 'Silje',
      etternavn: 'Saksbehandler',
      epost: '',
      enhet: {
        nummer: '2970',
        navn: 'IT-avdelingen',
      },
    })
  }),
  http.post<never, { valgtEnhetsnummer: string }>('/api/ansatte/enhet', async ({ request }) => {
    const { valgtEnhetsnummer } = await request.json()
    await saksbehandlerStore.lagreValgtEnhetsnummer(valgtEnhetsnummer)
    return respondNoContent()
  }),
]

const TEST_401 = false
